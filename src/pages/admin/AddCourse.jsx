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
  Alert,
  Grid,
  Stack,
  CardMedia,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddIcon from "@mui/icons-material/Add";
import SchoolIcon from "@mui/icons-material/School";

import Layout from "../../components/layout/Layout";
import GlassCard from "../../components/common/GlassCard";
import api from "../../servises/api";

const CATEGORIES = [
  "Computer Science",
  "Full-Stack Web Development",
  "AI & Data Science",
  "Mobile App Development",
  "Mathematics & Statistics",
  "Science & Physics",
  "Business & Languages",
];

function AddCourse() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Computer Science");
  const [price, setPrice] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      await api.post("/admin/addCourse", {
        title: title.trim(),
        description: description.trim(),
        category,
        price: Number(price) || 0,
        thumbnail: thumbnail.trim(),
      });

      navigate("/admin/courses");
    } catch (err) {
      console.error("Error adding course:", err);
      setError(err.response?.data?.message || "Failed to create new course.");
      setLoading(false);
    }
  };

  return (
    <Layout>
      <Box sx={{ width: "100%", maxWidth: 900, mx: "auto", display: "flex", flexDirection: "column", gap: 3.5 }}>
        {/* Header */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate("/admin/courses")}
          >
            Back
          </Button>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 800 }}>
              Create New Course Track
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              Publish a new academic curriculum syllabus for enrolled students.
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
            <Grid item xs={12}>
              <TextField
                label="Course Title"
                placeholder="e.g. Advanced Full-Stack Architecture"
                required
                fullWidth
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required size="small">
                <InputLabel id="category-label">Academic Discipline / Category</InputLabel>
                <Select
                  labelId="category-label"
                  label="Academic Discipline / Category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {CATEGORIES.map((cat) => (
                    <MenuItem key={cat} value={cat}>
                      {cat}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Tuition / Course Fee (PKR)"
                type="number"
                required
                fullWidth
                size="small"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="5000"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Thumbnail Image URL"
                placeholder="https://images.unsplash.com/..."
                fullWidth
                size="small"
                value={thumbnail}
                onChange={(e) => setThumbnail(e.target.value)}
                helperText="Provide an image URL for the course catalog card"
              />
            </Grid>

            {thumbnail && (
              <Grid item xs={12}>
                <Box
                  sx={{
                    borderRadius: "10px",
                    overflow: "hidden",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    maxHeight: 200,
                  }}
                >
                  <CardMedia component="img" height="180" image={thumbnail} alt="Preview" />
                </Box>
              </Grid>
            )}

            <Grid item xs={12}>
              <TextField
                label="Course Syllabus & Description"
                multiline
                minRows={4}
                required
                fullWidth
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Outline prerequisites, lecture topics, and learning objectives..."
              />
            </Grid>

            <Grid item xs={12}>
              <Stack direction="row" spacing={2} sx={{ pt: 1 }}>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<AddIcon />}
                  disabled={loading}
                  sx={{ px: 3.5, py: 1 }}
                >
                  {loading ? "Publishing Course..." : "Publish Course"}
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => navigate("/admin/courses")}
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

export default AddCourse;
