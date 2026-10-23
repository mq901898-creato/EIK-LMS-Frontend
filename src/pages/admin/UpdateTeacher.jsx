import Layout from "../../components/layout/Layout";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../servises/api";

import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

function UpdateTeacher() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");
  const [subject, setSubject] = useState("");
  const [qualification, setQualification] = useState("");

useEffect(() => {
    const fetchTeacher = async () => {
        try {
            console.log("ID:", id);
            console.log("GET URL:", `/admin/getSingleTeacher/${id}`);

            const response = await api.get(
                `/admin/getSingleTeacher/${id}`
            );

            console.log("GET RESPONSE:", response.data);

            const teacher = response.data.teacher;

            setName(teacher.name || "");
            setEmail(teacher.email || "");
            setPhone(teacher.phone || "");
            setGender(teacher.Gender || "");
            setSubject(teacher.subject || "");
            setQualification(teacher.qualification || "");

        } catch (error) {
            console.error("STATUS:", error.response?.status);
            console.error("BACKEND DATA:", error.response?.data);
            console.error("FULL ERROR:", error);
        }
    };

    if (id) {
        fetchTeacher();
    }
}, [id]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await api.put(`/admin/updateTeacher/${id}`, {
        name,
        email,
        phone,
        Gender: gender,
        subject,
        qualification,
      });

      console.log(response.data);

      alert("Teacher updated successfully");

      navigate("/admin/teachers");

    } catch (error) {
      console.error("Status:", error.response?.status);
      console.error("Backend response:", error.response?.data);
      console.error("Error:", error);
    }
  };

  return (
    <Layout>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          mt: 4,
        }}
      >
        <Paper
          elevation={4}
          sx={{
            width: "100%",
            maxWidth: 600,
            p: 4,
            borderRadius: 3,
          }}
        >
          <Typography
            variant="h4"
            fontWeight="bold"
            mb={3}
          >
            Update Teacher
          </Typography>

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >

            <TextField
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
            />

            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
            />

            <TextField
              label="Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              fullWidth
            />

            <FormControl fullWidth>
              <InputLabel>Gender</InputLabel>

              <Select
                value={gender}
                label="Gender"
                onChange={(e) => setGender(e.target.value)}
              >
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="Subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              fullWidth
            />

            <TextField
              label="Qualification"
              value={qualification}
              onChange={(e) => setQualification(e.target.value)}
              fullWidth
            />

            <Button
              type="submit"
              variant="contained"
              size="large"
            >
              Update Teacher
            </Button>

          </Box>
        </Paper>
      </Box>
    </Layout>
  );
}

export default UpdateTeacher;