import React from "react";
import { Card } from "@mui/material";
import { useAppTheme } from "../../context/useAppTheme";

export default function GlassCard({
  children,
  sx = {},
  elevation = 0,
  hover = false,
  gradientBorder = false,
  ...props
}) {
  const { mode } = useAppTheme();
  const isDark = mode === "dark";

  return (
    <Card
      elevation={elevation}
      sx={{
        backgroundColor: isDark ? "rgba(11, 15, 25, 0.85)" : "#ffffff",
        backdropFilter: isDark ? "blur(12px)" : "none",
        border: isDark
          ? gradientBorder
            ? "1px solid rgba(99, 102, 241, 0.3)"
            : "1px solid rgba(255, 255, 255, 0.08)"
          : "1px solid rgba(0, 0, 0, 0.08)",
        borderRadius: "14px",
        transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
        position: "relative",
        overflow: "hidden",
        ...(hover && {
          "&:hover": {
            borderColor: isDark
              ? "rgba(99, 102, 241, 0.4)"
              : "rgba(99, 102, 241, 0.5)",
            boxShadow: isDark
              ? "0 12px 28px -6px rgba(0, 0, 0, 0.7), 0 0 16px rgba(99, 102, 241, 0.12)"
              : "0 12px 28px -6px rgba(0, 0, 0, 0.1), 0 0 16px rgba(99, 102, 241, 0.08)",
            transform: "translateY(-2px)",
          },
        }),
        ...sx,
      }}
      {...props}
    >
      {children}
    </Card>
  );
}

