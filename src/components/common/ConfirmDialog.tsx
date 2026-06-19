"use client";

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle
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

function blurActiveElement() {
  if (typeof document === "undefined") return;

  const activeElement = document.activeElement;

  if (activeElement instanceof HTMLElement) {
    activeElement.blur();
  }
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
  const handleClose = () => {
    if (loading) return;

    blurActiveElement();
    onClose();
  };

  const handleConfirm = () => {
    if (loading) return;

    blurActiveElement();
    onConfirm();
  };

  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : handleClose}
      maxWidth="xs"
      fullWidth
      disableRestoreFocus
    >
      <DialogTitle>
        <Box
          component="div"
          sx={{
            m: 0,
            fontSize: "1.15rem",
            fontWeight: 900
          }}
        >
          {title}
        </Box>
      </DialogTitle>

      <DialogContent>
        <Box
          component="p"
          sx={{
            m: 0,
            color: "text.secondary",
            fontSize: "0.9rem",
            lineHeight: 1.6
          }}
        >
          {message}
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button
          onMouseDown={event => event.preventDefault()}
          onClick={handleClose}
          disabled={loading}
        >
          {cancelText}
        </Button>

        <Button
          onMouseDown={event => event.preventDefault()}
          onClick={handleConfirm}
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