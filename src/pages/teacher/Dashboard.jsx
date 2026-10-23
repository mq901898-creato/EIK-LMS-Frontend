import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
  Button,
  Avatar,
  Chip,
  Divider,
  IconButton,
  Tooltip,
} from "@mui/material";

import MenuBookIcon from "@mui/icons-material/MenuBook";
import AssignmentIcon from "@mui/icons-material/Assignment";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AddIcon from "@mui/icons-material/Add";
import PeopleIcon from "@mui/icons-material/People";
import RefreshIcon from "@mui/icons-material/Refresh";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import LogoutIcon from "@mui/icons-material/Logout";
import SchoolIcon from "@mui/icons-material/School";

import Layout from "../../components/layout/Layout";
import api from "../../servises/api";

function Dashboard() {
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  // =========================================================
  // GET USER
  // =========================================================

  const getUser = () => {
    try {
      const storedUser = localStorage.getItem("user");

      if (!storedUser) {
        return null;
      }

      return JSON.parse(storedUser);
    } catch (error) {
      console.error("User parsing error:", error);
      return null;
    }
  };

  const user = getUser();

  const teacherName =
    user?.name ||
    user?.fullName ||
    user?.username ||
    "Teacher";

  // =========================================================
  // FETCH DASHBOARD
  // =========================================================

  const fetchDashboard = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const response = await api.get("/teacher/dashboard");

      console.log("Teacher Dashboard:", response.data);

      /*
        Your backend currently returns:

        response.data.data

        Example:
        {
          courses: 5,
          submissions: 20,
          pending: 8,
          reviewed: 12
        }
      */

      const data = response.data?.data || response.data || {};

      setDashboardData({
        courses: Number(data.courses) || 0,
        submissions: Number(data.submissions) || 0,
        pending: Number(data.pending) || 0,
        reviewed: Number(data.reviewed) || 0,
      });
    } catch (error) {
      console.error("Teacher dashboard error:", error);

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");
        return;
      }

      setError(
        error.response?.data?.message ||
          "Failed to load teacher dashboard"
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  // =========================================================
  // LOGOUT
  // =========================================================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  // =========================================================
  // QUICK NAVIGATION
  // =========================================================

  const handleCourses = () => {
    navigate("/teacher/courses");
  };

  const handleAssignments = () => {
    navigate("/teacher/assignments");
  };

  const handleStudents = () => {
    navigate("/teacher/students");
  };

  // =========================================================
  // STATISTICS
  // =========================================================

  const stats = [
    {
      title: "My Courses",
      value: dashboardData?.courses || 0,
      icon: <MenuBookIcon />,
      iconBg: "#e3f2fd",
      iconColor: "#1976d2",
      description: "Courses you created",
      action: handleCourses,
    },
    {
      title: "Total Submissions",
      value: dashboardData?.submissions || 0,
      icon: <AssignmentIcon />,
      iconBg: "#f3e5f5",
      iconColor: "#9c27b0",
      description: "Student submissions",
      action: handleAssignments,
    },
    {
      title: "Pending Review",
      value: dashboardData?.pending || 0,
      icon: <PendingActionsIcon />,
      iconBg: "#fff3e0",
      iconColor: "#ed6c02",
      description: "Need your attention",
      action: handleAssignments,
    },
    {
      title: "Reviewed",
      value: dashboardData?.reviewed || 0,
      icon: <CheckCircleIcon />,
      iconBg: "#e8f5e9",
      iconColor: "#2e7d32",
      description: "Completed reviews",
      action: handleAssignments,
    },
  ];

  // =========================================================
  // REVIEW PERCENTAGE
  // =========================================================

  const totalSubmissions = dashboardData?.submissions || 0;
  const reviewedSubmissions = dashboardData?.reviewed || 0;

  const reviewPercentage =
    totalSubmissions > 0
      ? Math.round(
          (reviewedSubmissions / totalSubmissions) * 100
        )
      : 0;

  // =========================================================
  // UI
  // =========================================================

  return (
    <Layout>
      <Box sx={{ width: "100%" }}>

        {/* ================================================= */}
        {/* HEADER */}
        {/* ================================================= */}

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: {
              xs: "flex-start",
              md: "center",
            },
            flexDirection: {
              xs: "column",
              md: "row",
            },
            gap: 2,
            mb: 4,
          }}
        >
          <Box>
            <Typography
              variant="body1"
              color="text.secondary"
            >
              Here's what's happening with your teaching
              activities today.
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              gap: 1.5,
              alignItems: "center",
            }}
          >
            <Tooltip title="Refresh dashboard">
              <span>
                <IconButton
                  onClick={() => fetchDashboard(true)}
                  disabled={loading || refreshing}
                  sx={{
                    border: "1px solid",
                    borderColor: "divider",
                    bgcolor: "background.paper",
                  }}
                >
                  {refreshing ? (
                    <CircularProgress size={20} />
                  ) : (
                    <RefreshIcon />
                  )}
                </IconButton>
              </span>
            </Tooltip>

            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleCourses}
              sx={{
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 700,
                px: 2.5,
              }}
            >
              Create Course
            </Button>

            <Button
              variant="outlined"
              color="error"
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
              sx={{
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 700,
              }}
            >
              Logout
            </Button>
          </Box>
        </Box>

        {/* ================================================= */}
        {/* ERROR */}
        {/* ================================================= */}

        {error && (
          <Alert
            severity="error"
            sx={{
              mb: 3,
              borderRadius: 2,
            }}
            onClose={() => setError("")}
            action={
              <Button
                color="inherit"
                size="small"
                onClick={() => fetchDashboard()}
              >
                Retry
              </Button>
            }
          >
            {error}
          </Alert>
        )}

        {/* ================================================= */}
        {/* STATISTICS */}
        {/* ================================================= */}

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "1fr 1fr",
              lg: "repeat(4, 1fr)",
            },
            gap: 3,
            mb: 4,
          }}
        >
          {stats.map((stat) => (
            <Card
              key={stat.title}
              onClick={stat.action}
              sx={{
                borderRadius: 3,
                boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
                border: "1px solid",
                borderColor: "divider",
                cursor: "pointer",
                transition: "all 0.25s ease",

                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow:
                    "0 8px 28px rgba(0,0,0,0.10)",
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        fontWeight: 600,
                        mb: 1,
                      }}
                    >
                      {stat.title}
                    </Typography>

                    {loading ? (
                      <CircularProgress size={30} />
                    ) : (
                      <Typography
                        variant="h3"
                        sx={{
                          fontWeight: 800,
                          lineHeight: 1,
                        }}
                      >
                        {stat.value}
                      </Typography>
                    )}
                  </Box>

                  <Avatar
                    sx={{
                      width: 52,
                      height: 52,
                      bgcolor: stat.iconBg,
                      color: stat.iconColor,
                    }}
                  >
                    {stat.icon}
                  </Avatar>
                </Box>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 2 }}
                >
                  {stat.description}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>

        {/* ================================================= */}
        {/* MAIN CONTENT */}
        {/* ================================================= */}

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "1.4fr 1fr",
            },
            gap: 3,
          }}
        >

          {/* ================================================= */}
          {/* SUBMISSION OVERVIEW */}
          {/* ================================================= */}

          <Card
            sx={{
              borderRadius: 3,
              boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 3,
                }}
              >
                <Box>
                  <Typography
                    variant="h6"
                    fontWeight={800}
                  >
                    Submission Overview
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    Track your students' submissions
                  </Typography>
                </Box>

                <Chip
                  icon={<AssignmentIcon />}
                  label={`${reviewPercentage}% Reviewed`}
                  color={
                    reviewPercentage === 100
                      ? "success"
                      : "primary"
                  }
                  variant="outlined"
                />
              </Box>

              {/* Progress */}
              <Box sx={{ mb: 3 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Typography
                    variant="body2"
                    fontWeight={600}
                  >
                    Review Progress
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    {reviewedSubmissions}/
                    {totalSubmissions}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    width: "100%",
                    height: 10,
                    bgcolor: "grey.200",
                    borderRadius: 10,
                    overflow: "hidden",
                  }}
                >
                  <Box
                    sx={{
                      width: `${reviewPercentage}%`,
                      height: "100%",
                      bgcolor:
                        reviewPercentage === 100
                          ? "success.main"
                          : "primary.main",
                      borderRadius: 10,
                      transition: "width 0.5s ease",
                    }}
                  />
                </Box>
              </Box>

              <Divider sx={{ mb: 2 }} />

              {/* Pending */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  py: 1.5,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                  }}
                >
                  <Avatar
                    sx={{
                      width: 38,
                      height: 38,
                      bgcolor: "#fff3e0",
                      color: "#ed6c02",
                    }}
                  >
                    <PendingActionsIcon fontSize="small" />
                  </Avatar>

                  <Box>
                    <Typography fontWeight={600}>
                      Pending Reviews
                    </Typography>

                    <Typography
                      variant="caption"
                      color="text.secondary"
                    >
                      Submissions waiting for review
                    </Typography>
                  </Box>
                </Box>

                <Typography
                  variant="h6"
                  fontWeight={800}
                >
                  {loading ? "—" : dashboardData?.pending || 0}
                </Typography>
              </Box>

              {/* Reviewed */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  py: 1.5,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                  }}
                >
                  <Avatar
                    sx={{
                      width: 38,
                      height: 38,
                      bgcolor: "#e8f5e9",
                      color: "#2e7d32",
                    }}
                  >
                    <CheckCircleIcon fontSize="small" />
                  </Avatar>

                  <Box>
                    <Typography fontWeight={600}>
                      Reviewed
                    </Typography>

                    <Typography
                      variant="caption"
                      color="text.secondary"
                    >
                      Successfully reviewed submissions
                    </Typography>
                  </Box>
                </Box>

                <Typography
                  variant="h6"
                  fontWeight={800}
                >
                  {loading ? "—" : dashboardData?.reviewed || 0}
                </Typography>
              </Box>

              <Button
                fullWidth
                variant="outlined"
                endIcon={<ArrowForwardIcon />}
                onClick={handleAssignments}
                sx={{
                  mt: 2,
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 700,
                }}
              >
                Manage Assignments
              </Button>
            </CardContent>
          </Card>

          {/* ================================================= */}
          {/* QUICK ACTIONS */}
          {/* ================================================= */}

          <Card
            sx={{
              borderRadius: 3,
              boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography
                variant="h6"
                fontWeight={800}
              >
                Quick Actions
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 3 }}
              >
                Quickly access your teaching tools
              </Typography>

              {/* Create Course */}
              <Button
                fullWidth
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleCourses}
                sx={{
                  justifyContent: "flex-start",
                  py: 1.5,
                  px: 2,
                  mb: 1.5,
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 700,
                }}
              >
                Create New Course
              </Button>

              {/* Manage Courses */}
              <Button
                fullWidth
                variant="outlined"
                startIcon={<MenuBookIcon />}
                endIcon={<ArrowForwardIcon />}
                onClick={handleCourses}
                sx={{
                  justifyContent: "space-between",
                  py: 1.5,
                  px: 2,
                  mb: 1.5,
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 600,
                }}
              >
                Manage My Courses
              </Button>

              {/* Assignments */}
              <Button
                fullWidth
                variant="outlined"
                startIcon={<AssignmentIcon />}
                endIcon={<ArrowForwardIcon />}
                onClick={handleAssignments}
                sx={{
                  justifyContent: "space-between",
                  py: 1.5,
                  px: 2,
                  mb: 1.5,
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 600,
                }}
              >
                Manage Assignments
              </Button>

              {/* Students */}
              <Button
                fullWidth
                variant="outlined"
                startIcon={<PeopleIcon />}
                endIcon={<ArrowForwardIcon />}
                onClick={handleStudents}
                sx={{
                  justifyContent: "space-between",
                  py: 1.5,
                  px: 2,
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 600,
                }}
              >
                View Students
              </Button>
            </CardContent>
          </Card>
        </Box>

        {/* ================================================= */}
        {/* BOTTOM WELCOME CARD */}
        {/* ================================================= */}

        <Card
          sx={{
            mt: 3,
            borderRadius: 3,
            overflow: "hidden",
            background:
              "linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)",
            color: "white",
            boxShadow:
              "0 8px 30px rgba(25,118,210,0.25)",
          }}
        >
          <CardContent
            sx={{
              p: {
                xs: 3,
                md: 4,
              },
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 3,
              flexDirection: {
                xs: "column",
                sm: "row",
              },
            }}
          >
            <Box>
              <Typography
                variant="h5"
                fontWeight={800}
                sx={{ mb: 1 }}
              >
                Keep inspiring your students! 🎓
              </Typography>

              <Typography
                sx={{
                  opacity: 0.9,
                  maxWidth: 650,
                }}
              >
                Create engaging courses, review student
                submissions, and help your students achieve
                their learning goals.
              </Typography>
            </Box>

            <SchoolIcon
              sx={{
                fontSize: {
                  xs: 60,
                  md: 90,
                },
                opacity: 0.25,
              }}
            />
          </CardContent>
        </Card>
      </Box>
    </Layout>
  );
}

export default Dashboard;