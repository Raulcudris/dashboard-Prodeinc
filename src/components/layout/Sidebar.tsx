"use client";

import {
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  Toolbar,
  Tooltip,
  Typography
} from "@mui/material";

import DashboardIcon from "@mui/icons-material/Dashboard";
import AssignmentIcon from "@mui/icons-material/Assignment";
import PlaceIcon from "@mui/icons-material/Place";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import DescriptionIcon from "@mui/icons-material/Description";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import BusinessIcon from "@mui/icons-material/Business";
import InventoryIcon from "@mui/icons-material/Inventory";
import StraightenIcon from "@mui/icons-material/Straighten";
import CategoryIcon from "@mui/icons-material/Category";
import EngineeringIcon from "@mui/icons-material/Engineering";
import EditDocumentIcon from "@mui/icons-material/EditDocument";
import BuildIcon from "@mui/icons-material/Build";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

export const DRAWER_WIDTH = 280;
export const DRAWER_COLLAPSED_WIDTH = 88;

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

interface MenuItem {
  label: string;
  href: string;
  icon: ReactNode;
}

interface MenuSection {
  title: string;
  items: MenuItem[];
}

const mainItems: MenuItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: <DashboardIcon />
  }
];

const menuSections: MenuSection[] = [
  {
    title: "Flujo principal de obra",
    items: [
      {
        label: "Órdenes de servicio",
        href: "/dashboard/ordenes",
        icon: <AssignmentIcon />
      },
      {
        label: "Sitios / puntos de trabajo",
        href: "/dashboard/sitios",
        icon: <PlaceIcon />
      },
      {
        label: "Plan de trabajo proyectado",
        href: "/dashboard/planes",
        icon: <CalendarMonthIcon />
      },
      {
        label: "Plan semanal",
        href: "/dashboard/planes-semanales",
        icon: <CalendarMonthIcon />
      },
      {
        label: "Reporte diario",
        href: "/dashboard/reportes",
        icon: <DescriptionIcon />
      },
      {
        label: "Novedades",
        href: "/dashboard/novedades",
        icon: <WarningAmberIcon />
      },
      {
        label: "Evidencias / Fotos",
        href: "/dashboard/evidencias/evidencias",
        icon: <PhotoCameraIcon />
      }
    ]
  },
  {
    title: "Apoyo operativo",
    items: [
      {
        label: "Proveedores",
        href: "/dashboard/proveedores",
        icon: <BusinessIcon />
      },
      {
        label: "Unidades de medida",
        href: "/dashboard/equipos-maquinaria/unidades",
        icon: <StraightenIcon />
      },
      {
        label: "Tipos de equipo",
        href: "/dashboard/equipos-maquinaria/tipos",
        icon: <CategoryIcon />
      },
      {
        label: "Inventario de equipos",
        href: "/dashboard/equipos-maquinaria/equipos",
        icon: <InventoryIcon />
      },
      {
        label: "Reportes de operación",
        href: "/dashboard/control-obras/reportes-operacion",
        icon: <BuildIcon />
      },
      {
        label: "Detalle equipo operación",
        href: "/dashboard/control-obras/detalles-equipos-operacion",
        icon: <EngineeringIcon />
      }
    ]
  },
  {
    title: "Seguimiento",
    items: [
      {
        label: "Avance de obra",
        href: "/dashboard/control-obras/avances",
        icon: <TrendingUpIcon />
      },
      {
        label: "Actas de modificación",
        href: "/dashboard/control-obras/actas-modificacion",
        icon: <EditDocumentIcon />
      },
      {
        label: "Detalle actas",
        href: "/dashboard/control-obras/actas-modificacion-detalles",
        icon: <DescriptionIcon />
      }
    ]
  }
];

function isSelected(pathname: string, href: string) {
  if (href === "/dashboard") {
    return pathname === href;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

function SidebarItem({
  item,
  collapsed,
  selected
}: {
  item: MenuItem;
  collapsed: boolean;
  selected: boolean;
}) {
  const buttonContent = (
    <ListItemButton
      component={Link}
      href={item.href}
      selected={selected}
      sx={{
        mb: 0.5,
        borderRadius: 3,
        minHeight: 46,
        px: collapsed ? 1.25 : 1.5,
        justifyContent: collapsed ? "center" : "flex-start",
        color: selected ? "primary.main" : "text.secondary",
        "&.Mui-selected": {
          backgroundColor: "rgba(11, 61, 46, 0.08)"
        },
        "&.Mui-selected:hover": {
          backgroundColor: "rgba(11, 61, 46, 0.12)"
        },
        "&:hover": {
          backgroundColor: "rgba(11, 61, 46, 0.05)"
        }
      }}
    >
      <ListItemIcon
        sx={{
          minWidth: collapsed ? "auto" : 38,
          mr: collapsed ? 0 : 1,
          justifyContent: "center",
          color: selected ? "primary.main" : "text.secondary"
        }}
      >
        {item.icon}
      </ListItemIcon>

      {!collapsed && (
        <Typography
          component="div"
          variant="body2"
          sx={{
            fontSize: 14,
            fontWeight: selected ? 700 : 500
          }}
        >
          {item.label}
        </Typography>
      )}
    </ListItemButton>
  );

  return collapsed ? (
    <Tooltip key={item.href} title={item.label} placement="right">
      <Box>{buttonContent}</Box>
    </Tooltip>
  ) : (
    <Box key={item.href}>{buttonContent}</Box>
  );
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();

  const currentDrawerWidth = collapsed
    ? DRAWER_COLLAPSED_WIDTH
    : DRAWER_WIDTH;

  return (
    <Drawer
      variant="permanent"
      sx={{
        display: {
          xs: "none",
          md: "block"
        },
        width: currentDrawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: currentDrawerWidth,
          boxSizing: "border-box",
          borderRight: "1px solid #E5E7EB",
          backgroundColor: "#FFFFFF",
          overflowX: "hidden",
          transition: "width 0.25s ease"
        }
      }}
      open
    >
      <Toolbar
        sx={{
          minHeight: "72px !important",
          px: "16px !important",
          display: "flex",
          alignItems: "center",
          justifyContent: collapsed ? "center" : "space-between"
        }}
      >
        {!collapsed ? (
          <Box>
            <Typography
              component="div"
              variant="subtitle1"
              sx={{ fontWeight: 800 }}
            >
              PRODEINC
            </Typography>

            <Typography
              component="div"
              variant="caption"
              color="text.secondary"
            >
              Control de Obras
            </Typography>
          </Box>
        ) : (
          <Typography
            component="div"
            variant="subtitle1"
            sx={{ fontWeight: 800 }}
          >
            P
          </Typography>
        )}

        <IconButton size="small" onClick={onToggle}>
          {collapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        </IconButton>
      </Toolbar>

      <Divider />

      {!collapsed && (
        <Box sx={{ p: 2 }}>
          <Box
            sx={{
              p: 2,
              borderRadius: 4,
              background:
                "linear-gradient(135deg, rgba(11,61,46,0.06), rgba(217,164,65,0.10))",
              border: "1px solid rgba(217,164,65,0.22)"
            }}
          >
            <Typography
              component="div"
              variant="subtitle2"
              sx={{ fontWeight: 700 }}
            >
              Flujo principal
            </Typography>

            <Typography
              component="div"
              variant="caption"
              color="text.secondary"
            >
              Orden → Sitio → Plan → Semana → Reporte → Novedad → Evidencia
            </Typography>
          </Box>
        </Box>
      )}

      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          overflowX: "hidden",
          pb: 2
        }}
      >
        <List sx={{ px: collapsed ? 1 : 2, py: 1 }}>
          {mainItems.map(item => (
            <SidebarItem
              key={item.href}
              item={item}
              collapsed={collapsed}
              selected={isSelected(pathname, item.href)}
            />
          ))}
        </List>

        {menuSections.map(section => (
          <Box key={section.title}>
            {!collapsed && (
              <Typography
                component="div"
                variant="caption"
                sx={{
                  display: "block",
                  px: 3,
                  pt: 1.5,
                  pb: 0.75,
                  fontWeight: 800,
                  color: "text.disabled",
                  textTransform: "uppercase",
                  letterSpacing: 0.6
                }}
              >
                {section.title}
              </Typography>
            )}

            {collapsed && <Divider sx={{ my: 1 }} />}

            <List sx={{ px: collapsed ? 1 : 2, py: 0 }}>
              {section.items.map(item => (
                <SidebarItem
                  key={item.href}
                  item={item}
                  collapsed={collapsed}
                  selected={isSelected(pathname, item.href)}
                />
              ))}
            </List>
          </Box>
        ))}
      </Box>
    </Drawer>
  );
}