import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Grid,
  Typography,
  CardMedia,
  LinearProgress,
  IconButton,
  Tooltip,
  Skeleton,
} from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import RefreshIcon from "@mui/icons-material/Refresh";

import Layout from "../../components/layout/Layout";
import GlassCard from "../../components/common/GlassCard";
import StatusBadge from "../../components/common/StatusBadge";
import api from "../../servises/api";

export default function MyCourses() {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const fetchMyCourses = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await api.get("/student/my-courses");
      setEnrollments(Array.isArray(response.data?.enrollments) ? response.data.enrollments : []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load your enrolled courses.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyCourses();
  }, []);

  return (
    <Layout>
      <Box sx={{ width: "100%", display: "flex", flexDirection: "column", gap: 3.5 }}>
        {/* Header */}
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
            <Typography variant="h4" sx={{ fontWeight: 800 }}>
              My Enrolled Courses
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>
              Access active curriculum tracks, assignments, and faculty instructor updates.
            </Typography>
          </Box>

          <Box sx={{ display: "flex", gap: 1.5 }}>
            <Tooltip title="Refresh">
              <IconButton
                onClick={fetchMyCourses}
                disabled={loading}
                sx={{
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                  borderRadius: "8px",
                  p: 1,
                }}
              >
                <RefreshIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            <Button
              variant="contained"
              size="small"
              startIcon={<MenuBookIcon />}
              onClick={() => navigate("/student/courses")}
            >
              Browse Catalog
            </Button>
          </Box>
        </Box>

        {error && (
          <Alert severity="error" onClose={() => setError("")}>
            {error}
          </Alert>
        )}

        {/* Content */}
        {loading ? (
          <Grid container spacing={3}>
            {Array.from({ length: 3 }).map((_, i) => (
              <Grid item xs={12} sm={6} md={4} key={i}>
                <GlassCard sx={{ p: 2.5 }}>
                  <Skeleton variant="rectangular" height={140} sx={{ borderRadius: "8px", mb: 2 }} />
                  <Skeleton width="80%" height={28} />
                  <Skeleton width="40%" height={20} sx={{ mb: 2 }} />
                  <Skeleton height={10} sx={{ mb: 2 }} />
                  <Skeleton height={36} />
                </GlassCard>
              </Grid>
            ))}
          </Grid>
        ) : enrollments.length === 0 ? (
          <GlassCard
            sx={{
              textAlign: "center",
              py: 8,
              px: 3,
              border: "1px dashed rgba(255, 255, 255, 0.15)",
            }}
          >
            <SchoolIcon sx={{ fontSize: 56, color: "text.secondary", mb: 1.5 }} />
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              No enrolled courses yet
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5, mb: 3 }}>
              Explore the academy curriculum catalog and submit an enrollment request to begin learning.
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate("/student/courses")}
              startIcon={<ArrowForwardIcon />}
            >
              Explore Course Catalog
            </Button>
          </GlassCard>
        ) : (
          <Grid container spacing={3}>
            {enrollments.map((item) => {
              const course = item.course || {};
              const progress = typeof item.progress === "number" ? Math.round(item.progress) : 0;

              return (
                <Grid item xs={12} sm={6} md={4} key={item._id}>
                  <GlassCard
                    hover
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                  >
                    <Box>
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
                          <SchoolIcon sx={{ fontSize: 50 }} />
                        </Box>
                      )}

                      <Box sx={{ p: 2.5 }}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1.5 }}>
                          <Typography variant="caption" sx={{ color: "#818cf8", fontWeight: 700, textTransform: "uppercase" }}>
                            {course.category || "Academy Track"}
                          </Typography>
                          <StatusBadge status={item.status} />
                        </Box>

                        <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.3, mb: 1 }}>
                          {course.title || "Course"}
                        </Typography>

                        <Typography
                          variant="body2"
                          sx={{
                            color: "text.secondary",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            mb: 2,
                          }}
                        >
                          {course.description || "Continue mastering your coursework syllabus."}
                        </Typography>

                        {/* Progress */}
                        {item.status === "Approved" && (
                          <Box sx={{ mt: "auto", pt: 1 }}>
                            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                              <Typography variant="caption" sx={{ color: "text.secondary" }}>
                                Syllabus Progress
                              </Typography>
                              <Typography variant="caption" sx={{ fontWeight: 700, color: "#6366f1" }}>
                                {progress}%
                              </Typography>
                            </Box>
                            <LinearProgress
                              variant="determinate"
                              value={progress}
                              sx={{
                                height: 6,
                                borderRadius: 3,
                                bgcolor: "rgba(255, 255, 255, 0.08)",
                                "& .MuiLinearProgress-bar": {
                                  bgcolor: progress === 100 ? "#10b981" : "#6366f1",
                                },
                              }}
                            />
                          </Box>
                        )}
                      </Box>
                    </Box>

                    <Box sx={{ p: 2.5, pt: 0 }}>
                      <Button
                        fullWidth
                        variant="contained"
                        size="small"
                        onClick={() => navigate("/student/assignments")}
                        disabled={item.status !== "Approved"}
                      >
                        {item.status === "Approved" ? "Access Coursework" : "Admission Pending"}
                      </Button>
                    </Box>
                  </GlassCard>
                </Grid>
              );
            })}
          </Grid>
        )}
      </Box>
    </Layout>
  );
}
