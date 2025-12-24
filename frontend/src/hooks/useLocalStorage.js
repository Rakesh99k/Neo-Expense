/**
 * useLocalStorage
 * Sync a piece of React state with localStorage.
 * Params:
 * - key: string localStorage key
 * - initialValue: any default value
 * Returns: [value, setValue]
 */
import { useState, useEffect } from 'react'; // React hooks for state and effects

export function useLocalStorage(key, initialValue) { // sync state with localStorage by key
  const [storedValue, setStoredValue] = useState(() => { // initialize from localStorage once
    try {
      const item = window.localStorage.getItem(key); // read raw string
      return item ? JSON.parse(item) : initialValue; // parse JSON or use default
    } catch (e) {
      console.error('LocalStorage read error', e); // guard against malformed JSON or access issues
      return initialValue; // fallback to provided default
    }
  });

  useEffect(() => { // persist whenever key or value changes
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue)); // serialize and save
    } catch (e) {
      console.error('LocalStorage write error', e); // log write failures (quota, privacy mode, etc.)
    }
  }, [key, storedValue]); // dependencies: key and current value

  return [storedValue, setStoredValue]; // tuple API: value and setter
}
