import { useState } from "react";

export function useLocalStorage(key: string) {
  const [value, setValue] = useState(() => {
    const storedData = localStorage.getItem(key);

    return storedData ? JSON.parse(storedData) : null;
  });

  const setLocalStorageValue = (newValue: string) => {
    localStorage.setItem(key, JSON.stringify(newValue));

    setValue(newValue);
  };

  return [value, setLocalStorageValue];
}
