import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Avatar,
  Box,
  Button,
  CardMedia,
  Chip,
  Grid,
  LinearProgress,
  Typography,
  CardContent,
  IconButton,
  Tooltip,
} from "@mui/material";

import MenuBookIcon from "@mui/icons-material/MenuBook";
import AssignmentIcon from "@mui/icons-material/Assignment";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import SchoolIcon from "@mui/icons-material/School";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import RefreshIcon from "@mui/icons-material/Refresh";

import Layout from "../../components/layout/Layout";
import StatCard from "../../components/common/StatCard";
import GlassCard from "../../components/common/GlassCard";
import api from "../../servises/api";

function StudentDashboard() {
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState(null);
  const [myCourses, setMyCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [coursesError, setCoursesError] = useState("");
  const [user, setUser] = useState({});

  const loadData = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
        setCoursesLoading(true);
      }
      setError("");
      setCoursesError("");

      const savedUser = JSON.parse(localStorage.getItem("user") || "{}");
      setUser(savedUser);

      // Fetch dashboard counts
      const dashboardPromise = api.get("/student/dashboard");

      // Fetch enrolled courses if user.id is available
      const coursesPromise = savedUser.id
        ? api.get(`/student/Courses/${savedUser.id}`)
        : Promise.resolve({ data: { enrollments: [] } });

      const [dashRes, coursesRes] = await Promise.allSettled([
        dashboardPromise,
        coursesPromise,
      ]);

      if (dashRes.status === "fulfilled") {
        setDashboardData(dashRes.value.data?.data || {});
      } else {
        setError(dashRes.reason?.response?.data?.message || "Failed to load dashboard metrics");
      }

      if (coursesRes.status === "fulfilled") {
        setMyCourses(
          Array.isArray(coursesRes.value.data?.enrollments)
            ? coursesRes.value.data.enrollments
            : []
        );
      } else {
        setCoursesError(
          coursesRes.reason?.response?.data?.message || "Failed to load enrolled courses"
        );
      }
    } catch (err) {
      console.error("Error loading student dashboard:", err);
    } finally {
      setLoading(false);
      setCoursesLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const validCourses = myCourses.filter((item) => item.course);

  const calculateRealProgress = (enrollment) => {
    if (typeof enrollment.progress === "number") {
      return Math.max(0, Math.min(Math.round(enrollment.progress), 100));
    }
    if (
      typeof enrollment.completedLessons === "number" &&
      typeof enrollment.totalLessons === "number" &&
      enrollment.totalLessons > 0
    ) {
      return Math.max(
        0,
        Math.min(
          Math.round((enrollment.completedLessons / enrollment.totalLessons) * 100),
          100
        )
      );
    }
    return 0;
  };

  const overallRealProgress =
    validCourses.length > 0
      ? Math.round(
          validCourses.reduce((acc, curr) => acc + calculateRealProgress(curr), 0) /
            validCourses.length
        )
      : 0;

  return (
    <Layout>
      <Box sx={{ width: "100%", display: "flex", flexDirection: "column", gap: 3.5 }}>
        {/* Profile Banner */}
        <GlassCard
          sx={{
            p: 3,
            display: "flex",
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", sm: "center" },
            flexDirection: { xs: "column", sm: "row" },
            gap: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Avatar
              sx={{
                width: 54,
                height: 54,
                bgcolor: "#6366f1",
                fontWeight: 800,
                fontSize: "1.3rem",
                boxShadow: "0 0 16px rgba(99, 102, 241, 0.35)",
              }}
            >
              {user.name ? user.name.charAt(0).toUpperCase() : "S"}
            </Avatar>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 800, lineHeight: 1.2 }}>
                Welcome back, {user.name || "Student"}
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>
                Track your syllabus milestones, upcoming deadlines, and course certifications.
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flexWrap: "wrap" }}>
            <Chip
              icon={<TaskAltIcon sx={{ color: "#10b981 !important" }} />}
              label={`Average Progress: ${overallRealProgress}%`}
              sx={{
                fontWeight: 700,
                bgcolor: "rgba(16, 185, 129, 0.12)",
                color: "#10b981",
                border: "1px solid rgba(16, 185, 129, 0.3)",
                height: 32,
              }}
            />

            <Tooltip title="Refresh">
              <IconButton
                onClick={() => loadData(true)}
                disabled={loading || refreshing}
                sx={{
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                  borderRadius: "8px",
                  p: 0.9,
                }}
              >
                <RefreshIcon
                  fontSize="small"
                  sx={{
                    animation: refreshing ? "spin 1s linear infinite" : "none",
                    "@keyframes spin": {
                      "0%": { transform: "rotate(0deg)" },
                      "100%": { transform: "rotate(360deg)" },
                    },
                  }}
                />
              </IconButton>
            </Tooltip>
          </Box>
        </GlassCard>

        {/* Global Error Banner */}
        {error && (
          <Alert
            severity="error"
            action={
              <Button color="inherit" size="small" onClick={() => loadData()}>
                Retry
              </Button>
            }
          >
            {error}
          </Alert>
        )}

        {/* Statistics Row */}
        <Grid container spacing={2.5}>
          <Grid item xs={12} sm={6} md={2.4}>
            <Box onClick={() => navigate("/student/courses")} sx={{ cursor: "pointer", height: "100%" }}>
              <StatCard
                title="Enrolled Courses"
                value={dashboardData?.courses ?? myCourses.length}
                icon={MenuBookIcon}
                color="#6366f1"
                loading={loading}
              />
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={2.4}>
            <Box onClick={() => navigate("/student/assignments")} sx={{ cursor: "pointer", height: "100%" }}>
              <StatCard
                title="Assignments"
                value={dashboardData?.assignments ?? 0}
                icon={AssignmentIcon}
                color="#818cf8"
                loading={loading}
              />
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={2.4}>
            <Box onClick={() => navigate("/student/submissions")} sx={{ cursor: "pointer", height: "100%" }}>
              <StatCard
                title="Submitted"
                value={dashboardData?.submitted ?? 0}
                icon={UploadFileIcon}
                color="#06b6d4"
                loading={loading}
              />
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={2.4}>
            <Box onClick={() => navigate("/student/assignments")} sx={{ cursor: "pointer", height: "100%" }}>
              <StatCard
                title="Pending Tasks"
                value={dashboardData?.pending ?? 0}
                icon={PendingActionsIcon}
                color="#f59e0b"
                loading={loading}
              />
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={2.4}>
            <Box onClick={() => navigate("/student/submissions")} sx={{ cursor: "pointer", height: "100%" }}>
              <StatCard
                title="Reviewed"
                value={dashboardData?.reviewed ?? 0}
                icon={CheckCircleIcon}
                color="#10b981"
                loading={loading}
              />
            </Box>
          </Grid>
        </Grid>

        {/* Enrolled Courses Section */}
        <Box sx={{ mt: 1 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: { xs: "flex-start", sm: "center" },
              flexDirection: { xs: "column", sm: "row" },
              gap: 2,
              mb: 2.5,
            }}
          >
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 800 }}>
                Enrolled Courses & Progress
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.25 }}>
                Track individual completion milestones across your registered tracks.
              </Typography>
            </Box>

            <Button
              variant="outlined"
              size="small"
              endIcon={<ArrowForwardIcon />}
              onClick={() => navigate("/student/courses")}
            >
              Browse Catalog
            </Button>
          </Box>

          {coursesError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {coursesError}
            </Alert>
          )}

          {!coursesLoading && validCourses.length === 0 && (
            <GlassCard
              sx={{
                textAlign: "center",
                py: 6,
                px: 3,
                border: "1px dashed rgba(255, 255, 255, 0.15)",
              }}
            >
              <AutoStoriesIcon sx={{ fontSize: 50, color: "text.secondary", mb: 1.5 }} />
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                No active enrollments found
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5, mb: 3 }}>
                Enroll in academy courses to unlock interactive lessons, quizzes, and tracking.
              </Typography>
              <Button
                variant="contained"
                onClick={() => navigate("/student/courses")}
                startIcon={<ArrowForwardIcon />}
              >
                Explore Courses
              </Button>
            </GlassCard>
          )}

          {validCourses.length > 0 && (
            <Grid container spacing={2.5}>
              {validCourses.map((enrollment) => {
                const course = enrollment.course;
                if (!course) return null;

                const courseProgress = calculateRealProgress(enrollment);

                return (
                  <Grid item xs={12} sm={6} lg={4} key={enrollment._id}>
                    <GlassCard
                      hover
                      sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      {course.thumbnail ? (
                        <CardMedia
                          component="img"
                          height="160"
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
                            bgcolor: "rgba(99, 102, 241, 0.08)",
                            color: "#6366f1",
                          }}
                        >
                          <SchoolIcon sx={{ fontSize: 48 }} />
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
                            sx={{ fontWeight: 700, lineHeight: 1.3, fontSize: "1rem" }}
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
                          sx={{
                            color: "text.secondary",
                            mb: 2,
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            lineHeight: 1.5,
                          }}
                        >
                          {course.description || "Continue tracking your syllabus progress."}
                        </Typography>

                        {/* Progress Bar */}
                        <Box sx={{ mb: 2.5, mt: "auto" }}>
                          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.8 }}>
                            <Typography variant="caption" sx={{ fontWeight: 600, color: "text.secondary" }}>
                              Completion Status
                            </Typography>
                            <Typography variant="caption" sx={{ fontWeight: 700, color: "#6366f1" }}>
                              {courseProgress}% Completed
                            </Typography>
                          </Box>
                          <LinearProgress
                            variant="determinate"
                            value={courseProgress}
                            sx={{
                              height: 6,
                              borderRadius: 3,
                              bgcolor: "rgba(255, 255, 255, 0.08)",
                              "& .MuiLinearProgress-bar": {
                                borderRadius: 3,
                                bgcolor: courseProgress === 100 ? "#10b981" : "#6366f1",
                              },
                            }}
                          />
                        </Box>

                        <Button
                          fullWidth
                          variant="contained"
                          startIcon={<PlayArrowIcon />}
                          onClick={() => navigate("/student/assignments")}
                          size="small"
                        >
                          View Assignments
                        </Button>
                      </CardContent>
                    </GlassCard>
                  </Grid>
                );
              })}
            </Grid>
          )}
        </Box>
      </Box>
    </Layout>
  );
}

export default StudentDashboard;
