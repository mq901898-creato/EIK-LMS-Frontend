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
  IconButton,
  Button,
  Chip,
  TextField,
  InputAdornment,
  Skeleton,
  Alert,
  Tooltip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useNavigate } from "react-router-dom";

import Layout from "../../components/layout/Layout";
import GlassCard from "../../components/common/GlassCard";
import StatusBadge from "../../components/common/StatusBadge";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import api from "../../servises/api";

function AdminCourses() {
  const [courses, setCourses] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const navigate = useNavigate();

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await api.get("/admin/getAllCourses");
      setCourses(Array.isArray(response.data?.courses) ? response.data.courses : []);
    } catch (err) {
      console.error("Error fetching courses:", err);
      setError(err.response?.data?.message || "Failed to load courses directory.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      setDeleteLoading(true);
      await api.delete(`/admin/deleteCourse/${deleteTarget._id}`);
      setSuccessMsg(`Course "${deleteTarget.title}" deleted successfully.`);
      setDeleteTarget(null);
      fetchCourses();
    } catch (err) {
      console.error("Error deleting course:", err);
      setError(err.response?.data?.message || "Failed to delete course.");
    } finally {
      setDeleteLoading(false);
    }
  };

  const filteredCourses = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return courses;
    return courses.filter(
      (c) =>
        c.title?.toLowerCase().includes(query) ||
        c.category?.toLowerCase().includes(query) ||
        c.teacher?.name?.toLowerCase().includes(query)
    );
  }, [courses, searchQuery]);

  return (
    <Layout>
      <Box sx={{ width: "100%", display: "flex", flexDirection: "column", gap: 3 }}>
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
                Course Administration
              </Typography>
              <Chip
                label={`${courses.length} Curriculum Tracks`}
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
              Publish, configure, and monitor instructional courses and syllabi.
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flexWrap: "wrap" }}>
            <Tooltip title="Refresh">
              <IconButton
                onClick={fetchCourses}
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

            <Button
              variant="contained"
              size="small"
              startIcon={<AddIcon />}
              onClick={() => navigate("/admin/courses/add")}
            >
              Add Course
            </Button>
          </Box>
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

        {/* Courses Table Card */}
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
              placeholder="Search courses by title, category, or instructor..."
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
              Showing {filteredCourses.length} of {courses.length} courses
            </Typography>
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ width: 60 }}>#</TableCell>
                  <TableCell>Course Title</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Assigned Faculty</TableCell>
                  <TableCell>Tuition / Fee</TableCell>
                  <TableCell>Status</TableCell>
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
                      <TableCell><Skeleton width={100} /></TableCell>
                      <TableCell><Skeleton width={120} /></TableCell>
                      <TableCell><Skeleton width={80} /></TableCell>
                      <TableCell><Skeleton width={80} /></TableCell>
                      <TableCell align="center"><Skeleton width={60} sx={{ mx: "auto" }} /></TableCell>
                    </TableRow>
                  ))
                ) : filteredCourses.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} sx={{ textAlign: "center", py: 6 }}>
                      <Typography variant="body1" sx={{ color: "text.secondary", fontWeight: 500 }}>
                        {searchQuery ? "No matching courses found." : "No courses published yet."}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCourses.map((course, index) => (
                    <TableRow key={course._id} hover>
                      <TableCell sx={{ color: "text.secondary", fontSize: "0.8rem" }}>
                        {index + 1}
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600, color: "text.primary" }}>
                        {course.title}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={course.category || "General"}
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
                        {course.teacher?.name || "Unassigned"}
                      </TableCell>
                      <TableCell sx={{ fontWeight: 700, color: "text.primary" }}>
                        Rs. {Number(course.price || 0).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <StatusBadge
                          status={course.isPublished ? "active" : "pending"}
                          label={course.isPublished ? "PUBLISHED" : "DRAFT"}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: "flex", justifyContent: "center", gap: 0.5 }}>
                          <Tooltip title="Edit Course">
                            <IconButton
                              size="small"
                              onClick={() => navigate(`/admin/courses/edit/${course._id}`)}
                              sx={{
                                color: "#818cf8",
                                "&:hover": { bgcolor: "rgba(99, 102, 241, 0.12)" },
                              }}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete Course">
                            <IconButton
                              size="small"
                              onClick={() => setDeleteTarget(course)}
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
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </GlassCard>

        {/* Delete Confirmation Modal */}
        <ConfirmDialog
          open={Boolean(deleteTarget)}
          title="Delete Course Track"
          message={`Are you sure you want to delete "${deleteTarget?.title}"? All student enrollments and assignments under this course will be affected.`}
          confirmText="Delete Course"
          loading={deleteLoading}
          onConfirm={handleDeleteConfirm}
          onClose={() => setDeleteTarget(null)}
        />
      </Box>
    </Layout>
  );
}

export default AdminCourses;

