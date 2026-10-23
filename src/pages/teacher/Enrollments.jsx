import React, { useEffect, useState } from "react";

import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  Chip,
  CircularProgress,
  Container,
  Typography,
} from "@mui/material";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import SchoolIcon from "@mui/icons-material/School";
import PersonIcon from "@mui/icons-material/Person";

import api from "../../servises/api";
import Layout from "../../components/layout/Layout";
export default function Enrollments() {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [filter, setFilter] = useState("All");

  const fetchEnrollments = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/teacher/enrollments");

      const data =
        response.data.enrollments ||
        response.data.data ||
        [];

      setEnrollments(data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to load enrollment requests."
      );
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

      const response = await api.put(
        `/teacher/enrollments/${enrollmentId}/${action}`
      );

      setMessage(
        response.data.message ||
          `Enrollment ${
            action === "approve" ? "approved" : "rejected"
          } successfully.`
      );

      await fetchEnrollments();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          `Failed to ${action} enrollment.`
      );
    } finally {
      setProcessingId(null);
    }
  };

  const getStatusColor = (status) => {
    if (status === "Approved") return "success";
    if (status === "Rejected") return "error";
    return "warning";
  };

  const filteredEnrollments =
    filter === "All"
      ? enrollments
      : enrollments.filter(
          (item) => item.status === filter
        );

  const pendingCount = enrollments.filter(
    (item) => item.status === "Pending"
  ).length;

  const approvedCount = enrollments.filter(
    (item) => item.status === "Approved"
  ).length;

  const rejectedCount = enrollments.filter(
    (item) => item.status === "Rejected"
  ).length;

  return (
    <Layout>
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#f5f7fb",
        py: 4,
      }}
    >
      <Container maxWidth="xl">
        {/* Success Message */}
        {message && (
          <Alert
            severity="success"
            sx={{ mb: 3 }}
            onClose={() => setMessage("")}
          >
            {message}
          </Alert>
        )}

        {/* Error Message */}
        {error && (
          <Alert
            severity="error"
            sx={{ mb: 3 }}
            onClose={() => setError("")}
          >
            {error}
          </Alert>
        )}

        {/* Summary Cards */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(min(100%, 200px), 1fr))",
            gap: 2,
            mb: 4,
          }}
        >
          {[
            {
              title: "Total Requests",
              count: enrollments.length,
              icon: <SchoolIcon />,
              color: "#2563eb",
            },
            {
              title: "Pending",
              count: pendingCount,
              icon: <AccessTimeIcon />,
              color: "#d97706",
            },
            {
              title: "Approved",
              count: approvedCount,
              icon: <CheckCircleIcon />,
              color: "#16a34a",
            },
            {
              title: "Rejected",
              count: rejectedCount,
              icon: <CancelIcon />,
              color: "#dc2626",
            },
          ].map((item) => (
            <Card
              key={item.title}
              sx={{
                p: 2.5,
                borderRadius: 3,
                boxShadow:
                  "0 4px 15px rgba(15,23,42,0.04)",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <Box>
                  <Typography
                    color="text.secondary"
                    variant="body2"
                  >
                    {item.title}
                  </Typography>

                  <Typography
                    variant="h4"
                    fontWeight={800}
                    mt={1}
                  >
                    {item.count}
                  </Typography>
                </Box>

                <Avatar
                  sx={{
                    bgcolor: `${item.color}18`,
                    color: item.color,
                    width: 48,
                    height: 48,
                  }}
                >
                  {item.icon}
                </Avatar>
              </Box>
            </Card>
          ))}
        </Box>

        {/* Status Filters */}
        <Box
          sx={{
            display: "flex",
            gap: 1,
            flexWrap: "wrap",
            mb: 3,
          }}
        >
          {["All", "Pending", "Approved", "Rejected"].map(
            (status) => (
              <Button
                key={status}
                variant={
                  filter === status
                    ? "contained"
                    : "outlined"
                }
                onClick={() => setFilter(status)}
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                }}
              >
                {status}
              </Button>
            )
          )}
        </Box>

        {/* Loading */}
        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              py: 8,
            }}
          >
            <CircularProgress />
          </Box>
        ) : filteredEnrollments.length === 0 ? (
          /* Empty State */
          <Card
            sx={{
              textAlign: "center",
              py: 7,
              px: 2,
              borderRadius: 3,
            }}
          >
            <SchoolIcon
              sx={{
                fontSize: 55,
                color: "#94a3b8",
                mb: 1,
              }}
            />

            <Typography variant="h6" fontWeight={700}>
              No enrollment requests found
            </Typography>

            <Typography color="text.secondary" mt={1}>
              Requests matching this filter will appear here.
            </Typography>

            <Button
              sx={{ mt: 2 }}
              onClick={fetchEnrollments}
            >
              Refresh
            </Button>
          </Card>
        ) : (
          /* Enrollment List */
          <Box sx={{ display: "grid", gap: 2 }}>
            {filteredEnrollments.map((item) => {
              const student =
                item.student &&
                typeof item.student === "object"
                  ? item.student
                  : null;

              const course =
                item.course &&
                typeof item.course === "object"
                  ? item.course
                  : null;

              return (
                <Card
                  key={item._id}
                  sx={{
                    borderRadius: 3,
                    p: { xs: 2, sm: 3 },
                    boxShadow:
                      "0 4px 15px rgba(15,23,42,0.04)",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: {
                        xs: "column",
                        md: "row",
                      },
                      justifyContent: "space-between",
                      alignItems: {
                        xs: "stretch",
                        md: "center",
                      },
                      gap: 3,
                    }}
                  >
                    {/* Student Details */}
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        minWidth: 0,
                      }}
                    >
                      <Avatar
                        sx={{
                          width: 52,
                          height: 52,
                          bgcolor: "#dbeafe",
                          color: "#1d4ed8",
                          flexShrink: 0,
                        }}
                      >
                        <PersonIcon />
                      </Avatar>

                      <Box sx={{ minWidth: 0 }}>
                        <Typography
                          variant="h6"
                          fontWeight={800}
                          sx={{ overflowWrap: "anywhere" }}
                        >
                          {student?.name || "Student"}
                        </Typography>

                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ overflowWrap: "anywhere" }}
                        >
                          {student?.email ||
                            "Email unavailable"}
                        </Typography>

                        <Typography
                          variant="body2"
                          mt={1}
                          sx={{ overflowWrap: "anywhere" }}
                        >
                          <strong>Course:</strong>{" "}
                          {course?.title ||
                            "Course unavailable"}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Status and Actions */}
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: {
                          xs: "flex-start",
                          md: "flex-end",
                        },
                        gap: 1.5,
                      }}
                    >
                      <Chip
                        label={item.status || "Pending"}
                        color={getStatusColor(item.status)}
                        size="small"
                      />

                      {item.status === "Pending" && (
                        <Box
                          sx={{
                            display: "flex",
                            gap: 1,
                            flexWrap: "wrap",
                          }}
                        >
                          <Button
                            variant="contained"
                            color="success"
                            startIcon={<CheckCircleIcon />}
                            disabled={
                              processingId === item._id
                            }
                            onClick={() =>
                              handleStatusChange(
                                item._id,
                                "approve"
                              )
                            }
                            sx={{
                              textTransform: "none",
                              borderRadius: 2,
                            }}
                          >
                            {processingId === item._id
                              ? "Processing..."
                              : "Approve"}
                          </Button>

                          <Button
                            variant="outlined"
                            color="error"
                            startIcon={<CancelIcon />}
                            disabled={
                              processingId === item._id
                            }
                            onClick={() =>
                              handleStatusChange(
                                item._id,
                                "reject"
                              )
                            }
                            sx={{
                              textTransform: "none",
                              borderRadius: 2,
                            }}
                          >
                            Reject
                          </Button>
                        </Box>
                      )}
                    </Box>
                  </Box>
                </Card>
              );
            })}
          </Box>
        )}
      </Container>
    </Box>
    </Layout>
  );
}
