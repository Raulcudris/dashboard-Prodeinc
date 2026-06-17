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
import { UnidadMedidaDto } from "../../types/equipos.types";
import { EstadoRegistro } from "../../types/common.types";

interface FormValues {
  prvTipunidamedUnme: string;
  prvDescmedidaUnme: string;
  prvEstadoregUnme: string;
}

interface UnidadMedidaFormProps {
  open: boolean;
  loading?: boolean;
  initialData?: UnidadMedidaDto | null;
  onClose: () => void;
  onSubmit: (data: UnidadMedidaDto) => Promise<void> | void;
}

const emptyValues: FormValues = {
  prvTipunidamedUnme: "",
  prvDescmedidaUnme: "",
  prvEstadoregUnme: "1"
};

function mapInitialData(data: UnidadMedidaDto): FormValues {
  return {
    prvTipunidamedUnme: data.prvTipunidamedUnme ?? "",
    prvDescmedidaUnme: data.prvDescmedidaUnme ?? "",
    prvEstadoregUnme: data.prvEstadoregUnme ?? "1"
  };
}

export function UnidadMedidaForm({
  open,
  loading = false,
  initialData,
  onClose,
  onSubmit
}: UnidadMedidaFormProps) {
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
      prvTipunidamedUnme: values.prvTipunidamedUnme.trim().toUpperCase(),
      prvDescmedidaUnme: values.prvDescmedidaUnme.trim(),
      prvEstadoregUnme: (values.prvEstadoregUnme || "1") as EstadoRegistro
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
        {initialData ? "Editar unidad de medida" : "Crear unidad de medida"}
      </DialogTitle>

      <Box component="form" onSubmit={handleSubmit(submitForm)}>
        <DialogContent dividers>
          <Box sx={{ display: "grid", gap: 2 }}>
            <TextField
              fullWidth
              label="Código / tipo unidad"
              placeholder="HORA, DIA, KM, M3"
              error={Boolean(errors.prvTipunidamedUnme)}
              helperText={errors.prvTipunidamedUnme?.message}
              {...register("prvTipunidamedUnme", {
                required: "El código de la unidad es obligatorio"
              })}
            />

            <TextField
              fullWidth
              label="Descripción"
              placeholder="Hora de operación, día trabajado, kilómetro..."
              error={Boolean(errors.prvDescmedidaUnme)}
              helperText={errors.prvDescmedidaUnme?.message}
              {...register("prvDescmedidaUnme", {
                required: "La descripción es obligatoria"
              })}
            />

            <TextField
              fullWidth
              label="Estado"
              placeholder="1"
              {...register("prvEstadoregUnme")}
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