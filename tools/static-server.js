const fs = require("fs");
const http = require("http");
const path = require("path");

const root = path.resolve(__dirname, "..");
const startPort = Number(process.env.PORT || 5173);

const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
};

function send(res, status, body, type = "text/plain; charset=utf-8") {
  res.writeHead(status, {
    "Content-Type": type,
    "Cache-Control": "no-store",
  });
  res.end(body);
}

function safePath(urlPath) {
  const clean = decodeURIComponent(urlPath.split("?")[0]).replace(/^\/+/, "");
  const target = path.resolve(root, clean || "index.html");
  if (!target.startsWith(root)) return null;
  return target;
}

function createServer(port) {
  const server = http.createServer((req, res) => {
    const target = safePath(req.url || "/");
    if (!target) {
      send(res, 403, "Forbidden");
      return;
    }

    fs.stat(target, (statError, stat) => {
      const filePath = !statError && stat.isDirectory() ? path.join(target, "index.html") : target;
      fs.readFile(filePath, (readError, data) => {
        if (readError) {
          send(res, 404, "Not Found");
          return;
        }
        send(res, 200, data, types[path.extname(filePath)] || "application/octet-stream");
      });
    });
  });

  server.on("error", (error) => {
    if (error.code === "EADDRINUSE" && port < startPort + 20) {
      createServer(port + 1);
      return;
    }
    throw error;
  });

  server.listen(port, "127.0.0.1", () => {
    console.log(`Suno Prompt Library: http://127.0.0.1:${port}/`);
  });
}

createServer(startPort);
