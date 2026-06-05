// 内容文章注册表（/guides/）。每篇文章 = 这里一条元数据 + 一个 app/guides/<slug>/page.tsx 正文。
// 文章吃"信息型/操作型"长尾词（how much / how to），正文自然内链到对应计算器，把读者导流到计算器页。
// 新增文章：在 GUIDES 加一条 + 复制一个 page.tsx 写正文即可（sitemap/列表页/导航会自动带上）。

import { getCalculator, type CalculatorDef } from "@/lib/calculators";

export interface GuideDef {
  slug: string; // 路由 /guides/<slug>/
  title: string; // <title>（不含站名，站名由 layout 模板自动加）
  metaDescription: string;
  h1: string;
  intro: string; // H1 下方一句话
  description: string; // 列表页摘要
  date: string; // ISO 日期，用于 Article 结构化数据 + 页面显示
  keywords: string[];
  relatedSlugs: string[]; // 关联计算器 slug，用于底部"用这个计算器"CTA 内链
}

export const GUIDES: GuideDef[] = [
  {
    slug: "how-much-concrete-do-i-need",
    title: "How Much Concrete Do I Need? (Slabs, Footings & Posts)",
    metaDescription:
      "Work out how much concrete you need for a slab, footing or post hole — the simple volume formula, how many 60 lb and 80 lb bags it takes, and how much waste to add.",
    h1: "How Much Concrete Do I Need?",
    intro:
      "Estimating concrete comes down to one volume formula plus a little waste. Here is how to do it by hand — and an instant calculator to check your number.",
    description:
      "The volume formula for slabs, footings and post holes, how to convert cubic feet to cubic yards and bags, and how much waste to add.",
    date: "2026-06-05",
    keywords: [
      "how much concrete do i need",
      "concrete calculator",
      "how many bags of concrete",
      "concrete for a slab",
      "concrete yardage formula",
    ],
    relatedSlugs: ["concrete-calculator"],
  },
];

export function getGuide(slug: string): GuideDef | undefined {
  return GUIDES.find((g) => g.slug === slug);
}

export function relatedCalculatorsForGuide(guide: GuideDef): CalculatorDef[] {
  return guide.relatedSlugs
    .map((slug) => getCalculator(slug))
    .filter((c): c is CalculatorDef => Boolean(c));
}
