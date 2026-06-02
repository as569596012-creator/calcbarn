import type { Metadata } from "next";
import CalculatorPageView from "@/components/CalculatorPageView";
import { buildMetadata } from "@/lib/seo";
import { getCalculator } from "@/lib/calculators";

const SLUG = "paint-calculator";
const calc = getCalculator(SLUG)!;

export const metadata: Metadata = buildMetadata({
  title: calc.title,
  description: calc.metaDescription,
  path: `/${SLUG}/`,
  keywords: calc.keywords,
});

export default function Page() {
  return <CalculatorPageView slug={SLUG} />;
}
