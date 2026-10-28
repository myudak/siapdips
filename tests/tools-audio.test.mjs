import test from "node:test";
import assert from "node:assert/strict";

let listener;
const calls = [];
let stopped = false;
globalThis.chrome = { runtime: { id: "test", getURL: path => `chrome-extension://test/${path}`, onMessage: { addListener: fn => { listener = fn; } } } };
class FakeAudioContext {
  currentTime = 1;
  destination = {};
  createMediaStreamSource() { return { connect: node => { calls.push("source"); return node; } }; }
  createGain() { return { gain: { value: 1, setTargetAtTime: value => calls.push(["gain", value]) }, connect: node => { calls.push("gain-connect"); return node; } }; }
  createDynamicsCompressor() { return { threshold: {}, knee: {}, ratio: {}, attack: {}, release: {}, connect: () => { calls.push("output"); } }; }
  async resume() { calls.push("resume"); }
  async close() { calls.push("close"); }
}
globalThis.AudioContext = FakeAudioContext;
const stream = { getTracks: () => [{ stop: () => { stopped = true; } }], getAudioTracks: () => [{ addEventListener: () => {} }] };
Object.defineProperty(globalThis, "navigator", { configurable: true, value: { mediaDevices: { getUserMedia: async constraints => { calls.push(constraints); return stream; } } } });
await import("../src/pages/tools/audio.ts");
const sender = { id: "test", url: "chrome-extension://test/background.js" };
function message(payload, from = sender) {
  return new Promise(resolve => {
    const handled = listener({ target: "tools-audio", ...payload }, from, resolve);
    if (!handled) resolve(undefined);
  });
}
test("booster routes tab audio to output, updates gain without recapturing, and releases tracks", async () => {
  assert.equal(await message({ action: "volume", tabId: 1, volume: 500, streamId: "id" }, { id: "test", url: "https://example.org" }), undefined);
  assert.deepEqual(await message({ action: "volume", tabId: 1, volume: 500, streamId: "id" }), { ok: true, volume: 500 });
  assert.equal(calls[0].audio.mandatory.chromeMediaSource, "tab");
  assert.equal(calls[0].video, false);
  assert.ok(calls.includes("output"));
  assert.ok(calls.some(call => Array.isArray(call) && call[0] === "gain" && call[1] === 5));
  assert.deepEqual(await message({ action: "volume", tabId: 1, volume: 200 }), { ok: true, volume: 200 });
  assert.equal(calls.filter(call => typeof call === "object" && !Array.isArray(call)).length, 1);
  assert.deepEqual(await message({ action: "status", tabId: 1 }), { ok: true, volume: 200 });
  assert.deepEqual(await message({ action: "stop", tabId: 1 }), { ok: true });
  assert.ok(stopped);
  assert.ok(calls.includes("close"));
  assert.deepEqual(await message({ action: "status", tabId: 1 }), { ok: true, volume: undefined });
  assert.equal((await message({ action: "volume", tabId: 2, volume: 800 })).ok, false);
});
