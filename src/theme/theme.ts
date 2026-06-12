"use client";

import { createTheme } from "@mui/material/styles";

export const appTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#0B3D2E"
    },
    secondary: {
      main: "#D9A441"
    },
    background: {
      default: "#F5F7FA",
      paper: "#FFFFFF"
    },
    text: {
      primary: "#1F2937",
      secondary: "#6B7280"
    },
    success: {
      main: "#2E7D32"
    },
    warning: {
      main: "#ED6C02"
    },
    error: {
      main: "#D32F2F"
    },
    info: {
      main: "#0288D1"
    },
    divider: "#E5E7EB"
  },
  shape: {
    borderRadius: 14
  },
  typography: {
    fontFamily: `"Inter", "Roboto", "Helvetica", "Arial", sans-serif`,
    h4: {
      fontWeight: 800
    },
    h5: {
      fontWeight: 700
    },
    h6: {
      fontWeight: 700
    },
    subtitle1: {
      fontWeight: 600
    },
    subtitle2: {
      fontWeight: 600
    },
    button: {
      fontWeight: 700,
      textTransform: "none"
    }
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: "#F5F7FA"
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: "0 8px 24px rgba(15, 23, 42, 0.06)",
          border: "1px solid #EEF2F7"
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          paddingLeft: 16,
          paddingRight: 16,
          boxShadow: "none"
        }
      }
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backgroundColor: "#FFFFFF"
        }
      }
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          fontWeight: 600
        }
      }
    }
  }
});