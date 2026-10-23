import Layout from "../../components/layout/Layout";
import { useEffect, useState } from "react";
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
  Button,
  Chip,
} from "@mui/material";

import { styled } from "@mui/material/styles";
import UpdateCourse from "./UpdateCourse";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";

function AdminCourses() {
  const [courses, setCourses] = useState([]);
    const navigate = useNavigate();
  // Fetch all courses
  const fetchCourses = async () => {
    try {
      const response = await api.get("/admin/getAllCourses");

      setCourses(response.data.courses);

      console.log("Courses:", response.data.courses);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // Delete course
  const handleDeleteCourse = async (courseId) => {
      const confirmDelete = window.confirm("Are you sure you want to delete this teacher?");
        if (!confirmDelete) {
            return; // Exit if the user cancels the deletion
        }
    try {
      await api.delete(`/admin/deleteCourse/${courseId}`);

      alert("Course deleted successfully");

      fetchCourses();
    } catch (error) {
      console.error("Error deleting course:", error);
    }
  };

  // Styled table cell
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
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Box>
        <h1>Courses</h1>

          <Typography color="text.secondary">
            Manage all courses
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={()=>navigate("/admin/courses/add")}
        >
          Add Course
        </Button>
      </Box>

      {/* Course Table */}
      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableCell>#</StyledTableCell>
              <StyledTableCell>Title</StyledTableCell>
              <StyledTableCell>Category</StyledTableCell>
              <StyledTableCell>Teacher</StyledTableCell>
              <StyledTableCell>Price</StyledTableCell>
              <StyledTableCell>Status</StyledTableCell>
              <StyledTableCell align="center">
                Actions
              </StyledTableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {courses.length > 0 ? (
              courses.map((course, index) => (
                <TableRow key={course._id}>
                  <TableCell>{index + 1}</TableCell>

                  <TableCell>
                    {course.title}
                  </TableCell>

                  <TableCell>
                    {course.category}
                  </TableCell>

                  <TableCell>
                    {course.teacher?.name || "Unknown"}
                  </TableCell>

                  <TableCell>
                    Rs. {course.price || 0}
                  </TableCell>

                  <TableCell>
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
                  </TableCell>

                  <TableCell align="center">
                    <IconButton
                    color="primary"
                    onClick={() =>
                        navigate(`/admin/courses/edit/${course._id}`)
                    }
                    >
                    <EditIcon />
                    </IconButton>

                    <IconButton
                      color="error"
                      onClick={() =>
                        handleDeleteCourse(course._id)
                      }
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={7}
                  align="center"
                >
                  No courses found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Layout>
  );
}

export default AdminCourses;

