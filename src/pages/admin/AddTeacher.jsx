import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Alert,
  Stack,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

import Layout from "../../components/layout/Layout";
import GlassCard from "../../components/common/GlassCard";
import api from "../../servises/api";

function AddTeacher() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("Male");
  const [subject, setSubject] = useState("");
  const [qualification, setQualification] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      await api.post("/admin/addTeacher", {
        name: name.trim(),
        email: email.trim(),
        password,
        phone: phone.trim(),
        Gender: gender,
        subject: subject.trim(),
        qualification: qualification.trim(),
      });

      navigate("/admin/teachers");
    } catch (err) {
      console.error("Error adding teacher:", err);
      setError(err.response?.data?.message || "Failed to onboard new faculty member.");
      setLoading(false);
    }
  };

  return (
    <Layout>
      <Box sx={{ width: "100%", maxWidth: 850, mx: "auto", display: "flex", flexDirection: "column", gap: 3.5 }}>
        {/* Header */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate("/admin/teachers")}
          >
            Back
          </Button>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 800 }}>
              Onboard Faculty Member
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              Register an instructor account with access to the Teacher Dashboard and Quiz Studio.
            </Typography>
          </Box>
        </Box>

        {error && (
          <Alert severity="error" onClose={() => setError("")}>
            {error}
          </Alert>
        )}

        <GlassCard component="form" onSubmit={handleSubmit} sx={{ p: 4 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Full Name"
                placeholder="Dr. Sarah Connor"
                required
                fullWidth
                size="small"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Email Address"
                type="email"
                placeholder="s.connor@eik.edu"
                required
                fullWidth
                size="small"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Temporary Password"
                type="password"
                required
                fullWidth
                size="small"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 6 characters"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="WhatsApp Phone"
                placeholder="+923001234567"
                required
                fullWidth
                size="small"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <FormControl fullWidth size="small" required>
                <InputLabel id="gender-label">Gender</InputLabel>
                <Select
                  labelId="gender-label"
                  label="Gender"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                >
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                label="Subject / Specialization"
                placeholder="Computer Architecture"
                required
                fullWidth
                size="small"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                label="Highest Qualification"
                placeholder="Ph.D. in Computer Science"
                required
                fullWidth
                size="small"
                value={qualification}
                onChange={(e) => setQualification(e.target.value)}
              />
            </Grid>

            <Grid item xs={12}>
              <Stack direction="row" spacing={2} sx={{ pt: 1 }}>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<PersonAddIcon />}
                  disabled={loading}
                  sx={{ px: 3.5, py: 1 }}
                >
                  {loading ? "Registering Faculty..." : "Onboard Faculty"}
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => navigate("/admin/teachers")}
                  disabled={loading}
                >
                  Cancel
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </GlassCard>
      </Box>
    </Layout>
  );
}

export default AddTeacher;
