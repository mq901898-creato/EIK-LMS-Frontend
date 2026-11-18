import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Grid,
  Alert,
  Button,
  IconButton,
  Tooltip,
  LinearProgress,
} from "@mui/material";

import MenuBookIcon from "@mui/icons-material/MenuBook";
import AssignmentIcon from "@mui/icons-material/Assignment";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AddIcon from "@mui/icons-material/Add";
import RefreshIcon from "@mui/icons-material/Refresh";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import HowToRegIcon from "@mui/icons-material/HowToReg";

import Layout from "../../components/layout/Layout";
import StatCard from "../../components/common/StatCard";
import GlassCard from "../../components/common/GlassCard";
import api from "../../servises/api";

function TeacherDashboard() {
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const teacherName = user?.name || user?.username || "Professor";

  const fetchDashboard = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError("");

      const response = await api.get("/teacher/dashboard");
      const data = response.data?.data || response.data || {};

      setDashboardData({
        courses: Number(data.courses) || 0,
        submissions: Number(data.submissions) || 0,
        pending: Number(data.pending) || 0,
        reviewed: Number(data.reviewed) || 0,
      });
    } catch (err) {
      console.error("Teacher dashboard error:", err);

      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
        return;
      }

      setError(
        err.response?.data?.message || "Failed to load faculty metrics."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const totalSubmissions = dashboardData?.submissions || 0;
  const reviewedSubmissions = dashboardData?.reviewed || 0;
  const reviewPercentage =
    totalSubmissions > 0
      ? Math.round((reviewedSubmissions / totalSubmissions) * 100)
      : 100;

  return (
    <Layout>
      <Box sx={{ width: "100%", display: "flex", flexDirection: "column", gap: 3.5 }}>
        {/* Welcome Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", sm: "center" },
            flexDirection: { xs: "column", sm: "row" },
            gap: 2,
          }}
        >
          <Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                letterSpacing: "-0.02em",
                lineHeight: 1.2,
                mb: 0.5,
              }}
            >
              Faculty Workspace
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              Welcome back, {teacherName}. Here is your active teaching summary and pending student coursework.
            </Typography>
          </Box>

          {/* Action Toolbar */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flexWrap: "wrap" }}>
            <Tooltip title="Refresh">
              <span>
                <IconButton
                  onClick={() => fetchDashboard(true)}
                  disabled={loading || refreshing}
                  sx={{
                    border: "1px solid rgba(255, 255, 255, 0.12)",
                    borderRadius: "8px",
                    p: 1,
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
              </span>
            </Tooltip>

            <Button
              variant="outlined"
              size="small"
              startIcon={<AutoAwesomeIcon />}
              onClick={() => navigate("/teacher/quizzes/create")}
              sx={{ borderColor: "rgba(99, 102, 241, 0.4)", color: "#818cf8" }}
            >
              AI Quiz Studio
            </Button>

            <Button
              variant="contained"
              size="small"
              startIcon={<AddIcon />}
              onClick={() => navigate("/teacher/courses")}
            >
              Add Course
            </Button>
          </Box>
        </Box>

        {/* Error Alert with Retry */}
        {error && (
          <Alert
            severity="error"
            action={
              <Button color="inherit" size="small" onClick={() => fetchDashboard()}>
                Retry
              </Button>
            }
          >
            {error}
          </Alert>
        )}

        {/* Core Metric Cards */}
        <Grid container spacing={2.5}>
          <Grid item xs={12} sm={6} md={3}>
            <Box onClick={() => navigate("/teacher/courses")} sx={{ cursor: "pointer", height: "100%" }}>
              <StatCard
                title="Active Courses"
                value={dashboardData?.courses}
                icon={MenuBookIcon}
                color="#6366f1"
                loading={loading}
                trendLabel="Instructed by you"
              />
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Box onClick={() => navigate("/teacher/submissions")} sx={{ cursor: "pointer", height: "100%" }}>
              <StatCard
                title="Total Submissions"
                value={dashboardData?.submissions}
                icon={AssignmentIcon}
                color="#06b6d4"
                loading={loading}
                trendLabel="All coursework received"
              />
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Box onClick={() => navigate("/teacher/submissions")} sx={{ cursor: "pointer", height: "100%" }}>
              <StatCard
                title="Pending Review"
                value={dashboardData?.pending}
                icon={PendingActionsIcon}
                color="#f59e0b"
                loading={loading}
                trendLabel="Awaiting grading"
              />
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Box onClick={() => navigate("/teacher/submissions")} sx={{ cursor: "pointer", height: "100%" }}>
              <StatCard
                title="Reviewed"
                value={dashboardData?.reviewed}
                icon={CheckCircleIcon}
                color="#10b981"
                loading={loading}
                trendLabel="Graded & completed"
              />
            </Box>
          </Grid>
        </Grid>

        {/* Grading Velocity & Workflow Modules */}
        <Grid container spacing={2.5}>
          {/* Grading Progress Card */}
          <Grid item xs={12} md={6}>
            <GlassCard sx={{ p: 3, height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                  Assessment Review Velocity
                </Typography>
                <Typography variant="caption" sx={{ color: "text.secondary", display: "block", mb: 3 }}>
                  Percentage of student submissions evaluated across all active terms.
                </Typography>

                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", mb: 1 }}>
                  <Typography variant="h4" sx={{ fontWeight: 800, color: "#6366f1" }}>
                    {reviewPercentage}%
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    {reviewedSubmissions} of {totalSubmissions} completed
                  </Typography>
                </Box>

                <LinearProgress
                  variant="determinate"
                  value={reviewPercentage}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    bgcolor: "rgba(255, 255, 255, 0.08)",
                    "& .MuiLinearProgress-bar": {
                      bgcolor: "#6366f1",
                      borderRadius: 4,
                    },
                  }}
                />
              </Box>

              <Box sx={{ pt: 3, display: "flex", gap: 1.5 }}>
                <Button
                  variant="outlined"
                  size="small"
                  endIcon={<ArrowForwardIcon />}
                  onClick={() => navigate("/teacher/submissions")}
                >
                  Review Pending Submissions
                </Button>
              </Box>
            </GlassCard>
          </Grid>

          {/* AI Quiz Studio Highlight */}
          <Grid item xs={12} md={6}>
            <GlassCard
              hover
              gradientBorder
              sx={{
                p: 3,
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                bgcolor: "rgba(99, 102, 241, 0.04)",
              }}
            >
              <Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1.5 }}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: "10px",
                      bgcolor: "rgba(99, 102, 241, 0.15)",
                      border: "1px solid rgba(99, 102, 241, 0.35)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#818cf8",
                    }}
                  >
                    <AutoAwesomeIcon fontSize="small" />
                  </Box>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      AI Assessment Studio
                    </Typography>
                    <Typography variant="caption" sx={{ color: "text.secondary" }}>
                      Instant question generation powered by Gemini
                    </Typography>
                  </Box>
                </Box>

                <Typography variant="body2" sx={{ color: "text.secondary", mt: 1 }}>
                  Create intelligent quizzes, multiple choice questions, and auto-graded assessments
                  from lecture transcripts or topic summaries in seconds.
                </Typography>
              </Box>

              <Box sx={{ pt: 3 }}>
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<AutoAwesomeIcon />}
                  onClick={() => navigate("/teacher/quizzes/create")}
                  sx={{
                    bgcolor: "#6366f1",
                    "&:hover": { bgcolor: "#4f46e5" },
                  }}
                >
                  Open Quiz Studio
                </Button>
              </Box>
            </GlassCard>
          </Grid>
        </Grid>
      </Box>
    </Layout>
  );
}

export default TeacherDashboard;
