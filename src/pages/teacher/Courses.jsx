import React, { useEffect, useState, useMemo } from "react";
import {
  Box,
  Typography,
  Grid,
  Button,
  Chip,
  CardMedia,
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
  FormControlLabel,
  Switch,
  Alert,
  Skeleton,
  Stack,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  CircularProgress,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PeopleIcon from "@mui/icons-material/People";
import SchoolIcon from "@mui/icons-material/School";
import RefreshIcon from "@mui/icons-material/Refresh";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";

import Layout from "../../components/layout/Layout";
import GlassCard from "../../components/common/GlassCard";
import StatusBadge from "../../components/common/StatusBadge";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import api from "../../servises/api";

const CATEGORIES = [
  "Computer Science",
  "Full-Stack Web Development",
  "AI & Data Science",
  "Mobile App Development",
  "Mathematics & Statistics",
  "Science & Physics",
  "Business & Languages",
];

const initialFormData = {
  title: "",
  description: "",
  category: "Computer Science",
  price: "",
  thumbnail: "",
  isPublished: false,
};

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [search, setSearch] = useState("");

  // Dialog State
  const [openDialog, setOpenDialog] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState(initialFormData);

  // Delete State
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Students Dialog State
  const [studentsDialog, setStudentsDialog] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [students, setStudents] = useState([]);
  const [studentsLoading, setStudentsLoading] = useState(false);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await api.get("/teacher/courses");
      setCourses(Array.isArray(response.data?.courses) ? response.data.courses : []);
    } catch (err) {
      console.error("Fetch courses error:", err);
      setError(err.response?.data?.message || "Failed to load courses.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleOpenAddDialog = () => {
    setError("");
    setSuccess("");
    setEditingCourse(null);
    setFormData(initialFormData);
    setOpenDialog(true);
  };

  const handleOpenEditDialog = (course) => {
    setError("");
    setSuccess("");
    setEditingCourse(course);
    setFormData({
      title: course.title || "",
      description: course.description || "",
      category: course.category || "Computer Science",
      price: course.price ?? "",
      thumbnail: course.thumbnail || "",
      isPublished: Boolean(course.isPublished),
    });
    setOpenDialog(true);
  };

  const handleSaveCourse = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category.trim(),
        price: Number(formData.price) || 0,
        thumbnail: formData.thumbnail.trim(),
        isPublished: formData.isPublished,
      };

      if (editingCourse) {
        await api.put(`/teacher/update/${editingCourse._id}`, payload);
        setSuccess("Course updated successfully.");
      } else {
        await api.post("/teacher/course", payload);
        setSuccess("Course created successfully.");
      }

      setOpenDialog(false);
      fetchCourses();
    } catch (err) {
      console.error("Save course error:", err);
      setError(err.response?.data?.message || "Failed to save course.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      await api.delete(`/teacher/delete/${deleteTarget._id}`);
      setSuccess("Course deleted successfully.");
      setDeleteTarget(null);
      fetchCourses();
    } catch (err) {
      console.error("Delete error:", err);
      setError(err.response?.data?.message || "Failed to delete course.");
    } finally {
      setDeleting(false);
    }
  };

  const handleViewStudents = async (course) => {
    setSelectedCourse(course);
    setStudents([]);
    setStudentsDialog(true);
    try {
      setStudentsLoading(true);
      const response = await api.get(`/teacher/course/${course._id}/student`);
      setStudents(response.data?.students || []);
    } catch (err) {
      console.error("Students fetch error:", err);
    } finally {
      setStudentsLoading(false);
    }
  };

  const filteredCourses = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return courses;
    return courses.filter(
      (c) =>
        c.title?.toLowerCase().includes(q) ||
        c.category?.toLowerCase().includes(q) ||
        c.description?.toLowerCase().includes(q)
    );
  }, [courses, search]);

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
                My Teaching Tracks
              </Typography>
              <Chip
                label={`${courses.length} Active Tracks`}
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
              Publish, configure, and manage syllabi and student enrollments for your courses.
            </Typography>
          </Box>

          <Box sx={{ display: "flex", gap: 1.5 }}>
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
              onClick={handleOpenAddDialog}
            >
              Create Course
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
              placeholder="Search your courses..."
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
              Showing {filteredCourses.length} of {courses.length} courses
            </Typography>
          </Box>
        </GlassCard>

        {/* Courses Grid */}
        {loading ? (
          <Grid container spacing={3}>
            {Array.from({ length: 3 }).map((_, i) => (
              <Grid item xs={12} sm={6} md={4} key={i}>
                <GlassCard sx={{ p: 2.5 }}>
                  <Skeleton variant="rectangular" height={150} sx={{ borderRadius: "8px", mb: 2 }} />
                  <Skeleton width="80%" height={26} />
                  <Skeleton width="40%" height={18} sx={{ mb: 2 }} />
                  <Skeleton height={40} />
                </GlassCard>
              </Grid>
            ))}
          </Grid>
        ) : filteredCourses.length === 0 ? (
          <GlassCard
            sx={{
              textAlign: "center",
              py: 8,
              px: 3,
              border: "1px dashed rgba(255, 255, 255, 0.15)",
            }}
          >
            <SchoolIcon sx={{ fontSize: 50, color: "text.secondary", mb: 1.5 }} />
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              No courses created yet
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5, mb: 3 }}>
              Start by publishing your first academic curriculum track.
            </Typography>
            <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenAddDialog}>
              Create Course
            </Button>
          </GlassCard>
        ) : (
          <Grid container spacing={3}>
            {filteredCourses.map((course) => (
              <Grid item xs={12} sm={6} md={4} key={course._id}>
                <GlassCard
                  hover
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <Box>
                    {course.thumbnail ? (
                      <CardMedia
                        component="img"
                        height="160"
                        image={course.thumbnail}
                        alt={course.title}
                        sx={{ objectFit: "cover" }}
                      />
                    ) : (
                      <Box
                        sx={{
                          height: 140,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          bgcolor: "rgba(99, 102, 241, 0.08)",
                          color: "#6366f1",
                        }}
                      >
                        <SchoolIcon sx={{ fontSize: 50 }} />
                      </Box>
                    )}

                    <Box sx={{ p: 2.5 }}>
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1.5 }}>
                        <Chip
                          label={course.category || "Curriculum Track"}
                          size="small"
                          sx={{
                            bgcolor: "rgba(99, 102, 241, 0.08)",
                            color: "#818cf8",
                            fontWeight: 700,
                            fontSize: "0.72rem",
                            border: "1px solid rgba(99, 102, 241, 0.2)",
                          }}
                        />
                        <StatusBadge
                          status={course.isPublished ? "active" : "pending"}
                          label={course.isPublished ? "PUBLISHED" : "DRAFT"}
                        />
                      </Box>

                      <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.3, mb: 1 }}>
                        {course.title}
                      </Typography>

                      <Typography
                        variant="body2"
                        sx={{
                          color: "text.secondary",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          mb: 2,
                        }}
                      >
                        {course.description || "Course syllabus, assignments, and quizzes."}
                      </Typography>

                      <Typography variant="caption" sx={{ fontWeight: 800, color: "#10b981", fontSize: "0.85rem" }}>
                        Rs. {Number(course.price || 0).toLocaleString()}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ p: 2.5, pt: 0, display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid rgba(255, 255, 255, 0.06)", mt: 1 }}>
                    <Button
                      size="small"
                      startIcon={<PeopleIcon />}
                      onClick={() => handleViewStudents(course)}
                      sx={{ fontSize: "0.78rem" }}
                    >
                      Enrolled Students
                    </Button>

                    <Box sx={{ display: "flex", gap: 0.5 }}>
                      <Tooltip title="Edit Course">
                        <IconButton
                          size="small"
                          onClick={() => handleOpenEditDialog(course)}
                          sx={{ color: "#818cf8" }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Course">
                        <IconButton
                          size="small"
                          onClick={() => setDeleteTarget(course)}
                          sx={{ color: "#ef4444" }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                </GlassCard>
              </Grid>
            ))}
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
            {editingCourse ? "Edit Course Syllabus" : "Create New Course Track"}
          </DialogTitle>
          <Box component="form" onSubmit={handleSaveCourse}>
            <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2.5, pt: 1 }}>
              <TextField
                label="Course Title"
                required
                fullWidth
                size="small"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />

              <FormControl fullWidth size="small" required>
                <InputLabel id="category-modal-label">Category</InputLabel>
                <Select
                  labelId="category-modal-label"
                  label="Category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  {CATEGORIES.map((cat) => (
                    <MenuItem key={cat} value={cat}>
                      {cat}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                label="Tuition / Course Fee (PKR)"
                type="number"
                required
                fullWidth
                size="small"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              />

              <TextField
                label="Thumbnail Image URL"
                fullWidth
                size="small"
                value={formData.thumbnail}
                onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
              />

              <TextField
                label="Syllabus Description"
                multiline
                minRows={3}
                required
                fullWidth
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isPublished}
                    onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                    color="primary"
                  />
                }
                label="Publish to Student Catalog immediately"
              />
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2.5 }}>
              <Button onClick={() => setOpenDialog(false)} disabled={saving} variant="outlined" size="small">
                Cancel
              </Button>
              <Button type="submit" variant="contained" disabled={saving} size="small">
                {saving ? "Saving..." : editingCourse ? "Update Course" : "Create Course"}
              </Button>
            </DialogActions>
          </Box>
        </Dialog>

        {/* Enrolled Students Modal */}
        <Dialog
          open={studentsDialog}
          onClose={() => setStudentsDialog(false)}
          maxWidth="xs"
          fullWidth
        >
          <DialogTitle sx={{ fontWeight: 800, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span>Enrolled Students</span>
            <IconButton size="small" onClick={() => setStudentsDialog(false)}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </DialogTitle>
          <DialogContent sx={{ p: 2 }}>
            <Typography variant="caption" sx={{ color: "text.secondary", display: "block", mb: 2 }}>
              Active students enrolled in: <strong>{selectedCourse?.title}</strong>
            </Typography>

            {studentsLoading ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                <CircularProgress size={28} />
              </Box>
            ) : students.length === 0 ? (
              <Typography variant="body2" sx={{ color: "text.secondary", textAlign: "center", py: 4 }}>
                No active students enrolled in this course yet.
              </Typography>
            ) : (
              <List disablePadding>
                {students.map((student, idx) => (
                  <ListItem key={student._id || idx} sx={{ px: 1, py: 1 }}>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: "#6366f1", width: 32, height: 32, fontSize: "0.8rem" }}>
                        {(student.name || "S").charAt(0).toUpperCase()}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={student.name || "Student"}
                      secondary={student.email || student.phone || "Enrolled"}
                      primaryTypographyProps={{ fontSize: "0.85rem", fontWeight: 600 }}
                      secondaryTypographyProps={{ fontSize: "0.75rem" }}
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </DialogContent>
        </Dialog>

        {/* Delete Confirm */}
        <ConfirmDialog
          open={Boolean(deleteTarget)}
          title="Delete Course Track"
          message={`Are you sure you want to delete "${deleteTarget?.title}"? All student enrollment data and coursework tasks associated with it will be removed.`}
          confirmText="Delete Course"
          loading={deleting}
          onConfirm={handleDeleteConfirm}
          onClose={() => setDeleteTarget(null)}
        />
      </Box>
    </Layout>
  );
}
