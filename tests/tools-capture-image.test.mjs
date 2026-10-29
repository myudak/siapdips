import test from "node:test";
import assert from "node:assert/strict";
import { scaleCaptureTile } from "../src/lib/tools/capture-image.ts";

const geometry = { width: 1200, height: 100000, viewportWidth: 1200, viewportHeight: 800 };

test("long-page tiles are reduced to bounded output size before storage and decoded pixels released", async () => {
  let closed = false, output;
  globalThis.createImageBitmap = async () => ({ width: 2400, height: 1600, close: () => { closed = true; } });
  globalThis.OffscreenCanvas = class {
    constructor(width, height) { this.width = width; this.height = height; output = this; }
    getContext() { return { drawImage() {} }; }
    async convertToBlob() { return new Blob(["scaled"]); }
  };
  const original = new Blob(["original"]);
  const scaled = await scaleCaptureTile(original, geometry);
  assert.notEqual(scaled, original);
  assert.equal(closed, true);
  assert.ok(output.width <= 197 && output.height <= 132);
  assert.ok(output.width * (output.height * 125) < 24_000_000);
});

test("viewport captures retain their original image when no reduction is needed", async () => {
  let closed = false;
  globalThis.createImageBitmap = async () => ({ width: 1200, height: 800, close: () => { closed = true; } });
  const original = new Blob(["original"]);
  assert.equal(await scaleCaptureTile(original, { ...geometry, height: 800 }), original);
  assert.equal(closed, true);
});

test("bitmap pixels are released even if storage image encoding fails", async () => {
  let closed = false;
  globalThis.createImageBitmap = async () => ({ width: 2400, height: 1600, close: () => { closed = true; } });
  globalThis.OffscreenCanvas = class {
    getContext() { return { drawImage() {} }; }
    async convertToBlob() { throw new Error("Encoding failed"); }
  };
  await assert.rejects(scaleCaptureTile(new Blob(), geometry), /Encoding failed/);
  assert.equal(closed, true);
});
