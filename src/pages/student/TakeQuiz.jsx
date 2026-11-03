
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Divider,
  FormControlLabel,
  LinearProgress,
  Paper,
  Radio,
  RadioGroup,
  Stack,
  Typography,
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import SendIcon from "@mui/icons-material/Send";

import StudentLayout from "../components/student/StudentLayout";
import api from "../../servises/api";

function TakeQuiz() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Load quiz and check whether the student already submitted it.
  useEffect(() => {
    const loadQuiz = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(`/student/quizzes/${id}`);

        setQuiz(response.data.quiz);

        // A 404 result means the student has not submitted yet.
        try {
          const resultResponse = await api.get(
            `/student/quizzes/${id}/result`
          );

          if (resultResponse.data.success) {
            setResult(resultResponse.data.result);
          }
        } catch (resultError) {
          if (resultError.response?.status !== 404) {
            console.error("Could not check previous result:", resultError);
          }
        }
      } catch (err) {
        setError(
          err.response?.data?.message || "Could not load this quiz."
        );
      } finally {
        setLoading(false);
      }
    };

    loadQuiz();
  }, [id]);

  const questions = quiz?.questions || [];
  const totalQuestions = questions.length;
  const question = questions[currentQuestion];

  const answeredCount = Object.keys(selectedAnswers).length;

  const progress =
    totalQuestions > 0
      ? (answeredCount / totalQuestions) * 100
      : 0;

  const handleAnswerChange = (event) => {
    setSelectedAnswers((previous) => ({
      ...previous,
      [question._id]: Number(event.target.value),
    }));
  };

  const handleSubmit = async () => {
    const unanswered = totalQuestions - answeredCount;

    const confirmation = window.confirm(
      unanswered > 0
        ? `You have ${unanswered} unanswered question(s). They will be marked wrong. Do you want to submit?`
        : "Are you sure you want to submit your quiz?"
    );

    if (!confirmation) return;

    try {
      setSubmitting(true);
      setError("");

      const answers = Object.entries(selectedAnswers).map(
        ([questionId, selectedAnswer]) => ({
          questionId,
          selectedAnswer,
        })
      );

      const response = await api.post(
        `/student/quizzes/${id}/submit`,
        { answers }
      );

      setResult({
        quiz: {
          title: quiz.title,
          topic: quiz.topic,
        },
        ...response.data.result,
        submittedAt: new Date().toISOString(),
      });
    } catch (err) {
      setError(
        err.response?.data?.message || "Could not submit your quiz."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Loading screen
  if (loading) {
    return (
      <StudentLayout>
        <Box
          sx={{
            minHeight: "70vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CircularProgress />
        </Box>
      </StudentLayout>
    );
  }

  // Error screen
  if (error && !quiz) {
    return (
      <StudentLayout>
        <Container maxWidth="md" sx={{ py: 5 }}>
          <Alert severity="error">{error}</Alert>

          <Button
            sx={{ mt: 2 }}
            onClick={() => navigate("/student/quizzes")}
          >
            Back to Quizzes
          </Button>
        </Container>
      </StudentLayout>
    );
  }

  // Result screen
  if (result) {
    return (
      <StudentLayout>
        <Container maxWidth="md" sx={{ py: 5 }}>
          <Card
            elevation={3}
            sx={{
              borderRadius: 4,
              textAlign: "center",
              p: { xs: 2, md: 5 },
            }}
          >
            <CheckCircleIcon
              sx={{ fontSize: 75, color: "success.main", mb: 2 }}
            />

            <Typography variant="h4" fontWeight={700} gutterBottom>
              Quiz Submitted!
            </Typography>

            <Typography color="text.secondary" sx={{ mb: 4 }}>
              {result.quiz?.title || quiz?.title}
            </Typography>

            <Box
              sx={{
                width: 180,
                height: 180,
                borderRadius: "50%",
                border: "8px solid",
                borderColor: "success.light",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                mx: "auto",
                mb: 4,
              }}
            >
              <Typography variant="h3" fontWeight={800}>
                {result.percentage}%
              </Typography>

              <Typography color="text.secondary">
                Your Score
              </Typography>
            </Box>

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              justifyContent="center"
              sx={{ mb: 3 }}
            >
              <Chip
                label={`Correct: ${result.score}`}
                color="success"
                sx={{ fontSize: 15, py: 2 }}
              />

              <Chip
                label={`Total Questions: ${result.totalQuestions}`}
                color="primary"
                sx={{ fontSize: 15, py: 2 }}
              />
            </Stack>

            <Typography color="text.secondary" sx={{ mb: 3 }}>
              Submitted:{" "}
              {result.submittedAt
                ? new Date(result.submittedAt).toLocaleString()
                : "Just now"}
            </Typography>

            <Button
              variant="contained"
              size="large"
              onClick={() => navigate("/student/quizzes")}
            >
              Back to Quizzes
            </Button>
          </Card>
        </Container>
      </StudentLayout>
    );
  }

  if (!question) {
    return (
      <StudentLayout>
        <Container maxWidth="md" sx={{ py: 5 }}>
          <Alert severity="warning">
            This quiz has no questions.
          </Alert>
        </Container>
      </StudentLayout>
    );
  }

  // Quiz-taking screen
  return (
    <StudentLayout>
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Stack spacing={3}>
          {/* Header */}
          <Box>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate("/student/quizzes")}
              sx={{ mb: 2 }}
            >
              Back to Quizzes
            </Button>

            <Typography variant="h4" fontWeight={800}>
              {quiz.title}
            </Typography>

            <Typography color="text.secondary" sx={{ mt: 1 }}>
              {quiz.topic} {quiz.course?.title && `• ${quiz.course.title}`}
            </Typography>
          </Box>

          {/* Progress */}
          <Paper elevation={1} sx={{ p: 2, borderRadius: 3 }}>
            <Stack
              direction="row"
              justifyContent="space-between"
              sx={{ mb: 1 }}
            >
              <Typography fontWeight={600}>
                Your Progress
              </Typography>

              <Typography color="primary" fontWeight={700}>
                {answeredCount}/{totalQuestions} Answered
              </Typography>
            </Stack>

            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{ height: 9, borderRadius: 5 }}
            />
          </Paper>

          {error && <Alert severity="error">{error}</Alert>}

          {/* Question */}
          <Card elevation={2} sx={{ borderRadius: 3 }}>
            <CardContent sx={{ p: { xs: 2, md: 4 } }}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{ mb: 3 }}
              >
                <Chip
                  label={`Question ${currentQuestion + 1} of ${totalQuestions}`}
                  color="primary"
                />

                <Chip
                  label={question.difficulty || "MCQ"}
                  variant="outlined"
                />
              </Stack>

              <Typography
                variant="h6"
                fontWeight={700}
                sx={{ mb: 3, lineHeight: 1.7 }}
              >
                {question.questionText}
              </Typography>

              <Divider sx={{ mb: 3 }} />

              <RadioGroup
                value={
                  selectedAnswers[question._id] !== undefined
                    ? String(selectedAnswers[question._id])
                    : ""
                }
                onChange={handleAnswerChange}
              >
                {question.options.map((option, index) => (
                  <Paper
                    key={index}
                    variant="outlined"
                    sx={{
                      mb: 2,
                      borderRadius: 2,
                      borderColor:
                        selectedAnswers[question._id] === index
                          ? "primary.main"
                          : "divider",
                      backgroundColor:
                        selectedAnswers[question._id] === index
                          ? "action.selected"
                          : "background.paper",
                    }}
                  >
                    <FormControlLabel
                      value={String(index)}
                      control={<Radio />}
                      label={
                        <Typography sx={{ py: 1 }}>
                          {String.fromCharCode(65 + index)}. {option}
                        </Typography>
                      }
                      sx={{
                        m: 0,
                        p: 1,
                        width: "100%",
                      }}
                    />
                  </Paper>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Navigation */}
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            spacing={2}
          >
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              disabled={currentQuestion === 0 || submitting}
              onClick={() => setCurrentQuestion((previous) => previous - 1)}
            >
              Previous
            </Button>

            {currentQuestion < totalQuestions - 1 ? (
              <Button
                variant="contained"
                endIcon={<ArrowForwardIcon />}
                onClick={() => setCurrentQuestion((previous) => previous + 1)}
              >
                Next Question
              </Button>
            ) : (
              <Button
                variant="contained"
                color="success"
                endIcon={<SendIcon />}
                disabled={submitting}
                onClick={handleSubmit}
              >
                {submitting ? "Submitting..." : "Submit Quiz"}
              </Button>
            )}
          </Stack>
        </Stack>
      </Container>
    </StudentLayout>
  );
}

export default TakeQuiz;
