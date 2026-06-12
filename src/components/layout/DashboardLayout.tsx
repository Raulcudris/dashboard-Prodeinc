"use client";

import { Box, Toolbar } from "@mui/material";
import { ReactNode, useState } from "react";
import {
  Sidebar,
  DRAWER_WIDTH,
  DRAWER_COLLAPSED_WIDTH
} from "./Sidebar";
import { Topbar } from "./Topbar";

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);

  const currentDrawerWidth = collapsed
    ? DRAWER_COLLAPSED_WIDTH
    : DRAWER_WIDTH;

  const handleToggle = () => {
    setCollapsed(prev => !prev);
  };

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        bgcolor: "background.default"
      }}
    >
      <Sidebar collapsed={collapsed} onToggle={handleToggle} />

      <Topbar collapsed={collapsed} onToggle={handleToggle} />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: {
            xs: "100%",
            md: `calc(100% - ${currentDrawerWidth}px)`
          },
          ml: {
            xs: 0,
            md: `${currentDrawerWidth}px`
          },
          p: {
            xs: 2,
            md: 3
          },
          transition: "all 0.25s ease"
        }}
      >
        <Toolbar sx={{ minHeight: "72px !important" }} />
        {children}
      </Box>
    </Box>
  );
}