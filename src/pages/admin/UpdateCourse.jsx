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
  FormControlLabel,
  Switch,
} from "@mui/material";

function UpdateCourse() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [isPublished, setIsPublished] = useState(false);

  // Get single course
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await api.get(`/admin/getSingleCourse/${id}`);

        const course = response.data.course;

        setTitle(course.title || "");
        setDescription(course.description || "");
        setCategory(course.category || "");
        setPrice(course.price || "");
        setThumbnail(course.thumbnail || "");
        setIsPublished(course.isPublished || false);

      } catch (error) {
        console.error("Error fetching course:", error);
        console.error("Backend response:", error.response?.data);
      }
    };

    fetchCourse();
  }, [id]);

  // Update course
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await api.put(
        `/admin/updateCourse/${id}`,
        {
          title,
          description,
          category,
          price,
          thumbnail,
          isPublished,
        }
      );

      console.log(response.data);

      alert("Course updated successfully");

      navigate("/admin/courses");

    } catch (error) {
      console.error("Error updating course:", error);
      console.error("Backend response:", error.response?.data);
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
            maxWidth: 650,
            p: 4,
            borderRadius: 3,
          }}
        >
          <Typography
            variant="h4"
            fontWeight="bold"
            sx={{ mb: 3 }}
          >
            Update Course
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
              label="Course Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              fullWidth
              required
            />

            <TextField
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              fullWidth
              multiline
              rows={4}
              required
            />

            <FormControl fullWidth required>
              <InputLabel>Category</InputLabel>

              <Select
                value={category}
                label="Category"
                onChange={(e) => setCategory(e.target.value)}
              >
                <MenuItem value="Frontend">
                  Frontend
                </MenuItem>

                <MenuItem value="Backend">
                  Backend
                </MenuItem>

                <MenuItem value="Full Stack">
                  Full Stack
                </MenuItem>

                <MenuItem value="Database">
                  Database
                </MenuItem>

                <MenuItem value="Other">
                  Other
                </MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="Price"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              fullWidth
            />

            <TextField
              label="Thumbnail URL"
              value={thumbnail}
              onChange={(e) => setThumbnail(e.target.value)}
              fullWidth
            />

            <FormControlLabel
              control={
                <Switch
                  checked={isPublished}
                  onChange={(e) =>
                    setIsPublished(e.target.checked)
                  }
                />
              }
              label={
                isPublished
                  ? "Published"
                  : "Draft"
              }
            />

            <Button
              type="submit"
              variant="contained"
              size="large"
            >
              Update Course
            </Button>

            <Button
              variant="outlined"
              onClick={() =>
                navigate("/admin/courses")
              }
            >
              Cancel
            </Button>
          </Box>
        </Paper>
      </Box>
    </Layout>
  );
}

export default UpdateCourse;
