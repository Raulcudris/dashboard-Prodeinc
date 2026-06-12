"use client";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography
} from "@mui/material";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  loading?: boolean;
  confirmText?: string;
  cancelText?: string;
  onClose: () => void;
  onConfirm: () => void;
}

export function ConfirmDialog({
  open,
  title,
  message,
  loading = false,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  onClose,
  onConfirm
}: ConfirmDialogProps) {
  return (
    <Dialog open={open} onClose={loading ? undefined : onClose} maxWidth="xs" fullWidth>
      <DialogTitle>{title}</DialogTitle>

      <DialogContent>
        <Typography component="div" variant="body2" color="text.secondary">
          {message}
        </Typography>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          {cancelText}
        </Button>

        <Button
          onClick={onConfirm}
          variant="contained"
          color="primary"
          disabled={loading}
        >
          {loading ? "Procesando..." : confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}