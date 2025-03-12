
// Chrome Extension API type definitions

interface Chrome {
  runtime: {
    id?: string;
    lastError?: { message: string };
    getURL(path: string): string;
    getManifest(): { [key: string]: any; version: string; name: string; description: string };
    onMessage: {
      addListener(callback: (message: any, sender: any, sendResponse: (response?: any) => void) => void): void;
      removeListener(callback: (message: any, sender: any, sendResponse: (response?: any) => void) => void): void;
    };
    sendMessage(message: any, callback?: (response: any) => void): void;
  };
  storage: {
    sync: {
      get(keys: string | string[] | null, callback: (items: { [key: string]: any }) => void): void;
      set(items: { [key: string]: any }, callback?: () => void): void;
    };
    local: {
      get(keys: string | string[] | null, callback: (items: { [key: string]: any }) => void): void;
      set(items: { [key: string]: any }, callback?: () => void): void;
    };
  };
  tabs: {
    query(queryInfo: { active: boolean; currentWindow: boolean }, callback: (tabs: any[]) => void): void;
    sendMessage(tabId: number, message: any, callback?: (response: any) => void): void;
  };
}

declare var chrome: Chrome;
