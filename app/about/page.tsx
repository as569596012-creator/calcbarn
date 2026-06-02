import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { SITE_NAME, AUTHOR_NAME, AUTHOR_PROFILE_URL } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: `About ${SITE_NAME}`,
  description: `Learn who builds ${SITE_NAME} and why these free home and construction calculators exist.`,
  path: "/about/",
});

export default function AboutPage() {
  return (
    <article className="prose-tool mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-extrabold text-gray-900">About {SITE_NAME}</h1>
      <p className="mt-4">
        {SITE_NAME} is a collection of free, no-nonsense calculators for home improvement and
        construction projects — concrete, paint, flooring, mulch and gravel. Each one gives you an
        instant, accurate material estimate so you can buy the right amount the first time.
      </p>
      <h2 className="mt-8 text-xl font-bold text-gray-900">Why we built it</h2>
      <p className="mt-3">
        Most project calculators online are buried in ads, ask for your email, or hide the formula
        they use. We wanted the opposite: clean, fast tools that show their work, run on any phone
        on the jobsite, and are completely free. Every result links back to the underlying formula
        so you can check it yourself.
      </p>
      <h2 className="mt-8 text-xl font-bold text-gray-900">Who runs this site</h2>
      <p className="mt-3">
        {SITE_NAME} is built and maintained by {AUTHOR_NAME}. We test each calculator against
        worked examples and industry rules of thumb before publishing it.
        {AUTHOR_PROFILE_URL ? (
          <>
            {" "}
            More about the author{" "}
            <a className="text-brand-700 underline" href={AUTHOR_PROFILE_URL} rel="noopener noreferrer">
              here
            </a>
            .
          </>
        ) : null}
      </p>
      <h2 className="mt-8 text-xl font-bold text-gray-900">How we make money</h2>
      <p className="mt-3">
        The calculators are free to use. To cover hosting and development, some pages display ads
        and may link to relevant products. This never changes the results or what the tools cost
        you.
      </p>
    </article>
  );
}
