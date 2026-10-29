"""Real scrolling capture/editor regression in an isolated Chromium profile.
Build Chrome, then run python tests/tools-capture-native-check.py.
Requires Python Playwright. Only the disposable copy pregrants host access.
The long page needs >120 real captures and takes roughly 90 seconds.
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
run = root / "scratch" / ("tools-native-capture-" + str(time.time_ns()))
extension = run / "extension"
shutil.copytree(root / "dist", extension)
manifest_path = extension / "manifest.json"
manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
assert "service_worker" in manifest["background"], "Build Chrome first."
# Native captureVisibleTab needs the action grant or all-sites host access.
# Pregrant host access only inside this isolated test copy.
manifest["host_permissions"].append("<all_urls>")
manifest_path.write_text(json.dumps(manifest), encoding="utf-8")

class Handler(http.server.BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header("Content-Type", "text/html")
        self.end_headers()
        self.wfile.write(b'''<!doctype html><html><head><title>Native long screenshot</title><style>body{margin:0;min-height:78000px;background:rgb(18,59,122)}#top,#bottom{position:absolute;width:100%;height:500px}#top{top:0;background:rgb(240,60,60)}#bottom{top:77500px;background:rgb(30,220,70)}</style></head><body><div id="top">Top of long page</div><div id="bottom">Bottom of long page</div></body></html>''')
    def log_message(self, *_args):
        pass
server = http.server.ThreadingHTTPServer(("127.0.0.1", 0), Handler)
threading.Thread(target=server.serve_forever, daemon=True).start()
with sync_playwright() as p:
    context = p.chromium.launch_persistent_context(
        str(run / "profile"), headless=True,
        executable_path=os.environ.get("TOOLS_CHROMIUM_EXECUTABLE") or p.chromium.executable_path,
        args=[f"--disable-extensions-except={extension}", f"--load-extension={extension}"],
        viewport={"width": 800, "height": 600},
    )
    try:
        worker = context.service_workers[0] if context.service_workers else context.wait_for_event("serviceworker")
        extension_id = worker.url.split("/")[2]
        source = context.new_page()
        source.goto(f"http://127.0.0.1:{server.server_port}/")
        source.evaluate("window.scrollTo(0,123)")
        tab_id = worker.evaluate('async()=> (await chrome.tabs.query({})).find(t=>t.url?.startsWith("http://127.0.0.1")).id')
        source.wait_for_timeout(1000)
        for page in context.pages:
            if page.url.endswith("/option.html"):
                page.close()
        worker.evaluate("id=>chrome.tabs.update(id,{active:true})", tab_id)
        opened = worker.evaluate('()=>chrome.tabs.create({url:chrome.runtime.getURL("popup.html"),active:false})')
        for _attempt in range(60):
            matches = [page for page in context.pages if page.url.endswith("/popup.html")]
            if matches:
                break
            source.wait_for_timeout(100)
        assert matches, (opened, [page.url for page in context.pages])
        popup = matches[0]
        try:
            popup.wait_for_selector("[data-tools-card]", state="attached", timeout=20000)
        except Exception:
            print("POPUP_FAILURE", popup.url, popup.locator("body").inner_text(), flush=True)
            raise
        popup.get_by_role("tab", name="Capture", exact=True).evaluate("e=>e.click()")
        created = []
        context.on("page", lambda page: created.append(page))
        def full_page():
            popup.get_by_role("button", name="Full page screenshot").evaluate("e=>e.click()")
            popup.locator('progress[aria-label="Progres screenshot"]').wait_for(state="attached")
            status = popup.evaluate('id=>chrome.runtime.sendMessage({type:"tools:status",tabId:id})', tab_id)
            assert status.get("captureId"), status
            return status["captureId"]
        def status(capture_id):
            reply = popup.evaluate('id=>chrome.runtime.sendMessage({type:"tools:captureStatus",captureId:id})', capture_id)
            assert reply.get("ok"), reply
            return reply["capture"]
        capture_id = full_page()
        deadline = time.monotonic() + 180
        last_printed = -1
        while True:
            record = status(capture_id)
            assert record["status"] != "error", record
            if record["total"]:
                assert record["total"] > 120, record
            if record["status"] == "ready":
                break
            if record["progress"] < record["total"]:
                assert not created, "Capture must not open options/editor before it succeeds"
            if record["progress"] // 20 != last_printed:
                print("PROGRESS", record["progress"], "/", record["total"], flush=True)
                last_printed = record["progress"] // 20
            assert time.monotonic() < deadline, record
            source.wait_for_timeout(500)
        source.wait_for_timeout(300)
        editors = [page for page in created if "capture.html?id=" in page.url]
        assert len(editors) == 1 and len(created) == 1, [page.url for page in created]
        editor = editors[0]
        editor.locator("canvas").wait_for(state="visible", timeout=20000)
        assert not editor.get_by_role("alert").count(), editor.locator("body").inner_text()
        pixels = editor.locator("canvas").evaluate("""canvas=>{
          const ctx=canvas.getContext('2d');
          return {width:canvas.width,height:canvas.height,
            top:[...ctx.getImageData(Math.floor(canvas.width/2),20,1,1).data],
            bottom:[...ctx.getImageData(Math.floor(canvas.width/2),canvas.height-20,1,1).data]};
        }""")
        assert 0 < pixels["width"] and 0 < pixels["height"] <= 16384, pixels
        assert pixels["top"][0] > 200 and pixels["top"][1] < 100, pixels
        assert pixels["bottom"][1] > 180 and pixels["bottom"][0] < 80, pixels
        assert source.evaluate("scrollY") == 123
        editor.screenshot(path=str(run / "long-page-editor.png"))
        with editor.expect_download() as download_event:
            editor.get_by_role("button", name="Simpan PNG").click()
        download_event.value.save_as(str(run / "long-page.png"))
        print("LONG_PAGE", json.dumps(pixels), flush=True)
        # Start a shorter capture, cancel from the real production popup, and
        # ensure neither an editor nor options page is opened for the failure.
        source.evaluate('document.body.style.minHeight="1800px";document.getElementById("bottom").style.top="1300px"')
        worker.evaluate("id=>chrome.tabs.update(id,{active:true})", tab_id)
        popup.wait_for_function('![...document.querySelectorAll("button")].find(b=>b.textContent.includes("Full page screenshot")).disabled')
        created.clear()
        cancelled_id = full_page()
        popup.get_by_role("button", name="Batalkan screenshot").evaluate("e=>e.click()")
        deadline = time.monotonic() + 10
        while status(cancelled_id)["status"] == "capturing":
            assert time.monotonic() < deadline
            source.wait_for_timeout(200)
        source.wait_for_timeout(500)
        assert not created, [page.url for page in created]
        print("PASS: >120 real tiles, visible popup progress, correct editor route, top/bottom pixels, PNG download, scroll restoration, and cancel without navigation")
        print("ARTIFACT", run)
    finally:
        context.close()
        server.shutdown()
