import { readFileSync, writeFileSync } from "fs";

const src = readFileSync("lib/calculators.ts", "utf8");

const MARKER = "export const CALCULATORS: CalculatorDef[] = [";
const arrayStart = src.indexOf(MARKER);
const arrayEnd = src.lastIndexOf("];") + 2;

const before = src.slice(0, arrayStart);
const after = src.slice(arrayEnd);
const arrayContent = src.slice(arrayStart + MARKER.length, arrayEnd - 2);

// 按 slug: "xxx" 定位每个对象边界
const slugRe = /\n  \/\/[^\n]*\n  \{[\s\S]*?slug: "([^"]+)"|\n  \{[\s\S]*?slug: "([^"]+)"/g;
const slugMatches = [...arrayContent.matchAll(/\n(?:  \/\/[^\n]*\n)?  \{\s*\n\s*slug: "([^"]+)"/g)];

const blocks = {};
slugMatches.forEach((m, i) => {
  const start = m.index;
  const end = i + 1 < slugMatches.length ? slugMatches[i + 1].index : arrayContent.length;
  let block = arrayContent.slice(start, end).trimEnd();
  // Ensure trailing comma
  if (!block.endsWith(",")) block += ",";
  blocks[m[1]] = block;
});

console.log("Found slugs:", Object.keys(blocks).join(", "));

// 新顺序：按美国 DIY 使用频率 / 搜索量排列
const order = [
  "paint-calculator",        // ~40K/mo "how much paint do i need"
  "flooring-calculator",     // ~20K/mo
  "tile-calculator",         // ~20K/mo "how many tiles do i need"
  "concrete-calculator",     // ~20K/mo
  "drywall-calculator",      // ~10K/mo
  "gravel-calculator",       // ~15K/mo
  "mulch-calculator",        // ~10K/mo
  "roof-shingles-calculator",// ~8K/mo
  "fencing-calculator",      // ~8K/mo
  "deck-calculator",         // ~8K/mo
  "asphalt-calculator",      // ~5K/mo
];

const reordered = order.map((slug) => {
  if (!blocks[slug]) throw new Error("Missing block for: " + slug);
  return blocks[slug];
});

// Remove trailing comma from the last entry
const last = reordered.length - 1;
reordered[last] = reordered[last].replace(/,\s*$/, "");

const newFile =
  before +
  MARKER +
  reordered.join("\n") +
  "\n];" +
  after;

writeFileSync("lib/calculators.ts", newFile, "utf8");
console.log("Reordered successfully.");
