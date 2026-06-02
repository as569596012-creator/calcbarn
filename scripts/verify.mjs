// 本机无头浏览器验证:启动静态服务器托管 out/,用 Playwright 检查
// 1) 各路由渲染 + JSON-LD 合法;2) SEO 文件;3) 计算器实时计算正确性。
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { join, extname } from "node:path";
import { chromium } from "playwright";

const ROOT = join(process.cwd(), "out");
const PORT = 4321;
const BASE = `http://localhost:${PORT}`;

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
};

async function resolveFile(urlPath) {
  let p = decodeURIComponent(urlPath.split("?")[0]);
  if (p.endsWith("/")) p += "index.html";
  let full = join(ROOT, p);
  try {
    const s = await stat(full);
    if (s.isDirectory()) full = join(full, "index.html");
    return full;
  } catch {
    try {
      await stat(full + ".html");
      return full + ".html";
    } catch {
      try {
        const idx = join(full, "index.html");
        await stat(idx);
        return idx;
      } catch {
        return null;
      }
    }
  }
}

function startServer() {
  const server = createServer(async (req, res) => {
    const file = await resolveFile(req.url || "/");
    if (!file) {
      res.statusCode = 404;
      res.end("Not found");
      return;
    }
    try {
      const data = await readFile(file);
      res.setHeader("Content-Type", MIME[extname(file)] || "application/octet-stream");
      res.end(data);
    } catch {
      res.statusCode = 500;
      res.end("Server error");
    }
  });
  return new Promise((resolve) => server.listen(PORT, () => resolve(server)));
}

const ROUTES = [
  { path: "/", h1Includes: "Calculators" },
  { path: "/concrete-calculator/", h1Includes: "Concrete Calculator" },
  { path: "/paint-calculator/", h1Includes: "Paint Calculator" },
  { path: "/flooring-calculator/", h1Includes: "Flooring Calculator" },
  { path: "/mulch-calculator/", h1Includes: "Mulch Calculator" },
  { path: "/gravel-calculator/", h1Includes: "Gravel Calculator" },
  { path: "/about/", h1Includes: "About" },
  { path: "/contact/", h1Includes: "Contact" },
  { path: "/privacy/", h1Includes: "Privacy" },
  { path: "/disclaimer/", h1Includes: "Disclaimer" },
];

let failures = 0;
function check(name, ok, detail = "") {
  const mark = ok ? "PASS" : "FAIL";
  if (!ok) failures++;
  console.log(`  [${mark}] ${name}${detail ? " — " + detail : ""}`);
}

async function main() {
  const server = await startServer();
  console.log(`Static server on ${BASE}\n`);
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });

  console.log("1) 路由渲染 + JSON-LD:");
  for (const route of ROUTES) {
    const resp = await page.goto(BASE + route.path, { waitUntil: "networkidle" });
    const status = resp?.status() ?? 0;
    const h1 = (await page.locator("h1").first().textContent())?.trim() || "";
    const ldNodes = await page.locator('script[type="application/ld+json"]').allTextContents();
    let ldValid = true;
    for (const txt of ldNodes) {
      try {
        JSON.parse(txt);
      } catch {
        ldValid = false;
      }
    }
    const ok = status === 200 && h1.includes(route.h1Includes) && ldValid;
    check(route.path, ok, `status=${status} h1="${h1.slice(0, 36)}" jsonld=${ldNodes.length}${ldValid ? "" : " INVALID"}`);
  }

  console.log("\n2) SEO 文件:");
  for (const f of ["/robots.txt", "/sitemap.xml", "/llms.txt"]) {
    const resp = await page.goto(BASE + f, { waitUntil: "load" });
    const body = await page.evaluate(() => document.body?.innerText || "");
    check(f, (resp?.status() ?? 0) === 200 && body.length > 10, `len=${body.length}`);
  }

  console.log("\n3) 计算器实时计算(混凝土):");
  await page.goto(BASE + "/concrete-calculator/", { waitUntil: "networkidle" });
  // 结果高亮值在 .text-2xl 元素里。默认 10 x 10 x 4in -> 33.33cf / 27 = 1.23 cubic yards
  const defaultResult = await page.locator(".text-2xl").first().textContent();
  check("默认 10x10x4in = 1.23 cubic yards", /1\.23/.test(defaultResult || ""), `"${(defaultResult || "").trim()}"`);

  // 改 length=20 -> 66.67cf / 27 = 2.47 cubic yards
  const firstInput = page.locator('input[type="number"]').first();
  await firstInput.fill("20");
  await page.waitForTimeout(150);
  const updated = await page.locator(".text-2xl").first().textContent();
  check("改 length=20 实时更新为 2.47", /2\.47/.test(updated || ""), `"${(updated || "").trim()}"`);

  // 测试分享链接(URL 参数):20x10x(4/12)=66.67cf /27=2.47cy *1.4 = 3.46 tons
  await page.goto(BASE + "/gravel-calculator/?length=20&width=10&depth=4", { waitUntil: "networkidle" });
  const shared = await page.locator(".text-2xl").first().textContent();
  check("分享链接参数生效(gravel 3.46 tons)", /3\.4[56]/.test(shared || ""), `"${(shared || "").trim()}"`);

  await browser.close();
  server.close();

  console.log(`\n${failures === 0 ? "ALL CHECKS PASSED" : failures + " CHECK(S) FAILED"}`);
  process.exit(failures === 0 ? 0 : 1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
