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
import { TipoEquipoDto } from "../../types/equipos.types";
import { EstadoRegistro } from "../../types/common.types";

interface FormValues {
  prvTipoequipoTieq: string;
  prvDescripcionTieq: string;
  prvIdentifkeyUnme: string;
  prvTiporegistTieq: string;
  prvEstadoregTieq: string;
}

interface TipoEquipoFormProps {
  open: boolean;
  loading?: boolean;
  initialData?: TipoEquipoDto | null;
  onClose: () => void;
  onSubmit: (data: TipoEquipoDto) => Promise<void> | void;
}

const emptyValues: FormValues = {
  prvTipoequipoTieq: "",
  prvDescripcionTieq: "",
  prvIdentifkeyUnme: "",
  prvTiporegistTieq: "1",
  prvEstadoregTieq: "1"
};

function mapInitialData(data: TipoEquipoDto): FormValues {
  return {
    prvTipoequipoTieq: data.prvTipoequipoTieq ?? "",
    prvDescripcionTieq: data.prvDescripcionTieq ?? "",
    prvIdentifkeyUnme: data.prvIdentifkeyUnme ?? "",
    prvTiporegistTieq: data.prvTiporegistTieq ?? "1",
    prvEstadoregTieq: data.prvEstadoregTieq ?? "1"
  };
}

export function TipoEquipoForm({
  open,
  loading = false,
  initialData,
  onClose,
  onSubmit
}: TipoEquipoFormProps) {
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
      prvPrimarykeyTieq: initialData?.prvPrimarykeyTieq,
      prvTipoequipoTieq: values.prvTipoequipoTieq.trim().toUpperCase(),
      prvDescripcionTieq: values.prvDescripcionTieq.trim(),
      prvIdentifkeyUnme: values.prvIdentifkeyUnme.trim().toUpperCase(),
      prvTiporegistTieq: values.prvTiporegistTieq || "1",
      prvEstadoregTieq: (values.prvEstadoregTieq || "1") as EstadoRegistro
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
        {initialData ? "Editar tipo de equipo" : "Crear tipo de equipo"}
      </DialogTitle>

      <Box component="form" onSubmit={handleSubmit(submitForm)}>
        <DialogContent dividers>
          <Box sx={{ display: "grid", gap: 2 }}>
            <TextField
              fullWidth
              label="Tipo equipo"
              placeholder="RETROEXCAVADORA, VOLQUETA, CAMIONETA"
              error={Boolean(errors.prvTipoequipoTieq)}
              helperText={errors.prvTipoequipoTieq?.message}
              {...register("prvTipoequipoTieq", {
                required: "El tipo de equipo es obligatorio"
              })}
            />

            <TextField
              fullWidth
              label="Descripción"
              placeholder="Descripción del tipo de equipo"
              error={Boolean(errors.prvDescripcionTieq)}
              helperText={errors.prvDescripcionTieq?.message}
              {...register("prvDescripcionTieq", {
                required: "La descripción es obligatoria"
              })}
            />

            <TextField
              fullWidth
              label="Unidad de medida"
              placeholder="HORA, DIA, KM"
              error={Boolean(errors.prvIdentifkeyUnme)}
              helperText={errors.prvIdentifkeyUnme?.message}
              {...register("prvIdentifkeyUnme", {
                required: "La unidad de medida es obligatoria"
              })}
            />

            <TextField
              fullWidth
              label="Tipo registro interno"
              placeholder="1"
              {...register("prvTiporegistTieq")}
            />

            <TextField
              fullWidth
              label="Estado"
              placeholder="1"
              {...register("prvEstadoregTieq")}
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