
import React, { useEffect, useMemo, useState } from "react";
import api from "../../servises/api";
import StudentLayout from "../components/student/StudentLayout";
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
  Divider,
  InputAdornment,
  Paper,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";

import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PendingActionsOutlinedIcon from "@mui/icons-material/PendingActionsOutlined";
import ScheduleOutlinedIcon from "@mui/icons-material/ScheduleOutlined";
import LinkOutlinedIcon from "@mui/icons-material/LinkOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
import OpenInNewOutlinedIcon from "@mui/icons-material/OpenInNewOutlined";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";

const BLUE = "#1565c0";
const NAVY = "#102a56";
const PAGE_BG = "#f4f7fc";

const getSubmission = (item) =>
  item.submissionDetails || item.submission || {};

const getStatusColor = (status) => {
  const normalized = String(status || "").toLowerCase();

  if (normalized === "approved") {
    return "success";
  }

  if (normalized === "rejected") {
    return "error";
  }

  return "warning";
};

const isValidUrl = (value) => {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
};

const formatDate = (date) => {
  if (!date) return "No deadline";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Date unavailable";
  }

  return parsedDate.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const StudentAssignmentsPage = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submissionURLs, setSubmissionURLs] = useState({});
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [submittingId, setSubmittingId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    let active = true;

    const fetchAssignments = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/student/assignments");

        if (!active) return;

        if (response.data.success) {
          const data = Array.isArray(response.data.assignments)
            ? response.data.assignments
            : [];

          setAssignments(data);
        } else {
          setError(
            response.data.message || "Unable to load assignments."
          );
        }
      } catch (err) {
        if (active) {
          setError(
            err.response?.data?.message ||
              "Unable to load assignments. Please try again."
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchAssignments();

    return () => {
      active = false;
    };
  }, []);

  const pendingCount = assignments.filter(
    (item) => !item.isSubmitted
  ).length;

  const submittedCount = assignments.filter(
    (item) => item.isSubmitted
  ).length;

  const overdueCount = assignments.filter((item) => {
    if (item.isSubmitted || !item.dueDate) return false;

    const dueDate = new Date(item.dueDate);

    return (
      !Number.isNaN(dueDate.getTime()) &&
      dueDate < new Date()
    );
  }).length;

  const filteredAssignments = useMemo(() => {
    return assignments.filter((item) => {
      const matchesFilter =
        filter === "pending"
          ? !item.isSubmitted
          : filter === "submitted"
            ? item.isSubmitted
            : true;

      const searchText = search.trim().toLowerCase();

      const matchesSearch =
        !searchText ||
        [
          item.title,
          item.description,
          item.course?.title,
          item.teacher?.name,
        ]
          .filter(Boolean)
          .some((value) =>
            String(value).toLowerCase().includes(searchText)
          );

      return matchesFilter && matchesSearch;
    });
  }, [assignments, filter, search]);

  const handleSubmit = async (assignmentId) => {
    const url = (submissionURLs[assignmentId] || "").trim();

    if (!isValidUrl(url)) {
      setSuccess("");
      setError(
        "Please enter a valid link beginning with https:// or http://."
      );
      return;
    }

    try {
      setSubmittingId(assignmentId);
      setError("");
      setSuccess("");

      const response = await api.post(
        "/student/assignments/submit",
        {
          assignmentId,
          submissionURL: url,
        }
      );

      if (response.data.success) {
        const submission = response.data.submission || {
          submissionURL: url,
          status: "Pending Review",
        };

        setAssignments((previous) =>
          previous.map((item) =>
            item._id === assignmentId
              ? {
                  ...item,
                  isSubmitted: true,
                  submissionDetails: submission,
                }
              : item
          )
        );

        setSubmissionURLs((previous) => ({
          ...previous,
          [assignmentId]: "",
        }));

        setSuccess("Your assignment was submitted successfully.");
      } else {
        setError(
          response.data.message || "Assignment submission failed."
        );
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to submit the assignment. Please try again."
      );
    } finally {
      setSubmittingId(null);
    }
  };

  const renderStat = (
    title,
    count,
    Icon,
    color,
    description
  ) => (
    <Card
      elevation={0}
      sx={{
        height: "100%",
        borderRadius: 4,
        border: "1px solid #e6ebf3",
        transition: "all .2s ease",
        "&:hover": {
          transform: "translateY(-3px)",
          boxShadow: "0 12px 30px rgba(16,42,86,0.07)",
        },
      }}
    >
      <CardContent sx={{ p: 2.5 }}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          spacing={1}
        >
          <Avatar
            variant="rounded"
            sx={{
              bgcolor: `${color}14`,
              color,
              width: 48,
              height: 48,
              borderRadius: 3,
            }}
          >
            <Icon />
          </Avatar>

          <Typography
            variant="h4"
            sx={{
              color: NAVY,
              fontWeight: 800,
              letterSpacing: "-1px",
            }}
          >
            {count}
          </Typography>
        </Stack>

        <Typography
          sx={{ mt: 2, color: NAVY, fontWeight: 700 }}
        >
          {title}
        </Typography>

        <Typography
          variant="body2"
          sx={{ color: "#8490a5", mt: 0.5 }}
        >
          {description}
        </Typography>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: PAGE_BG,
        }}
      >
        <Stack alignItems="center" spacing={2}>
          <CircularProgress sx={{ color: BLUE }} />
          <Typography color="text.secondary">
            Loading your assignments...
          </Typography>
        </Stack>
      </Box>
    );
  }

  return (
    <StudentLayout>
    <Box
      sx={{
        minHeight: "100%",
        bgcolor: PAGE_BG,
        py: { xs: 2.5, md: 4 },
        px: { xs: 1.5, sm: 2, md: 3 },
      }}
    >
      <Container maxWidth="xl" disableGutters>
        {/* Page heading */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          alignItems={{ xs: "flex-start", sm: "center" }}
          justifyContent="space-between"
          spacing={2}
          sx={{ mb: 3 }}
        >
          <Box>
            <Typography
              sx={{ mt: 1, color: "#748198", fontSize: 14 }}
            >
              Manage your tasks, submit your work, and track your
              results.
            </Typography>
          </Box>

          <Chip
            icon={<AssignmentOutlinedIcon />}
            label={`${assignments.length} Total Assignments`}
            sx={{
              bgcolor: "#e7f0ff",
              color: "#164c99",
              fontWeight: 700,
              borderRadius: 2.5,
              height: 38,
              px: 0.5,
            }}
          />
        </Stack>

        {/* Welcome banner */}
        <Paper
          elevation={0}
          sx={{
            position: "relative",
            overflow: "hidden",
            p: { xs: 2.5, md: 4 },
            mb: 3,
            borderRadius: 4,
            color: "white",
            background:
              "linear-gradient(115deg, #102a56 0%, #174b91 60%, #2878d0 100%)",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              width: 190,
              height: 190,
              borderRadius: "50%",
              bgcolor: "rgba(255,255,255,0.06)",
              right: { xs: -80, md: 50 },
              top: -95,
            }}
          />

          <Box
            sx={{
              position: "absolute",
              width: 125,
              height: 125,
              borderRadius: "50%",
              border: "1px solid rgba(255,255,255,0.12)",
              right: { xs: -30, md: 110 },
              bottom: -80,
            }}
          />

          <Stack
            direction={{ xs: "column", sm: "row" }}
            alignItems={{ xs: "flex-start", sm: "center" }}
            justifyContent="space-between"
            spacing={2}
            sx={{ position: "relative", zIndex: 1 }}
          >
            <Box sx={{ maxWidth: 560 }}>
              <Typography
                sx={{
                  color: "#c7ddff",
                  fontSize: 12,
                  fontWeight: 800,
                  letterSpacing: 1.5,
                  mb: 1,
                }}
              >
                STUDENT WORKSPACE
              </Typography>

              <Typography
                variant="h5"
                sx={{
                  fontWeight: 800,
                  fontSize: { xs: 22, md: 27 },
                  mb: 1,
                }}
              >
                Stay on top of your learning!
              </Typography>

              <Typography
                sx={{
                  color: "#e1ecff",
                  fontSize: 14,
                  lineHeight: 1.8,
                }}
              >
                Check your deadlines, complete pending tasks, and
                keep track of your submitted assignments in one
                place.
              </Typography>
            </Box>

            <Avatar
              variant="rounded"
              sx={{
                width: 70,
                height: 70,
                bgcolor: "rgba(255,255,255,0.13)",
                color: "#fff",
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: 4,
              }}
            >
              <AssignmentOutlinedIcon sx={{ fontSize: 38 }} />
            </Avatar>
          </Stack>
        </Paper>

        {/* Statistics */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, minmax(0, 1fr))",
              lg: "repeat(4, minmax(0, 1fr))",
            },
            gap: 2,
            mb: 3.5,
          }}
        >
          {renderStat(
            "All Assignments",
            assignments.length,
            MenuBookOutlinedIcon,
            "#1976d2",
            "Your total assigned tasks"
          )}

          {renderStat(
            "Pending Tasks",
            pendingCount,
            PendingActionsOutlinedIcon,
            "#ed9418",
            "Tasks waiting for submission"
          )}

          {renderStat(
            "Submitted",
            submittedCount,
            CheckCircleIcon,
            "#23956b",
            "Tasks you have submitted"
          )}

          {renderStat(
            "Overdue",
            overdueCount,
            ScheduleOutlinedIcon,
            "#d9485f",
            "Unsubmitted tasks past deadline"
          )}
        </Box>

        {/* Error and success messages */}
        {error && (
          <Alert
            severity="error"
            onClose={() => setError("")}
            sx={{ mb: 2, borderRadius: 3 }}
          >
            {error}
          </Alert>
        )}

        {success && (
          <Alert
            severity="success"
            onClose={() => setSuccess("")}
            sx={{ mb: 2, borderRadius: 3 }}
          >
            {success}
          </Alert>
        )}

        {/* Filters and search */}
        <Paper
          elevation={0}
          sx={{
            borderRadius: 4,
            border: "1px solid #e6ebf3",
            p: { xs: 1.5, sm: 2 },
            mb: 2.5,
          }}
        >
          <Stack
            direction={{ xs: "column", md: "row" }}
            alignItems={{ xs: "stretch", md: "center" }}
            justifyContent="space-between"
            spacing={2}
          >
            <Tabs
              value={filter}
              onChange={(_, value) => setFilter(value)}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                minHeight: 44,
                "& .MuiTab-root": {
                  minHeight: 44,
                  textTransform: "none",
                  fontWeight: 700,
                  fontSize: 13,
                  borderRadius: 2,
                  px: { xs: 1.5, sm: 2 },
                },
                "& .MuiTabs-indicator": {
                  height: 3,
                  borderRadius: 3,
                },
              }}
            >
              <Tab
                value="all"
                label={`All (${assignments.length})`}
              />
              <Tab
                value="pending"
                label={`Pending (${pendingCount})`}
              />
              <Tab
                value="submitted"
                label={`Submitted (${submittedCount})`}
              />
            </Tabs>

            <TextField
              size="small"
              placeholder="Search assignments..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{
                width: { xs: "100%", md: 280 },
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2.5,
                  bgcolor: "#f9fbff",
                },
              }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchOutlinedIcon
                        sx={{ color: "#8a97ad" }}
                      />
                    </InputAdornment>
                  ),
                },
              }}
            />
          </Stack>
        </Paper>

        {/* Assignment cards */}
        {filteredAssignments.length === 0 ? (
          <Paper
            elevation={0}
            sx={{
              textAlign: "center",
              p: { xs: 4, md: 7 },
              borderRadius: 4,
              border: "1px solid #e6ebf3",
            }}
          >
            <Avatar
              sx={{
                mx: "auto",
                mb: 2,
                width: 70,
                height: 70,
                bgcolor: "#eaf1ff",
                color: BLUE,
              }}
            >
              <AssignmentOutlinedIcon sx={{ fontSize: 34 }} />
            </Avatar>

            <Typography
              variant="h6"
              sx={{ fontWeight: 800, color: NAVY }}
            >
              No assignments found
            </Typography>

            <Typography
              sx={{
                color: "#8490a5",
                fontSize: 14,
                mt: 1,
              }}
            >
              {search
                ? "Try another search term."
                : filter === "pending"
                  ? "Great! You have no pending assignments."
                  : filter === "submitted"
                    ? "You have not submitted any assignments yet."
                    : "Your assignments will appear here when available."}
            </Typography>

            {(search || filter !== "all") && (
              <Button
                sx={{ mt: 2, textTransform: "none" }}
                onClick={() => {
                  setSearch("");
                  setFilter("all");
                }}
              >
                Clear filters
              </Button>
            )}
          </Paper>
        ) : (
          <Stack spacing={2.5}>
            {filteredAssignments.map((item) => {
              const submission = getSubmission(item);
              const isSubmitted = Boolean(item.isSubmitted);

              const dueDate = item.dueDate
                ? new Date(item.dueDate)
                : null;

              const isPastDue =
                !isSubmitted &&
                dueDate &&
                !Number.isNaN(dueDate.getTime()) &&
                dueDate < new Date();

              const status = isSubmitted
                ? submission.status || "Pending Review"
                : isPastDue
                  ? "Overdue"
                  : "Pending";

              return (
                <Card
                  key={item._id}
                  elevation={0}
                  sx={{
                    borderRadius: 4,
                    border: "1px solid #e5eaf2",
                    overflow: "hidden",
                    transition: "box-shadow .2s ease, transform .2s ease",
                    "&:hover": {
                      boxShadow:
                        "0 12px 32px rgba(16,42,86,0.07)",
                      transform: "translateY(-2px)",
                    },
                  }}
                >
                  <CardContent
                    sx={{
                      p: { xs: 2, sm: 3 },
                      "&:last-child": { pb: { xs: 2, sm: 3 } },
                    }}
                  >
                    <Stack
                      direction={{ xs: "column", sm: "row" }}
                      justifyContent="space-between"
                      alignItems={{ xs: "flex-start", sm: "center" }}
                      spacing={2}
                    >
                      <Stack
                        direction="row"
                        alignItems="flex-start"
                        spacing={1.5}
                        sx={{ minWidth: 0 }}
                      >
                        <Avatar
                          variant="rounded"
                          sx={{
                            bgcolor: "#eaf1ff",
                            color: BLUE,
                            width: 48,
                            height: 48,
                            borderRadius: 3,
                            flexShrink: 0,
                          }}
                        >
                          <AssignmentOutlinedIcon />
                        </Avatar>

                        <Box sx={{ minWidth: 0 }}>
                          <Chip
                            size="small"
                            icon={<MenuBookOutlinedIcon />}
                            label={
                              item.course?.title || "General Course"
                            }
                            sx={{
                              mb: 1,
                              maxWidth: "100%",
                              bgcolor: "#edf3ff",
                              color: "#2056a3",
                              fontWeight: 700,
                              "& .MuiChip-label": {
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              },
                            }}
                          />

                          <Typography
                            variant="h6"
                            sx={{
                              color: NAVY,
                              fontSize: { xs: 17, sm: 20 },
                              fontWeight: 800,
                              overflowWrap: "anywhere",
                            }}
                          >
                            {item.title || "Untitled Assignment"}
                          </Typography>

                          <Typography
                            variant="body2"
                            sx={{ color: "#8190a6", mt: 0.5 }}
                          >
                            Instructor: {item.teacher?.name || "Instructor"}
                          </Typography>
                        </Box>
                      </Stack>

                      <Chip
                        icon={
                          isSubmitted ? (
                            <CheckCircleIcon />
                          ) : isPastDue ? (
                            <ScheduleOutlinedIcon />
                          ) : (
                            <PendingActionsOutlinedIcon />
                          )
                        }
                        label={status}
                        color={
                          isSubmitted
                            ? getStatusColor(submission.status)
                            : isPastDue
                              ? "error"
                              : "warning"
                        }
                        sx={{
                          fontWeight: 700,
                          flexShrink: 0,
                          maxWidth: "100%",
                        }}
                      />
                    </Stack>

                    <Divider sx={{ my: 2.5, borderColor: "#edf0f6" }} />

                    <Typography
                      variant="body2"
                      sx={{
                        color: "#66748b",
                        lineHeight: 1.9,
                        whiteSpace: "pre-line",
                        overflowWrap: "anywhere",
                      }}
                    >
                      {item.description ||
                        "No description has been provided for this assignment."}
                    </Typography>

                    <Stack
                      direction={{ xs: "column", sm: "row" }}
                      spacing={1.5}
                      sx={{ mt: 2.5 }}
                    >
                      <Paper
                        elevation={0}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1.2,
                          px: 1.8,
                          py: 1.3,
                          borderRadius: 2.5,
                          bgcolor: "#f7f9fd",
                          flex: 1,
                        }}
                      >
                        <ScheduleOutlinedIcon
                          sx={{
                            color: isPastDue ? "#d9485f" : BLUE,
                          }}
                        />

                        <Box>
                          <Typography
                            variant="caption"
                            sx={{ color: "#8793a7", display: "block" }}
                          >
                            Due date
                          </Typography>

                          <Typography
                            variant="body2"
                            sx={{
                              color: isPastDue ? "#d9485f" : NAVY,
                              fontWeight: 700,
                            }}
                          >
                            {formatDate(item.dueDate)}
                          </Typography>
                        </Box>
                      </Paper>

                      {isSubmitted &&
                        submission.marks !== undefined &&
                        submission.marks !== null && (
                          <Paper
                            elevation={0}
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1.2,
                              px: 1.8,
                              py: 1.3,
                              borderRadius: 2.5,
                              bgcolor: "#eef9f3",
                              flex: 1,
                            }}
                          >
                            <CheckCircleIcon
                              sx={{ color: "#23956b" }}
                            />

                            <Box>
                              <Typography
                                variant="caption"
                                sx={{
                                  color: "#608b76",
                                  display: "block",
                                }}
                              >
                                Your score
                              </Typography>

                              <Typography
                                variant="body2"
                                sx={{
                                  color: "#16734e",
                                  fontWeight: 800,
                                }}
                              >
                                {submission.marks} / 100
                              </Typography>
                            </Box>
                          </Paper>
                        )}
                    </Stack>

                    {/* Submission area */}
                    <Box
                      sx={{
                        mt: 2.5,
                        p: { xs: 1.5, sm: 2 },
                        borderRadius: 3,
                        border: "1px solid",
                        borderColor: isSubmitted
                          ? "#d7eee1"
                          : "#e2eaf8",
                        bgcolor: isSubmitted
                          ? "#f3fbf6"
                          : "#f7f9fe",
                      }}
                    >
                      {isSubmitted ? (
                        <Stack
                          direction={{ xs: "column", sm: "row" }}
                          justifyContent="space-between"
                          alignItems={{ xs: "flex-start", sm: "center" }}
                          spacing={2}
                        >
                          <Box>
                            <Stack
                              direction="row"
                              alignItems="center"
                              spacing={1}
                            >
                              <CheckCircleIcon
                                sx={{ color: "#23956b" }}
                              />

                              <Typography
                                sx={{
                                  color: "#176b4a",
                                  fontWeight: 800,
                                  fontSize: 14,
                                }}
                              >
                                Assignment submitted
                              </Typography>
                            </Stack>

                            <Typography
                              variant="body2"
                              sx={{
                                color: "#668274",
                                mt: 0.7,
                                fontSize: 12,
                              }}
                            >
                              {submission.status === "Approved"
                                ? "Your work has been approved."
                                : submission.status === "Rejected"
                                  ? "Your work was rejected. Contact your instructor for feedback."
                                  : "Your work is waiting for review."}
                            </Typography>
                          </Box>

                          {submission.submissionURL && (
                            <Button
                              component="a"
                              href={submission.submissionURL}
                              target="_blank"
                              rel="noopener noreferrer"
                              variant="outlined"
                              endIcon={<OpenInNewOutlinedIcon />}
                              sx={{
                                textTransform: "none",
                                borderRadius: 2.5,
                                fontWeight: 700,
                                whiteSpace: "nowrap",
                                borderColor: "#b8deca",
                                color: "#16734e",
                              }}
                            >
                              View Submission
                            </Button>
                          )}
                        </Stack>
                      ) : (
                        <Box>
                          <Typography
                            sx={{
                              color: NAVY,
                              fontWeight: 800,
                              fontSize: 14,
                              mb: 0.5,
                            }}
                          >
                            Submit your work
                          </Typography>

                          <Typography
                            variant="body2"
                            sx={{
                              color: "#7e8ba1",
                              fontSize: 12,
                              mb: 1.5,
                            }}
                          >
                            Paste your project, GitHub, or Google Drive link.
                          </Typography>

                          <Stack
                            direction={{ xs: "column", sm: "row" }}
                            spacing={1.5}
                          >
                            <TextField
                              fullWidth
                              size="small"
                              type="url"
                              placeholder="https://example.com/your-project"
                              value={submissionURLs[item._id] || ""}
                              onChange={(e) =>
                                setSubmissionURLs((previous) => ({
                                  ...previous,
                                  [item._id]: e.target.value,
                                }))
                              }
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  handleSubmit(item._id);
                                }
                              }}
                              slotProps={{
                                input: {
                                  startAdornment: (
                                    <InputAdornment position="start">
                                      <LinkOutlinedIcon
                                        sx={{ color: "#8b98ad" }}
                                      />
                                    </InputAdornment>
                                  ),
                                },
                              }}
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  bgcolor: "#fff",
                                  borderRadius: 2.5,
                                },
                              }}
                            />

                            <Button
                              variant="contained"
                              onClick={() => handleSubmit(item._id)}
                              disabled={submittingId === item._id}
                              endIcon={
                                submittingId === item._id ? (
                                  <CircularProgress
                                    size={17}
                                    color="inherit"
                                  />
                                ) : (
                                  <ArrowForwardRoundedIcon />
                                )
                              }
                              sx={{
                                minWidth: { xs: "100%", sm: 160 },
                                borderRadius: 2.5,
                                textTransform: "none",
                                fontWeight: 800,
                                boxShadow: "none",
                                background:
                                  "linear-gradient(135deg, #1565c0, #2878d0)",
                                "&:hover": {
                                  boxShadow:
                                    "0 5px 14px rgba(21,101,192,0.2)",
                                  background:
                                    "linear-gradient(135deg, #0d47a1, #1565c0)",
                                },
                              }}
                            >
                              {submittingId === item._id
                                ? "Submitting..."
                                : "Submit Task"}
                            </Button>
                          </Stack>
                        </Box>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              );
            })}
          </Stack>
        )}

        <Typography
          variant="caption"
          sx={{
            display: "block",
            textAlign: "center",
            color: "#96a1b3",
            mt: 4,
            mb: 1,
          }}
        >
          EIK Learning Center · Student Portal
        </Typography>
      </Container>
    </Box>
    </StudentLayout>
  );
};

export default StudentAssignmentsPage;
