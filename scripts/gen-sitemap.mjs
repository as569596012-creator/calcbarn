// 构建前生成纯静态的 sitemap.xml 和 robots.txt 到 public/。
// 用纯静态文件而非 app/sitemap.ts 路由:Cloudflare Pages 静态导出下,
// 元数据路由(sitemap.ts/robots.ts)在边缘端会有问题,静态文件最稳。
import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://calcbarn.com").replace(/\/$/, "");

// 从 calculators.ts 提取所有 slug(避免在 node 里跑 TS)
const calcSrc = readFileSync(join(root, "lib/calculators.ts"), "utf8");
const slugs = [...calcSrc.matchAll(/\n\s*slug:\s*"([^"]+)"/g)].map((m) => m[1]);

if (slugs.length === 0) {
  throw new Error("gen-sitemap: no calculator slugs found in lib/calculators.ts");
}

// 从 guides.ts 提取内容文章 slug(可能没有文章,允许为空)
let guideSlugs = [];
try {
  const guideSrc = readFileSync(join(root, "lib/guides.ts"), "utf8");
  guideSlugs = [...guideSrc.matchAll(/\n\s*slug:\s*"([^"]+)"/g)].map((m) => m[1]);
} catch {
  guideSlugs = [];
}

const staticPages = [
  { path: "/", changefreq: "monthly", priority: "1" },
  { path: "/guides/", changefreq: "monthly", priority: "0.6" },
  { path: "/about/", changefreq: "monthly", priority: "0.5" },
  { path: "/contact/", changefreq: "monthly", priority: "0.5" },
  { path: "/privacy/", changefreq: "monthly", priority: "0.5" },
  { path: "/disclaimer/", changefreq: "monthly", priority: "0.5" },
];

const calcPages = slugs.map((slug) => ({
  path: `/${slug}/`,
  changefreq: "weekly",
  priority: "0.9",
}));

const guidePages = guideSlugs.map((slug) => ({
  path: `/guides/${slug}/`,
  changefreq: "monthly",
  priority: "0.7",
}));

const all = [...staticPages, ...calcPages, ...guidePages];

const urlsXml = all
  .map(
    (p) =>
      `<url><loc>${SITE_URL}${p.path}</loc><changefreq>${p.changefreq}</changefreq><priority>${p.priority}</priority></url>`,
  )
  .join("\n");

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlsXml}
</urlset>
`;

writeFileSync(join(root, "public/sitemap.xml"), sitemap, "utf8");

const robots = `User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`;
writeFileSync(join(root, "public/robots.txt"), robots, "utf8");

console.log(
  `gen-sitemap: wrote ${all.length} URLs (${slugs.length} calculators, ${guideSlugs.length} guides) to public/sitemap.xml`,
);
