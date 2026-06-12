"use client";

import {
  AppBar,
  Avatar,
  Box,
  Chip,
  IconButton,
  Toolbar,
  Typography
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import LanguageIcon from "@mui/icons-material/Language";
import {
  DRAWER_COLLAPSED_WIDTH,
  DRAWER_WIDTH
} from "./Sidebar";

interface TopbarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function Topbar({ collapsed, onToggle }: TopbarProps) {
  const currentDrawerWidth = collapsed ? DRAWER_COLLAPSED_WIDTH : DRAWER_WIDTH;

  return (
    <AppBar
      position="fixed"
      elevation={0}
      color="inherit"
      sx={{
        zIndex: theme => theme.zIndex.drawer + 1,
        width: {
          xs: "100%",
          md: `calc(100% - ${currentDrawerWidth}px)`
        },
        ml: {
          xs: 0,
          md: `${currentDrawerWidth}px`
        },
        backgroundColor: "#FFFFFF",
        borderBottom: "1px solid #E5E7EB",
        transition: "all 0.25s ease"
      }}
    >
      <Toolbar
        sx={{
          minHeight: "72px !important",
          px: {
            xs: 2,
            md: 3
          },
          display: "flex",
          justifyContent: "space-between",
          gap: 2
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <IconButton size="small" onClick={onToggle}>
            <MenuIcon />
          </IconButton>

          <Box>
            <Typography component="div" variant="subtitle1" sx={{ fontWeight: 700 }}>
              Plataforma de Control de Obras Civiles
            </Typography>

            <Typography component="div" variant="caption" color="text.secondary">
              Prodeinc · Gestión operativa y documental
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1
          }}
        >
          <Chip
            label="MVP"
            sx={{
              fontWeight: 700,
              backgroundColor: "rgba(217, 164, 65, 0.14)",
              color: "#8A6414"
            }}
          />

          <IconButton size="small">
            <SearchIcon />
          </IconButton>

          <IconButton size="small">
            <LanguageIcon />
          </IconButton>

          <IconButton size="small">
            <NotificationsNoneIcon />
          </IconButton>

          <Avatar
            sx={{
              width: 36,
              height: 36,
              backgroundColor: "primary.main",
              fontWeight: 800
            }}
          >
            P
          </Avatar>
        </Box>
      </Toolbar>
    </AppBar>
  );
}