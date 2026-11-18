import React, { useEffect, useState, useMemo } from "react";
import {
  Box,
  Typography,
  Grid,
  Button,
  Chip,
  IconButton,
  Tooltip,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Skeleton,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AssignmentIcon from "@mui/icons-material/Assignment";
import RefreshIcon from "@mui/icons-material/Refresh";
import SearchIcon from "@mui/icons-material/Search";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

import Layout from "../../components/layout/Layout";
import GlassCard from "../../components/common/GlassCard";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import api from "../../servises/api";

export default function TeacherAssignments() {
  const [assignments, setAssignments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [search, setSearch] = useState("");

  // Modal
  const [openDialog, setOpenDialog] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    course: "",
    dueDate: "",
  });

  // Delete
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      setError("");

      const coursesResponse = await api.get("/teacher/courses");
      const courseData = coursesResponse.data?.courses || coursesResponse.data?.data || [];
      const validCourses = Array.isArray(courseData) ? courseData : [];
      setCourses(validCourses);

      let allAssignments = [];
      for (const course of validCourses) {
        try {
          const res = await api.get(`/getAllAssignment/${course._id}`);
          const data = res.data?.assignments || res.data?.data || [];
          if (Array.isArray(data)) {
            allAssignments = [...allAssignments, ...data];
          }
        } catch {
          // ignore single course failure
        }
      }

      const unique = Array.from(
        new Map(allAssignments.map((a) => [a._id, a])).values()
      );
      setAssignments(unique);
    } catch (err) {
      console.error("Assignment fetch error:", err);
      setError(err.response?.data?.message || "Failed to load coursework assignments.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  const handleOpenAdd = () => {
    setEditingAssignment(null);
    setFormData({
      title: "",
      description: "",
      course: courses[0]?._id || "",
      dueDate: "",
    });
    setError("");
    setSuccess("");
    setOpenDialog(true);
  };

  const handleOpenEdit = (assignment) => {
    setEditingAssignment(assignment);
    const courseId =
      typeof assignment.course === "object" ? assignment.course?._id : assignment.course;

    setFormData({
      title: assignment.title || "",
      description: assignment.description || "",
      course: courseId || "",
      dueDate: assignment.dueDate ? new Date(assignment.dueDate).toISOString().split("T")[0] : "",
    });
    setError("");
    setSuccess("");
    setOpenDialog(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      if (editingAssignment) {
        await api.put(`/teacher/updateAssignment/${editingAssignment._id}`, formData);
        setSuccess("Assignment updated successfully.");
      } else {
        await api.post("/teacher/createAssignment", formData);
        setSuccess("Assignment published to course students.");
      }

      setOpenDialog(false);
      fetchAssignments();
    } catch (err) {
      console.error("Save assignment error:", err);
      setError(err.response?.data?.message || "Failed to save assignment.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      await api.delete(`/teacher/deleteAssignment/${deleteTarget._id}`);
      setSuccess("Assignment deleted successfully.");
      setDeleteTarget(null);
      fetchAssignments();
    } catch (err) {
      console.error("Delete assignment error:", err);
      setError(err.response?.data?.message || "Failed to delete assignment.");
    } finally {
      setDeleting(false);
    }
  };

  const filteredAssignments = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return assignments;
    return assignments.filter(
      (a) =>
        a.title?.toLowerCase().includes(q) ||
        a.description?.toLowerCase().includes(q) ||
        a.course?.title?.toLowerCase().includes(q)
    );
  }, [assignments, search]);

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
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Typography variant="h4" sx={{ fontWeight: 800 }}>
                Coursework & Homework
              </Typography>
              <Chip
                label={`${assignments.length} Total Assignments`}
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
              Create homework assignments, set submission deadlines, and evaluate student work.
            </Typography>
          </Box>

          <Box sx={{ display: "flex", gap: 1.5 }}>
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

            <Button
              variant="contained"
              size="small"
              startIcon={<AddIcon />}
              onClick={handleOpenAdd}
              disabled={courses.length === 0}
            >
              Create Assignment
            </Button>
          </Box>
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

        {/* Toolbar */}
        <GlassCard sx={{ p: 2.5 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
            <TextField
              size="small"
              placeholder="Search assignments by title or course..."
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

            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              Showing {filteredAssignments.length} of {assignments.length} assignments
            </Typography>
          </Box>
        </GlassCard>

        {/* List */}
        {loading ? (
          <Grid container spacing={3}>
            {Array.from({ length: 3 }).map((_, i) => (
              <Grid item xs={12} sm={6} md={4} key={i}>
                <GlassCard sx={{ p: 3 }}>
                  <Skeleton width="50%" height={26} sx={{ mb: 1 }} />
                  <Skeleton width="30%" height={18} sx={{ mb: 2 }} />
                  <Skeleton height={60} />
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
              No assignments published yet
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5, mb: 3 }}>
              Select a course and dispatch your first assignment to students.
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleOpenAdd}
              disabled={courses.length === 0}
            >
              Create Assignment
            </Button>
          </GlassCard>
        ) : (
          <Grid container spacing={3}>
            {filteredAssignments.map((assignment) => {
              const isOverdue =
                assignment.dueDate && new Date(assignment.dueDate) < new Date();

              return (
                <Grid item xs={12} sm={6} md={4} key={assignment._id}>
                  <GlassCard
                    hover
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      p: 3,
                    }}
                  >
                    <Box>
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1.5 }}>
                        <Chip
                          label={assignment.course?.title || "Course Track"}
                          size="small"
                          sx={{
                            bgcolor: "rgba(99, 102, 241, 0.08)",
                            color: "#818cf8",
                            fontWeight: 700,
                            fontSize: "0.72rem",
                            border: "1px solid rgba(99, 102, 241, 0.2)",
                          }}
                        />

                        <Box sx={{ display: "flex", gap: 0.5 }}>
                          <Tooltip title="Edit Assignment">
                            <IconButton
                              size="small"
                              onClick={() => handleOpenEdit(assignment)}
                              sx={{ color: "#818cf8" }}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete Assignment">
                            <IconButton
                              size="small"
                              onClick={() => setDeleteTarget(assignment)}
                              sx={{ color: "#ef4444" }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </Box>

                      <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.3, mb: 1 }}>
                        {assignment.title}
                      </Typography>

                      <Typography
                        variant="body2"
                        sx={{
                          color: "text.secondary",
                          display: "-webkit-box",
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          mb: 2,
                        }}
                      >
                        {assignment.description || "Student assignment guidelines."}
                      </Typography>
                    </Box>

                    <Box sx={{ pt: 2, borderTop: "1px solid rgba(255, 255, 255, 0.06)", display: "flex", alignItems: "center", gap: 1 }}>
                      <CalendarMonthIcon sx={{ fontSize: 16, color: isOverdue ? "#ef4444" : "text.secondary" }} />
                      <Typography
                        variant="caption"
                        sx={{
                          color: isOverdue ? "#ef4444" : "text.secondary",
                          fontWeight: isOverdue ? 700 : 500,
                        }}
                      >
                        Due:{" "}
                        {assignment.dueDate
                          ? new Date(assignment.dueDate).toLocaleDateString(undefined, {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })
                          : "No deadline"}
                      </Typography>
                    </Box>
                  </GlassCard>
                </Grid>
              );
            })}
          </Grid>
        )}

        {/* Add/Edit Modal */}
        <Dialog
          open={openDialog}
          onClose={() => !saving && setOpenDialog(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle sx={{ fontWeight: 800 }}>
            {editingAssignment ? "Edit Assignment" : "Create New Coursework"}
          </DialogTitle>
          <Box component="form" onSubmit={handleSave}>
            <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2.5, pt: 1 }}>
              <TextField
                label="Assignment Title"
                required
                fullWidth
                size="small"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />

              <FormControl fullWidth size="small" required>
                <InputLabel id="course-select-label">Target Course</InputLabel>
                <Select
                  labelId="course-select-label"
                  label="Target Course"
                  value={formData.course}
                  onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                >
                  {courses.map((c) => (
                    <MenuItem key={c._id} value={c._id}>
                      {c.title}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                label="Submission Deadline"
                type="date"
                required
                fullWidth
                size="small"
                InputLabelProps={{ shrink: true }}
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              />

              <TextField
                label="Task Instructions & Guidelines"
                multiline
                minRows={4}
                required
                fullWidth
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2.5 }}>
              <Button onClick={() => setOpenDialog(false)} disabled={saving} variant="outlined" size="small">
                Cancel
              </Button>
              <Button type="submit" variant="contained" disabled={saving} size="small">
                {saving ? "Saving..." : editingAssignment ? "Update Assignment" : "Publish Assignment"}
              </Button>
            </DialogActions>
          </Box>
        </Dialog>

        {/* Delete Confirm */}
        <ConfirmDialog
          open={Boolean(deleteTarget)}
          title="Delete Coursework Assignment"
          message={`Are you sure you want to delete "${deleteTarget?.title}"? All student solutions delivered for this assignment will also be removed.`}
          confirmText="Delete Assignment"
          loading={deleting}
          onConfirm={handleDeleteConfirm}
          onClose={() => setDeleteTarget(null)}
        />
      </Box>
    </Layout>
  );
}
