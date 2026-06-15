"use client";

import {
  AppBar,
  Avatar,
  Box,
  Chip,
  IconButton,
  Toolbar
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import LanguageIcon from "@mui/icons-material/Language";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";

interface DashboardTopbarProps {
  drawerWidth: number;
  onMenuClick: () => void;
}

export function DashboardTopbar({
  drawerWidth,
  onMenuClick
}: DashboardTopbarProps) {
  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        bgcolor: "#ffffff",
        color: "#0f172a",
        borderBottom: "1px solid",
        borderColor: "divider",
        width: {
          xs: "100%",
          md: `calc(100% - ${drawerWidth}px)`
        },
        ml: {
          xs: 0,
          md: `${drawerWidth}px`
        },
        transition: "all 0.22s ease"
      }}
    >
      <Toolbar
        sx={{
          minHeight: "72px !important",
          px: {
            xs: 1.5,
            md: 2.5
          }
        }}
      >
        <IconButton
          onClick={onMenuClick}
          sx={{
            mr: 1.5,
            color: "#4b5563"
          }}
        >
          <MenuIcon />
        </IconButton>

        <Box sx={{ minWidth: 0 }}>
          <Box
            component="h2"
            sx={{
              m: 0,
              fontSize: {
                xs: "1rem",
                md: "1.08rem"
              },
              fontWeight: 800,
              lineHeight: 1.25,
              color: "#0b2341",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis"
            }}
          >
            Plataforma de Control de Obras Civiles
          </Box>

          <Box
            component="p"
            sx={{
              m: 0,
              mt: 0.25,
              color: "text.secondary",
              fontSize: {
                xs: "0.78rem",
                md: "0.82rem"
              },
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis"
            }}
          >
            Prodeinc · Gestión operativa y documental
          </Box>
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: {
              xs: 0.25,
              md: 0.75
            }
          }}
        >
          <Chip
            label="MVP"
            size="small"
            sx={{
              display: { xs: "none", sm: "inline-flex" },
              fontWeight: 700,
              bgcolor: "#f5ead7",
              color: "#8a6400"
            }}
          />

          <IconButton size="small">
            <SearchIcon fontSize="small" />
          </IconButton>

          <IconButton size="small" sx={{ display: { xs: "none", sm: "inline-flex" } }}>
            <LanguageIcon fontSize="small" />
          </IconButton>

          <IconButton size="small">
            <NotificationsNoneIcon fontSize="small" />
          </IconButton>

          <Avatar
            sx={{
              width: 36,
              height: 36,
              bgcolor: "#0b5137",
              fontWeight: 800,
              fontSize: "0.95rem"
            }}
          >
            P
          </Avatar>
        </Box>
      </Toolbar>
    </AppBar>
  );
}