import Layout from "../../components/layout/Layout";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../servises/api";

import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Divider,
  Alert,
  Avatar,
  Stack,
  CircularProgress,
} from "@mui/material";

function Settings() {
  const navigate = useNavigate();

  // Profile
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  // Password
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // UI state
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Get admin profile
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

        setError(
          err.response?.data?.message ||
            "Failed to load admin profile"
        );
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchProfile();
  }, []);

  // Update profile
  const handleSubmit = async (event) => {
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

      setMessage("Profile updated successfully.");
    } catch (err) {
      console.error("Profile update error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to update profile"
      );
    } finally {
      setSavingProfile(false);
    }
  };

  // Change password
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

      setMessage(
        response.data?.message ||
          "Password changed successfully."
      );

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error("Change password error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to change password"
      );
    } finally {
      setChangingPassword(false);
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login", { replace: true });
  };

  // Avatar initials
  const getInitials = (value) => {
    if (!value) return "A";

    return value
      .trim()
      .split(/\s+/)
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Layout>
      <Box
        sx={{
          maxWidth: 900,
          mx: "auto",
          py: 2,
        }}
      >
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            fontWeight={800}
            gutterBottom
          >
            Account Settings
          </Typography>

          <Typography
            variant="body1"
            color="text.secondary"
          >
            Manage your administrator profile and security.
          </Typography>
        </Box>

        {/* Success */}
        {message && (
          <Alert
            severity="success"
            sx={{ mb: 3, borderRadius: 2 }}
          >
            {message}
          </Alert>
        )}

        {/* Error */}
        {error && (
          <Alert
            severity="error"
            sx={{ mb: 3, borderRadius: 2 }}
          >
            {error}
          </Alert>
        )}

        <Paper
          elevation={0}
          sx={{
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 4,
            overflow: "hidden",
          }}
        >
          {/* Profile banner */}
          <Box
            sx={{
              p: { xs: 3, sm: 4 },
              backgroundColor: "action.hover",
              display: "flex",
              alignItems: "center",
              gap: 2.5,
            }}
          >
            <Avatar
              sx={{
                width: 72,
                height: 72,
                fontSize: "1.5rem",
                fontWeight: "bold",
                bgcolor: "primary.main",
                boxShadow: 2,
              }}
            >
              {getInitials(name)}
            </Avatar>

            <Stack>
              <Typography
                variant="h6"
                fontWeight="bold"
              >
                {name || "Admin User"}
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
              >
                Administrator
              </Typography>
            </Stack>
          </Box>

          <Box sx={{ p: { xs: 3, sm: 4 } }}>

            {/* Personal details */}
            <Typography
              variant="h6"
              fontWeight={700}
              mb={3}
            >
              Personal Details
            </Typography>

            {loadingProfile ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  py: 4,
                }}
              >
                <CircularProgress />
              </Box>
            ) : (
              <Box
                component="form"
                onSubmit={handleSubmit}
              >
                <Stack
                  direction={{
                    xs: "column",
                    sm: "row",
                  }}
                  spacing={3}
                >
                  <TextField
                    label="Full Name"
                    value={name}
                    onChange={(e) =>
                      setName(e.target.value)
                    }
                    fullWidth
                    required
                  />

                  <TextField
                    label="Email Address"
                    type="email"
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                    fullWidth
                    required
                  />
                </Stack>

                <Box
                  sx={{
                    mt: 3,
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={savingProfile}
                    sx={{
                      px: 4,
                      py: 1.2,
                      borderRadius: 2,
                      textTransform: "none",
                      fontWeight: "bold",
                    }}
                  >
                    {savingProfile
                      ? "Saving..."
                      : "Save Changes"}
                  </Button>
                </Box>
              </Box>
            )}

            <Divider sx={{ my: 4 }} />

            {/* Change password */}
            <Typography
              variant="h6"
              fontWeight={700}
              mb={1}
            >
              Change Password
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              mb={3}
            >
              Your new password must contain at least 6
              characters.
            </Typography>

            <Box
              component="form"
              onSubmit={handleChangePassword}
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              <TextField
                label="Current Password"
                type="password"
                value={currentPassword}
                onChange={(e) =>
                  setCurrentPassword(e.target.value)
                }
                fullWidth
                required
              />

              <TextField
                label="New Password"
                type="password"
                value={newPassword}
                onChange={(e) =>
                  setNewPassword(e.target.value)
                }
                fullWidth
                required
                inputProps={{ minLength: 6 }}
              />

              <TextField
                label="Confirm New Password"
                type="password"
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(e.target.value)
                }
                fullWidth
                required
                inputProps={{ minLength: 6 }}
              />

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  mt: 1,
                }}
              >
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={changingPassword}
                  sx={{
                    px: 4,
                    py: 1.2,
                    borderRadius: 2,
                    textTransform: "none",
                    fontWeight: "bold",
                  }}
                >
                  {changingPassword
                    ? "Changing..."
                    : "Change Password"}
                </Button>
              </Box>
            </Box>

            <Divider sx={{ my: 4 }} />

            {/* Logout */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 2,
              }}
            >
              <Box>
                <Typography
                  variant="h6"
                  fontWeight={700}
                  color="error.main"
                >
                  Session Control
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  Sign out of your administrator account.
                </Typography>
              </Box>

              <Button
                variant="outlined"
                color="error"
                onClick={handleLogout}
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: "bold",
                  px: 3,
                  py: 1,
                }}
              >
                Logout
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Layout>
  );
}

export default Settings;