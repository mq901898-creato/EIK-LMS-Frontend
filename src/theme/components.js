export const getComponentOverrides = (mode = "dark") => {
  const isDark = mode === "dark";

  // Semantic color tokens for the current mode
  const textPrimary = isDark ? "#f8fafc" : "#0f172a";
  const textSecondary = isDark ? "#94a3b8" : "#475569";
  const textMuted = isDark ? "#64748b" : "#94a3b8";

  return {
    MuiCssBaseline: {
      styleOverrides: {
        "*": {
          boxSizing: "border-box",
        },
        html: {
          WebkitFontSmoothing: "antialiased",
          MozOsxFontSmoothing: "grayscale",
        },
        body: {
          backgroundColor: isDark ? "#030712" : "#f8fafc",
          color: isDark ? "#f8fafc" : "#0f172a",
          overflowX: "hidden",
        },
        "::-webkit-scrollbar": {
          width: "6px",
          height: "6px",
        },
        "::-webkit-scrollbar-track": {
          backgroundColor: isDark ? "#030712" : "#f1f5f9",
        },
        "::-webkit-scrollbar-thumb": {
          backgroundColor: isDark ? "#1e293b" : "#cbd5e1",
          borderRadius: "999px",
          "&:hover": {
            backgroundColor: isDark ? "#334155" : "#94a3b8",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          backgroundColor: isDark ? "#0b0f19" : "#ffffff",
          borderColor: isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.08)",
          borderRadius: 12,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          backgroundColor: isDark ? "#0b0f19" : "#ffffff",
          border: isDark
            ? "1px solid rgba(255, 255, 255, 0.08)"
            : "1px solid rgba(0, 0, 0, 0.08)",
          borderRadius: 14,
          boxShadow: isDark
            ? "0 4px 20px -2px rgba(0, 0, 0, 0.5)"
            : "0 4px 20px -2px rgba(0, 0, 0, 0.06)",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
          borderRadius: 8,
          padding: "8px 18px",
          transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
        },
        containedPrimary: {
          backgroundColor: "#6366f1",
          color: "#ffffff",
          boxShadow: "0 2px 10px rgba(99, 102, 241, 0.25)",
          "&:hover": {
            backgroundColor: "#4f46e5",
            boxShadow: "0 4px 16px rgba(99, 102, 241, 0.4)",
          },
        },
        outlined: {
          borderColor: isDark ? "rgba(255, 255, 255, 0.12)" : "rgba(0, 0, 0, 0.16)",
          "&:hover": {
            borderColor: "#6366f1",
            backgroundColor: isDark
              ? "rgba(99, 102, 241, 0.08)"
              : "rgba(99, 102, 241, 0.04)",
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: isDark ? "rgba(11, 15, 25, 0.6)" : "#ffffff",
          borderRadius: 8,
          transition: "all 0.2s ease",
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.15)",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: isDark ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.3)",
          },
          "&.Mui-focused": {
            backgroundColor: isDark ? "rgba(11, 15, 25, 0.95)" : "#ffffff",
            boxShadow: "0 0 0 3px rgba(99, 102, 241, 0.2)",
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "#6366f1",
              borderWidth: "1px",
            },
          },
        },
        input: {
          color: isDark ? "#f8fafc" : "#0f172a",
          "&::placeholder": {
            color: isDark ? "#64748b" : "#94a3b8",
            opacity: 1,
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderColor: isDark ? "rgba(255, 255, 255, 0.06)" : "rgba(0, 0, 0, 0.06)",
          padding: "14px 16px",
          color: isDark ? "#f8fafc" : "#0f172a",
        },
        head: {
          backgroundColor: isDark ? "#070b13" : "#f8fafc",
          color: isDark ? "#94a3b8" : "#475569",
          fontWeight: 600,
          textTransform: "uppercase",
          fontSize: "0.75rem",
          letterSpacing: "0.05em",
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          "&:hover": {
            backgroundColor: isDark
              ? "rgba(255, 255, 255, 0.02) !important"
              : "rgba(0, 0, 0, 0.02) !important",
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontWeight: 500,
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: isDark ? "#0b0f19" : "#ffffff",
          border: isDark ? "1px solid rgba(255, 255, 255, 0.08)" : "none",
          borderRadius: 16,
          boxShadow: isDark
            ? "0 20px 40px -10px rgba(0, 0, 0, 0.8)"
            : "0 20px 40px -10px rgba(0, 0, 0, 0.15)",
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          backgroundColor: isDark ? "#0b0f19" : "#ffffff",
          border: isDark
            ? "1px solid rgba(255, 255, 255, 0.08)"
            : "1px solid rgba(0, 0, 0, 0.08)",
          borderRadius: 10,
          boxShadow: isDark
            ? "0 12px 30px rgba(0, 0, 0, 0.7)"
            : "0 12px 30px rgba(0, 0, 0, 0.1)",
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: isDark ? "#111827" : "#1e293b",
          color: "#ffffff",
          fontSize: "0.75rem",
          borderRadius: 6,
          border: isDark ? "1px solid rgba(255, 255, 255, 0.1)" : "none",
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.08)",
        },
      },
    },

    // ── Typography: inherit theme text color by default ──────────────────
    MuiTypography: {
      styleOverrides: {
        root: {
          color: "inherit",
        },
      },
      defaultProps: {
        variantMapping: {
          h1: "h1", h2: "h2", h3: "h3", h4: "h4",
          h5: "h5", h6: "h6",
          subtitle1: "p", subtitle2: "p",
          body1: "p", body2: "p",
          caption: "span", overline: "span",
        },
      },
    },

    // ── InputLabel: adapt to theme ────────────────────────────────────────
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: textMuted,
          "&.Mui-focused": {
            color: "#6366f1",
          },
        },
      },
    },

    // ── FormHelperText: adapt to theme ───────────────────────────────────
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          color: textMuted,
        },
      },
    },

    // ── ListItemText: adapt primary text to theme ─────────────────────────
    MuiListItemText: {
      styleOverrides: {
        primary: {
          color: textPrimary,
        },
        secondary: {
          color: textSecondary,
        },
      },
    },

    // ── Select / MenuItem text ────────────────────────────────────────────
    MuiSelect: {
      styleOverrides: {
        icon: {
          color: textMuted,
        },
      },
    },

    // ── Tab / TabPanel text ───────────────────────────────────────────────
    MuiTab: {
      styleOverrides: {
        root: {
          color: textMuted,
          "&.Mui-selected": {
            color: "#6366f1",
          },
          textTransform: "none",
          fontWeight: 600,
        },
      },
    },

    // ── Breadcrumbs ───────────────────────────────────────────────────────
    MuiBreadcrumbs: {
      styleOverrides: {
        root: {
          color: textSecondary,
        },
      },
    },

    // ── Alert ─────────────────────────────────────────────────────────────
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 10,
        },
      },
    },
  };
};

