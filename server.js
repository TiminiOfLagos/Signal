// Minimal zero-dependency static server for the Signal site.
// Run: node server.js   →  http://localhost:5173
//
// The site is plain static files, so any static host (GitHub Pages, Netlify,
// Vercel, Cloudflare Pages, S3) can serve the repo root directly and does not
// need this file at all. It exists for local development, and for hosts that
// expect a Node process.
const http = require("http");
const fs = require("fs");
const path = require("path");

const ROOT = __dirname;
const PORT = process.env.PORT || 5173;
const HOST = process.env.HOST || "0.0.0.0"; // hosts bind externally, not to localhost

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".mp3": "audio/mpeg",
  ".txt": "text/plain; charset=utf-8"
};

function send(res, status, body, type) {
  res.writeHead(status, { "Content-Type": type || "text/plain; charset=utf-8", "Cache-Control": "no-store" });
  res.end(body);
}

http.createServer((req, res) => {
  let rel;
  try {
    rel = decodeURIComponent(req.url.split("?")[0]);
  } catch {
    rel = req.url.split("?")[0];
  }

  // the old filename shipped in earlier builds — keep links working
  if (rel === "/signal-sessions.html") {
    res.writeHead(301, { Location: "/" });
    res.end();
    return;
  }

  if (rel === "/" || rel.endsWith("/")) rel += "index.html";

  // keep requests inside ROOT
  const file = path.join(ROOT, path.normalize(rel).replace(/^([/\\])+/, ""));
  if (file !== ROOT && !file.startsWith(ROOT + path.sep)) {
    send(res, 403, "Forbidden");
    return;
  }

  fs.readFile(file, (err, buf) => {
    if (!err) {
      send(res, 200, buf, TYPES[path.extname(file).toLowerCase()] || "application/octet-stream");
      return;
    }
    // Anything we cannot resolve falls back to the page itself rather than a
    // bare 404, so a stray path never leaves the visitor staring at plain text.
    fs.readFile(path.join(ROOT, "index.html"), (e2, home) => {
      if (e2) {
        send(res, 404, "Not found: " + rel);
        return;
      }
      send(res, 404, home, TYPES[".html"]);
    });
  });
}).listen(PORT, HOST, () => {
  console.log("Signal running on port " + PORT);

  // If a host bundles this file without the static assets beside it (some
  // platforms trace only the entry point into a serverless function), every
  // request 404s and the cause is invisible. Say so in the deploy log.
  const home = path.join(ROOT, "index.html");
  if (fs.existsSync(home)) {
    console.log("Serving " + home);
  } else {
    console.error("FATAL: index.html is not next to server.js.");
    console.error("  __dirname = " + ROOT);
    console.error("  cwd       = " + process.cwd());
    let listing = [];
    try { listing = fs.readdirSync(ROOT); } catch (e) { listing = ["<unreadable: " + e.code + ">"]; }
    console.error("  contents  = " + listing.join(", "));
    console.error("This site is static — deploy it as a static site with publish");
    console.error("directory '.' instead of running this server.");
  }
});
