import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Avatar,
  Box,
  Button,
  CardMedia,
  Chip,
  Grid,
  TextField,
  InputAdornment,
  Skeleton,
  Typography,
  Tooltip,
  IconButton,
  CircularProgress,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import SchoolIcon from "@mui/icons-material/School";
import RefreshIcon from "@mui/icons-material/Refresh";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import HourglassTopRoundedIcon from "@mui/icons-material/HourglassTopRounded";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

import Layout from "../../components/layout/Layout";
import GlassCard from "../../components/common/GlassCard";
import StatusBadge from "../../components/common/StatusBadge";
import api from "../../servises/api";

export default function StudentCourses() {
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enrollingId, setEnrollingId] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const fetchData = useCallback(async (showLoader = true) => {
    try {
      if (showLoader) setLoading(true);
      setError("");

      const [courseRes, enrollmentRes] = await Promise.all([
        api.get("/teacher/student/courses"),
        api.get("/student/my-courses"),
      ]);

      setCourses(
        Array.isArray(courseRes.data?.courses) ? courseRes.data.courses : []
      );
      setEnrollments(
        Array.isArray(enrollmentRes.data?.enrollments)
          ? enrollmentRes.data.enrollments
          : []
      );
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to load courses. Please try again."
      );
    } finally {
      if (showLoader) setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const getCourseId = (enrollment) => {
    const course = enrollment?.course;
    return typeof course === "object" ? course?._id : course;
  };

  const activeEnrollment = enrollments.find((item) =>
    ["Pending", "Approved"].includes(item.status)
  );

  const getEnrollment = (courseId) =>
    enrollments.find((item) => String(getCourseId(item)) === String(courseId));

  const formatPrice = (price) => {
    const amount = Number(price || 0);
    return amount === 0 ? "Scholarship Track (Free)" : `Rs. ${amount.toLocaleString()}`;
  };

  const handleEnroll = async (courseId) => {
    if (activeEnrollment) {
      setError("You already have an active course enrollment in review or progress.");
      return;
    }

    try {
      setEnrollingId(courseId);
      setError("");
      setMessage("");

      const response = await api.post(`/student/enroll/${courseId}`);
      setMessage(
        response.data?.message || "Your enrollment application has been submitted to faculty."
      );

      await fetchData(false);
    } catch (err) {
      setError(
        err.response?.data?.message || "Could not submit your enrollment application."
      );
    } finally {
      setEnrollingId(null);
    }
  };

  const categories = useMemo(() => {
    const set = new Set();
    courses.forEach((c) => c.category && set.add(c.category));
    return ["All", ...Array.from(set)];
  }, [courses]);

  const filteredCourses = useMemo(() => {
    let list = courses;
    if (selectedCategory !== "All") {
      list = list.filter((c) => c.category === selectedCategory);
    }

    const query = search.trim().toLowerCase();
    if (!query) return list;

    return list.filter((course) =>
      [course.title, course.category, course.description, course.teacher?.name].some(
        (value) => typeof value === "string" && value.toLowerCase().includes(query)
      )
    );
  }, [courses, search, selectedCategory]);

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
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Typography variant="h4" sx={{ fontWeight: 800 }}>
                Academy Curriculum Catalog
              </Typography>
              <Chip
                label={`${courses.length} Available Tracks`}
                size="small"
                sx={{
                  bgcolor: "rgba(99, 102, 241, 0.12)",
                  color: "#818cf8",
                  fontWeight: 700,
                  fontSize: "0.72rem",
                }}
              />
            </Box>
            <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>
              Browse syllabus specializations, faculty-led tracks, and certification coursework.
            </Typography>
          </Box>

          <Box sx={{ display: "flex", gap: 1.5 }}>
            <Tooltip title="Refresh">
              <IconButton
                onClick={() => fetchData(true)}
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
              variant="outlined"
              size="small"
              onClick={() => navigate("/student/my-courses")}
              endIcon={<ArrowForwardIcon />}
            >
              My Enrolled Tracks
            </Button>
          </Box>
        </Box>

        {/* Alerts */}
        {message && (
          <Alert severity="success" onClose={() => setMessage("")}>
            {message}
          </Alert>
        )}
        {error && (
          <Alert severity="error" onClose={() => setError("")}>
            {error}
          </Alert>
        )}

        {/* Search & Category Filter Toolbar */}
        <GlassCard sx={{ p: 2.5 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            <TextField
              size="small"
              placeholder="Search curriculum by title, keywords, or instructor..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "text.secondary", fontSize: 18 }} />
                  </InputAdornment>
                ),
              }}
              sx={{ width: { xs: "100%", sm: 380 } }}
            />

            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              {categories.map((cat) => (
                <Button
                  key={cat}
                  size="small"
                  variant={selectedCategory === cat ? "contained" : "outlined"}
                  onClick={() => setSelectedCategory(cat)}
                  sx={{
                    borderRadius: "6px",
                    px: 1.5,
                    fontSize: "0.78rem",
                    ...(selectedCategory !== cat && {
                      borderColor: "rgba(255, 255, 255, 0.1)",
                      color: "text.secondary",
                    }),
                  }}
                >
                  {cat}
                </Button>
              ))}
            </Box>
          </Box>
        </GlassCard>

        {/* Courses Grid */}
        {loading ? (
          <Grid container spacing={3}>
            {Array.from({ length: 6 }).map((_, i) => (
              <Grid item xs={12} sm={6} md={4} key={i}>
                <GlassCard sx={{ p: 2.5 }}>
                  <Skeleton variant="rectangular" height={150} sx={{ borderRadius: "8px", mb: 2 }} />
                  <Skeleton width="80%" height={26} />
                  <Skeleton width="40%" height={18} sx={{ mb: 2 }} />
                  <Skeleton height={40} />
                </GlassCard>
              </Grid>
            ))}
          </Grid>
        ) : filteredCourses.length === 0 ? (
          <GlassCard
            sx={{
              textAlign: "center",
              py: 8,
              px: 3,
              border: "1px dashed rgba(255, 255, 255, 0.15)",
            }}
          >
            <MenuBookIcon sx={{ fontSize: 50, color: "text.secondary", mb: 1.5 }} />
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              No courses matching your criteria
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>
              Try adjusting your search query or selecting a different academic discipline.
            </Typography>
          </GlassCard>
        ) : (
          <Grid container spacing={3}>
            {filteredCourses.map((course) => {
              const enrollment = getEnrollment(course._id);
              const isEnrolledApproved = enrollment?.status === "Approved";
              const isEnrolledPending = enrollment?.status === "Pending";
              const isEnrolling = enrollingId === course._id;

              return (
                <Grid item xs={12} sm={6} md={4} key={course._id}>
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
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1.5 }}>
                          <Chip
                            label={course.category || "Curriculum Track"}
                            size="small"
                            sx={{
                              bgcolor: "rgba(99, 102, 241, 0.08)",
                              color: "#818cf8",
                              fontWeight: 700,
                              fontSize: "0.72rem",
                              border: "1px solid rgba(99, 102, 241, 0.2)",
                            }}
                          />
                          <Typography variant="caption" sx={{ fontWeight: 800, color: "#10b981", fontSize: "0.825rem" }}>
                            {formatPrice(course.price)}
                          </Typography>
                        </Box>

                        <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.3, mb: 1 }}>
                          {course.title}
                        </Typography>

                        <Typography
                          variant="body2"
                          sx={{
                            color: "text.secondary",
                            display: "-webkit-box",
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            mb: 2,
                            lineHeight: 1.5,
                          }}
                        >
                          {course.description || "Course details, lectures, and assignments."}
                        </Typography>

                        {/* Teacher Avatar */}
                        {course.teacher?.name && (
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1, pt: 1, borderTop: "1px solid rgba(255, 255, 255, 0.06)" }}>
                            <Avatar sx={{ width: 26, height: 26, fontSize: "0.75rem", bgcolor: "#6366f1" }}>
                              {course.teacher.name.charAt(0).toUpperCase()}
                            </Avatar>
                            <Typography variant="caption" sx={{ color: "text.secondary" }}>
                              Instructor: {course.teacher.name}
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    </Box>

                    <Box sx={{ p: 2.5, pt: 0 }}>
                      {isEnrolledApproved ? (
                        <Button
                          fullWidth
                          variant="contained"
                          color="success"
                          startIcon={<CheckCircleRoundedIcon />}
                          onClick={() => navigate("/student/assignments")}
                          size="small"
                        >
                          Enrolled • Access Syllabus
                        </Button>
                      ) : isEnrolledPending ? (
                        <Button
                          fullWidth
                          variant="outlined"
                          color="warning"
                          startIcon={<HourglassTopRoundedIcon />}
                          disabled
                          size="small"
                        >
                          Application Under Review
                        </Button>
                      ) : (
                        <Button
                          fullWidth
                          variant="contained"
                          disabled={isEnrolling || Boolean(activeEnrollment)}
                          onClick={() => handleEnroll(course._id)}
                          size="small"
                        >
                          {isEnrolling ? (
                            <CircularProgress size={18} sx={{ color: "#ffffff" }} />
                          ) : (
                            "Enroll in Course Track"
                          )}
                        </Button>
                      )}
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
