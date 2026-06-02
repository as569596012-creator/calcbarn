import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { SITE_NAME, CONTACT_EMAIL } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: `Contact ${SITE_NAME}`,
  description: `Get in touch with the ${SITE_NAME} team for feedback, corrections, or to request a new calculator.`,
  path: "/contact/",
});

export default function ContactPage() {
  return (
    <article className="prose-tool mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-extrabold text-gray-900">Contact us</h1>
      <p className="mt-4">
        Found a bug, spotted a formula you would tweak, or want a calculator we do not have yet?
        We would love to hear from you.
      </p>
      <p className="mt-4">
        Email:{" "}
        <a className="font-semibold text-brand-700 underline" href={`mailto:${CONTACT_EMAIL}`}>
          {CONTACT_EMAIL}
        </a>
      </p>
      <p className="mt-4 text-sm text-gray-500">
        We usually reply within a couple of business days.
      </p>
    </article>
  );
}
