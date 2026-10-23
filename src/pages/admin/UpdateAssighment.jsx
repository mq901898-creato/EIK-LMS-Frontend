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
} from "@mui/material";

function UpdateAssignment() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [course, setCourse] = useState("");
  const [dueDate, setDueDate] = useState("");

  useEffect(() => {
    const fetchAssignment = async () => {
      try {
        const response = await api.get(
          `/admin/getSingleAssignment/${id}`
        );

        const assignment = response.data.assignment;

        setTitle(assignment.title || "");
        setDescription(assignment.description || "");

        // course may be populated as an object
        setCourse(
          assignment.course?._id ||
          assignment.course ||
          ""
        );

        setDueDate(
          assignment.dueDate
            ? new Date(assignment.dueDate)
                .toISOString()
                .split("T")[0]
            : ""
        );

      } catch (error) {
        console.error(
          "Error fetching assignment:",
          error
        );

        console.error(
          "Backend:",
          error.response?.data
        );
      }
    };

    fetchAssignment();
  }, [id]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await api.put(
        `/admin/updateAssignment/${id}`,
        {
          title,
          description,
          course,
          dueDate,
        }
      );

      console.log(response.data);

      alert("Assignment updated successfully");

      navigate("/admin/assignments");

    } catch (error) {
      console.error(
        "Error updating assignment:",
        error
      );

      console.error(
        "Backend:",
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
            mb={3}
          >
            Update Assignment
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
              label="Title"
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

            <TextField
              label="Course ID"
              value={course}
              onChange={(e) =>
                setCourse(e.target.value)
              }
              fullWidth
              required
            />

            <TextField
              label="Due Date"
              type="date"
              value={dueDate}
              onChange={(e) =>
                setDueDate(e.target.value)
              }
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
              required
            />

            <Button
              type="submit"
              variant="contained"
              size="large"
            >
              Update Assignment
            </Button>

            <Button
              type="button"
              variant="outlined"
              onClick={() =>
                navigate("/admin/assignments")
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

export default UpdateAssignment;