import React, { useCallback, useEffect, useMemo, useState } from "react";
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
  InputAdornment,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import AssignmentOutlined from "@mui/icons-material/AssignmentOutlined";
import CheckCircleOutlined from "@mui/icons-material/CheckCircleOutlined";
import OpenInNew from "@mui/icons-material/OpenInNew";
import PendingActionsOutlined from "@mui/icons-material/PendingActionsOutlined";
import Refresh from "@mui/icons-material/Refresh";
import Search from "@mui/icons-material/Search";
import UploadFileOutlined from "@mui/icons-material/UploadFileOutlined";

import StudentLayout from "../components/student/StudentLayout";
import api from "../../servises/api";

const formatDate = (date) => {
  if (!date) return "N/A";
  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) return "N/A";
  return parsedDate.toLocaleDateString("en-GB", {
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
        setError("Student information was not found. Please log in again.");
        setSubmissions([]);
        return;
      }

      const response = await api.get(`/student/submissions/${studentId}`);

      setSubmissions(
        Array.isArray(response.data?.submissions)
          ? response.data.submissions
          : []
      );
    } catch (err) {
      console.error("Fetch student submissions error:", err);
      setError(
        err.response?.data?.message ||
          "Unable to load your submissions. Please try again."
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
    <StudentLayout>
      <Box sx={{ minHeight: "100vh", bgcolor: "#f8fafc", py: { xs: 2, sm: 3, md: 4 } }}>
        <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3 } }}>
          
          {/* Page Heading & Refresh Action */}
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "stretch", sm: "center" }}
            spacing={2}
            sx={{ mb: { xs: 3, md: 4 } }}
          >
            <Box>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 800,
                  color: "#0f172a",
                  letterSpacing: "-0.5px",
                  fontSize: { xs: "1.5rem", sm: "1.8rem", md: "2.2rem" },
                }}
              >
                My Submissions
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                Track your assignment progress, grades, and teacher reviews.
              </Typography>
            </Box>

            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={fetchSubmissions}
              sx={{
                textTransform: "none",
                borderRadius: 2.5,
                fontWeight: 600,
                borderColor: "#cbd5e1",
                color: "#334155",
                bgcolor: "#ffffff",
                py: { xs: 1, sm: 0.75 },
                "&:hover": {
                  bgcolor: "#f1f5f9",
                  borderColor: "#94a3b8",
                },
              }}
            >
              Refresh Submissions
            </Button>
          </Stack>

          {error && (
            <Alert
              severity="error"
              sx={{ mb: 3, borderRadius: 3 }}
              action={
                <Button color="inherit" size="small" onClick={fetchSubmissions}>
                  Retry
                </Button>
              }
            >
              {error}
            </Alert>
          )}

          {/* Statistics Cards Grid */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, minmax(0, 1fr))",
                md: "repeat(3, minmax(0, 1fr))",
              },
              gap: { xs: 2, md: 2.5 },
              mb: { xs: 3, md: 4 },
            }}
          >
            <StatCard
              icon={<AssignmentOutlined />}
              iconBg="#eff6ff"
              iconColor="#2563eb"
              title="Total Submissions"
              value={totalCount}
            />
            <StatCard
              icon={<CheckCircleOutlined />}
              iconBg="#f0fdf4"
              iconColor="#16a34a"
              title="Reviewed"
              value={reviewedCount}
              valueColor="#16a34a"
            />
            <StatCard
              icon={<PendingActionsOutlined />}
              iconBg="#fffbeb"
              iconColor="#d97706"
              title="Pending Review"
              value={pendingCount}
              valueColor="#d97706"
            />
          </Box>

          {/* Search and Filters Toolbar */}
          <Card
            elevation={0}
            sx={{
              borderRadius: 3,
              mb: 3,
              border: "1px solid #e2e8f0",
              boxShadow: "0 4px 12px rgba(0,0,0,0.02)",
            }}
          >
            <CardContent sx={{ p: { xs: 2, sm: 2.5 } }}>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Search by assignment title..."
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search sx={{ color: "text.secondary" }} />
                      </InputAdornment>
                    ),
                    sx: { borderRadius: 2 },
                  }}
                />

                <TextField
                  select
                  size="small"
                  label="Filter Status"
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value)}
                  sx={{
                    minWidth: { xs: "100%", sm: 200 },
                    "& .MuiOutlinedInput-root": { borderRadius: 2 },
                  }}
                >
                  <MenuItem value="All">All Submissions</MenuItem>
                  <MenuItem value="Pending">Pending Review</MenuItem>
                  <MenuItem value="Reviewed">Reviewed</MenuItem>
                </TextField>
              </Stack>
            </CardContent>
          </Card>

          {/* Submission List / Loading / Empty States */}
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
              <CircularProgress />
            </Box>
          ) : filteredSubmissions.length === 0 ? (
            <Card
              elevation={0}
              sx={{
                borderRadius: 3,
                textAlign: "center",
                py: { xs: 6, sm: 8 },
                px: 2,
                border: "1px solid #e2e8f0",
                bgcolor: "#ffffff",
              }}
            >
              <UploadFileOutlined sx={{ fontSize: 56, color: "#94a3b8", mb: 1.5 }} />

              <Typography variant="h6" fontWeight={700} color="#0f172a">
                {submissions.length === 0
                  ? "No submissions yet"
                  : "No matching submissions"}
              </Typography>

              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, maxWidth: 400, mx: "auto" }}>
                {submissions.length === 0
                  ? "Your submitted assignments will appear here once you upload your work."
                  : "Try adjusting your search query or status filter options."}
              </Typography>

              {(search || statusFilter !== "All") && (
                <Button
                  variant="outlined"
                  size="small"
                  sx={{ mt: 2.5, textTransform: "none", borderRadius: 2 }}
                  onClick={() => {
                    setSearch("");
                    setStatusFilter("All");
                  }}
                >
                  Clear Filters
                </Button>
              )}
            </Card>
          ) : (
            <Stack spacing={2}>
              {filteredSubmissions.map((submission) => {
                const status = getStatus(submission);
                const assignment = submission.assignment;
                const title = assignment?.title || "Untitled Assignment";
                const submissionUrl = submission.submissionURL;

                return (
                  <Card
                    elevation={0}
                    key={submission._id}
                    sx={{
                      borderRadius: 3,
                      border: "1px solid",
                      borderColor: "#e2e8f0",
                      boxShadow: "0 4px 12px rgba(15, 23, 42, 0.02)",
                      transition: "all 0.2s ease-in-out",
                      bgcolor: "#ffffff",
                      "&:hover": {
                        boxShadow: "0 8px 24px rgba(15, 23, 42, 0.06)",
                        borderColor: "#cbd5e1",
                      },
                    }}
                  >
                    <CardContent sx={{ p: { xs: 2, sm: 2.5, md: 3 } }}>
                      <Stack
                        direction={{ xs: "column", md: "row" }}
                        justifyContent="space-between"
                        alignItems={{ xs: "stretch", md: "center" }}
                        spacing={3}
                      >
                        {/* Left Info Section */}
                        <Stack direction="row" spacing={2} alignItems="flex-start" sx={{ minWidth: 0, flex: 1 }}>
                          <Avatar
                            variant="rounded"
                            sx={{
                              bgcolor: "#eff6ff",
                              color: "#2563eb",
                              width: { xs: 44, sm: 50 },
                              height: { xs: 44, sm: 50 },
                              borderRadius: 2.5,
                              flexShrink: 0,
                            }}
                          >
                            <AssignmentOutlined />
                          </Avatar>

                          <Box sx={{ minWidth: 0, flex: 1 }}>
                            <Typography
                              variant="h6"
                              fontWeight={750}
                              color="#0f172a"
                              sx={{
                                overflowWrap: "anywhere",
                                fontSize: { xs: "0.95rem", sm: "1.05rem" },
                                lineHeight: 1.4,
                              }}
                            >
                              {title}
                            </Typography>

                            <Typography variant="caption" color="text.secondary" fontWeight={500} sx={{ display: "block", mt: 0.5 }}>
                              Submitted on {formatDate(submission.createdAt)}
                            </Typography>

                            {assignment?.description && (
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{
                                  mt: 1,
                                  display: "-webkit-box",
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: "vertical",
                                  overflow: "hidden",
                                  fontSize: "0.875rem",
                                }}
                              >
                                {assignment.description}
                              </Typography>
                            )}
                          </Box>
                        </Stack>

                        {/* Right Actions & Status Section */}
                        <Stack
                          direction={{ xs: "row", sm: "row" }}
                          alignItems="center"
                          justifyContent={{ xs: "space-between", md: "flex-end" }}
                          spacing={{ xs: 1.5, sm: 2.5 }}
                          sx={{
                            pt: { xs: 1.5, md: 0 },
                            borderTop: { xs: "1px solid #f1f5f9", md: "none" },
                            flexWrap: "wrap",
                            gap: 1,
                          }}
                        >
                          <Box sx={{ textAlign: { xs: "left", md: "right" } }}>
                            <Typography variant="caption" color="text.secondary" fontWeight={500} sx={{ display: "block" }}>
                              Grade / Marks
                            </Typography>
                            <Typography fontWeight={800} color="#0f172a" sx={{ fontSize: "0.95rem" }}>
                              {status === "Reviewed"
                                ? `${submission.marks ?? 0} marks`
                                : "Not graded"}
                            </Typography>
                          </Box>

                          <Chip
                            icon={
                              status === "Reviewed" ? (
                                <CheckCircleOutlined fontSize="small" />
                              ) : (
                                <PendingActionsOutlined fontSize="small" />
                              )
                            }
                            label={status}
                            color={status === "Reviewed" ? "success" : "warning"}
                            variant="outlined"
                            sx={{ fontWeight: 700, borderRadius: 2, height: 32 }}
                          />

                          {submissionUrl && (
                            <Button
                              component="a"
                              href={submissionUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              variant="contained"
                              endIcon={<OpenInNew />}
                              sx={{
                                textTransform: "none",
                                borderRadius: 2.5,
                                fontWeight: 600,
                                bgcolor: "#2563eb",
                                boxShadow: "none",
                                py: 0.75,
                                px: 2,
                                "&:hover": {
                                  bgcolor: "#1d4ed8",
                                  boxShadow: "0 4px 12px rgba(37, 99, 235, 0.2)",
                                },
                              }}
                            >
                              View Work
                            </Button>
                          )}
                        </Stack>
                      </Stack>
                    </CardContent>
                  </Card>
                );
              })}
            </Stack>
          )}
        </Container>
      </Box>
    </StudentLayout>
  );
}

// Reusable Stat Card Component
function StatCard({ icon, iconBg, iconColor, title, value, valueColor = "#0f172a" }) {
  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 3,
        border: "1px solid #e2e8f0",
        boxShadow: "0 4px 12px rgba(0,0,0,0.02)",
      }}
    >
      <CardContent sx={{ display: "flex", gap: 2, alignItems: "center", p: { xs: 2, sm: 2.5 } }}>
        <Avatar
          sx={{
            bgcolor: iconBg,
            color: iconColor,
            width: { xs: 44, sm: 50 },
            height: { xs: 44, sm: 50 },
            borderRadius: 2.5,
            flexShrink: 0,
          }}
        >
          {icon}
        </Avatar>
        <Box sx={{ minWidth: 0 }}>
          <Typography color="text.secondary" variant="body2" fontWeight={500} noWrap>
            {title}
          </Typography>
          <Typography variant="h5" fontWeight={800} color={valueColor} sx={{ mt: 0.2, fontSize: { xs: "1.25rem", sm: "1.5rem" } }}>
            {value}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}