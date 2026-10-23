
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  FormControl,
  FormLabel,
  FormControlLabel,
  RadioGroup,
  Radio,
} from "@mui/material";

import api from "../../servises/api";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("Male");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post("/student/register", {
        name,
        email,
        password,
        phone,
        Gender: gender,
        role: "student",
      });

      console.log(response.data);

      alert("Student Registered Successfully");

      navigate("/login");
    } catch (error) {
      console.error("STUDENT REGISTRATION ERROR:", error);

      alert(
        error.response?.data?.message || "Registration Failed"
      );
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#f5f5f5",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        p: 2,
      }}
    >
      <Paper
        elevation={10}
        sx={{
          width: "100%",
          maxWidth: 450,
          p: 4,
          borderRadius: 3,
        }}
      >
        <Typography
          variant="h4"
          textAlign="center"
          fontWeight="bold"
          color="primary"
          mb={3}
        >
          Student Registration
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
            required
          />

          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            required
          />

          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            required
          />

          <TextField
            label="Phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            fullWidth
          />

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

          <Button
            type="submit"
            variant="contained"
            size="large"
            sx={{
              py: 1.3,
              mt: 1,
            }}
          >
            Register Student
          </Button>

          <Typography textAlign="center">
            Already have an account?{" "}
            <Link to="/login">Login</Link>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}

export default Register;
