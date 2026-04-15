import {
  createHelper,
  initializeDyandraHelper,
  injectGlobalStyles,
  checkNow,
  refreshNow,
  removeHelper,
  startWatcher,
  stopWatcher,
} from "./helper";

export async function initDyandraHelper(autoShow: boolean): Promise<void> {
  await initializeDyandraHelper(autoShow);

  const api = window as unknown as {
    showDyandraHelper?: () => void;
    hideDyandraHelper?: () => void;
    startDyandraWatcher?: () => void;
    stopDyandraWatcher?: () => void;
    scanDyandraLoketNow?: () => void;
    refreshDyandraNow?: () => void;
  };

  api.showDyandraHelper = () => {
    injectGlobalStyles();
    createHelper();
  };
  api.hideDyandraHelper = () => {
    removeHelper();
  };
  api.startDyandraWatcher = () => {
    void startWatcher();
  };
  api.stopDyandraWatcher = () => {
    stopWatcher("Watcher Dyandra dihentiin dari popup.");
  };
  api.scanDyandraLoketNow = () => {
    void checkNow();
  };
  api.refreshDyandraNow = () => {
    void refreshNow();
  };
}

export function createHelperDefault(message?: string): void {
  if (message) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    Toastify({
      text: message,
      duration: 2800,
      close: true,
      position: "left",
    }).showToast();
  }

  injectGlobalStyles();
  createHelper();
}
