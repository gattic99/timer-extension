
/**
 * Type definitions for Chrome extension APIs
 */
interface Chrome {
  runtime: {
    id?: string;
    lastError?: {
      message: string;
    };
    getManifest(): {
      version: string;
      name: string;
      description: string;
      [key: string]: any;
    };
  };
  storage: {
    sync: {
      get(keys: string | string[] | object | null, callback: (items: { [key: string]: any }) => void): void;
      set(items: object, callback?: () => void): void;
      remove(keys: string | string[], callback?: () => void): void;
      clear(callback?: () => void): void;
    };
    local: {
      get(keys: string | string[] | object | null, callback: (items: { [key: string]: any }) => void): void;
      set(items: object, callback?: () => void): void;
      remove(keys: string | string[], callback?: () => void): void;
      clear(callback?: () => void): void;
    };
  };
}

declare global {
  interface Window {
    chrome?: Chrome;
  }
  var chrome: Chrome | undefined;
}

export {};
