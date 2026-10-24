import { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { createTheme, ThemeProvider, alpha } from "@mui/material/styles";
import {
  Alert,
  Avatar,
  Box,
  Button,
  CircularProgress,
  Container,
  InputAdornment,
  Link,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import api from "../../servises/api";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1565c0",
      light: "#42a5f5",
      dark: "#0d47a1",
      contrastText: "#fff",
    },
    secondary: {
      main: "#000000",
    },
  },
});

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
    bgcolor: (t) => alpha(t.palette.text.primary, 0.025),
    transition: "background-color 0.2s ease",
    "&:hover": {
      bgcolor: (t) => alpha(t.palette.text.primary, 0.04),
    },
    "&.Mui-focused": { bgcolor: "background.paper" },
  },
};

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (loading) return;

    setLoading(true);
    setError("");

    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      console.log(response.data);

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      const role = response.data.user.role;

      if (role === "admin") {
        navigate("/admin/dashboard");
      } else if (role === "teacher") {
        navigate("/teacher/dashboard");
      } else if (role === "student") {
        navigate("/student/courses");
      } else {
        setError("Unknown user role. Please contact support.");
        setLoading(false);
      }
    } catch (err) {
      console.log(err);
      setError(
        err.response?.data?.message ||
          "Login failed. Please check your credentials."
      );
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          py: { xs: 0, sm: 4 },
          px: { xs: 0, sm: 2 },
          background: (t) =>
            `linear-gradient(135deg, ${alpha(
              t.palette.primary.main,
              0.1
            )} 0%, ${t.palette.background.default} 55%)`,
        }}
      >
        <Container
          maxWidth="lg"
          disableGutters
          sx={{ maxWidth: { sm: 1000 } }}
        >
          <Paper
            elevation={0}
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              overflow: "hidden",
              minHeight: { xs: "100vh", sm: "auto", md: 600 },
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
                background: (t) =>
                  `linear-gradient(155deg, ${t.palette.primary.main} 0%, ${t.palette.primary.dark} 100%)`,
              }}
            >
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
                  Welcome back
                </Typography>
                <Typography sx={{ opacity: 0.85, maxWidth: 380 }}>
                  Sign in to continue to your dashboard and pick up where you
                  left off.
                </Typography>
              </Box>

              <Stack
                spacing={2}
                sx={{
                  position: "relative",
                  display: { xs: "none", md: "flex" },
                }}
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
              <Typography
                variant="h4"
                fontWeight={800}
                sx={{ fontSize: { xs: "1.5rem", sm: "1.9rem" } }}
              >
                Sign in
              </Typography>
              <Typography color="text.secondary" sx={{ mt: 0.75, mb: 3.5 }}>
                Enter your email and password to access your account.
              </Typography>

              {error && (
                <Alert
                  severity="error"
                  variant="outlined"
                  sx={{ mb: 3, borderRadius: 2 }}
                >
                  {error}
                </Alert>
              )}

              <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}
              >
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
                  autoComplete="current-password"
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

                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  fullWidth
                  disabled={loading}
                  sx={{
                    mt: 1,
                    py: 1.5,
                    borderRadius: 2,
                    textTransform: "none",
                    fontWeight: 700,
                    fontSize: "1rem",
                    boxShadow: (t) =>
                      `0 8px 20px ${alpha(t.palette.primary.main, 0.35)}`,
                    "&:hover": {
                      boxShadow: (t) =>
                        `0 10px 24px ${alpha(t.palette.primary.main, 0.45)}`,
                    },
                  }}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Login"
                  )}
                </Button>

                <Typography
                  variant="body2"
                  textAlign="center"
                  color="text.secondary"
                  sx={{ mt: 0.5 }}
                >
                  Don&apos;t have an account?{" "}
                  <Link
                    component={RouterLink}
                    to="/register"
                    underline="hover"
                    fontWeight={700}
                  >
                    Register
                  </Link>
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default Login;