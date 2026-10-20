// 画面の見た目をトークンと部品だけで書かせるための検査（docs/product/design.md）。
// src/ui と src/index.css の外で、任意の値・色の直書き・style 属性を使っていたら落とす。
import { readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = new URL("../src/", import.meta.url).pathname;
const EXEMPT = ["ui/", "index.css"];

const RULES = [
  { pattern: /\b[\w:-]+-\[[^\]\s]+\]/g, message: "任意の値のクラス（例: text-[13px]）は使わない" },
  { pattern: /#[0-9a-fA-F]{3,8}\b/g, message: "色を直接書かない" },
  { pattern: /\b(?:rgba?|hsla?|oklch|oklab)\(/g, message: "色を直接書かない" },
  {
    pattern: /\sstyle=\{/g,
    message: "style 属性を使わない（長さが値で決まるものは src/ui の部品を使う）",
  },
];

function* files(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* files(path);
    else if (/\.(tsx?|css)$/.test(entry.name)) yield path;
  }
}

const violations = [];
for (const path of files(ROOT)) {
  const rel = relative(ROOT, path);
  if (EXEMPT.some((e) => rel === e || rel.startsWith(e)) || /\.test\.tsx?$/.test(rel)) continue;
  readFileSync(path, "utf8")
    .split("\n")
    .forEach((line, i) => {
      for (const { pattern, message } of RULES) {
        for (const match of line.matchAll(pattern)) {
          violations.push(`src/${rel}:${i + 1}: ${message}: ${match[0].trim()}`);
        }
      }
    });
}

if (violations.length > 0) {
  console.error(violations.join("\n"));
  console.error(
    `\n${violations.length} 件。トークンに無い値が要るときは docs/product/design.md を見る。`,
  );
  process.exit(1);
}
