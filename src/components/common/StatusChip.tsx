"use client";

import { Chip } from "@mui/material";

interface StatusChipProps {
  value?: string;
  type?: "registro" | "disponibilidad" | "operativo";
}

export function StatusChip({ value, type = "registro" }: StatusChipProps) {
  if (type === "disponibilidad") {
    if (value === "1") {
      return <Chip size="small" label="Disponible" color="success" />;
    }

    if (value === "2") {
      return <Chip size="small" label="Asignado" color="warning" />;
    }
  }

  if (type === "operativo") {
    if (value === "A01") {
      return <Chip size="small" label="Activo funcional" color="success" />;
    }

    if (value === "I01") {
      return <Chip size="small" label="Inactivo por daño" color="error" />;
    }
  }

  if (value === "1") {
    return <Chip size="small" label="Activo" color="success" />;
  }

  if (value === "2") {
    return <Chip size="small" label="Inactivo" color="error" />;
  }

  return <Chip size="small" label={value || "Sin estado"} />;
}