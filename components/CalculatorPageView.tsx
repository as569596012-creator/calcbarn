import Link from "next/link";
import { getCalculator, relatedCalculators } from "@/lib/calculators";
import CalculatorClient from "@/components/CalculatorClient";
import Faq from "@/components/Faq";
import AdSlot from "@/components/AdSlot";
import JsonLd from "@/components/JsonLd";
import {
  softwareAppJsonLd,
  howToJsonLd,
  faqJsonLd,
  breadcrumbJsonLd,
} from "@/lib/seo";

export default function CalculatorPageView({ slug }: { slug: string }) {
  const calc = getCalculator(slug);
  if (!calc) return null;
  const related = relatedCalculators(slug);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <JsonLd
        data={[
          softwareAppJsonLd(calc),
          howToJsonLd(calc),
          faqJsonLd(calc),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: calc.name, path: `/${calc.slug}/` },
          ]),
        ]}
      />

      <nav className="mb-4 text-sm text-gray-500">
        <Link href="/" className="hover:text-brand-700">
          Home
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-700">{calc.name}</span>
      </nav>

      <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
        {calc.h1}
      </h1>
      <p className="mt-3 text-lg text-gray-600">{calc.intro}</p>

      <div className="mt-6">
        <CalculatorClient slug={calc.slug} />
      </div>

      <section className="mt-10">
        <h2 className="text-xl font-bold text-gray-900">How to use</h2>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-gray-600">
          {calc.howTo.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </section>

      <div className="mt-8">
        <AdSlot />
      </div>

      <section className="prose-tool mt-8">
        <h2 className="text-xl font-bold text-gray-900">About this calculator</h2>
        <p className="mt-3">{calc.body}</p>
      </section>

      <section className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-5">
        <h2 className="flex items-center gap-2 text-base font-bold text-amber-900">
          <span>🧮</span> How it&apos;s calculated
        </h2>
        <ol className="mt-3 space-y-2">
          {calc.formulaSteps.map((step, i) => (
            <li key={i} className="flex gap-3 text-sm">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-600 text-xs font-bold text-white">
                {i + 1}
              </span>
              <span className="text-amber-800">{step}</span>
            </li>
          ))}
        </ol>
        <p className="mt-4 rounded-lg bg-white/70 px-3 py-2 text-xs font-mono text-amber-900">
          {calc.formula}
        </p>
      </section>

      <Faq items={calc.faq} />

      <section className="mt-12">
        <h2 className="text-xl font-bold text-gray-900">Related calculators</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {related.map((r) => (
            <Link
              key={r.slug}
              href={`/${r.slug}/`}
              className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 text-sm transition hover:border-brand-300 hover:shadow-sm"
            >
              <span className="text-xl">{r.emoji}</span>
              <span className="font-semibold text-gray-900">{r.name}</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
