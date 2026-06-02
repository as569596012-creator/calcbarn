// 站点级配置。构建时从环境变量读取(NEXT_PUBLIC_ 前缀才能在浏览器端可用),
// 没有配置时用下面的默认值,保证本地开发与首次构建都能跑通。

function env(key: string, fallback: string): string {
  const v = process.env[key];
  return v && v.trim().length > 0 ? v.trim() : fallback;
}

// 站点正式域名(上线前在 .env / Cloudflare 环境变量里设成真实域名,例如 https://buildcalc.com)
export const SITE_URL = env("NEXT_PUBLIC_SITE_URL", "https://calcbarn.com").replace(/\/$/, "");

export const SITE_NAME = env("NEXT_PUBLIC_SITE_NAME", "CalcBarn");

export const SITE_TAGLINE = env(
  "NEXT_PUBLIC_SITE_TAGLINE",
  "Free home & construction calculators — concrete, paint, flooring, mulch and gravel.",
);

export const SITE_DESCRIPTION = env(
  "NEXT_PUBLIC_SITE_DESCRIPTION",
  "Free, accurate home improvement and construction calculators. Estimate concrete, paint, flooring, mulch and gravel in seconds. No sign-up, mobile friendly, instant results.",
);

// E-E-A-T:真实作者署名,审广告与排名都看重
export const AUTHOR_NAME = env("NEXT_PUBLIC_AUTHOR_NAME", "The CalcBarn Team");
export const AUTHOR_PROFILE_URL = env("NEXT_PUBLIC_AUTHOR_PROFILE_URL", "");

export const CONTACT_EMAIL = env("NEXT_PUBLIC_CONTACT_EMAIL", "hello@example.com");

// 变现 / 分析(留空则不会注入对应脚本)
export const ADSENSE_PUBLISHER_ID = env("NEXT_PUBLIC_ADSENSE_PUBLISHER_ID", ""); // ca-pub-xxxxxxxx
export const GA4_ID = env("NEXT_PUBLIC_GA4_ID", ""); // G-XXXXXXX
export const PLAUSIBLE_DOMAIN = env("NEXT_PUBLIC_PLAUSIBLE_DOMAIN", "");

export function absoluteUrl(path = "/"): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${clean}`;
}
