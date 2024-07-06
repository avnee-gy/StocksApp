// ThemeContext.js

import React, { createContext, useState, useContext } from "react";

export const lightTheme = {
  blue: "#007AFF",
  dark: "#FFFFFF",
  light: "#000000",
};

export const darkTheme = {
  blue: "#EEA330",
  dark: "#432f77",
  light: "#f2e9e4",
};

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(darkTheme);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === darkTheme ? lightTheme : darkTheme));
  };

  return (
    <ThemeContext.Provider value={{ colors: theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
