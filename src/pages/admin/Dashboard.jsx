import Layout from "../../components/layout/Layout";
import dashboardCards from "../../data/dashboardCards";
import Grid from "@mui/material/Grid";
import {
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Box,
  Alert,
} from "@mui/material";
import { useEffect, useState } from "react";
import api from "../../servises/api";

function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/admin/dashboard");

        setDashboardData(response.data.data);

        console.log("Dashboard Data:", response.data.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);

        setError(
          error.response?.data?.message ||
            "Failed to load dashboard data"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <Layout>
      {/* Dashboard Header */}
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: "bold",
            mb: 0.5,
          }}
        >
          Admin Dashboard
        </Typography>

        <Typography color="text.secondary">
          Overview of your LMS
        </Typography>
      </Box>

      {/* Error */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Dashboard Cards */}
      <Grid container spacing={3}>
        {dashboardCards.map((card) => {
          const Icon = card.icon;

          return (
            <Grid
              key={card.key}
              size={{ xs: 12, sm: 6, md: 4 }}
            >
              <Card
                sx={{
                  borderRadius: 3,
                  boxShadow: 3,
                  transition: "0.3s",

                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: 6,
                  },
                }}
              >
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 2,
                    }}
                  >
                    <Icon
                      sx={{
                        fontSize: 40,
                        color: card.color,
                      }}
                    />
                  </Box>

                  <Typography
                    color="text.secondary"
                    sx={{
                      fontWeight: 500,
                      mb: 1,
                    }}
                  >
                    {card.title}
                  </Typography>

                  <Typography
                    variant="h4"
                    fontWeight="bold"
                  >
                    {loading ? (
                      <CircularProgress size={30} />
                    ) : dashboardData ? (
                      dashboardData[card.key]
                    ) : (
                      0
                    )}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Layout>
  );
}

export default AdminDashboard;
