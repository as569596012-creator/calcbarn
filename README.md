# CalcBarn — 免费家居/装修计算器站

复用 piccrush 的 Next.js 静态站模板做的第二个工具站。垂直方向:家居/装修/建筑计算器(更高 RPM、更低竞争)。起步 5 个计算器:混凝土、油漆、地板、覆盖物(mulch)、碎石(gravel)。

## 技术栈

- Next.js (App Router) + TypeScript + TailwindCSS
- `output: 'export'` 纯静态导出(产物在 `out/`,零服务器成本)
- 计算全部在浏览器完成,实时更新,支持 URL 参数分享结果

## 本地开发

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # 产物在 out/
node scripts/verify.mjs   # 无头浏览器验证渲染 + 计算正确性
```

## 配置

复制 `.env.example`(如有)或在 Cloudflare 设环境变量。上线前必须设:
`NEXT_PUBLIC_SITE_URL=https://你的域名`(影响 canonical / sitemap)。

## 部署(同 piccrush 流程)

- Cloudflare Pages:导入 GitHub 仓库 → 预设 `Next.js (Static HTML Export)` → build `npx next build` → output `out`。
- 自有服务器:`docker compose up -d --build`。

## 如何新增一个计算器

1. 在 [lib/calculators.ts](lib/calculators.ts) 的 `CALCULATORS` 数组加一个定义(`inputs` 字段 + `compute` 公式 + 文案/FAQ)。
2. 新建 `app/<slug>/page.tsx`(照抄现有 4 行模板)。
3. `node scripts/verify.mjs` 验证,提交,Cloudflare 自动部署。

## 目录结构

```
app/                       路由(计算器页/信任页/sitemap/robots)
components/
  CalculatorClient.tsx     交互式计算器(实时计算 + 分享链接)
  CalculatorPageView.tsx   计算器页布局 + JSON-LD
  Header/Footer/AdSlot/Faq/JsonLd/SiteScripts
lib/
  calculators.ts           计算器注册表(输入 + 公式 + 文案)
  site.ts / seo.ts         站点配置与结构化数据
scripts/verify.mjs         无头浏览器验证
```
