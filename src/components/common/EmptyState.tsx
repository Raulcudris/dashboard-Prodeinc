"use client";

import { Box, Button, Typography } from "@mui/material";
import InboxIcon from "@mui/icons-material/Inbox";

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  title = "Sin registros",
  description = "No hay información para mostrar.",
  actionLabel,
  onAction
}: EmptyStateProps) {
  return (
    <Box
      sx={{
        py: 6,
        textAlign: "center",
        color: "text.secondary"
      }}
    >
      <InboxIcon sx={{ fontSize: 48, mb: 1 }} />
      <Typography variant="h6" color="text.primary">
        {title}
      </Typography>
      <Typography sx={{ mb: 2 }}>{description}</Typography>

      {actionLabel && onAction && (
        <Button variant="contained" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </Box>
  );
}