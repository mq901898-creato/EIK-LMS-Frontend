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
} from "@mui/material";

function AddCourse() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [thumbnail, setThumbnail] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await api.post("/admin/addCourse", {
        title,
        description,
        category,
        price,
        thumbnail,
      });

      console.log(response.data);

      alert("Course added successfully");

      navigate("/admin/courses");

    } catch (error) {
      console.error("Error adding course:", error);
      console.error(
        "Backend response:",
        error.response?.data
      );
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
            Add Course
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
              onChange={(e) =>
                setTitle(e.target.value)
              }
              fullWidth
              required
            />

            <TextField
              label="Description"
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
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
                onChange={(e) =>
                  setCategory(e.target.value)
                }
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
              onChange={(e) =>
                setPrice(e.target.value)
              }
              fullWidth
            />

            <TextField
              label="Thumbnail URL"
              value={thumbnail}
              onChange={(e) =>
                setThumbnail(e.target.value)
              }
              fullWidth
            />

            <Button
              type="submit"
              variant="contained"
              size="large"
            >
              Add Course
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

export default AddCourse;