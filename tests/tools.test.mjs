import test from "node:test";
import assert from "node:assert/strict";
import { capturePositions, captureScale, cleanTrackingUrl, normalizeSpeed, normalizeVolume, siteOrigin } from "../src/lib/tools/shared.ts";
import { readCardOrder, reconcileCardOrder } from "../src/lib/extension/card-order.ts";

test("card migration preserves custom order, removes stale IDs and appends new cards", () => {
  assert.deepEqual(reconcileCardOrder(["Notes", "Gone", "Campus", "Notes", null], ["Campus", "Notes", "Tools"]), ["Notes", "Campus", "Tools"]);
  assert.deepEqual(readCardOrder("broken-json", ["Campus", "Tools"]), ["Campus", "Tools"]);
  assert.deepEqual(readCardOrder('"not-an-array"', ["Tools"]), ["Tools"]);
});
test("media controls clamp finite values and reject invalid input", () => {
  assert.equal(normalizeSpeed(0), 0.25);
  assert.equal(normalizeSpeed(10), 4);
  assert.equal(normalizeSpeed(1.234), 1.23);
  assert.equal(normalizeVolume(-20), 0);
  assert.equal(normalizeVolume(900), 500);
  assert.throws(() => normalizeSpeed(NaN));
  assert.throws(() => normalizeVolume(Infinity));
});
test("site permissions are scoped to web origins", () => {
  assert.equal(siteOrigin("https://example.org/path?q=1"), "https://example.org");
  assert.equal(siteOrigin("http://localhost:5173/"), "http://localhost:5173");
  for (const url of ["chrome://settings", "file:///private", "javascript:alert(1)", "not-a-url"]) assert.equal(siteOrigin(url), null);
});
test("clean links preserve application parameters and fragments", () => {
  assert.equal(cleanTrackingUrl("https://example.org/watch?v=123&utm_source=mail&fbclid=abc&t=40#chapter"), "https://example.org/watch?v=123&t=40#chapter");
  assert.equal(cleanTrackingUrl("https://example.org/a?ref=course&token=abc"), "https://example.org/a?ref=course&token=abc");
  assert.throws(() => cleanTrackingUrl("javascript:alert(1)"));
});
test("capture tiles cover clamped final rows and columns without exceeding limits", () => {
  const geometry = { width: 1100, height: 1700, viewportWidth: 800, viewportHeight: 600 };
  assert.deepEqual(capturePositions(geometry), [
    { x: 0, y: 0 }, { x: 300, y: 0 }, { x: 0, y: 600 }, { x: 300, y: 600 }, { x: 0, y: 1100 }, { x: 300, y: 1100 },
  ]);
  assert.deepEqual(capturePositions({ width: 500, height: 300, viewportWidth: 800, viewportHeight: 600 }), [{ x: 0, y: 0 }]);
  assert.throws(() => capturePositions({ ...geometry, viewportHeight: 0 }));
  assert.throws(() => capturePositions({ ...geometry, height: 100000 }));
});
test("capture output respects pixel and dimension budgets while preserving small images", () => {
  const scale = captureScale(1800, 30000, 2);
  assert.ok(1800 * 30000 * scale ** 2 <= 24_000_001);
  assert.ok(30000 * scale <= 16384);
  assert.equal(captureScale(800, 600, 1), 1);
});
