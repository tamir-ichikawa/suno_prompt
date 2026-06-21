const DATA_URL = "data/prompts-index.min.json";
const CATALOG_URL = "data/catalog.json";
const PAGE_SIZE = 60;

const state = {
  catalog: null,
  prompts: [],
  filtered: [],
  visibleCount: PAGE_SIZE,
};

const els = {};

document.addEventListener("DOMContentLoaded", init);

async function init() {
  cacheElements();
  bindEvents();

  try {
    const [catalog, prompts] = await Promise.all([fetchJson(CATALOG_URL), fetchJson(DATA_URL)]);
    state.catalog = catalog;
    state.prompts = prompts;
    renderStats();
    populateCollectionControls();
    updateCategoryOptions();
    updateTagOptions();
    applyFilters();
  } catch (error) {
    els.resultTitle.textContent = "データを読み込めませんでした";
    els.emptyState.hidden = false;
    els.emptyState.textContent = "ローカルサーバー経由で開いてください。";
    console.error(error);
  }
}

function cacheElements() {
  [
    "statPrompts",
    "statCollections",
    "searchInput",
    "collectionFilter",
    "categoryFilter",
    "tagFilter",
    "bpmMin",
    "bpmMax",
    "grooveMin",
    "grooveOutput",
    "energyMin",
    "energyOutput",
    "publicOnly",
    "topOnly",
    "sortSelect",
    "clearFilters",
    "resultTitle",
    "activeChips",
    "collectionTabs",
    "promptGrid",
    "emptyState",
    "loadMore",
    "promptDialog",
    "dialogContent",
    "toast",
  ].forEach((id) => {
    els[id] = document.getElementById(id);
  });
}

function bindEvents() {
  [
    "searchInput",
    "categoryFilter",
    "tagFilter",
    "bpmMin",
    "bpmMax",
    "grooveMin",
    "energyMin",
    "publicOnly",
    "topOnly",
    "sortSelect",
  ].forEach((id) => {
    els[id].addEventListener("input", () => {
      if (id === "grooveMin") els.grooveOutput.value = `${els.grooveMin.value}+`;
      if (id === "energyMin") els.energyOutput.value = `${els.energyMin.value}+`;
      state.visibleCount = PAGE_SIZE;
      if (id === "categoryFilter") updateTagOptions();
      applyFilters();
    });
  });

  els.collectionFilter.addEventListener("input", () => {
    state.visibleCount = PAGE_SIZE;
    updateCategoryOptions();
    updateTagOptions();
    renderCollectionTabs();
    applyFilters();
  });

  els.clearFilters.addEventListener("click", clearFilters);
  els.loadMore.addEventListener("click", () => {
    state.visibleCount += PAGE_SIZE;
    renderPromptGrid();
  });

  els.collectionTabs.addEventListener("click", (event) => {
    const button = event.target.closest("[data-collection]");
    if (!button) return;
    els.collectionFilter.value = button.dataset.collection;
    state.visibleCount = PAGE_SIZE;
    updateCategoryOptions();
    updateTagOptions();
    renderCollectionTabs();
    applyFilters();
  });

  els.promptGrid.addEventListener("click", handlePromptAction);
  els.dialogContent.addEventListener("click", handlePromptAction);
}

async function fetchJson(url) {
  const response = await fetch(url, { cache: "default" });
  if (!response.ok) throw new Error(`Failed to load ${url}: ${response.status}`);
  return response.json();
}

function renderStats() {
  els.statPrompts.textContent = state.catalog.prompt_count.toLocaleString("ja-JP");
  els.statCollections.textContent = state.catalog.collections.length.toLocaleString("ja-JP");
}

function populateCollectionControls() {
  const options = [
    `<option value="all">すべて</option>`,
    ...state.catalog.collections.map(
      (collection) =>
        `<option value="${escapeHtml(collection.id)}">${escapeHtml(collection.version)} / ${escapeHtml(collection.label)}</option>`
    ),
  ];
  els.collectionFilter.innerHTML = options.join("");
  renderCollectionTabs();
}

function renderCollectionTabs() {
  const current = els.collectionFilter.value || "all";
  const tabs = [
    { id: "all", label: "すべて", count: state.catalog.prompt_count },
    ...state.catalog.collections.map((collection) => ({
      id: collection.id,
      label: `${collection.version} ${collection.label}`,
      count: collection.prompt_count,
    })),
  ];

  els.collectionTabs.innerHTML = tabs
    .map(
      (tab) =>
        `<button class="tab-button" type="button" data-collection="${escapeHtml(tab.id)}" aria-pressed="${
          tab.id === current
        }">${escapeHtml(tab.label)} <span>${tab.count}</span></button>`
    )
    .join("");
}

function updateCategoryOptions() {
  const collection = els.collectionFilter.value || "all";
  const selected = els.categoryFilter.value;
  const categories = state.catalog.categories.filter((category) => collection === "all" || category.collection === collection);
  const options = [
    `<option value="all">すべて</option>`,
    ...categories.map(
      (category) =>
        `<option value="${escapeHtml(category.id)}">${escapeHtml(category.collection_label)} / ${escapeHtml(
          category.name
        )} (${category.count})</option>`
    ),
  ];
  els.categoryFilter.innerHTML = options.join("");
  els.categoryFilter.value = [...els.categoryFilter.options].some((option) => option.value === selected) ? selected : "all";
}

function updateTagOptions() {
  const scoped = promptsInCurrentScope();
  const counts = new Map();
  scoped.forEach((prompt) => {
    prompt.tags.forEach((tag) => counts.set(tag, (counts.get(tag) || 0) + 1));
  });
  const selected = els.tagFilter.value;
  const tags = [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).slice(0, 250);

  els.tagFilter.innerHTML = [
    `<option value="all">すべて</option>`,
    ...tags.map(([tag, count]) => `<option value="${escapeHtml(tag)}">${escapeHtml(tag)} (${count})</option>`),
  ].join("");
  els.tagFilter.value = [...els.tagFilter.options].some((option) => option.value === selected) ? selected : "all";
}

function promptsInCurrentScope() {
  const collection = els.collectionFilter.value || "all";
  const category = els.categoryFilter.value || "all";
  return state.prompts.filter((prompt) => {
    if (collection !== "all" && prompt.collection !== collection) return false;
    if (category !== "all") {
      const [categoryCollection, categorySlug] = category.split(":");
      if (prompt.collection !== categoryCollection || prompt.category_slug !== categorySlug) return false;
    }
    return true;
  });
}

function applyFilters() {
  const filters = readFilters();
  const filtered = state.prompts.filter((prompt) => matchesFilters(prompt, filters));
  state.filtered = sortPrompts(filtered, filters.sort);
  renderPromptGrid();
  renderActiveChips(filters);
}

function readFilters() {
  return {
    query: els.searchInput.value.trim().toLowerCase(),
    collection: els.collectionFilter.value || "all",
    category: els.categoryFilter.value || "all",
    tag: els.tagFilter.value || "all",
    bpmMin: numberOrNull(els.bpmMin.value),
    bpmMax: numberOrNull(els.bpmMax.value),
    grooveMin: Number(els.grooveMin.value || 0),
    energyMin: Number(els.energyMin.value || 0),
    publicOnly: els.publicOnly.checked,
    topOnly: els.topOnly.checked,
    sort: els.sortSelect.value,
  };
}

function matchesFilters(prompt, filters) {
  if (filters.publicOnly && !prompt.public_safe) return false;
  if (filters.topOnly && !prompt.is_top_pick) return false;
  if (filters.collection !== "all" && prompt.collection !== filters.collection) return false;

  if (filters.category !== "all") {
    const [collection, slug] = filters.category.split(":");
    if (prompt.collection !== collection || prompt.category_slug !== slug) return false;
  }

  if (filters.tag !== "all" && !prompt.tags.includes(filters.tag)) return false;
  if (filters.bpmMin !== null && (prompt.bpm === null || prompt.bpm < filters.bpmMin)) return false;
  if (filters.bpmMax !== null && (prompt.bpm === null || prompt.bpm > filters.bpmMax)) return false;
  if (filters.grooveMin > 0 && (prompt.groove_score === null || prompt.groove_score < filters.grooveMin)) return false;
  if (filters.energyMin > 0 && (prompt.energy_score === null || prompt.energy_score < filters.energyMin)) return false;

  if (filters.query) {
    const haystack = [
      prompt.title,
      prompt.collection_label,
      prompt.category,
      prompt.subcategory,
      prompt.prompt,
      prompt.exclude,
      prompt.key,
      prompt.tags.join(" "),
    ]
      .join(" ")
      .toLowerCase();
    if (!haystack.includes(filters.query)) return false;
  }

  return true;
}

function sortPrompts(prompts, sort) {
  const items = [...prompts];
  const byText = (a, b) => a.title.localeCompare(b.title);
  const byNumberDesc = (field) => (a, b) => (b[field] ?? -1) - (a[field] ?? -1) || byText(a, b);

  if (sort === "title") return items.sort(byText);
  if (sort === "bpm") return items.sort((a, b) => (a.bpm ?? 999) - (b.bpm ?? 999) || byText(a, b));
  if (sort === "groove") return items.sort(byNumberDesc("groove_score"));
  if (sort === "energy") return items.sort(byNumberDesc("energy_score"));
  if (sort === "collection") {
    return items.sort(
      (a, b) =>
        a.version.localeCompare(b.version) ||
        a.collection_label.localeCompare(b.collection_label) ||
        a.category.localeCompare(b.category) ||
        byText(a, b)
    );
  }

  return items.sort(
    (a, b) =>
      Number(b.is_top_pick) - Number(a.is_top_pick) ||
      (b.groove_score ?? -1) - (a.groove_score ?? -1) ||
      (b.energy_score ?? -1) - (a.energy_score ?? -1) ||
      a.version.localeCompare(b.version) ||
      byText(a, b)
  );
}

function renderPromptGrid() {
  const visible = state.filtered.slice(0, state.visibleCount);
  els.resultTitle.textContent = `${state.filtered.length.toLocaleString("ja-JP")}件`;
  els.emptyState.hidden = state.filtered.length !== 0;
  els.promptGrid.innerHTML = visible.map(renderPromptCard).join("");
  els.loadMore.hidden = state.visibleCount >= state.filtered.length;
}

function renderPromptCard(prompt) {
  const tags = prompt.tags.slice(0, 5).map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join("");
  const metrics = [
    prompt.bpm ? `BPM ${prompt.bpm}` : "",
    prompt.key ? prompt.key : "",
    prompt.groove_score !== null ? `Groove ${prompt.groove_score}` : "",
    prompt.energy_score !== null ? `Energy ${prompt.energy_score}` : "",
  ]
    .filter(Boolean)
    .map((metric) => `<span class="metric">${escapeHtml(metric)}</span>`)
    .join("");

  return `
    <article class="prompt-card">
      <div class="card-meta">
        <span class="collection-pill">${escapeHtml(prompt.version)} / ${escapeHtml(prompt.collection_label)}</span>
        <span>${escapeHtml(prompt.category)}</span>
      </div>
      <h3>${escapeHtml(prompt.title)}</h3>
      <p class="prompt-preview">${escapeHtml(prompt.prompt)}</p>
      <div class="metric-row">${metrics}</div>
      <div class="tag-row">${tags}</div>
      <div class="card-actions">
        <button class="button" type="button" data-action="copy" data-id="${escapeHtml(prompt.id)}">Copy</button>
        <button class="button secondary" type="button" data-action="copy-exclude" data-id="${escapeHtml(prompt.id)}">+ Exclude</button>
        <button class="button secondary" type="button" data-action="detail" data-id="${escapeHtml(prompt.id)}">詳細</button>
      </div>
    </article>
  `;
}

function renderActiveChips(filters) {
  const chips = [];
  const collection = state.catalog.collections.find((item) => item.id === filters.collection);
  if (collection) chips.push(collection.label);
  if (filters.category !== "all") {
    const category = state.catalog.categories.find((item) => item.id === filters.category);
    if (category) chips.push(category.name);
  }
  if (filters.tag !== "all") chips.push(`#${filters.tag}`);
  if (filters.query) chips.push(`検索: ${filters.query}`);
  if (filters.bpmMin !== null || filters.bpmMax !== null) chips.push(`BPM ${filters.bpmMin || ""}-${filters.bpmMax || ""}`);
  if (filters.grooveMin > 0) chips.push(`Groove ${filters.grooveMin}+`);
  if (filters.energyMin > 0) chips.push(`Energy ${filters.energyMin}+`);
  if (filters.topOnly) chips.push("おすすめ");
  if (filters.publicOnly) chips.push("Public Safe");

  els.activeChips.innerHTML = chips.map((chip) => `<span class="chip">${escapeHtml(chip)}</span>`).join("");
}

function handlePromptAction(event) {
  const target = event.target.closest("[data-action]");
  if (!target) return;

  const prompt = state.prompts.find((item) => item.id === target.dataset.id);
  if (!prompt) return;

  if (target.dataset.action === "copy") {
    copyText(prompt.prompt, "Promptをコピーしました");
  }

  if (target.dataset.action === "copy-exclude") {
    copyText(composeWithExclude(prompt), "Prompt + Excludeをコピーしました");
  }

  if (target.dataset.action === "detail") {
    openDialog(prompt);
  }
}

function openDialog(prompt) {
  const similar = state.prompts
    .filter((item) => item.id !== prompt.id && item.collection === prompt.collection && item.category_slug === prompt.category_slug)
    .slice(0, 6);

  els.dialogContent.innerHTML = `
    <div class="dialog-body">
      <div>
        <p class="eyebrow">${escapeHtml(prompt.version)} / ${escapeHtml(prompt.collection_label)}</p>
        <h3>${escapeHtml(prompt.title)}</h3>
      </div>
      <div class="metric-row">
        ${[
          prompt.category,
          prompt.subcategory,
          prompt.bpm ? `BPM ${prompt.bpm}` : "",
          prompt.key,
          prompt.groove_score !== null ? `Groove ${prompt.groove_score}` : "",
          prompt.energy_score !== null ? `Energy ${prompt.energy_score}` : "",
        ]
          .filter(Boolean)
          .map((metric) => `<span class="metric">${escapeHtml(metric)}</span>`)
          .join("")}
      </div>
      <section>
        <p class="eyebrow">Prompt</p>
        <p class="prompt-text">${escapeHtml(prompt.prompt)}</p>
      </section>
      ${
        prompt.exclude
          ? `<section><p class="eyebrow">Exclude</p><p class="exclude-text">${escapeHtml(prompt.exclude)}</p></section>`
          : ""
      }
      ${
        prompt.lyrics_direction
          ? `<section><p class="eyebrow">Lyrics Direction</p><p class="lyrics-text">${escapeHtml(prompt.lyrics_direction)}</p></section>`
          : ""
      }
      <div class="tag-row">${prompt.tags.map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join("")}</div>
      <div class="card-actions">
        <button class="button" type="button" data-action="copy" data-id="${escapeHtml(prompt.id)}">Copy</button>
        <button class="button secondary" type="button" data-action="copy-exclude" data-id="${escapeHtml(prompt.id)}">+ Exclude</button>
      </div>
      ${
        similar.length
          ? `<section><p class="eyebrow">Similar</p><div class="similar-list">${similar
              .map(
                (item) =>
                  `<button class="similar-button" type="button" data-action="detail" data-id="${escapeHtml(item.id)}">${escapeHtml(
                    item.title
                  )}</button>`
              )
              .join("")}</div></section>`
          : ""
      }
    </div>
  `;

  if (typeof els.promptDialog.showModal === "function") {
    els.promptDialog.showModal();
  } else {
    els.promptDialog.setAttribute("open", "");
  }
}

function composeWithExclude(prompt) {
  return prompt.exclude ? `${prompt.prompt}\n\nExclude: ${prompt.exclude}` : prompt.prompt;
}

async function copyText(text, message) {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
    } else {
      fallbackCopy(text);
    }
    showToast(message);
  } catch (error) {
    fallbackCopy(text);
    showToast(message);
  }
}

function fallbackCopy(text) {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.top = "-1000px";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  textarea.remove();
}

function showToast(message) {
  els.toast.textContent = message;
  els.toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => els.toast.classList.remove("show"), 1800);
}

function clearFilters() {
  els.searchInput.value = "";
  els.collectionFilter.value = "all";
  els.bpmMin.value = "";
  els.bpmMax.value = "";
  els.grooveMin.value = "0";
  els.energyMin.value = "0";
  els.grooveOutput.value = "0+";
  els.energyOutput.value = "0+";
  els.publicOnly.checked = true;
  els.topOnly.checked = false;
  els.sortSelect.value = "recommended";
  state.visibleCount = PAGE_SIZE;
  updateCategoryOptions();
  updateTagOptions();
  renderCollectionTabs();
  applyFilters();
}

function numberOrNull(value) {
  if (value === "" || value === null || value === undefined) return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
