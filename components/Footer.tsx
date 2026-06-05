import Link from "next/link";
import { SITE_NAME, AUTHOR_NAME } from "@/lib/site";
import { CALCULATORS } from "@/lib/calculators";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-16 border-t border-gray-200 bg-gray-50">
      <div className="mx-auto grid max-w-5xl grid-cols-2 gap-8 px-4 py-10 sm:grid-cols-4">
        <div className="col-span-2 sm:col-span-1">
          <div className="text-base font-bold text-gray-900">{SITE_NAME}</div>
          <p className="mt-2 text-sm text-gray-500">
            Free, accurate home and construction calculators. No sign-up required.
          </p>
        </div>
        <div>
          <div className="text-sm font-semibold text-gray-900">Calculators</div>
          <ul className="mt-3 space-y-2 text-sm text-gray-600">
            {CALCULATORS.map((c) => (
              <li key={c.slug}>
                <Link href={`/${c.slug}/`} className="hover:text-brand-700">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="text-sm font-semibold text-gray-900">Company</div>
          <ul className="mt-3 space-y-2 text-sm text-gray-600">
            <li>
              <Link href="/guides/" className="hover:text-brand-700">
                Guides
              </Link>
            </li>
            <li>
              <Link href="/about/" className="hover:text-brand-700">
                About
              </Link>
            </li>
            <li>
              <Link href="/contact/" className="hover:text-brand-700">
                Contact
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <div className="text-sm font-semibold text-gray-900">Legal</div>
          <ul className="mt-3 space-y-2 text-sm text-gray-600">
            <li>
              <Link href="/privacy/" className="hover:text-brand-700">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/disclaimer/" className="hover:text-brand-700">
                Disclaimer
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-200 py-4 text-center text-xs text-gray-500">
        © {year} {SITE_NAME}. Built and maintained by {AUTHOR_NAME}. Estimates only — always
        double-check before purchasing.
      </div>
    </footer>
  );
}
