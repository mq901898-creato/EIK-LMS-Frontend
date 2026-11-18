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

function Teachers() {
  const [teachers, setTeachers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const navigate = useNavigate();

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await api.get("admin/getAllteachers");
      setTeachers(Array.isArray(response.data?.teachers) ? response.data.teachers : []);
    } catch (err) {
      console.error("Error fetching teachers:", err);
      setError(err.response?.data?.message || "Failed to load faculty directory.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      setDeleteLoading(true);
      await api.delete(`/admin/deleteTeacher/${deleteTarget._id}`);
      setSuccessMsg(`Faculty member "${deleteTarget.name}" deleted successfully.`);
      setDeleteTarget(null);
      fetchTeachers();
    } catch (err) {
      console.error("Error deleting teacher:", err);
      setError(err.response?.data?.message || "Failed to delete faculty member.");
    } finally {
      setDeleteLoading(false);
    }
  };

  const filteredTeachers = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return teachers;
    return teachers.filter(
      (t) =>
        t.name?.toLowerCase().includes(query) ||
        t.email?.toLowerCase().includes(query) ||
        t.phone?.toLowerCase().includes(query) ||
        t.subject?.toLowerCase().includes(query) ||
        t.qualification?.toLowerCase().includes(query)
    );
  }, [teachers, searchQuery]);

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
                Faculty Directory
              </Typography>
              <Chip
                label={`${teachers.length} Instructors`}
                size="small"
                sx={{
                  bgcolor: "rgba(16, 185, 129, 0.12)",
                  color: "#10b981",
                  fontWeight: 700,
                  fontSize: "0.72rem",
                }}
              />
            </Box>
            <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>
              Manage teachers, assigned academic departments, and credentials.
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flexWrap: "wrap" }}>
            <Tooltip title="Refresh">
              <IconButton
                onClick={fetchTeachers}
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
              startIcon={<PersonAddIcon />}
              onClick={() => navigate("/admin/addTeacher")}
            >
              Onboard Teacher
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
              placeholder="Search faculty by name, department, or qualification..."
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
              Showing {filteredTeachers.length} of {teachers.length} instructors
            </Typography>
          </Box>

          {/* Table */}
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ width: 60 }}>#</TableCell>
                  <TableCell>Instructor</TableCell>
                  <TableCell>Email Address</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Subject / Discipline</TableCell>
                  <TableCell>Qualification</TableCell>
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
                      <TableCell><Skeleton width={90} /></TableCell>
                      <TableCell><Skeleton width={110} /></TableCell>
                      <TableCell align="center"><Skeleton width={60} sx={{ mx: "auto" }} /></TableCell>
                    </TableRow>
                  ))
                ) : filteredTeachers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} sx={{ textAlign: "center", py: 6 }}>
                      <Typography variant="body1" sx={{ color: "text.secondary", fontWeight: 500 }}>
                        {searchQuery ? "No matching instructors found." : "No faculty records available."}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTeachers.map((teacher, index) => (
                    <TableRow key={teacher._id} hover>
                      <TableCell sx={{ color: "text.secondary", fontSize: "0.8rem" }}>
                        {index + 1}
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600, color: "text.primary" }}>
                        {teacher.name}
                      </TableCell>
                      <TableCell sx={{ color: "text.secondary" }}>
                        {teacher.email || "—"}
                      </TableCell>
                      <TableCell sx={{ color: "text.secondary" }}>
                        {teacher.phone || "—"}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={teacher.subject || "General"}
                          size="small"
                          sx={{
                            bgcolor: "rgba(16, 185, 129, 0.08)",
                            color: "#10b981",
                            border: "1px solid rgba(16, 185, 129, 0.2)",
                            fontWeight: 600,
                            fontSize: "0.72rem",
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ color: "text.secondary" }}>
                        {teacher.qualification || "—"}
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: "flex", justifyContent: "center", gap: 0.5 }}>
                          <Tooltip title="Edit Teacher">
                            <IconButton
                              size="small"
                              onClick={() => navigate(`/admin/updateTeacher/${teacher._id}`)}
                              sx={{
                                color: "#818cf8",
                                "&:hover": { bgcolor: "rgba(99, 102, 241, 0.12)" },
                              }}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete Teacher">
                            <IconButton
                              size="small"
                              onClick={() => setDeleteTarget(teacher)}
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
          title="Delete Faculty Record"
          message={`Are you sure you want to remove ${deleteTarget?.name} from faculty? Courses assigned to this instructor will require reassignment.`}
          confirmText="Delete Faculty"
          loading={deleteLoading}
          onConfirm={handleDeleteConfirm}
          onClose={() => setDeleteTarget(null)}
        />
      </Box>
    </Layout>
  );
}

export default Teachers;
