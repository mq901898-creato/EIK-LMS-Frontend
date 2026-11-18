import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  TextField,
  InputAdornment,
  Chip,
  Skeleton,
  Alert,
  Tooltip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";

import Layout from "../../components/layout/Layout";
import GlassCard from "../../components/common/GlassCard";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import api from "../../servises/api";

function AdminAssignments() {
  const [assignments, setAssignments] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const navigate = useNavigate();

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await api.get("/admin/getAllAssignments");
      setAssignments(Array.isArray(response.data?.assignments) ? response.data.assignments : []);
    } catch (err) {
      console.error("Error fetching assignments:", err);
      setError(err.response?.data?.message || "Failed to load assignments directory.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      setDeleteLoading(true);
      await api.delete(`/admin/assighmentdelete/${deleteTarget._id}`);
      setSuccessMsg(`Assignment "${deleteTarget.title}" deleted successfully.`);
      setDeleteTarget(null);
      fetchAssignments();
    } catch (err) {
      console.error("Error deleting assignment:", err);
      setError(err.response?.data?.message || "Failed to delete assignment.");
    } finally {
      setDeleteLoading(false);
    }
  };

  const filteredAssignments = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return assignments;
    return assignments.filter(
      (a) =>
        a.title?.toLowerCase().includes(query) ||
        a.course?.title?.toLowerCase().includes(query) ||
        a.teacher?.name?.toLowerCase().includes(query)
    );
  }, [assignments, searchQuery]);

  return (
    <Layout>
      <Box sx={{ width: "100%", display: "flex", flexDirection: "column", gap: 3 }}>
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
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Typography variant="h4" sx={{ fontWeight: 800 }}>
                Assignments Management
              </Typography>
              <Chip
                label={`${assignments.length} Total`}
                size="small"
                sx={{
                  bgcolor: "rgba(99, 102, 241, 0.12)",
                  color: "#818cf8",
                  fontWeight: 700,
                  fontSize: "0.72rem",
                }}
              />
            </Box>
            <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>
              Review assigned coursework, submission deadlines, and student workloads.
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
        {error && (
          <Alert severity="error" onClose={() => setError("")}>
            {error}
          </Alert>
        )}
        {successMsg && (
          <Alert severity="success" onClose={() => setSuccessMsg("")}>
            {successMsg}
          </Alert>
        )}

        {/* Assignments Table Card */}
        <GlassCard sx={{ p: 0, overflow: "hidden" }}>
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
            <TextField
              size="small"
              placeholder="Search assignments by title, course, or teacher..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "text.secondary", fontSize: 18 }} />
                  </InputAdornment>
                ),
              }}
              sx={{ width: { xs: "100%", sm: 380 } }}
            />

            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              Showing {filteredAssignments.length} of {assignments.length} assignments
            </Typography>
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ width: 60 }}>#</TableCell>
                  <TableCell>Assignment Title</TableCell>
                  <TableCell>Course</TableCell>
                  <TableCell>Faculty Instructor</TableCell>
                  <TableCell>Due Date</TableCell>
                  <TableCell align="center" sx={{ width: 120 }}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton width={20} /></TableCell>
                      <TableCell><Skeleton width={180} /></TableCell>
                      <TableCell><Skeleton width={140} /></TableCell>
                      <TableCell><Skeleton width={120} /></TableCell>
                      <TableCell><Skeleton width={100} /></TableCell>
                      <TableCell align="center"><Skeleton width={60} sx={{ mx: "auto" }} /></TableCell>
                    </TableRow>
                  ))
                ) : filteredAssignments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} sx={{ textAlign: "center", py: 6 }}>
                      <Typography variant="body1" sx={{ color: "text.secondary", fontWeight: 500 }}>
                        {searchQuery ? "No matching assignments found." : "No assignments created yet."}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAssignments.map((assignment, index) => {
                    const isOverdue =
                      assignment.dueDate && new Date(assignment.dueDate) < new Date();

                    return (
                      <TableRow key={assignment._id} hover>
                        <TableCell sx={{ color: "text.secondary", fontSize: "0.8rem" }}>
                          {index + 1}
                        </TableCell>
                        <TableCell sx={{ fontWeight: 600, color: "text.primary" }}>
                          {assignment.title}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={assignment.course?.title || "General"}
                            size="small"
                            sx={{
                              bgcolor: "rgba(99, 102, 241, 0.08)",
                              color: "#818cf8",
                              border: "1px solid rgba(99, 102, 241, 0.2)",
                              fontWeight: 600,
                              fontSize: "0.72rem",
                            }}
                          />
                        </TableCell>
                        <TableCell sx={{ color: "text.secondary" }}>
                          {assignment.teacher?.name || "Unassigned"}
                        </TableCell>
                        <TableCell>
                          <Typography
                            variant="body2"
                            sx={{
                              color: isOverdue ? "#ef4444" : "text.secondary",
                              fontWeight: isOverdue ? 600 : 400,
                            }}
                          >
                            {assignment.dueDate
                              ? new Date(assignment.dueDate).toLocaleDateString(undefined, {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })
                              : "No deadline"}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Box sx={{ display: "flex", justifyContent: "center", gap: 0.5 }}>
                            <Tooltip title="Edit Assignment">
                              <IconButton
                                size="small"
                                onClick={() =>
                                  navigate(`/admin/assignments/edit/${assignment._id}`)
                                }
                                sx={{
                                  color: "#818cf8",
                                  "&:hover": { bgcolor: "rgba(99, 102, 241, 0.12)" },
                                }}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete Assignment">
                              <IconButton
                                size="small"
                                onClick={() => setDeleteTarget(assignment)}
                                sx={{
                                  color: "#ef4444",
                                  "&:hover": { bgcolor: "rgba(239, 68, 68, 0.12)" },
                                }}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </GlassCard>

        {/* Delete Confirmation Modal */}
        <ConfirmDialog
          open={Boolean(deleteTarget)}
          title="Delete Assignment"
          message={`Are you sure you want to delete "${deleteTarget?.title}"? All submitted student work for this assignment will also be removed.`}
          confirmText="Delete Assignment"
          loading={deleteLoading}
          onConfirm={handleDeleteConfirm}
          onClose={() => setDeleteTarget(null)}
        />
      </Box>
    </Layout>
  );
}

export default AdminAssignments;
