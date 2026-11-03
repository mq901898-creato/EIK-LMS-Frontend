import { Alert, Avatar, Box, Card, CardContent, Container, Grid, Paper, Typography, useTheme } from "@mui/material";
import StudentLayout from "../components/student/StudentLayout";

function readUser() {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    return null;
  }
}

function StudentProfile() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const user = readUser();
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
    { label: "Full name", value: user?.name || "Not available" },
    { label: "Email address", value: user?.email || "Not available" },
    { label: "Account role", value: user?.role || "Student" },
    { label: "Student ID", value: user?.id || user?._id || "Not available" },
  ];

  return (
    <StudentLayout>
      <Container maxWidth="md" disableGutters>
        {!user ? (
          <Alert severity="warning" sx={{ borderRadius: 2.5 }}>
            Your account information is not available. Please log in again.
          </Alert>
        ) : (
          <Card
            elevation={0}
            sx={{
              overflow: "hidden",
              border: "1px solid #e5eaf2",
              borderRadius: { xs: 3, sm: 4 },
              boxShadow: "0 8px 28px rgba(15, 23, 42, 0.045)",
            }}
          >
            <Box
              sx={{
                height: { xs: 104, sm: 144 },
                background:
                  "linear-gradient(120deg, #172554 0%, #1d4ed8 58%, #60a5fa 100%)",
              }}
            />
            <CardContent sx={{ px: { xs: 2, sm: 3.5 }, pb: { xs: 2.5, sm: 3.5 } }}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  alignItems: { xs: "center", sm: "flex-end" },
                  gap: 2,
                  mt: { xs: -6, sm: -7 },
                  mb: 3.5,
                  textAlign: { xs: "center", sm: "left" },
                }}
              >
                <Avatar
                  sx={{
                    width: { xs: 88, sm: 104 },
                    height: { xs: 88, sm: 104 },
                    bgcolor: "#eff6ff",
                    color: "#1d4ed8",
                    fontSize: { xs: 30, sm: 36 },
                    fontWeight: 800,
                    border: "4px solid #fff",
                    boxShadow: "0 6px 20px rgba(15, 23, 42, 0.12)",
                  }}
                >
                  {initials}
                </Avatar>
                <Box sx={{ minWidth: 0, pb: { sm: 0.75 } }}>
                  <Typography
                    component="h2"
                    sx={{
                      color: isDark ? "text.primary" : "#172033",
                      fontSize: { xs: "1.35rem", sm: "1.65rem" },
                      fontWeight: 800,
                      overflowWrap: "anywhere",
                    }}
                  >
                    {user.name || "Student"}
                  </Typography>
                  <Typography color="text.secondary" sx={{ overflowWrap: "anywhere" }}>
                    {user.email || "No email provided"}
                  </Typography>
                </Box>
              </Box>

              <Typography
                component="h3"
                sx={{ mb: 1.75, color: isDark ? "text.primary" : "#172033", fontSize: "1rem", fontWeight: 750 }}
              >
                Account information
              </Typography>
              <Grid container spacing={1.5}>
                {details.map(({ label, value }) => (
                  <Grid key={label} size={{ xs: 12, sm: 6 }}>
                    <ProfileDetail label={label} value={value} isDark={isDark} />
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        )}
      </Container>
    </StudentLayout>
  );
}

function ProfileDetail({ label, value, isDark }) {
  return (
    <Paper
      variant="outlined"
      sx={{
        minWidth: 0,
        height: "100%",
        px: { xs: 1.75, sm: 2 },
        py: 1.75,
        borderColor: isDark ? "divider" : "#e8edf5",
        borderRadius: 2.5,
        bgcolor: isDark ? "background.default" : "#f8fafc",
      }}
    >
      <Typography
        variant="caption"
        sx={{ display: "block", color: isDark ? "text.secondary" : "#64748b", fontWeight: 650 }}
      >
        {label}
      </Typography>
      <Typography
        sx={{
          mt: 0.5,
          color: isDark ? "text.primary" : "#172033",
          fontSize: "0.95rem",
          fontWeight: 650,
          overflowWrap: "anywhere",
        }}
      >
        {value}
      </Typography>
    </Paper>
  );
}

export default StudentProfile;
