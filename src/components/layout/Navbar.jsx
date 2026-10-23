import { Box, Typography } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { IconButton, Avatar } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { TextField, InputAdornment } from "@mui/material";
import { useLocation } from "react-router-dom";

function Navbar() {
  const location = useLocation();

  const getPageTitle = () => {
    switch (location.pathname) {
      case "/teacher/dashboard":
        return "Teacher Dashboard";

      case "/teacher/courses":
        return "My Courses";

      case "/teacher/assignments":
        return "Assignments";

      case "/teacher/submissions":
        return "Submissions";

      case "/teacher/students":
        return "Students";

      case "/admin/dashboard":
        return "Admin Dashboard";

      case "/student/dashboard":
        return "Student Dashboard";
      case "/teacher/enrollments":
        return "Enrollments Requests";

      default:
        return "Dashboard";
    }
  };

  const getWelcomeText = () => {
    if (location.pathname.startsWith("/teacher")) {
      return "Welcome back, Teacher 👋";
    }

    if (location.pathname.startsWith("/admin")) {
      return "Welcome back, Admin 👋";
    }

    if (location.pathname.startsWith("/student")) {
      return "Welcome back, Student 👋";
    }

    return "Welcome back 👋";
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        bgcolor: "white",
        p: 2,
        borderRadius: 2,
        boxShadow: 1,
      }}
    >
      {/* Page Heading */}
      <Box>
        <Typography variant="h4" fontWeight="bold">
          {getPageTitle()}
        </Typography>

        <Typography variant="body2" color="text.secondary">
          {getWelcomeText()}
        </Typography>
      </Box>

      {/* Right Side */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <IconButton
          sx={{
            "&:hover": {
              bgcolor: "#e3f2fd",
            },
          }}
        >
          <NotificationsIcon />
        </IconButton>

        <TextField
          size="small"
          placeholder="Search..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ width: 250 }}
        />

        <Avatar
          sx={{
            bgcolor: "#1565c0",
            fontWeight: "bold",
          }}
        >
          T
        </Avatar>
      </Box>
    </Box>
  );
}

export default Navbar;