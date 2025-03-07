
// Utility functions for Chrome extension functionality

/**
 * Safely checks if the app is running in a Chrome extension context
 */
export const isExtensionContext = (): boolean => {
  return typeof window !== 'undefined' && 
    typeof chrome !== 'undefined' && 
    typeof chrome.runtime !== 'undefined' && 
    typeof chrome.runtime.id !== 'undefined';
};

/**
 * Saves data to Chrome's sync storage
 */
export const saveToStorage = async (key: string, value: any): Promise<void> => {
  if (!isExtensionContext()) return;
  
  return new Promise((resolve, reject) => {
    chrome.storage.sync.set({ [key]: value }, () => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve();
      }
    });
  });
};

/**
 * Retrieves data from Chrome's sync storage
 */
export const getFromStorage = async <T>(key: string): Promise<T | null> => {
  if (!isExtensionContext()) return null;
  
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get(key, (result) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve(result[key] || null);
      }
    });
  });
};
