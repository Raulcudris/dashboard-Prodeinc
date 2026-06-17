"use client";

import { Box, Button } from "@mui/material";

interface CrudActionButtonsProps {
  onEdit?: () => void;
  onChangeStatus?: () => void;
  onDelete?: () => void;
  editLabel?: string;
  statusLabel?: string;
  deleteLabel?: string;
  disabled?: boolean;
}

export function CrudActionButtons({
  onEdit,
  onChangeStatus,
  onDelete,
  editLabel = "Editar",
  statusLabel = "Estado",
  deleteLabel = "Eliminar",
  disabled = false
}: CrudActionButtonsProps) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
        gap: 0.5
      }}
    >
      {onEdit && (
        <Button size="small" disabled={disabled} onClick={onEdit}>
          {editLabel}
        </Button>
      )}

      {onChangeStatus && (
        <Button size="small" disabled={disabled} onClick={onChangeStatus}>
          {statusLabel}
        </Button>
      )}

      {onDelete && (
        <Button
          size="small"
          color="error"
          disabled={disabled}
          onClick={onDelete}
        >
          {deleteLabel}
        </Button>
      )}
    </Box>
  );
}