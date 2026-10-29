import test from "node:test";
import assert from "node:assert/strict";

let fixtureId = 0;
async function fixture() {
  const state = { volume: undefined, capture: "stopped", ids: 0, releaseAfter: 0, permanentBusy: false, missingReply: false, failStart: false, captureError: undefined, onCaptureError: undefined };
  globalThis.chrome = {
    runtime: { lastError: undefined, sendMessage: async message => {
      if (state.missingReply) return undefined;
      if (message.action === "status") return { ok: true, volume: state.volume };
      if (message.action === "stop") { state.volume = undefined; if (!state.permanentBusy && !state.releaseAfter) state.capture = "stopped"; return { ok: true }; }
      if (message.streamId && state.failStart) return { ok: false, error: "Graph failed" };
      if (state.volume === undefined && !message.streamId) return { ok: true, needsStream: true };
      state.volume = message.volume; state.capture = "active";
      return { ok: true, volume: state.volume };
    } },
    permissions: { contains: async () => true },
    offscreen: { hasDocument: async () => true },
    tabCapture: {
      getCapturedTabs: callback => {
        if (state.releaseAfter > 0 && --state.releaseAfter === 0) state.capture = "stopped";
        callback([{ tabId: 7, status: state.capture }]);
      },
      getMediaStreamId: (_options, callback) => {
        state.ids++;
        if (state.captureError) {
          state.onCaptureError?.();
          chrome.runtime.lastError = { message: state.captureError };
          callback(undefined); chrome.runtime.lastError = undefined;
        } else { state.capture = "pending"; callback(`stream-${state.ids}`); }
      },
    },
  };
  const load = () => import(`../src/background/features/tools-audio.ts?worker=${++fixtureId}`);
  return { ...await load(), state, restart: load };
}

test("volume changes and worker restarts reuse the offscreen session without recapturing", async () => {
  const { boost, state, restart } = await fixture();
  assert.equal((await boost(7, 200)).volume, 200);
  assert.equal((await boost(7, 0)).volume, 0);
  const nextWorker = await restart();
  assert.equal((await nextWorker.boost(7, 500)).volume, 500);
  assert.equal(state.ids, 1);
  await nextWorker.boost(7, 100);
});

test("stop waits for Chrome to release capture before an immediate restart", async () => {
  const { boost, state } = await fixture();
  await boost(7, 200);
  state.releaseAfter = 4;
  const [stopped, restarted] = await Promise.all([boost(7, 100), boost(7, 500)]);
  assert.equal(stopped.volume, 100);
  assert.equal(restarted.volume, 500);
  assert.equal(state.ids, 2);
});

test("orphaned active capture returns recovery instructions without requesting a second stream", async () => {
  const { boost, state } = await fixture();
  state.capture = "active"; state.permanentBusy = true;
  await assert.rejects(boost(7, 200), /Klik 100%.*tutup lalu buka/);
  assert.equal(state.ids, 0);
});

test("active-stream API errors reuse a session that became ready during worker restart", async () => {
  const { boost, state } = await fixture();
  state.captureError = "Cannot capture a tab with an active stream.";
  state.onCaptureError = () => { state.volume = 200; };
  assert.equal((await boost(7, 500)).volume, 500);
  assert.equal(state.ids, 1);
});

test("active-stream API errors give actionable guidance if no reusable session exists", async () => {
  const { boost, state } = await fixture();
  state.captureError = "Cannot capture a tab with an active stream.";
  await assert.rejects(boost(7, 200), /Sesi capture.*Klik 100%/);
});

test("missing offscreen reply does not reserve a stream; failed starts release capture", async () => {
  const { boost, state } = await fixture();
  state.missingReply = true;
  await assert.rejects(boost(7, 200), /tidak merespons/);
  assert.equal(state.ids, 0);
  state.missingReply = false; state.failStart = true;
  await assert.rejects(boost(7, 200), /Graph failed/);
  assert.equal(state.capture, "stopped");
  state.failStart = false;
  assert.equal((await boost(7, 200)).volume, 200);
});

test("reset works without tabCapture in Firefox and still stops after permission revocation", async () => {
  const { boost, state } = await fixture();
  await boost(7, 200);
  chrome.permissions.contains = async () => false;
  assert.equal((await boost(7, 100)).volume, 100);
  assert.equal(state.volume, undefined);
  delete chrome.tabCapture;
  chrome.permissions.contains = async () => { throw new Error("Unknown Firefox permission"); };
  assert.equal((await boost(7, 100)).volume, 100);
});
