import {
    Box,
    Typography,
    IconButton,
    Avatar,
    TextField,
    InputAdornment,
    useMediaQuery,
    useTheme,
} from "@mui/material";

import NotificationsIcon from "@mui/icons-material/Notifications";
import SearchIcon from "@mui/icons-material/Search";
import MenuIcon from "@mui/icons-material/Menu";

import { useLocation , useNavigate } from "react-router-dom";

function StudentNavbar({ setMobileOpen }) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const location = useLocation();
    const navigate = useNavigate();

    const getPageTitle = () => {
        switch (location.pathname) {
            case "/student/dashboard":
                return "Student Dashboard";
            case "/student/courses":
                return "My Courses";
            case "/student/assignments":
                return "Assignments";
            case "/student/submissions":
                return "My Submissions";
            case "/student/profile":
                return "My Profile";
            default:
                return "Student Panel";
        }
    };

    const user = JSON.parse(localStorage.getItem("user") || "null");

    const studentInitial = user?.name
        ? user.name.charAt(0).toUpperCase()
        : "S";

    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                bgcolor: "white",
                p: { xs: 1.5, sm: 2 },
                borderRadius: 2,
                boxShadow: 1,
                width: "100%",
                boxSizing: "border-box",
                gap: 1,
            }}
        >
            {/* Left Side */}
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    minWidth: 0, // Prevents flex item from overflowing
                    flex: 1,
                    mr: 1,
                }}
            >
                {/* Mobile Menu Button */}
                {isMobile && (
                    <IconButton
                        onClick={() => setMobileOpen(true)}
                        sx={{ mr: { xs: 0.5, sm: 1 }, flexShrink: 0 }}
                        aria-label="open menu"
                    >
                        <MenuIcon />
                    </IconButton>
                )}

                {/* Page Heading */}
                <Box sx={{ minWidth: 0, overflow: "hidden" }}>
                    <Typography
                        fontWeight="bold"
                        noWrap
                        sx={{
                            fontSize: {
                                xs: "1rem",
                                sm: "1.25rem",
                                md: "1.75rem",
                            },
                        }}
                    >
                        {getPageTitle()}
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        noWrap
                        sx={{
                            fontSize: { xs: "0.75rem", sm: "0.875rem" },
                            display: { xs: "none", sm: "block" }, // Hides secondary welcome text on ultra-small screens to save space, optional
                        }}
                    >
                        Welcome back, {user?.name || "Student"} 
                    </Typography>
                </Box>
            </Box>

            {/* Right Side */}
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: { xs: 1, sm: 2 },
                    flexShrink: 0,
                }}
            >
                <IconButton
                    sx={{
                        "&:hover": {
                            bgcolor: "#e3f2fd",
                        },
                    }}
                    aria-label="notifications"
                >
                    <NotificationsIcon fontSize={isMobile ? "small" : "medium"} />
                </IconButton>

                {/* Hide Search on Mobile/Tablet */}
                {!isMobile && (
                    <TextField
                        size="small"
                        placeholder="Search..."
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon fontSize="small" />
                                </InputAdornment>
                            ),
                        }}
                        sx={{ width: { md: 200, lg: 250 } }}
                    />
                )}

                <Avatar
                onClick={() => navigate("/student/profile")}
                    sx={{
                        bgcolor: "#1565c0",
                        fontWeight: "bold",
                        width: { xs: 32, sm: 40 },
                        height: { xs: 32, sm: 40 },
                        fontSize: { xs: "0.875rem", sm: "1rem" },
                    }}
                >
                    {studentInitial}
                </Avatar>
            </Box>
        </Box>
    );
}

export default StudentNavbar;