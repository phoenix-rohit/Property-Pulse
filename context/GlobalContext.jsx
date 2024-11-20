"use client";

import { createContext, useContext, useState } from "react";

// Create Context
const GlobalContext = createContext();

// Create a Provider
export function GlobalProvider({ children }) {
  const [count, setCount] = useState(0);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  return (
    <GlobalContext.Provider
      value={{
        count,
        setCount,
        isProfileMenuOpen,
        setIsProfileMenuOpen,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}

// Create a Custom hook to access context
export function useGlobalContext() {
  return useContext(GlobalContext);
}
