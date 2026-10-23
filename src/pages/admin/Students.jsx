import Layout from "../../components/layout/Layout";
import { useEffect, useState } from "react";
import api from "../../servises/api";
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom"; 
import UpdateStudent from "./UpdateStudent";

function Students() {
  const [students, setStudents] = useState([]);
  const navigate = useNavigate();

  const fetchStudents = async () => {
  try {
    const response = await api.get("/admin/getAllstudents");

    setStudents(response.data.students);
    console.log(response.data.students);
  } catch (error) {
    console.error("Error fetching students:", error);
  }
};

useEffect(() => {
  fetchStudents();
}, []);

  const handleDeleteStudent = async (studentId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this student?");
        if (!confirmDelete) {
            return; // Exit if the user cancels the deletion
        }
    try {
      await api.delete(`/admin/deleteStudent/${studentId}`);

      alert("Student deleted successfully");

      fetchStudents(); // ✅ Works now
    } catch (error) {
      console.error("Error deleting student:", error);
    }
  };
  
  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));
  return (
    <Layout>
      <h1>Students</h1>

      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableCell>#</StyledTableCell>
              <StyledTableCell>Name</StyledTableCell>
              <StyledTableCell>Email</StyledTableCell>
              <StyledTableCell>Phone</StyledTableCell>
              <StyledTableCell>Class</StyledTableCell>
              <StyledTableCell align="center">Actions</StyledTableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {students.map((student, index) => (
              <TableRow key={student._id}>
                <StyledTableCell>{index + 1}</StyledTableCell>
                <StyledTableCell>{student.name}</StyledTableCell>
                <StyledTableCell>{student.email}</StyledTableCell>
                <StyledTableCell>{student.phone}</StyledTableCell>
                <StyledTableCell>{student.Studentclass}</StyledTableCell>
                <StyledTableCell align="center">
                  <IconButton color="primary" onClick={() => navigate(`/admin/update/${student._id}`)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDeleteStudent(student._id)}>
                    <DeleteIcon />
                  </IconButton>
                </StyledTableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Layout>
  );
}

export default Students;