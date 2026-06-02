// 计算器注册表:首页列表、每个计算器页、sitemap、内链都从这里读取。
// 新增计算器只改这一个文件 + 加一个 app/<slug>/page.tsx 路由。

export interface CalcInput {
  id: string;
  label: string;
  unit?: string;
  default: number;
  min?: number;
  step?: number;
}

export interface CalcResult {
  label: string;
  value: string; // 已格式化
  highlight?: boolean;
}

export interface FaqItem {
  q: string;
  a: string;
}

export interface CalculatorDef {
  slug: string;
  name: string;
  emoji: string;
  title: string;
  metaDescription: string;
  h1: string;
  intro: string;
  keywords: string[];
  howTo: string[];
  body: string;
  formula: string; // 给用户看的公式说明
  faq: FaqItem[];
  inputs: CalcInput[];
  compute: (v: Record<string, number>) => CalcResult[];
}

// 数字格式化:最多 2 位小数,去掉多余的 0,加千分位
function fmt(n: number, digits = 2): string {
  if (!isFinite(n)) return "0";
  return n.toLocaleString("en-US", { maximumFractionDigits: digits });
}

export const CALCULATORS: CalculatorDef[] = [
  {
    slug: "concrete-calculator",
    name: "Concrete Calculator",
    emoji: "🧱",
    title: "Concrete Calculator — Yards & Bags for Slabs and Footings (Free)",
    metaDescription:
      "Free concrete calculator. Estimate how many cubic yards and 60lb / 80lb bags of concrete you need for a slab, footing or patio. Instant, accurate, mobile friendly.",
    h1: "Concrete Calculator",
    intro: "Estimate the cubic yards and bags of concrete you need for a slab, footing or patio.",
    keywords: [
      "concrete calculator",
      "how much concrete do i need",
      "concrete yardage calculator",
      "concrete bag calculator",
      "cubic yards of concrete",
    ],
    howTo: [
      "Enter the length and width of your slab in feet.",
      "Enter the thickness in inches (4\" is typical for a slab).",
      "Read the cubic yards and number of bags you need.",
    ],
    body: "This concrete calculator works out the volume of a rectangular slab or footing and converts it to cubic yards (how ready-mix concrete is ordered) and to the number of pre-mixed bags. The math is simple: volume = length x width x thickness, converted to cubic yards by dividing by 27. An 80 lb bag of concrete yields about 0.60 cubic feet, a 60 lb bag about 0.45 cubic feet. For large pours it is almost always cheaper to order ready-mix by the yard than to buy bags. Always add about 5-10% extra for spillage and uneven subgrade.",
    formula: "Cubic yards = (Length ft x Width ft x Thickness ft) / 27, where Thickness ft = inches / 12.",
    faq: [
      {
        q: "How many 80lb bags of concrete are in a yard?",
        a: "A cubic yard is 27 cubic feet. An 80 lb bag yields about 0.60 cubic feet, so it takes roughly 45 bags to make one cubic yard.",
      },
      {
        q: "How thick should a concrete slab be?",
        a: "4 inches is standard for patios, walkways and shed floors. Use 5-6 inches for driveways or anything bearing heavy vehicles.",
      },
      {
        q: "Should I add extra concrete?",
        a: "Yes. Add about 5-10% to allow for spillage, over-excavation and uneven ground so you do not run short mid-pour.",
      },
    ],
    inputs: [
      { id: "length", label: "Length", unit: "ft", default: 10, min: 0, step: 0.5 },
      { id: "width", label: "Width", unit: "ft", default: 10, min: 0, step: 0.5 },
      { id: "thickness", label: "Thickness", unit: "in", default: 4, min: 0, step: 0.5 },
    ],
    compute: (v) => {
      const cf = v.length * v.width * (v.thickness / 12);
      const cy = cf / 27;
      const bags80 = Math.ceil(cf / 0.6);
      const bags60 = Math.ceil(cf / 0.45);
      return [
        { label: "Concrete needed", value: `${fmt(cy)} cubic yards`, highlight: true },
        { label: "Volume", value: `${fmt(cf)} cubic feet` },
        { label: "80 lb bags", value: `${fmt(bags80, 0)} bags` },
        { label: "60 lb bags", value: `${fmt(bags60, 0)} bags` },
      ];
    },
  },
  {
    slug: "paint-calculator",
    name: "Paint Calculator",
    emoji: "🎨",
    title: "Paint Calculator — How Much Paint Do I Need for a Room (Free)",
    metaDescription:
      "Free paint calculator. Find out how many gallons of paint you need to cover a room's walls, including doors, windows and number of coats. Instant and accurate.",
    h1: "Paint Calculator",
    intro: "Find out how many gallons of paint you need to cover your room's walls.",
    keywords: [
      "paint calculator",
      "how much paint do i need",
      "paint coverage calculator",
      "gallons of paint for a room",
      "wall paint calculator",
    ],
    howTo: [
      "Enter the room length, width and wall height in feet.",
      "Enter how many doors and windows to subtract, and how many coats.",
      "Read the paintable area and gallons of paint to buy.",
    ],
    body: "This paint calculator estimates the paintable wall area of a room and converts it to gallons. It takes the wall perimeter times the height, subtracts a standard 21 sq ft per door and 15 sq ft per window, then multiplies by the number of coats. One gallon of wall paint covers roughly 350 square feet per coat. The result is rounded up because you can only buy whole cans, and it is wise to keep a little extra for touch-ups. For brand-new drywall or a big color change, plan on two coats.",
    formula: "Gallons = (Wall area - doors - windows) x Coats / 350 sq ft per gallon.",
    faq: [
      {
        q: "How much does a gallon of paint cover?",
        a: "About 350 square feet per coat for most interior wall paints on a smooth, primed surface. Rough or porous surfaces cover less.",
      },
      {
        q: "How many coats of paint do I need?",
        a: "Two coats is standard for good coverage and durability, especially over new drywall or when changing colors. One coat may do for minor refreshes.",
      },
      {
        q: "Does this include the ceiling?",
        a: "No, this estimates walls only. Calculate the ceiling separately as length x width, divided by 350 sq ft per gallon.",
      },
    ],
    inputs: [
      { id: "length", label: "Room length", unit: "ft", default: 12, min: 0, step: 0.5 },
      { id: "width", label: "Room width", unit: "ft", default: 12, min: 0, step: 0.5 },
      { id: "height", label: "Wall height", unit: "ft", default: 8, min: 0, step: 0.5 },
      { id: "doors", label: "Doors", default: 1, min: 0, step: 1 },
      { id: "windows", label: "Windows", default: 2, min: 0, step: 1 },
      { id: "coats", label: "Coats", default: 2, min: 1, step: 1 },
    ],
    compute: (v) => {
      const perimeter = 2 * (v.length + v.width);
      const gross = perimeter * v.height;
      const net = Math.max(0, gross - v.doors * 21 - v.windows * 15);
      const totalArea = net * v.coats;
      const gallons = totalArea / 350;
      return [
        { label: "Paint to buy", value: `${Math.ceil(gallons)} gallon(s)`, highlight: true },
        { label: "Exact gallons", value: `${fmt(gallons)} gal` },
        { label: "Paintable wall area", value: `${fmt(net)} sq ft` },
        { label: "Total area with coats", value: `${fmt(totalArea)} sq ft` },
      ];
    },
  },
  {
    slug: "flooring-calculator",
    name: "Flooring Calculator",
    emoji: "🪵",
    title: "Flooring Calculator — Boxes of Flooring Needed (Free, with Waste)",
    metaDescription:
      "Free flooring calculator. Work out the square footage of a room and how many boxes of laminate, vinyl, hardwood or tile to buy, including a waste allowance.",
    h1: "Flooring Calculator",
    intro: "Work out the square footage and how many boxes of flooring to buy, with waste included.",
    keywords: [
      "flooring calculator",
      "how much flooring do i need",
      "square footage calculator for flooring",
      "laminate flooring calculator",
      "how many boxes of flooring",
    ],
    howTo: [
      "Enter the room length and width in feet.",
      "Enter the coverage printed on the flooring box (sq ft per box).",
      "Set a waste allowance (10% is typical) and read the boxes to buy.",
    ],
    body: "This flooring calculator finds the room's square footage and divides it by the coverage of one box to tell you how many boxes to buy. It adds a waste allowance (default 10%) for cuts, mistakes and future repairs - use 15% for diagonal or herringbone layouts, and 5% for simple straight runs in a square room. Always round up to whole boxes, and buy from the same batch/lot number so colors match. Keep one spare box for repairs down the road.",
    formula: "Boxes = ceil( Room area x (1 + Waste%) / Coverage per box ).",
    faq: [
      {
        q: "How much waste should I add for flooring?",
        a: "10% is a good default. Use 15% for diagonal or herringbone patterns and complex room shapes, or 5% for a simple square room.",
      },
      {
        q: "Why buy extra flooring?",
        a: "Cuts and mistakes happen, and dye-lots change over time. A spare box from the same batch lets you repair damage later with a perfect match.",
      },
    ],
    inputs: [
      { id: "length", label: "Room length", unit: "ft", default: 15, min: 0, step: 0.5 },
      { id: "width", label: "Room width", unit: "ft", default: 12, min: 0, step: 0.5 },
      { id: "boxCoverage", label: "Coverage per box", unit: "sq ft", default: 20, min: 0.1, step: 0.5 },
      { id: "waste", label: "Waste allowance", unit: "%", default: 10, min: 0, step: 1 },
    ],
    compute: (v) => {
      const area = v.length * v.width;
      const withWaste = area * (1 + v.waste / 100);
      const boxes = Math.ceil(withWaste / v.boxCoverage);
      return [
        { label: "Boxes to buy", value: `${fmt(boxes, 0)} boxes`, highlight: true },
        { label: "Floor area", value: `${fmt(area)} sq ft` },
        { label: "Area incl. waste", value: `${fmt(withWaste)} sq ft` },
      ];
    },
  },
  {
    slug: "mulch-calculator",
    name: "Mulch Calculator",
    emoji: "🌳",
    title: "Mulch Calculator — Cubic Yards & Bags of Mulch (Free)",
    metaDescription:
      "Free mulch calculator. Find how many cubic yards and 2-cubic-foot bags of mulch you need to cover a garden bed at a given depth. Instant and accurate.",
    h1: "Mulch Calculator",
    intro: "Find how many cubic yards and bags of mulch you need for your garden beds.",
    keywords: [
      "mulch calculator",
      "how much mulch do i need",
      "cubic yards of mulch",
      "mulch bag calculator",
      "bags of mulch per yard",
    ],
    howTo: [
      "Enter the bed length and width in feet.",
      "Enter the mulch depth in inches (2-3\" is typical).",
      "Read the cubic yards and number of bags you need.",
    ],
    body: "This mulch calculator multiplies the bed area by the depth to get volume, then converts it to cubic yards (how bulk mulch is sold) and to standard 2-cubic-foot bags. A 2-3 inch layer is ideal for most beds: deep enough to suppress weeds and hold moisture, but not so deep that it smothers roots. Bulk mulch by the cubic yard is far cheaper than bags once you need more than about 12-15 bags, so the bag count helps you decide whether to bag or go bulk.",
    formula: "Cubic yards = (Length ft x Width ft x Depth ft) / 27, where Depth ft = inches / 12.",
    faq: [
      {
        q: "How many bags of mulch are in a cubic yard?",
        a: "A cubic yard is 27 cubic feet, so it takes 13.5 bags of the standard 2-cubic-foot size to equal one cubic yard.",
      },
      {
        q: "How deep should mulch be?",
        a: "2-3 inches is ideal for most garden beds. Too deep can suffocate roots and waste material.",
      },
    ],
    inputs: [
      { id: "length", label: "Bed length", unit: "ft", default: 20, min: 0, step: 0.5 },
      { id: "width", label: "Bed width", unit: "ft", default: 4, min: 0, step: 0.5 },
      { id: "depth", label: "Depth", unit: "in", default: 3, min: 0, step: 0.5 },
    ],
    compute: (v) => {
      const cf = v.length * v.width * (v.depth / 12);
      const cy = cf / 27;
      const bags = Math.ceil(cf / 2);
      return [
        { label: "Mulch needed", value: `${fmt(cy)} cubic yards`, highlight: true },
        { label: "Volume", value: `${fmt(cf)} cubic feet` },
        { label: "2 cu ft bags", value: `${fmt(bags, 0)} bags` },
      ];
    },
  },
  {
    slug: "gravel-calculator",
    name: "Gravel Calculator",
    emoji: "🪨",
    title: "Gravel Calculator — Cubic Yards & Tons of Gravel (Free)",
    metaDescription:
      "Free gravel calculator. Estimate the cubic yards, tons and weight of gravel or crushed stone needed for a driveway, path or base layer. Instant and accurate.",
    h1: "Gravel Calculator",
    intro: "Estimate the cubic yards and tons of gravel needed for a driveway, path or base.",
    keywords: [
      "gravel calculator",
      "how much gravel do i need",
      "cubic yards of gravel",
      "gravel tonnage calculator",
      "crushed stone calculator",
    ],
    howTo: [
      "Enter the length and width of the area in feet.",
      "Enter the gravel depth in inches (2-4\" is typical).",
      "Read the cubic yards and approximate tons you need.",
    ],
    body: "This gravel calculator finds the volume of your area and converts it to cubic yards and to tons. Gravel and crushed stone weigh roughly 1.4 tons per cubic yard (about 2,800 lb), though this varies a little with stone size and moisture. Suppliers usually sell gravel by the ton, so the tonnage figure is what you will order. For a driveway, a 4 inch depth over a compacted base is common; for a decorative path, 2 inches is usually enough.",
    formula: "Cubic yards = (Length ft x Width ft x Depth ft) / 27; Tons = Cubic yards x 1.4.",
    faq: [
      {
        q: "How many tons of gravel are in a cubic yard?",
        a: "About 1.4 tons (roughly 2,800 lb) per cubic yard for typical gravel and crushed stone, varying slightly with stone type and moisture.",
      },
      {
        q: "How deep should gravel be for a driveway?",
        a: "About 4 inches over a well-compacted sub-base is common for residential driveways. Decorative paths can use 2 inches.",
      },
    ],
    inputs: [
      { id: "length", label: "Length", unit: "ft", default: 20, min: 0, step: 0.5 },
      { id: "width", label: "Width", unit: "ft", default: 10, min: 0, step: 0.5 },
      { id: "depth", label: "Depth", unit: "in", default: 4, min: 0, step: 0.5 },
    ],
    compute: (v) => {
      const cf = v.length * v.width * (v.depth / 12);
      const cy = cf / 27;
      const tons = cy * 1.4;
      const lbs = tons * 2000;
      return [
        { label: "Gravel needed", value: `${fmt(tons)} tons`, highlight: true },
        { label: "Volume", value: `${fmt(cy)} cubic yards` },
        { label: "Volume", value: `${fmt(cf)} cubic feet` },
        { label: "Approx. weight", value: `${fmt(lbs, 0)} lb` },
      ];
    },
  },
];

export function getCalculator(slug: string): CalculatorDef | undefined {
  return CALCULATORS.find((c) => c.slug === slug);
}

export function relatedCalculators(slug: string): CalculatorDef[] {
  return CALCULATORS.filter((c) => c.slug !== slug);
}
