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
  TextField,
  InputAdornment,
  Chip,
  Button,
  Skeleton,
  Alert,
  Tooltip,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useNavigate } from "react-router-dom";

import Layout from "../../components/layout/Layout";
import GlassCard from "../../components/common/GlassCard";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import api from "../../servises/api";

function Students() {
  const [students, setStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const navigate = useNavigate();

  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await api.get("/admin/getAllstudents");
      setStudents(Array.isArray(response.data?.students) ? response.data.students : []);
    } catch (err) {
      console.error("Error fetching students:", err);
      setError(err.response?.data?.message || "Failed to load students directory.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      setDeleteLoading(true);
      await api.delete(`/admin/deleteStudent/${deleteTarget._id}`);
      setSuccessMsg(`Student "${deleteTarget.name}" deleted successfully.`);
      setDeleteTarget(null);
      fetchStudents();
    } catch (err) {
      console.error("Error deleting student:", err);
      setError(err.response?.data?.message || "Failed to delete student.");
    } finally {
      setDeleteLoading(false);
    }
  };

  const filteredStudents = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return students;
    return students.filter(
      (s) =>
        s.name?.toLowerCase().includes(query) ||
        s.email?.toLowerCase().includes(query) ||
        s.phone?.toLowerCase().includes(query) ||
        s.Studentclass?.toLowerCase().includes(query)
    );
  }, [students, searchQuery]);

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
                Student Directory
              </Typography>
              <Chip
                label={`${students.length} Registered`}
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
              Manage registered student profiles, academic classes, and records.
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flexWrap: "wrap" }}>
            <Tooltip title="Refresh">
              <IconButton
                onClick={fetchStudents}
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

        {/* Directory Card */}
        <GlassCard sx={{ p: 0, overflow: "hidden" }}>
          {/* Table Toolbar */}
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
              placeholder="Search by name, email, class, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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
              Showing {filteredStudents.length} of {students.length} students
            </Typography>
          </Box>

          {/* Table */}
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ width: 60 }}>#</TableCell>
                  <TableCell>Student Name</TableCell>
                  <TableCell>Email Address</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Class / Level</TableCell>
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
                      <TableCell><Skeleton width={140} /></TableCell>
                      <TableCell><Skeleton width={180} /></TableCell>
                      <TableCell><Skeleton width={100} /></TableCell>
                      <TableCell><Skeleton width={80} /></TableCell>
                      <TableCell align="center"><Skeleton width={60} sx={{ mx: "auto" }} /></TableCell>
                    </TableRow>
                  ))
                ) : filteredStudents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} sx={{ textAlign: "center", py: 6 }}>
                      <Typography variant="body1" sx={{ color: "text.secondary", fontWeight: 500 }}>
                        {searchQuery ? "No matching students found." : "No student records available."}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredStudents.map((student, index) => (
                    <TableRow key={student._id} hover>
                      <TableCell sx={{ color: "text.secondary", fontSize: "0.8rem" }}>
                        {index + 1}
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600, color: "text.primary" }}>
                        {student.name}
                      </TableCell>
                      <TableCell sx={{ color: "text.secondary" }}>
                        {student.email || "—"}
                      </TableCell>
                      <TableCell sx={{ color: "text.secondary" }}>
                        {student.phone || "—"}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={student.Studentclass || "General"}
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
                      <TableCell align="center">
                        <Box sx={{ display: "flex", justifyContent: "center", gap: 0.5 }}>
                          <Tooltip title="Edit Student">
                            <IconButton
                              size="small"
                              onClick={() => navigate(`/admin/update/${student._id}`)}
                              sx={{
                                color: "#818cf8",
                                "&:hover": { bgcolor: "rgba(99, 102, 241, 0.12)" },
                              }}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete Student">
                            <IconButton
                              size="small"
                              onClick={() => setDeleteTarget(student)}
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
          title="Delete Student Record"
          message={`Are you sure you want to delete ${deleteTarget?.name}? All associated academic enrollments will be permanently removed.`}
          confirmText="Delete Student"
          loading={deleteLoading}
          onConfirm={handleDeleteConfirm}
          onClose={() => setDeleteTarget(null)}
        />
      </Box>
    </Layout>
  );
}

export default Students;
