
// Type definitions for Chrome extension API
interface Chrome {
  runtime: {
    id: string;
    onInstalled: {
      addListener: (callback: () => void) => void;
    };
  };
  storage: {
    local: {
      get: (keys: string[], callback: (result: any) => void) => void;
      set: (items: object, callback?: () => void) => void;
    };
  };
}

interface Window {
  chrome?: Chrome;
}
