"""Native userScripts and popup regression in an isolated Chromium profile.
Build Chrome first. Python Playwright is required. Optional site access is
pregranted only for the local test origin in the disposable extension copy.
"""
import http.server
import json
import os
from pathlib import Path
import shutil
import threading
import time
from playwright.sync_api import sync_playwright, expect
root=Path(__file__).resolve().parents[1]
run=root/'scratch'/('tools-native-console-'+str(time.time_ns()))
extension=run/'extension'
shutil.copytree(root/'dist',extension)
manifest_path=extension/'manifest.json'
manifest=json.loads(manifest_path.read_text(encoding='utf-8'))
manifest['host_permissions'].append('http://127.0.0.1/*')
manifest_path.write_text(json.dumps(manifest),encoding='utf-8')
class Handler(http.server.BaseHTTPRequestHandler):
 def do_GET(self):
  self.send_response(200);self.send_header('Content-Type','text/html')
  self.send_header('Content-Security-Policy',"default-src 'none'; script-src 'nonce-fixture'; style-src 'unsafe-inline'")
  self.end_headers();self.wfile.write(b'''<!doctype html><title>Native console fixture</title><script nonce="fixture">window.fixtureSecret=17;</script><h1 id="sample">Original heading</h1>''')
 def log_message(self,*args):pass
server=http.server.ThreadingHTTPServer(('127.0.0.1',0),Handler)
threading.Thread(target=server.serve_forever,daemon=True).start()
with sync_playwright() as p:
 context=p.chromium.launch_persistent_context(str(run/'profile'),headless=True,executable_path=os.environ.get('TOOLS_CHROMIUM_EXECUTABLE') or p.chromium.executable_path,args=[f'--disable-extensions-except={extension}',f'--load-extension={extension}'],viewport={'width':1000,'height':800},locale='en-US')
 try:
  worker=context.service_workers[0] if context.service_workers else context.wait_for_event('serviceworker')
  extension_id=worker.url.split('/')[2]
  source=context.new_page();source.goto(f'http://127.0.0.1:{server.server_port}/')
  tab_id=worker.evaluate('async()=> (await chrome.tabs.query({})).find(t=>t.url?.startsWith("http://127.0.0.1")).id')
  bridge=context.new_page();bridge.goto(f'chrome-extension://{extension_id}/src/pages/tools/capture.html')
  def status():return bridge.evaluate('id=>chrome.runtime.sendMessage({type:"console:status",tabId:id})',tab_id)
  initial=status();print('INITIAL',initial,flush=True)
  assert initial['ok'] and initial['availability']['state']=='toggle',initial
  # Native browser settings API, called only from chrome://extensions in this
  # disposable profile, mirrors its Allow User Scripts UI toggle.
  settings=context.new_page();settings.goto(f'chrome://extensions/?id={extension_id}')
  settings.evaluate('id=>chrome.developerPrivate.updateExtensionConfiguration({extensionId:id,userScriptsAccess:true})',extension_id)
  after=status();print('ENABLED',after,flush=True)
  assert after['availability']['state']=='ready',after
  settings.close()
  source.bring_to_front();worker.evaluate('id=>chrome.tabs.update(id,{active:true})',tab_id)
  worker.evaluate('()=>chrome.tabs.create({url:chrome.runtime.getURL("popup.html"),active:false})')
  for attempt in range(100):
   matches=[page for page in context.pages if page.url.endswith('/popup.html')]
   if matches:break
   source.wait_for_timeout(100)
  assert matches,[page.url for page in context.pages]
  popup=matches[0];popup.locator('[data-dev-console-card]').wait_for(state='attached',timeout=20000)
  card=popup.locator('[data-dev-console-card]')
  version=popup.get_by_label('Versi ekstensi '+manifest['version'],exact=True)
  assert version.inner_text()=='v'+manifest['version']
  editor=card.get_by_role('textbox',name='JavaScript editor')
  def execute(code,world='USER_SCRIPT'):
   expect(card.get_by_role('button',name='Run',exact=True)).to_be_enabled(timeout=5000)
   card.locator('select').first.select_option(world)
   editor.fill(code)
   card.get_by_role('button',name='Run',exact=True).evaluate('e=>e.click()')
   deadline=time.monotonic()+12
   while True:
    current=status()
    if current.get('run',{}).get('status') in ['done','error']:return current['run']
    assert time.monotonic()<deadline,current
    source.wait_for_timeout(100)
  first=execute('console.log("native",document.title); await new Promise(r=>setTimeout(r,50)); document.querySelector("#sample").textContent="Changed by Console"; return 42;')
  print('DOM',first,flush=True)
  assert first['status']=='done' and first['report']['result']=='42',first
  assert source.locator('#sample').inner_text()=='Changed by Console'
  assert first['report']['logs'][0]['text']=='native Native console fixture'
  isolated=execute('return typeof window.fixtureSecret;')
  assert isolated['report']['result']=='undefined',isolated
  main=execute('console.warn("page mode"); return window.fixtureSecret;',world='MAIN')
  print('MAIN',main,flush=True)
  assert main['report']['result']=='17' and main['report']['logs'][0]['level']=='warn',main
  failure=execute('console.log("before error"); throw new Error("Native test failure");')
  assert failure['status']=='error' and 'Native test failure' in failure['report']['error'],failure
  syntax=execute('const = ;')
  assert syntax['status']=='error',syntax
  # Save a snippet through the real card UI, then reopen the popup to check both
  # the draft/snippet and previous output survived closure.
  execute('console.log("saved"); return "persisted";')
  card.locator('details summary').click()
  card.get_by_placeholder('Nama snippet').fill('Native snippet')
  card.get_by_role('button',name='Simpan',exact=True).click()
  card.get_by_text('Snippet tersimpan di perangkat ini.',exact=True).wait_for()
  card.get_by_role('button',name='Perbesar editor').click()
  assert card.get_by_role('button',name='Ringkas editor').get_attribute('aria-expanded')=='true'
  card.screenshot(path=str(run/'dev-console-card.png'))
  popup.screenshot(path=str(run/'popup-version.png'))
  popup.close();source.bring_to_front();worker.evaluate('id=>chrome.tabs.update(id,{active:true})',tab_id)
  reopened=context.new_page();reopened.goto(f'chrome-extension://{extension_id}/popup.html')
  # The test tab itself is active after navigation; explicitly restore the web
  # target, then refresh the same card just as a user would select a target.
  worker.evaluate('id=>chrome.tabs.update(id,{active:true})',tab_id)
  card=reopened.locator('[data-dev-console-card]');card.wait_for(state='attached')
  card.get_by_role('button',name='Refresh target console').evaluate('e=>e.click()')
  reopened.wait_for_function("() => document.querySelector('[data-dev-console-card] textarea')?.value.includes('persisted')")
  assert card.get_by_role('option',name='Native snippet').count()==1
  deadline=time.monotonic()+5
  while 'persisted' not in card.get_by_role('log').inner_text():
   assert time.monotonic()<deadline
   reopened.wait_for_timeout(100)
  print('PASS: toggle, native DOM/MAIN execution under CSP, async/logs/errors, draft/snippet/output persistence, expand, installed version badge')
  print('ARTIFACT',run)
 finally:
  context.close();server.shutdown()
