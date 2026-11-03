import {
  Avatar,
  Box,
  Divider,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
import ExploreOutlinedIcon from "@mui/icons-material/ExploreOutlined";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import UploadFileOutlinedIcon from "@mui/icons-material/UploadFileOutlined";
import QuizOutlinedIcon from "@mui/icons-material/QuizOutlined";
import PersonIcon from "@mui/icons-material/Person";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";

import { useLocation, useNavigate } from "react-router-dom";
import { useAppTheme } from "../../../context/useAppTheme";

const menuItems = [
  { title: "Dashboard", path: "/student/dashboard", icon: DashboardOutlinedIcon },
  { title: "My learning", path: "/student/my-courses", icon: MenuBookOutlinedIcon },
  { title: "Assignments", path: "/student/assignments", icon: AssignmentOutlinedIcon },
  { title: "My submissions", path: "/student/submissions", icon: UploadFileOutlinedIcon },
  { title: "Quizzes", path: "/student/quizzes", icon: QuizOutlinedIcon },
  { title: "My profile", path: "/student/profile", icon: PersonIcon },
];

function StudentSlidebar({ mobileOpen, setMobileOpen }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const location = useLocation();
  const navigate = useNavigate();
  const { mode } = useAppTheme();

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleNavigate = (path) => {
    navigate(path);
    if (isMobile) setMobileOpen(false);
  };

  const sidebarContent = (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: { xs: "min(288px, 86vw)", md: 264 },
        height: "100%",
        boxSizing: "border-box",
        bgcolor: mode === "dark" ? "#0b1325" : "#111c32",
        color: "#fff",
      }}
    >
      <Box sx={{ px: 2.5, pt: 3, pb: 2.5 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Avatar
            variant="rounded"
            sx={{
              width: 42,
              height: 42,
              borderRadius: 2.5,
              bgcolor: "#2563eb",
              color: "#fff",
            }}
          >
            <MenuBookOutlinedIcon />
          </Avatar>
          <Box>
            <Typography sx={{ fontWeight: 800, letterSpacing: "-0.02em" }}>
              EIK Learning
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: "#9eacc2", letterSpacing: "0.08em" }}
            >
              STUDENT PORTAL
            </Typography>
          </Box>
        </Box>
      </Box>

      <Divider sx={{ borderColor: "rgba(255,255,255,0.09)" }} />

      <Box sx={{ flex: 1, overflowY: "auto", px: 1.5, py: 2 }}>
        <Typography
          variant="overline"
          sx={{
            display: "block",
            px: 1.25,
            pb: 1,
            color: "#8190a8",
            fontSize: "0.65rem",
            fontWeight: 700,
            letterSpacing: "0.12em",
          }}
        >
          Workspace
        </Typography>
        <List disablePadding sx={{ display: "grid", gap: 0.5 }}>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              location.pathname === item.path ||
              location.pathname.startsWith(`${item.path}/`);

            return (
              <ListItemButton
                key={item.path}
                selected={isActive}
                onClick={() => handleNavigate(item.path)}
                sx={{
                  minHeight: 44,
                  px: 1.5,
                  borderRadius: 2,
                  color: isActive ? "#fff" : "#b7c2d3",
                  "&.Mui-selected": {
                    bgcolor: "#2563eb",
                    color: "#fff",
                    "&:hover": { bgcolor: "#1d4ed8" },
                    "& .MuiListItemIcon-root": { color: "#fff" },
                  },
                  "&:hover": {
                    bgcolor: "rgba(255,255,255,0.07)",
                    color: "#fff",
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 38,
                    color: "inherit",
                  }}
                >
                  <Icon fontSize="small" />
                </ListItemIcon>
                <ListItemText
                  primary={item.title}
                  sx={{
                    "& .MuiListItemText-primary": {
                      fontSize: "0.875rem",
                      fontWeight: isActive ? 700 : 500,
                    },
                  }}
                />
              </ListItemButton>
            );
          })}
        </List>
      </Box>

      <Box sx={{ p: 1.5 }}>
        <Divider sx={{ mb: 1.25, borderColor: "rgba(255,255,255,0.09)" }} />
        <ListItemButton
          onClick={handleLogout}
          sx={{
            minHeight: 44,
            px: 1.5,
            borderRadius: 2,
            color: "#b7c2d3",
            "&:hover": {
              bgcolor: "rgba(248,113,113,0.12)",
              color: "#fecaca",
            },
          }}
        >
          <ListItemIcon sx={{ minWidth: 38, color: "inherit" }}>
            <LogoutOutlinedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText
            primary="Log out"
            sx={{
              "& .MuiListItemText-primary": {
                fontSize: "0.875rem",
                fontWeight: 600,
              },
            }}
          />
        </ListItemButton>
      </Box>
    </Box>
  );

  return (
    <Box component="nav" sx={{ width: { md: 264 }, flexShrink: { md: 0 } }}>
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: "min(288px, 86vw)",
            border: 0,
          },
        }}
      >
        {sidebarContent}
      </Drawer>

      <Drawer
        variant="permanent"
        open
        sx={{
          display: { xs: "none", md: "block" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: 264,
            border: 0,
            bgcolor: mode === "dark" ? "#0b1325" : "#111c32",
          },
        }}
      >
        {sidebarContent}
      </Drawer>
    </Box>
  );
}

export default StudentSlidebar;
