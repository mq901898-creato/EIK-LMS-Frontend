import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  Button,
  Divider,
  Alert,
  Avatar,
  Stack,
  CircularProgress,
  Grid,
} from "@mui/material";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutlined";

import Layout from "../../components/layout/Layout";
import GlassCard from "../../components/common/GlassCard";
import api from "../../servises/api";

function Settings() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loadingProfile, setLoadingProfile] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoadingProfile(true);
        setError("");
        const response = await api.get("/admin/profile");
        setName(response.data?.admin?.name || "");
        setEmail(response.data?.admin?.email || "");
      } catch (err) {
        console.error("Profile error:", err);
        setError(err.response?.data?.message || "Failed to load admin profile.");
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchProfile();
  }, []);

  const handleProfileSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");
    setSavingProfile(true);

    try {
      const response = await api.put("/admin/profile", {
        name: name.trim(),
        email: email.trim(),
      });

      setName(response.data?.admin?.name || name);
      setEmail(response.data?.admin?.email || email);

      const existingUser = JSON.parse(localStorage.getItem("user") || "{}");
      localStorage.setItem("user", JSON.stringify({ ...existingUser, name, email }));

      setMessage("Administrator profile saved successfully.");
    } catch (err) {
      console.error("Profile update error:", err);
      setError(err.response?.data?.message || "Failed to update profile.");
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");

    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    setChangingPassword(true);

    try {
      const response = await api.put("/admin/changePassword", {
        currentPassword,
        newPassword,
        confirmPassword,
      });

      setMessage(response.data?.message || "Administrator password changed successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error("Change password error:", err);
      setError(err.response?.data?.message || "Failed to change password.");
    } finally {
      setChangingPassword(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  const getInitials = (val) => {
    if (!val) return "A";
    return val
      .trim()
      .split(/\s+/)
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Layout>
      <Box sx={{ width: "100%", maxWidth: 1000, mx: "auto", display: "flex", flexDirection: "column", gap: 3.5 }}>
        {/* Header */}
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>
            Account & System Settings
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>
            Configure administrative security, master credentials, and workspace preferences.
          </Typography>
        </Box>

        {/* Status Alerts */}
        {error && (
          <Alert severity="error" onClose={() => setError("")}>
            {error}
          </Alert>
        )}
        {message && (
          <Alert severity="success" onClose={() => setMessage("")}>
            {message}
          </Alert>
        )}

        <Grid container spacing={3}>
          {/* Profile Overview Card */}
          <Grid item xs={12} md={4}>
            <GlassCard sx={{ p: 3, textAlign: "center", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <Avatar
                  sx={{
                    width: 72,
                    height: 72,
                    bgcolor: "#6366f1",
                    fontSize: "1.8rem",
                    fontWeight: 800,
                    boxShadow: "0 0 24px rgba(99, 102, 241, 0.4)",
                    mb: 2,
                  }}
                >
                  {getInitials(name)}
                </Avatar>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  {loadingProfile ? "Loading..." : name || "System Admin"}
                </Typography>
                <Typography variant="caption" sx={{ color: "text.secondary", mb: 2 }}>
                  {email || "admin@eik.edu"}
                </Typography>

                <Box
                  sx={{
                    px: 1.5,
                    py: 0.5,
                    borderRadius: "6px",
                    bgcolor: "rgba(99, 102, 241, 0.1)",
                    border: "1px solid rgba(99, 102, 241, 0.25)",
                    color: "#818cf8",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    letterSpacing: "0.04em",
                  }}
                >
                  SUPERADMINISTRATOR
                </Box>
              </Box>

              <Box sx={{ pt: 3, borderTop: "1px solid rgba(255, 255, 255, 0.06)", mt: 3 }}>
                <Button
                  fullWidth
                  variant="outlined"
                  color="error"
                  startIcon={<LogoutIcon />}
                  onClick={handleLogout}
                  size="small"
                >
                  Terminate Session
                </Button>
              </Box>
            </GlassCard>
          </Grid>

          {/* Profile & Password Editing */}
          <Grid item xs={12} md={8}>
            <Stack spacing={3}>
              {/* Profile Details Form */}
              <GlassCard component="form" onSubmit={handleProfileSubmit} sx={{ p: 3.5 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
                  <PersonOutlinedIcon sx={{ color: "#6366f1" }} />
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Profile Information
                  </Typography>
                </Box>

                <Stack spacing={2.5}>
                  <TextField
                    label="Administrator Name"
                    required
                    fullWidth
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    size="small"
                  />
                  <TextField
                    label="Master Email Address"
                    type="email"
                    required
                    fullWidth
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    size="small"
                  />

                  <Button
                    type="submit"
                    variant="contained"
                    disabled={savingProfile || loadingProfile}
                    sx={{ alignSelf: "flex-start", px: 3 }}
                  >
                    {savingProfile ? "Saving..." : "Save Profile"}
                  </Button>
                </Stack>
              </GlassCard>

              {/* Password & Security Form */}
              <GlassCard component="form" onSubmit={handleChangePassword} sx={{ p: 3.5 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
                  <SecurityOutlinedIcon sx={{ color: "#f59e0b" }} />
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Change Security Credentials
                  </Typography>
                </Box>

                <Stack spacing={2.5}>
                  <TextField
                    label="Current Password"
                    type="password"
                    required
                    fullWidth
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    size="small"
                  />
                  <TextField
                    label="New Password"
                    type="password"
                    required
                    fullWidth
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    size="small"
                    helperText="Minimum 6 characters"
                  />
                  <TextField
                    label="Confirm New Password"
                    type="password"
                    required
                    fullWidth
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    size="small"
                  />

                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={changingPassword}
                    sx={{ alignSelf: "flex-start", px: 3 }}
                  >
                    {changingPassword ? "Updating..." : "Update Password"}
                  </Button>
                </Stack>
              </GlassCard>
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </Layout>
  );
}

export default Settings;
