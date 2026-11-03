import { Avatar, Box, IconButton, Typography, useMediaQuery, useTheme } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useLocation, useNavigate } from "react-router-dom";
import ThemeToggle from "../../../components/common/ThemeToggle";
import { useAppTheme } from "../../../context/useAppTheme";

const pageTitles = {
  "/student/dashboard": "Dashboard",
  "/student/courses": "Course catalog",
  "/student/my-courses": "My learning",
  "/student/assignments": "Assignments",
  "/student/submissions": "My submissions",
  "/student/profile": "My profile",
  "/student/quizzes": "Quizzes",
};

function getStudentName() {
  try {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    return typeof user?.name === "string" && user.name.trim()
      ? user.name.trim()
      : "Student";
  } catch {
    return "Student";
  }
}

function StudentNavbar({ setMobileOpen }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const location = useLocation();
  const navigate = useNavigate();
  const { mode } = useAppTheme();
  const studentName = getStudentName();
  const pageTitle =
    location.pathname.startsWith("/student/quizzes/") &&
    location.pathname !== "/student/quizzes"
      ? "Take quiz"
      : pageTitles[location.pathname] || "Student workspace";

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 1.5,
        minHeight: { xs: 64, sm: 72 },
        px: { xs: 1.25, sm: 2 },
        py: 1,
        bgcolor: mode === "dark" ? "#182338" : "#fff",
        color: mode === "dark" ? "#e7edf7" : "inherit",
        border: `1px solid ${mode === "dark" ? "#263650" : "#e8edf5"}`,
        borderRadius: { xs: 2.5, sm: 3 },
        boxShadow: "0 2px 10px rgba(15, 23, 42, 0.035)",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: 0 }}>
        {isMobile && (
          <IconButton
            onClick={() => setMobileOpen(true)}
            aria-label="Open navigation menu"
            sx={{ flexShrink: 0, color: mode === "dark" ? "#cbd5e1" : "#475569" }}
          >
            <MenuIcon />
          </IconButton>
        )}

        <Box sx={{ minWidth: 0 }}>
          <Typography
            component="h1"
            noWrap
            sx={{
              color: mode === "dark" ? "#e7edf7" : "#172033",
              fontSize: { xs: "1rem", sm: "1.2rem" },
              fontWeight: 750,
              letterSpacing: "-0.02em",
              lineHeight: 1.3,
            }}
          >
            {pageTitle}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            noWrap
            sx={{ display: { xs: "none", sm: "block" }, mt: 0.25 }}
          >
            Welcome back, {studentName}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 0, sm: 0.5 } }}>
        <ThemeToggle />
        <IconButton
          onClick={() => navigate("/student/profile")}
          aria-label={`Open ${studentName}'s profile`}
          sx={{ flexShrink: 0, p: 0.5 }}
        >
          <Avatar
            sx={{
              width: { xs: 36, sm: 40 },
              height: { xs: 36, sm: 40 },
              bgcolor: "#2563eb",
              fontSize: "0.95rem",
              fontWeight: 700,
            }}
          >
            {studentName.charAt(0).toUpperCase()}
          </Avatar>
        </IconButton>
      </Box>
    </Box>
  );
}

export default StudentNavbar;
