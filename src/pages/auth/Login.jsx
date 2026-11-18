import React, { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  IconButton,
  InputAdornment,
  Link,
  Stack,
  TextField,
  Typography,
  Chip,
} from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

import GlassCard from "../../components/common/GlassCard";
import { useAppTheme } from "../../context/useAppTheme";
import api from "../../servises/api";

const HIGHLIGHTS = [
  "Comprehensive Multi-Role LMS (Admin, Faculty, Student)",
  "Live WhatsApp Broadcast & Automated Delivery Gateway",
  "AI-Powered Quiz Generation & Instant Syllabus Assessments",
  "Real-Time Student Analytics & Submission Tracking",
];

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { mode } = useAppTheme();
  const isDark = mode === "dark";

  // Semantic color tokens
  const textPrimary = isDark ? "#f8fafc" : "#0f172a";
  const textSecondary = isDark ? "#94a3b8" : "#475569";
  const textMuted = isDark ? "#64748b" : "#94a3b8";
  const panelBg = isDark ? "rgba(11, 15, 25, 0.95)" : "rgba(241, 245, 249, 0.95)";
  const formBg = isDark ? "rgba(11, 15, 25, 0.75)" : "rgba(255, 255, 255, 0.9)";
  const dividerColor = isDark ? "rgba(255, 255, 255, 0.06)" : "rgba(0, 0, 0, 0.06)";
  const borderColor = isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)";
  const pageGradient = isDark
    ? "radial-gradient(circle at 15% 20%, rgba(99, 102, 241, 0.12) 0%, transparent 40%), radial-gradient(circle at 85% 80%, rgba(6, 182, 212, 0.08) 0%, transparent 40%)"
    : "radial-gradient(circle at 15% 20%, rgba(99, 102, 241, 0.06) 0%, transparent 40%), radial-gradient(circle at 85% 80%, rgba(6, 182, 212, 0.04) 0%, transparent 40%)";

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (loading) return;
    setLoading(true);
    setError("");
    try {
      const response = await api.post("/auth/login", {
        email: email.trim(),
        password,
      });
      const { token, user } = response.data;
      if (!token || !user) throw new Error("Invalid response received from authentication service.");
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      const role = user.role;
      if (role === "admin") navigate("/admin/dashboard");
      else if (role === "teacher") navigate("/teacher/dashboard");
      else navigate("/student/dashboard");
    } catch (err) {
      console.error("Login failure:", err);
      setError(
        err.response?.data?.message || err.message || "Authentication failed. Please verify your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: isDark ? "#030712" : "#f8fafc",
        backgroundImage: pageGradient,
        p: { xs: 2, sm: 4 },
      }}
    >
      <Container maxWidth="lg" sx={{ maxWidth: { sm: 1060 } }}>
        <GlassCard
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            overflow: "hidden",
            boxShadow: isDark
              ? "0 25px 60px -15px rgba(0, 0, 0, 0.8), 0 0 40px rgba(99, 102, 241, 0.1)"
              : "0 25px 60px -15px rgba(0, 0, 0, 0.12), 0 0 40px rgba(99, 102, 241, 0.06)",
            border: `1px solid ${borderColor}`,
          }}
        >
          {/* ── Left Brand Showcase Panel ── */}
          <Box
            sx={{
              flex: 1.1,
              p: { xs: 3.5, sm: 5, md: 6 },
              bgcolor: panelBg,
              borderRight: { md: `1px solid ${dividerColor}` },
              borderBottom: { xs: `1px solid ${dividerColor}`, md: "none" },
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <Box>
              {/* Academy Logo */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.75, mb: 4 }}>
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: "12px",
                    bgcolor: "rgba(99, 102, 241, 0.18)",
                    border: "1px solid rgba(99, 102, 241, 0.4)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#818cf8",
                    boxShadow: "0 0 20px rgba(99, 102, 241, 0.3)",
                  }}
                >
                  <SchoolIcon sx={{ fontSize: 26 }} />
                </Box>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 800, color: textPrimary, lineHeight: 1.1, letterSpacing: "-0.02em" }}>
                    Extreme Institute
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#818cf8", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                    Of Knowledge • EIK Cloud
                  </Typography>
                </Box>
              </Box>

              <Chip
                label="ENTERPRISE ACADEMIC PLATFORM"
                size="small"
                sx={{
                  bgcolor: "rgba(99, 102, 241, 0.12)",
                  color: "#818cf8",
                  border: "1px solid rgba(99, 102, 241, 0.3)",
                  fontWeight: 700,
                  fontSize: "0.68rem",
                  letterSpacing: "0.06em",
                  mb: 2.5,
                }}
              />

              <Typography variant="h4" sx={{ fontWeight: 800, color: textPrimary, lineHeight: 1.25, mb: 2, letterSpacing: "-0.02em" }}>
                Intelligent Institutional Workspace.
              </Typography>

              <Typography variant="body2" sx={{ color: textSecondary, mb: 4, lineHeight: 1.6 }}>
                Unified administration, automated student messaging, and intelligent AI assessment
                management built for elite educational academies.
              </Typography>

              <Stack spacing={2} sx={{ mb: 4 }}>
                {HIGHLIGHTS.map((item, index) => (
                  <Box key={index} sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <CheckCircleOutlineIcon sx={{ color: "#10b981", fontSize: 20, flexShrink: 0 }} />
                    <Typography variant="body2" sx={{ color: isDark ? "#cbd5e1" : "#334155", fontSize: "0.85rem" }}>
                      {item}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Box>

            <Box sx={{ pt: 2, borderTop: `1px solid ${dividerColor}` }}>
              <Typography variant="caption" sx={{ color: textMuted }}>
                Protected by 256-bit SSL • MongoDB Distributed Cluster
              </Typography>
            </Box>
          </Box>

          {/* ── Right Form Panel ── */}
          <Box
            sx={{
              flex: 1,
              p: { xs: 3.5, sm: 5, md: 6 },
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              bgcolor: formBg,
            }}
          >
            <Box sx={{ mb: 3.5 }}>
              <Typography variant="h5" sx={{ fontWeight: 800, color: textPrimary, mb: 0.5 }}>
                Sign into Workspace
              </Typography>
              <Typography variant="body2" sx={{ color: textSecondary }}>
                Enter your institutional credentials to access your console.
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError("")}>
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
              <TextField
                label="Email Address"
                type="email"
                required
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@eik.edu"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailOutlinedIcon sx={{ color: textMuted, fontSize: 20 }} />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                label="Password"
                type={showPassword ? "text" : "password"}
                required
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlinedIcon sx={{ color: textMuted, fontSize: 20 }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" size="small" sx={{ color: textMuted }}>
                        {showPassword ? <VisibilityOffOutlinedIcon fontSize="small" /> : <VisibilityOutlinedIcon fontSize="small" />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                disabled={loading}
                endIcon={!loading && <ArrowForwardIcon />}
                sx={{ py: 1.4, fontWeight: 700, fontSize: "0.95rem", bgcolor: "#6366f1", "&:hover": { bgcolor: "#4f46e5" } }}
              >
                {loading ? <CircularProgress size={24} sx={{ color: "#ffffff" }} /> : "Access Account"}
              </Button>
            </Box>

            <Box sx={{ mt: 4, textAlign: "center" }}>
              <Typography variant="body2" sx={{ color: textSecondary }}>
                New student joining the academy?{" "}
                <Link
                  component={RouterLink}
                  to="/register"
                  sx={{ color: "#818cf8", fontWeight: 700, textDecoration: "none", "&:hover": { textDecoration: "underline" } }}
                >
                  Create Student Account
                </Link>
              </Typography>
            </Box>
          </Box>
        </GlassCard>
      </Container>
    </Box>
  );
}
