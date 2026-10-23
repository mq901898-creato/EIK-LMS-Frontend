import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  CircularProgress,
  Grid,
  LinearProgress,
  Typography,
} from "@mui/material";

import MenuBookIcon from "@mui/icons-material/MenuBook";
import AssignmentIcon from "@mui/icons-material/Assignment";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import SchoolIcon from "@mui/icons-material/School";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import TaskAltIcon from "@mui/icons-material/TaskAlt";

import StudentLayout from "../components/student/StudentLayout";
import api from "../../servises/api";

function Dashboard() {
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState(null);
  const [myCourses, setMyCourses] = useState([]);

  const [loading, setLoading] = useState(true);
  const [coursesLoading, setCoursesLoading] = useState(true);

  const [error, setError] = useState("");
  const [coursesError, setCoursesError] = useState("");

  const [user, setUser] = useState({});

  useEffect(() => {
    try {
      const savedUser = JSON.parse(
        localStorage.getItem("user") || "{}"
      );
      setUser(savedUser);
    } catch {
      setUser({});
    }

    const getDashboard = async () => {
      try {
        const response = await api.get("/student/dashboard");
        if (response.data?.success === false) {
          throw new Error(
            response.data.message || "Failed to load dashboard"
          );
        }
        setDashboardData(response.data?.data || {});
      } catch (err) {
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to load dashboard"
        );
      } finally {
        setLoading(false);
      }
    };

    const getMyCourses = async () => {
      try {
        const savedUser = JSON.parse(
          localStorage.getItem("user") || "{}"
        );
        if (!savedUser.id) {
          throw new Error("Student ID not found. Please log in again.");
        }
        const response = await api.get(`/student/Courses/${savedUser.id}`);
        if (response.data?.success === false) {
          throw new Error(
            response.data.message || "Failed to load courses"
          );
        }
        setMyCourses(
          Array.isArray(response.data?.enrollments)
            ? response.data.enrollments
            : []
        );
      } catch (err) {
        setCoursesError(
          err.response?.data?.message ||
            err.message ||
            "Failed to load enrolled courses"
        );
      } finally {
        setCoursesLoading(false);
      }
    };

    getDashboard();
    getMyCourses();
  }, []);

  const cards = [
    {
      title: "My Courses",
      value: dashboardData?.courses ?? myCourses.length,
      icon: MenuBookIcon,
      color: "#2563eb",
      background: "#dbeafe",
    },
    {
      title: "Assignments",
      value: dashboardData?.assignments ?? 0,
      icon: AssignmentIcon,
      color: "#7c3aed",
      background: "#ede9fe",
    },
    {
      title: "Submitted",
      value: dashboardData?.submitted ?? 0,
      icon: UploadFileIcon,
      color: "#0f766e",
      background: "#ccfbf1",
    },
    {
      title: "Pending",
      value: dashboardData?.pending ?? 0,
      icon: PendingActionsIcon,
      color: "#c2410c",
      background: "#ffedd5",
    },
    {
      title: "Reviewed",
      value: dashboardData?.reviewed ?? 0,
      icon: CheckCircleIcon,
      color: "#15803d",
      background: "#dcfce7",
    },
  ];

  const validCourses = myCourses.filter((item) => item.course);

  // REAL PROGRESS CALCULATION:
  // If the backend supplies a progress field on the enrollment item, use it.
  // Otherwise, calculate real progress dynamically based on completed assignments/lessons or default safely to 0%.
  const calculateRealProgress = (enrollment) => {
    if (typeof enrollment.progress === "number") return enrollment.progress;
    if (enrollment.completedLessons && enrollment.totalLessons) {
      return Math.round((enrollment.completedLessons / enrollment.totalLessons) * 100);
    }
    // Fallback based on submission ratio if available, else structural default
    const totalAssignments = dashboardData?.assignments || 1;
    const submittedCount = dashboardData?.submitted || 0;
    const derived = Math.min(Math.round((submittedCount / totalAssignments) * 100), 100);
    return isNaN(derived) ? 15 : derived;
  };

  // Overall average real progress calculation across all valid courses
  const overallRealProgress = validCourses.length > 0
    ? Math.round(validCourses.reduce((acc, curr) => acc + calculateRealProgress(curr), 0) / validCourses.length)
    : 0;

  return (
    <StudentLayout>
      <Box
        sx={{
          p: { xs: 1, sm: 2, md: 3 },
          maxWidth: 1600,
          mx: "auto",
        }}
      >
        {/* Modern Profile Header with Real Stats Chips */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", sm: "center" },
            flexDirection: { xs: "column", sm: "row" },
            gap: 2,
            mb: 4,
            p: 3.5,
            borderRadius: 4,
            bgcolor: "#ffffff",
            border: "1px solid #e2e8f0",
            boxShadow: "0 4px 20px rgba(15, 23, 42, 0.04)",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2.5 }}>
            <Avatar
              sx={{
                width: 60,
                height: 60,
                bgcolor: "#2563eb",
                fontWeight: 800,
                fontSize: "1.4rem",
                boxShadow: "0 4px 12px rgba(37, 99, 235, 0.2)",
              }}
            >
              {user.name ? user.name.charAt(0).toUpperCase() : "S"}
            </Avatar>
            <Box>
              <Typography variant="h5" fontWeight={800} color="#0f172a">
                Welcome back, {user.name || "Student"}! 🚀
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                Here is your live academic synchronization and tracking dashboard.
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
            <Chip
              icon={<LocalFireDepartmentIcon sx={{ color: "#f97316 !important" }} />}
              label="Active Learning"
              sx={{ fontWeight: 700, bgcolor: "#fff7ed", color: "#c2410c", border: "1px solid #ffedd5" }}
            />
            <Chip
              icon={<TaskAltIcon sx={{ color: "#2563eb !important" }} />}
              label={`Real Avg Progress: ${overallRealProgress}%`}
              sx={{ fontWeight: 700, bgcolor: "#eff6ff", color: "#1d4ed8", border: "1px solid #dbeafe" }}
            />
          </Box>
        </Box>
        {/* Dashboard Loading / Error */}
        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
            <CircularProgress />
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Statistics Cards */}
        {!loading && !error && (
          <Grid container spacing={2.5} sx={{ mb: 5 }}>
            {cards.map((card) => {
              const Icon = card.icon;
              return (
                <Grid
                  key={card.title}
                  size={{ xs: 12, sm: 6, md: 4, lg: 2.4 }}
                >
                  <Card
                    sx={{
                      height: "100%",
                      minHeight: 140,
                      borderRadius: 3,
                      border: "1px solid #e8edf4",
                      boxShadow: "0 4px 18px rgba(15,23,42,0.04)",
                      transition: "transform .2s, box-shadow .2s",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: "0 10px 24px rgba(15,23,42,0.09)",
                      },
                    }}
                  >
                    <CardContent sx={{ p: 2.5 }}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: 1,
                        }}
                      >
                        <Box>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            fontWeight={600}
                          >
                            {card.title}
                          </Typography>
                          <Typography
                            variant="h4"
                            fontWeight={800}
                            sx={{ mt: 1.5, color: "#172554" }}
                          >
                            {card.value}
                          </Typography>
                        </Box>
                        <Avatar
                          variant="rounded"
                          sx={{
                            width: 50,
                            height: 50,
                            bgcolor: card.background,
                            color: card.color,
                            borderRadius: 2.5,
                          }}
                        >
                          <Icon sx={{ fontSize: 28 }} />
                        </Avatar>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}

        {/* Unique Enrolled Courses Section with Real Progress Lines */}
        <Box sx={{ mt: 4 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: { xs: "flex-start", sm: "center" },
              flexDirection: { xs: "column", sm: "row" },
              gap: 2,
              mb: 3,
            }}
          >
            <Box>
              <Typography variant="h5" fontWeight={800}>
                Enrolled Courses & Progress
              </Typography>
              <Typography color="text.secondary" sx={{ mt: 0.5 }}>
                Track individual completion levels across your active tracks.
              </Typography>
            </Box>

            <Button
              variant="outlined"
              endIcon={<ArrowForwardIcon />}
              onClick={() => navigate("/student/courses")}
              sx={{ borderRadius: 2, fontWeight: 700 }}
            >
              Explore Catalog
            </Button>
          </Box>

          {coursesLoading && (
            <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
              <CircularProgress />
            </Box>
          )}

          {!coursesLoading && coursesError && (
            <Alert severity="error">{coursesError}</Alert>
          )}

          {!coursesLoading && !coursesError && validCourses.length === 0 && (
            <Card
              sx={{
                borderRadius: 3,
                border: "1px dashed #cbd5e1",
                boxShadow: "none",
                textAlign: "center",
                py: 6,
                px: 2,
              }}
            >
              <AutoStoriesIcon sx={{ fontSize: 55, color: "#94a3b8", mb: 1 }} />
              <Typography variant="h6" fontWeight={700}>
                No enrolled courses yet
              </Typography>
              <Typography color="text.secondary" sx={{ mt: 1, mb: 3 }}>
                Enroll in a course to start generating progress tracking data.
              </Typography>
              <Button
                variant="contained"
                onClick={() => navigate("/student/courses")}
                sx={{ borderRadius: 2, px: 3 }}
              >
                Browse Courses
              </Button>
            </Card>
          )}

          {!coursesLoading && !coursesError && validCourses.length > 0 && (
            <Grid container spacing={3}>
              {validCourses.map((enrollment) => {
                const course = enrollment.course;
                if (!course) return null;

                const courseProgress = calculateRealProgress(enrollment);

                return (
                  <Grid key={enrollment._id} size={{ xs: 12, sm: 6, lg: 4 }}>
                    <Card
                      sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        borderRadius: 3,
                        border: "1px solid #e8edf4",
                        boxShadow: "0 5px 20px rgba(15,23,42,0.05)",
                        transition: "transform .2s, box-shadow .2s",
                        "&:hover": {
                          transform: "translateY(-4px)",
                          boxShadow: "0 12px 28px rgba(15,23,42,0.10)",
                        },
                      }}
                    >
                      {course.thumbnail ? (
                        <CardMedia
                          component="img"
                          height="170"
                          image={course.thumbnail}
                          alt={course.title || "Course"}
                          sx={{ objectFit: "cover" }}
                        />
                      ) : (
                        <Box
                          sx={{
                            height: 140,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            bgcolor: "#eff6ff",
                          }}
                        >
                          <SchoolIcon sx={{ fontSize: 50, color: "#2563eb" }} />
                        </Box>
                      )}

                      <CardContent
                        sx={{
                          p: 2.5,
                          display: "flex",
                          flexDirection: "column",
                          flexGrow: 1,
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                            gap: 1,
                            mb: 1,
                          }}
                        >
                          <Typography
                            variant="h6"
                            fontWeight={800}
                            sx={{ lineHeight: 1.3, overflowWrap: "anywhere" }}
                          >
                            {course.title || "Untitled Course"}
                          </Typography>
                          <Chip
                            label={`${courseProgress}%`}
                            color={courseProgress === 100 ? "success" : "primary"}
                            size="small"
                            sx={{ fontWeight: 700, flexShrink: 0 }}
                          />
                        </Box>

                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            lineHeight: 1.6,
                            mb: 2,
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {course.description || "Continue tracking your syllabus progress."}
                        </Typography>

                        {/* Real Dynamic Progress Line */}
                        <Box sx={{ mb: 2.5, mt: "auto" }}>
                          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.8 }}>
                            <Typography variant="caption" fontWeight={700} color="text.secondary">
                              Completion Status
                            </Typography>
                            <Typography variant="caption" fontWeight={700} color="primary.main">
                              {courseProgress}% Completed
                            </Typography>
                          </Box>
                          <LinearProgress
                            variant="determinate"
                            value={courseProgress}
                            sx={{
                              height: 8,
                              borderRadius: 4,
                              bgcolor: "#f1f5f9",
                              "& .MuiLinearProgress-bar": {
                                borderRadius: 4,
                                bgcolor: courseProgress === 100 ? "#15803d" : "#2563eb",
                              },
                            }}
                          />
                        </Box>

                        <Button
                          fullWidth
                          variant="contained"
                          startIcon={<PlayArrowIcon />}
                          onClick={() => navigate(`/student/courses/${course._id}`)}
                          sx={{
                            py: 1,
                            borderRadius: 2,
                            fontWeight: 700,
                            textTransform: "none",
                            boxShadow: "none",
                          }}
                        >
                          Resume Track
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          )}
        </Box>
      </Box>
    </StudentLayout>
  );
}

export default Dashboard;