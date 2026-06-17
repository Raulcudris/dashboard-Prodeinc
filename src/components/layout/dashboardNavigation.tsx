import { ReactNode } from "react";

import DashboardIcon from "@mui/icons-material/Dashboard";
import AssignmentIcon from "@mui/icons-material/Assignment";
import PlaceIcon from "@mui/icons-material/Place";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import ReportIcon from "@mui/icons-material/Report";
import PrecisionManufacturingIcon from "@mui/icons-material/PrecisionManufacturing";
import EngineeringIcon from "@mui/icons-material/Engineering";
import SummarizeIcon from "@mui/icons-material/Summarize";
import BusinessIcon from "@mui/icons-material/Business";
import StraightenIcon from "@mui/icons-material/Straighten";
import CategoryIcon from "@mui/icons-material/Category";
import InventoryIcon from "@mui/icons-material/Inventory";
import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary";
import LinkIcon from "@mui/icons-material/Link";
import AssessmentIcon from "@mui/icons-material/Assessment";
import DescriptionIcon from "@mui/icons-material/Description";
import PlaylistAddCheckIcon from "@mui/icons-material/PlaylistAddCheck";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

export interface DashboardNavigationItem {
  label: string;
  href: string;
  icon: ReactNode;
}

export interface DashboardNavigationSection {
  title: string;
  items: DashboardNavigationItem[];
}

export const dashboardSections: DashboardNavigationSection[] = [
  {
    title: "General",
    items: [
      {
        label: "Dashboard",
        href: "/dashboard",
        icon: <DashboardIcon />
      }
    ]
  },
  {
    title: "Control de obra",
    items: [
      {
        label: "Órdenes de servicio",
        href: "/dashboard/ordenes",
        icon: <AssignmentIcon />
      },
      {
        label: "Sitios / puntos",
        href: "/dashboard/sitios",
        icon: <PlaceIcon />
      },
      {
        label: "Proyección",
        href: "/dashboard/proyeccion",
        icon: <CalendarMonthIcon />
      },
      {
        label: "Planes de trabajo",
        href: "/dashboard/planes",
        icon: <FactCheckIcon />
      },
      {
        label: "Planes semanales",
        href: "/dashboard/planes-semanales",
        icon: <CalendarMonthIcon />
      },
      {
        label: "Reportes diarios",
        href: "/dashboard/reportes",
        icon: <AssignmentIcon />
      },
      {
        label: "Novedades",
        href: "/dashboard/novedades",
        icon: <ReportIcon />
      }
    ]
  },
  {
    title: "Operación de equipos",
    items: [
      {
        label: "Resumen de equipos",
        href: "/dashboard/control-obras/resumen-equipos",
        icon: <SummarizeIcon />
      },
      {
        label: "Reportes de operación",
        href: "/dashboard/control-obras/reportes-operacion",
        icon: <PrecisionManufacturingIcon />
      },
      {
        label: "Detalle operación equipos",
        href: "/dashboard/control-obras/detalles-equipos-operacion",
        icon: <EngineeringIcon />
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
      }
    ]
  },
  {
    title: "Evidencias",
    items: [
      {
        label: "Evidencias / fotos",
        href: "/dashboard/evidencias/evidencias",
        icon: <PhotoLibraryIcon />
      },
      {
        label: "Referencias evidencias",
        href: "/dashboard/evidencias/referencias",
        icon: <LinkIcon />
      },
      {
        label: "Tipos de evidencia",
        href: "/dashboard/evidencias/tipos",
        icon: <CategoryIcon />
      }
    ]
  },
  {
    title: "Seguimiento",
    items: [
      {
        label: "Informes semanales",
        href: "/dashboard/control-obras/informes-semanales",
        icon: <AssessmentIcon />
      },
      {
        label: "Actas de modificación",
        href: "/dashboard/control-obras/actas-modificacion",
        icon: <DescriptionIcon />
      },
      {
        label: "Detalles actas",
        href: "/dashboard/control-obras/actas-modificacion-detalles",
        icon: <PlaylistAddCheckIcon />
      },
      {
        label: "Avance de obra",
        href: "/dashboard/control-obras/avances",
        icon: <TrendingUpIcon />
      }
    ]
  }
];