import { useState, useEffect } from 'react';

/**
 * Custom hook to sync state with localStorage with error handling and fallback defaults.
 *
 * @param {string} key - The localStorage key
 * @param {any} initialValue - Fallback initial value or lazy initializer function
 * @returns {[any, Function]} - [storedValue, setStoredValue]
 */
export function useLocalStorage(key, initialValue) {
  // 1. Initialize state from localStorage or fallback
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item !== null) {
        return JSON.parse(item);
      }
    } catch (error) {
      console.warn(`[useLocalStorage] Error reading key "${key}":`, error);
    }
    return typeof initialValue === 'function' ? initialValue() : initialValue;
  });

  // 2. Persist state changes back to localStorage
  useEffect(() => {
    try {
      if (storedValue === undefined) {
        window.localStorage.removeItem(key);
      } else {
        window.localStorage.setItem(key, JSON.stringify(storedValue));
      }
    } catch (error) {
      console.warn(`[useLocalStorage] Error writing key "${key}":`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}

export default useLocalStorage;
