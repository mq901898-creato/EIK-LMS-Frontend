import { createTheme } from "@mui/material/styles";
import { darkPalette, lightPalette } from "./palette";
import { typography } from "./typography";
import { getComponentOverrides } from "./components";

export const createAppTheme = (mode = "dark") => {
  const isDark = mode === "dark";
  const palette = isDark ? darkPalette : lightPalette;
  const components = getComponentOverrides(mode);

  return createTheme({
    palette,
    typography,
    shape: {
      borderRadius: 8,
    },
    components,
  });
};

export const defaultTheme = createAppTheme("dark");
export default defaultTheme;

