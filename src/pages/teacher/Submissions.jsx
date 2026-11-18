import React, { useEffect, useState, useMemo } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  Tooltip,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Skeleton,
  Link,
  Grid,
} from "@mui/material";

import GradeIcon from "@mui/icons-material/Grade";
import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import AssignmentIcon from "@mui/icons-material/Assignment";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import Layout from "../../components/layout/Layout";
import GlassCard from "../../components/common/GlassCard";
import StatCard from "../../components/common/StatCard";
import StatusBadge from "../../components/common/StatusBadge";
import api from "../../servises/api";

export default function Submissions() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Grade Modal State
  const [openGradeDialog, setOpenGradeDialog] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [gradeData, setGradeData] = useState({ marks: "", feedback: "" });

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await api.get("/teacher/submissions");
      const data = response.data?.submissions || response.data?.data || [];
      setSubmissions(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch submissions error:", err);
      setError(err.response?.data?.message || "Failed to load student submissions.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const handleOpenGrade = (sub) => {
    setSelectedSubmission(sub);
    setGradeData({
      marks: sub.marks !== undefined && sub.marks !== null ? sub.marks : "",
      feedback: sub.feedback || "",
    });
    setError("");
    setSuccess("");
    setOpenGradeDialog(true);
  };

  const handleSubmitGrade = async (e) => {
    e.preventDefault();
    if (!selectedSubmission) return;

    const marks = Number(gradeData.marks);
    if (isNaN(marks) || marks < 0 || marks > 100) {
      setError("Please provide a valid score between 0 and 100.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      await api.post(`/reviewed/${selectedSubmission._id}`, {
        marks,
        feedback: gradeData.feedback.trim(),
        status: "reviewed",
      });

      setSuccess("Submission evaluated and score recorded.");
      setOpenGradeDialog(false);
      fetchSubmissions();
    } catch (err) {
      console.error("Grade error:", err);
      setError(err.response?.data?.message || "Failed to submit review.");
    } finally {
      setSaving(false);
    }
  };

  const totalCount = submissions.length;
  const reviewedCount = submissions.filter((s) => s.status === "reviewed").length;
  const pendingCount = totalCount - reviewedCount;

  const filteredSubmissions = useMemo(() => {
    let list = submissions;
    if (statusFilter !== "all") {
      list = list.filter((s) => s.status === statusFilter);
    }
    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (s) =>
          s.student?.name?.toLowerCase().includes(q) ||
          s.assignment?.title?.toLowerCase().includes(q) ||
          s.course?.title?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [submissions, statusFilter, search]);

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
              Assessment Evaluation Station
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>
              Review student coursework submissions, deliver feedback, and assign grades.
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
              title="Delivered Submissions"
              value={totalCount}
              icon={AssignmentIcon}
              color="#6366f1"
              loading={loading}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <StatCard
              title="Awaiting Review"
              value={pendingCount}
              icon={PendingActionsIcon}
              color="#f59e0b"
              loading={loading}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <StatCard
              title="Graded & Evaluated"
              value={reviewedCount}
              icon={CheckCircleIcon}
              color="#10b981"
              loading={loading}
            />
          </Grid>
        </Grid>

        {/* Table Card */}
        <GlassCard sx={{ p: 0, overflow: "hidden" }}>
          {/* Toolbar */}
          <Box
            sx={{
              p: 2.5,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 2,
              borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
            }}
          >
            <Box sx={{ display: "flex", gap: 1 }}>
              {[
                { id: "all", label: "All Works" },
                { id: "pending", label: "Pending" },
                { id: "reviewed", label: "Reviewed" },
              ].map((tab) => (
                <Button
                  key={tab.id}
                  size="small"
                  variant={statusFilter === tab.id ? "contained" : "outlined"}
                  onClick={() => setStatusFilter(tab.id)}
                  sx={{
                    borderRadius: "6px",
                    px: 2,
                    fontSize: "0.8rem",
                    ...(statusFilter !== tab.id && {
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
              placeholder="Search by student, assignment, or course..."
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

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ width: 60 }}>#</TableCell>
                  <TableCell>Student</TableCell>
                  <TableCell>Assignment Title</TableCell>
                  <TableCell>Course</TableCell>
                  <TableCell>Work Link</TableCell>
                  <TableCell>Score</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="center" sx={{ width: 140 }}>
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton width={20} /></TableCell>
                      <TableCell><Skeleton width={140} /></TableCell>
                      <TableCell><Skeleton width={160} /></TableCell>
                      <TableCell><Skeleton width={120} /></TableCell>
                      <TableCell><Skeleton width={100} /></TableCell>
                      <TableCell><Skeleton width={60} /></TableCell>
                      <TableCell><Skeleton width={80} /></TableCell>
                      <TableCell align="center"><Skeleton width={80} sx={{ mx: "auto" }} /></TableCell>
                    </TableRow>
                  ))
                ) : filteredSubmissions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} sx={{ textAlign: "center", py: 6 }}>
                      <Typography variant="body1" sx={{ color: "text.secondary", fontWeight: 500 }}>
                        No submissions matching your filter criteria.
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredSubmissions.map((sub, index) => {
                    const isReviewed = sub.status === "reviewed";

                    return (
                      <TableRow key={sub._id} hover>
                        <TableCell sx={{ color: "text.secondary", fontSize: "0.8rem" }}>
                          {index + 1}
                        </TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>
                          {sub.student?.name || "Student"}
                        </TableCell>
                        <TableCell sx={{ fontWeight: 600, color: "text.primary" }}>
                          {sub.assignment?.title || "Coursework Task"}
                        </TableCell>
                        <TableCell sx={{ color: "text.secondary" }}>
                          {sub.course?.title || "Track"}
                        </TableCell>
                        <TableCell>
                          {sub.submissionURL ? (
                            <Link
                              href={sub.submissionURL}
                              target="_blank"
                              rel="noopener noreferrer"
                              sx={{
                                color: "#818cf8",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 0.5,
                                fontSize: "0.85rem",
                              }}
                            >
                              Solution <OpenInNewIcon sx={{ fontSize: 13 }} />
                            </Link>
                          ) : (
                            <Typography variant="caption" sx={{ color: "text.secondary" }}>
                              No link attached
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 800, color: isReviewed ? "#10b981" : "text.secondary" }}>
                            {sub.marks !== undefined && sub.marks !== null ? `${sub.marks}/100` : "—"}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={isReviewed ? "active" : "pending"} label={isReviewed ? "GRADED" : "PENDING"} />
                        </TableCell>
                        <TableCell align="center">
                          <Button
                            size="small"
                            variant={isReviewed ? "outlined" : "contained"}
                            startIcon={<GradeIcon />}
                            onClick={() => handleOpenGrade(sub)}
                            sx={{ fontSize: "0.75rem", py: 0.5 }}
                          >
                            {isReviewed ? "Edit Grade" : "Evaluate"}
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </GlassCard>

        {/* Grading Dialog */}
        <Dialog
          open={openGradeDialog}
          onClose={() => !saving && setOpenGradeDialog(false)}
          maxWidth="xs"
          fullWidth
        >
          <DialogTitle sx={{ fontWeight: 800 }}>
            Evaluate Student Submission
          </DialogTitle>
          <Box component="form" onSubmit={handleSubmitGrade}>
            <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2.5, pt: 1 }}>
              <Box>
                <Typography variant="caption" sx={{ color: "text.secondary", display: "block" }}>
                  Student: <strong>{selectedSubmission?.student?.name}</strong>
                </Typography>
                <Typography variant="caption" sx={{ color: "text.secondary", display: "block" }}>
                  Assignment: <strong>{selectedSubmission?.assignment?.title}</strong>
                </Typography>
              </Box>

              {selectedSubmission?.submissionURL && (
                <Box>
                  <Typography variant="caption" sx={{ color: "text.secondary", display: "block", mb: 0.5 }}>
                    Submission Link:
                  </Typography>
                  <Link
                    href={selectedSubmission.submissionURL}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ color: "#818cf8", fontSize: "0.85rem", wordBreak: "break-all" }}
                  >
                    {selectedSubmission.submissionURL}
                  </Link>
                </Box>
              )}

              <TextField
                label="Score / Marks (out of 100)"
                type="number"
                required
                fullWidth
                size="small"
                inputProps={{ min: 0, max: 100 }}
                value={gradeData.marks}
                onChange={(e) => setGradeData({ ...gradeData, marks: e.target.value })}
              />

              <TextField
                label="Feedback & Guidance Notes"
                multiline
                minRows={3}
                fullWidth
                size="small"
                placeholder="Praise strengths or suggest improvements for the student..."
                value={gradeData.feedback}
                onChange={(e) => setGradeData({ ...gradeData, feedback: e.target.value })}
              />
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2.5 }}>
              <Button onClick={() => setOpenGradeDialog(false)} disabled={saving} variant="outlined" size="small">
                Cancel
              </Button>
              <Button type="submit" variant="contained" disabled={saving} size="small">
                {saving ? "Recording..." : "Save Grade & Feedback"}
              </Button>
            </DialogActions>
          </Box>
        </Dialog>
      </Box>
    </Layout>
  );
}
