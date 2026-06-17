"use client";

import { useEffect } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField
} from "@mui/material";
import { useForm } from "react-hook-form";
import { TipoEvidenciaDto } from "../../types/evidencias.types";
import { EstadoRegistro } from "../../types/common.types";

interface FormValues {
  eviIdentifkeyTiev: string;
  eviDescripcionTiev: string;
  eviTiporegistTiev: string;
  eviEstadoregTiev: string;
}

interface TipoEvidenciaFormProps {
  open: boolean;
  loading?: boolean;
  initialData?: TipoEvidenciaDto | null;
  onClose: () => void;
  onSubmit: (data: TipoEvidenciaDto) => Promise<void> | void;
}

const emptyValues: FormValues = {
  eviIdentifkeyTiev: "",
  eviDescripcionTiev: "",
  eviTiporegistTiev: "1",
  eviEstadoregTiev: "1"
};

function mapInitialData(data: TipoEvidenciaDto): FormValues {
  return {
    eviIdentifkeyTiev: data.eviIdentifkeyTiev ?? "",
    eviDescripcionTiev: data.eviDescripcionTiev ?? "",
    eviTiporegistTiev: data.eviTiporegistTiev ?? "1",
    eviEstadoregTiev: data.eviEstadoregTiev ?? "1"
  };
}

export function TipoEvidenciaForm({
  open,
  loading = false,
  initialData,
  onClose,
  onSubmit
}: TipoEvidenciaFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<FormValues>({
    defaultValues: emptyValues
  });

  useEffect(() => {
    if (!open) return;

    if (initialData) {
      reset(mapInitialData(initialData));
      return;
    }

    reset(emptyValues);
  }, [open, initialData, reset]);

  const submitForm = (values: FormValues) => {
    onSubmit({
      eviPrimarykeyTiev: initialData?.eviPrimarykeyTiev,
      eviIdentifkeyTiev: values.eviIdentifkeyTiev.trim().toUpperCase(),
      eviDescripcionTiev: values.eviDescripcionTiev.trim(),
      eviTiporegistTiev: values.eviTiporegistTiev || "1",
      eviEstadoregTiev: (values.eviEstadoregTiev || "1") as EstadoRegistro
    });
  };

  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        {initialData ? "Editar tipo de evidencia" : "Crear tipo de evidencia"}
      </DialogTitle>

      <Box component="form" onSubmit={handleSubmit(submitForm)}>
        <DialogContent dividers>
          <Box sx={{ display: "grid", gap: 2 }}>
            <TextField
              label="Key tipo evidencia"
              fullWidth
              error={Boolean(errors.eviIdentifkeyTiev)}
              helperText={errors.eviIdentifkeyTiev?.message}
              {...register("eviIdentifkeyTiev", {
                required: "La key del tipo es obligatoria"
              })}
            />

            <TextField
              label="Descripción"
              fullWidth
              error={Boolean(errors.eviDescripcionTiev)}
              helperText={errors.eviDescripcionTiev?.message}
              {...register("eviDescripcionTiev", {
                required: "La descripción es obligatoria"
              })}
            />

            <TextField
              label="Tipo registro interno"
              fullWidth
              placeholder="1"
              {...register("eviTiporegistTiev")}
            />

            <TextField
              label="Estado registro"
              fullWidth
              placeholder="1"
              {...register("eviEstadoregTiev")}
            />
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose} disabled={loading}>
            Cancelar
          </Button>

          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? "Guardando..." : "Guardar"}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}