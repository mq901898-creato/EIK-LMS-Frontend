import React from "react";
import { Chip } from "@mui/material";

export default function StatusBadge({ status = "default", label, size = "small" }) {
  const normalized = (status || "").toLowerCase();

  let colorConfig = {
    bg: "rgba(148, 163, 184, 0.12)",
    text: "#94a3b8",
    border: "rgba(148, 163, 184, 0.25)",
  };

  if (["active", "approved", "completed", "paid", "published"].includes(normalized)) {
    colorConfig = {
      bg: "rgba(16, 185, 129, 0.12)",
      text: "#10b981",
      border: "rgba(16, 185, 129, 0.3)",
    };
  } else if (["pending", "processing", "review", "in_progress"].includes(normalized)) {
    colorConfig = {
      bg: "rgba(245, 158, 11, 0.12)",
      text: "#f59e0b",
      border: "rgba(245, 158, 11, 0.3)",
    };
  } else if (["rejected", "inactive", "overdue", "cancelled", "failed"].includes(normalized)) {
    colorConfig = {
      bg: "rgba(239, 68, 68, 0.12)",
      text: "#ef4444",
      border: "rgba(239, 68, 68, 0.3)",
    };
  } else if (["enrolled", "submitted", "info", "graded"].includes(normalized)) {
    colorConfig = {
      bg: "rgba(99, 102, 241, 0.12)",
      text: "#818cf8",
      border: "rgba(99, 102, 241, 0.3)",
    };
  }

  const displayLabel =
    label || (status ? status.charAt(0).toUpperCase() + status.slice(1) : "Unknown");

  return (
    <Chip
      size={size}
      label={displayLabel}
      sx={{
        bgcolor: colorConfig.bg,
        color: colorConfig.text,
        border: `1px solid ${colorConfig.border}`,
        fontWeight: 600,
        fontSize: "0.72rem",
        height: size === "small" ? 22 : 28,
        letterSpacing: "0.02em",
        borderRadius: "6px",
      }}
    />
  );
}

