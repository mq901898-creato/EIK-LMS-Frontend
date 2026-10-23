import Layout from "../../components/layout/Layout";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
  Grid,
} from "@mui/material";

function AddTeacher() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");
  const [subject, setSubject] = useState("");
  const [qualification, setQualification] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await api.post("/admin/addTeacher", {
        name,
        email,
        password,
        phone,
        Gender: gender,
        subject,
        qualification,
      });
      console.log(response.data);
      alert("Teacher added successfully");
      navigate("/admin/teachers");
    } catch (error) {
      console.error("Status:", error.response?.status);
      console.error("Backend response:", error.response?.data);
      console.error("Error:", error);
    }
  };

  return (
    <Layout>
      <Box sx={{ p: { xs: 2, md: 4 } }}>
        <Paper elevation={4} sx={{ width: "100%", p: 4, borderRadius: 3 }}>
          <Typography
            variant="h4"
            sx={{ fontWeight: "bold", mb: 4, textAlign: "left" }}
          >
            Add Teacher
          </Typography>

          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Row 1 */}
              <Grid item xs={12} md={6}>
                <TextField
                  label="Teacher Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  fullWidth
                  required
                />
              </Grid>

              {/* Row 2 */}
              <Grid item xs={12} md={6}>
                <TextField
                  label="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  fullWidth
                  required
                />
              </Grid>

              {/* Row 3 */}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth required>
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
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  fullWidth
                  required
                />
              </Grid>

              {/* Row 4 (Full width or split) */}
              <Grid item xs={12}>
                <TextField
                  label="Qualification"
                  value={qualification}
                  onChange={(e) => setQualification(e.target.value)}
                  fullWidth
                  required
                />
              </Grid>

              {/* Form Actions */}
              <Grid item xs={12} sx={{ display: "flex", gap: 2, mt: 2 }}>
                <Button type="submit" variant="contained" size="large">
                  Add Teacher
                </Button>
                <Button
                  type="button"
                  variant="outlined"
                  size="large"
                  onClick={() => navigate("/admin/teachers")}
                >
                  Cancel
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Box>
    </Layout>
  );
}

export default AddTeacher;
