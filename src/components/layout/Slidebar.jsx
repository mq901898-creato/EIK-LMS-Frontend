import React from "react";
import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  IconButton,
  Drawer,
  useMediaQuery,
  useTheme,
  Divider,
} from "@mui/material";

import LogoutIcon from "@mui/icons-material/Logout";
import CloseIcon from "@mui/icons-material/Close";

import { Link, useLocation, useNavigate } from "react-router-dom";
import getMenuItems from "./MenuItems";

function Sidebar({ mobileOpen, setMobileOpen }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const location = useLocation();
  const navigate = useNavigate();

  // Get logged-in user dynamically
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const role = user?.role;

  // Get menu items according to user role
  const menuItems = getMenuItems(role);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleNavigate = () => {
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const sidebarContent = (
    <Box
      sx={{
        width: 260,
        height: "100%",
        bgcolor: "#1565c0",
        color: "white",
        display: "flex",
        flexDirection: "column",
        boxSizing: "border-box",
      }}
    >
      {/* Header section: Logo & Mobile Close button aligned */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 2.5,
          pt: 2.5,
          pb: 1.5,
        }}
      >
        <Box>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 800,
              color: "white",
              lineHeight: 1.1,
              fontSize: "1.5rem",
              letterSpacing: "0.5px",
            }}
          >
            Extreme
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "#bbdefb",
              fontSize: "0.75rem",
              fontWeight: 500,
              textTransform: "uppercase",
              letterSpacing: "1px",
              mt: 0.5,
            }}
          >
            Institute of Knowledge
          </Typography>
        </Box>

        {isMobile && (
          <IconButton
            onClick={() => setMobileOpen(false)}
            sx={{
              color: "white",
              bgcolor: "rgba(255, 255, 255, 0.1)",
              p: 0.75,
              "&:hover": { bgcolor: "rgba(255, 255, 255, 0.2)" },
            }}
            aria-label="close menu"
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        )}
      </Box>

      {/* Role Badge Indicator */}
      <Box sx={{ px: 2.5, pb: 2 }}>
        <Typography
          variant="caption"
          sx={{
            display: "inline-block",
            bgcolor: "rgba(255, 255, 255, 0.15)",
            color: "#e3f2fd",
            px: 1.25,
            py: 0.5,
            borderRadius: 1,
            fontWeight: 600,
            fontSize: "0.7rem",
            letterSpacing: "0.5px",
            textTransform: "capitalize",
          }}
        >
          {role || "User"} Panel
        </Typography>
      </Box>

      <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.12)", mx: 2 }} />

      {/* Menu Links */}
      <Box sx={{ flex: 1, overflowY: "auto", px: 2, py: 2 }}>
        <List disablePadding sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <ListItemButton
                key={item.title}
                component={Link}
                to={item.path}
                onClick={handleNavigate}
                sx={{
                  bgcolor: isActive ? "#0d47a1" : "transparent",
                  "&:hover": {
                    bgcolor: "#0d47a1",
                  },
                  borderRadius: 2,
                  py: 1.25,
                  px: 2,
                  color: "white",
                  boxShadow: isActive ? "0 2px 6px rgba(0,0,0,0.15)" : "none",
                }}
              >
                <ListItemIcon
                  sx={{
                    color: "white",
                    minWidth: 36,
                  }}
                >
                  <Icon fontSize="small" />
                </ListItemIcon>
                <ListItemText
                  primary={item.title}
                  primaryTypographyProps={{
                    fontSize: "0.9rem",
                    fontWeight: isActive ? 600 : 400,
                    letterSpacing: "0.2px",
                  }}
                />
              </ListItemButton>
            );
          })}
        </List>
      </Box>

      {/* Logout Footer Section */}
      <Box sx={{ p: 2, mt: "auto" }}>
        <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.12)", mb: 2 }} />
        <ListItemButton
          onClick={handleLogout}
          sx={{
            color: "white",
            borderRadius: 2,
            py: 1.2,
            px: 2,
            "&:hover": {
              bgcolor: "rgba(211, 47, 47, 0.8)",
            },
            transition: "background-color 0.2s ease",
          }}
        >
          <ListItemIcon
            sx={{
              color: "white",
              minWidth: 36,
            }}
          >
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText
            primary="Logout"
            primaryTypographyProps={{
              fontSize: "0.9rem",
              fontWeight: 500,
            }}
          />
        </ListItemButton>
      </Box>
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { md: 260 }, flexShrink: { md: 0 } }}
    >
      {/* Mobile Drawer implementation */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: 260,
            borderRight: "none",
          },
        }}
      >
        {sidebarContent}
      </Drawer>

      {/* Desktop Permanent Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", md: "block" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: 260,
            borderRight: "none",
          },
        }}
        open
      >
        {sidebarContent}
      </Drawer>
    </Box>
  );
}

export default Sidebar;