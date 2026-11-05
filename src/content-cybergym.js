(() => {
  'use strict';
  if (!location.pathname.startsWith('/quiz')) return;

  // Installed before the React app registers its handlers.
  document.addEventListener('visibilitychange', (event) => {
    event.stopImmediatePropagation();
  }, true);

  window.addEventListener('blur', (event) => {
    if (event.target === window) event.stopImmediatePropagation();
  }, true);

  // Do not preventDefault: the browser's copy/cut/paste action must still run.
  for (const type of ['copy', 'cut', 'paste']) {
    document.addEventListener(type, (event) => {
      if (event.target instanceof HTMLTextAreaElement &&
          event.target.classList.contains('essay-textarea')) {
        event.stopPropagation();
      }
    }, true);
  }
})();
