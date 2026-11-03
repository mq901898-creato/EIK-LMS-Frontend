import { IconButton, Tooltip } from "@mui/material";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import { useAppTheme } from "../../context/useAppTheme";

function ThemeToggle() {
  const { mode, toggleMode } = useAppTheme();
  const nextMode = mode === "light" ? "dark" : "light";

  return (
    <Tooltip title={`Switch to ${nextMode} mode`}>
      <IconButton
        onClick={toggleMode}
        aria-label={`Switch to ${nextMode} mode`}
        color="inherit"
      >
        {mode === "light" ? <DarkModeOutlinedIcon /> : <LightModeOutlinedIcon />}
      </IconButton>
    </Tooltip>
  );
}

export default ThemeToggle;
