import { createServer } from "node:http";
import { readFile, stat, mkdir } from "node:fs/promises";
import { join, extname } from "node:path";
import { chromium } from "playwright";

const ROOT = join(process.cwd(), "out");
const PORT = 4323;
const BASE = `http://localhost:${PORT}`;
const MIME = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".txt": "text/plain", ".xml": "application/xml", ".svg": "image/svg+xml", ".ico": "image/x-icon", ".woff2": "font/woff2" };

async function resolveFile(urlPath) {
  let p = decodeURIComponent(urlPath.split("?")[0]);
  if (p.endsWith("/")) p += "index.html";
  let full = join(ROOT, p);
  try { const s = await stat(full); if (s.isDirectory()) full = join(full, "index.html"); return full; }
  catch { try { await stat(full + ".html"); return full + ".html"; } catch { return null; } }
}

const server = createServer(async (req, res) => {
  const file = await resolveFile(req.url || "/");
  if (!file) { res.statusCode = 404; res.end("nf"); return; }
  const data = await readFile(file);
  res.setHeader("Content-Type", MIME[extname(file)] || "application/octet-stream");
  res.end(data);
});
await new Promise((r) => server.listen(PORT, r));

await mkdir("screenshots", { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 900 }, deviceScaleFactor: 2 });

await page.goto(BASE + "/", { waitUntil: "networkidle" });
await page.screenshot({ path: "screenshots/home.png" });

await page.goto(BASE + "/concrete-calculator/", { waitUntil: "networkidle" });
await page.screenshot({ path: "screenshots/concrete.png", fullPage: true });

await browser.close();
server.close();
console.log("saved screenshots/home.png, screenshots/concrete.png");
