import type { Metadata } from "next";
import Link from "next/link";
import GuideLayout from "@/components/GuideLayout";
import { buildMetadata } from "@/lib/seo";
import { getGuide } from "@/lib/guides";

const SLUG = "how-much-concrete-do-i-need";
const guide = getGuide(SLUG)!;

export const metadata: Metadata = buildMetadata({
  title: guide.title,
  description: guide.metaDescription,
  path: `/guides/${SLUG}/`,
  keywords: guide.keywords,
});

export default function Page() {
  return (
    <GuideLayout slug={SLUG}>
      <p>
        <strong>Quick answer:</strong> concrete is sold by the cubic yard, so the job is to find
        your pour&apos;s volume in cubic feet, divide by 27, and add about 10% for waste. For a slab
        that is length × width × thickness (all in feet). The{" "}
        <Link href="/concrete-calculator/" className="text-brand-700 underline">
          concrete calculator
        </Link>{" "}
        does this instantly and also tells you how many 60 lb or 80 lb bags to buy.
      </p>

      <h2 className="text-xl font-bold text-gray-900">The one formula you need</h2>
      <p>
        Every concrete estimate is just a volume. Measure your pour in feet, multiply the three
        dimensions, then convert to cubic yards (the unit ready-mix is sold in):
      </p>
      <p className="rounded-lg bg-gray-100 px-4 py-3 font-mono text-sm text-gray-800">
        cubic yards = (length ft × width ft × thickness ft) ÷ 27
      </p>
      <p>
        The trick most people miss: thickness is usually given in inches, so convert it to feet
        first by dividing by 12. A 4-inch slab is 4 ÷ 12 = 0.333 ft thick.
      </p>

      <h2 className="text-xl font-bold text-gray-900">Worked example: a 10 × 12 ft slab</h2>
      <p>For a patio slab 10 ft by 12 ft, poured 4 inches thick:</p>
      <ul className="ml-5 list-disc space-y-1 text-gray-600">
        <li>Thickness in feet: 4 ÷ 12 = 0.333 ft</li>
        <li>Volume: 10 × 12 × 0.333 = 40 cubic feet</li>
        <li>Cubic yards: 40 ÷ 27 = 1.48 cubic yards</li>
        <li>Add 10% waste: 1.48 × 1.10 ≈ 1.63 cubic yards</li>
      </ul>
      <p>
        So you would order about 1.65 cubic yards of ready-mix, or round up to where your supplier
        sells in quarter-yard increments.
      </p>

      <h2 className="text-xl font-bold text-gray-900">How many bags of concrete?</h2>
      <p>
        For small jobs, bagged concrete is easier than ordering a truck. Each bag lists its yield in
        cubic feet:
      </p>
      <ul className="ml-5 list-disc space-y-1 text-gray-600">
        <li>An 80 lb bag yields about 0.60 cubic feet</li>
        <li>A 60 lb bag yields about 0.45 cubic feet</li>
        <li>A 40 lb bag yields about 0.30 cubic feet</li>
      </ul>
      <p>
        Divide your total cubic feet by the bag yield. For the 40 cubic-foot slab above: 40 ÷ 0.60 ≈
        67 bags of 80 lb concrete. That is a lot of mixing by hand — past roughly 25–30 bags, a
        ready-mix delivery is usually cheaper and far less work.
      </p>

      <h2 className="text-xl font-bold text-gray-900">Footings and round post holes</h2>
      <p>
        Footings are just long, narrow slabs — use the same length × width × depth formula. Round
        post holes use the cylinder formula instead:
      </p>
      <p className="rounded-lg bg-gray-100 px-4 py-3 font-mono text-sm text-gray-800">
        cubic feet = π × (diameter ft ÷ 2)² × depth ft
      </p>
      <p>
        For a 12-inch-wide hole 3 ft deep: 3.14 × (0.5)² × 3 = 2.36 cubic feet per hole. Multiply by
        the number of holes, and remember to subtract the volume the post itself takes up if it is
        large.
      </p>

      <h2 className="text-xl font-bold text-gray-900">Why add a waste factor?</h2>
      <p>
        Real-world pours never match the math exactly: the subgrade is uneven, forms bow slightly,
        and some concrete is always lost to spillage and the wheelbarrow. Adding 5–10% protects you
        from the worst outcome in concrete work — running short mid-pour, which can leave a cold
        joint or a weak seam. Slightly over is cheap insurance; short is a real problem.
      </p>

      <h2 className="text-xl font-bold text-gray-900">Frequently asked questions</h2>
      <p>
        <strong>How much does a yard of concrete cover?</strong> One cubic yard covers about 81
        square feet at 4 inches thick, 65 square feet at 5 inches, or 54 square feet at 6 inches.
      </p>
      <p>
        <strong>Should I order a little extra?</strong> Yes — most pros add 5–10%. It is far better
        to have a little left over than to stop a pour to mix more.
      </p>
      <p>
        <strong>What thickness should my slab be?</strong> 4 inches is standard for patios and
        walkways; use 5–6 inches for driveways or anything that carries vehicle weight.
      </p>
    </GuideLayout>
  );
}
