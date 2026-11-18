import React, { useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Avatar,
  TextField,
  InputAdornment,
  Menu,
  MenuItem,
  ListItemIcon,
  Divider,
  Badge,
  Tooltip,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import CircleIcon from "@mui/icons-material/Circle";
import { useLocation, useNavigate } from "react-router-dom";
import ThemeToggle from "../common/ThemeToggle";
import { useAppTheme } from "../../context/useAppTheme";

export default function Topbar({ onDrawerToggle, setMobileOpen }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { mode } = useAppTheme();
  const isDark = mode === "dark";

  const [profileAnchorEl, setProfileAnchorEl] = useState(null);
  const [notifAnchorEl, setNotifAnchorEl] = useState(null);

  const handleToggle = onDrawerToggle || (() => setMobileOpen && setMobileOpen((prev) => !prev));

  // Retrieve user information safely
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userName = user?.name || user?.username || "Instructor";
  const userEmail = user?.email || "eik.user@academy.io";
  const userRole = user?.role || "student";
  const userInitials = userName.substring(0, 2).toUpperCase();

  const handleProfileOpen = (event) => setProfileAnchorEl(event.currentTarget);
  const handleProfileClose = () => setProfileAnchorEl(null);

  const handleNotifOpen = (event) => setNotifAnchorEl(event.currentTarget);
  const handleNotifClose = () => setNotifAnchorEl(null);

  const handleLogout = () => {
    handleProfileClose();
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  // Dynamic route title resolver for SaaS hierarchy
  const getPageTitle = () => {
    const path = location.pathname.toLowerCase();
    if (path.includes("/teacher/dashboard")) return "Faculty Dashboard";
    if (path.includes("/teacher/courses")) return "Course Curriculum";
    if (path.includes("/teacher/assignments")) return "Assignments & Coursework";
    if (path.includes("/teacher/submissions")) return "Student Submissions";
    if (path.includes("/teacher/enrollments")) return "Enrollment Requests";
    if (path.includes("/teacher/quizzes/create")) return "AI Quiz Studio";

    if (path.includes("/admin/dashboard")) return "Executive Dashboard";
    if (path.includes("/admin/courses")) return "Course Administration";
    if (path.includes("/admin/students")) return "Student Directory";
    if (path.includes("/admin/teachers")) return "Faculty Administration";
    if (path.includes("/admin/addteacher")) return "Onboard New Teacher";
    if (path.includes("/admin/assignments")) return "Assignments Management";
    if (path.includes("/admin/whatsapp")) return "WhatsApp Communication Hub";
    if (path.includes("/admin/settings")) return "Platform Settings";

    if (path.includes("/student/dashboard")) return "Student Learning Portal";
    if (path.includes("/student/courses")) return "Course Catalog";
    if (path.includes("/student/mycourses")) return "Enrolled Classes";
    if (path.includes("/student/assignments")) return "My Assignments";
    if (path.includes("/student/submissions")) return "My Submissions";
    if (path.includes("/student/quizzes")) return "Assessments & Quizzes";
    if (path.includes("/student/profile")) return "Student Profile";

    return "Extreme Institute of Knowledge";
  };

  const getSubTitle = () => {
    if (location.pathname.startsWith("/admin")) return "Administrative Control Center";
    if (location.pathname.startsWith("/teacher")) return "Faculty & Instruction Panel";
    if (location.pathname.startsWith("/student")) return "Learning Experience Portal";
    return "Enterprise Academic Cloud";
  };

  return (
    <Box
      component="header"
      sx={{
        position: "sticky",
        top: 0,
        zIndex: 1100,
        height: 70,
        px: { xs: 2, sm: 3 },
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        backdropFilter: "blur(16px)",
        backgroundColor: isDark ? "rgba(3, 7, 18, 0.82)" : "rgba(255, 255, 255, 0.85)",
        borderBottom: isDark
          ? "1px solid rgba(255, 255, 255, 0.08)"
          : "1px solid rgba(0, 0, 0, 0.08)",
        transition: "background-color 0.2s ease",
      }}
    >
      {/* Left Section: Mobile Toggle & Page Headings */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, minWidth: 0 }}>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleToggle}
          sx={{
            display: { md: "none" },
            color: isDark ? "#94a3b8" : "#64748b",
            p: 1,
            "&:hover": { color: isDark ? "#f8fafc" : "#0f172a" },
          }}
        >
          <MenuIcon />
        </IconButton>

        <Box sx={{ minWidth: 0 }}>
          <Typography
            variant="h6"
            noWrap
            sx={{
              fontWeight: 700,
              fontSize: { xs: "0.95rem", sm: "1.15rem" },
              color: isDark ? "#f8fafc" : "#0f172a",
              lineHeight: 1.2,
            }}
          >
            {getPageTitle()}
          </Typography>
          <Typography
            variant="caption"
            noWrap
            sx={{
              display: { xs: "none", sm: "block" },
              color: isDark ? "#64748b" : "#94a3b8",
              fontSize: "0.72rem",
              fontWeight: 500,
            }}
          >
            {getSubTitle()}
          </Typography>
        </Box>
      </Box>

      {/* Right Section: Search, ThemeToggle, Notifications, Profile */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, flexShrink: 0 }}>
        {/* Search Input */}
        <TextField
          size="small"
          placeholder="Search..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: isDark ? "#64748b" : "#94a3b8", fontSize: 18 }} />
              </InputAdornment>
            ),
          }}
          sx={{
            display: { xs: "none", md: "flex" },
            width: { md: 220, lg: 260 },
            "& .MuiOutlinedInput-root": {
              height: 38,
              fontSize: "0.85rem",
            },
          }}
        />

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Notifications */}
        <Tooltip title="Notifications">
          <IconButton
            onClick={handleNotifOpen}
            sx={{
              color: isDark ? "#94a3b8" : "#64748b",
              border: isDark
                ? "1px solid rgba(255, 255, 255, 0.08)"
                : "1px solid rgba(0, 0, 0, 0.08)",
              borderRadius: "8px",
              p: 0.9,
              "&:hover": {
                bgcolor: isDark ? "rgba(255, 255, 255, 0.04)" : "rgba(0, 0, 0, 0.04)",
                color: isDark ? "#f8fafc" : "#0f172a",
              },
            }}
          >
            <Badge
              badgeContent={2}
              color="primary"
              sx={{
                "& .MuiBadge-badge": {
                  fontSize: 10,
                  height: 16,
                  minWidth: 16,
                  bgcolor: "#6366f1",
                },
              }}
            >
              <NotificationsNoneOutlinedIcon fontSize="small" />
            </Badge>
          </IconButton>
        </Tooltip>

        {/* Notifications Popover */}
        <Menu
          anchorEl={notifAnchorEl}
          open={Boolean(notifAnchorEl)}
          onClose={handleNotifClose}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          PaperProps={{
            sx: {
              mt: 1.2,
              width: 320,
              bgcolor: isDark ? "#0b0f19" : "#ffffff",
              border: isDark
                ? "1px solid rgba(255, 255, 255, 0.08)"
                : "1px solid rgba(0, 0, 0, 0.08)",
              borderRadius: "12px",
              p: 0,
            },
          }}
        >
          <Box sx={{ p: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
              System Notifications
            </Typography>
            <Typography variant="caption" sx={{ color: "#6366f1", fontWeight: 600, cursor: "pointer" }}>
              Mark all read
            </Typography>
          </Box>
          <Divider sx={{ borderColor: isDark ? "rgba(255, 255, 255, 0.06)" : "rgba(0, 0, 0, 0.06)" }} />
          <MenuItem onClick={handleNotifClose} sx={{ py: 1.5, display: "flex", gap: 1.5 }}>
            <CircleIcon sx={{ fontSize: 8, color: "#6366f1", mt: 0.8 }} />
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 600, fontSize: "0.825rem" }}>
                New assignment submissions received
              </Typography>
              <Typography variant="caption" sx={{ color: isDark ? "#64748b" : "#94a3b8" }}>
                15 minutes ago
              </Typography>
            </Box>
          </MenuItem>
          <MenuItem onClick={handleNotifClose} sx={{ py: 1.5, display: "flex", gap: 1.5 }}>
            <CircleIcon sx={{ fontSize: 8, color: "#10b981", mt: 0.8 }} />
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 600, fontSize: "0.825rem" }}>
                WhatsApp Gateway is active and connected
              </Typography>
              <Typography variant="caption" sx={{ color: isDark ? "#64748b" : "#94a3b8" }}>
                1 hour ago
              </Typography>
            </Box>
          </MenuItem>
        </Menu>

        {/* User Profile Trigger */}
        <Box
          onClick={handleProfileOpen}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.2,
            cursor: "pointer",
            p: 0.5,
            pr: { xs: 0.5, sm: 1.5 },
            borderRadius: "999px",
            border: isDark
              ? "1px solid rgba(255, 255, 255, 0.08)"
              : "1px solid rgba(0, 0, 0, 0.08)",
            bgcolor: isDark ? "rgba(11, 15, 25, 0.7)" : "#ffffff",
            transition: "all 0.2s ease",
            "&:hover": {
              borderColor: "rgba(99, 102, 241, 0.4)",
              bgcolor: isDark ? "rgba(99, 102, 241, 0.08)" : "rgba(99, 102, 241, 0.04)",
            },
          }}
        >
          <Avatar
            sx={{
              width: 32,
              height: 32,
              bgcolor: "#6366f1",
              fontSize: "0.85rem",
              fontWeight: 700,
              color: "#ffffff",
            }}
          >
            {userInitials}
          </Avatar>
          <Box sx={{ display: { xs: "none", sm: "block" }, textAlign: "left" }}>
            <Typography
              variant="body2"
              noWrap
              sx={{
                fontWeight: 600,
                color: isDark ? "#f8fafc" : "#0f172a",
                fontSize: "0.8rem",
                lineHeight: 1.1,
                maxWidth: 120,
              }}
            >
              {userName}
            </Typography>
            <Typography
              variant="caption"
              noWrap
              sx={{
                color: isDark ? "#64748b" : "#94a3b8",
                fontSize: "0.68rem",
                textTransform: "capitalize",
                display: "block",
              }}
            >
              {userRole}
            </Typography>
          </Box>
        </Box>

        {/* Profile Dropdown Menu */}
        <Menu
          anchorEl={profileAnchorEl}
          open={Boolean(profileAnchorEl)}
          onClose={handleProfileClose}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          PaperProps={{
            sx: {
              mt: 1.2,
              minWidth: 220,
              bgcolor: isDark ? "#0b0f19" : "#ffffff",
              border: isDark
                ? "1px solid rgba(255, 255, 255, 0.08)"
                : "1px solid rgba(0, 0, 0, 0.08)",
              borderRadius: "12px",
              boxShadow: isDark
                ? "0 12px 30px rgba(0, 0, 0, 0.7)"
                : "0 12px 30px rgba(0, 0, 0, 0.1)",
            },
          }}
        >
          <Box sx={{ px: 2, py: 1.5 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: isDark ? "#f8fafc" : "#0f172a" }}>
              {userName}
            </Typography>
            <Typography variant="caption" sx={{ color: isDark ? "#64748b" : "#94a3b8", display: "block" }}>
              {userEmail}
            </Typography>
          </Box>
          <Divider sx={{ borderColor: isDark ? "rgba(255, 255, 255, 0.06)" : "rgba(0, 0, 0, 0.06)" }} />
          <MenuItem
            onClick={() => {
              handleProfileClose();
              navigate(userRole === "student" ? "/student/profile" : "/admin/settings");
            }}
            sx={{ py: 1, fontSize: "0.875rem" }}
          >
            <ListItemIcon sx={{ color: "#6366f1", minWidth: 32 }}>
              <PersonOutlinedIcon fontSize="small" />
            </ListItemIcon>
            Account Profile
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleProfileClose();
              navigate("/admin/settings");
            }}
            sx={{ py: 1, fontSize: "0.875rem" }}
          >
            <ListItemIcon sx={{ color: "#6366f1", minWidth: 32 }}>
              <SettingsOutlinedIcon fontSize="small" />
            </ListItemIcon>
            Preferences
          </MenuItem>
          <Divider sx={{ borderColor: isDark ? "rgba(255, 255, 255, 0.06)" : "rgba(0, 0, 0, 0.06)" }} />
          <MenuItem
            onClick={handleLogout}
            sx={{
              py: 1,
              fontSize: "0.875rem",
              color: "#ef4444",
              "&:hover": { bgcolor: "rgba(239, 68, 68, 0.08)" },
            }}
          >
            <ListItemIcon sx={{ color: "#ef4444", minWidth: 32 }}>
              <LogoutIcon fontSize="small" />
            </ListItemIcon>
            Sign Out
          </MenuItem>
        </Menu>
      </Box>
    </Box>
  );
}
