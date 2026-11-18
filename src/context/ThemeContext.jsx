import { useEffect, useMemo, useState } from "react";
import { CssBaseline, ThemeProvider as MuiThemeProvider } from "@mui/material";
import ThemeContext from "./themeContextValue";
import { createAppTheme } from "../theme";

const THEME_STORAGE_KEY = "lms-theme-mode";

function getInitialMode() {
  const savedMode = localStorage.getItem(THEME_STORAGE_KEY);
  if (savedMode === "light" || savedMode === "dark") {
    return savedMode;
  }
  return "dark"; // Default to dark mode for EIK LMS
}

export function ThemeProvider({ children }) {
  const [mode, setMode] = useState(getInitialMode);

  const muiTheme = useMemo(() => createAppTheme(mode), [mode]);

  useEffect(() => {
    localStorage.setItem(THEME_STORAGE_KEY, mode);
    document.documentElement.dataset.theme = mode;
    document.documentElement.style.colorScheme = mode;
  }, [mode]);

  const value = useMemo(
    () => ({
      mode,
      toggleMode: () => setMode((currentMode) => (currentMode === "light" ? "dark" : "light")),
      setMode,
    }),
    [mode]
  );

  return (
    <ThemeContext.Provider value={value}>
      <MuiThemeProvider theme={muiTheme}>
        <CssBaseline />
        <div className={`app-theme-${mode}`} style={{ minHeight: "100vh" }}>
          {children}
        </div>
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
}

export default ThemeProvider;
