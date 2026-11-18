import React, { useEffect, useState, useMemo } from "react";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Grid,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  InputAdornment,
  CircularProgress,
  IconButton,
  Tooltip,
  Skeleton,
} from "@mui/material";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import SchoolIcon from "@mui/icons-material/School";
import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";

import Layout from "../../components/layout/Layout";
import GlassCard from "../../components/common/GlassCard";
import StatCard from "../../components/common/StatCard";
import StatusBadge from "../../components/common/StatusBadge";
import api from "../../servises/api";

export default function Enrollments() {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [filter, setFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchEnrollments = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await api.get("/teacher/enrollments");
      const data = response.data.enrollments || response.data.data || [];
      setEnrollments(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load enrollment requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const handleStatusChange = async (enrollmentId, action) => {
    try {
      setProcessingId(enrollmentId);
      setError("");
      setMessage("");

      const response = await api.put(`/teacher/enrollments/${enrollmentId}/${action}`);
      setMessage(
        response.data.message ||
          `Enrollment ${action === "approve" ? "approved" : "rejected"} successfully.`
      );
      await fetchEnrollments();
    } catch (err) {
      setError(err.response?.data?.message || `Failed to ${action} enrollment.`);
    } finally {
      setProcessingId(null);
    }
  };

  const pendingCount = enrollments.filter((item) => item.status === "Pending").length;
  const approvedCount = enrollments.filter((item) => item.status === "Approved").length;
  const rejectedCount = enrollments.filter((item) => item.status === "Rejected").length;

  const filteredEnrollments = useMemo(() => {
    let list = enrollments;
    if (filter !== "All") {
      list = list.filter((item) => item.status === filter);
    }
    const q = searchQuery.toLowerCase().trim();
    if (q) {
      list = list.filter(
        (item) =>
          item.student?.name?.toLowerCase().includes(q) ||
          item.student?.email?.toLowerCase().includes(q) ||
          item.course?.title?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [enrollments, filter, searchQuery]);

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
              Enrollment Applications
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>
              Evaluate, accept, or reject student admission requests across your course tracks.
            </Typography>
          </Box>

          <Tooltip title="Refresh">
            <IconButton
              onClick={fetchEnrollments}
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
        {message && (
          <Alert severity="success" onClose={() => setMessage("")}>
            {message}
          </Alert>
        )}
        {error && (
          <Alert severity="error" onClose={() => setError("")}>
            {error}
          </Alert>
        )}

        {/* Metric Cards */}
        <Grid container spacing={2.5}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Total Requests"
              value={enrollments.length}
              icon={SchoolIcon}
              color="#6366f1"
              loading={loading}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Pending Approval"
              value={pendingCount}
              icon={AccessTimeIcon}
              color="#f59e0b"
              loading={loading}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Approved Students"
              value={approvedCount}
              icon={CheckCircleIcon}
              color="#10b981"
              loading={loading}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Declined"
              value={rejectedCount}
              icon={CancelIcon}
              color="#ef4444"
              loading={loading}
            />
          </Grid>
        </Grid>

        {/* Enrollments Table Card */}
        <GlassCard sx={{ p: 0, overflow: "hidden" }}>
          {/* Filter Bar */}
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
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              {["All", "Pending", "Approved", "Rejected"].map((status) => (
                <Button
                  key={status}
                  size="small"
                  variant={filter === status ? "contained" : "outlined"}
                  onClick={() => setFilter(status)}
                  sx={{
                    borderRadius: "6px",
                    px: 2,
                    fontSize: "0.8rem",
                    ...(filter !== status && {
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
              placeholder="Search by student or course..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "text.secondary", fontSize: 18 }} />
                  </InputAdornment>
                ),
              }}
              sx={{ width: { xs: "100%", sm: 300 } }}
            />
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ width: 60 }}>#</TableCell>
                  <TableCell>Student Candidate</TableCell>
                  <TableCell>Requested Course</TableCell>
                  <TableCell>Application Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="center" sx={{ width: 220 }}>
                    Decision Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton width={20} /></TableCell>
                      <TableCell><Skeleton width={160} /></TableCell>
                      <TableCell><Skeleton width={180} /></TableCell>
                      <TableCell><Skeleton width={100} /></TableCell>
                      <TableCell><Skeleton width={80} /></TableCell>
                      <TableCell align="center"><Skeleton width={120} sx={{ mx: "auto" }} /></TableCell>
                    </TableRow>
                  ))
                ) : filteredEnrollments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} sx={{ textAlign: "center", py: 6 }}>
                      <Typography variant="body1" sx={{ color: "text.secondary", fontWeight: 500 }}>
                        No enrollment requests matching this criteria.
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredEnrollments.map((item, index) => {
                    const isProcessing = processingId === item._id;

                    return (
                      <TableRow key={item._id} hover>
                        <TableCell sx={{ color: "text.secondary", fontSize: "0.8rem" }}>
                          {index + 1}
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                            <Avatar
                              sx={{
                                width: 34,
                                height: 34,
                                bgcolor: "#6366f1",
                                fontSize: "0.85rem",
                                fontWeight: 700,
                              }}
                            >
                              {(item.student?.name || "S").charAt(0).toUpperCase()}
                            </Avatar>
                            <Box>
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                {item.student?.name || "Student"}
                              </Typography>
                              <Typography variant="caption" sx={{ color: "text.secondary" }}>
                                {item.student?.email || "—"}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell sx={{ fontWeight: 600, color: "text.primary" }}>
                          {item.course?.title || "Course Track"}
                        </TableCell>
                        <TableCell sx={{ color: "text.secondary" }}>
                          {item.createdAt
                            ? new Date(item.createdAt).toLocaleDateString(undefined, {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })
                            : "Recently"}
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={item.status} />
                        </TableCell>
                        <TableCell align="center">
                          {isProcessing ? (
                            <CircularProgress size={20} />
                          ) : item.status === "Pending" ? (
                            <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
                              <Button
                                size="small"
                                variant="contained"
                                color="success"
                                startIcon={<CheckCircleIcon />}
                                onClick={() => handleStatusChange(item._id, "approve")}
                                sx={{ fontSize: "0.75rem", py: 0.5, px: 1.5 }}
                              >
                                Approve
                              </Button>
                              <Button
                                size="small"
                                variant="outlined"
                                color="error"
                                startIcon={<CancelIcon />}
                                onClick={() => handleStatusChange(item._id, "reject")}
                                sx={{ fontSize: "0.75rem", py: 0.5, px: 1.5 }}
                              >
                                Reject
                              </Button>
                            </Box>
                          ) : (
                            <Typography variant="caption" sx={{ color: "text.secondary" }}>
                              Decision Completed
                            </Typography>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </GlassCard>
      </Box>
    </Layout>
  );
}
