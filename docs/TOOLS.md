# Tools etc

Open a normal web page, click the Siap Dips toolbar icon, and open **Tools etc**.
Existing custom card order is preserved when this card is added. The card can be
dragged or hidden using the existing card settings.

## Media

- **Speed:** 0.25–4×, with presets and a player selector. The setting stays locked
  while the tool is active, including when an HTML5 player is replaced. Reset
  releases the lock and restores the player's original rate. The default **Semua
  player** applies to the main frame; separately accessible embeds appear in the
  player selector. The embed access section requests one domain at a time.
- **Remember speed:** opt in per origin. Grant the browser's site permission when
  asked. New pages on that origin receive the saved speed. Turning this setting
  off deletes the saved preference and releases the current page controls.
- **Volume:** Chrome/Edge 116+, 0–500% gain for the selected tab, with an output
  compressor. Release the slider or choose a preset to apply. Permission is
  optional and requested on activation. 100% stops capture and restores normal
  playback. The audio session survives popup closure; navigation, tab closure,
  reset, or permission revocation stops it. Audio is processed locally, never
  recorded/uploaded, and no microphone permission is requested. 500% is gain,
  not a guarantee of five times perceived loudness; high gain may distort audio.
- **Picture-in-Picture:** uses the selected video when supported. A second click
  on the page may be required to satisfy the browser's user-activation rule.
- **A–B loop:** enter start/end seconds within a seekable media file. Stop loop
  or reset to release it. Live and protected players may refuse these actions.

If another volume booster or recording extension is capturing this tab, stop it
before enabling Siap Dips. Chrome can reject the second capture with
`Cannot capture a tab with an active stream.` If no other capture is active,
choose **100%** and retry; if the conflict persists, close and reopen the tab
and invoke Siap Dips again.

Siap Dips reuses its own audio session instead of capturing again, serializes
commands in the offscreen owner across worker restarts, and waits for Chrome to
release a stopped capture. Failed audio initialization releases acquired tracks.

Firefox has speed and the page tools, but does not expose the Chrome tab-capture
booster path. The booster controls are disabled there. Browser/internal pages,
extension stores, protected media, inaccessible frames, and closed shadow DOM
can limit tools even when site access is enabled.

## Capture

Choose **Full page screenshot**, **Visible area**, or **Select area**. For area
selection, drag on the page or press Esc to cancel. Keep the source tab active
until capture finishes. Full-page capture stitches viewport images at a rate
below Chrome's two-captures-per-second limit, with a limit of 120 tiles.

The capture restores scroll position and temporary styles on completion/error.
A watchdog restores the page if the background process stops responding. Fixed
and sticky elements are captured on the first tile and hidden on later tiles.
Very long pages, lazy loading, infinite feeds, RTL/horizontal scroll layouts,
nested scroll panels, and animated/protected content can produce incomplete
results; use area capture when needed.

The editor opens after capture completes. Drag to crop or pixelate a private
area, **Reset edits** to return to the original, then **Simpan PNG**. Editing is
applied to exported pixels, not just a CSS preview. Output is limited to 24 MP
and 16,384 pixels per dimension; large pages are scaled down. Screenshots stay
in local IndexedDB for up to 24 hours or four following captures, with hourly
cleanup. **Hapus** removes a capture immediately. Downloads remain on disk.

## Inspect

- **FontWhat:** hover text, click to pin, copy computed font-family, size, weight,
  line height, letter spacing, and color. This reads CSS, not image recognition
  or a guarantee of the actual glyph fallback font.
- **Warna elemen:** reads CSS text/background/border colors, not arbitrary pixels.
- **Blur elemen:** click elements to blur them before taking a screenshot. Esc
  ends selection; reset or **Hapus semua blur** restores original filters.
- **Reading ruler:** highlights the current line band; activate again or press
  Esc to remove it.
- **Salin link bersih:** removes common utm/click-ID tracking parameters while
  preserving application parameters and fragments.

## Permission audit

Tools uses manual `activeTab` + `scripting` access. Remembered sites and embedded
players request optional HTTP/HTTPS site access. Chrome/Edge audio permissions
(`tabCapture`, `offscreen`) are optional. No `debugger`, microphone, or new
automatic all-site Tools script is added.

The existing form watcher still matches `<all_urls>` in all browser manifests;
Firefox also has `<all_urls>` in host permissions. Those pre-existing mandatory
grants support the suspender's unsaved-input safeguard. Removing them without
migrating that feature could skip protected tabs or lose protection, so this
release retains them. The whole extension therefore still has broader access
than Tools alone needs; disabling a Tools preference does not revoke required
legacy grants. Browser site-access controls remain authoritative.

## Development verification

Run `node --test --experimental-strip-types tests/*.test.mjs` and build Chrome,
Edge, and Firefox. With `npm run dev`, open `/tests/fixtures/tools.html` for the
browser integration fixture. It uses production UI, serialized page functions,
background routing, IndexedDB, and the editor with an extension API adapter.
Fixture tab captures are generated images, not real browser-tab screenshots;
audio capture IDs and permission prompts are simulated. Audio unit tests cover
gain routing, update/reuse, sender validation, and stream/context cleanup.

For a native check, load the built `dist/` as an unpacked extension in Chrome or
Edge. Test on YouTube and a plain HTML5 player: 200%/500%, popup closure, 100%
reset, navigation/tab closure, declined/revoked audio permission, embedded
players, a tall page with sticky elements, and full-page/selected screenshots.
Also check speed, inspector Esc/reset, screenshot editing, and card order in
Firefox. Native tab-capture behavior requires this extension-enabled browser;
the web fixture cannot verify it.

An optional native Chromium smoke test is available with Python Playwright:
`python tests/tools-native-check.py` (start Vite and build Chrome first).
`TOOLS_CHROMIUM_EXECUTABLE` may select a specific Chromium binary. The runner
copies `dist/` into a disposable workspace test profile and pregrants capture
permissions only in that copy. It verifies native speed and screenshot/editor
behavior. Headless Chromium cannot substitute for the user's toolbar invocation,
so it reports the native audio path as unverified when that grant is absent.

For an automated native audio regression, build Chrome and run
`python tests/tools-audio-native-check.py` (Python Playwright required). It runs
a local tone page with real tab-capture streams in an isolated profile. Only its
disposable extension copy pregrants optional permissions, and Chromium's
`--allowlisted-extension-id` test switch substitutes for the toolbar grant.
It verifies gain/mute/reuse, popup closure, rapid stop/restart, and cleanup after
an injected AudioContext constructor failure. It does not test the real optional
permission prompt, user toolbar invocation, or perceived output loudness.
