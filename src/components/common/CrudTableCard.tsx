"use client";

import { ReactNode } from "react";
import { Box, Card, CardContent } from "@mui/material";
import { LoadingBox } from "./LoadingBox";
import { EmptyState } from "./EmptyState";

interface CrudTableCardProps {
  loading?: boolean;
  isEmpty?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyActionLabel?: string;
  onEmptyAction?: () => void;
  minWidth?: number;
  children: ReactNode;
}

export function CrudTableCard({
  loading = false,
  isEmpty = false,
  emptyTitle = "Sin registros",
  emptyDescription = "No hay información registrada para mostrar.",
  emptyActionLabel,
  onEmptyAction,
  minWidth = 1000,
  children
}: CrudTableCardProps) {
  return (
    <Card
      sx={{
        width: "100%",
        borderRadius: 4,
        boxShadow: "0 10px 28px rgba(15, 23, 42, 0.06)",
        border: "1px solid",
        borderColor: "rgba(148, 163, 184, 0.16)"
      }}
    >
      <CardContent sx={{ p: { xs: 2, md: 2.5 } }}>
        {loading ? (
          <LoadingBox />
        ) : isEmpty ? (
          <EmptyState
            title={emptyTitle}
            description={emptyDescription}
            actionLabel={emptyActionLabel}
            onAction={onEmptyAction}
          />
        ) : (
          <Box
            sx={{
              width: "100%",
              overflowX: "auto",
              "& table": {
                minWidth
              },
              "& th": {
                fontSize: "0.82rem",
                fontWeight: 800,
                color: "#0f172a",
                borderBottomColor: "rgba(148, 163, 184, 0.2)",
                whiteSpace: "nowrap",
                bgcolor: "#f8fafc"
              },
              "& td": {
                fontSize: "0.86rem",
                color: "#0f172a",
                borderBottomColor: "rgba(148, 163, 184, 0.14)",
                whiteSpace: "nowrap"
              },
              "& tbody tr:hover": {
                bgcolor: "rgba(15, 23, 42, 0.025)"
              }
            }}
          >
            {children}
          </Box>
        )}
      </CardContent>
    </Card>
  );
}