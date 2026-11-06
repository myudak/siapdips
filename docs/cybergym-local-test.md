# CyberGym local quiz test

This Chromium-only test runs at document start on `https://quiz-tracker-seven.vercel.app/quiz*`, `http://localhost/quiz*`, and `http://127.0.0.1/quiz*`. It suppresses the supplied quiz's visibility, window-blur, and essay clipboard handlers while preserving native clipboard actions. Other origins and the Firefox manifest are unaffected.

Build and load the Chrome or Edge extension, open the authorized quiz or a local copy of it, and start a fresh test session. Compare tab switching, window blur, and copy/cut/paste against a baseline session with the extension disabled. Inspect server violation and heartbeat records as well as the UI. Run `node --test tests/cybergym.test.cjs` for the handler unit tests.

This targets the supplied client code only. It has not been verified against a running quiz; server-side identity, attempt, deadline, or other checks are outside its scope. It does not alter or delete recorded server events.
