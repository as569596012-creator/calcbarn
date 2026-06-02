import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { SITE_NAME } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: `Disclaimer`,
  description: `Terms of use and disclaimer for ${SITE_NAME} calculators. Estimates only — verify before purchasing.`,
  path: "/disclaimer/",
});

export default function DisclaimerPage() {
  return (
    <article className="prose-tool mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-extrabold text-gray-900">Disclaimer</h1>
      <p className="mt-4">
        The calculators on {SITE_NAME} are provided free of charge for general estimating
        purposes. They use standard formulas and common rules of thumb, but results are
        <strong> estimates only</strong>.
      </p>
      <h2 className="mt-8 text-xl font-bold text-gray-900">Always verify before you buy or build</h2>
      <p className="mt-3">
        Real projects involve waste, irregular shapes, settling, and product-specific coverage that
        a simple calculator cannot capture. Always confirm quantities with your supplier and follow
        manufacturer instructions and local building codes. For structural, electrical or
        load-bearing work, consult a licensed professional.
      </p>
      <h2 className="mt-8 text-xl font-bold text-gray-900">No liability</h2>
      <p className="mt-3">
        We are not liable for any loss, cost, or damage arising from the use of these estimates,
        including over- or under-purchasing materials.
      </p>
      <h2 className="mt-8 text-xl font-bold text-gray-900">External links</h2>
      <p className="mt-3">
        Some pages may contain ads or affiliate links to third-party sites. We are not responsible
        for their content or practices.
      </p>
    </article>
  );
}
