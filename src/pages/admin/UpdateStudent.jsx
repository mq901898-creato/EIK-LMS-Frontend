import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
  Skeleton,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SaveIcon from "@mui/icons-material/Save";

import Layout from "../../components/layout/Layout";
import GlassCard from "../../components/common/GlassCard";
import api from "../../servises/api";

function UpdateStudent() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("Male");
  const [studentClass, setStudentClass] = useState("");

  const [fetching, setFetching] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        setFetching(true);
        const response = await api.get(`/admin/getSingleStudent/${id}`);
        const student = response.data?.student;

        setName(student?.name || "");
        setEmail(student?.email || "");
        setPhone(student?.phone || "");
        setGender(student?.Gender || "Male");
        setStudentClass(student?.Studentclass || "");
      } catch (err) {
        console.error("Error fetching student:", err);
        setError(err.response?.data?.message || "Failed to load student record.");
      } finally {
        setFetching(false);
      }
    };

    if (id) fetchStudent();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await api.put(`/admin/updateStudent/${id}`, {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        Gender: gender,
        Studentclass: studentClass.trim(),
      });

      navigate("/admin/students");
    } catch (err) {
      console.error("Error updating student:", err);
      setError(err.response?.data?.message || "Failed to update student profile.");
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
            onClick={() => navigate("/admin/students")}
          >
            Back
          </Button>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 800 }}>
              Edit Student Record
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              Update contact information, active class level, and academic record.
            </Typography>
          </Box>
        </Box>

        {error && (
          <Alert severity="error" onClose={() => setError("")}>
            {error}
          </Alert>
        )}

        <GlassCard component="form" onSubmit={handleUpdate} sx={{ p: 4 }}>
          {fetching ? (
            <Stack spacing={2.5}>
              <Skeleton height={50} />
              <Skeleton height={50} />
              <Skeleton height={50} />
              <Skeleton height={50} width={200} />
            </Stack>
          ) : (
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Student Full Name"
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
                  required
                  fullWidth
                  size="small"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="WhatsApp Phone"
                  required
                  fullWidth
                  size="small"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
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

              <Grid item xs={12}>
                <TextField
                  label="Assigned Class / Grade / Batch"
                  placeholder="e.g. Batch 2026 - CS-A"
                  required
                  fullWidth
                  size="small"
                  value={studentClass}
                  onChange={(e) => setStudentClass(e.target.value)}
                />
              </Grid>

              <Grid item xs={12}>
                <Stack direction="row" spacing={2} sx={{ pt: 1 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={<SaveIcon />}
                    disabled={loading}
                    sx={{ px: 3.5, py: 1 }}
                  >
                    {loading ? "Saving Changes..." : "Save Student"}
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => navigate("/admin/students")}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          )}
        </GlassCard>
      </Box>
    </Layout>
  );
}

export default UpdateStudent;
