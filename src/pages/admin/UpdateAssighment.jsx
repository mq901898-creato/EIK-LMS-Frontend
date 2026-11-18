import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  Button,
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

function UpdateAssignment() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [course, setCourse] = useState("");
  const [dueDate, setDueDate] = useState("");

  const [fetching, setFetching] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAssignment = async () => {
      try {
        setFetching(true);
        const response = await api.get(`/admin/getSingleAssignment/${id}`);
        const assignment = response.data?.assignment;

        setTitle(assignment?.title || "");
        setDescription(assignment?.description || "");
        setCourse(assignment?.course?._id || assignment?.course || "");
        setDueDate(
          assignment?.dueDate
            ? new Date(assignment.dueDate).toISOString().split("T")[0]
            : ""
        );
      } catch (err) {
        console.error("Error fetching assignment:", err);
        setError(err.response?.data?.message || "Failed to load assignment details.");
      } finally {
        setFetching(false);
      }
    };

    if (id) fetchAssignment();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await api.put(`/admin/updateAssignment/${id}`, {
        title: title.trim(),
        description: description.trim(),
        course,
        dueDate,
      });

      navigate("/admin/assignments");
    } catch (err) {
      console.error("Error updating assignment:", err);
      setError(err.response?.data?.message || "Failed to update assignment.");
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
            onClick={() => navigate("/admin/assignments")}
          >
            Back
          </Button>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 800 }}>
              Edit Coursework Assignment
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              Modify tasks, deadline dates, and description instructions.
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
              <Skeleton height={100} />
              <Skeleton height={50} width={200} />
            </Stack>
          ) : (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  label="Assignment Title"
                  required
                  fullWidth
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Submission Due Date"
                  type="date"
                  required
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Assignment Instructions & Guidelines"
                  multiline
                  minRows={4}
                  required
                  fullWidth
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
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
                    {loading ? "Saving Changes..." : "Save Assignment"}
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => navigate("/admin/assignments")}
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

export default UpdateAssignment;
