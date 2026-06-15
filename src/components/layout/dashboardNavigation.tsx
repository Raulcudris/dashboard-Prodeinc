import type { ReactNode } from "react";

import AssignmentIcon from "@mui/icons-material/Assignment";
import PlaceIcon from "@mui/icons-material/Place";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import DescriptionIcon from "@mui/icons-material/Description";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import BusinessIcon from "@mui/icons-material/Business";
import StraightenIcon from "@mui/icons-material/Straighten";
import CategoryIcon from "@mui/icons-material/Category";
import InventoryIcon from "@mui/icons-material/Inventory";
import PrecisionManufacturingIcon from "@mui/icons-material/PrecisionManufacturing";
import ChecklistIcon from "@mui/icons-material/Checklist";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import ArticleIcon from "@mui/icons-material/Article";
import DashboardIcon from "@mui/icons-material/Dashboard";

export interface DashboardNavItem {
  label: string;
  href: string;
  icon: ReactNode;
}

export interface DashboardNavSection {
  title: string;
  items: DashboardNavItem[];
}

export const dashboardSections: DashboardNavSection[] = [
  {
    title: "GENERAL",
    items: [
      {
        label: "Dashboard",
        href: "/dashboard",
        icon: <DashboardIcon />
      }
    ]
  },
  {
    title: "CONTROL DE OBRA",
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
    title: "APOYO OPERATIVO",
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
        icon: <PrecisionManufacturingIcon />
      },
      {
        label: "Detalle equipo operación",
        href: "/dashboard/control-obras/detalles-equipos-operacion",
        icon: <ChecklistIcon />
      }
    ]
  },
  {
    title: "SEGUIMIENTO",
    items: [
      {
        label: "Avance de obra",
        href: "/dashboard/control-obras/avances",
        icon: <TrendingUpIcon />
      },
      {
        label: "Actas de modificación",
        href: "/dashboard/control-obras/actas-modificacion",
        icon: <ArticleIcon />
      },
      {
        label: "Detalle actas",
        href: "/dashboard/control-obras/actas-modificacion-detalles",
        icon: <ArticleIcon />
      }
    ]
  }
];