"""Native Chromium smoke check; requires Python Playwright and its Chromium.

Run npm run dev, npm run build:chrome, then python tests/tools-native-check.py.
Only an isolated copy receives pregranted test permissions. The optional audio
prompt and toolbar invocation still require a manual browser check.
"""
import json, pathlib, shutil, time, wave, math, struct, os
from playwright.sync_api import sync_playwright

root = pathlib.Path(__file__).resolve().parents[1]
with wave.open(str(root / 'scratch' / 'tools-native-tone.wav'), 'wb') as wav:
    wav.setparams((1, 2, 8000, 8000, 'NONE', 'not compressed'))
    wav.writeframes(b''.join(struct.pack('<h', int(1000*math.sin(i*2*math.pi*440/8000))) for i in range(8000)))
run = root / 'scratch' / ('tools-native-' + str(int(time.time())))
extension = run / 'extension'
shutil.copytree(root / 'dist', extension)
manifest_path = extension / 'manifest.json'
manifest = json.loads(manifest_path.read_text(encoding='utf-8'))
# Native audio pipeline check only: pregrant the two permissions in this isolated
# test copy. Production retains optional permissions; request/decline UI is tested
# separately in the browser fixture.
manifest['permissions'] += ['tabCapture', 'offscreen']
manifest['host_permissions'].append('<all_urls>')
manifest.pop('optional_permissions', None)
manifest['commands']={'_execute_action':{'suggested_key':{'default':'Ctrl+Shift+Y'}}}
manifest_path.write_text(json.dumps(manifest), encoding='utf-8')

with sync_playwright() as p:
    context = p.chromium.launch_persistent_context(
        str(run / 'profile'), headless=True,
        executable_path=os.environ.get('TOOLS_CHROMIUM_EXECUTABLE') or p.chromium.executable_path,
        args=[f'--disable-extensions-except={extension}',f'--load-extension={extension}', '--autoplay-policy=no-user-gesture-required'],
        viewport={'width':1000,'height':700},
    )
    try:
        worker = context.service_workers[0] if context.service_workers else context.wait_for_event('serviceworker',timeout=20000)
        print('WORKER',worker.url,flush=True)
        page=context.new_page()
        page.goto('http://127.0.0.1:5173/tests/fixtures/native-tools.html')
        page.locator('#start').click()
        tab_id=worker.evaluate("async()=>{const tabs=await chrome.tabs.query({});return tabs.find(t=>t.url?.includes('native-tools.html')).id}")
        extension_id=worker.url.split('/')[2]
        bridge=context.new_page()
        bridge.goto(f'chrome-extension://{extension_id}/src/pages/tools/capture.html')
        page.bring_to_front()
        worker.evaluate('()=>chrome.action.openPopup()')
        page.wait_for_timeout(300)
        print('ACTION_PAGES',[p.url for p in context.pages],flush=True)
        def send(message):
            return bridge.evaluate('(m)=>chrome.runtime.sendMessage(m)', {'tabId':tab_id,**message})
        print('STATUS', json.dumps(send({'type':'tools:status'})), flush=True)
        print('SPEED',json.dumps(send({'type':'tools:page','request':{'action':'speed','value':3}})),flush=True)
        assert page.locator('video').evaluate('(v)=>v.playbackRate') == 3
        page.locator('video').evaluate('(v)=>v.playbackRate=1')
        page.wait_for_function('document.querySelector("video").playbackRate===3')
        audio_result=send({'type':'tools:boost','volume':200})
        print('BOOST', json.dumps(audio_result), flush=True)
        if not audio_result.get('ok'):
            print('AUDIO_NATIVE_NOT_VERIFIED: headless test cannot invoke the toolbar action; test audio manually from the real popup.',flush=True)
        print('AUDIO_STATUS', json.dumps(send({'type':'tools:status'})), flush=True)
        print('STOP_AUDIO', json.dumps(send({'type':'tools:boost','volume':100})), flush=True)
        print('RESET',json.dumps(send({'type':'tools:page','request':{'action':'reset'}})),flush=True)
        assert page.locator('video').evaluate('(v)=>v.playbackRate') == 1
        page.evaluate('window.scrollTo(0,100)')
        with context.expect_page(timeout=30000) as editor_event:
            capture=send({'type':'tools:capture','mode':'full'})
            print('CAPTURE',json.dumps(capture),flush=True)
        editor=editor_event.value
        try:
            editor.wait_for_selector('canvas',state='visible',timeout=15000)
        except Exception:
            print('EDITOR_ERROR',editor.locator('body').inner_text(),flush=True)
            raise
        print('EDITOR',editor.locator('canvas').evaluate('(c)=>({width:c.width,height:c.height})'),flush=True)
        print('RESTORED_SCROLL',page.evaluate('scrollY'),flush=True)
        editor.screenshot(path=str(run/'capture-editor.png'),full_page=False)
        print('ARTIFACT',str(run),flush=True)
    finally:
        context.close()
