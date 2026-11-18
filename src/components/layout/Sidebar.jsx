import React from "react";
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  Chip,
  IconButton,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SchoolIcon from "@mui/icons-material/School";
import LogoutIcon from "@mui/icons-material/Logout";
import { Link, useLocation, useNavigate } from "react-router-dom";
import getMenuItems from "./MenuItems";
import { useAppTheme } from "../../context/useAppTheme";

export const DRAWER_WIDTH = 264;

export default function Sidebar({ mobileOpen, onClose, setMobileOpen }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { mode } = useAppTheme();
  const isDark = mode === "dark";

  const handleClose = onClose || (() => setMobileOpen && setMobileOpen(false));

  // Retrieve user session dynamically
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const role = user?.role || "student";
  const menuItems = getMenuItems(role);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  const getRoleLabel = (r) => {
    switch (r) {
      case "admin":
        return "ADMIN CONSOLE";
      case "teacher":
        return "FACULTY PORTAL";
      case "student":
        return "STUDENT PORTAL";
      default:
        return "EIK WORKSPACE";
    }
  };

  const drawerContent = (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        bgcolor: isDark ? "#0b0f19" : "#ffffff",
        borderRight: isDark
          ? "1px solid rgba(255, 255, 255, 0.08)"
          : "1px solid rgba(0, 0, 0, 0.08)",
        boxSizing: "border-box",
      }}
    >
      {/* Brand Header */}
      <Box
        sx={{
          p: 2.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: "10px",
              bgcolor: "rgba(99, 102, 241, 0.14)",
              border: "1px solid rgba(99, 102, 241, 0.35)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#6366f1",
              boxShadow: "0 0 16px rgba(99, 102, 241, 0.2)",
            }}
          >
            <SchoolIcon fontSize="small" />
          </Box>
          <Box>
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 800,
                color: isDark ? "#f8fafc" : "#0f172a",
                lineHeight: 1.1,
                fontSize: "1.05rem",
                letterSpacing: "-0.01em",
              }}
            >
              EIK LMS
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: isDark ? "#64748b" : "#94a3b8",
                fontSize: "0.68rem",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                fontWeight: 600,
                display: "block",
                mt: 0.25,
              }}
            >
              Extreme Institute
            </Typography>
          </Box>
        </Box>

        {/* Mobile close button */}
        <IconButton
          onClick={handleClose}
          sx={{
            display: { md: "none" },
            color: isDark ? "#94a3b8" : "#64748b",
            "&:hover": { color: isDark ? "#f8fafc" : "#0f172a" },
          }}
          size="small"
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      {/* Role Pill Indicator */}
      <Box sx={{ px: 2.5, pb: 1.5 }}>
        <Chip
          label={getRoleLabel(role)}
          size="small"
          sx={{
            width: "100%",
            fontSize: "0.65rem",
            fontWeight: 700,
            letterSpacing: "0.08em",
            bgcolor: isDark ? "rgba(99, 102, 241, 0.08)" : "rgba(99, 102, 241, 0.06)",
            color: "#818cf8",
            border: "1px solid rgba(99, 102, 241, 0.25)",
            height: 24,
          }}
        />
      </Box>

      <Divider sx={{ borderColor: isDark ? "rgba(255, 255, 255, 0.06)" : "rgba(0, 0, 0, 0.06)", mx: 2 }} />

      {/* Navigation Links */}
      <Box sx={{ flex: 1, overflowY: "auto", px: 1.5, py: 2 }}>
        <List disablePadding sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const currentPath = location.pathname.toLowerCase();
            const itemPath = item.path.toLowerCase();
            const isActive =
              currentPath === itemPath ||
              (itemPath !== "/" &&
                currentPath.startsWith(itemPath) &&
                itemPath.split("/").length > 2);

            return (
              <ListItemButton
                key={item.path}
                component={Link}
                to={item.path}
                onClick={handleClose}
                sx={{
                  borderRadius: "8px",
                  py: 1.1,
                  px: 1.5,
                  transition: "all 0.15s ease",
                  position: "relative",
                  bgcolor: isActive
                    ? isDark
                      ? "rgba(99, 102, 241, 0.14)"
                      : "rgba(99, 102, 241, 0.08)"
                    : "transparent",
                  color: isActive
                    ? isDark
                      ? "#ffffff"
                      : "#4f46e5"
                    : isDark
                    ? "#94a3b8"
                    : "#64748b",
                  "&:hover": {
                    bgcolor: isActive
                      ? isDark
                        ? "rgba(99, 102, 241, 0.2)"
                        : "rgba(99, 102, 241, 0.12)"
                      : isDark
                      ? "rgba(255, 255, 255, 0.04)"
                      : "rgba(0, 0, 0, 0.03)",
                    color: isDark ? "#f8fafc" : "#0f172a",
                  },
                  ...(isActive && {
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      left: 0,
                      top: "18%",
                      height: "64%",
                      width: "3px",
                      borderRadius: "0 3px 3px 0",
                      bgcolor: "#6366f1",
                      boxShadow: "0 0 10px #6366f1",
                    },
                  }),
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 36,
                    color: isActive ? "#6366f1" : isDark ? "#64748b" : "#94a3b8",
                    transition: "color 0.15s ease",
                  }}
                >
                  <Icon fontSize="small" />
                </ListItemIcon>
                <ListItemText
                  primary={item.title}
                  primaryTypographyProps={{
                    fontSize: "0.875rem",
                    fontWeight: isActive ? 600 : 500,
                  }}
                />
              </ListItemButton>
            );
          })}
        </List>
      </Box>

      {/* Footer User & Logout */}
      <Box
        sx={{
          p: 2,
          borderTop: isDark
            ? "1px solid rgba(255, 255, 255, 0.06)"
            : "1px solid rgba(0, 0, 0, 0.06)",
          display: "flex",
          flexDirection: "column",
          gap: 1.5,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              bgcolor: "#10b981",
              boxShadow: "0 0 8px #10b981",
            }}
          />
          <Typography
            variant="caption"
            sx={{
              color: isDark ? "#64748b" : "#94a3b8",
              fontSize: "0.72rem",
              fontWeight: 500,
            }}
          >
            MongoDB Live API
          </Typography>
        </Box>

        <Button
          onClick={handleLogout}
          variant="outlined"
          color="inherit"
          size="small"
          startIcon={<LogoutIcon fontSize="small" />}
          sx={{
            justifyContent: "flex-start",
            color: "#ef4444",
            borderColor: isDark ? "rgba(239, 68, 68, 0.25)" : "rgba(239, 68, 68, 0.3)",
            fontSize: "0.8rem",
            "&:hover": {
              borderColor: "#ef4444",
              bgcolor: "rgba(239, 68, 68, 0.08)",
            },
          }}
        >
          Sign Out
        </Button>
      </Box>
    </Box>
  );

  return (
    <>
      {/* Mobile Drawer (Temporary) */}
      <Drawer
        variant="temporary"
        open={Boolean(mobileOpen)}
        onClose={handleClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            width: DRAWER_WIDTH,
            border: "none",
            bgcolor: isDark ? "#0b0f19" : "#ffffff",
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Desktop Drawer (Permanent) */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", md: "block" },
          width: DRAWER_WIDTH,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: DRAWER_WIDTH,
            boxSizing: "border-box",
            borderRight: isDark
              ? "1px solid rgba(255, 255, 255, 0.08)"
              : "1px solid rgba(0, 0, 0, 0.08)",
            bgcolor: isDark ? "#0b0f19" : "#ffffff",
          },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </>
  );
}

