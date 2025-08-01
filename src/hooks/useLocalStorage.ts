import { useState, useEffect, useRef } from 'react';

/**
 * Custom hook for managing localStorage with React state
 * @param key - The localStorage key
 * @param initialValue - The initial value if no stored value exists
 * @returns [storedValue, setValue] - Current value and setter function
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] {
  // Get from local storage then parse stored json or return initialValue
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that persists the new value to localStorage
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // Save state
      setStoredValue(valueToStore);
      
      // Save to local storage
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
}

/**
 * Hook for managing localStorage with automatic JSON serialization
 * and error handling for complex objects
 */
export function useLocalStorageState<T>(
  key: string,
  defaultValue: T,
  {
    serialize = JSON.stringify,
    deserialize = JSON.parse,
  }: {
    serialize?: (value: T) => string;
    deserialize?: (value: string) => T;
  } = {}
) {
  const [state, setState] = useState<T>(() => {
    try {
      const valueInLocalStorage = window.localStorage.getItem(key);
      if (valueInLocalStorage) {
        return deserialize(valueInLocalStorage);
      }
      return defaultValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return defaultValue;
    }
  });

  const prevKeyRef = useRef(key);

  // Check if the key changed and update state accordingly
  useEffect(() => {
    const prevKey = prevKeyRef.current;
    if (prevKey !== key) {
      try {
        const valueInLocalStorage = window.localStorage.getItem(key);
        if (valueInLocalStorage) {
          setState(deserialize(valueInLocalStorage));
        } else {
          setState(defaultValue);
        }
      } catch (error) {
        console.warn(`Error reading localStorage key "${key}":`, error);
        setState(defaultValue);
      }
    }
    prevKeyRef.current = key;
  }, [key, defaultValue, deserialize]);

  // Update localStorage when state changes
  useEffect(() => {
    try {
      window.localStorage.setItem(key, serialize(state));
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, state, serialize]);

  return [state, setState] as const;
}

/**
 * Hook for managing boolean flags in localStorage
 */
export function useLocalStorageBoolean(
  key: string,
  defaultValue: boolean = false
): [boolean, () => void, (value: boolean) => void] {
  const [value, setValue] = useLocalStorage(key, defaultValue);
  
  const toggle = () => setValue(!value);
  const setBoolean = (newValue: boolean) => setValue(newValue);
  
  return [value, toggle, setBoolean];
}

/**
 * Hook for managing arrays in localStorage with helper methods
 */
export function useLocalStorageArray<T>(
  key: string,
  defaultValue: T[] = []
) {
  const [array, setArray] = useLocalStorage<T[]>(key, defaultValue);
  
  const push = (item: T) => {
    setArray(prev => [...prev, item]);
  };
  
  const remove = (index: number) => {
    setArray(prev => prev.filter((_, i) => i !== index));
  };
  
  const removeById = (id: string | number, idKey: keyof T = 'id' as keyof T) => {
    setArray(prev => prev.filter(item => item[idKey] !== id));
  };
  
  const update = (index: number, newItem: T) => {
    setArray(prev => prev.map((item, i) => i === index ? newItem : item));
  };
  
  const updateById = (id: string | number, newItem: Partial<T>, idKey: keyof T = 'id' as keyof T) => {
    setArray(prev => prev.map(item => 
      item[idKey] === id ? { ...item, ...newItem } : item
    ));
  };
  
  const clear = () => setArray([]);
  
  return {
    array,
    setArray,
    push,
    remove,
    removeById,
    update,
    updateById,
    clear,
    length: array.length,
  };
}

/**
 * Hook for managing objects in localStorage with deep merge support
 */
export function useLocalStorageObject<T extends Record<string, unknown>>(
  key: string,
  defaultValue: T
) {
  const [object, setObject] = useLocalStorage<T>(key, defaultValue);
  
  const updateProperty = <K extends keyof T>(property: K, value: T[K]) => {
    setObject(prev => ({ ...prev, [property]: value }));
  };
  
  const updateProperties = (updates: Partial<T>) => {
    setObject(prev => ({ ...prev, ...updates }));
  };
  
  const reset = () => setObject(defaultValue);
  
  return {
    object,
    setObject,
    updateProperty,
    updateProperties,
    reset,
  };
}