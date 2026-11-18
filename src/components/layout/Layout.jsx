import React, { useState } from "react";
import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import Sidebar, { DRAWER_WIDTH } from "./Sidebar";
import Topbar from "./Topbar";
import { useAppTheme } from "../../context/useAppTheme";

export default function Layout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { mode } = useAppTheme();
  const isDark = mode === "dark";

  const handleDrawerToggle = () => {
    setMobileOpen((prev) => !prev);
  };

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        bgcolor: isDark ? "#030712" : "#f8fafc",
        color: isDark ? "#f8fafc" : "#0f172a",
        overflowX: "hidden",
        width: "100%",
        position: "relative",
      }}
    >
      {/* Permanent Desktop & Temporary Mobile Drawer */}
      <Sidebar
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        setMobileOpen={setMobileOpen}
      />

      {/* Main Execution View */}
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          minWidth: 0, // Prevents flex child overflow with tables and cards
          width: { xs: "100%", md: `calc(100% - ${DRAWER_WIDTH}px)` },
          minHeight: "100vh",
        }}
      >
        {/* Sticky Glassmorphic Topbar */}
        <Topbar onDrawerToggle={handleDrawerToggle} setMobileOpen={setMobileOpen} />

        {/* Content Container */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: { xs: 2, sm: 3, md: 3.5 },
            maxWidth: "1600px",
            width: "100%",
            mx: "auto",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {children || <Outlet />}
        </Box>
      </Box>
    </Box>
  );
}
