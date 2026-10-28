interface AudioSession { context: AudioContext; stream: MediaStream; gain: GainNode; volume: number }
const sessions = new Map<number, AudioSession>();
async function stop(tabId: number): Promise<void> {
  const session = sessions.get(tabId);
  if (!session) return;
  sessions.delete(tabId);
  for (const track of session.stream.getTracks()) track.stop();
  await session.context.close();
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message?.target !== "tools-audio" || sender.id !== chrome.runtime.id || !sender.url?.startsWith(chrome.runtime.getURL(""))) return;
  void (async () => {
    const tabId = message.tabId as number;
    if (!Number.isInteger(tabId)) throw new Error("Tab audio tidak valid.");
    if (message.action === "status") return { ok: true, volume: sessions.get(tabId)?.volume };
    if (message.action === "stop") { await stop(tabId); return { ok: true }; }
    if (message.action !== "volume" || !Number.isFinite(message.volume) || message.volume < 0 || message.volume > 500) throw new Error("Volume tidak valid.");
    let session = sessions.get(tabId);
    if (!session) {
      if (typeof message.streamId !== "string") throw new Error("Sumber audio tidak tersedia.");
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { mandatory: { chromeMediaSource: "tab", chromeMediaSourceId: message.streamId } } as MediaTrackConstraints,
        video: false,
      });
      const context = new AudioContext();
      try {
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
        stream.getAudioTracks().forEach(track => track.addEventListener("ended", () => { void stop(tabId); }, { once: true }));
      } catch (error) {
        stream.getTracks().forEach(track => track.stop());
        await context.close();
        throw error;
      }
    }
    session.volume = message.volume;
    session.gain.gain.setTargetAtTime(message.volume / 100, session.context.currentTime, 0.025);
    return { ok: true, volume: session.volume };
  })().then(sendResponse).catch(error => sendResponse({ ok: false, error: error instanceof Error ? error.message : "Audio gagal diproses." }));
  return true;
});
