"""Exercise real Chromium tab audio in an isolated, disposable extension profile.

Build Chrome first, then run python tests/tools-audio-native-check.py.
The test copy pregrants optional permissions and uses Chromium's extension test
allowlist to substitute for toolbar invocation. Production permissions and the
user's browser are untouched; this does not test the permission prompt UI.
"""
import http.server
import json
import os
from pathlib import Path
import shutil
import threading
import time
from playwright.sync_api import sync_playwright

root = Path(__file__).resolve().parents[1]
run = root / "scratch" / ("tools-native-audio-" + str(time.time_ns()))
extension = run / "extension"
shutil.copytree(root / "dist", extension)
manifest_path = extension / "manifest.json"
manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
assert "service_worker" in manifest["background"], "Build Chrome before running this check."
manifest["permissions"] += ["tabCapture", "offscreen"]
manifest["host_permissions"].append("http://127.0.0.1/*")
manifest.pop("optional_permissions", None)
manifest_path.write_text(json.dumps(manifest), encoding="utf-8")
html = extension / "src/pages/tools/audio.html"
html.write_text(html.read_text(encoding="utf-8").replace("</head>", '<script src="/audio-test-hook.js"></script></head>'), encoding="utf-8")
(extension / "audio-test-hook.js").write_text("""
const streams = [], contexts = [];
let failNext = false;
const getUserMedia = navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);
navigator.mediaDevices.getUserMedia = async (...args) => {
  const stream = await getUserMedia(...args); streams.push(stream); return stream;
};
const OriginalAudioContext = window.AudioContext;
window.AudioContext = class extends OriginalAudioContext {
  constructor(...args) {
    if (failNext) { failNext = false; throw new Error("Injected AudioContext construction failure"); }
    super(...args); contexts.push(this);
  }
  createGain() { const gain = super.createGain(); this.testGain = gain; return gain; }
};
chrome.runtime.onMessage.addListener((message, _sender, respond) => {
  if (message.target !== "tools-audio-native-test") return;
  if (message.failNext) failNext = true;
  respond({ tracks: streams.map(s => s.getTracks().map(t => t.readyState)),
    contexts: contexts.map(c => ({ state: c.state, gain: c.testGain?.gain.value })) });
});
""", encoding="utf-8")

class Handler(http.server.BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header("Content-Type", "text/html")
        self.end_headers()
        self.wfile.write(b'''<button onclick="window.audio=new AudioContext();let o=audio.createOscillator();let g=audio.createGain();g.gain.value=.02;o.connect(g).connect(audio.destination);o.start()">Play tone</button>''')
    def log_message(self, *_args):
        pass

server = http.server.ThreadingHTTPServer(("127.0.0.1", 0), Handler)
threading.Thread(target=server.serve_forever, daemon=True).start()
with sync_playwright() as p:
    binary = os.environ.get("TOOLS_CHROMIUM_EXECUTABLE") or p.chromium.executable_path
    args = [f"--disable-extensions-except={extension}", f"--load-extension={extension}", "--autoplay-policy=no-user-gesture-required"]
    def launch(extra=()):
        return p.chromium.launch_persistent_context(str(run / "profile"), headless=True, executable_path=binary, args=[*args, *extra])
    # Discover the path-derived ID before adding only this test extension to
    # Chromium's capture allowlist (also used by Chromium's tabCapture tests).
    context = launch()
    worker = context.service_workers[0] if context.service_workers else context.wait_for_event("serviceworker")
    extension_id = worker.url.split("/")[2]
    context.close()
    context = launch([f"--allowlisted-extension-id={extension_id}"])
    try:
        worker = context.service_workers[0] if context.service_workers else context.wait_for_event("serviceworker")
        page = context.new_page()
        page.goto(f"http://127.0.0.1:{server.server_port}/")
        page.locator("button").click()
        tab_id = worker.evaluate('async()=> (await chrome.tabs.query({})).find(t=>t.url?.startsWith("http://127.0.0.1")).id')
        bridge = context.new_page()
        bridge.goto(f"chrome-extension://{extension_id}/src/pages/tools/capture.html")
        def send(volume):
            return bridge.evaluate("m=>chrome.runtime.sendMessage(m)", {"type": "tools:boost", "tabId": tab_id, "volume": volume})
        def hook(**payload):
            return bridge.evaluate("m=>chrome.runtime.sendMessage(m)", {"target": "tools-audio-native-test", **payload})
        def boost(volume):
            reply = send(volume)
            assert reply == {"ok": True, "volume": volume}, reply
        def captured():
            return bridge.evaluate("()=>chrome.tabCapture.getCapturedTabs()")
        boost(200)
        boost(500)
        boost(0)
        boost(200)
        assert len(hook()["tracks"]) == 1, "Gain updates must reuse the same real stream"
        boost(100)
        assert all(c["status"] not in ["active", "pending"] for c in captured())
        # A genuine captured MediaStream followed by an injected constructor
        # failure reproduces the previously leaked capture / active-stream error.
        hook(failNext=True)
        failure = send(200)
        assert not failure["ok"] and "construction failure" in failure["error"], failure
        if any(state == "live" for tracks in hook()["tracks"] for state in tracks):
            print("RETRY_WITH_LEAK", send(200), flush=True)
        assert all(state == "ended" for tracks in hook()["tracks"] for state in tracks), ("Captured tracks leaked after failure", captured(), hook())
        boost(500)
        page.wait_for_timeout(150)
        state = hook()
        assert state["contexts"][-1]["state"] == "running", state
        assert state["contexts"][-1]["gain"] > 4.9, state
        # Closing/reopening the popup/extension page must preserve the session.
        bridge.close()
        bridge = context.new_page()
        bridge.goto(f"chrome-extension://{extension_id}/src/pages/tools/capture.html")
        boost(200)
        assert len(hook()["tracks"]) == 3, hook()
        for volume in [100, 200, 100, 500, 100]:
            boost(volume)
        assert all(c["status"] not in ["active", "pending"] for c in captured())
        print("PASS: native capture/gain/mute/reuse, failed-constructor cleanup, popup closure, rapid stop/restart")
        print("ARTIFACT", run)
    finally:
        context.close()
        server.shutdown()
