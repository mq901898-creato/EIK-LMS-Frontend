import { useEffect, useMemo, useState } from "react";
import { createTheme, CssBaseline, ThemeProvider as MuiThemeProvider } from "@mui/material";
import ThemeContext from "./themeContextValue";
const THEME_STORAGE_KEY = "lms-theme-mode";

function getInitialMode() {
  return localStorage.getItem(THEME_STORAGE_KEY) === "dark" ? "dark" : "light";
}

export function ThemeProvider({ children }) {
  const [mode, setMode] = useState(getInitialMode);
  const muiTheme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          ...(mode === "dark"
            ? {
                background: {
                  default: "#101827",
                  paper: "#182338",
                },
                text: {
                  primary: "#e7edf7",
                  secondary: "#a8b3c5",
                },
                divider: "#263650",
              }
            : {}),
        },
      }),
    [mode],
  );

  useEffect(() => {
    localStorage.setItem(THEME_STORAGE_KEY, mode);
    document.documentElement.dataset.theme = mode;
  }, [mode]);

  const value = useMemo(
    () => ({
      mode,
      toggleMode: () => setMode((currentMode) => currentMode === "light" ? "dark" : "light"),
    }),
    [mode],
  );

  return (
    <ThemeContext.Provider value={value}>
      <MuiThemeProvider theme={muiTheme}>
        <CssBaseline />
        <div className={`app-theme-${mode}`}>{children}</div>
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
}
