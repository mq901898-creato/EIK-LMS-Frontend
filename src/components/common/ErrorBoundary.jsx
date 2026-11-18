import React, { Component } from "react";
import { Box, Typography, Button, Container } from "@mui/material";
import ErrorOutlinedIcon from "@mui/icons-material/ErrorOutlined";
import RefreshIcon from "@mui/icons-material/Refresh";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an unhandled error:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <Container maxWidth="sm" sx={{ py: 8 }}>
          <Box
            sx={{
              p: 4,
              textAlign: "center",
              bgcolor: "rgba(11, 15, 25, 0.9)",
              border: "1px solid rgba(239, 68, 68, 0.3)",
              borderRadius: "16px",
              boxShadow: "0 20px 40px rgba(0, 0, 0, 0.6)",
            }}
          >
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                bgcolor: "rgba(239, 68, 68, 0.12)",
                color: "#ef4444",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 2,
              }}
            >
              <ErrorOutlinedIcon sx={{ fontSize: 32 }} />
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 700, color: "#f8fafc", mb: 1 }}>
              Something went wrong
            </Typography>
            <Typography variant="body2" sx={{ color: "#94a3b8", mb: 3 }}>
              An unexpected interface error occurred. You can reload the application workspace or retry.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={this.handleReset}
              startIcon={<RefreshIcon />}
              sx={{ px: 3, py: 1 }}
            >
              Reload Workspace
            </Button>
          </Box>
        </Container>
      );
    }

    return this.props.children;
  }
}

