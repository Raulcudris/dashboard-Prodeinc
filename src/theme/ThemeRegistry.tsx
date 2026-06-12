"use client";

import { ReactNode } from "react";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { appTheme } from "./theme";

interface ThemeRegistryProps {
  children: ReactNode;
}

export default function ThemeRegistry({ children }: ThemeRegistryProps) {
  return (
    <ThemeProvider theme={appTheme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}