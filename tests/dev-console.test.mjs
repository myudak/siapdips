import test from "node:test";
import assert from "node:assert/strict";
import vm from "node:vm";
import { buildConsoleSource } from "../src/lib/dev-console/runner.ts";
import { consoleSitePattern, consoleOrigin, normalizeConsoleReport, readConsoleSnippets, validateConsoleCode } from "../src/lib/dev-console/shared.ts";
const execute = (code, extra = {}) => vm.runInNewContext(buildConsoleSource(code), { performance, setTimeout, ...extra });

test("runner captures logs, async return values, and exceptions without modifying page console", async () => {
  const nativeConsole = { log() {} };
  const report = await execute('console.log("hello", {a: 2}); await Promise.resolve(); console.warn("careful"); return 42;', { console: nativeConsole });
  assert.equal(report.ok, true);
  assert.equal(report.logs[0].text, 'hello {a: 2}');
  assert.equal(report.logs[1].level, 'warn');
  assert.equal(report.result, '42');
  assert.equal(Object.keys(nativeConsole).length, 1);
  const error = await execute('console.log("before"); throw new Error("Oops");');
  assert.equal(error.ok, false);
  assert.equal(error.logs[0].text, 'before');
  assert.match(error.error, /Error: Oops/);
});

test("serializer handles cycles, bigint, getters, and large output", async () => {
  const report = await execute('const a={}; a.self=a; Object.defineProperty(a,"bad",{enumerable:true,get(){throw Error("must not invoke")}}); console.log(a,12n); for(let i=0;i<1000;i++)console.log("x".repeat(8000)); return undefined;');
  assert.equal(report.ok, true);
  assert.match(report.logs[0].text, /Circular/);
  assert.match(report.logs[0].text, /Getter/);
  assert.match(report.logs[0].text, /12n/);
  assert.ok(report.logs.length <= 200);
  assert.ok(report.logs.reduce((n,e)=>n+e.text.length,0) <= 64000);
  assert.equal(report.truncated, true);
});

test("console.assert/clear and trailing comments preserve valid JavaScript", async () => {
  const report = await execute('console.log("removed"); console.clear(); console.assert(false,"failure"); return "done"; // trailing');
  assert.equal(report.logs.length, 1);
  assert.equal(report.logs[0].level, 'error');
  assert.equal(report.result, 'done');
  assert.equal((await execute('throw "literal";')).error, 'literal');
  assert.throws(() => execute('const = ;'), /Unexpected token/);
});

test("code validation and origin patterns exclude privileged pages and omit ports", () => {
  assert.throws(() => validateConsoleCode(' '));
  assert.throws(() => validateConsoleCode('a'.repeat(50001)));
  assert.throws(() => validateConsoleCode({}));
  assert.equal(consoleSitePattern('http://localhost:5173/path'), 'http://localhost/*');
  assert.equal(consoleOrigin('http://localhost:5173/path'), 'http://localhost:5173');
  for (const url of ['chrome://settings','file:///a','data:text/html,x','not-url']) assert.equal(consoleSitePattern(url), null);
});

test("untrusted script reports and stored snippets are bounded before rendering", () => {
  const report = normalizeConsoleReport({ok:true,logs:[{level:'error',text:'x'.repeat(5000)},{level:'fake',text:'bad'}],result:'r'.repeat(5000),duration:Infinity});
  assert.equal(report.logs.length, 1); assert.equal(report.logs[0].text.length, 4000);
  assert.equal(report.result.length, 4000); assert.equal(report.duration, 0);
  assert.deepEqual(normalizeConsoleReport({ok:true,logs:3}).logs, []);
  assert.throws(() => normalizeConsoleReport({ok:'true'}));
  assert.equal(readConsoleSnippets([null,{}, {id:'a',name:'test',code:'return 1',world:'MAIN'}]).length, 1);
});
