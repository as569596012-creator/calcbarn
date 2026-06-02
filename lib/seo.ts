import type { Metadata } from "next";
import { SITE_NAME, SITE_URL, absoluteUrl, AUTHOR_NAME } from "@/lib/site";
import type { CalculatorDef } from "@/lib/calculators";

interface PageMetaInput {
  title: string;
  description: string;
  path: string; // 以 / 开头
  keywords?: string[];
}

export function buildMetadata({ title, description, path, keywords }: PageMetaInput): Metadata {
  const url = absoluteUrl(path);
  return {
    title,
    description,
    keywords,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
  };
}

// 计算器页:SoftwareApplication(GEO,让 AI Overviews 识别为可用工具)
export function softwareAppJsonLd(calc: CalculatorDef) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: calc.name,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Any (web browser)",
    url: absoluteUrl(`/${calc.slug}/`),
    description: calc.metaDescription,
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    author: { "@type": "Organization", name: AUTHOR_NAME },
  };
}

// HowTo:计算步骤(计算器类工具非常适合,利于富结果与 AI 引用)
export function howToJsonLd(calc: CalculatorDef) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: `How to use the ${calc.name}`,
    step: calc.howTo.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      text: s,
    })),
  };
}

export function faqJsonLd(calc: CalculatorDef) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: calc.faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}
