"use client";

import { useState } from "react";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import { DashboardSidebar } from "./DashboardSidebar";
import { DashboardTopbar } from "./DashboardTopbar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const drawerWidth = 292;
const collapsedDrawerWidth = 84;

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down("md"), {
    noSsr: true
  });

  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const currentDrawerWidth = collapsed ? collapsedDrawerWidth : drawerWidth;

  const handleMenuClick = () => {
    if (isMobile) {
      setMobileOpen(true);
      return;
    }

    setCollapsed(prev => !prev);
  };

  const handleCloseSidebar = () => {
    setMobileOpen(false);
  };

  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        minHeight: "100vh",
        bgcolor: "#f4f6f8",
        overflowX: "hidden"
      }}
    >
      <DashboardTopbar
        drawerWidth={currentDrawerWidth}
        onMenuClick={handleMenuClick}
      />

      <DashboardSidebar
        drawerWidth={drawerWidth}
        collapsedWidth={collapsedDrawerWidth}
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onClose={handleCloseSidebar}
      />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minWidth: 0,
          width: "100%",
          pt: "72px",
          transition: "all 0.22s ease"
        }}
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: "100%",
            mx: 0,
            px: {
              xs: 2,
              sm: 2.5,
              md: 3,
              lg: 4
            },
            py: {
              xs: 2.5,
              md: 3
            }
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}