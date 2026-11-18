import { useCallback, useEffect, useState } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Grid,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import Layout from "../../components/layout/Layout";

import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import HelpOutlineRoundedIcon from "@mui/icons-material/HelpOutlineRounded";
import LayersRoundedIcon from "@mui/icons-material/LayersRounded";
import PublishRoundedIcon from "@mui/icons-material/PublishRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import api from "../../servises/api";

export default function CreateQuiz() {
  const theme = useTheme();

  const [courses, setCourses] = useState([]);
  const [quizzes, setQuizzes] = useState([]);

  const [courseId, setCourseId] = useState("");
  const [topic, setTopic] = useState("");
  const [questionCount, setQuestionCount] = useState(10);
  const [difficulty, setDifficulty] = useState("medium");

  const [loadingCourses, setLoadingCourses] = useState(true);
  const [loadingQuizzes, setLoadingQuizzes] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [publishingId, setPublishingId] = useState("");

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [quiz, setQuiz] = useState(null);

  // Load teacher's courses
  useEffect(() => {
    const loadCourses = async () => {
      try {
        const response = await api.get("/teacher/courses");
        setCourses(response.data?.courses || []);
      } catch (err) {
        setError(
          err.response?.data?.message || "Could not load your courses."
        );
      } finally {
        setLoadingCourses(false);
      }
    };

    loadCourses();
  }, []);

  // Load quizzes created by this teacher
  const loadTeacherQuizzes = useCallback(async () => {
    try {
      setLoadingQuizzes(true);

      const response = await api.get("/teacher/quizzes");

      const quizList =
        response.data?.quizzes ||
        response.data?.data?.quizzes ||
        [];

      setQuizzes(quizList);
    } catch (err) {
      setError(
        err.response?.data?.message || "Could not load your quizzes."
      );
    } finally {
      setLoadingQuizzes(false);
    }
  }, []);

  useEffect(() => {
    loadTeacherQuizzes();
  }, [loadTeacherQuizzes]);

  // Generate AI quiz
  const handleGenerate = async (event) => {
    event.preventDefault();

    setError("");
    setMessage("");
    setQuiz(null);

    if (!courseId || !topic.trim()) {
      setError("Please select a course and enter a topic.");
      return;
    }

    try {
      setGenerating(true);

      const response = await api.post("/teacher/quizzes/generate", {
        courseId,
        topic: topic.trim(),
        questionCount: Number(questionCount),
        difficulty,
      });

      setQuiz(response.data.quiz);
      setMessage(
        response.data.message || "Quiz generated successfully."
      );

      // Refresh teacher quiz list
      await loadTeacherQuizzes();
    } catch (err) {
      console.error("AI QUIZ ERROR:", err);

      setError(
        err.response?.data?.message ||
          err.message ||
          "Quiz generation failed."
      );
    } finally {
      setGenerating(false);
    }
  };

  // Publish a draft quiz
  const handlePublish = async (quizId) => {
    try {
      setError("");
      setMessage("");
      setPublishingId(quizId);

      const response = await api.patch(
        `/teacher/quizzes/${quizId}/publish`
      );

      // Update quiz status in the list
      setQuizzes((previousQuizzes) =>
        previousQuizzes.map((item) =>
          item._id === quizId
            ? { ...item, status: "published" }
            : item
        )
      );

      // Update generated quiz preview if it is the same quiz
      setQuiz((previousQuiz) =>
        previousQuiz?._id === quizId
          ? { ...previousQuiz, status: "published" }
          : previousQuiz
      );

      setMessage(
        response.data?.message || "Quiz published successfully."
      );

      // Refresh from backend to confirm latest data
      await loadTeacherQuizzes();
    } catch (err) {
      setError(
        err.response?.data?.message || "Could not publish quiz."
      );
    } finally {
      setPublishingId("");
    }
  };

  const getCourseName = (course) => {
    if (course && typeof course === "object") {
      return course.title || "Unknown course";
    }

    return "Course";
  };

  return (
    <Layout>
      <Box sx={{ width: "100%", display: "flex", flexDirection: "column", gap: 3.5 }}>
        {/* Header Bar */}
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
                AI Quiz Studio
              </Typography>
              <Chip
                label="Powered by Gemini"
                size="small"
                icon={<AutoAwesomeIcon sx={{ fontSize: "14px !important" }} />}
                sx={{
                  bgcolor: "rgba(99, 102, 241, 0.12)",
                  color: "#818cf8",
                  fontWeight: 700,
                  fontSize: "0.72rem",
                }}
              />
            </Box>
            <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>
              Automatically generate multiple choice assessments from course curriculum parameters.
            </Typography>
          </Box>
        </Box>

        {/* Global Alerts */}
        <Stack spacing={2}>
          {error && (
            <Alert severity="error" onClose={() => setError("")}>
              {error}
            </Alert>
          )}
          {message && (
            <Alert severity="success" onClose={() => setMessage("")}>
              {message}
            </Alert>
          )}
        </Stack>

      <Grid container spacing={4}>
        {/* Left Column: Generator Form & Generated Preview */}
        <Grid item xs={12} lg={6}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, md: 4.5 },
              borderRadius: "24px",
              border: `1px solid ${theme.palette.mode === 'dark' ? alpha(theme.palette.divider, 0.15) : '#eaeef2'}`,
              background: theme.palette.mode === 'dark' 
                ? `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${theme.palette.background.paper} 100%)`
                : `linear-gradient(135deg, #ffffff 0%, #fcfdfd 100%)`,
              boxShadow: theme.palette.mode === 'dark' ? "0 20px 40px rgba(0,0,0,0.4)" : "0 20px 40px -15px rgba(0,0,0,0.05)",
            }}
          >
            <Stack direction="row" spacing={2.5} alignItems="center" mb={3}>
              <Avatar
                sx={{
                  bgcolor: alpha(theme.palette.primary.main, 0.12),
                  color: theme.palette.primary.main,
                  width: 56,
                  height: 56,
                  borderRadius: "16px",
                }}
              >
                <AutoAwesomeIcon fontSize="medium" />
              </Avatar>
              <Box>
                <Typography variant="h6" fontWeight={800} letterSpacing="-0.5px">
                  Configure Assessment
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Specify parameters for customized AI quiz generation
                </Typography>
              </Box>
            </Stack>

            <Divider sx={{ my: 3, opacity: 0.6 }} />

            <Box component="form" onSubmit={handleGenerate}>
              <Stack spacing={3}>
                <TextField
                  select
                  label="Target Course"
                  value={courseId}
                  onChange={(event) => setCourseId(event.target.value)}
                  disabled={loadingCourses || generating}
                  required
                  fullWidth
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "14px" } }}
                >
                  {courses.map((course) => (
                    <MenuItem key={course._id} value={course._id}>
                      <Typography fontWeight={600}>{course.title}</Typography>
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  label="Quiz Topic & Focus"
                  placeholder="e.g., Asynchronous JavaScript & Event Loop"
                  value={topic}
                  onChange={(event) => setTopic(event.target.value)}
                  disabled={generating}
                  required
                  fullWidth
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "14px" } }}
                />

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      select
                      label="Difficulty Tier"
                      value={difficulty}
                      onChange={(event) => setDifficulty(event.target.value)}
                      disabled={generating}
                      fullWidth
                      sx={{ "& .MuiOutlinedInput-root": { borderRadius: "14px" } }}
                    >
                      <MenuItem value="easy">Easy Level</MenuItem>
                      <MenuItem value="medium">Medium Level</MenuItem>
                      <MenuItem value="hard">Advanced Hard</MenuItem>
                    </TextField>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      select
                      label="Question Volume"
                      value={questionCount}
                      onChange={(event) =>
                        setQuestionCount(Number(event.target.value))
                      }
                      disabled={generating}
                      fullWidth
                      sx={{ "& .MuiOutlinedInput-root": { borderRadius: "14px" } }}
                    >
                      {[5, 10, 15, 20].map((count) => (
                        <MenuItem key={count} value={count}>
                          {count} Questions
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                </Grid>

                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  fullWidth
                  disabled={
                    generating ||
                    loadingCourses ||
                    courses.length === 0
                  }
                  startIcon={
                    generating ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : (
                      <AutoAwesomeIcon />
                    )
                  }
                  sx={{
                    py: 1.8,
                    borderRadius: "14px",
                    textTransform: "none",
                    fontSize: "1rem",
                    fontWeight: 800,
                    letterSpacing: "0.2px",
                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                    boxShadow: `0 10px 25px -5px ${alpha(theme.palette.primary.main, 0.5)}`,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: `0 15px 30px -5px ${alpha(theme.palette.primary.main, 0.6)}`,
                    },
                  }}
                >
                  {generating ? "Synthesizing Quiz with AI..." : "Generate AI Quiz"}
                </Button>
              </Stack>
            </Box>
          </Paper>

          {/* Generated Quiz Live Preview */}
          {quiz && (
            <Paper
              elevation={0}
              sx={{
                mt: 4,
                p: { xs: 3, md: 3.5 },
                borderRadius: "24px",
                border: `1px solid ${theme.palette.divider}`,
                background: theme.palette.background.paper,
              }}
            >
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                mb={1.5}
              >
                <Typography variant="h6" fontWeight={800}>
                  {quiz.title}
                </Typography>
                <Chip
                  label={quiz.status || "draft"}
                  size="small"
                  color={quiz.status === "published" ? "success" : "warning"}
                  sx={{ textTransform: "capitalize", fontWeight: 700, borderRadius: "8px" }}
                />
              </Stack>

              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Generated Subject: <strong style={{ color: theme.palette.text.primary }}>{quiz.topic}</strong>
              </Typography>

              <Stack spacing={2}>
                {quiz.questions?.map((question, index) => (
                  <Accordion
                    key={question._id || index}
                    disableGutters
                    elevation={0}
                    sx={{
                      border: `1px solid ${theme.palette.divider}`,
                      borderRadius: "16px !important",
                      overflow: "hidden",
                      transition: "border-color 0.2s",
                      "&:before": { display: "none" },
                      "&.Mui-expanded": {
                        borderColor: theme.palette.primary.main,
                      },
                    }}
                  >
                    <AccordionSummary 
                      expandIcon={<ExpandMoreIcon />}
                      sx={{ px: 2.5, py: 1 }}
                    >
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        <Avatar 
                          sx={{ 
                            width: 26, 
                            height: 26, 
                            fontSize: "0.75rem", 
                            fontWeight: 700,
                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                            color: theme.palette.primary.main 
                          }}
                        >
                          {index + 1}
                        </Avatar>
                        <Typography fontWeight={700} variant="body2">
                          {question.questionText}
                        </Typography>
                      </Stack>
                    </AccordionSummary>
                    <AccordionDetails sx={{ px: 2.5, pb: 2.5, pt: 0 }}>
                      <Stack spacing={1.5} sx={{ mt: 1 }}>
                        {question.options?.map((option, optionIndex) => (
                          <Box
                            key={optionIndex}
                            sx={{
                              p: 1.5,
                              borderRadius: "12px",
                              border: `1px solid ${theme.palette.divider}`,
                              bgcolor: alpha(theme.palette.action.hover, 0.02),
                              display: "flex",
                              alignItems: "center",
                              gap: 1.5,
                            }}
                          >
                            <Typography
                              variant="caption"
                              fontWeight={800}
                              sx={{
                                width: 22,
                                height: 22,
                                borderRadius: "6px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                bgcolor: theme.palette.action.selected,
                              }}
                            >
                              {String.fromCharCode(65 + optionIndex)}
                            </Typography>
                            <Typography variant="body2" fontWeight={500}>
                              {option}
                            </Typography>
                          </Box>
                        ))}
                      </Stack>

                      <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
                        <Chip
                          label={`Difficulty: ${question.difficulty}`}
                          size="small"
                          sx={{ 
                            fontSize: "0.7rem", 
                            fontWeight: 700, 
                            borderRadius: "8px",
                            bgcolor: alpha(theme.palette.warning.main, 0.1),
                            color: theme.palette.warning.darkText || theme.palette.warning.main
                          }}
                        />
                      </Box>
                    </AccordionDetails>
                  </Accordion>
                ))}
              </Stack>
            </Paper>
          )}
        </Grid>

        {/* Right Column: Teacher Quizzes Dashboard List */}
        <Grid item xs={12} lg={6}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, md: 4 },
              borderRadius: "24px",
              border: `1px solid ${theme.palette.mode === 'dark' ? alpha(theme.palette.divider, 0.15) : '#eaeef2'}`,
              background: theme.palette.background.paper,
              height: "100%",
              display: "flex",
              flexDirection: "column",
              boxShadow: theme.palette.mode === 'dark' ? "0 20px 40px rgba(0,0,0,0.4)" : "0 20px 40px -15px rgba(0,0,0,0.05)",
            }}
          >
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              mb={3}
            >
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar
                  sx={{
                    bgcolor: alpha(theme.palette.info.main, 0.1),
                    color: theme.palette.info.main,
                    width: 44,
                    height: 44,
                    borderRadius: "14px",
                  }}
                >
                  <LayersRoundedIcon fontSize="small" />
                </Avatar>
                <Box>
                  <Typography variant="h6" fontWeight={800} letterSpacing="-0.5px">
                    Quiz Library
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Manage drafts and publish live assessments
                  </Typography>
                </Box>
              </Stack>

              <Button
                size="small"
                variant="outlined"
                startIcon={<RefreshRoundedIcon />}
                onClick={loadTeacherQuizzes}
                disabled={loadingQuizzes}
                sx={{ 
                  borderRadius: "12px", 
                  textTransform: "none", 
                  fontWeight: 700,
                  borderColor: theme.palette.divider,
                }}
              >
                Refresh
              </Button>
            </Stack>

            <Divider sx={{ mb: 3, opacity: 0.6 }} />

            {loadingQuizzes ? (
              <Box display="flex" justifyContent="center" alignItems="center" flex={1} py={12}>
                <CircularProgress size={36} thickness={4} />
              </Box>
            ) : quizzes.length === 0 ? (
              <Box
                textAlign="center"
                py={8}
                px={3}
                sx={{
                  border: `2px dashed ${theme.palette.divider}`,
                  borderRadius: "20px",
                  bgcolor: alpha(theme.palette.action.hover, 0.02),
                  my: "auto",
                }}
              >
                <AutoAwesomeIcon sx={{ fontSize: 52, color: "text.disabled", mb: 2, opacity: 0.5 }} />
                <Typography fontWeight={800} variant="subtitle1" gutterBottom>
                  No quizzes created yet
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 320, mx: "auto" }}>
                  Use the left configuration panel to generate your first professional AI quiz instantly.
                </Typography>
              </Box>
            ) : (
              <Stack spacing={2.5} sx={{ flex: 1, overflowY: "auto", pr: 0.5 }}>
                {quizzes.map((item) => (
                  <Paper
                    key={item._id}
                    elevation={0}
                    sx={{
                      p: 2.5,
                      borderRadius: "18px",
                      border: `1px solid ${theme.palette.divider}`,
                      bgcolor: theme.palette.mode === 'dark' ? alpha(theme.palette.background.default, 0.4) : alpha(theme.palette.action.hover, 0.01),
                      transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                      "&:hover": {
                        borderColor: theme.palette.primary.main,
                        boxShadow: `0 10px 25px -5px ${alpha(theme.palette.primary.main, 0.1)}`,
                        transform: "translateY(-2px)",
                      },
                    }}
                  >
                    <Stack
                      direction={{ xs: "column", sm: "row" }}
                      justifyContent="space-between"
                      alignItems={{ xs: "flex-start", sm: "center" }}
                      spacing={2}
                    >
                      <Box flex={1}>
                        <Stack direction="row" spacing={1.5} alignItems="center" mb={1}>
                          <Typography fontWeight={800} variant="subtitle1" letterSpacing="-0.3px">
                            {item.title}
                          </Typography>
                          <Chip
                            size="small"
                            label={item.status || "draft"}
                            color={
                              item.status === "published"
                                ? "success"
                                : "warning"
                            }
                            sx={{
                              height: 22,
                              fontSize: "0.68rem",
                              fontWeight: 800,
                              textTransform: "capitalize",
                              borderRadius: "6px",
                            }}
                          />
                        </Stack>

                        <Stack
                          direction="row"
                          spacing={1.5}
                          alignItems="center"
                          color="text.secondary"
                          sx={{ fontSize: "0.85rem", mb: 1.5 }}
                        >
                          <span style={{ fontWeight: 600, color: theme.palette.text.primary }}>
                            {getCourseName(item.course)}
                          </span>
                          <span>•</span>
                          <span>Topic: <em>{item.topic}</em></span>
                        </Stack>

                        <Stack
                          direction="row"
                          spacing={1}
                          alignItems="center"
                          sx={{ color: "text.secondary", fontSize: "0.8rem", fontWeight: 600 }}
                        >
                          <HelpOutlineRoundedIcon sx={{ fontSize: "15px" }} />
                          <span>
                            {item.questions?.length || item.questionCount || 0} Questions Total
                          </span>
                        </Stack>
                      </Box>

                      {item.status !== "published" && (
                        <Button
                          variant="contained"
                          size="small"
                          color="primary"
                          startIcon={
                            publishingId === item._id ? (
                              <CircularProgress size={14} color="inherit" />
                            ) : (
                              <PublishRoundedIcon />
                            )
                          }
                          disabled={Boolean(publishingId)}
                          onClick={() => handlePublish(item._id)}
                          sx={{
                            borderRadius: "12px",
                            px: 2.5,
                            py: 1,
                            textTransform: "none",
                            fontWeight: 800,
                            whiteSpace: "nowrap",
                            boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
                          }}
                        >
                          {publishingId === item._id
                            ? "Publishing..."
                            : "Publish Quiz"}
                        </Button>
                      )}
                    </Stack>
                  </Paper>
                ))}
              </Stack>
            )}
          </Paper>
        </Grid>
      </Grid>
      </Box>
    </Layout>
  );
}