import Layout from "../../components/layout/Layout";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../servises/api";

import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
} from "@mui/material";

import { styled } from "@mui/material/styles";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

function AdminAssignments() {
  const [assignments, setAssignments] = useState([]);
  const navigate = useNavigate();

  const fetchAssignments = async () => {
    try {
      const response = await api.get("/admin/getAllAssignments");

      setAssignments(response.data.assignments);

      console.log("Assignments:", response.data.assignments);
    } catch (error) {
      console.error("Error fetching assignments:", error);
      console.error("Backend:", error.response?.data);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  const handleDeleteAssignment = async (assignmentId) => {
    try {
      await api.delete(`/admin/assighmentdelete/${assignmentId}`);

      alert("Assignment deleted successfully");

      fetchAssignments();
    } catch (error) {
      console.error("Error deleting assignment:", error);
      console.error("Backend:", error.response?.data);
    }
  };

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    "&.MuiTableCell-head": {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.common.white,
      fontWeight: "bold",
    },

    "&.MuiTableCell-body": {
      fontSize: 14,
    },
  }));

  return (
    <Layout>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight="bold">
          Assignments
        </Typography>

        <Typography color="text.secondary">
          Manage all assignments
        </Typography>
      </Box>

      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableCell>#</StyledTableCell>
              <StyledTableCell>Title</StyledTableCell>
              <StyledTableCell>Course</StyledTableCell>
              <StyledTableCell>Teacher</StyledTableCell>
              <StyledTableCell>Due Date</StyledTableCell>
              <StyledTableCell align="center">
                Actions
              </StyledTableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {assignments.length > 0 ? (
              assignments.map((assignment, index) => (
                <TableRow key={assignment._id}>
                  <TableCell>{index + 1}</TableCell>

                  <TableCell>{assignment.title}</TableCell>

                  <TableCell>
                    {assignment.course?.title || "Unknown"}
                  </TableCell>

                  <TableCell>
                    {assignment.teacher?.name || "Unknown"}
                  </TableCell>

                  <TableCell>
                    {assignment.dueDate
                      ? new Date(
                          assignment.dueDate
                        ).toLocaleDateString()
                      : "No date"}
                  </TableCell>

                  <TableCell align="center">
                    <IconButton
                      color="primary"
                      onClick={() =>
                        navigate(
                          `/admin/assignments/edit/${assignment._id}`
                        )
                      }
                    >
                      <EditIcon />
                    </IconButton>

                    <IconButton
                      color="error"
                      onClick={() =>
                        handleDeleteAssignment(assignment._id)
                      }
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No assignments found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Layout>
  );
}

export default AdminAssignments;