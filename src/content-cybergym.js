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
  console.info('[SiapDips] Quiz helper loaded.');

  const showLoadedNotice = () => {
    const notice = document.createElement('div');
    notice.textContent = 'SiapDips: quiz helper loaded';
    notice.setAttribute('role', 'status');
    Object.assign(notice.style, {
      position: 'fixed', bottom: '16px', right: '16px', zIndex: '2147483647',
      padding: '10px 14px', borderRadius: '8px', background: '#1e293b',
      color: '#fff', font: '14px system-ui, sans-serif', pointerEvents: 'none'
    });
    document.body.appendChild(notice);
    setTimeout(() => notice.remove(), 5000);
  };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', showLoadedNotice, { once: true });
  } else if (document.body) {
    showLoadedNotice();
  }

})();
