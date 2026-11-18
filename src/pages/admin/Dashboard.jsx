import React, { useEffect, useState, useCallback } from "react";
import {
  Box,
  Typography,
  Grid,
  Alert,
  Button,
  IconButton,
  Tooltip,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import AddIcon from "@mui/icons-material/Add";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CloudDoneIcon from "@mui/icons-material/CloudDone";
import { useNavigate } from "react-router-dom";

import Layout from "../../components/layout/Layout";
import dashboardCards from "../../data/dashboardCards";
import StatCard from "../../components/common/StatCard";
import GlassCard from "../../components/common/GlassCard";
import api from "../../servises/api";

function AdminDashboard() {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const fetchDashboardData = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError("");

      const response = await api.get("/admin/dashboard");
      setDashboardData(response.data?.data || {});
    } catch (err) {
      console.error("Error fetching admin dashboard:", err);
      setError(
        err.response?.data?.message || "Failed to retrieve real-time academy metrics."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return (
    <Layout>
      <Box sx={{ width: "100%", display: "flex", flexDirection: "column", gap: 3.5 }}>
        {/* Page Header Bar */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", sm: "center" },
            flexDirection: { xs: "column", sm: "row" },
            gap: 2,
          }}
        >
          <Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                letterSpacing: "-0.02em",
                lineHeight: 1.2,
                mb: 0.5,
              }}
            >
              Academic Overview
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              Live telemetry and institutional metrics for Extreme Institute of Knowledge.
            </Typography>
          </Box>

          {/* Quick Action CTAs */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flexWrap: "wrap" }}>
            <Tooltip title="Refresh Data">
              <span>
                <IconButton
                  onClick={() => fetchDashboardData(true)}
                  disabled={loading || refreshing}
                  sx={{
                    border: "1px solid rgba(255, 255, 255, 0.12)",
                    borderRadius: "8px",
                    p: 1,
                  }}
                >
                  <RefreshIcon
                    fontSize="small"
                    sx={{
                      animation: refreshing ? "spin 1s linear infinite" : "none",
                      "@keyframes spin": {
                        "0%": { transform: "rotate(0deg)" },
                        "100%": { transform: "rotate(360deg)" },
                      },
                    }}
                  />
                </IconButton>
              </span>
            </Tooltip>

            <Button
              variant="outlined"
              size="small"
              startIcon={<PersonAddIcon />}
              onClick={() => navigate("/admin/addTeacher")}
            >
              Add Faculty
            </Button>

            <Button
              variant="contained"
              size="small"
              startIcon={<AddIcon />}
              onClick={() => navigate("/admin/courses")}
            >
              New Course
            </Button>
          </Box>
        </Box>

        {/* Error Alert with Retry */}
        {error && (
          <Alert
            severity="error"
            action={
              <Button color="inherit" size="small" onClick={() => fetchDashboardData()}>
                Retry
              </Button>
            }
          >
            {error}
          </Alert>
        )}

        {/* Top Metric Stat Cards */}
        <Grid container spacing={2.5}>
          {dashboardCards.map((card) => {
            const rawValue = dashboardData ? dashboardData[card.key] : 0;
            const value = typeof rawValue === "number" ? rawValue.toLocaleString() : rawValue || 0;

            return (
              <Grid item xs={12} sm={6} md={4} key={card.key}>
                <Box
                  onClick={() => card.path && navigate(card.path)}
                  sx={{ cursor: card.path ? "pointer" : "default", height: "100%" }}
                >
                  <StatCard
                    title={card.title}
                    value={value}
                    icon={card.icon}
                    color={card.color}
                    loading={loading}
                    trendLabel="Live institutional record"
                  />
                </Box>
              </Grid>
            );
          })}
        </Grid>

        {/* Quick Hub Navigation & Operational Health */}
        <Grid container spacing={2.5}>
          {/* WhatsApp Communications Highlight */}
          <Grid item xs={12} md={7}>
            <GlassCard
              hover
              sx={{
                p: 3,
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1.5 }}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: "10px",
                      bgcolor: "rgba(37, 211, 102, 0.12)",
                      border: "1px solid rgba(37, 211, 102, 0.3)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#25D366",
                    }}
                  >
                    <WhatsAppIcon fontSize="small" />
                  </Box>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      WhatsApp Broadcast & Automated Bot
                    </Typography>
                    <Typography variant="caption" sx={{ color: "text.secondary" }}>
                      Direct messaging gateway for announcements, reminders, and student alerts.
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="body2" sx={{ color: "text.secondary", mt: 1 }}>
                  Send targeted student notifications, enrollment approvals, and homework deadlines
                  directly to registered WhatsApp numbers via the unified messaging microservice.
                </Typography>
              </Box>

              <Box sx={{ pt: 3 }}>
                <Button
                  variant="outlined"
                  size="small"
                  endIcon={<ArrowForwardIcon />}
                  onClick={() => navigate("/admin/whatsapp")}
                  sx={{
                    borderColor: "rgba(37, 211, 102, 0.4)",
                    color: "#25D366",
                    "&:hover": {
                      borderColor: "#25D366",
                      bgcolor: "rgba(37, 211, 102, 0.08)",
                    },
                  }}
                >
                  Launch WhatsApp Hub
                </Button>
              </Box>
            </GlassCard>
          </Grid>

          {/* Infrastructure Health Status */}
          <Grid item xs={12} md={5}>
            <GlassCard sx={{ p: 3, height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
                  <CloudDoneIcon sx={{ color: "#10b981", fontSize: 24 }} />
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Core Services Status
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", flexDirection: "column", gap: 1.75 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography variant="body2" sx={{ color: "text.secondary" }}>
                      Node.js Express Backend
                    </Typography>
                    <Typography variant="caption" sx={{ color: "#10b981", fontWeight: 700, bgcolor: "rgba(16, 185, 129, 0.12)", px: 1, py: 0.25, borderRadius: 1 }}>
                      OPERATIONAL
                    </Typography>
                  </Box>

                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography variant="body2" sx={{ color: "text.secondary" }}>
                      MongoDB Database Cluster
                    </Typography>
                    <Typography variant="caption" sx={{ color: "#10b981", fontWeight: 700, bgcolor: "rgba(16, 185, 129, 0.12)", px: 1, py: 0.25, borderRadius: 1 }}>
                      CONNECTED
                    </Typography>
                  </Box>

                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography variant="body2" sx={{ color: "text.secondary" }}>
                      Authentication (JWT)
                    </Typography>
                    <Typography variant="caption" sx={{ color: "#818cf8", fontWeight: 700, bgcolor: "rgba(99, 102, 241, 0.12)", px: 1, py: 0.25, borderRadius: 1 }}>
                      ACTIVE
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <Box sx={{ pt: 2, borderTop: "1px solid rgba(255, 255, 255, 0.06)", mt: 2 }}>
                <Typography variant="caption" sx={{ color: "text.secondary" }}>
                  Extreme Institute of Knowledge Cloud • v2.0 Enterprise
                </Typography>
              </Box>
            </GlassCard>
          </Grid>
        </Grid>
      </Box>
    </Layout>
  );
}

export default AdminDashboard;
