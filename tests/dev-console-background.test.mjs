import test from "node:test";
import assert from "node:assert/strict";
import vm from "node:vm";
let id = 0;
async function fixture() {
  const values = {}, injections = [], handlers = [], removed = [];
  const state = { allowed: true, permission: true, optional: false, enabled: true, url:'https://example.org/test', documentUrl:'https://example.org/test', documentId:'doc-one', gate: undefined, injectionError:undefined };
  globalThis.chrome = {
    runtime: { id:'extension', getURL:p=>'chrome-extension://extension/'+p, getManifest:()=>({permissions:state.optional?[]:['userScripts']}), onMessage:{addListener:fn=>handlers.push(fn)} },
    permissions:{ contains:async query=>query.origins?state.allowed:state.permission },
    tabs:{get:async tabId=>({id:tabId,url:state.url}),onRemoved:{addListener:fn=>removed.push(fn)}},
    storage:{session:{get:async key=>({[key]:structuredClone(values[key])}),set:async update=>Object.assign(values,structuredClone(update)),remove:async key=>delete values[key]}},
    scripting:{executeScript:async()=>[{frameId:0,documentId:state.documentId,result:state.documentUrl}]},
    userScripts:{getScripts:async()=>{if(!state.enabled)throw Error('disabled');return []},execute:async injection=>{
      injections.push(injection);if(state.gate)await state.gate;if(state.injectionError)throw Error(state.injectionError);
      const result=await vm.runInNewContext(injection.js[0].code,{performance,document:{title:'Fixture'},location:{href:state.url},setTimeout});
      return [{frameId:0,result}];
    }},
  };
  const api = await import(`../src/background/features/dev-console.ts?fixture=${++id}`);
  const request = {type:'console:run',tabId:4,url:state.url,world:'USER_SCRIPT',code:'console.log(document.title); return 2;'};
  const settled = async()=>{for(let n=0;n<30;n++){const run=(await api.handleConsole({type:'console:status',tabId:4})).run;if(run?.status!=='running')return run;await new Promise(r=>setTimeout(r,5));}throw Error('not settled')};
  return {...api,state,values,injections,handlers,removed,request,settled};
}

test("executes user code using userScripts and pins the intended document",async()=>{
 const f=await fixture();await f.handleConsole(f.request);const run=await f.settled();
 assert.equal(run.status,'done');assert.equal(run.report.result,'2');assert.equal(run.report.logs[0].text,'Fixture');
 assert.deepEqual(f.injections[0].target,{tabId:4,documentIds:['doc-one']});assert.equal(f.injections[0].world,'USER_SCRIPT');
});

test("refuses missing site grants, changed URL/documents, privileged URLs and invalid worlds",async()=>{
 const f=await fixture();f.state.allowed=false;await assert.rejects(f.handleConsole(f.request),/Izinkan akses/);
 f.state.allowed=true;f.state.url='https://other.org/';await assert.rejects(f.handleConsole(f.request),/Tab tujuan berubah/);
 f.state.url=f.request.url;f.state.documentUrl='https://other.org/';await assert.rejects(f.handleConsole(f.request),/Halaman berubah/);
 f.state.url='chrome://settings';await assert.rejects(f.handleConsole(f.request),/HTTP/);
 await assert.rejects(f.handleConsole({...f.request,world:'OTHER'}),/Mode/);
 assert.equal(f.injections.length,0);
});

test("double-run protection persists results while popup is closed",async()=>{
 const f=await fixture();let release;f.state.gate=new Promise(r=>release=r);
 await f.handleConsole(f.request);await assert.rejects(f.handleConsole(f.request),/masih berjalan/);
 assert.equal((await f.handleConsole({type:'console:status',tabId:4})).run.status,'running');
 release();assert.equal((await f.settled()).status,'done');
 assert.equal(f.values['devConsoleRun:4'].report.result,'2');
});

test("script and injection errors become readable reports rather than pending runs",async()=>{
 const f=await fixture();await f.handleConsole({...f.request,code:'throw new Error("script failure")'});
 assert.match((await f.settled()).report.error,/script failure/);
 f.state.injectionError='document navigated';await f.handleConsole(f.request);
 assert.match((await f.settled()).error,/document navigated/);
});

test("API toggle, optional Firefox permission, and unsupported browsers are detected",async()=>{
 const f=await fixture();f.state.enabled=false;assert.equal((await f.consoleAvailability()).state,'toggle');
 f.state.optional=true;f.state.permission=false;assert.equal((await f.consoleAvailability()).state,'permission');
 f.state.permission=true;f.state.enabled=true;delete chrome.userScripts.execute;
 assert.equal((await f.consoleAvailability()).state,'unsupported');
});

test("only extension UI can send console commands; stale persisted runs are recovered",async()=>{
 const f=await fixture();f.initDevConsole();let replied=false;
 const result=f.handlers[0](f.request,{id:'extension',url:'https://example.org/'},()=>replied=true);
 assert.equal(result,undefined);assert.equal(replied,false);assert.equal(f.injections.length,0);
 f.values['devConsoleRun:4']={id:'old',status:'running'};
 assert.equal((await f.handleConsole({type:'console:status',tabId:4})).run.status,'error');
});

test("late completion cannot recreate console output after its tab is closed",async()=>{
 const f=await fixture();f.initDevConsole();let release;f.state.gate=new Promise(r=>release=r);
 await f.handleConsole(f.request);f.removed[0](4);release();
 await new Promise(r=>setTimeout(r,20));
 assert.equal(f.values['devConsoleRun:4'],undefined);
});
