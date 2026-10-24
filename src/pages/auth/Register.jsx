import { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";

import {
  Alert,
  Avatar,
  Box,
  Button,
  CircularProgress,
  Container,
  FormControl,
  FormLabel,
  InputAdornment,
  Link,
  Paper,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";

import api from "../../servises/api";

const GENDERS = ["Male", "Female", "Other"];

const HIGHLIGHTS = [
  {
    title: "Learn anytime",
    text: "Access your courses and material whenever you need them.",
  },
  {
    title: "Track progress",
    text: "See your results and growth in one place.",
  },
  {
    title: "Stay connected",
    text: "Reach your instructors without leaving the portal.",
  },
];

const inputSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: 2,
    bgcolor: (theme) => alpha(theme.palette.text.primary, 0.025),
    transition: "background-color 0.2s ease",
    "&:hover": {
      bgcolor: (theme) => alpha(theme.palette.text.primary, 0.04),
    },
    "&.Mui-focused": { bgcolor: "background.paper" },
  },
};

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("Male");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setFeedback(null);

    try {
      const response = await api.post("/student/register", {
        name,
        email,
        password,
        phone,
        Gender: gender,
        role: "student",
      });

      console.log(response.data);

      setFeedback({
        type: "success",
        message: "Student registered successfully. Redirecting to login...",
      });

      setTimeout(() => navigate("/login"), 1200);
    } catch (error) {
      console.error("STUDENT REGISTRATION ERROR:", error);

      setFeedback({
        type: "error",
        message: error.response?.data?.message || "Registration failed",
      });
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
        py: { xs: 0, sm: 4 },
        px: { xs: 0, sm: 2 },
        background: (theme) =>
          `linear-gradient(135deg, ${alpha(
            theme.palette.primary.main,
            0.1
          )} 0%, ${theme.palette.background.default} 55%)`,
      }}
    >
      <Container maxWidth="lg" disableGutters sx={{ maxWidth: { sm: 1000 } }}>
        <Paper
          elevation={0}
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            overflow: "hidden",
            minHeight: { xs: "100vh", sm: "auto", md: 640 },
            borderRadius: { xs: 0, sm: 4 },
            border: { xs: "none", sm: "1px solid" },
            borderColor: "divider",
            boxShadow: {
              xs: "none",
              sm: "0 24px 60px rgba(15, 23, 42, 0.12)",
            },
          }}
        >
          {/* Brand panel */}
          <Box
            sx={{
              position: "relative",
              overflow: "hidden",
              flex: { md: "0 0 42%" },
              color: "primary.contrastText",
              p: { xs: 3, sm: 4, md: 5 },
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              gap: 4,
              background: (theme) =>
                `linear-gradient(155deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
            }}
          >
            {/* Decorative shapes */}
            <Box
              sx={{
                position: "absolute",
                width: 280,
                height: 280,
                borderRadius: "50%",
                top: -90,
                right: -90,
                bgcolor: "rgba(255,255,255,0.08)",
              }}
            />
            <Box
              sx={{
                position: "absolute",
                width: 200,
                height: 200,
                borderRadius: "50%",
                bottom: -70,
                left: -60,
                bgcolor: "rgba(255,255,255,0.06)",
                display: { xs: "none", md: "block" },
              }}
            />

            <Stack
              direction="row"
              alignItems="center"
              spacing={1.5}
              sx={{ position: "relative" }}
            >
              <Avatar
                variant="rounded"
                sx={{
                  width: 42,
                  height: 42,
                  bgcolor: "rgba(255,255,255,0.2)",
                  color: "inherit",
                  fontWeight: 800,
                  borderRadius: 2,
                }}
              >
                S
              </Avatar>
              <Typography variant="h6" fontWeight={700} letterSpacing={0.3}>
                Student Portal
              </Typography>
            </Stack>

            <Box sx={{ position: "relative" }}>
              <Typography
                variant="h4"
                fontWeight={800}
                gutterBottom
                sx={{
                  fontSize: { xs: "1.6rem", md: "2.1rem" },
                  lineHeight: 1.2,
                }}
              >
                Start your learning journey today
              </Typography>
              <Typography sx={{ opacity: 0.85, maxWidth: 380 }}>
                Create your student account in a minute and get access to
                everything you need.
              </Typography>
            </Box>

            <Stack
              spacing={2}
              sx={{ position: "relative", display: { xs: "none", md: "flex" } }}
            >
              {HIGHLIGHTS.map((item) => (
                <Stack
                  key={item.title}
                  direction="row"
                  spacing={1.75}
                  alignItems="flex-start"
                >
                  <Box
                    sx={{
                      width: 26,
                      height: 26,
                      flexShrink: 0,
                      mt: "2px",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      bgcolor: "rgba(255,255,255,0.2)",
                      fontSize: 14,
                      fontWeight: 700,
                    }}
                  >
                    ✓
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" fontWeight={700}>
                      {item.title}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                      {item.text}
                    </Typography>
                  </Box>
                </Stack>
              ))}
            </Stack>
          </Box>

          {/* Form panel */}
          <Box
            sx={{
              flex: 1,
              bgcolor: "background.paper",
              p: { xs: 3, sm: 5, md: 6 },
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Typography variant="h4" fontWeight={800} sx={{ fontSize: { xs: "1.5rem", sm: "1.9rem" } }}>
              Create account
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 0.75, mb: 3.5 }}>
              Fill in your details to register as a student.
            </Typography>

            {feedback && (
              <Alert
                severity={feedback.type}
                variant="outlined"
                sx={{ mb: 3, borderRadius: 2 }}
              >
                {feedback.message}
              </Alert>
            )}

            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                columnGap: 2,
                rowGap: 2.5,
              }}
            >
              <TextField
                label="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                fullWidth
                required
                sx={inputSx}
              />

              <TextField
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                fullWidth
                required
                sx={inputSx}
              />

              <TextField
                label="Password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                fullWidth
                required
                sx={inputSx}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Button
                        size="small"
                        onClick={() => setShowPassword((prev) => !prev)}
                        sx={{
                          textTransform: "none",
                          minWidth: 0,
                          fontWeight: 600,
                        }}
                      >
                        {showPassword ? "Hide" : "Show"}
                      </Button>
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                label="Phone Number"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                autoComplete="tel"
                fullWidth
                sx={inputSx}
              />

              <FormControl sx={{ gridColumn: { sm: "1 / -1" } }}>
                <FormLabel
                  sx={{
                    mb: 1,
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    color: "text.primary",
                    "&.Mui-focused": { color: "text.primary" },
                  }}
                >
                  Gender
                </FormLabel>

                <ToggleButtonGroup
                  exclusive
                  fullWidth
                  color="primary"
                  value={gender}
                  onChange={(_, value) => value && setGender(value)}
                  aria-label="Gender"
                  sx={{
                    "& .MuiToggleButton-root": {
                      py: 1.1,
                      textTransform: "none",
                      fontWeight: 600,
                    },
                    "& .MuiToggleButtonGroup-grouped:first-of-type": {
                      borderTopLeftRadius: 8,
                      borderBottomLeftRadius: 8,
                    },
                    "& .MuiToggleButtonGroup-grouped:last-of-type": {
                      borderTopRightRadius: 8,
                      borderBottomRightRadius: 8,
                    },
                  }}
                >
                  {GENDERS.map((g) => (
                    <ToggleButton key={g} value={g}>
                      {g}
                    </ToggleButton>
                  ))}
                </ToggleButtonGroup>
              </FormControl>

              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                disabled={loading}
                sx={{
                  gridColumn: { sm: "1 / -1" },
                  mt: 1,
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 700,
                  fontSize: "1rem",
                  boxShadow: (theme) =>
                    `0 8px 20px ${alpha(theme.palette.primary.main, 0.35)}`,
                  "&:hover": {
                    boxShadow: (theme) =>
                      `0 10px 24px ${alpha(theme.palette.primary.main, 0.45)}`,
                  },
                }}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Register Student"
                )}
              </Button>

              <Typography
                variant="body2"
                textAlign="center"
                color="text.secondary"
                sx={{ gridColumn: { sm: "1 / -1" }, mt: 0.5 }}
              >
                Already have an account?{" "}
                <Link
                  component={RouterLink}
                  to="/login"
                  underline="hover"
                  fontWeight={700}
                >
                  Login
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default Register;