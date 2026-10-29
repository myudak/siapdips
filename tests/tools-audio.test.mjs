import test from "node:test";
import assert from "node:assert/strict";

let fixtureId = 0;
const sender = { id: "test", url: "chrome-extension://test/background.js" };
function deferred() { let resolve; const promise = new Promise(r => { resolve = r; }); return { promise, resolve }; }
async function fixture() {
  let listener;
  const calls = [], tracks = [], contexts = [];
  const control = { failConstructor: false, failResume: false, gate: undefined };
  globalThis.chrome = { runtime: { id: "test", getURL: path => `chrome-extension://test/${path}`, onMessage: { addListener: fn => { listener = fn; } } } };
  class FakeAudioContext {
    currentTime = 1; destination = {}; state = "running";
    constructor() { if (control.failConstructor) throw new Error("Context construction failed"); contexts.push(this); }
    createMediaStreamSource() { return { connect: node => { calls.push("source"); return node; } }; }
    createGain() { return { gain: { value: 1, setTargetAtTime: value => calls.push(["gain", value]) }, connect: node => node }; }
    createDynamicsCompressor() { return { threshold: {}, knee: {}, ratio: {}, attack: {}, release: {}, connect: () => calls.push("output") }; }
    async resume() { if (control.failResume) throw new Error("Resume failed"); }
    async close() { this.state = "closed"; calls.push("close"); }
  }
  globalThis.AudioContext = FakeAudioContext;
  Object.defineProperty(globalThis, "navigator", { configurable: true, value: { mediaDevices: { getUserMedia: async constraints => {
    calls.push(constraints);
    const track = { readyState: "live", stop() { this.readyState = "ended"; }, addEventListener(_event, handler) { this.ended = handler; } };
    tracks.push(track);
    if (control.gate) await control.gate.promise;
    return { getTracks: () => [track], getAudioTracks: () => [track] };
  } } } });
  await import(`../src/pages/tools/audio.ts?fixture=${++fixtureId}`);
  const message = (payload, from = sender) => new Promise(resolve => {
    if (!listener({ target: "tools-audio", tabId: 1, ...payload }, from, resolve)) resolve(undefined);
  });
  return { message, calls, tracks, contexts, control, captures: () => calls.filter(c => typeof c === "object" && !Array.isArray(c)).length };
}

test("booster routes audio, reuses gain including mute, validates sender, and releases tracks", async () => {
  const { message, calls, tracks, captures } = await fixture();
  assert.equal(await message({ action: "volume", volume: 500, streamId: "id" }, { id: "test", url: "https://example.org" }), undefined);
  assert.deepEqual(await message({ action: "volume", volume: 500 }), { ok: true, needsStream: true });
  assert.deepEqual(await message({ action: "volume", volume: 500, streamId: "id" }), { ok: true, volume: 500 });
  assert.equal(calls[0].audio.mandatory.chromeMediaSource, "tab");
  assert.equal(calls[0].video, false);
  assert.ok(calls.includes("output"));
  for (const volume of [0, 200, 500]) assert.deepEqual(await message({ action: "volume", volume }), { ok: true, volume });
  assert.ok(calls.some(c => Array.isArray(c) && c[1] === 5));
  assert.equal(captures(), 1);
  assert.deepEqual(await message({ action: "status" }), { ok: true, volume: 500 });
  assert.deepEqual(await message({ action: "stop" }), { ok: true });
  assert.equal(tracks[0].readyState, "ended");
  assert.ok(calls.includes("close"));
  assert.deepEqual(await message({ action: "status" }), { ok: true, volume: undefined });
  assert.equal((await message({ action: "volume", volume: 800 })).ok, false);
});

test("AudioContext construction failure releases the already-captured tab and permits retry", async () => {
  const { message, control, tracks } = await fixture();
  control.failConstructor = true;
  assert.match((await message({ action: "volume", volume: 200, streamId: "first" })).error, /construction/);
  assert.equal(tracks[0].readyState, "ended");
  control.failConstructor = false;
  assert.deepEqual(await message({ action: "volume", volume: 200, streamId: "second" }), { ok: true, volume: 200 });
  await message({ action: "stop" });
});

test("failed graph initialization closes its context and stops all tracks", async () => {
  const { message, control, tracks, contexts } = await fixture();
  control.failResume = true;
  assert.match((await message({ action: "volume", volume: 200, streamId: "id" })).error, /Resume failed/);
  assert.equal(tracks[0].readyState, "ended");
  assert.equal(contexts[0].state, "closed");
});

test("offscreen serializes init, update and stop even across independent worker requests", async () => {
  const { message, control, captures, tracks } = await fixture();
  control.gate = deferred();
  const first = message({ action: "volume", volume: 200, streamId: "id" });
  const update = message({ action: "volume", volume: 500, streamId: "duplicate-id" });
  const stop = message({ action: "stop" });
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(captures(), 1);
  control.gate.resolve();
  assert.equal((await first).volume, 200);
  assert.equal((await update).volume, 500);
  await stop;
  assert.equal(captures(), 1);
  assert.equal(tracks[0].readyState, "ended");
});

test("dead sessions are replaced and late ended events cannot stop the replacement", async () => {
  const { message, tracks } = await fixture();
  await message({ action: "volume", volume: 200, streamId: "old" });
  tracks[0].readyState = "ended";
  assert.deepEqual(await message({ action: "volume", volume: 500 }), { ok: true, needsStream: true });
  await message({ action: "volume", volume: 500, streamId: "new" });
  tracks[0].ended();
  assert.deepEqual(await message({ action: "status" }), { ok: true, volume: 500 });
  assert.equal(tracks[1].readyState, "live");
  await message({ action: "stop" });
});
