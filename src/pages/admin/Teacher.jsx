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
import UpdateTeacher from "./UpdateTeacher";

function Teachers() {
    const [teachers, setTeachers] = useState([]);
    const navigate = useNavigate();
    const fetchTeachers = async () => {
        try {
            const response = await api.get("admin/getAllteachers");
            setTeachers(response.data.teachers);
            console.log(response.data.teachers);
        }
        catch (error) {
            console.error("Error fetching teachers:", error);
        }
    }
    useEffect(() => {
        fetchTeachers();
    }, []);
    const handleDeleteTeacher = async (teacherId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this teacher?");
        if (!confirmDelete) {
            return; // Exit if the user cancels the deletion
        }
        try {
            await api.delete(`/admin/deleteTeacher/${teacherId}`);
            alert("Teacher deleted successfully");
            fetchTeachers(); // Refresh the teacher list
        } catch (error) {
            console.error("Error deleting teacher:", error);
        }
    }
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
            <h1>Teacher</h1>
            <TableContainer component={Paper} sx={{ mt: 3 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <StyledTableCell>#</StyledTableCell>
                            <StyledTableCell>Name</StyledTableCell>
                            <StyledTableCell>Email</StyledTableCell>
                            <StyledTableCell>Phone</StyledTableCell>
                            <StyledTableCell>Subject</StyledTableCell>
                            <StyledTableCell>Qualification</StyledTableCell>
                            <StyledTableCell align="center">Actions</StyledTableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {teachers.map((teacher, index) => (
                            <TableRow key={teacher._id}>
                                <StyledTableCell>{index + 1}</StyledTableCell>
                                <StyledTableCell>{teacher.name}</StyledTableCell>
                                <StyledTableCell>{teacher.email}</StyledTableCell>
                                <StyledTableCell>{teacher.phone}</StyledTableCell>
                                <StyledTableCell>{teacher.subject}</StyledTableCell>
                                <StyledTableCell>{teacher.qualification}</StyledTableCell>
                                <StyledTableCell align="center">
                                    <IconButton color="primary"onClick={() =>
    navigate(`/admin/updateTeacher/${teacher._id}`)
}>
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton color="error" onClick={() => handleDeleteTeacher(teacher._id)}>
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

export default Teachers;