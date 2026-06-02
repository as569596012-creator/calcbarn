import Link from "next/link";
import { CALCULATORS } from "@/lib/calculators";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/site";
import AdSlot from "@/components/AdSlot";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <section className="text-center">
        <span className="inline-flex items-center rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold text-brand-700">
          Free · Instant · No sign-up
        </span>
        <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
          {SITE_NAME} Calculators
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">{SITE_TAGLINE}</p>
      </section>

      <section className="mt-12 grid gap-5 sm:grid-cols-2">
        {CALCULATORS.map((calc) => (
          <Link
            key={calc.slug}
            href={`/${calc.slug}/`}
            className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-md"
          >
            <div className="text-3xl">{calc.emoji}</div>
            <h2 className="mt-3 text-xl font-bold text-gray-900 group-hover:text-brand-700">
              {calc.name}
            </h2>
            <p className="mt-1 text-sm text-gray-600">{calc.intro}</p>
            <span className="mt-4 inline-block text-sm font-semibold text-brand-600">
              Open calculator →
            </span>
          </Link>
        ))}
      </section>

      <div className="mt-12">
        <AdSlot />
      </div>

      <section className="mt-12 rounded-2xl border border-gray-200 bg-white p-6">
        <h2 className="text-2xl font-bold text-gray-900">Why use {SITE_NAME}?</h2>
        <div className="mt-4 grid gap-6 sm:grid-cols-3">
          <div>
            <h3 className="font-semibold text-gray-900">Instant & accurate</h3>
            <p className="mt-1 text-sm text-gray-600">
              Results update as you type, using the same formulas the pros use. No submit button,
              no waiting.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Free & shareable</h3>
            <p className="mt-1 text-sm text-gray-600">
              No accounts or fees. Copy a link to share your exact estimate with a contractor or
              client.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Works on the jobsite</h3>
            <p className="mt-1 text-sm text-gray-600">
              Fast, mobile-friendly pages that load instantly even on a phone with poor signal.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
