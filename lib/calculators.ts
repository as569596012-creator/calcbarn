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
  formula: string; // 给用户看的公式说明（单行摘要）
  formulaSteps: string[]; // 分步推导，供"How it's calculated"卡片展示
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
    formulaSteps: [
      "Step 1 — Wall perimeter: Perimeter = 2 × (Length + Width)",
      "Step 2 — Gross wall area: Gross = Perimeter × Wall Height",
      "Step 3 — Subtract openings: Net area = Gross − (Doors × 21 ft²) − (Windows × 15 ft²)",
      "Step 4 — Apply coats: Total area = Net area × Number of coats",
      "Step 5 — Convert to gallons: Gallons = Total area ÷ 350 (coverage per gallon)",
    ],
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
    formulaSteps: [
      "Step 1 — Room area: Area = Length × Width",
      "Step 2 — Add waste: Area with waste = Area × (1 + Waste% ÷ 100)",
      "Step 3 — Divide by box coverage: Boxes = ⌈Area with waste ÷ Coverage per box⌉",
    ],
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

  // ── Tile Calculator ──────────────────────────────────────────────────────
  {
    slug: "tile-calculator",
    name: "Tile Calculator",
    emoji: "🔲",
    title: "Tile Calculator — How Many Tiles Do I Need (Free, with Waste)",
    metaDescription:
      "Free tile calculator. Find out how many tiles you need for a floor or wall by entering room size, tile size and waste allowance. Instant and accurate.",
    h1: "Tile Calculator",
    intro: "Find out how many tiles you need for a floor or wall, including a waste allowance.",
    keywords: [
      "tile calculator",
      "how many tiles do i need",
      "floor tile calculator",
      "wall tile calculator",
      "tile square footage calculator",
    ],
    howTo: [
      "Enter the room length and width in feet.",
      "Enter the tile size in inches (e.g. 12 for a 12×12 tile).",
      "Set a waste allowance (10% is standard) and read the tile count.",
    ],
    body: "This tile calculator finds your room's square footage, converts each tile to square feet, and divides to get the tile count. It adds a waste factor for cuts, breakage and future repairs — 10% is typical for straight-lay patterns; use 15% for diagonal or herringbone. Always buy from the same lot number so colours and shades match. Keep a few spare tiles for repairs.",
    formula: "Tiles = ceil( Room area × (1 + Waste%) / Tile area ), where Tile area = (Tile in ÷ 12)².",
    formulaSteps: [
      "Step 1 — Tile area in ft²: Tile area = (Tile size in inches ÷ 12)²",
      "Step 2 — Room area: Area = Length × Width",
      "Step 3 — Add waste: Area with waste = Area × (1 + Waste% ÷ 100)",
      "Step 4 — Tile count: Tiles = ⌈Area with waste ÷ Tile area⌉",
    ],
    faq: [
      {
        q: "How much waste should I add for tiles?",
        a: "10% is standard for straight-lay patterns. Use 15% for diagonal cuts and complex room shapes, which produce more off-cuts.",
      },
      {
        q: "What size tile is easiest to install?",
        a: "12×12 inch tiles are the most common and beginner-friendly. Larger formats (18×18 or 24×24) look impressive but require a flatter subfloor.",
      },
      {
        q: "Can I use this for wall tiles too?",
        a: "Yes. Enter the wall width and height instead of room length and width to calculate tiles for a shower wall or backsplash.",
      },
    ],
    inputs: [
      { id: "length", label: "Room length", unit: "ft", default: 12, min: 0, step: 0.5 },
      { id: "width", label: "Room width", unit: "ft", default: 10, min: 0, step: 0.5 },
      { id: "tileSize", label: "Tile size", unit: "in", default: 12, min: 1, step: 1 },
      { id: "waste", label: "Waste allowance", unit: "%", default: 10, min: 0, step: 1 },
    ],
    compute: (v) => {
      const roomArea = v.length * v.width;
      const tileAreaFt = Math.pow(v.tileSize / 12, 2);
      const withWaste = roomArea * (1 + v.waste / 100);
      const tiles = Math.ceil(withWaste / tileAreaFt);
      return [
        { label: "Tiles needed", value: `${fmt(tiles, 0)} tiles`, highlight: true },
        { label: "Room area", value: `${fmt(roomArea)} sq ft` },
        { label: "Area incl. waste", value: `${fmt(withWaste)} sq ft` },
        { label: "Tile area", value: `${fmt(tileAreaFt)} sq ft each` },
      ];
    },
  },

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
    formulaSteps: [
      "Step 1 — Convert thickness to feet: Thickness (ft) = Thickness (in) ÷ 12",
      "Step 2 — Find volume in cubic feet: Volume (ft³) = Length × Width × Thickness (ft)",
      "Step 3 — Convert to cubic yards: Cubic yards = Volume (ft³) ÷ 27",
      "Step 4 — Count bags: 80 lb bag ≈ 0.60 ft³ → bags = ⌈Volume ÷ 0.60⌉",
    ],
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

  // ── Drywall Calculator ────────────────────────────────────────────────────
  {
    slug: "drywall-calculator",
    name: "Drywall Calculator",
    emoji: "🧱",
    title: "Drywall Calculator — Sheets & Joint Compound Needed (Free)",
    metaDescription:
      "Free drywall calculator. Enter wall and ceiling dimensions to find how many 4×8 drywall sheets you need, plus joint compound and tape. Instant and accurate.",
    h1: "Drywall Calculator",
    intro: "Find out how many sheets of drywall and how much joint compound you need for your project.",
    keywords: [
      "drywall calculator",
      "how many sheets of drywall do i need",
      "sheetrock calculator",
      "drywall sheet calculator",
      "joint compound calculator",
    ],
    howTo: [
      "Enter the total wall area in square feet (length × height for each wall, added together).",
      "Enter the ceiling area if you are drywalling the ceiling too.",
      "Set a waste allowance (10% is typical) and read the sheet count.",
    ],
    body: "This drywall calculator divides your total area by the coverage of one standard 4×8 sheet (32 sq ft). It adds a waste allowance for cuts around outlets, windows and doors. Joint compound is estimated at roughly 0.053 gallons per square foot for three-coat work (that's about 1 gallon per 19 sq ft). Drywall tape is estimated at 1 linear foot per square foot of drywall. Always round up to whole sheets and buckets.",
    formula: "Sheets = ceil( Total area × (1 + Waste%) / 32 ); Joint compound (gal) = Total area × 0.053.",
    formulaSteps: [
      "Step 1 — Total area: Total = Wall area + Ceiling area",
      "Step 2 — Add waste: Area with waste = Total × (1 + Waste% ÷ 100)",
      "Step 3 — Sheets: Sheets = ⌈Area with waste ÷ 32⌉  (one 4×8 sheet = 32 ft²)",
      "Step 4 — Joint compound: Gallons = ⌈Total area × 0.053⌉",
      "Step 5 — Drywall tape: Tape (ft) = Total area × 1",
    ],
    faq: [
      {
        q: "What size is a standard sheet of drywall?",
        a: "4 feet wide by 8 feet tall is the most common size, covering 32 square feet. 4×12 sheets are also available and reduce seams.",
      },
      {
        q: "How thick should drywall be?",
        a: "1/2 inch is standard for walls and ceilings. Use 5/8 inch for fire-rated assemblies or ceilings with widely spaced joists.",
      },
      {
        q: "How much joint compound do I need?",
        a: "A rough guide is one 4.5-gallon bucket per 100 square feet of drywall for a three-coat finish. This calculator estimates that automatically.",
      },
    ],
    inputs: [
      { id: "wallArea", label: "Total wall area", unit: "sq ft", default: 600, min: 0, step: 10 },
      { id: "ceilingArea", label: "Ceiling area", unit: "sq ft", default: 200, min: 0, step: 10 },
      { id: "waste", label: "Waste allowance", unit: "%", default: 10, min: 0, step: 1 },
    ],
    compute: (v) => {
      const totalArea = v.wallArea + v.ceilingArea;
      const withWaste = totalArea * (1 + v.waste / 100);
      const sheets = Math.ceil(withWaste / 32);
      const compound = Math.ceil(totalArea * 0.053);
      const tape = Math.ceil(totalArea);
      return [
        { label: "Drywall sheets (4×8)", value: `${fmt(sheets, 0)} sheets`, highlight: true },
        { label: "Joint compound", value: `${fmt(compound, 0)} gallons` },
        { label: "Drywall tape", value: `${fmt(tape, 0)} lin ft` },
        { label: "Total area incl. waste", value: `${fmt(withWaste)} sq ft` },
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
    formulaSteps: [
      "Step 1 — Convert depth to feet: Depth (ft) = Depth (in) ÷ 12",
      "Step 2 — Volume in cubic feet: Volume (ft³) = Length × Width × Depth (ft)",
      "Step 3 — Convert to cubic yards: Cubic yards = Volume (ft³) ÷ 27",
      "Step 4 — Estimate weight: Tons = Cubic yards × 1.4  (gravel ≈ 2,800 lb/yd³)",
    ],
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
    formulaSteps: [
      "Step 1 — Convert depth to feet: Depth (ft) = Depth (in) ÷ 12",
      "Step 2 — Volume in cubic feet: Volume (ft³) = Length × Width × Depth (ft)",
      "Step 3 — Convert to cubic yards: Cubic yards = Volume (ft³) ÷ 27",
      "Step 4 — Count bags: Bags = ⌈Volume (ft³) ÷ 2⌉  (standard 2 ft³ bag)",
    ],
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

  // ── Roof Shingles Calculator ──────────────────────────────────────────────
  {
    slug: "roof-shingles-calculator",
    name: "Roof Shingles Calculator",
    emoji: "🏠",
    title: "Roof Shingles Calculator — Squares & Bundles Needed (Free)",
    metaDescription:
      "Free roof shingles calculator. Enter roof length, width and pitch to find how many squares and bundles of shingles you need. Includes waste factor. Instant.",
    h1: "Roof Shingles Calculator",
    intro: "Find out how many squares and bundles of shingles you need for your roof, adjusted for pitch and waste.",
    keywords: [
      "roof shingles calculator",
      "how many shingles do i need",
      "roofing calculator",
      "roofing squares calculator",
      "bundles of shingles calculator",
    ],
    howTo: [
      "Enter the roof footprint (length × width of the house) in feet.",
      "Select the roof pitch (rise over run, e.g. 6/12 is a moderate slope).",
      "Set a waste allowance and read the squares and bundles to buy.",
    ],
    body: "Roofing is measured in squares: one square = 100 sq ft of roof surface. This calculator multiplies the flat footprint by a pitch factor to get the actual sloped surface area, then adds a waste allowance for hip cuts, ridge caps and starter strips. Standard 3-tab or architectural shingles pack 3 bundles per square; some premium shingles use 4. Always add at least 10% waste — 15% for complex roofs with many valleys and hips.",
    formula: "Roof area = Footprint × Pitch factor; Squares = ceil( Roof area × (1+Waste%) / 100 ); Bundles = Squares × 3.",
    formulaSteps: [
      "Step 1 — Flat footprint: Footprint = Length × Width",
      "Step 2 — Pitch factor (slope correction): e.g. 4/12 pitch → ×1.054, 6/12 → ×1.118, 8/12 → ×1.202, 12/12 → ×1.414",
      "Step 3 — Actual roof area: Roof area = Footprint × Pitch factor",
      "Step 4 — Add waste: Area with waste = Roof area × (1 + Waste% ÷ 100)",
      "Step 5 — Squares: Squares = ⌈Area with waste ÷ 100⌉",
      "Step 6 — Bundles: Bundles = Squares × 3  (standard 3-bundle shingles)",
    ],
    faq: [
      {
        q: "What is a roofing square?",
        a: "One roofing square equals 100 square feet of roof surface area. It is the standard unit roofers use to price and order materials.",
      },
      {
        q: "How many bundles of shingles are in a square?",
        a: "Most standard 3-tab and architectural shingles come 3 bundles per square. Some heavier premium shingles require 4 bundles per square — check the package.",
      },
      {
        q: "How much waste should I add for shingles?",
        a: "10% is the minimum for a simple gable roof. Add 15% for roofs with hips, valleys, dormers or skylights due to extra cuts.",
      },
    ],
    inputs: [
      { id: "length", label: "Roof length (footprint)", unit: "ft", default: 40, min: 0, step: 1 },
      { id: "width", label: "Roof width (footprint)", unit: "ft", default: 30, min: 0, step: 1 },
      { id: "pitch", label: "Roof pitch (rise/12)", unit: "/12", default: 6, min: 0, step: 1 },
      { id: "waste", label: "Waste allowance", unit: "%", default: 10, min: 0, step: 1 },
    ],
    compute: (v) => {
      const pitchFactor = Math.sqrt(1 + Math.pow(v.pitch / 12, 2));
      const footprint = v.length * v.width;
      const roofArea = footprint * pitchFactor;
      const withWaste = roofArea * (1 + v.waste / 100);
      const squares = Math.ceil(withWaste / 100);
      const bundles = squares * 3;
      return [
        { label: "Roofing squares", value: `${fmt(squares, 0)} squares`, highlight: true },
        { label: "Bundles of shingles", value: `${fmt(bundles, 0)} bundles` },
        { label: "Actual roof area", value: `${fmt(roofArea)} sq ft` },
        { label: "Pitch factor", value: `×${fmt(pitchFactor)}` },
      ];
    },
  },

  // ── Fencing Calculator ────────────────────────────────────────────────────
  {
    slug: "fencing-calculator",
    name: "Fencing Calculator",
    emoji: "🏡",
    title: "Fencing Calculator — Posts, Rails & Pickets Needed (Free)",
    metaDescription:
      "Free fencing calculator. Enter total fence length and spacing to find the number of posts, rails and pickets you need. Includes gates. Instant and accurate.",
    h1: "Fencing Calculator",
    intro: "Find out how many posts, rails and pickets you need to build your fence.",
    keywords: [
      "fencing calculator",
      "fence calculator",
      "how many fence posts do i need",
      "fence material calculator",
      "fence picket calculator",
    ],
    howTo: [
      "Enter the total fence length in feet.",
      "Enter the post spacing in feet (6–8 ft is standard).",
      "Enter the number of gate openings, rails per section, and picket width.",
    ],
    body: "This fencing calculator works out the posts, rails and pickets for a standard wooden privacy or picket fence. Posts are spaced at equal intervals along the fence run; sections = posts − 1. Each section gets the specified number of rails. Pickets are spaced at the given width with a small gap (about 0.25 in). For gates, each opening needs two gate posts. Always add 10% extra pickets for cuts and waste.",
    formula: "Posts = floor(Length / Spacing) + 1; Pickets per section = ceil(Spacing / Picket width); Total pickets = Pickets per section × Sections.",
    formulaSteps: [
      "Step 1 — Number of sections: Sections = ⌊Total length ÷ Post spacing⌋",
      "Step 2 — Number of posts: Posts = Sections + 1 + (Gates × 2) extra gate posts",
      "Step 3 — Rails: Total rails = Sections × Rails per section",
      "Step 4 — Pickets per section: Pickets = ⌈Post spacing ÷ Picket width⌉",
      "Step 5 — Total pickets: Total = Pickets per section × Sections",
    ],
    faq: [
      {
        q: "How far apart should fence posts be?",
        a: "6 to 8 feet is the standard spacing. Closer spacing (6 ft) is stronger; 8 ft spacing works with heavier lumber.",
      },
      {
        q: "How deep should fence posts be set?",
        a: "One-third of the post's total length should be in the ground. For a 6 ft fence use 9 ft posts set 3 ft deep.",
      },
      {
        q: "How many rails does a fence need?",
        a: "Two rails (top and bottom) is standard for fences up to 4 ft. Use three rails for 6 ft privacy fences.",
      },
    ],
    inputs: [
      { id: "length", label: "Total fence length", unit: "ft", default: 100, min: 0, step: 1 },
      { id: "spacing", label: "Post spacing", unit: "ft", default: 8, min: 1, step: 0.5 },
      { id: "gates", label: "Gate openings", default: 1, min: 0, step: 1 },
      { id: "rails", label: "Rails per section", default: 2, min: 1, step: 1 },
      { id: "picketWidth", label: "Picket width", unit: "in", default: 3.5, min: 1, step: 0.25 },
    ],
    compute: (v) => {
      const sections = Math.floor(v.length / v.spacing);
      const posts = sections + 1 + v.gates * 2;
      const totalRails = sections * v.rails;
      const picketWidthFt = v.picketWidth / 12;
      const pickets = Math.ceil(sections * (v.spacing / picketWidthFt));
      return [
        { label: "Fence posts", value: `${fmt(posts, 0)} posts`, highlight: true },
        { label: "Rails", value: `${fmt(totalRails, 0)} rails` },
        { label: "Pickets", value: `${fmt(pickets, 0)} pickets` },
        { label: "Sections", value: `${fmt(sections, 0)} sections` },
      ];
    },
  },

  // ── Deck Calculator ───────────────────────────────────────────────────────
  {
    slug: "deck-calculator",
    name: "Deck Calculator",
    emoji: "🪵",
    title: "Deck Calculator — How Many Deck Boards Do I Need (Free)",
    metaDescription:
      "Free deck board calculator. Enter your deck size and board width to find out how many deck boards you need, including a waste factor. Instant and accurate.",
    h1: "Deck Board Calculator",
    intro: "Find out how many deck boards you need for your deck or patio, with waste included.",
    keywords: [
      "deck calculator",
      "deck board calculator",
      "how many deck boards do i need",
      "deck material calculator",
      "deck square footage calculator",
    ],
    howTo: [
      "Enter the deck length and width in feet.",
      "Enter the board width in inches (5.5\" is common for 2×6 boards).",
      "Set a waste allowance and read the board count and linear feet.",
    ],
    body: "This deck board calculator works out how many boards you need to cover a rectangular deck. It divides the deck area by the coverage of one board (length × width). Add a 10% waste allowance for end cuts, bad boards and future repairs — use 15% if your deck has angled corners or a picture-frame border. Results show board count and total linear feet, which is how lumber yards typically sell decking.",
    formula: "Boards = ceil( Deck area × (1 + Waste%) / (Board width ft × Board length ft) ).",
    formulaSteps: [
      "Step 1 — Board width in feet: Board width (ft) = Board width (in) ÷ 12",
      "Step 2 — Deck area: Area = Deck length × Deck width",
      "Step 3 — Add waste: Area with waste = Area × (1 + Waste% ÷ 100)",
      "Step 4 — Board count: Boards = ⌈Area with waste ÷ (Board width ft × Deck length)⌉",
      "Step 5 — Linear feet: Linear ft = Boards × Deck length",
    ],
    faq: [
      {
        q: "What width are most deck boards?",
        a: "2×6 lumber has an actual width of 5.5 inches; 5/4×6 decking is also 5.5 inches wide. Use 3.5 inches for 2×4 boards.",
      },
      {
        q: "How much waste should I add for decking?",
        a: "10% is standard for a simple rectangular deck. Use 15% for decks with angled cuts, picture-frame borders or complex shapes.",
      },
      {
        q: "Does this include the frame and joists?",
        a: "No, this calculates decking boards only. The structural frame (beams, joists, posts, hardware) requires a separate estimate.",
      },
    ],
    inputs: [
      { id: "length", label: "Deck length", unit: "ft", default: 16, min: 0, step: 0.5 },
      { id: "width", label: "Deck width", unit: "ft", default: 12, min: 0, step: 0.5 },
      { id: "boardWidth", label: "Board width", unit: "in", default: 5.5, min: 1, step: 0.25 },
      { id: "waste", label: "Waste allowance", unit: "%", default: 10, min: 0, step: 1 },
    ],
    compute: (v) => {
      const deckArea = v.length * v.width;
      const boardWidthFt = v.boardWidth / 12;
      const withWaste = deckArea * (1 + v.waste / 100);
      const boards = Math.ceil(withWaste / (boardWidthFt * v.length));
      const linearFt = boards * v.length;
      return [
        { label: "Deck boards needed", value: `${fmt(boards, 0)} boards`, highlight: true },
        { label: "Linear feet of decking", value: `${fmt(linearFt)} lin ft` },
        { label: "Deck area", value: `${fmt(deckArea)} sq ft` },
        { label: "Area incl. waste", value: `${fmt(withWaste)} sq ft` },
      ];
    },
  },

  // ── Asphalt Calculator ────────────────────────────────────────────────────
  {
    slug: "asphalt-calculator",
    name: "Asphalt Calculator",
    emoji: "🚗",
    title: "Asphalt Calculator — Tons of Asphalt for Driveways & Paths (Free)",
    metaDescription:
      "Free asphalt calculator. Estimate the tons of hot-mix asphalt needed for a driveway, parking lot or path. Enter dimensions and depth. Instant and accurate.",
    h1: "Asphalt Calculator",
    intro: "Estimate the tons of asphalt you need for a driveway, parking lot or path.",
    keywords: [
      "asphalt calculator",
      "blacktop calculator",
      "how much asphalt do i need",
      "asphalt tonnage calculator",
      "driveway asphalt calculator",
    ],
    howTo: [
      "Enter the length and width of the area in feet.",
      "Enter the asphalt depth in inches (2–3\" for a top coat; 4\" for a full driveway).",
      "Read the cubic yards and tons of hot-mix asphalt to order.",
    ],
    body: "This asphalt calculator works out the volume of your paved area and converts it to tons of hot-mix asphalt (HMA). Asphalt weighs about 145 lb per cubic foot, or roughly 2.0 tons per cubic yard — slightly heavier than gravel. For a typical residential driveway, use a 4-inch depth over a compacted gravel base. For a resurfacing overlay (top coat only), 2 inches is common. Suppliers sell asphalt by the ton, so that figure is what you will give them when ordering.",
    formula: "Cubic yards = (Length × Width × Depth ft) / 27; Tons = Cubic yards × 2.0.",
    formulaSteps: [
      "Step 1 — Convert depth to feet: Depth (ft) = Depth (in) ÷ 12",
      "Step 2 — Volume in cubic feet: Volume (ft³) = Length × Width × Depth (ft)",
      "Step 3 — Convert to cubic yards: Cubic yards = Volume (ft³) ÷ 27",
      "Step 4 — Weight in tons: Tons = Cubic yards × 2.0  (HMA ≈ 145 lb/ft³ ≈ 2.0 t/yd³)",
    ],
    faq: [
      {
        q: "How thick should a residential driveway be?",
        a: "A new residential driveway typically uses 4 inches of compacted hot-mix asphalt over a 6-inch compacted gravel base. Resurface overlays are usually 2 inches.",
      },
      {
        q: "How many tons of asphalt are in a cubic yard?",
        a: "Hot-mix asphalt weighs about 145 lb per cubic foot, which is approximately 2.0 tons per cubic yard. This is denser than gravel (1.4 t/yd³).",
      },
      {
        q: "What is the difference between asphalt and blacktop?",
        a: "They are essentially the same material. 'Blacktop' is the common residential term; 'asphalt' or 'hot-mix asphalt (HMA)' is the industry term.",
      },
    ],
    inputs: [
      { id: "length", label: "Length", unit: "ft", default: 40, min: 0, step: 1 },
      { id: "width", label: "Width", unit: "ft", default: 12, min: 0, step: 0.5 },
      { id: "depth", label: "Depth", unit: "in", default: 4, min: 0, step: 0.5 },
    ],
    compute: (v) => {
      const cf = v.length * v.width * (v.depth / 12);
      const cy = cf / 27;
      const tons = cy * 2.0;
      const lbs = tons * 2000;
      return [
        { label: "Asphalt needed", value: `${fmt(tons)} tons`, highlight: true },
        { label: "Volume", value: `${fmt(cy)} cubic yards` },
        { label: "Volume", value: `${fmt(cf)} cubic feet` },
        { label: "Approx. weight", value: `${fmt(lbs, 0)} lb` },
      ];
    },
  }
];

export function getCalculator(slug: string): CalculatorDef | undefined {
  return CALCULATORS.find((c) => c.slug === slug);
}

export function relatedCalculators(slug: string): CalculatorDef[] {
  return CALCULATORS.filter((c) => c.slug !== slug);
}
