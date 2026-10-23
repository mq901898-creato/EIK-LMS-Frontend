import React, { useState } from "react";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Grid,
  IconButton,
  Paper,
  Stack,
  Tab,
  Tabs,
  Tooltip,
  Typography,
} from "@mui/material";

import StudentLayout from "../components/student/StudentLayout";

function StudentProfile() {
  const [tabValue, setTabValue] = useState(0);
  const [copied, setCopied] = useState(false);

  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  });

  const refreshProfile = () => {
    try {
      setUser(JSON.parse(localStorage.getItem("user") || "null"));
    } catch {
      setUser(null);
    }
  };

  const handleCopyId = (id) => {
    if (!id) return;
    navigator.clipboard.writeText(id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const initials = user?.name
    ? user.name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part[0])
        .join("")
        .toUpperCase()
    : "S";

  const userId = user?.id || user?._id || "N/A";

  return (
    <StudentLayout>
      <Box sx={{ minHeight: "100vh", bgcolor: "#f8fafc", py: { xs: 2, md: 4 } }}>
        <Container maxWidth="lg">
          {/* Top Header */}
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            flexWrap="wrap"
            gap={2}
            sx={{ mb: 4 }}
          >
          </Stack>

          {!user ? (
            <Alert
              severity="warning"
              sx={{
                borderRadius: 3,
                boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
              }}
            >
              Your account information is not available. Please log in again.
            </Alert>
          ) : (
            <Card
              elevation={0}
              sx={{
                borderRadius: 4,
                overflow: "hidden",
                border: "1px solid",
                borderColor: "#e2e8f0",
                boxShadow: "0 10px 30px -5px rgba(15, 23, 42, 0.05)",
                bgcolor: "#ffffff",
              }}
            >
              {/* Banner Background */}
              <Box
                sx={{
                  height: { xs: 140, sm: 180 },
                  background:
                    "linear-gradient(135deg, #1e3a8a 0%, #2563eb 50%, #3b82f6 100%)",
                  position: "relative",
                }}
              />

              <CardContent sx={{ px: { xs: 2.5, sm: 4 }, pb: 4, pt: 0 }}>
                {/* Profile Header Block */}
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  alignItems={{ xs: "center", sm: "flex-end" }}
                  justifyContent="space-between"
                  spacing={2}
                  sx={{ mt: { xs: -7, sm: -8 }, mb: 3 }}
                >
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    alignItems={{ xs: "center", sm: "flex-end" }}
                    spacing={2.5}
                  >
                    <Avatar
                      sx={{
                        width: { xs: 100, sm: 120 },
                        height: { xs: 100, sm: 120 },
                        bgcolor: "#eff6ff",
                        color: "#1d4ed8",
                        fontSize: { xs: 32, sm: 40 },
                        fontWeight: 800,
                        border: "4px solid #ffffff",
                        boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
                      }}
                    >
                      {initials}
                    </Avatar>

                    <Box
                      sx={{
                        pb: { xs: 0, sm: 0.5 },
                        textAlign: { xs: "center", sm: "left" },
                      }}
                    >
                      <Typography
                        variant="h5"
                        sx={{ fontWeight: 800, color: "#0f172a" }}
                      >
                        {user.name || "Student"}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.2 }}>
                        {user.email || "No email provided"}
                      </Typography>
                    </Box>
                  </Stack>

                  <Stack direction="row" spacing={1} alignItems="center">
                    <Chip
                      label={user.role || "Student"}
                      sx={{
                        textTransform: "capitalize",
                        fontWeight: 700,
                        bgcolor: "#dbeafe",
                        color: "#1e40af",
                        borderRadius: 2,
                      }}
                    />
                    <Chip
                      label="Active"
                      size="small"
                      sx={{
                        bgcolor: "#dcfce7",
                        color: "#15803d",
                        fontWeight: 700,
                        borderRadius: 2,
                      }}
                    />
                  </Stack>
                </Stack>

                {/* Tabs Navigation */}
                <Box sx={{ borderBottom: 1, borderColor: "#e2e8f0", mb: 3 }}>
                  <Tabs
                    value={tabValue}
                    onChange={(e, val) => setTabValue(val)}
                    textColor="primary"
                    indicatorColor="primary"
                    sx={{
                      "& .MuiTab-root": {
                        textTransform: "none",
                        fontWeight: 600,
                        fontSize: "0.95rem",
                        minWidth: 100,
                      },
                    }}
                  >
                    <Tab label="Overview" />
                    <Tab label="Academic Information" />
                    <Tab label="Account & Security" />
                  </Tabs>
                </Box>

                {/* TAB 0: OVERVIEW */}
                {tabValue === 0 && (
                  <Box>
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 700, color: "#0f172a", mb: 2.5 }}
                    >
                      Personal Details
                    </Typography>

                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <InfoTile
                          label="Full Name"
                          value={user.name || "Not available"}
                        />
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <InfoTile
                          label="Email Address"
                          value={user.email || "Not available"}
                        />
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <InfoTile
                          label="Student ID"
                          value={userId}
                          action={
                            <Tooltip title={copied ? "Copied!" : "Copy ID"}>
                              <Button
                                size="small"
                                onClick={() => handleCopyId(userId)}
                                sx={{ textTransform: "none", fontSize: "0.75rem" }}
                              >
                                {copied ? "Copied" : "Copy"}
                              </Button>
                            </Tooltip>
                          }
                        />
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <InfoTile
                          label="Account Role"
                          value={user.role || "student"}
                          capitalize
                        />
                      </Grid>
                    </Grid>

                    <Alert
                      severity="info"
                      sx={{
                        mt: 4,
                        borderRadius: 3,
                        bgcolor: "#f0f9ff",
                        borderColor: "#bae6fd",
                        color: "#0369a1",
                      }}
                    >
                      <strong>Notice:</strong> Detailed records like phone number, gender, and classes will require fetching the complete student profile from your backend.
                    </Alert>
                  </Box>
                )}

                {/* TAB 1: ACADEMIC INFO */}
                {tabValue === 1 && (
                  <Box>
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 700, color: "#0f172a", mb: 2.5 }}
                    >
                      Academic Profile
                    </Typography>

                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <InfoTile
                          label="Program / Degree"
                          value={user.program || "Bachelor of Computer Science"}
                        />
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <InfoTile
                          label="Current Semester / Class"
                          value={user.class || "Semester 5 (Section A)"}
                        />
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <InfoTile
                          label="Gender"
                          value={user.gender || "Not specified"}
                        />
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <InfoTile
                          label="Contact Phone"
                          value={user.phone || "Not provided"}
                        />
                      </Grid>
                    </Grid>
                  </Box>
                )}

                {/* TAB 2: ACCOUNT & SECURITY */}
                {tabValue === 2 && (
                  <Box>
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 700, color: "#0f172a", mb: 2.5 }}
                    >
                      Security Settings
                    </Typography>

                    <Paper
                      variant="outlined"
                      sx={{
                        p: 3,
                        borderRadius: 3,
                        borderColor: "#e2e8f0",
                        bgcolor: "#f8fafc",
                      }}
                    >
                      <Stack
                        direction={{ xs: "column", sm: "row" }}
                        justifyContent="space-between"
                        alignItems={{ xs: "flex-start", sm: "center" }}
                        spacing={2}
                      >
                        <Box>
                          <Typography fontWeight={700} color="#0f172a">
                            Password & Security
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Ensure your password is strong and updated regularly.
                          </Typography>
                        </Box>

                        <Button
                          variant="contained"
                          sx={{
                            textTransform: "none",
                            borderRadius: 2.5,
                            bgcolor: "#1e293b",
                            "&:hover": { bgcolor: "#0f172a" },
                          }}
                        >
                          Change Password
                        </Button>
                      </Stack>
                    </Paper>
                  </Box>
                )}
              </CardContent>
            </Card>
          )}
        </Container>
      </Box>
    </StudentLayout>
  );
}

// Reusable Field Info Tile
function InfoTile({ label, value, capitalize = false, action = null }) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        borderRadius: 3,
        bgcolor: "#f8fafc",
        border: "1px solid #f1f5f9",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        transition: "all 0.2s ease-in-out",
        "&:hover": {
          bgcolor: "#f1f5f9",
          borderColor: "#e2e8f0",
        },
      }}
    >
      <Box sx={{ minWidth: 0 }}>
        <Typography variant="caption" color="text.secondary" fontWeight={600}>
          {label}
        </Typography>
        <Typography
          variant="body1"
          fontWeight={700}
          color="#0f172a"
          sx={{
            overflowWrap: "anywhere",
            textTransform: capitalize ? "capitalize" : "none",
            fontSize: "0.95rem",
            mt: 0.2,
          }}
        >
          {value}
        </Typography>
      </Box>

      {action && <Box sx={{ ml: 1 }}>{action}</Box>}
    </Paper>
  );
}

export default StudentProfile;