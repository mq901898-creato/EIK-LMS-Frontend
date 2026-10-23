import Layout from "../../components/layout/Layout";
import { useEffect, useState } from "react";
import api from "../../servises/api";
import { useParams } from "react-router-dom";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Select,
  MenuItem,
  InputLabel,
} from "@mui/material";
import { useNavigate } from "react-router-dom";


function UpdateStudent() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [gender, setGender] = useState("");
    const [studentClass, setStudentClass] = useState("");
    useEffect(() => {
  const fetchStudent = async () => {
    try {
      const response = await api.get(`/admin/getSingleStudent/${id}`);

      const student = response.data.student;

      setName(student.name);
      setEmail(student.email);
      setPhone(student.phone);
      setGender(student.Gender);
      setStudentClass(student.Studentclass);

      console.log(student);
    } catch (error) {
      console.error(error);
    }
  };

  fetchStudent();
}, [id]);
const handleUpdate = async (e) => {
  e.preventDefault();

  try {
    await api.put(`/admin/updateStudent/${id}`, {
      name,
      email,
      phone,
      Gender: gender,
      Studentclass: studentClass,
    });

    alert("Student updated successfully");

    navigate("/admin/dashboard");
  } catch (error) {
    console.error(error);
    alert("Update failed");
  }
};
    return (
  <Layout>
    <Paper
      elevation={3}
      sx={{
        maxWidth: 600,
        mx: "auto",
        mt: 4,
        p: 4,
        borderRadius: 3,
      }}
    >
      <Typography
        variant="h4"
        fontWeight="bold"
        textAlign="center"
        mb={3}
      >
        Update Student
      </Typography>

      <Box
        component="form"
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        {/* Name */}
        <TextField
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
        />

        {/* Email */}
        <TextField
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
        />

        {/* Phone */}
        <TextField
          label="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          fullWidth
        />

        {/* Gender */}
        <FormControl>
          <FormLabel>Gender</FormLabel>

          <RadioGroup
            row
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          >
            <FormControlLabel
              value="Male"
              control={<Radio />}
              label="Male"
            />

            <FormControlLabel
              value="Female"
              control={<Radio />}
              label="Female"
            />

            <FormControlLabel
              value="Other"
              control={<Radio />}
              label="Other"
            />
          </RadioGroup>
        </FormControl>

        {/* Class */}
        <FormControl fullWidth>
          <InputLabel>Class</InputLabel>

          <Select
            value={studentClass}
            label="Class"
            onChange={(e) => setStudentClass(e.target.value)}
          >
            {[
              "Nursery",
              "KG",
              "1st",
              "2nd",
              "3rd",
              "4th",
              "5th",
              "6th",
              "7th",
              "8th",
              "9th",
              "10th",
              "11th",
              "12th",
            ].map((cls) => (
              <MenuItem key={cls} value={cls}>
                {cls}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Update Button */}
        <Button
          variant="contained"
          size="large"
          sx={{ mt: 2 }}
          onClick={handleUpdate}
        >
          Update Student
        </Button>
      </Box>
    </Paper>
  </Layout>
);

}


export default UpdateStudent;