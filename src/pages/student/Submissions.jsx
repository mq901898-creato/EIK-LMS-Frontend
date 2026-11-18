import React, { useCallback, useEffect, useMemo, useState } from "react";
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
} from "@mui/material";

import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import PendingActionsOutlinedIcon from "@mui/icons-material/PendingActionsOutlined";
import RefreshIcon from "@mui/icons-material/Refresh";
import SearchIcon from "@mui/icons-material/Search";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import StarOutlineIcon from "@mui/icons-material/StarOutlined";

import Layout from "../../components/layout/Layout";
import GlassCard from "../../components/common/GlassCard";
import StatCard from "../../components/common/StatCard";
import StatusBadge from "../../components/common/StatusBadge";
import api from "../../servises/api";

const formatDate = (date) => {
  if (!date) return "N/A";
  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) return "N/A";
  return parsedDate.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export default function Submissions() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const fetchSubmissions = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const user = JSON.parse(localStorage.getItem("user") || "null");
      const studentId = user?.id || user?._id;

      if (!studentId) {
        setError("Student identity not found. Please log in again.");
        setSubmissions([]);
        return;
      }

      const response = await api.get(`/student/submissions/${studentId}`);
      setSubmissions(
        Array.isArray(response.data?.submissions) ? response.data.submissions : []
      );
    } catch (err) {
      console.error("Fetch student submissions error:", err);
      setError(
        err.response?.data?.message || "Unable to load submissions history. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  const getStatus = (submission) => {
    return String(submission.status || "Pending").toLowerCase() === "reviewed"
      ? "Reviewed"
      : "Pending";
  };

  const filteredSubmissions = useMemo(() => {
    const query = search.trim().toLowerCase();

    return submissions.filter((submission) => {
      const title = submission.assignment?.title || "Untitled Assignment";
      const matchesSearch = title.toLowerCase().includes(query);
      const matchesStatus =
        statusFilter === "All" || getStatus(submission) === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [submissions, search, statusFilter]);

  const totalCount = submissions.length;
  const reviewedCount = submissions.filter(
    (item) => getStatus(item) === "Reviewed"
  ).length;
  const pendingCount = totalCount - reviewedCount;

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
              Submission History & Grades
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>
              Track completed coursework, faculty assessment reviews, and scores.
            </Typography>
          </Box>

          <Tooltip title="Refresh">
            <IconButton
              onClick={fetchSubmissions}
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

        {error && (
          <Alert severity="error" onClose={() => setError("")}>
            {error}
          </Alert>
        )}

        {/* Metric Cards */}
        <Grid container spacing={2.5}>
          <Grid item xs={12} sm={4}>
            <StatCard
              title="Total Submitted"
              value={totalCount}
              icon={AssignmentOutlinedIcon}
              color="#6366f1"
              loading={loading}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <StatCard
              title="Evaluated & Graded"
              value={reviewedCount}
              icon={CheckCircleOutlinedIcon}
              color="#10b981"
              loading={loading}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <StatCard
              title="In Faculty Review"
              value={pendingCount}
              icon={PendingActionsOutlinedIcon}
              color="#f59e0b"
              loading={loading}
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
              {["All", "Pending", "Reviewed"].map((status) => (
                <Button
                  key={status}
                  size="small"
                  variant={statusFilter === status ? "contained" : "outlined"}
                  onClick={() => setStatusFilter(status)}
                  sx={{
                    borderRadius: "6px",
                    px: 2,
                    fontSize: "0.8rem",
                    ...(statusFilter !== status && {
                      borderColor: "rgba(255, 255, 255, 0.1)",
                      color: "text.secondary",
                    }),
                  }}
                >
                  {status}
                </Button>
              ))}
            </Box>

            <TextField
              size="small"
              placeholder="Search by assignment title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "text.secondary", fontSize: 18 }} />
                  </InputAdornment>
                ),
              }}
              sx={{ width: { xs: "100%", sm: 320 } }}
            />
          </Box>
        </GlassCard>

        {/* Submissions List */}
        {loading ? (
          <Grid container spacing={2.5}>
            {Array.from({ length: 3 }).map((_, i) => (
              <Grid item xs={12} key={i}>
                <GlassCard sx={{ p: 3 }}>
                  <Skeleton width="40%" height={28} sx={{ mb: 1 }} />
                  <Skeleton width="60%" height={20} sx={{ mb: 2 }} />
                  <Skeleton height={36} width="80%" />
                </GlassCard>
              </Grid>
            ))}
          </Grid>
        ) : filteredSubmissions.length === 0 ? (
          <GlassCard
            sx={{
              textAlign: "center",
              py: 8,
              px: 3,
              border: "1px dashed rgba(255, 255, 255, 0.15)",
            }}
          >
            <AssignmentOutlinedIcon sx={{ fontSize: 50, color: "text.secondary", mb: 1.5 }} />
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              No submissions recorded
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>
              Deliver solutions from the Coursework tab to generate graded evaluation records.
            </Typography>
          </GlassCard>
        ) : (
          <Grid container spacing={2.5}>
            {filteredSubmissions.map((submission) => {
              const assignment = submission.assignment || {};
              const isReviewed = getStatus(submission) === "Reviewed";

              return (
                <Grid item xs={12} key={submission._id}>
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
                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                          {assignment.title || "Course Assignment"}
                        </Typography>
                        <Typography variant="caption" sx={{ color: "text.secondary" }}>
                          Delivered: {formatDate(submission.createdAt || submission.submissionDate)}
                        </Typography>
                      </Box>

                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        {isReviewed && submission.marks !== undefined && (
                          <Chip
                            icon={<StarOutlineIcon sx={{ fontSize: 16 }} />}
                            label={`Score: ${submission.marks}/100`}
                            color="success"
                            size="small"
                            sx={{ fontWeight: 800 }}
                          />
                        )}
                        <StatusBadge
                          status={isReviewed ? "active" : "pending"}
                          label={isReviewed ? "REVIEWED & GRADED" : "UNDER REVIEW"}
                        />
                      </Box>
                    </Box>

                    {/* Submission URL link */}
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="caption" sx={{ color: "text.secondary", display: "block", mb: 0.5 }}>
                        Artifact Solution Link:
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
                          fontSize: "0.875rem",
                        }}
                      >
                        {submission.submissionURL} <OpenInNewIcon sx={{ fontSize: 14 }} />
                      </Link>
                    </Box>

                    {/* Instructor Feedback */}
                    {submission.feedback && (
                      <Box
                        sx={{
                          p: 2,
                          borderRadius: "10px",
                          bgcolor: "rgba(99, 102, 241, 0.06)",
                          border: "1px solid rgba(99, 102, 241, 0.2)",
                        }}
                      >
                        <Typography variant="caption" sx={{ color: "#818cf8", fontWeight: 700, display: "block", mb: 0.5 }}>
                          Faculty Feedback:
                        </Typography>
                        <Typography variant="body2" sx={{ color: "text.primary", lineHeight: 1.6 }}>
                          "{submission.feedback}"
                        </Typography>
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
