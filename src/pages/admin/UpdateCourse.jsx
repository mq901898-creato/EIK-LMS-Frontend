import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Alert,
  Grid,
  Stack,
  CardMedia,
  Skeleton,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SaveIcon from "@mui/icons-material/Save";

import Layout from "../../components/layout/Layout";
import GlassCard from "../../components/common/GlassCard";
import api from "../../servises/api";

const CATEGORIES = [
  "Computer Science",
  "Full-Stack Web Development",
  "Frontend",
  "Backend",
  "AI & Data Science",
  "Mobile App Development",
  "Mathematics & Statistics",
  "Science & Physics",
  "Business & Languages",
];

function UpdateCourse() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [isPublished, setIsPublished] = useState(false);

  const [fetching, setFetching] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setFetching(true);
        const response = await api.get(`/admin/getSingleCourse/${id}`);
        const course = response.data.course;

        setTitle(course.title || "");
        setDescription(course.description || "");
        setCategory(course.category || "");
        setPrice(course.price || "");
        setThumbnail(course.thumbnail || "");
        setIsPublished(course.isPublished || false);
      } catch (err) {
        console.error("Error fetching course:", err);
        setError(err.response?.data?.message || "Failed to retrieve course details.");
      } finally {
        setFetching(false);
      }
    };

    fetchCourse();
  }, [id]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      await api.put(`/admin/updateCourse/${id}`, {
        title: title.trim(),
        description: description.trim(),
        category,
        price: Number(price) || 0,
        thumbnail: thumbnail.trim(),
        isPublished,
      });

      navigate("/admin/courses");
    } catch (err) {
      console.error("Error updating course:", err);
      setError(err.response?.data?.message || "Failed to update course.");
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
              Edit Course Track
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              Update curriculum parameters, pricing, and publication status.
            </Typography>
          </Box>
        </Box>

        {error && (
          <Alert severity="error" onClose={() => setError("")}>
            {error}
          </Alert>
        )}

        <GlassCard component="form" onSubmit={handleSubmit} sx={{ p: 4 }}>
          {fetching ? (
            <Stack spacing={2.5}>
              <Skeleton height={50} />
              <Skeleton height={50} />
              <Skeleton height={120} />
              <Skeleton height={50} width={200} />
            </Stack>
          ) : (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  label="Course Title"
                  required
                  fullWidth
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required size="small">
                  <InputLabel id="category-label">Academic Category</InputLabel>
                  <Select
                    labelId="category-label"
                    label="Academic Category"
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
                  label="Tuition / Fee (PKR)"
                  type="number"
                  required
                  fullWidth
                  size="small"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Thumbnail Image URL"
                  fullWidth
                  size="small"
                  value={thumbnail}
                  onChange={(e) => setThumbnail(e.target.value)}
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
                />
              </Grid>

              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={isPublished}
                      onChange={(e) => setIsPublished(e.target.checked)}
                      color="primary"
                    />
                  }
                  label={
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      Publish in Student Catalog ({isPublished ? "Active" : "Draft / Hidden"})
                    </Typography>
                  }
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
                    {loading ? "Saving Changes..." : "Save Course"}
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
          )}
        </GlassCard>
      </Box>
    </Layout>
  );
}

export default UpdateCourse;
