import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Alert,
  alpha,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Container,
  IconButton,
  InputAdornment,
  Paper,
  Skeleton,
  Stack,
  TextField,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import PersonIcon from "@mui/icons-material/Person";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import RefreshIcon from "@mui/icons-material/Refresh";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import HourglassTopRoundedIcon from "@mui/icons-material/HourglassTopRounded";
import AutoStoriesRoundedIcon from "@mui/icons-material/AutoStoriesRounded";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";

import api from "../../servises/api";

export default function MyCourses() {
  const theme = useTheme();
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enrollingId, setEnrollingId] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");

  const isDark = theme.palette.mode === "dark";
  const surface = theme.palette.background.paper;
  const borderColor = theme.palette.divider;

  const studentName = useMemo(() => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      return user?.name?.trim()?.split(/\s+/)[0] || "Student";
    } catch {
      return "Student";
    }
  }, []);

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
        err.response?.data?.message ||
          "Unable to load courses. Please try again."
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

  // Only pending or approved enrollments reserve the student's course slot.
  const activeEnrollment = enrollments.find((item) =>
    ["Pending", "Approved"].includes(item.status)
  );

  const activeCourseId = activeEnrollment
    ? String(getCourseId(activeEnrollment))
    : null;

  const getEnrollment = (courseId) =>
    enrollments.find(
      (item) => String(getCourseId(item)) === String(courseId)
    );

  const getStatusColor = (status) => {
    if (status === "Approved") return "success";
    if (status === "Rejected") return "error";
    return "warning";
  };

  const formatPrice = (price) => {
    const amount = Number(price || 0);
    return amount === 0 ? "Free" : `Rs. ${amount.toLocaleString("en-PK")}`;
  };

  const handleEnroll = async (courseId) => {
    if (activeEnrollment) {
      setError(
        "You already have a pending or approved course enrollment."
      );
      return;
    }

    try {
      setEnrollingId(courseId);
      setError("");
      setMessage("");

      const response = await api.post(`/student/enroll/${courseId}`);
      setMessage(
        response.data?.message ||
          "Your enrollment request has been submitted."
      );

      await fetchData(false);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Could not submit your enrollment request."
      );
    } finally {
      setEnrollingId(null);
    }
  };

  const filteredCourses = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return courses;

    return courses.filter((course) =>
      [
        course.title,
        course.category,
        course.description,
        course.teacher?.name,
      ].some(
        (value) =>
          typeof value === "string" && value.toLowerCase().includes(query)
      )
    );
  }, [courses, search]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        overflowX: "hidden",
        backgroundColor: isDark ? "#0b1120" : "#f5f7fc",
      }}
    >
      <Box
        component="header"
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 1200,
          width: "100%",
          bgcolor: alpha(surface, 0.98),
          backdropFilter: "blur(16px)",
          borderBottom: `1px solid ${borderColor}`,
          boxShadow: isDark
            ? "0 3px 14px rgba(0,0,0,0.2)"
            : "0 3px 14px rgba(15,23,42,0.045)",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "3px",
            background: "linear-gradient(90deg, #1d4ed8, #6366f1, #1d4ed8)",
          },
        }}
      >
        <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3 } }}>
          <Box
            sx={{
              minHeight: { xs: 68, sm: 76 },
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: { xs: 1, sm: 2 },
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: { xs: 1, sm: 1.4 },
                minWidth: 0,
                flex: "1 1 0",
              }}
            >
              <Box
                sx={{
                  width: { xs: 38, sm: 46 },
                  height: { xs: 38, sm: 46 },
                  flex: "0 0 auto",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: { xs: "11px", sm: "13px" },
                  color: "#fff",
                  background:
                    "linear-gradient(145deg, #2563eb 0%, #1e40af 58%, #312e81 100%)",
                  border: "1px solid rgba(255,255,255,0.35)",
                  boxShadow: "0 4px 11px rgba(37,99,235,0.24)",
                }}
              >
                <Typography
                  component="span"
                  sx={{
                    color: "#fff",
                    fontSize: { xs: "14px", sm: "17px" },
                    fontWeight: 950,
                    letterSpacing: "-0.8px",
                    lineHeight: 1,
                  }}
                >
                  EIK
                </Typography>
              </Box>

              <Box sx={{ minWidth: 0 }}>
                <Typography
                  component="div"
                  sx={{
                    color: "text.primary",
                    fontSize: { xs: "0.72rem", sm: "0.95rem", md: "1rem" },
                    fontWeight: 850,
                    lineHeight: 1.2,
                    letterSpacing: { xs: 0, sm: "0.35px" },
                    whiteSpace: "nowrap",
                  }}
                >
                  Extreme Institute
                </Typography>
                <Typography
                  component="div"
                  sx={{
                    mt: 0.25,
                    color: "primary.main",
                    fontSize: { xs: "0.62rem", sm: "0.72rem" },
                    fontWeight: 800,
                    letterSpacing: { xs: "1.45px", sm: "2.2px" },
                    lineHeight: 1.15,
                    whiteSpace: "nowrap",
                  }}
                >
                  OF KNOWLEDGE
                </Typography>
              </Box>
            </Box>

            <Chip
              icon={<MenuBookIcon />}
              label="Course catalog"
              sx={{
                display: { xs: "none", sm: "flex" },
                flexShrink: 0,
                bgcolor: alpha(theme.palette.primary.main, 0.08),
                color: "primary.main",
                fontWeight: 750,
                "& .MuiChip-icon": { color: "primary.main" },
              }}
            />

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                flex: "1 1 0",
                minWidth: 0,
              }}
            >
              <Tooltip title="Open your profile" arrow>
                <IconButton
                  onClick={() => navigate("/student/profile")}
                  aria-label="Open student profile"
                  sx={{
                    width: { xs: 40, sm: 44 },
                    height: { xs: 40, sm: 44 },
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.24)}`,
                    bgcolor: alpha(theme.palette.primary.main, 0.07),
                    color: "primary.main",
                    transition: "all .2s ease",
                    "&:hover": {
                      bgcolor: "primary.main",
                      color: "#fff",
                      transform: "translateY(-1px)",
                      boxShadow: "0 5px 13px rgba(37,99,235,0.2)",
                    },
                  }}
                >
                  <Avatar
                    sx={{
                      width: { xs: 30, sm: 34 },
                      height: { xs: 30, sm: 34 },
                      bgcolor: "primary.main",
                      color: "#fff",
                      fontSize: "0.85rem",
                      fontWeight: 750,
                    }}
                  >
                    {studentName.charAt(0).toUpperCase()}
                  </Avatar>
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* ================================================== */}
      {/* PRE-APPROVAL LANDING PAGE */}
      {/* ================================================== */}
      <Box component="main">
        <Container maxWidth="xl" sx={{ py: { xs: 2.5, sm: 3, md: 4 } }}>
          {message && (
            <Alert
              severity="success"
              sx={{ mb: 2.5, borderRadius: "12px" }}
              onClose={() => setMessage("")}
            >
              {message}
            </Alert>
          )}

          {error && (
            <Alert
              severity="error"
              sx={{ mb: 2.5, borderRadius: "12px" }}
              onClose={() => setError("")}
              action={
                <Button
                  color="inherit"
                  size="small"
                  onClick={() => fetchData()}
                  disabled={loading}
                >
                  Retry
                </Button>
              }
            >
              {error}
            </Alert>
          )}

          {/* Welcome hero */}
          <Box
            sx={{
              position: "relative",
              overflow: "hidden",
              borderRadius: { xs: "17px", md: "23px" },
              p: { xs: 2.5, sm: 3.5, md: 4.5 },
              mb: 3,
              color: "#fff",
              background:
                "linear-gradient(115deg, #10295c 0%, #1d4ed8 60%, #5145cd 100%)",
            }}
          >
            <Box
              aria-hidden="true"
              sx={{
                position: "absolute",
                width: 250,
                height: 250,
                borderRadius: "50%",
                border: "1px solid rgba(255,255,255,0.12)",
                right: -90,
                top: -145,
              }}
            />
            <Box
              aria-hidden="true"
              sx={{
                position: "absolute",
                width: 180,
                height: 180,
                borderRadius: "50%",
                border: "1px solid rgba(255,255,255,0.12)",
                right: 65,
                bottom: -130,
              }}
            />

            <Stack
              direction="row"
              spacing={2}
              sx={{
                position: "relative",
                zIndex: 1,
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Box sx={{ maxWidth: 650, minWidth: 0 }}>
                <Typography
                  sx={{
                    fontWeight: 800,
                    fontSize: { xs: "0.7rem", sm: "0.8rem" },
                    letterSpacing: 1.5,
                    color: "rgba(255,255,255,0.8)",
                    mb: 1.2,
                  }}
                >
                  STUDENT LEARNING PORTAL
                </Typography>

                <Typography
                  sx={{
                    fontWeight: 900,
                    fontSize: {
                      xs: "1.65rem",
                      sm: "2.3rem",
                      md: "2.65rem",
                    },
                    letterSpacing: "-0.7px",
                    lineHeight: 1.2,
                    overflowWrap: "anywhere",
                  }}
                >
                  Welcome, {studentName}!
                </Typography>

                <Typography
                  sx={{
                    mt: 1.2,
                    maxWidth: 490,
                    fontSize: { xs: "0.87rem", sm: "0.98rem" },
                    lineHeight: 1.7,
                    color: "rgba(255,255,255,0.84)",
                  }}
                >
                  Discover your next learning opportunity and take the first
                  step towards a brighter future.
                </Typography>
              </Box>

              <Box
                sx={{
                  display: { xs: "none", sm: "flex" },
                  width: { sm: 105, md: 135 },
                  height: { sm: 105, md: 135 },
                  flexShrink: 0,
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "30px",
                  bgcolor: "rgba(255,255,255,0.13)",
                  border: "1px solid rgba(255,255,255,0.2)",
                }}
              >
                <AutoStoriesRoundedIcon sx={{ fontSize: { sm: 60, md: 82 } }} />
              </Box>
            </Stack>
          </Box>

          {/* Enrollment status */}
          {activeEnrollment && (
            <Paper
              elevation={0}
              sx={{
                p: { xs: 2, sm: 2.5 },
                mb: 3,
                borderRadius: "15px",
                bgcolor: surface,
                border: `1px solid ${
                  activeEnrollment.status === "Approved"
                    ? alpha(theme.palette.success.main, 0.35)
                    : alpha(theme.palette.warning.main, 0.4)
                }`,
              }}
            >
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                sx={{
                  justifyContent: "space-between",
                  alignItems: { xs: "flex-start", sm: "center" },
                }}
              >
                <Stack
                  direction="row"
                  spacing={1.5}
                  sx={{ alignItems: "center", minWidth: 0 }}
                >
                  <Avatar
                    sx={{
                      width: 44,
                      height: 44,
                      color:
                        activeEnrollment.status === "Approved"
                          ? "success.main"
                          : "warning.main",
                      bgcolor:
                        activeEnrollment.status === "Approved"
                          ? alpha(theme.palette.success.main, 0.12)
                          : alpha(theme.palette.warning.main, 0.12),
                    }}
                  >
                    {activeEnrollment.status === "Approved" ? (
                      <CheckCircleRoundedIcon />
                    ) : (
                      <HourglassTopRoundedIcon />
                    )}
                  </Avatar>

                  <Box sx={{ minWidth: 0 }}>
                    <Typography fontWeight={800}>
                      {activeEnrollment.status === "Approved"
                        ? "Your enrollment is approved!"
                        : "Your enrollment is under review"}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {activeEnrollment.status === "Approved"
                        ? "Your teacher approved your request. You can now enter your student dashboard."
                        : "Your teacher is reviewing your request. Dashboard access stays locked until approval."}
                    </Typography>
                  </Box>
                </Stack>

                {activeEnrollment.status === "Approved" ? (
                  <Button
                    variant="contained"
                    endIcon={<ArrowForwardIcon />}
                    onClick={() => navigate("/student/dashboard")}
                    sx={{
                      borderRadius: "9px",
                      px: 2.5,
                      py: 1,
                      fontWeight: 800,
                      textTransform: "none",
                      flexShrink: 0,
                    }}
                  >
                    Enter Dashboard
                  </Button>
                ) : (
                  <Chip
                    icon={<LockOutlinedIcon />}
                    label="Awaiting Approval"
                    color="warning"
                    variant="outlined"
                    sx={{ fontWeight: 800, flexShrink: 0 }}
                  />
                )}
              </Stack>
            </Paper>
          )}

          {/* Course catalog heading and search */}
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            sx={{
              justifyContent: "space-between",
              alignItems: { xs: "stretch", sm: "center" },
              mb: 2.5,
            }}
          >
            <Box id="course-catalog">
              <Typography
                variant="h5"
                fontWeight={900}
                sx={{ fontSize: { xs: "1.3rem", sm: "1.65rem" } }}
              >
                Explore Our Courses
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                Find the right course for your learning goals.
              </Typography>
            </Box>

            <Stack direction="row" spacing={1} sx={{ width: { xs: "100%", sm: "auto" } }}>
              <TextField
                fullWidth
                size="small"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search courses..."
                sx={{
                  minWidth: 0,
                  maxWidth: { sm: 320 },
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "10px",
                    bgcolor: surface,
                  },
                }}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon color="action" />
                      </InputAdornment>
                    ),
                    endAdornment: search && (
                      <InputAdornment position="end">
                        <IconButton
                          size="small"
                          aria-label="Clear course search"
                          onClick={() => setSearch("")}
                          edge="end"
                        >
                          <ClearIcon fontSize="small" />
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />

              <Tooltip title="Refresh courses">
                <span>
                  <IconButton
                    onClick={() => fetchData()}
                    disabled={loading}
                    aria-label="Refresh courses"
                    sx={{
                      width: 40,
                      height: 40,
                      flexShrink: 0,
                      borderRadius: "10px",
                      border: `1px solid ${borderColor}`,
                      bgcolor: surface,
                    }}
                  >
                    <RefreshIcon />
                  </IconButton>
                </span>
              </Tooltip>
            </Stack>
          </Stack>

          {!loading && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1.8 }}>
              {filteredCourses.length} {filteredCourses.length === 1 ? "course" : "courses"} available
            </Typography>
          )}

          {/* Loading skeletons */}
          {loading ? (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, minmax(0, 1fr))",
                  lg: "repeat(3, minmax(0, 1fr))",
                },
                gap: 2.5,
              }}
            >
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <Paper
                  key={item}
                  elevation={0}
                  sx={{ p: 2, border: `1px solid ${borderColor}`, borderRadius: "15px" }}
                >
                  <Skeleton variant="rounded" height={165} sx={{ borderRadius: "11px", mb: 2 }} />
                  <Skeleton width="45%" />
                  <Skeleton width="80%" height={32} />
                  <Skeleton width="65%" />
                  <Skeleton variant="rounded" height={42} sx={{ mt: 2 }} />
                </Paper>
              ))}
            </Box>
          ) : filteredCourses.length === 0 ? (
            <Paper
              elevation={0}
              sx={{
                p: { xs: 4, sm: 6 },
                textAlign: "center",
                borderRadius: "17px",
                border: `1px solid ${borderColor}`,
                bgcolor: surface,
              }}
            >
              <SchoolRoundedIcon sx={{ fontSize: 52, color: "text.disabled", mb: 1.5 }} />
              <Typography variant="h6" fontWeight={800}>
                {courses.length === 0 ? "No courses available yet" : "No matching courses found"}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {courses.length === 0
                  ? "New courses will appear here when they are published."
                  : "Try searching with another course name or category."}
              </Typography>
              {courses.length > 0 && search && (
                <Button
                  onClick={() => setSearch("")}
                  sx={{ mt: 1.5, textTransform: "none", fontWeight: 700 }}
                >
                  Clear search
                </Button>
              )}
            </Paper>
          ) : (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "minmax(0, 1fr)",
                  sm: "repeat(2, minmax(0, 1fr))",
                  lg: "repeat(3, minmax(0, 1fr))",
                },
                gap: { xs: 2, md: 2.5 },
                alignItems: "stretch",
              }}
            >
              {filteredCourses.map((course) => {
                const enrollment = getEnrollment(course._id);
                const status = enrollment?.status;
                const isActiveCourse = activeCourseId === String(course._id);
                const isEnrolling = enrollingId === course._id;
                const hasThumbnail =
                  typeof course.thumbnail === "string" &&
                  /^(https?:\/\/|data:image\/)/i.test(course.thumbnail);

                return (
                  <Card
                    key={course._id}
                    elevation={0}
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      minWidth: 0,
                      overflow: "hidden",
                      borderRadius: "16px",
                      bgcolor: surface,
                      border: `1px solid ${borderColor}`,
                      transition: "all .22s ease",
                      "&:hover": {
                        borderColor: theme.palette.primary.main,
                        boxShadow: isDark
                          ? "0 10px 28px rgba(0,0,0,0.25)"
                          : "0 12px 28px rgba(15,23,42,0.09)",
                        transform: { xs: "none", md: "translateY(-4px)" },
                      },
                    }}
                  >
                    <Box
                      sx={{
                        height: { xs: 155, sm: 170 },
                        position: "relative",
                        overflow: "hidden",
                        bgcolor: "#dbeafe",
                      }}
                    >
                      {hasThumbnail ? (
                        <CardMedia
                          component="img"
                          image={course.thumbnail}
                          alt={course.title || "Course"}
                          sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                      ) : (
                        <Box
                          sx={{
                            height: "100%",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            color: "#3158bb",
                            background: "linear-gradient(135deg, #dbeafe, #c7d2fe)",
                          }}
                        >
                          <AutoStoriesRoundedIcon sx={{ fontSize: 70 }} />
                        </Box>
                      )}

                      <Chip
                        label={course.category || "General"}
                        size="small"
                        sx={{
                          position: "absolute",
                          left: 12,
                          bottom: 12,
                          maxWidth: "75%",
                          color: "#fff",
                          fontWeight: 700,
                          bgcolor: "rgba(15,23,42,0.75)",
                          backdropFilter: "blur(6px)",
                        }}
                      />
                    </Box>

                    <CardContent
                      sx={{
                        p: 2.3,
                        display: "flex",
                        flexDirection: "column",
                        flexGrow: 1,
                        "&:last-child": { pb: 2.3 },
                      }}
                    >
                      <Stack
                        direction="row"
                        spacing={1}
                        sx={{
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          mb: 1,
                        }}
                      >
                        <Typography
                          variant="h6"
                          fontWeight={850}
                          sx={{
                            fontSize: "1.08rem",
                            lineHeight: 1.4,
                            overflowWrap: "anywhere",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {course.title}
                        </Typography>

                        {status && (
                          <Chip
                            label={status}
                            color={getStatusColor(status)}
                            size="small"
                            sx={{ fontWeight: 700, flexShrink: 0, fontSize: "0.68rem" }}
                          />
                        )}
                      </Stack>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          lineHeight: 1.7,
                          minHeight: "4.5em",
                          mb: 2,
                          display: "-webkit-box",
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {course.description || "Explore this course and build valuable new skills."}
                      </Typography>

                      <Stack
                        direction="row"
                        spacing={1.2}
                        sx={{ alignItems: "center", mb: 2 }}
                      >
                        <Avatar
                          sx={{
                            width: 35,
                            height: 35,
                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                            color: "primary.main",
                          }}
                        >
                          <PersonIcon fontSize="small" />
                        </Avatar>
                        <Box sx={{ minWidth: 0 }}>
                          <Typography variant="caption" color="text.secondary">
                            INSTRUCTOR
                          </Typography>
                          <Typography variant="body2" fontWeight={750} noWrap>
                            {course.teacher?.name || "Instructor"}
                          </Typography>
                        </Box>
                      </Stack>

                      <Box sx={{ mt: "auto", pt: 1.8, borderTop: `1px solid ${borderColor}` }}>
                        <Stack
                          direction="row"
                          sx={{
                            alignItems: "center",
                            justifyContent: "space-between",
                            mb: 1.8,
                          }}
                        >
                          <Typography variant="caption" color="text.secondary" fontWeight={700}>
                            COURSE FEE
                          </Typography>
                          <Typography variant="h6" fontWeight={900} color="primary.main">
                            {formatPrice(course.price)}
                          </Typography>
                        </Stack>

                        {isActiveCourse && status === "Approved" ? (
                          <Button
                            fullWidth
                            variant="contained"
                            endIcon={<ArrowForwardIcon />}
                            onClick={() => navigate("/student/dashboard")}
                            sx={{ py: 1.15, borderRadius: "10px", fontWeight: 800, textTransform: "none", boxShadow: "none" }}
                          >
                            Enter Dashboard
                          </Button>
                        ) : isActiveCourse && status === "Pending" ? (
                          <Button
                            fullWidth
                            disabled
                            variant="outlined"
                            startIcon={<HourglassTopRoundedIcon />}
                            sx={{ py: 1.15, borderRadius: "10px", textTransform: "none", fontWeight: 700 }}
                          >
                            Awaiting Teacher Approval
                          </Button>
                        ) : activeEnrollment ? (
                          <Button
                            fullWidth
                            disabled
                            variant="outlined"
                            startIcon={<LockOutlinedIcon />}
                            sx={{ py: 1.15, borderRadius: "10px", textTransform: "none" }}
                          >
                            One Course at a Time
                          </Button>
                        ) : (
                          <Button
                            fullWidth
                            variant="contained"
                            endIcon={<ArrowForwardIcon />}
                            disabled={isEnrolling}
                            onClick={() => handleEnroll(course._id)}
                            sx={{ py: 1.15, borderRadius: "10px", fontWeight: 800, textTransform: "none", boxShadow: "none" }}
                          >
                            {isEnrolling
                              ? "Submitting..."
                              : status === "Rejected"
                                ? "Apply Again"
                                : "Request Enrollment"}
                          </Button>
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                );
              })}
            </Box>
          )}
        </Container>
      </Box>
    </Box>
  );
}
