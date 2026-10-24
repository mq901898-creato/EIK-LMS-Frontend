
import React, { useEffect, useState } from "react";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Typography,
} from "@mui/material";

import School from "@mui/icons-material/School";
import MenuBook from "@mui/icons-material/MenuBook";
import Person from "@mui/icons-material/Person";
import ArrowForward from "@mui/icons-material/ArrowForward";

import { useNavigate } from "react-router-dom";
import api from "../../servises/api";

export default function MyCourses() {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyCourses = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/student/my-courses");

        setEnrollments(response.data.enrollments || []);
      } catch (err) {
        setError(
          err.response?.data?.message ||
          "Failed to load your courses."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMyCourses();
  }, []);

  const getStatusColor = (status) => {
    if (status === "Approved") return "success";
    if (status === "Rejected") return "error";
    return "warning";
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f5f7fb", py: 4 }}>
      <Container maxWidth="xl">
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            fontWeight={800}
            color="#172554"
            mb={1}
          >
            My Courses
          </Typography>

          <Typography color="text.secondary">
            View your enrollment requests and course statuses.
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress />
          </Box>
        ) : enrollments.length === 0 ? (
          <Card sx={{ textAlign: "center", p: 5, borderRadius: 3 }}>
            <MenuBook sx={{ fontSize: 60, color: "#94a3b8", mb: 2 }} />

            <Typography variant="h6" fontWeight={700} mb={1}>
              You haven't enrolled in any courses yet
            </Typography>

            <Typography color="text.secondary" mb={3}>
              Explore our available courses and send an enrollment request.
            </Typography>

            <Button
              variant="contained"
              endIcon={<ArrowForward />}
             onClick={() => navigate("/student/dashboard")}
            >
              Explore Courses
            </Button>
          </Card>
        ) : (
          <>
            <Typography color="text.secondary" mb={2}>
              Total enrollments: {enrollments.length}
            </Typography>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fill, minmax(min(100%, 280px), 1fr))",
                gap: 3,
              }}
            >
              {enrollments.map((enrollment) => {
                const course = enrollment.course;

                if (!course || typeof course !== "object") {
                  return (
                    <Card key={enrollment._id} sx={{ borderRadius: 3, p: 2 }}>
                      <Typography color="text.secondary">
                        Course details are unavailable.
                      </Typography>
                    </Card>
                  );
                }

                const hasThumbnail =
                  course.thumbnail &&
                  (course.thumbnail.startsWith("data:") ||
                    course.thumbnail.startsWith("http"));

                return (
                  <Card
                    key={enrollment._id}
                    sx={{
                      borderRadius: 3,
                      overflow: "hidden",
                      display: "flex",
                      flexDirection: "column",
                      boxShadow: "0 4px 18px rgba(15,23,42,0.06)",
                      transition: "0.2s",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: "0 10px 24px rgba(15,23,42,0.10)",
                      },
                    }}
                  >
                    {hasThumbnail ? (
                      <Box
                        component="img"
                        src={course.thumbnail}
                        alt={course.title}
                        sx={{
                          width: "100%",
                          height: 170,
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <Box
                        sx={{
                          height: 140,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          bgcolor: "#dbeafe",
                        }}
                      >
                        <School sx={{ fontSize: 60, color: "#2563eb" }} />
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
                      <Typography
                        variant="h6"
                        fontWeight={800}
                        color="#172554"
                        mb={1}
                      >
                        {course.title}
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          mb: 2,
                          lineHeight: 1.7,
                          display: "-webkit-box",
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {course.description || "No description available."}
                      </Typography>

                      <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
                        <Avatar
                          sx={{
                            width: 32,
                            height: 32,
                            bgcolor: "#e0e7ff",
                            color: "#4338ca",
                          }}
                        >
                          <Person fontSize="small" />
                        </Avatar>

                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            Instructor
                          </Typography>

                          <Typography variant="body2" fontWeight={600}>
                            {course.teacher?.name || "Instructor"}
                          </Typography>
                        </Box>
                      </Box>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        mb={2}
                      >
                        Category: {course.category || "General"}
                      </Typography>

                      <Box sx={{ mt: "auto" }}>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            gap: 1,
                            flexWrap: "wrap",
                            mb: 2,
                          }}
                        >
                          <Typography
                            variant="h6"
                            fontWeight={800}
                            color="#1d4ed8"
                          >
                            Rs. {Number(course.price || 0).toLocaleString()}
                          </Typography>

                          <Chip
                            label={enrollment.status || "Pending"}
                            color={getStatusColor(enrollment.status)}
                            size="small"
                          />
                        </Box>


                        {enrollment.status === "Approved" && (
                          <Box>
                            <Alert severity="success" icon={false} sx={{ mb: 2 }}>
                              You're enrolled in this course!
                            </Alert>

                            <Button
                              fullWidth
                              variant="contained"
                              endIcon={<ArrowForward />}
                              onClick={() =>
                               navigate("/student/dashboard")
                              }
                              sx={{
                                py: 1.2,
                                borderRadius: 2,
                                textTransform: "none",
                                fontWeight: 700,
                                bgcolor: "#2563eb",
                                "&:hover": {
                                  bgcolor: "#1d4ed8",
                                },
                              }}
                            >
                              Enter Course
                            </Button>
                          </Box>
                        )}

                        {enrollment.status === "Pending" && (
                          <Alert severity="warning" icon={false}>
                            Waiting for teacher approval.
                          </Alert>
                        )}

                        {enrollment.status === "Rejected" && (
                          <Alert severity="error" icon={false}>
                            Your enrollment request was rejected.
                          </Alert>
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                );
              })}
            </Box>
          </>
        )}
      </Container>
    </Box>
  );
}
