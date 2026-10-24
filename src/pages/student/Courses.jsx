
import React, { useEffect, useState } from "react";
import {
  Alert,
  AppBar,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  CircularProgress,
  Container,
  InputAdornment,
  TextField,
  Toolbar,
  Typography,
  Stack,
} from "@mui/material";

import School from "@mui/icons-material/School";
import Search from "@mui/icons-material/Search";
import MenuBook from "@mui/icons-material/MenuBook";
import Person from "@mui/icons-material/Person";
import ArrowForward from "@mui/icons-material/ArrowForward";
import WorkspacePremium from "@mui/icons-material/WorkspacePremium";
import LockOutlined from "@mui/icons-material/LockOutlined";

import { useNavigate } from "react-router-dom";
import api from "../../servises/api";

const BLUE = "#1d4ed8";
const NAVY = "#172554";

export default function MyCourses() {
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enrollingId, setEnrollingId] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      const [courseRes, enrollmentRes] = await Promise.all([
        api.get("/teacher/student/courses"),
        api.get("/student/my-courses"),
      ]);

      setCourses(courseRes.data.courses || []);
      setEnrollments(enrollmentRes.data.enrollments || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load courses. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getCourseId = (enrollment) => {
    const course = enrollment?.course;
    return typeof course === "object" ? course?._id : course;
  };

  // A Pending or Approved enrollment occupies the student's one course slot.
  const activeEnrollment = enrollments.find((item) =>
    ["Pending", "Approved"].includes(item.status)
  );

  const activeCourseId = getCourseId(activeEnrollment);

  const getEnrollment = (courseId) =>
    enrollments.find((item) => getCourseId(item) === courseId);

  const getStatusColor = (status) => {
    if (status === "Approved") return "success";
    if (status === "Rejected") return "error";
    return "warning";
  };

  const handleEnroll = async (courseId) => {
    // Frontend guard only. The backend must enforce this rule too.
    if (activeEnrollment) {
      setError(
        "You already have a pending or approved course. Finish that enrollment before choosing another."
      );
      return;
    }

    try {
      setEnrollingId(courseId);
      setError("");
      setMessage("");

      const response = await api.post(`/student/enroll/${courseId}`);

      setMessage(
        response.data.message || "Enrollment request sent successfully."
      );

      await fetchData();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Could not submit your enrollment request."
      );
    } finally {
      setEnrollingId(null);
    }
  };

  const filteredCourses = courses.filter((course) => {
    const query = search.toLowerCase();

    return (
      course.title?.toLowerCase().includes(query) ||
      course.category?.toLowerCase().includes(query) ||
      course.teacher?.name?.toLowerCase().includes(query)
    );
  });

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f4f7fc" }}>
      {/* EIK branded header */}
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: "#fff",
          color: NAVY,
          borderBottom: "1px solid #e5eaf2",
        }}
      >
        <Toolbar
          sx={{
            minHeight: { xs: 70, md: 82 },
            px: { xs: 2, md: 4 },
            gap: 1.5,
          }}
        >
          <Avatar
            variant="rounded"
            sx={{
              width: 46,
              height: 46,
              borderRadius: 2.5,
              bgcolor: BLUE,
              boxShadow: "0 5px 14px rgba(29,78,216,0.22)",
            }}
          >
            <School />
          </Avatar>

          <Box sx={{ flexGrow: 1 }}>
            <Typography fontWeight={900} fontSize={17} lineHeight={1.2}>
              EIK
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ letterSpacing: 0.4 }}
            >
              INSTITUTE OF KNOWLEDGE
            </Typography>
          </Box>

          <Chip
            icon={<WorkspacePremium />}
            label="Student Portal"
            sx={{
              display: { xs: "none", sm: "flex" },
              bgcolor: "#eff6ff",
              color: BLUE,
              fontWeight: 700,
              "& .MuiChip-icon": { color: BLUE },
            }}
          />
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ py: { xs: 3, md: 5 } }}>
        {/* Welcome banner */}
        <Box
          sx={{
            position: "relative",
            overflow: "hidden",
            borderRadius: { xs: 3, md: 5 },
            p: { xs: 3, md: 6 },
            mb: 4,
            color: "#fff",
            background:
              "linear-gradient(125deg, #172554 0%, #1d4ed8 65%, #3b82f6 100%)",
          }}
        >
          <Box sx={{ position: "relative", zIndex: 1, maxWidth: 680 }}>
            <Chip
              icon={<School />}
              label="YOUR LEARNING JOURNEY STARTS HERE"
              sx={{
                mb: 2.5,
                bgcolor: "rgba(255,255,255,0.14)",
                color: "#fff",
                fontWeight: 700,
                "& .MuiChip-icon": { color: "#fff" },
              }}
            />

            <Typography
              sx={{
                fontSize: { xs: 30, sm: 40, md: 48 },
                fontWeight: 900,
                lineHeight: 1.15,
                letterSpacing: -1,
                mb: 2,
              }}
            >
              Learn Something
              <Box component="span" sx={{ color: "#bfdbfe" }}>
                {" "}Amazing.
              </Box>
            </Typography>

            <Typography
              sx={{
                maxWidth: 540,
                color: "#dbeafe",
                lineHeight: 1.8,
                fontSize: { xs: 14, md: 17 },
                mb: 3,
              }}
            >
              Explore courses from your instructors, track your
              enrollment, and continue learning once your course is approved.
            </Typography>

            <Stack direction="row" spacing={1} alignItems="center">
              <MenuBook />
              <Typography fontWeight={700}>
                Choose one course at a time
              </Typography>
            </Stack>
          </Box>

          <School
            sx={{
              position: "absolute",
              right: { xs: -25, md: 35 },
              bottom: { xs: -25, md: -40 },
              fontSize: { xs: 140, md: 270 },
              color: "rgba(255,255,255,0.09)",
            }}
          />
        </Box>

        {message && (
          <Alert
            severity="success"
            sx={{ mb: 3, borderRadius: 2 }}
            onClose={() => setMessage("")}
          >
            {message}
          </Alert>
        )}

        {error && (
          <Alert
            severity="error"
            sx={{ mb: 3, borderRadius: 2 }}
            onClose={() => setError("")}
          >
            {error}
          </Alert>
        )}

        {/* Current enrollment information */}
        {activeEnrollment && (
          <Card
            sx={{
              mb: 4,
              borderRadius: 3,
              border: "1px solid #dbeafe",
              boxShadow: "none",
            }}
          >
            <CardContent sx={{ p: { xs: 2, md: 3 } }}>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                alignItems={{ xs: "flex-start", sm: "center" }}
                justifyContent="space-between"
                gap={2}
              >
                <Box>
                  <Typography fontWeight={800} color={NAVY} mb={0.5}>
                    Your Current Enrollment
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {activeEnrollment.status === "Approved"
                      ? "Your course is approved. You can enter your learning space."
                      : "Your request is waiting for teacher approval."}
                  </Typography>
                </Box>

                <Chip
                  label={activeEnrollment.status}
                  color={getStatusColor(activeEnrollment.status)}
                />
              </Stack>
            </CardContent>
          </Card>
        )}

        {/* Course search */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: { xs: "stretch", md: "center" },
            justifyContent: "space-between",
            gap: 2,
            mb: 3,
          }}
        >
          <Box>
            <Typography
              variant="h5"
              fontWeight={900}
              color={NAVY}
              mb={0.5}
            >
              Explore Courses
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Find a course that matches your learning goals.
            </Typography>
          </Box>

          <TextField
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search courses..."
            size="small"
            sx={{
              width: { xs: "100%", md: 330 },
              bgcolor: "#fff",
              "& .MuiOutlinedInput-root": { borderRadius: 3 },
            }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Search color="action" />
                  </InputAdornment>
                ),
              },
            }}
          />
        </Box>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
            <CircularProgress />
          </Box>
        ) : filteredCourses.length === 0 ? (
          <Card
            sx={{
              p: { xs: 4, md: 7 },
              textAlign: "center",
              borderRadius: 4,
              boxShadow: "none",
              border: "1px solid #e5eaf2",
            }}
          >
            <MenuBook sx={{ fontSize: 60, color: "#94a3b8", mb: 1 }} />
            <Typography variant="h6" fontWeight={800}>
              {search ? "No matching courses" : "No courses available yet"}
            </Typography>
            <Typography color="text.secondary" mt={1}>
              {search
                ? "Try another search keyword."
                : "Please check again later for new courses."}
            </Typography>
          </Card>
        ) : (
          <>
            <Typography variant="body2" color="text.secondary" mb={2}>
              {filteredCourses.length} course
              {filteredCourses.length === 1 ? "" : "s"} available
            </Typography>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fill, minmax(min(100%, 285px), 1fr))",
                gap: { xs: 2, md: 3 },
              }}
            >
              {filteredCourses.map((course) => {
                const enrollment = getEnrollment(course._id);
                const status = enrollment?.status;
                const isActiveCourse = activeCourseId === course._id;

                const hasThumbnail =
                  course.thumbnail &&
                  /^(data:|https?:\/\/)/.test(course.thumbnail);

                return (
                  <Card
                    key={course._id}
                    sx={{
                      minWidth: 0,
                      display: "flex",
                      flexDirection: "column",
                      borderRadius: 3.5,
                      overflow: "hidden",
                      bgcolor: "#fff",
                      border: "1px solid #e8edf5",
                      boxShadow: "0 5px 20px rgba(15,23,42,0.045)",
                      transition: "transform .2s, box-shadow .2s",
                      "&:hover": {
                        transform: "translateY(-5px)",
                        boxShadow: "0 14px 32px rgba(15,23,42,0.11)",
                      },
                    }}
                  >
                    {hasThumbnail ? (
                      <CardMedia
                        component="img"
                        image={course.thumbnail}
                        alt={course.title}
                        sx={{ height: 185, objectFit: "cover" }}
                      />
                    ) : (
                      <Box
                        sx={{
                          height: 165,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          background:
                            "linear-gradient(135deg, #dbeafe, #eff6ff)",
                        }}
                      >
                        <MenuBook sx={{ fontSize: 70, color: BLUE }} />
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
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        gap={1}
                        mb={1.5}
                      >
                        <Chip
                          size="small"
                          label={course.category || "General"}
                          sx={{
                            maxWidth: "70%",
                            bgcolor: "#eff6ff",
                            color: BLUE,
                            fontWeight: 700,
                          }}
                        />

                        {status && (
                          <Chip
                            size="small"
                            label={status}
                            color={getStatusColor(status)}
                          />
                        )}
                      </Stack>

                      <Typography
                        variant="h6"
                        fontWeight={850}
                        color={NAVY}
                        mb={1}
                        sx={{ overflowWrap: "anywhere" }}
                      >
                        {course.title}
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          mb: 2.5,
                          lineHeight: 1.75,
                          display: "-webkit-box",
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          minHeight: 60,
                        }}
                      >
                        {course.description || "Course description coming soon."}
                      </Typography>

                      <Stack
                        direction="row"
                        spacing={1.2}
                        alignItems="center"
                        mb={2.5}
                      >
                        <Avatar
                          sx={{
                            width: 36,
                            height: 36,
                            bgcolor: "#e0e7ff",
                            color: "#4338ca",
                          }}
                        >
                          <Person fontSize="small" />
                        </Avatar>
                        <Box sx={{ minWidth: 0 }}>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                          >
                            INSTRUCTOR
                          </Typography>
                          <Typography
                            variant="body2"
                            fontWeight={700}
                            sx={{ overflowWrap: "anywhere" }}
                          >
                            {course.teacher?.name || "Instructor"}
                          </Typography>
                        </Box>
                      </Stack>

                      <Box
                        sx={{
                          mt: "auto",
                          pt: 2,
                          borderTop: "1px solid #eef2f7",
                        }}
                      >
                        <Typography variant="caption" color="text.secondary">
                          COURSE FEE
                        </Typography>
                        <Typography
                          variant="h6"
                          fontWeight={900}
                          color={NAVY}
                          mb={2}
                        >
                          Rs. {Number(course.price || 0).toLocaleString()}
                        </Typography>

                        {isActiveCourse && status === "Approved" ? (
                          <Button
                            fullWidth
                            variant="contained"
                            endIcon={<ArrowForward />}
                           onClick={() => navigate("/student/dashboard")}
                            sx={{
                              py: 1.25,
                              borderRadius: 2.5,
                              textTransform: "none",
                              fontWeight: 800,
                              boxShadow: "none",
                            }}
                          >
                            Enter Course
                          </Button>
                        ) : isActiveCourse && status === "Pending" ? (
                          <Button
                            fullWidth
                            disabled
                            variant="outlined"
                            startIcon={<LockOutlined />}
                            sx={{
                              py: 1.25,
                              borderRadius: 2.5,
                              textTransform: "none",
                            }}
                          >
                            Awaiting Approval
                          </Button>
                        ) : activeEnrollment ? (
                          <Button
                            fullWidth
                            disabled
                            variant="outlined"
                            startIcon={<LockOutlined />}
                            sx={{
                              py: 1.25,
                              borderRadius: 2.5,
                              textTransform: "none",
                            }}
                          >
                            One Course at a Time
                          </Button>
                        ) : (
                          <Button
                            fullWidth
                            variant="contained"
                            endIcon={<ArrowForward />}
                            disabled={enrollingId === course._id}
                            onClick={() => handleEnroll(course._id)}
                            sx={{
                              py: 1.25,
                              borderRadius: 2.5,
                              textTransform: "none",
                              fontWeight: 800,
                              boxShadow: "none",
                            }}
                          >
                            {enrollingId === course._id
                              ? "Sending Request..."
                              : status === "Rejected"
                                ? "Apply Again"
                                : "Enroll Now"}
                          </Button>
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                );
              })}
            </Box>
          </>
        )}

        <Box
          component="footer"
          sx={{
            textAlign: "center",
            py: 4,
            mt: 5,
            borderTop: "1px solid #e5eaf2",
          }}
        >
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} EIK Institute of Knowledge
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Learn • Grow • Succeed
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
