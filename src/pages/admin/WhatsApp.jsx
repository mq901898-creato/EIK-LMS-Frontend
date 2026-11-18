import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Stack,
  TextField,
  Typography,
  Grid,
  IconButton,
  Tooltip,
} from "@mui/material";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import SendIcon from "@mui/icons-material/Send";
import RefreshIcon from "@mui/icons-material/Refresh";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import QrCode2Icon from "@mui/icons-material/QrCode2";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorOutlinedIcon from "@mui/icons-material/ErrorOutlined";

import Layout from "../../components/layout/Layout";
import GlassCard from "../../components/common/GlassCard";
import StatusBadge from "../../components/common/StatusBadge";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import api from "../../servises/api";

function WhatsApp() {
  const [status, setStatus] = useState(null);
  const [logs, setLogs] = useState([]);
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [action, setAction] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [confirmClearOpen, setConfirmClearOpen] = useState(false);

  const loadStatus = useCallback(async () => {
    try {
      const response = await api.get("/admin/whatsapp/status");
      setStatus(response.data);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Could not load WhatsApp status.");
    } finally {
      setLoading(false);
    }
  }, []);

  const loadLogs = useCallback(async () => {
    try {
      const response = await api.get("/admin/whatsapp/logs");
      setLogs(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      setError(err.response?.data?.message || "Could not load WhatsApp message logs.");
    }
  }, []);

  useEffect(() => {
    loadStatus();
    loadLogs();
    const interval = window.setInterval(loadStatus, 5000);
    return () => window.clearInterval(interval);
  }, [loadLogs, loadStatus]);

  const runAction = async (name) => {
    setAction(name);
    setError("");
    setNotice("");
    try {
      const response = await api.post(`/admin/whatsapp/${name}`);
      setNotice(response.data?.message || "WhatsApp service updated.");
      await loadStatus();
    } catch (err) {
      setError(err.response?.data?.message || `Could not ${name} WhatsApp.`);
    } finally {
      setAction("");
    }
  };

  const sendMessage = async (event) => {
    event.preventDefault();
    if (!phone.trim() || !message.trim()) return;

    setAction("send");
    setError("");
    setNotice("");
    try {
      await api.post("/admin/whatsapp/send", { phone: phone.trim(), message: message.trim() });
      setNotice("WhatsApp message transmitted successfully.");
      setMessage("");
      await loadLogs();
    } catch (err) {
      setError(
        err.response?.data?.error || err.response?.data?.message || "Failed to send message."
      );
      await loadLogs();
    } finally {
      setAction("");
    }
  };

  const handleClearLogs = async () => {
    setAction("clearLogs");
    setError("");
    setNotice("");
    try {
      await api.delete("/admin/whatsapp/clearLogs");
      setLogs([]);
      setNotice("Message history cleared.");
      setConfirmClearOpen(false);
    } catch (err) {
      setError(err.response?.data?.message || "Could not clear message logs.");
    } finally {
      setAction("");
    }
  };

  const statusValue = typeof status?.status === "string" ? status.status : "offline";
  const isConnected = statusValue === "connected";

  return (
    <Layout>
      <Box sx={{ width: "100%", display: "flex", flexDirection: "column", gap: 3.5 }}>
        {/* Header Bar */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", sm: "center" },
            flexDirection: { xs: "column", sm: "row" },
            gap: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box
              sx={{
                width: 46,
                height: 46,
                borderRadius: "12px",
                bgcolor: "rgba(37, 211, 102, 0.12)",
                border: "1px solid rgba(37, 211, 102, 0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#25D366",
              }}
            >
              <WhatsAppIcon sx={{ fontSize: 28 }} />
            </Box>
            <Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Typography variant="h4" sx={{ fontWeight: 800 }}>
                  WhatsApp Gateway
                </Typography>
                {status && (
                  <StatusBadge
                    status={isConnected ? "active" : "pending"}
                    label={statusValue.replace("_", " ").toUpperCase()}
                  />
                )}
              </Box>
              <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.25 }}>
                Direct student communication, course announcements, and automated delivery logs.
              </Typography>
            </Box>
          </Box>

          <Tooltip title="Refresh Status">
            <IconButton
              onClick={() => {
                loadStatus();
                loadLogs();
              }}
              sx={{
                border: "1px solid rgba(255, 255, 255, 0.12)",
                borderRadius: "8px",
                p: 1,
              }}
            >
              <RefreshIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Global Feedback Notifications */}
        {error && (
          <Alert severity="error" onClose={() => setError("")}>
            {error}
          </Alert>
        )}
        {notice && (
          <Alert severity="success" onClose={() => setNotice("")}>
            {notice}
          </Alert>
        )}

        <Grid container spacing={3}>
          {/* Service Connection & QR Code Panel */}
          <Grid item xs={12} md={5}>
            <GlassCard sx={{ p: 3, height: "100%", display: "flex", flexDirection: "column" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1.5 }}>
                <QrCode2Icon sx={{ color: "#25D366", fontSize: 24 }} />
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Session & Authentication
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: "text.secondary", mb: 3 }}>
                Connect your institutional WhatsApp number by scanning the QR code below.
              </Typography>

              {status?.error && (
                <Alert severity="warning" sx={{ mb: 2 }}>
                  {status.error}
                </Alert>
              )}

              {/* QR / Status Display Box */}
              <Box
                sx={{
                  flex: 1,
                  minHeight: 240,
                  bgcolor: "rgba(0, 0, 0, 0.25)",
                  border: "1px dashed rgba(255, 255, 255, 0.12)",
                  borderRadius: "12px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  p: 3,
                  mb: 3,
                }}
              >
                {loading ? (
                  <CircularProgress size={32} sx={{ color: "#25D366" }} />
                ) : status?.qr ? (
                  <Box sx={{ textAlign: "center" }}>
                    <Box
                      component="img"
                      src={status.qr}
                      alt="WhatsApp QR Code"
                      sx={{
                        width: 200,
                        height: 200,
                        borderRadius: "8px",
                        bgcolor: "#ffffff",
                        p: 1,
                        boxShadow: "0 8px 24px rgba(0, 0, 0, 0.5)",
                      }}
                    />
                    <Typography variant="caption" sx={{ color: "text.secondary", display: "block", mt: 1.5 }}>
                      Scan using WhatsApp &gt; Linked Devices
                    </Typography>
                  </Box>
                ) : isConnected ? (
                  <Box sx={{ textAlign: "center" }}>
                    <CheckCircleIcon sx={{ fontSize: 54, color: "#10b981", mb: 1 }} />
                    <Typography variant="h6" sx={{ fontWeight: 700, color: "text.primary" }}>
                      WhatsApp Connected
                    </Typography>
                    <Typography variant="caption" sx={{ color: "text.secondary" }}>
                      Gateway is ready to transmit messages
                    </Typography>
                  </Box>
                ) : (
                  <Box sx={{ textAlign: "center" }}>
                    <ErrorOutlinedIcon sx={{ fontSize: 44, color: "text.secondary", mb: 1 }} />
                    <Typography variant="body2" sx={{ color: "text.secondary" }}>
                      Service idle. Click Start to initialize the gateway.
                    </Typography>
                  </Box>
                )}
              </Box>

              {/* Action Buttons */}
              <Stack direction="row" spacing={1.5}>
                <Button
                  variant="contained"
                  fullWidth
                  disabled={Boolean(action) || isConnected}
                  onClick={() => runAction("start")}
                  sx={{
                    bgcolor: "#25D366",
                    color: "#ffffff",
                    "&:hover": { bgcolor: "#1ebd56" },
                  }}
                >
                  {action === "start" ? "Starting..." : "Start Service"}
                </Button>
                <Button
                  variant="outlined"
                  disabled={Boolean(action)}
                  onClick={() => runAction("restart")}
                >
                  Restart
                </Button>
                <Button
                  color="error"
                  variant="outlined"
                  disabled={Boolean(action) || !isConnected}
                  onClick={() => runAction("disconnect")}
                >
                  Disconnect
                </Button>
              </Stack>
            </GlassCard>
          </Grid>

          {/* Send Message & Delivery History */}
          <Grid item xs={12} md={7}>
            <Stack spacing={3}>
              {/* Send Form */}
              <GlassCard
                component="form"
                onSubmit={sendMessage}
                sx={{ p: 3, display: "flex", flexDirection: "column", gap: 2.5 }}
              >
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Dispatch Announcement
                  </Typography>
                  <Typography variant="caption" sx={{ color: "text.secondary" }}>
                    Send individual alerts, assignments, or fee reminders.
                  </Typography>
                </Box>

                <TextField
                  label="Target Phone Number"
                  placeholder="+923001234567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  size="small"
                  required
                  fullWidth
                  helperText="Include country code without spaces (e.g. +923001234567)"
                />

                <TextField
                  label="Message Content"
                  placeholder="Enter message text..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  multiline
                  minRows={3}
                  required
                  fullWidth
                />

                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<SendIcon />}
                  disabled={Boolean(action) || !isConnected}
                  sx={{ alignSelf: "flex-start", px: 3 }}
                >
                  {action === "send" ? "Transmitting..." : "Send WhatsApp Message"}
                </Button>
              </GlassCard>

              {/* Transmission Logs */}
              <GlassCard sx={{ p: 3 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      Transmission Feed
                    </Typography>
                    <Typography variant="caption" sx={{ color: "text.secondary" }}>
                      Recent gateway transmissions ({logs.length} logged)
                    </Typography>
                  </Box>
                  <Button
                    size="small"
                    color="error"
                    startIcon={<DeleteOutlinedIcon />}
                    onClick={() => setConfirmClearOpen(true)}
                    disabled={logs.length === 0}
                  >
                    Clear History
                  </Button>
                </Box>

                {logs.length === 0 ? (
                  <Box sx={{ py: 4, textAlign: "center" }}>
                    <Typography variant="body2" sx={{ color: "text.secondary" }}>
                      No dispatched messages recorded yet.
                    </Typography>
                  </Box>
                ) : (
                  <Stack spacing={1.5} sx={{ maxHeight: 280, overflowY: "auto", pr: 0.5 }}>
                    {logs.map((entry) => (
                      <Box
                        key={entry.id || entry._id || Math.random()}
                        sx={{
                          p: 1.75,
                          borderRadius: "8px",
                          bgcolor: "rgba(255, 255, 255, 0.02)",
                          border: "1px solid rgba(255, 255, 255, 0.06)",
                        }}
                      >
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 0.5 }}>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {entry.name || entry.phone}
                          </Typography>
                          <Typography variant="caption" sx={{ color: "text.secondary" }}>
                            {entry.time || "Recently"}
                          </Typography>
                        </Box>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <Typography
                            variant="caption"
                            sx={{
                              color: entry.status === "sent" ? "#10b981" : "#ef4444",
                              fontWeight: 700,
                              textTransform: "uppercase",
                            }}
                          >
                            {entry.status === "sent" ? "Transmitted" : `Failed: ${entry.error || "Unknown"}`}
                          </Typography>
                          <Typography variant="caption" sx={{ color: "text.secondary" }}>
                            {entry.phone}
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                  </Stack>
                )}
              </GlassCard>
            </Stack>
          </Grid>
        </Grid>

        {/* Clear Logs Dialog */}
        <ConfirmDialog
          open={confirmClearOpen}
          title="Clear Transmission History"
          message="Are you sure you want to clear all message logs? This cannot be undone."
          confirmText="Clear All Logs"
          onConfirm={handleClearLogs}
          onClose={() => setConfirmClearOpen(false)}
        />
      </Box>
    </Layout>
  );
}

export default WhatsApp;

