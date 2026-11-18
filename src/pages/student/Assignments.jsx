import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Grid,
  TextField,
  InputAdornment,
  Typography,
  Chip,
  IconButton,
  Tooltip,
  Skeleton,
  Link,
  CircularProgress,
} from "@mui/material";

import AssignmentIcon from "@mui/icons-material/Assignment";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutlined";
import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";
import LinkIcon from "@mui/icons-material/Link";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import SendIcon from "@mui/icons-material/Send";

import Layout from "../../components/layout/Layout";
import GlassCard from "../../components/common/GlassCard";
import StatCard from "../../components/common/StatCard";
import StatusBadge from "../../components/common/StatusBadge";
import api from "../../servises/api";

const isValidUrl = (value) => {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
};

export default function StudentAssignmentsPage() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submissionURLs, setSubmissionURLs] = useState({});
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [submittingId, setSubmittingId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await api.get("/student/assignments");

      if (response.data?.success) {
        setAssignments(Array.isArray(response.data.assignments) ? response.data.assignments : []);
      } else {
        setError(response.data?.message || "Unable to load assignments.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load assignments. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  const pendingCount = assignments.filter((item) => !item.isSubmitted).length;
  const submittedCount = assignments.filter((item) => item.isSubmitted).length;
  const overdueCount = assignments.filter((item) => {
    if (item.isSubmitted || !item.dueDate) return false;
    const dueDate = new Date(item.dueDate);
    return !Number.isNaN(dueDate.getTime()) && dueDate < new Date();
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
        [item.title, item.description, item.course?.title, item.teacher?.name]
          .filter(Boolean)
          .some((val) => String(val).toLowerCase().includes(searchText));

      return matchesFilter && matchesSearch;
    });
  }, [assignments, filter, search]);

  const handleSubmit = async (assignmentId) => {
    const url = (submissionURLs[assignmentId] || "").trim();

    if (!isValidUrl(url)) {
      setError("Please enter a valid link beginning with https:// or http:// (e.g. GitHub or Google Drive).");
      return;
    }

    try {
      setSubmittingId(assignmentId);
      setError("");
      setSuccess("");

      const response = await api.post("/student/assignments/submit", {
        assignmentId,
        submissionURL: url,
      });

      if (response.data?.success) {
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

        setSuccess("Assignment submitted successfully to course faculty.");
      } else {
        setError(response.data?.message || "Submission failed.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit assignment.");
    } finally {
      setSubmittingId(null);
    }
  };

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
              Coursework & Homework
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>
              Submit task URLs, track faculty evaluation statuses, and meet academic deadlines.
            </Typography>
          </Box>

          <Tooltip title="Refresh">
            <IconButton
              onClick={fetchAssignments}
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
        </Box>

        {/* Alerts */}
        {success && (
          <Alert severity="success" onClose={() => setSuccess("")}>
            {success}
          </Alert>
        )}
        {error && (
          <Alert severity="error" onClose={() => setError("")}>
            {error}
          </Alert>
        )}

        {/* Metric Cards */}
        <Grid container spacing={2.5}>
          <Grid item xs={12} sm={4}>
            <StatCard
              title="Pending Homework"
              value={pendingCount}
              icon={PendingActionsIcon}
              color="#f59e0b"
              loading={loading}
              trendLabel="Requires submission"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <StatCard
              title="Delivered & Submitted"
              value={submittedCount}
              icon={CheckCircleIcon}
              color="#10b981"
              loading={loading}
              trendLabel="Under review / Graded"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <StatCard
              title="Overdue Tasks"
              value={overdueCount}
              icon={ErrorOutlineIcon}
              color="#ef4444"
              loading={loading}
              trendLabel="Past submission deadline"
            />
          </Grid>
        </Grid>

        {/* Toolbar */}
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
            <Box sx={{ display: "flex", gap: 1 }}>
              {[
                { id: "all", label: "All Tasks" },
                { id: "pending", label: "Pending" },
                { id: "submitted", label: "Delivered" },
              ].map((tab) => (
                <Button
                  key={tab.id}
                  size="small"
                  variant={filter === tab.id ? "contained" : "outlined"}
                  onClick={() => setFilter(tab.id)}
                  sx={{
                    borderRadius: "6px",
                    px: 2,
                    fontSize: "0.8rem",
                    ...(filter !== tab.id && {
                      borderColor: "rgba(255, 255, 255, 0.1)",
                      color: "text.secondary",
                    }),
                  }}
                >
                  {tab.label}
                </Button>
              ))}
            </Box>

            <TextField
              size="small"
              placeholder="Search tasks by title, course, or instructor..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "text.secondary", fontSize: 18 }} />
                  </InputAdornment>
                ),
              }}
              sx={{ width: { xs: "100%", sm: 340 } }}
            />
          </Box>
        </GlassCard>

        {/* Assignments List */}
        {loading ? (
          <Grid container spacing={2.5}>
            {Array.from({ length: 3 }).map((_, i) => (
              <Grid item xs={12} key={i}>
                <GlassCard sx={{ p: 3 }}>
                  <Skeleton width="40%" height={32} sx={{ mb: 1 }} />
                  <Skeleton width="70%" height={20} sx={{ mb: 2 }} />
                  <Skeleton height={40} width="60%" />
                </GlassCard>
              </Grid>
            ))}
          </Grid>
        ) : filteredAssignments.length === 0 ? (
          <GlassCard
            sx={{
              textAlign: "center",
              py: 8,
              px: 3,
              border: "1px dashed rgba(255, 255, 255, 0.15)",
            }}
          >
            <AssignmentIcon sx={{ fontSize: 50, color: "text.secondary", mb: 1.5 }} />
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              No assignments found
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>
              You are all caught up with your academic tasks!
            </Typography>
          </GlassCard>
        ) : (
          <Grid container spacing={2.5}>
            {filteredAssignments.map((assignment) => {
              const submission = assignment.submissionDetails || assignment.submission || {};
              const isOverdue =
                !assignment.isSubmitted &&
                assignment.dueDate &&
                new Date(assignment.dueDate) < new Date();
              const isSubmitting = submittingId === assignment._id;

              return (
                <Grid item xs={12} key={assignment._id}>
                  <GlassCard sx={{ p: 3 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: { xs: "flex-start", sm: "center" },
                        flexDirection: { xs: "column", sm: "row" },
                        gap: 1.5,
                        mb: 2,
                      }}
                    >
                      <Box>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flexWrap: "wrap", mb: 0.5 }}>
                          <Typography variant="h6" sx={{ fontWeight: 700 }}>
                            {assignment.title}
                          </Typography>
                          <Chip
                            label={assignment.course?.title || "Course Track"}
                            size="small"
                            sx={{
                              bgcolor: "rgba(99, 102, 241, 0.08)",
                              color: "#818cf8",
                              border: "1px solid rgba(99, 102, 241, 0.2)",
                              fontWeight: 700,
                              fontSize: "0.7rem",
                            }}
                          />
                        </Box>
                        <Typography variant="caption" sx={{ color: "text.secondary" }}>
                          Instructor: {assignment.teacher?.name || "Faculty Member"} • Due:{" "}
                          {assignment.dueDate
                            ? new Date(assignment.dueDate).toLocaleDateString(undefined, {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })
                            : "No deadline"}
                        </Typography>
                      </Box>

                      <StatusBadge
                        status={
                          assignment.isSubmitted
                            ? submission.status || "submitted"
                            : isOverdue
                            ? "rejected"
                            : "pending"
                        }
                        label={
                          assignment.isSubmitted
                            ? submission.status || "Delivered"
                            : isOverdue
                            ? "OVERDUE"
                            : "PENDING"
                        }
                      />
                    </Box>

                    <Typography variant="body2" sx={{ color: "text.secondary", mb: 3, lineHeight: 1.6 }}>
                      {assignment.description || "Review course guidelines and submit completed solution link."}
                    </Typography>

                    {/* Submission Bar */}
                    {assignment.isSubmitted ? (
                      <Box
                        sx={{
                          p: 2,
                          borderRadius: "10px",
                          bgcolor: "rgba(16, 185, 129, 0.06)",
                          border: "1px solid rgba(16, 185, 129, 0.2)",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          flexWrap: "wrap",
                          gap: 1.5,
                        }}
                      >
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <CheckCircleIcon sx={{ color: "#10b981", fontSize: 20 }} />
                          <Typography variant="body2" sx={{ fontWeight: 600, color: "#10b981" }}>
                            Delivered:
                          </Typography>
                          <Link
                            href={submission.submissionURL}
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{
                              color: "#818cf8",
                              fontWeight: 600,
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 0.5,
                              fontSize: "0.85rem",
                            }}
                          >
                            {submission.submissionURL} <OpenInNewIcon sx={{ fontSize: 14 }} />
                          </Link>
                        </Box>

                        {submission.marks !== undefined && (
                          <Chip
                            label={`Grade: ${submission.marks}/100`}
                            color="success"
                            size="small"
                            sx={{ fontWeight: 800 }}
                          />
                        )}
                      </Box>
                    ) : (
                      <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
                        <TextField
                          size="small"
                          placeholder="Paste GitHub, Google Drive, or Demo URL (https://...)"
                          value={submissionURLs[assignment._id] || ""}
                          onChange={(e) =>
                            setSubmissionURLs({
                              ...submissionURLs,
                              [assignment._id]: e.target.value,
                            })
                          }
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <LinkIcon sx={{ color: "text.secondary", fontSize: 18 }} />
                              </InputAdornment>
                            ),
                          }}
                          sx={{ flex: 1, minWidth: { xs: "100%", sm: 300 } }}
                        />

                        <Button
                          variant="contained"
                          startIcon={<SendIcon />}
                          disabled={isSubmitting}
                          onClick={() => handleSubmit(assignment._id)}
                          sx={{ px: 3 }}
                        >
                          {isSubmitting ? <CircularProgress size={18} sx={{ color: "#ffffff" }} /> : "Submit Work"}
                        </Button>
                      </Box>
                    )}
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
