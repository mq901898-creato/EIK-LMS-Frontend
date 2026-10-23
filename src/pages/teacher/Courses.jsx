import { useEffect, useState } from "react";

import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControlLabel,
  Switch,
  IconButton,
  Tooltip,
  Divider,
  Stack,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PeopleIcon from "@mui/icons-material/People";
import SchoolIcon from "@mui/icons-material/School";
import RefreshIcon from "@mui/icons-material/Refresh";

import Layout from "../../components/layout/Layout";
import api from "../../servises/api";

const initialFormData = {
  title: "",
  description: "",
  category: "",
  price: "",
  thumbnail: "",
  isPublished: false,
};

function Courses() {
  // =====================================================
  // COURSES
  // =====================================================

  const [courses, setCourses] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  // =====================================================
  // ADD / EDIT DIALOG
  // =====================================================

  const [openDialog, setOpenDialog] = useState(false);

  const [editingCourse, setEditingCourse] = useState(null);

  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState(initialFormData);

  const [formErrors, setFormErrors] = useState({});

  // =====================================================
  // DELETE
  // =====================================================

  const [deleteDialog, setDeleteDialog] = useState(false);

  const [courseToDelete, setCourseToDelete] = useState(null);

  const [deleting, setDeleting] = useState(false);

  // =====================================================
  // ENROLLED STUDENTS
  // =====================================================

  const [studentsDialog, setStudentsDialog] = useState(false);

  const [selectedCourse, setSelectedCourse] = useState(null);

  const [students, setStudents] = useState([]);

  const [studentsLoading, setStudentsLoading] = useState(false);

  const [studentsError, setStudentsError] = useState("");

  // =====================================================
  // FETCH COURSES
  // =====================================================

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError("");

      // Backend:
      // GET /api/teacher/courses
      const response = await api.get("/teacher/courses");

      setCourses(response.data?.courses || []);
    } catch (error) {
      console.error("Fetch courses error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load courses. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // =====================================================
  // CLEAR MESSAGES
  // =====================================================

  const clearMessages = () => {
    setError("");
    setSuccess("");
  };

  // =====================================================
  // OPEN ADD DIALOG
  // =====================================================

  const handleOpenAddDialog = () => {
    clearMessages();

    setEditingCourse(null);

    setFormData({
      ...initialFormData,
    });

    setFormErrors({});

    setOpenDialog(true);
  };

  // =====================================================
  // OPEN EDIT DIALOG
  // =====================================================

  const handleOpenEditDialog = (course) => {
    clearMessages();

    setEditingCourse(course);

    setFormData({
      title: course.title || "",
      description: course.description || "",
      category: course.category || "",
      price:
        course.price !== undefined && course.price !== null
          ? String(course.price)
          : "",
      thumbnail: course.thumbnail || "",
      isPublished: Boolean(course.isPublished),
    });

    setFormErrors({});

    setOpenDialog(true);
  };

  // =====================================================
  // CLOSE ADD / EDIT DIALOG
  // =====================================================

  const handleCloseDialog = () => {
    if (saving) return;

    setOpenDialog(false);
    setEditingCourse(null);
    setFormErrors({});
  };

  // =====================================================
  // FORM CHANGE
  // =====================================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Remove individual error
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // =====================================================
  // PUBLISH SWITCH
  // =====================================================

  const handlePublishedChange = (event) => {
    setFormData((prev) => ({
      ...prev,
      isPublished: event.target.checked,
    }));
  };

  // =====================================================
  // FORM VALIDATION
  // =====================================================

  const validateForm = () => {
    const errors = {};

    const title = formData.title.trim();
    const description = formData.description.trim();
    const category = formData.category.trim();
    const price = formData.price;

    if (!title) {
      errors.title = "Course title is required";
    } else if (title.length < 3) {
      errors.title = "Course title must be at least 3 characters";
    }

    if (!description) {
      errors.description = "Course description is required";
    } else if (description.length < 10) {
      errors.description =
        "Description must be at least 10 characters";
    }

    if (!category) {
      errors.category = "Category is required";
    }

    if (price === "") {
      errors.price = "Price is required";
    } else if (Number.isNaN(Number(price))) {
      errors.price = "Price must be a valid number";
    } else if (Number(price) < 0) {
      errors.price = "Price cannot be negative";
    }

    if (formData.thumbnail.trim()) {
      try {
        new URL(formData.thumbnail.trim());
      } catch {
        errors.thumbnail = "Please enter a valid image URL";
      }
    }

    setFormErrors(errors);

    return Object.keys(errors).length === 0;
  };

  // =====================================================
  // CREATE / UPDATE COURSE
  // =====================================================

  const handleSaveCourse = async () => {
    clearMessages();

    const isValid = validateForm();

    if (!isValid) {
      return;
    }

    try {
      setSaving(true);

      const courseData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category.trim(),
        price: Number(formData.price),
        thumbnail: formData.thumbnail.trim(),
        isPublished: formData.isPublished,
      };

      let response;

      // =================================================
      // UPDATE
      // =================================================

      if (editingCourse) {
        // Backend:
        // PUT /api/teacher/update/:id

        response = await api.put(
          `/teacher/update/${editingCourse._id}`,
          courseData
        );

        setSuccess("Course updated successfully.");
      }

      // =================================================
      // CREATE
      // =================================================

      else {
        // Backend:
        // POST /api/teacher/course

        response = await api.post(
          "/teacher/course",
          courseData
        );

        setSuccess("Course created successfully.");
      }

      console.log("Course response:", response.data);

      setOpenDialog(false);

      setEditingCourse(null);

      setFormData({
        ...initialFormData,
      });

      setFormErrors({});

      await fetchCourses();
    } catch (error) {
      console.error("Save course error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to save course. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // OPEN DELETE CONFIRMATION
  // =====================================================

  const handleOpenDeleteDialog = (course) => {
    clearMessages();

    setCourseToDelete(course);

    setDeleteDialog(true);
  };

  // =====================================================
  // CLOSE DELETE DIALOG
  // =====================================================

  const handleCloseDeleteDialog = () => {
    if (deleting) return;

    setDeleteDialog(false);

    setCourseToDelete(null);
  };

  // =====================================================
  // DELETE COURSE
  // =====================================================

  const handleDeleteCourse = async () => {
    if (!courseToDelete) return;

    try {
      setDeleting(true);

      clearMessages();

      // Backend:
      // DELETE /api/teacher/delete/:id

      const response = await api.delete(
        `/teacher/delete/${courseToDelete._id}`
      );

      console.log("Delete response:", response.data);

      setSuccess("Course deleted successfully.");

      setDeleteDialog(false);

      setCourseToDelete(null);

      await fetchCourses();
    } catch (error) {
      console.error("Delete course error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to delete course. Please try again."
      );
    } finally {
      setDeleting(false);
    }
  };

  // =====================================================
  // GET ENROLLED STUDENTS
  // =====================================================

  const handleViewStudents = async (course) => {
    clearMessages();

    setSelectedCourse(course);

    setStudents([]);

    setStudentsError("");

    setStudentsDialog(true);

    try {
      setStudentsLoading(true);

      // Backend:
      // GET /api/teacher/course/:courseId/student

      const response = await api.get(
        `/teacher/course/${course._id}/student`
      );

      setStudents(response.data?.students || []);
    } catch (error) {
      console.error("Fetch students error:", error);

      setStudentsError(
        error.response?.data?.message ||
          "Failed to load enrolled students."
      );
    } finally {
      setStudentsLoading(false);
    }
  };

  // =====================================================
  // CLOSE STUDENTS DIALOG
  // =====================================================

  const handleCloseStudentsDialog = () => {
    if (studentsLoading) return;

    setStudentsDialog(false);

    setSelectedCourse(null);

    setStudents([]);

    setStudentsError("");
  };

  // =====================================================
  // FORMAT PRICE
  // =====================================================

  const formatPrice = (price) => {
    const numericPrice = Number(price);

    if (numericPrice === 0) {
      return "Free";
    }

    return `Rs:${numericPrice.toFixed(2)}`;
  };

  // =====================================================
  // IMAGE ERROR HANDLER
  // =====================================================

  const handleImageError = (event) => {
    event.currentTarget.style.display = "none";
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <Layout>
      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: {
            xs: "flex-start",
            sm: "center",
          },
          flexDirection: {
            xs: "column",
            sm: "row",
          },
          gap: 2,
          mb: 3,
        }}
      >
        <Box>
          <Typography color="text.secondary">
            Create, manage and monitor your courses
          </Typography>
        </Box>

        <Stack direction="row" spacing={1}>
          <Tooltip title="Refresh courses">
            <IconButton
              onClick={fetchCourses}
              disabled={loading}
              sx={{
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <RefreshIcon />
            </IconButton>
          </Tooltip>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenAddDialog}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontWeight: "bold",
              px: 3,
            }}
          >
            Add Course
          </Button>
        </Stack>
      </Box>

      {/* ================================================= */}
      {/* SUCCESS */}
      {/* ================================================= */}

      {success && (
        <Alert
          severity="success"
          sx={{ mb: 3 }}
          onClose={() => setSuccess("")}
        >
          {success}
        </Alert>
      )}

      {/* ================================================= */}
      {/* ERROR */}
      {/* ================================================= */}

      {error && (
        <Alert
          severity="error"
          sx={{ mb: 3 }}
          onClose={() => setError("")}
        >
          {error}
        </Alert>
      )}

      {/* ================================================= */}
      {/* COURSE COUNT */}
      {/* ================================================= */}

      {!loading && (
        <Box sx={{ mb: 3 }}>
          <Chip
            icon={<SchoolIcon />}
            label={`${courses.length} ${
              courses.length === 1 ? "Course" : "Courses"
            }`}
            variant="outlined"
          />
        </Box>
      )}

      {/* ================================================= */}
      {/* LOADING */}
      {/* ================================================= */}

      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            py: 10,
          }}
        >
          <CircularProgress />
        </Box>
      ) : courses.length === 0 ? (
        /* ================================================= */
        /* NO COURSES */
        /* ================================================= */

        <Card
          sx={{
            borderRadius: 3,
            boxShadow: 2,
          }}
        >
          <CardContent
            sx={{
              textAlign: "center",
              py: 8,
            }}
          >
            <SchoolIcon
              sx={{
                fontSize: 60,
                color: "text.secondary",
                mb: 2,
              }}
            />

            <Typography
              variant="h5"
              fontWeight="bold"
            >
              No Courses Found
            </Typography>

            <Typography
              color="text.secondary"
              sx={{
                mt: 1,
                mb: 3,
              }}
            >
              You have not created any courses yet.
            </Typography>

            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleOpenAddDialog}
              sx={{
                textTransform: "none",
                borderRadius: 2,
              }}
            >
              Create Your First Course
            </Button>
          </CardContent>
        </Card>
      ) : (
        /* ================================================= */
        /* COURSES GRID */
        /* ================================================= */

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              lg: "repeat(3, 1fr)",
            },
            gap: 3,
          }}
        >
          {courses.map((course) => (
            <Card
              key={course._id}
              sx={{
                borderRadius: 3,
                boxShadow: 3,
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                transition: "0.25s",

                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: 6,
                },
              }}
            >
              {/* ========================================= */}
              {/* THUMBNAIL */}
              {/* ========================================= */}

              {course.thumbnail ? (
                <Box
                  component="img"
                  src={course.thumbnail}
                  alt={course.title}
                  onError={handleImageError}
                  sx={{
                    width: "100%",
                    height: 190,
                    objectFit: "cover",
                  }}
                />
              ) : (
                <Box
                  sx={{
                    height: 190,
                    bgcolor: "#e3f2fd",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <SchoolIcon
                    sx={{
                      fontSize: 60,
                      color: "#90caf9",
                    }}
                  />
                </Box>
              )}

              <CardContent
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  flexGrow: 1,
                }}
              >
                {/* ======================================= */}
                {/* TITLE */}
                {/* ======================================= */}

                <Typography
                  variant="h6"
                  fontWeight="bold"
                  sx={{
                    mb: 1,
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {course.title}
                </Typography>

                {/* ======================================= */}
                {/* CATEGORY + STATUS */}
                {/* ======================================= */}

                <Box
                  sx={{
                    display: "flex",
                    gap: 1,
                    flexWrap: "wrap",
                    mb: 2,
                  }}
                >
                  {course.category && (
                    <Chip
                      label={course.category}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  )}

                  <Chip
                    label={
                      course.isPublished
                        ? "Published"
                        : "Draft"
                    }
                    color={
                      course.isPublished
                        ? "success"
                        : "default"
                    }
                    size="small"
                  />
                </Box>

                {/* ======================================= */}
                {/* DESCRIPTION */}
                {/* ======================================= */}

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    mb: 2,
                    display: "-webkit-box",
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {course.description}
                </Typography>

                {/* ======================================= */}
                {/* PRICE */}
                {/* ======================================= */}

                <Typography
                  variant="h6"
                  fontWeight="bold"
                  sx={{ mb: 2 }}
                >
                  {formatPrice(course.price)}
                </Typography>

                <Divider sx={{ mb: 2 }} />

                {/* ======================================= */}
                {/* ACTIONS */}
                {/* ======================================= */}

                <Box
                  sx={{
                    display: "flex",
                    gap: 1,
                    mt: "auto",
                  }}
                >
                  <Tooltip title="View enrolled students">
                    <Button
                      variant="outlined"
                      startIcon={<PeopleIcon />}
                      onClick={() =>
                        handleViewStudents(course)
                      }
                      sx={{
                        flex: 1,
                        textTransform: "none",
                      }}
                    >
                      Students
                    </Button>
                  </Tooltip>

                  <Tooltip title="Edit course">
                    <IconButton
                      color="primary"
                      onClick={() =>
                        handleOpenEditDialog(course)
                      }
                      sx={{
                        border: "1px solid",
                        borderColor: "primary.main",
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Delete course">
                    <IconButton
                      color="error"
                      onClick={() =>
                        handleOpenDeleteDialog(course)
                      }
                      sx={{
                        border: "1px solid",
                        borderColor: "error.main",
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      {/* ================================================= */}
      {/* ADD / EDIT COURSE DIALOG */}
      {/* ================================================= */}

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle
          sx={{
            fontWeight: "bold",
          }}
        >
          {editingCourse
            ? "Edit Course"
            : "Add New Course"}
        </DialogTitle>

        <DialogContent>
          <TextField
            fullWidth
            label="Course Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            margin="normal"
            required
            error={Boolean(formErrors.title)}
            helperText={formErrors.title}
            disabled={saving}
          />

          <TextField
            fullWidth
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            margin="normal"
            multiline
            rows={4}
            required
            error={Boolean(formErrors.description)}
            helperText={formErrors.description}
            disabled={saving}
          />

          <TextField
            fullWidth
            label="Category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            margin="normal"
            placeholder="e.g. Programming"
            required
            error={Boolean(formErrors.category)}
            helperText={formErrors.category}
            disabled={saving}
          />

          <TextField
            fullWidth
            label="Price"
            name="price"
            type="number"
            value={formData.price}
            onChange={handleChange}
            margin="normal"
            required
            inputProps={{
              min: 0,
              step: "0.01",
            }}
            error={Boolean(formErrors.price)}
            helperText={
              formErrors.price ||
              "Enter 0 if the course is free."
            }
            disabled={saving}
          />

          <TextField
            fullWidth
            label="Thumbnail URL"
            name="thumbnail"
            value={formData.thumbnail}
            onChange={handleChange}
            margin="normal"
            placeholder="https://example.com/image.jpg"
            error={Boolean(formErrors.thumbnail)}
            helperText={formErrors.thumbnail}
            disabled={saving}
          />

          <FormControlLabel
            sx={{ mt: 1 }}
            control={
              <Switch
                checked={formData.isPublished}
                onChange={handlePublishedChange}
                disabled={saving}
              />
            }
            label={
              formData.isPublished
                ? "Course will be published"
                : "Course will remain a draft"
            }
          />
        </DialogContent>

        <DialogActions
          sx={{
            px: 3,
            pb: 2,
          }}
        >
          <Button
            onClick={handleCloseDialog}
            disabled={saving}
            sx={{
              textTransform: "none",
            }}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={handleSaveCourse}
            disabled={saving}
            sx={{
              textTransform: "none",
              minWidth: 140,
            }}
          >
            {saving ? (
              <CircularProgress
                size={22}
                color="inherit"
              />
            ) : editingCourse ? (
              "Update Course"
            ) : (
              "Create Course"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ================================================= */}
      {/* DELETE CONFIRMATION DIALOG */}
      {/* ================================================= */}

      <Dialog
        open={deleteDialog}
        onClose={handleCloseDeleteDialog}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle fontWeight="bold">
          Delete Course?
        </DialogTitle>

        <DialogContent>
          <Typography>
            Are you sure you want to delete{" "}
            <strong>
              {courseToDelete?.title}
            </strong>
            ?
          </Typography>

          <Typography
            color="text.secondary"
            variant="body2"
            sx={{ mt: 1 }}
          >
            This action cannot be undone.
          </Typography>
        </DialogContent>

        <DialogActions
          sx={{
            px: 3,
            pb: 2,
          }}
        >
          <Button
            onClick={handleCloseDeleteDialog}
            disabled={deleting}
            sx={{
              textTransform: "none",
            }}
          >
            Cancel
          </Button>

          <Button
            color="error"
            variant="contained"
            onClick={handleDeleteCourse}
            disabled={deleting}
            sx={{
              textTransform: "none",
            }}
          >
            {deleting ? (
              <CircularProgress
                size={22}
                color="inherit"
              />
            ) : (
              "Delete Course"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ================================================= */}
      {/* ENROLLED STUDENTS DIALOG */}
      {/* ================================================= */}

      <Dialog
        open={studentsDialog}
        onClose={handleCloseStudentsDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle
          sx={{
            fontWeight: "bold",
          }}
        >
          Enrolled Students
        </DialogTitle>

        <DialogContent>
          {selectedCourse && (
            <Box sx={{ mb: 2 }}>
              <Typography
                variant="h6"
                fontWeight="bold"
              >
                {selectedCourse.title}
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
              >
                Students enrolled in this course
              </Typography>
            </Box>
          )}

          <Divider />

          {/* ============================================= */}
          {/* STUDENT LOADING */}
          {/* ============================================= */}

          {studentsLoading ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                py: 6,
              }}
            >
              <CircularProgress />
            </Box>
          ) : studentsError ? (
            <Alert
              severity="error"
              sx={{ mt: 2 }}
            >
              {studentsError}
            </Alert>
          ) : students.length === 0 ? (
            <Box
              sx={{
                textAlign: "center",
                py: 6,
              }}
            >
              <PeopleIcon
                sx={{
                  fontSize: 50,
                  color: "text.secondary",
                  mb: 1,
                }}
              />

              <Typography
                fontWeight="bold"
              >
                No Students Enrolled
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
              >
                No students have enrolled in this course yet.
              </Typography>
            </Box>
          ) : (
            <>
              <Chip
                label={`${students.length} ${
                  students.length === 1
                    ? "Student"
                    : "Students"
                }`}
                color="primary"
                size="small"
                sx={{ mt: 2, mb: 1 }}
              />

              <List>
                {students.map((student) => (
                  <ListItem
                    key={student._id}
                    divider
                  >
                    <ListItemAvatar>
                      <Avatar>
                        {student.name
                          ?.charAt(0)
                          ?.toUpperCase() || "S"}
                      </Avatar>
                    </ListItemAvatar>

                    <ListItemText
                      primary={
                        student.name || "Unknown Student"
                      }
                      secondary={
                        student.email || "No email"
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </>
          )}
        </DialogContent>

        <DialogActions
          sx={{
            px: 3,
            pb: 2,
          }}
        >
          <Button
            onClick={handleCloseStudentsDialog}
            disabled={studentsLoading}
            sx={{
              textTransform: "none",
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
}

export default Courses;