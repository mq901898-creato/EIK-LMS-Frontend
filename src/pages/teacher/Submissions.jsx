import { useEffect, useMemo, useState } from "react";

import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
  Button,
  TextField,
  InputAdornment,
  Chip,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  MenuItem,
  Paper,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import VisibilityIcon from "@mui/icons-material/Visibility";
import GradeIcon from "@mui/icons-material/Grade";
import RefreshIcon from "@mui/icons-material/Refresh";
import AssignmentIcon from "@mui/icons-material/Assignment";
import PersonIcon from "@mui/icons-material/Person";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PendingIcon from "@mui/icons-material/Pending";

import Layout from "../../components/layout/Layout";
import api from "../../servises/api";

function Submission() {
  // =====================================================
  // STATE
  // =====================================================

  const [submissions, setSubmissions] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Search
  const [search, setSearch] = useState("");

  // Filter
  const [statusFilter, setStatusFilter] = useState("all");

  // View dialog
  const [openViewDialog, setOpenViewDialog] = useState(false);

  // Grade dialog
  const [openGradeDialog, setOpenGradeDialog] = useState(false);

  // Selected submission
  const [selectedSubmission, setSelectedSubmission] =
    useState(null);

  // Grade form
  const [gradeData, setGradeData] = useState({
    marks: "",
    feedback: "",
  });

  // =====================================================
  // FETCH SUBMISSIONS
  // =====================================================

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        "/teacher/submissions"
      );

      console.log(
        "Teacher submissions:",
        response.data
      );

      const data =
        response.data?.submissions ||
        response.data?.data ||
        [];

      setSubmissions(
        Array.isArray(data) ? data : []
      );
    } catch (error) {
      console.error(
        "Fetch submissions error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to load submissions"
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    fetchSubmissions();
  }, []);

  // =====================================================
  // OPEN VIEW DIALOG
  // =====================================================

  const handleView = (submission) => {
    setSelectedSubmission(submission);
    setOpenViewDialog(true);
  };

  // =====================================================
  // CLOSE VIEW DIALOG
  // =====================================================

  const handleCloseView = () => {
    setOpenViewDialog(false);
    setSelectedSubmission(null);
  };

  // =====================================================
  // OPEN GRADE DIALOG
  // =====================================================

  const handleOpenGrade = (submission) => {
    setSelectedSubmission(submission);

    setGradeData({
      marks:
        submission.marks !== undefined &&
        submission.marks !== null
          ? submission.marks
          : "",
      feedback: submission.feedback || "",
    });

    setError("");
    setSuccess("");

    setOpenGradeDialog(true);
  };

  // =====================================================
  // CLOSE GRADE DIALOG
  // =====================================================

  const handleCloseGrade = () => {
    if (saving) return;

    setOpenGradeDialog(false);
    setSelectedSubmission(null);

    setGradeData({
      marks: "",
      feedback: "",
    });
  };

  // =====================================================
  // GRADE FORM CHANGE
  // =====================================================

  const handleGradeChange = (event) => {
    const { name, value } = event.target;

    setGradeData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =====================================================
  // SUBMIT GRADE
  // =====================================================

  const handleSubmitGrade = async () => {
    if (!selectedSubmission) return;

    if (
      gradeData.marks === "" ||
      gradeData.marks === null
    ) {
      setError("Please enter marks.");
      return;
    }

    const marks = Number(gradeData.marks);

    if (isNaN(marks)) {
      setError("Marks must be a valid number.");
      return;
    }

    if (marks < 0) {
      setError("Marks cannot be negative.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

const response = await api.post(
  `/reviewed/${selectedSubmission._id}`,
        {
          marks,
          feedback: gradeData.feedback.trim(),
          status: "reviewed",
        }
      );

      console.log(
        "Grade response:",
        response.data
      );

      setSuccess(
        "Submission reviewed successfully."
      );

      handleCloseGrade();

      await fetchSubmissions();
    } catch (error) {
      console.error(
        "Grade submission error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to review submission"
      );
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (date) => {
    if (!date) return "N/A";

    const formattedDate = new Date(date);

    if (isNaN(formattedDate.getTime())) {
      return "Invalid date";
    }

    return formattedDate.toLocaleDateString(
      "en-US",
      {
        year: "numeric",
        month: "short",
        day: "numeric",
      }
    );
  };

  // =====================================================
  // FORMAT DATE + TIME
  // =====================================================

  const formatDateTime = (date) => {
    if (!date) return "N/A";

    const formattedDate = new Date(date);

    if (isNaN(formattedDate.getTime())) {
      return "Invalid date";
    }

    return formattedDate.toLocaleString(
      "en-US",
      {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      }
    );
  };

  // =====================================================
  // GET STUDENT NAME
  // =====================================================

  const getStudentName = (submission) => {
    const student =
      submission.student ||
      submission.user ||
      submission.studentId;

    if (!student) {
      return "Unknown Student";
    }

    if (typeof student === "string") {
      return student;
    }

    return (
      student.name ||
      student.fullName ||
      student.username ||
      student.email ||
      "Unknown Student"
    );
  };

  // =====================================================
  // GET STUDENT EMAIL
  // =====================================================

  const getStudentEmail = (submission) => {
    const student =
      submission.student ||
      submission.user ||
      submission.studentId;

    if (!student || typeof student === "string") {
      return "";
    }

    return student.email || "";
  };

  // =====================================================
  // GET ASSIGNMENT TITLE
  // =====================================================

  const getAssignmentTitle = (submission) => {
    const assignment =
      submission.assignment ||
      submission.assignmentId;

    if (!assignment) {
      return "Unknown Assignment";
    }

    if (typeof assignment === "string") {
      return assignment;
    }

    return (
      assignment.title ||
      "Unknown Assignment"
    );
  };

  // =====================================================
  // GET COURSE TITLE
  // =====================================================

  const getCourseTitle = (submission) => {
    const course =
      submission.course ||
      submission.assignment?.course;

    if (!course) {
      return "Unknown Course";
    }

    if (typeof course === "string") {
      return course;
    }

    return course.title || "Unknown Course";
  };

  // =====================================================
  // GET STATUS
  // =====================================================

  const getStatus = (submission) => {
    if (
      submission.status === "reviewed" ||
      submission.status === "graded" ||
      submission.marks !== undefined &&
        submission.marks !== null
    ) {
      return "reviewed";
    }

    return "pending";
  };

  // =====================================================
  // FILTER SUBMISSIONS
  // =====================================================

  const filteredSubmissions = useMemo(() => {
    return submissions.filter((submission) => {
      const studentName =
        getStudentName(submission).toLowerCase();

      const assignmentName =
        getAssignmentTitle(
          submission
        ).toLowerCase();

      const courseName =
        getCourseTitle(
          submission
        ).toLowerCase();

      const searchValue =
        search.toLowerCase().trim();

      const matchesSearch =
        !searchValue ||
        studentName.includes(searchValue) ||
        assignmentName.includes(searchValue) ||
        courseName.includes(searchValue);

      const status = getStatus(submission);

      const matchesStatus =
        statusFilter === "all" ||
        status === statusFilter;

      return (
        matchesSearch &&
        matchesStatus
      );
    });
  }, [
    submissions,
    search,
    statusFilter,
  ]);

  // =====================================================
  // STATISTICS
  // =====================================================

  const totalSubmissions =
    submissions.length;

  const pendingSubmissions =
    submissions.filter(
      (submission) =>
        getStatus(submission) === "pending"
    ).length;

  const reviewedSubmissions =
    submissions.filter(
      (submission) =>
        getStatus(submission) === "reviewed"
    ).length;

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
            md: "center",
          },
          flexDirection: {
            xs: "column",
            md: "row",
          },
          gap: 2,
          mb: 4,
        }}
      >
        <Box>
          <Typography
            variant="h4"
            fontWeight="bold"
            sx={{
              fontSize: {
                xs: "1.8rem",
                md: "2.2rem",
              },
            }}
          >
            Student Submissions
          </Typography>

          <Typography
            color="text.secondary"
            sx={{ mt: 0.5 }}
          >
            Review and grade assignments submitted
            by your students
          </Typography>
        </Box>

        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={fetchSubmissions}
          disabled={loading}
          sx={{
            textTransform: "none",
            borderRadius: 2,
            fontWeight: "bold",
          }}
        >
          Refresh
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

        {/* TOTAL */}

        <Card
          sx={{
            borderRadius: 3,
            boxShadow: 2,
          }}
        >
          <CardContent>
            <Box
              sx={{
                display: "flex",
                justifyContent:
                  "space-between",
                alignItems: "center",
              }}
            >
              <Box>
                <Typography
                  color="text.secondary"
                  variant="body2"
                >
                  Total Submissions
                </Typography>

                <Typography
                  variant="h4"
                  fontWeight="bold"
                  sx={{ mt: 1 }}
                >
                  {loading ? (
                    <CircularProgress
                      size={28}
                    />
                  ) : (
                    totalSubmissions
                  )}
                </Typography>
              </Box>

              <AssignmentIcon
                sx={{
                  fontSize: 42,
                  color: "primary.main",
                }}
              />
            </Box>
          </CardContent>
        </Card>

        {/* PENDING */}

        <Card
          sx={{
            borderRadius: 3,
            boxShadow: 2,
          }}
        >
          <CardContent>
            <Box
              sx={{
                display: "flex",
                justifyContent:
                  "space-between",
                alignItems: "center",
              }}
            >
              <Box>
                <Typography
                  color="text.secondary"
                  variant="body2"
                >
                  Pending Review
                </Typography>

                <Typography
                  variant="h4"
                  fontWeight="bold"
                  sx={{ mt: 1 }}
                >
                  {loading ? (
                    <CircularProgress
                      size={28}
                    />
                  ) : (
                    pendingSubmissions
                  )}
                </Typography>
              </Box>

              <PendingIcon
                sx={{
                  fontSize: 42,
                  color: "warning.main",
                }}
              />
            </Box>
          </CardContent>
        </Card>

        {/* REVIEWED */}

        <Card
          sx={{
            borderRadius: 3,
            boxShadow: 2,
          }}
        >
          <CardContent>
            <Box
              sx={{
                display: "flex",
                justifyContent:
                  "space-between",
                alignItems: "center",
              }}
            >
              <Box>
                <Typography
                  color="text.secondary"
                  variant="body2"
                >
                  Reviewed
                </Typography>

                <Typography
                  variant="h4"
                  fontWeight="bold"
                  sx={{ mt: 1 }}
                >
                  {loading ? (
                    <CircularProgress
                      size={28}
                    />
                  ) : (
                    reviewedSubmissions
                  )}
                </Typography>
              </Box>

              <CheckCircleIcon
                sx={{
                  fontSize: 42,
                  color: "success.main",
                }}
              />
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* ================================================= */}
      {/* SEARCH + FILTER */}
      {/* ================================================= */}

      <Card
        sx={{
          borderRadius: 3,
          boxShadow: 2,
          mb: 3,
        }}
      >
        <CardContent>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                md: "2fr 1fr",
              },
              gap: 2,
            }}
          >

            {/* SEARCH */}

            <TextField
              fullWidth
              placeholder="Search student, assignment or course..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />

            {/* FILTER */}

            <TextField
              select
              fullWidth
              label="Filter Status"
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(
                  e.target.value
                )
              }
            >
              <MenuItem value="all">
                All Submissions
              </MenuItem>

              <MenuItem value="pending">
                Pending
              </MenuItem>

              <MenuItem value="reviewed">
                Reviewed
              </MenuItem>
            </TextField>
          </Box>
        </CardContent>
      </Card>

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
      ) : filteredSubmissions.length === 0 ? (

        /* ================================================= */
        /* EMPTY */
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
              No Submissions Found
            </Typography>

            <Typography
              color="text.secondary"
              sx={{ mt: 1 }}
            >
              There are no submissions matching
              your search or filter.
            </Typography>
          </CardContent>
        </Card>

      ) : (

        /* ================================================= */
        /* SUBMISSION CARDS */
        /* ================================================= */

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "1fr 1fr",
              xl: "repeat(3, 1fr)",
            },
            gap: 3,
          }}
        >
          {filteredSubmissions.map(
            (submission) => {
              const status =
                getStatus(submission);

              const reviewed =
                status === "reviewed";

              return (
                <Card
                  key={submission._id}
                  sx={{
                    borderRadius: 3,
                    boxShadow: 2,
                    transition: "0.2s",
                    height: "100%",

                    "&:hover": {
                      transform:
                        "translateY(-3px)",
                      boxShadow: 5,
                    },
                  }}
                >
                  <CardContent sx={{ p: 3 }}>

                    {/* TOP */}

                    <Box
                      sx={{
                        display: "flex",
                        justifyContent:
                          "space-between",
                        alignItems:
                          "flex-start",
                        mb: 2,
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems:
                            "center",
                          gap: 1.5,
                        }}
                      >
                        <Box
                          sx={{
                            width: 48,
                            height: 48,
                            borderRadius: 2,
                            bgcolor:
                              "primary.main",
                            color:
                              "white",
                            display:
                              "flex",
                            alignItems:
                              "center",
                            justifyContent:
                              "center",
                          }}
                        >
                          <PersonIcon />
                        </Box>

                        <Box>
                          <Typography
                            fontWeight="bold"
                          >
                            {getStudentName(
                              submission
                            )}
                          </Typography>

                          <Typography
                            variant="caption"
                            color="text.secondary"
                          >
                            {getStudentEmail(
                              submission
                            )}
                          </Typography>
                        </Box>
                      </Box>

                      <Chip
                        size="small"
                        icon={
                          reviewed ? (
                            <CheckCircleIcon />
                          ) : (
                            <PendingIcon />
                          )
                        }
                        label={
                          reviewed
                            ? "Reviewed"
                            : "Pending"
                        }
                        color={
                          reviewed
                            ? "success"
                            : "warning"
                        }
                      />
                    </Box>

                    <Divider sx={{ mb: 2 }} />

                    {/* ASSIGNMENT */}

                    <Box
                      sx={{
                        display: "flex",
                        gap: 1,
                        mb: 1.5,
                      }}
                    >
                      <AssignmentIcon
                        fontSize="small"
                        color="primary"
                      />

                      <Box>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                        >
                          Assignment
                        </Typography>

                        <Typography
                          variant="body2"
                          fontWeight="bold"
                        >
                          {getAssignmentTitle(
                            submission
                          )}
                        </Typography>
                      </Box>
                    </Box>

                    {/* COURSE */}

                    <Box
                      sx={{
                        display: "flex",
                        gap: 1,
                        mb: 1.5,
                      }}
                    >
                      <MenuBookIcon
                        fontSize="small"
                        color="primary"
                      />

                      <Box>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                        >
                          Course
                        </Typography>

                        <Typography
                          variant="body2"
                          fontWeight="bold"
                        >
                          {getCourseTitle(
                            submission
                          )}
                        </Typography>
                      </Box>
                    </Box>

                    {/* DATE */}

                    <Box
                      sx={{
                        display: "flex",
                        gap: 1,
                        mb: 2,
                      }}
                    >
                      <CalendarMonthIcon
                        fontSize="small"
                        color="primary"
                      />

                      <Box>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                        >
                          Submitted
                        </Typography>

                        <Typography
                          variant="body2"
                        >
                          {formatDate(
                            submission.createdAt ||
                              submission.submittedAt ||
                              submission.date
                          )}
                        </Typography>
                      </Box>
                    </Box>

                    {/* MARKS */}

                    {reviewed && (
                      <Box
                        sx={{
                          bgcolor:
                            "success.50",
                          borderRadius: 2,
                          p: 1.5,
                          mb: 2,
                        }}
                      >
                        <Typography
                          variant="body2"
                          fontWeight="bold"
                        >
                          Marks:{" "}
                          {submission.marks}
                        </Typography>

                        {submission.feedback && (
                          <Typography
                            variant="caption"
                            color="text.secondary"
                          >
                            Feedback:{" "}
                            {
                              submission.feedback
                            }
                          </Typography>
                        )}
                      </Box>
                    )}

                    {/* ACTIONS */}

                    <Box
                      sx={{
                        display: "flex",
                        gap: 1,
                        mt: 2,
                      }}
                    >
                      <Button
                        fullWidth
                        variant="outlined"
                        startIcon={
                          <VisibilityIcon />
                        }
                        onClick={() =>
                          handleView(
                            submission
                          )
                        }
                        sx={{
                          textTransform:
                            "none",
                          borderRadius: 2,
                        }}
                      >
                        View
                      </Button>

                      <Button
                        fullWidth
                        variant="contained"
                        startIcon={
                          <GradeIcon />
                        }
                        onClick={() =>
                          handleOpenGrade(
                            submission
                          )
                        }
                        sx={{
                          textTransform:
                            "none",
                          borderRadius: 2,
                        }}
                      >
                        {reviewed
                          ? "Edit Grade"
                          : "Grade"}
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              );
            }
          )}
        </Box>
      )}

      {/* ================================================= */}
      {/* VIEW SUBMISSION DIALOG */}
      {/* ================================================= */}

      <Dialog
        open={openViewDialog}
        onClose={handleCloseView}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: "center",
            fontWeight: "bold",
          }}
        >
          Submission Details

          <IconButton
            onClick={handleCloseView}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          {selectedSubmission && (
            <Box>

              {/* STUDENT */}

              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  bgcolor:
                    "background.default",
                  borderRadius: 2,
                  mb: 2,
                }}
              >
                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  Student
                </Typography>

                <Typography
                  variant="h6"
                  fontWeight="bold"
                >
                  {getStudentName(
                    selectedSubmission
                  )}
                </Typography>

                {getStudentEmail(
                  selectedSubmission
                ) && (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    {getStudentEmail(
                      selectedSubmission
                    )}
                  </Typography>
                )}
              </Paper>

              {/* ASSIGNMENT */}

              <Typography
                variant="subtitle2"
                color="text.secondary"
              >
                Assignment
              </Typography>

              <Typography
                variant="h6"
                fontWeight="bold"
                sx={{ mb: 2 }}
              >
                {getAssignmentTitle(
                  selectedSubmission
                )}
              </Typography>

              {/* COURSE */}

              <Typography
                variant="subtitle2"
                color="text.secondary"
              >
                Course
              </Typography>

              <Typography
                variant="body1"
                sx={{ mb: 2 }}
              >
                {getCourseTitle(
                  selectedSubmission
                )}
              </Typography>

              <Divider sx={{ mb: 2 }} />

              {/* SUBMISSION CONTENT */}

              <Typography
                variant="subtitle2"
                color="text.secondary"
                sx={{ mb: 1 }}
              >
                Student Submission
              </Typography>

              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  border: "1px solid",
                  borderColor:
                    "divider",
                  borderRadius: 2,
                  minHeight: 120,
                  whiteSpace:
                    "pre-wrap",
                }}
              >
                <Typography>
                  {selectedSubmission.content ||
                    selectedSubmission.answer ||
                    selectedSubmission.text ||
                    selectedSubmission.submissionText ||
                    "No text submission available."}
                </Typography>
              </Paper>

              {/* FILE */}

              {(selectedSubmission.file ||
                selectedSubmission.fileUrl ||
                selectedSubmission.document) && (
                <Box sx={{ mt: 2 }}>
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                  >
                    Attached File
                  </Typography>

                  <Button
                    variant="outlined"
                    href={
                      selectedSubmission.file ||
                      selectedSubmission.fileUrl ||
                      selectedSubmission.document
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Open Submission File
                  </Button>
                </Box>
              )}

              {/* SUBMITTED DATE */}

              <Box sx={{ mt: 3 }}>
                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  Submitted At
                </Typography>

                <Typography>
                  {formatDateTime(
                    selectedSubmission.createdAt ||
                      selectedSubmission.submittedAt ||
                      selectedSubmission.date
                  )}
                </Typography>
              </Box>

              {/* CURRENT GRADE */}

              {getStatus(
                selectedSubmission
              ) === "reviewed" && (
                <Paper
                  elevation={0}
                  sx={{
                    mt: 3,
                    p: 2,
                    borderRadius: 2,
                    bgcolor:
                      "success.50",
                  }}
                >
                  <Typography
                    fontWeight="bold"
                  >
                    Current Grade
                  </Typography>

                  <Typography
                    variant="h5"
                    fontWeight="bold"
                  >
                    {selectedSubmission.marks}
                  </Typography>

                  {selectedSubmission.feedback && (
                    <Typography
                      color="text.secondary"
                      sx={{ mt: 1 }}
                    >
                      {
                        selectedSubmission.feedback
                      }
                    </Typography>
                  )}
                </Paper>
              )}
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button
            onClick={handleCloseView}
            sx={{
              textTransform: "none",
            }}
          >
            Close
          </Button>

          {selectedSubmission && (
            <Button
              variant="contained"
              startIcon={<GradeIcon />}
              onClick={() => {
                handleCloseView();
                handleOpenGrade(
                  selectedSubmission
                );
              }}
              sx={{
                textTransform: "none",
              }}
            >
              Grade Submission
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* ================================================= */}
      {/* GRADE DIALOG */}
      {/* ================================================= */}

      <Dialog
        open={openGradeDialog}
        onClose={handleCloseGrade}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: "center",
            fontWeight: "bold",
          }}
        >
          Grade Submission

          <IconButton
            onClick={handleCloseGrade}
            disabled={saving}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          {selectedSubmission && (
            <>
              <Box sx={{ mb: 3 }}>
                <Typography
                  color="text.secondary"
                  variant="body2"
                >
                  Student
                </Typography>

                <Typography
                  variant="h6"
                  fontWeight="bold"
                >
                  {getStudentName(
                    selectedSubmission
                  )}
                </Typography>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography
                  color="text.secondary"
                  variant="body2"
                >
                  Assignment
                </Typography>

                <Typography
                  variant="h6"
                  fontWeight="bold"
                >
                  {getAssignmentTitle(
                    selectedSubmission
                  )}
                </Typography>
              </Box>

              {/* MARKS */}

              <TextField
                fullWidth
                label="Marks"
                name="marks"
                type="number"
                value={gradeData.marks}
                onChange={handleGradeChange}
                margin="normal"
                required
                inputProps={{
                  min: 0,
                }}
                placeholder="Enter marks"
              />

              {/* FEEDBACK */}

              <TextField
                fullWidth
                label="Feedback"
                name="feedback"
                value={gradeData.feedback}
                onChange={handleGradeChange}
                margin="normal"
                multiline
                rows={5}
                placeholder="Write feedback for the student..."
              />
            </>
          )}
        </DialogContent>

        <DialogActions
          sx={{
            px: 3,
            py: 2,
          }}
        >
          <Button
            onClick={handleCloseGrade}
            disabled={saving}
            sx={{
              textTransform: "none",
            }}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            startIcon={
              saving ? null : <GradeIcon />
            }
            onClick={handleSubmitGrade}
            disabled={
              saving ||
              gradeData.marks === ""
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
            ) : (
              "Save Grade"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
}

export default Submission;