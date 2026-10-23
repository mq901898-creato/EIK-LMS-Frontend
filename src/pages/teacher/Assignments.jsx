import { useEffect, useState } from "react";

import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Chip,
  IconButton,
  Tooltip,
  Divider,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AssignmentIcon from "@mui/icons-material/Assignment";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import CloseIcon from "@mui/icons-material/Close";

import Layout from "../../components/layout/Layout";
import api from "../../servises/api";

function Assignment() {
  // =====================================================
  // STATE
  // =====================================================

  const [assignments, setAssignments] = useState([]);
  const [courses, setCourses] = useState([]);

  const [loading, setLoading] = useState(true);
  const [coursesLoading, setCoursesLoading] = useState(true);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Dialog
  const [openDialog, setOpenDialog] = useState(false);

  // Edit mode
  const [editingAssignment, setEditingAssignment] = useState(null);

  // Create/update loading
  const [saving, setSaving] = useState(false);

  // Delete loading
  const [deletingId, setDeletingId] = useState(null);

  // =====================================================
  // FORM
  // =====================================================

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    course: "",
    dueDate: "",
  });

  // =====================================================
  // FETCH COURSES
  // =====================================================

  const fetchCourses = async () => {
    try {
      setCoursesLoading(true);

      const response = await api.get("/teacher/courses");

      const courseData =
        response.data?.courses ||
        response.data?.data ||
        [];

      setCourses(Array.isArray(courseData) ? courseData : []);
    } catch (error) {
      console.error("Courses error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load courses"
      );
    } finally {
      setCoursesLoading(false);
    }
  };

  // =====================================================
  // FETCH ASSIGNMENTS
  // =====================================================

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      setError("");

      /*
       * Your backend requires:
       * GET /getAllAssignment/:id
       *
       * Therefore we fetch assignments course-by-course.
       */

      const coursesResponse = await api.get("/teacher/courses");

      const courseData =
        coursesResponse.data?.courses ||
        coursesResponse.data?.data ||
        [];

      const validCourses = Array.isArray(courseData)
        ? courseData
        : [];

      setCourses(validCourses);

      let allAssignments = [];

      for (const course of validCourses) {
        try {
          const response = await api.get(
            `/getAllAssignment/${course._id}`
          );

          const assignmentData =
            response.data?.assignments ||
            response.data?.data ||
            [];

          if (Array.isArray(assignmentData)) {
            allAssignments = [
              ...allAssignments,
              ...assignmentData,
            ];
          }
        } catch (courseError) {
          console.error(
            `Failed to load assignments for course ${course._id}`,
            courseError
          );
        }
      }

      /*
       * Prevent duplicate assignments
       */
      const uniqueAssignments = Array.from(
        new Map(
          allAssignments.map((assignment) => [
            assignment._id,
            assignment,
          ])
        ).values()
      );

      setAssignments(uniqueAssignments);
    } catch (error) {
      console.error("Assignment error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load assignments"
      );
    } finally {
      setLoading(false);
      setCoursesLoading(false);
    }
  };

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    fetchAssignments();
  }, []);

  // =====================================================
  // OPEN CREATE DIALOG
  // =====================================================

  const handleOpenCreate = () => {
    setEditingAssignment(null);

    setFormData({
      title: "",
      description: "",
      course: "",
      dueDate: "",
    });

    setError("");
    setSuccess("");

    setOpenDialog(true);
  };

  // =====================================================
  // OPEN EDIT DIALOG
  // =====================================================

  const handleOpenEdit = (assignment) => {
    setEditingAssignment(assignment);

    /*
     * Course can sometimes be populated as an object
     * and sometimes be just an ID.
     */

    const courseId =
      typeof assignment.course === "object"
        ? assignment.course?._id
        : assignment.course;

    let formattedDate = "";

    if (assignment.dueDate) {
      const date = new Date(assignment.dueDate);

      if (!isNaN(date.getTime())) {
        formattedDate = date.toISOString().slice(0, 16);
      }
    }

    setFormData({
      title: assignment.title || "",
      description: assignment.description || "",
      course: courseId || "",
      dueDate: formattedDate,
    });

    setError("");
    setSuccess("");

    setOpenDialog(true);
  };

  // =====================================================
  // CLOSE DIALOG
  // =====================================================

  const handleCloseDialog = () => {
    if (saving) return;

    setOpenDialog(false);
    setEditingAssignment(null);

    setFormData({
      title: "",
      description: "",
      course: "",
      dueDate: "",
    });
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
  };

  // =====================================================
  // VALIDATION
  // =====================================================

  const validateForm = () => {
    if (!formData.title.trim()) {
      setError("Assignment title is required.");
      return false;
    }

    if (!formData.description.trim()) {
      setError("Assignment description is required.");
      return false;
    }

    if (!formData.course) {
      setError("Please select a course.");
      return false;
    }

    if (!formData.dueDate) {
      setError("Due date is required.");
      return false;
    }

    return true;
  };

  // =====================================================
  // CREATE / UPDATE
  // =====================================================

  const handleSaveAssignment = async () => {
    if (!validateForm()) return;

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const assignmentData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        course: formData.course,
        dueDate: new Date(formData.dueDate).toISOString(),
      };

      // UPDATE
      if (editingAssignment) {
        const response = await api.put(
          `/updateAssignment/${editingAssignment._id}`,
          assignmentData
        );

        console.log(
          "Assignment updated:",
          response.data
        );

        setSuccess("Assignment updated successfully.");
      }

      // CREATE
      else {
        const response = await api.post(
          "/createAssignment",
          assignmentData
        );

        console.log(
          "Assignment created:",
          response.data
        );

        setSuccess("Assignment created successfully.");
      }

      handleCloseDialog();

      await fetchAssignments();
    } catch (error) {
      console.error(
        "Save assignment error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to save assignment."
      );
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // DELETE ASSIGNMENT
  // =====================================================

  const handleDelete = async (assignmentId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this assignment?"
    );

    if (!confirmed) return;

    try {
      setDeletingId(assignmentId);
      setError("");
      setSuccess("");

      const response = await api.delete(
        `/deleteAssignment/${assignmentId}`
      );

      console.log(
        "Assignment deleted:",
        response.data
      );

      setAssignments((prev) =>
        prev.filter(
          (assignment) =>
            assignment._id !== assignmentId
        )
      );

      setSuccess(
        "Assignment deleted successfully."
      );
    } catch (error) {
      console.error(
        "Delete assignment error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to delete assignment."
      );
    } finally {
      setDeletingId(null);
    }
  };

  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (date) => {
    if (!date) return "No due date";

    const formatted = new Date(date);

    if (isNaN(formatted.getTime())) {
      return "Invalid date";
    }

    return formatted.toLocaleDateString(
      "en-US",
      {
        year: "numeric",
        month: "short",
        day: "numeric",
      }
    );
  };

  // =====================================================
  // CHECK OVERDUE
  // =====================================================

  const isOverdue = (date) => {
    if (!date) return false;

    return new Date(date) < new Date();
  };

  // =====================================================
  // GET COURSE NAME
  // =====================================================

  const getCourseName = (course) => {
    if (!course) return "Unknown Course";

    if (typeof course === "object") {
      return course.title || "Unknown Course";
    }

    const foundCourse = courses.find(
      (item) => item._id === course
    );

    return foundCourse?.title || "Unknown Course";
  };

  // =====================================================
  // UI
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
          mb: 4,
        }}
      >
        <Box>
          <Typography
            color="text.secondary"
            sx={{ mt: 0.5 }}
          >
            Create and manage assignments for your
            courses
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenCreate}
          sx={{
            borderRadius: 2,
            textTransform: "none",
            fontWeight: "bold",
            px: 3,
            py: 1.2,
          }}
        >
          Create Assignment
        </Button>
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
      {/* STATISTICS */}
      {/* ================================================= */}

      {!loading && (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(3, 1fr)",
            },
            gap: 2,
            mb: 4,
          }}
        >
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: 2,
            }}
          >
            <CardContent>
              <Typography
                color="text.secondary"
                variant="body2"
              >
                Total Assignments
              </Typography>

              <Typography
                variant="h4"
                fontWeight="bold"
                sx={{ mt: 1 }}
              >
                {assignments.length}
              </Typography>
            </CardContent>
          </Card>

          <Card
            sx={{
              borderRadius: 3,
              boxShadow: 2,
            }}
          >
            <CardContent>
              <Typography
                color="text.secondary"
                variant="body2"
              >
                Active Assignments
              </Typography>

              <Typography
                variant="h4"
                fontWeight="bold"
                sx={{ mt: 1 }}
              >
                {
                  assignments.filter(
                    (item) =>
                      !isOverdue(item.dueDate)
                  ).length
                }
              </Typography>
            </CardContent>
          </Card>

          <Card
            sx={{
              borderRadius: 3,
              boxShadow: 2,
            }}
          >
            <CardContent>
              <Typography
                color="text.secondary"
                variant="body2"
              >
                Overdue
              </Typography>

              <Typography
                variant="h4"
                fontWeight="bold"
                sx={{ mt: 1 }}
              >
                {
                  assignments.filter((item) =>
                    isOverdue(item.dueDate)
                  ).length
                }
              </Typography>
            </CardContent>
          </Card>
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
            py: 10,
          }}
        >
          <CircularProgress />
        </Box>
      ) : assignments.length === 0 ? (

        /* ================================================= */
        /* EMPTY STATE */
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
            <AssignmentIcon
              sx={{
                fontSize: 70,
                color: "text.secondary",
                mb: 2,
              }}
            />

            <Typography
              variant="h5"
              fontWeight="bold"
            >
              No Assignments Yet
            </Typography>

            <Typography
              color="text.secondary"
              sx={{
                mt: 1,
                mb: 3,
              }}
            >
              Create your first assignment for
              your students.
            </Typography>

            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleOpenCreate}
              sx={{
                textTransform: "none",
                borderRadius: 2,
              }}
            >
              Create Assignment
            </Button>
          </CardContent>
        </Card>

      ) : (

        /* ================================================= */
        /* ASSIGNMENT CARDS */
        /* ================================================= */

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "1fr 1fr",
              lg: "repeat(3, 1fr)",
            },
            gap: 3,
          }}
        >
          {assignments.map((assignment) => {
            const overdue = isOverdue(
              assignment.dueDate
            );

            return (
              <Card
                key={assignment._id}
                sx={{
                  borderRadius: 3,
                  boxShadow: 2,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  transition: "0.2s",

                  "&:hover": {
                    transform: "translateY(-3px)",
                    boxShadow: 5,
                  },
                }}
              >
                <CardContent
                  sx={{
                    flexGrow: 1,
                    p: 3,
                  }}
                >
                  {/* TOP */}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent:
                        "space-between",
                      alignItems: "flex-start",
                      mb: 2,
                    }}
                  >
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: 2,
                        bgcolor: "primary.main",
                        color: "white",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <AssignmentIcon />
                    </Box>

                    <Box>
                      <Tooltip title="Edit">
                        <IconButton
                          color="primary"
                          onClick={() =>
                            handleOpenEdit(
                              assignment
                            )
                          }
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Delete">
                        <IconButton
                          color="error"
                          disabled={
                            deletingId ===
                            assignment._id
                          }
                          onClick={() =>
                            handleDelete(
                              assignment._id
                            )
                          }
                        >
                          {deletingId ===
                          assignment._id ? (
                            <CircularProgress
                              size={20}
                            />
                          ) : (
                            <DeleteIcon />
                          )}
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>

                  {/* TITLE */}

                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    sx={{
                      mb: 1,
                      display:
                        "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient:
                        "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {assignment.title}
                  </Typography>

                  {/* DESCRIPTION */}

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mb: 2,
                      minHeight: 42,
                      display:
                        "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient:
                        "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {assignment.description}
                  </Typography>

                  <Divider sx={{ mb: 2 }} />

                  {/* COURSE */}

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 1.5,
                    }}
                  >
                    <MenuBookIcon
                      fontSize="small"
                      color="primary"
                    />

                    <Typography
                      variant="body2"
                      fontWeight="medium"
                    >
                      {getCourseName(
                        assignment.course
                      )}
                    </Typography>
                  </Box>

                  {/* DUE DATE */}

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <CalendarMonthIcon
                      fontSize="small"
                      color={
                        overdue
                          ? "error"
                          : "primary"
                      }
                    />

                    <Typography
                      variant="body2"
                      color={
                        overdue
                          ? "error.main"
                          : "text.secondary"
                      }
                    >
                      Due:{" "}
                      {formatDate(
                        assignment.dueDate
                      )}
                    </Typography>
                  </Box>

                  {/* STATUS */}

                  <Box sx={{ mt: 2 }}>
                    <Chip
                      size="small"
                      label={
                        overdue
                          ? "Overdue"
                          : "Active"
                      }
                      color={
                        overdue
                          ? "error"
                          : "success"
                      }
                    />
                  </Box>
                </CardContent>
              </Card>
            );
          })}
        </Box>
      )}

      {/* ================================================= */}
      {/* CREATE / EDIT DIALOG */}
      {/* ================================================= */}

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="sm"
      >
        {/* DIALOG TITLE */}

        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontWeight: "bold",
          }}
        >
          {editingAssignment
            ? "Edit Assignment"
            : "Create New Assignment"}

          <IconButton
            onClick={handleCloseDialog}
            disabled={saving}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>

          {/* TITLE */}

          <TextField
            fullWidth
            label="Assignment Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            margin="normal"
            required
            placeholder="e.g. JavaScript Final Project"
          />

          {/* DESCRIPTION */}

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
            placeholder="Write assignment instructions..."
          />

          {/* COURSE */}

          <TextField
            select
            fullWidth
            label="Select Course"
            name="course"
            value={formData.course}
            onChange={handleChange}
            margin="normal"
            required
            disabled={coursesLoading}
          >
            {courses.length === 0 ? (
              <MenuItem disabled>
                No courses available
              </MenuItem>
            ) : (
              courses.map((course) => (
                <MenuItem
                  key={course._id}
                  value={course._id}
                >
                  {course.title}
                </MenuItem>
              ))
            )}
          </TextField>

          {/* DUE DATE */}

          <TextField
            fullWidth
            label="Due Date"
            name="dueDate"
            type="datetime-local"
            value={formData.dueDate}
            onChange={handleChange}
            margin="normal"
            required
            InputLabelProps={{
              shrink: true,
            }}
          />
        </DialogContent>

        {/* ACTIONS */}

        <DialogActions
          sx={{
            px: 3,
            py: 2,
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
            onClick={handleSaveAssignment}
            disabled={
              saving ||
              !formData.title.trim() ||
              !formData.description.trim() ||
              !formData.course ||
              !formData.dueDate
            }
            sx={{
              minWidth: 150,
              textTransform: "none",
              fontWeight: "bold",
            }}
          >
            {saving ? (
              <>
                <CircularProgress
                  size={20}
                  color="inherit"
                  sx={{ mr: 1 }}
                />

                Saving...
              </>
            ) : editingAssignment ? (
              "Update Assignment"
            ) : (
              "Create Assignment"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
}

export default Assignment;