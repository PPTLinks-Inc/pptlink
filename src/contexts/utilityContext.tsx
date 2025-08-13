/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useEffect, useCallback } from "react";

interface SearchState {
  search: string;
  isMobileSearch: boolean;
}

interface UtilityProviderContextType {
  search: SearchState;
  setSearch: React.Dispatch<React.SetStateAction<SearchState>>;
  darkTheme: boolean;
  handleDarkTheme: () => void;
  dropdown: boolean;
  setDropdown: React.Dispatch<React.SetStateAction<boolean>>;
  handleDropdown: () => void;
}

export const UtilityProvider = createContext<UtilityProviderContextType>({
  search: { search: "", isMobileSearch: false },
  setSearch: () => {},
  darkTheme: true,
  handleDarkTheme: () => {},
  dropdown: false,
  setDropdown: () => {},
  handleDropdown: () => {}
});

export default function UtilityProviderFunc({
  children
}: {
  children: React.ReactNode;
}) {
  const [dropdown, setDropdown] = useState<boolean>(false);
  const [search, setSearch] = useState<SearchState>({
    search: "",
    isMobileSearch: false
  });
  const [darkTheme, setDarkTheme] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("darkTheme");
      return saved ? JSON.parse(saved) : true;
    }
    return true;
  });

  const handleDropdown = useCallback((): void => {
    setDropdown((prev) => !prev);
  }, []);

  const handleDarkTheme = useCallback((): void => {
    setDarkTheme((prev) => {
      const newTheme = !prev;
      if (typeof window !== "undefined") {
        localStorage.setItem("darkTheme", JSON.stringify(newTheme));
      }
      return newTheme;
    });
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--primary-bg", darkTheme ? "#191919" : "#FFFFF0");
    root.style.setProperty("--primary-text", darkTheme ? "#FFFFF0" : "#191919");
  }, [darkTheme]);

  return (
    <UtilityProvider.Provider
      value={{
        search,
        setSearch,
        darkTheme,
        handleDarkTheme,
        dropdown,
        setDropdown,
        handleDropdown
      }}
    >
      {children}
    </UtilityProvider.Provider>
  );
}
