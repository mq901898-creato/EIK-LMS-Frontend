
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  FormControl,
  IconButton,
  InputAdornment,
  MenuItem,
  Select,
  Skeleton,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";

import QuizIcon from "@mui/icons-material/Quiz";
import SearchIcon from "@mui/icons-material/Search";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import RefreshIcon from "@mui/icons-material/Refresh";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import ClearIcon from "@mui/icons-material/Clear";

import StudentLayout from "../components/student/StudentLayout";
import api from "../../servises/api";

function Quizzes() {
  const theme = useTheme();
  const navigate = useNavigate();

  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("all");

  const isDark = theme.palette.mode === "dark";
  const borderColor = theme.palette.divider;

  // Fetch quizzes
  const loadQuizzes = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/student/quizzes");

      if (response.data?.success === false) {
        throw new Error(response.data.message || "Unable to load quizzes.");
      }

      setQuizzes(
        Array.isArray(response.data?.quizzes)
          ? response.data.quizzes
          : []
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadQuizzes();
  }, [loadQuizzes]);

  // Get course ID
  const getCourseId = (course) => {
    if (course && typeof course === "object") {
      return course._id || "";
    }

    return course || "";
  };

  // Get course title
  const getCourseName = (course) => {
    if (course && typeof course === "object") {
      return course.title || "Course";
    }

    return "Course";
  };

  // Format date
  const formatDate = (date) => {
    if (!date) return "Date unavailable";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Date unavailable";
    }

    return parsedDate.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Unique courses
  const courses = useMemo(() => {
    const courseMap = new Map();

    quizzes.forEach((quiz) => {
      const id = getCourseId(quiz.course);

      if (id) {
        courseMap.set(id, getCourseName(quiz.course));
      }
    });

    return Array.from(courseMap, ([id, title]) => ({
      id,
      title,
    }));
  }, [quizzes]);

  // Search and filter
  const filteredQuizzes = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return quizzes.filter((quiz) => {
      const title = quiz.title || "";
      const topic = quiz.topic || "";
      const courseName = getCourseName(quiz.course);

      const matchesSearch =
        title.toLowerCase().includes(keyword) ||
        topic.toLowerCase().includes(keyword) ||
        courseName.toLowerCase().includes(keyword);

      const matchesCourse =
        selectedCourse === "all" ||
        String(getCourseId(quiz.course)) === selectedCourse;

      return matchesSearch && matchesCourse;
    });
  }, [quizzes, search, selectedCourse]);

  const handleOpenQuiz = (quizId) => {
    if (quizId) {
      navigate(`/student/quizzes/${quizId}`);
    }
  };

  const clearFilters = () => {
    setSearch("");
    setSelectedCourse("all");
  };

  const hasFilters = search.trim() !== "" || selectedCourse !== "all";

  return (
    <StudentLayout>
      <Box
        sx={{
          minHeight: "100%",
          backgroundColor: isDark ? "#0b1120" : "transparent",
        }}
      >
        <Container maxWidth="xl" disableGutters>

          {/* HEADER */}
          <Stack
            direction="row"
            spacing={2}
            sx={{
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2.5,
            }}
          >
            <Box sx={{ minWidth: 0 }}>
              <Typography
                fontWeight={800}
                sx={{
                  fontSize: { xs: "1.3rem", sm: "1.55rem" },
                  lineHeight: 1.3,
                }}
              >
                Available Quizzes
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 0.4 }}
              >
                Test your knowledge and improve your skills.
              </Typography>
            </Box>

            <Button
              variant="contained"
              startIcon={<RefreshIcon />}
              onClick={loadQuizzes}
              disabled={loading}
              sx={{
                flexShrink: 0,
                minWidth: { xs: "auto", sm: 105 },
                px: { xs: 1.5, sm: 2 },
                py: 1,
                borderRadius: "9px",
                textTransform: "none",
                fontWeight: 700,
                boxShadow: "none",
              }}
            >
              Refresh
            </Button>
          </Stack>

          {/* SEARCH AND COURSE FILTER */}
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1.5}
            sx={{ mb: 2.5 }}
          >
            <TextField
              fullWidth
              size="small"
              placeholder="Search by quiz, topic or course..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: search && (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        onClick={() => setSearch("")}
                        aria-label="Clear search"
                      >
                        <ClearIcon fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
              sx={{
                flex: 1,
                "& .MuiOutlinedInput-root": {
                  borderRadius: "9px",
                  backgroundColor: theme.palette.background.paper,
                },
              }}
            />

            <FormControl
              size="small"
              sx={{
                width: { xs: "100%", sm: 220 },
                flexShrink: 0,
              }}
            >
              <Select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                displayEmpty
                sx={{
                  borderRadius: "9px",
                  backgroundColor: theme.palette.background.paper,
                }}
              >
                <MenuItem value="all">All Courses</MenuItem>

                {courses.map((course) => (
                  <MenuItem key={course.id} value={String(course.id)}>
                    {course.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>

          {/* RESULT COUNT */}
          {!loading && !error && quizzes.length > 0 && (
            <Stack
              direction="row"
              sx={{
                alignItems: "center",
                justifyContent: "space-between",
                mb: 1.5,
              }}
            >
              <Typography variant="body2" color="text.secondary">
                {filteredQuizzes.length}{" "}
                {filteredQuizzes.length === 1 ? "quiz" : "quizzes"} found
              </Typography>

              {hasFilters && (
                <Button
                  size="small"
                  onClick={clearFilters}
                  sx={{ textTransform: "none" }}
                >
                  Clear filters
                </Button>
              )}
            </Stack>
          )}

          {/* ERROR */}
          {error && (
            <Alert
              severity="error"
              sx={{ mb: 2, borderRadius: "9px" }}
              action={
                <Button
                  color="inherit"
                  size="small"
                  onClick={loadQuizzes}
                >
                  Retry
                </Button>
              }
            >
              {error}
            </Alert>
          )}

          {/* LOADING */}
          {loading ? (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, minmax(0, 1fr))",
                  lg: "repeat(3, minmax(0, 1fr))",
                },
                gap: 2,
              }}
            >
              {[1, 2, 3].map((item) => (
                <Card
                  key={item}
                  elevation={0}
                  sx={{
                    p: 2,
                    border: `1px solid ${borderColor}`,
                    borderRadius: "13px",
                    backgroundColor: theme.palette.background.paper,
                  }}
                >
                  <Skeleton width={45} height={45} variant="rounded" />
                  <Skeleton width="80%" height={30} sx={{ mt: 2 }} />
                  <Skeleton width="50%" />
                  <Skeleton width="70%" sx={{ mt: 2 }} />
                  <Skeleton width="100%" height={40} sx={{ mt: 2 }} />
                </Card>
              ))}
            </Box>
          ) : (
            <>
              {/* EMPTY STATE */}
              {filteredQuizzes.length === 0 ? (
                <Box
                  sx={{
                    py: { xs: 5, md: 7 },
                    px: 2,
                    textAlign: "center",
                    border: `1px solid ${borderColor}`,
                    borderRadius: "13px",
                    backgroundColor: theme.palette.background.paper,
                  }}
                >
                  <QuizIcon
                    sx={{
                      fontSize: 42,
                      color: "text.disabled",
                      mb: 1,
                    }}
                  />

                  <Typography fontWeight={700} variant="h6">
                    {quizzes.length === 0
                      ? "No quizzes available"
                      : "No matching quizzes"}
                  </Typography>

                  <Typography
                    color="text.secondary"
                    variant="body2"
                    sx={{ mt: 0.5 }}
                  >
                    {quizzes.length === 0
                      ? "Published quizzes from your courses will appear here."
                      : "Try another search or select a different course."}
                  </Typography>

                  {hasFilters && (
                    <Button
                      onClick={clearFilters}
                      sx={{ mt: 1.5, textTransform: "none" }}
                    >
                      Clear filters
                    </Button>
                  )}
                </Box>
              ) : (
                /* QUIZ GRID */
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: {
                      xs: "1fr",
                      sm: "repeat(2, minmax(0, 1fr))",
                      lg: "repeat(3, minmax(0, 1fr))",
                    },
                    gap: { xs: 1.5, md: 2 },
                    alignItems: "stretch",
                  }}
                >
                  {filteredQuizzes.map((quiz) => {
                    const questionCount = quiz.questions?.length || 0;

                    return (
                      <Card
                        key={quiz._id}
                        elevation={0}
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          minWidth: 0,
                          border: `1px solid ${borderColor}`,
                          borderRadius: "13px",
                          backgroundColor: theme.palette.background.paper,
                          transition: "border-color 0.2s, box-shadow 0.2s",
                          "&:hover": {
                            borderColor: theme.palette.primary.main,
                            boxShadow: isDark
                              ? "0 5px 18px rgba(0,0,0,0.25)"
                              : "0 5px 18px rgba(0,0,0,0.06)",
                          },
                        }}
                      >
                        <CardContent
                          sx={{
                            p: 2,
                            flexGrow: 1,
                            "&:last-child": { pb: 2 },
                          }}
                        >
                          {/* CARD TOP */}
                          <Stack
                            direction="row"
                            sx={{
                              justifyContent: "space-between",
                              alignItems: "center",
                              mb: 1.5,
                            }}
                          >
                            <Box
                              sx={{
                                width: 42,
                                height: 42,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                borderRadius: "10px",
                                color: "primary.main",
                                backgroundColor: isDark
                                  ? "rgba(144,202,249,0.12)"
                                  : "rgba(25,118,210,0.08)",
                              }}
                            >
                              <QuizIcon />
                            </Box>

                            <Chip
                              label="Available"
                              color="success"
                              variant="outlined"
                              size="small"
                              sx={{
                                height: 23,
                                fontSize: "0.7rem",
                                fontWeight: 700,
                              }}
                            />
                          </Stack>

                          {/* TITLE */}
                          <Typography
                            variant="subtitle1"
                            fontWeight={800}
                            sx={{
                              fontSize: "1rem",
                              lineHeight: 1.45,
                              mb: 0.5,
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                              minHeight: "2.9em",
                            }}
                          >
                            {quiz.title || "Untitled Quiz"}
                          </Typography>

                          <Typography
                            variant="body2"
                            color="text.secondary"
                            noWrap
                            sx={{ mb: 1.5 }}
                          >
                            Topic: {quiz.topic || "General"}
                          </Typography>

                          {/* QUIZ DETAILS */}
                          <Stack
                            spacing={1.2}
                            sx={{
                              borderTop: `1px solid ${borderColor}`,
                              pt: 1.5,
                            }}
                          >
                            <Stack
                              direction="row"
                              spacing={1}
                              sx={{ minWidth: 0, alignItems: "center" }}
                            >
                              <MenuBookIcon
                                sx={{
                                  fontSize: 17,
                                  color: "text.secondary",
                                  flexShrink: 0,
                                }}
                              />

                              <Typography
                                variant="body2"
                                color="text.secondary"
                                noWrap
                              >
                                {getCourseName(quiz.course)}
                              </Typography>
                            </Stack>

                            <Stack
                              direction="row"
                              spacing={1}
                              sx={{ alignItems: "center" }}
                            >
                              <FormatListNumberedIcon
                                sx={{
                                  fontSize: 17,
                                  color: "text.secondary",
                                }}
                              />

                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {questionCount} Questions
                              </Typography>
                            </Stack>

                            <Stack
                              direction="row"
                              spacing={1}
                              sx={{ alignItems: "center" }}
                            >
                              <CalendarTodayOutlinedIcon
                                sx={{
                                  fontSize: 16,
                                  color: "text.secondary",
                                }}
                              />

                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {formatDate(quiz.createdAt)}
                              </Typography>
                            </Stack>
                          </Stack>
                        </CardContent>

                        {/* START BUTTON */}
                        <Box sx={{ px: 2, pb: 2 }}>
                          <Button
                            fullWidth
                            variant="contained"
                            disabled={questionCount === 0}
                            endIcon={<ArrowForwardIcon />}
                            onClick={() => handleOpenQuiz(quiz._id)}
                            sx={{
                              py: 1,
                              borderRadius: "9px",
                              textTransform: "none",
                              fontWeight: 700,
                              boxShadow: "none",
                            }}
                          >
                            Start Quiz
                          </Button>
                        </Box>
                      </Card>
                    );
                  })}
                </Box>
              )}
            </>
          )}
        </Container>
      </Box>
    </StudentLayout>
  );
}

export default Quizzes;
