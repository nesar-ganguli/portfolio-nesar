import { readFileSync } from "node:fs";
import assert from "node:assert/strict";
import { getPointerInfluence } from "../src/systemCanvasMotion.js";

const source = readFileSync(new URL("../src/main.jsx", import.meta.url), "utf8");

const expectations = [
  ["navbar initials", "NBG"],
  ["contact Gmail address", "nesarbhaskarganguli@gmail.com"],
  ["experience timeline layout", "experience-timeline"],
  ["timeline alternating items", "timeline-item-left"],
  ["hero pointer field", "getPointerInfluence"],
  ["ClipDial project title", "title: \"ClipDial\""],
  ["ClipDial live website", "https://clipdial.nbglabs.workers.dev/"],
  ["Windows availability", "Windows"],
  ["local-first privacy language", "No accounts, no cloud sync, no clipboard monitoring."],
];

const missing = expectations.filter(([, text]) => !source.includes(text));

if (missing.length > 0) {
  throw new Error(`Missing portfolio content: ${missing.map(([label]) => label).join(", ")}`);
}

if (source.includes("className=\"hero-role")) {
  throw new Error("Hero role line must stay inside the animated hero summary stack to avoid scroll overlap.");
}

const nearbyInfluence = getPointerInfluence(
  { x: 120, y: 100 },
  { x: 80, y: 100 },
);
const distantInfluence = getPointerInfluence(
  { x: 500, y: 500 },
  { x: 80, y: 100 },
);
const centeredInfluence = getPointerInfluence(
  { x: 80, y: 100 },
  { x: 80, y: 100 },
);

assert.ok(nearbyInfluence.intensity > 0.5, "Nearby skill nodes should react strongly to the pointer field.");
assert.ok(nearbyInfluence.offsetX > 0, "The pointer field should gently repel nearby skill nodes.");
assert.deepEqual(distantInfluence, { offsetX: 0, offsetY: 0, intensity: 0 });
assert.ok(Number.isFinite(centeredInfluence.offsetX) && Number.isFinite(centeredInfluence.offsetY));
