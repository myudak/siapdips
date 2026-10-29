interface AudioSession { context: AudioContext; stream: MediaStream; gain: GainNode; volume: number }
const sessions = new Map<number, AudioSession>();
// The offscreen document outlives service-worker restarts. Serialize here too,
// so a restarted worker cannot race a capture that is still being initialized.
const queues = new Map<number, Promise<unknown>>();
async function stop(tabId: number): Promise<void> {
  const session = sessions.get(tabId);
  if (!session) return;
  sessions.delete(tabId);
  for (const track of session.stream.getTracks()) track.stop();
  if (session.context.state !== "closed") await session.context.close();
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message?.target !== "tools-audio" || sender.id !== chrome.runtime.id || !sender.url?.startsWith(chrome.runtime.getURL(""))) return;
  const tabId = message.tabId as number;
  if (!Number.isInteger(tabId)) { sendResponse({ ok: false, error: "Tab audio tidak valid." }); return; }
  const queued = queues.get(tabId) ?? Promise.resolve();
  const job = queued.catch(() => undefined).then(async () => {
    let session = sessions.get(tabId);
    if (session && (session.context.state === "closed" || !session.stream.getAudioTracks().some(track => track.readyState === "live"))) {
      await stop(tabId);
      session = undefined;
    }
    if (message.action === "status") return { ok: true, volume: session?.volume };
    if (message.action === "stop") { await stop(tabId); return { ok: true }; }
    if (message.action !== "volume" || !Number.isFinite(message.volume) || message.volume < 0 || message.volume > 500) throw new Error("Volume tidak valid.");
    if (!session) {
      if (typeof message.streamId !== "string") return { ok: true, needsStream: true };
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { mandatory: { chromeMediaSource: "tab", chromeMediaSourceId: message.streamId } } as MediaTrackConstraints,
        video: false,
      });
      let context: AudioContext | undefined;
      try {
        // Construction can fail after getUserMedia has already captured the
        // tab. Keep it inside cleanup protection so that stream never leaks.
        context = new AudioContext();
        const source = context.createMediaStreamSource(stream);
        const gain = context.createGain();
        gain.gain.value = message.volume / 100;
        const compressor = context.createDynamicsCompressor();
        compressor.threshold.value = -3;
        compressor.knee.value = 3;
        compressor.ratio.value = 12;
        compressor.attack.value = 0.003;
        compressor.release.value = 0.1;
        source.connect(gain).connect(compressor).connect(context.destination);
        await context.resume();
        session = { context, stream, gain, volume: message.volume };
        sessions.set(tabId, session);
        const created = session;
        stream.getAudioTracks().forEach(track => track.addEventListener("ended", () => {
          // An ended event from an old stream must not stop its replacement.
          if (sessions.get(tabId) === created) void stop(tabId).catch(console.error);
        }, { once: true }));
      } catch (error) {
        stream.getTracks().forEach(track => track.stop());
        if (context && context.state !== "closed") await context.close().catch(() => undefined);
        throw error;
      }
    }
    session.volume = message.volume;
    session.gain.gain.setTargetAtTime(message.volume / 100, session.context.currentTime, 0.025);
    return { ok: true, volume: session.volume };
  });
  queues.set(tabId, job);
  void job.then(sendResponse).catch(error => sendResponse({ ok: false, error: error instanceof Error ? error.message : "Audio gagal diproses." })).finally(() => {
    if (queues.get(tabId) === job) queues.delete(tabId);
  });
  return true;
});
