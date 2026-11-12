# Dev Console

Open a web page, click Siap Dips, then use **Dev Console**. Its target URL is
shown above the editor. The installed extension version is always visible in
the popup header, read directly from `runtime.getManifest().version`.

## Setup

Chrome/Edge require a browser exposing `userScripts.execute` (Chrome 135+).
In the extension details page, turn on **Allow User Scripts**, then refresh the
card. Older supported Chromium versions use Developer mode instead. The card
shows setup instructions when the API is disabled or unavailable. Firefox uses
an optional **User Scripts** permission and requires support for the MV3 API's
`execute()` method.

Run requests access for the selected website. Chrome/Edge declare `userScripts`
as a required permission; Firefox declares it as optional. Existing legacy host
grants in this extension are retained. The new card does not automatically run
code on permitted sites. Browser host grants apply by scheme and hostname across
ports; each execution is additionally pinned to the selected document/URL.

Official API references: [Chrome userScripts](https://developer.chrome.com/docs/extensions/reference/api/userScripts),
[Firefox userScripts](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/userScripts).

## Running code

Choose **DOM · isolated** to manipulate the document in a user-script world, or
**Page · globals situs** to access the website's own JavaScript environment.
Click **Run** or press **Ctrl+Enter / Cmd+Enter**. The editor supports multiline
input, two-space Tab indentation, and an expand/collapse control.

```js
console.log("Title:", document.title);
console.warn("Links:", document.querySelectorAll("a").length);
await new Promise(resolve => setTimeout(resolve, 100));
return location.href;
```

Each run has its own async function scope. Use `return` for the result and
`await` for asynchronous work. Logs from the script's `console` binding appear
in Output; the website's console and historical page logs are unchanged.
Callbacks that run after the async function finishes are outside that run's
captured output. Syntax errors and thrown/rejected errors are displayed as text.
Clear removes displayed output; reload the target page to reset page changes.

Drafts and up to 20 named snippets are saved in local extension storage. A
snippet can be updated or deleted and is executed only when Run is pressed.
The most recent result per tab is kept in session storage across popup closure,
then removed when the tab closes or the browser session ends. If the background
is restarted during a run, the card reports interruption rather than pretending
the script completed. Long-running scripts remain marked Running; the card does
not claim it can cancel arbitrary page JavaScript.

## Execution and output limits

Code is executed through `userScripts.execute` as user-provided source. The
extension's CSP is unchanged. Execution validates the extension-UI sender,
website grant, expected URL, execution world, and document ID. A second run on
the same tab is rejected while one is pending. Browser-internal pages, extension
stores, inaccessible frames, and page policy can restrict execution.

Scripts are limited to 50,000 characters. Output is bounded to 200 log entries
and 64,000 characters, with bounded object inspection and return/error text.
Getters are displayed without being invoked; circular references are supported.
Output is rendered as text inside the extension.

## Verification

`npm test` includes runner and background regressions covering code validation,
log serialization, async results/errors, output bounds, permissions, changed
documents, duplicate runs, interrupted runs, and sender validation.

After `npm run build:chrome`, run `python tests/dev-console-native-check.py`
(Python Playwright required). `TOOLS_CHROMIUM_EXECUTABLE` can select a Chromium
binary. The test uses an isolated profile and disposable copy of the extension,
pregrants only its local test host, and enables User Scripts in that profile's
native extension settings. It exercises DOM and MAIN execution on a CSP-restricted
page, logs/async/errors, draft/snippet/result persistence, expand/collapse, and
the installed-version badge. It does not test Chrome Web Store review or a
user's existing browser profile.
