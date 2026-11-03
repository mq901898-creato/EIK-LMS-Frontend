import { Box } from "@mui/material";
import Sidebar from "./Slidebar";
import Navbar from "./Navbar";
import { useAppTheme } from "../../context/useAppTheme";

function Layout({ children }) {
  const { mode } = useAppTheme();

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        bgcolor: mode === "dark" ? "#101827" : "#f5f5f5",
        color: mode === "dark" ? "#e7edf7" : "inherit",
      }}
    >
      {/* Sidebar */}
      <Sidebar />

      {/* Right Side */}
      <Box sx={{ flex: 1 }}>
        {/* Top Navbar */}
        <Navbar />

        {/* Main Content */}
        <Box
          sx={{
            p: 3,
            bgcolor: mode === "dark" ? "#101827" : "#f5f5f5",
            minHeight: "calc(100vh - 80px)",
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}

export default Layout;