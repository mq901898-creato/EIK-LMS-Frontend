import React from "react";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Grid,
  Typography,
  Chip,
  Divider,
} from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";

import Layout from "../../components/layout/Layout";
import GlassCard from "../../components/common/GlassCard";

function readUser() {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    return null;
  }
}

export default function StudentProfile() {
  const navigate = useNavigate();
  const user = readUser();

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
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

  const details = [
    { label: "Student Full Name", value: user?.name || "Student Candidate", icon: PersonOutlinedIcon },
    { label: "Institutional Email", value: user?.email || "student@eik.edu", icon: EmailOutlinedIcon },
    { label: "Account Role", value: (user?.role || "Student").toUpperCase(), icon: SchoolIcon },
    { label: "Registration ID", value: user?.id || user?._id || "EIK-STU-2026", icon: BadgeOutlinedIcon },
  ];

  return (
    <Layout>
      <Box sx={{ width: "100%", maxWidth: 900, mx: "auto", display: "flex", flexDirection: "column", gap: 3.5 }}>
        {/* Header */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate("/student/dashboard")}
          >
            Dashboard
          </Button>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 800 }}>
              Student Profile
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              Academic credentials, account identification, and student status.
            </Typography>
          </Box>
        </Box>

        {!user ? (
          <Alert severity="warning">
            Your account session has expired. Please sign in again.
          </Alert>
        ) : (
          <GlassCard sx={{ p: 0, overflow: "hidden" }}>
            {/* Banner Gradient */}
            <Box
              sx={{
                height: 140,
                background: "linear-gradient(135deg, rgba(99, 102, 241, 0.4) 0%, rgba(6, 182, 212, 0.25) 100%)",
                borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
              }}
            />

            <Box sx={{ px: { xs: 3, sm: 4 }, pb: 4, pt: 0 }}>
              {/* Avatar & Title Row */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  alignItems: { xs: "center", sm: "flex-end" },
                  gap: 2.5,
                  mt: -6,
                  mb: 3,
                  textAlign: { xs: "center", sm: "left" },
                }}
              >
                <Avatar
                  sx={{
                    width: 96,
                    height: 96,
                    bgcolor: "#6366f1",
                    color: "#ffffff",
                    fontSize: "2.2rem",
                    fontWeight: 800,
                    border: "4px solid #0b0f19",
                    boxShadow: "0 0 30px rgba(99, 102, 241, 0.4)",
                  }}
                >
                  {initials}
                </Avatar>

                <Box sx={{ flex: 1 }}>
                  <Typography variant="h5" sx={{ fontWeight: 800 }}>
                    {user.name || "Student"}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    Extreme Institute of Knowledge • Active Scholar
                  </Typography>
                </Box>

                <Chip
                  label="VERIFIED STUDENT"
                  color="success"
                  size="small"
                  sx={{ fontWeight: 700, fontSize: "0.72rem" }}
                />
              </Box>

              <Divider sx={{ my: 3, borderColor: "rgba(255, 255, 255, 0.08)" }} />

              {/* Details Grid */}
              <Grid container spacing={2.5}>
                {details.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <Grid item xs={12} sm={6} key={index}>
                      <Box
                        sx={{
                          p: 2.5,
                          borderRadius: "10px",
                          bgcolor: "rgba(255, 255, 255, 0.02)",
                          border: "1px solid rgba(255, 255, 255, 0.06)",
                        }}
                      >
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, mb: 0.75 }}>
                          <Icon sx={{ color: "#818cf8", fontSize: 20 }} />
                          <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600 }}>
                            {item.label}
                          </Typography>
                        </Box>
                        <Typography variant="body1" sx={{ fontWeight: 700, pl: 3.75 }}>
                          {item.value}
                        </Typography>
                      </Box>
                    </Grid>
                  );
                })}
              </Grid>

              <Box sx={{ mt: 4, pt: 3, borderTop: "1px solid rgba(255, 255, 255, 0.08)", display: "flex", justifyContent: "flex-end" }}>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<LogoutIcon />}
                  onClick={handleLogout}
                >
                  Sign Out of Account
                </Button>
              </Box>
            </Box>
          </GlassCard>
        )}
      </Box>
    </Layout>
  );
}
