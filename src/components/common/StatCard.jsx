import React from "react";
import { Box, Typography, Skeleton } from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import GlassCard from "./GlassCard";
import { useAppTheme } from "../../context/useAppTheme";

export default function StatCard({
  title,
  value,
  icon: Icon,
  color = "#6366f1",
  trend,
  trendLabel,
  loading = false,
  sx = {},
}) {
  const { mode } = useAppTheme();
  const isDark = mode === "dark";

  return (
    <GlassCard hover sx={{ p: 2.75, height: "100%", ...sx }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        {/* Metric Info */}
        <Box sx={{ flex: 1 }}>
          <Typography
            variant="caption"
            sx={{
              color: isDark ? "#94a3b8" : "#64748b",
              fontWeight: 600,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              fontSize: "0.72rem",
            }}
          >
            {title}
          </Typography>

          <Box sx={{ my: 1 }}>
            {loading ? (
              <Skeleton width="60%" height={40} sx={{ bgcolor: isDark ? "#1e293b" : undefined }} />
            ) : (
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 800,
                  color: isDark ? "#f8fafc" : "#0f172a",
                  lineHeight: 1.1,
                }}
              >
                {value ?? 0}
              </Typography>
            )}
          </Box>

          {/* Trend Delta */}
          {(trend !== undefined || trendLabel) && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, mt: 1 }}>
              {trend !== undefined && (
                <Box
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 0.25,
                    px: 0.75,
                    py: 0.25,
                    borderRadius: "6px",
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    bgcolor:
                      trend >= 0
                        ? "rgba(16, 185, 129, 0.12)"
                        : "rgba(239, 68, 68, 0.12)",
                    color: trend >= 0 ? "#10b981" : "#ef4444",
                  }}
                >
                  {trend >= 0 ? (
                    <TrendingUpIcon sx={{ fontSize: 13 }} />
                  ) : (
                    <TrendingDownIcon sx={{ fontSize: 13 }} />
                  )}
                  {Math.abs(trend)}%
                </Box>
              )}
              {trendLabel && (
                <Typography
                  variant="caption"
                  sx={{ color: isDark ? "#64748b" : "#94a3b8", fontSize: "0.72rem" }}
                >
                  {trendLabel}
                </Typography>
              )}
            </Box>
          )}
        </Box>

        {/* Accent Icon Bubble */}
        {Icon && (
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: isDark ? `${color}18` : `${color}14`,
              border: `1px solid ${color}35`,
              color: color,
              boxShadow: `0 0 16px ${color}20`,
              flexShrink: 0,
            }}
          >
            <Icon sx={{ fontSize: 24 }} />
          </Box>
        )}
      </Box>
    </GlassCard>
  );
}

