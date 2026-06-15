"use client";

import { useEffect } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField
} from "@mui/material";
import { useForm } from "react-hook-form";

export interface ActaModificacionDetalleFormValues {
  detalleKey: string;
  actaKey: string;
  tipoEquipoKey: string;
  descripcion: string;
  cantidad: number;
  valorUnitario: number;
  valorTotal: number;
  estado: string;
}

interface ActaModificacionDetalleFormProps {
  open: boolean;
  loading?: boolean;
  initialData?: ActaModificacionDetalleFormValues | null;
  onClose: () => void;
  onSubmit: (data: ActaModificacionDetalleFormValues) => Promise<void> | void;
}

const defaultValues: ActaModificacionDetalleFormValues = {
  detalleKey: "",
  actaKey: "",
  tipoEquipoKey: "",
  descripcion: "",
  cantidad: 0,
  valorUnitario: 0,
  valorTotal: 0,
  estado: "1"
};

export function ActaModificacionDetalleForm({
  open,
  loading = false,
  initialData,
  onClose,
  onSubmit
}: ActaModificacionDetalleFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors }
  } = useForm<ActaModificacionDetalleFormValues>({
    defaultValues
  });

  const cantidad = watch("cantidad");
  const valorUnitario = watch("valorUnitario");

  useEffect(() => {
    reset(initialData ?? defaultValues);
  }, [initialData, reset, open]);

  useEffect(() => {
    const total = Number(cantidad || 0) * Number(valorUnitario || 0);
    setValue("valorTotal", total);
  }, [cantidad, valorUnitario, setValue]);

  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        {initialData ? "Editar detalle de acta" : "Crear detalle de acta"}
      </DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              fullWidth
              label="Código detalle"
              placeholder="ACDT-0001"
              {...register("detalleKey", {
                required: "El código del detalle es obligatorio"
              })}
              error={!!errors.detalleKey}
              helperText={errors.detalleKey?.message}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              fullWidth
              label="Código acta"
              placeholder="ACTA-0001"
              {...register("actaKey", {
                required: "El acta es obligatoria"
              })}
              error={!!errors.actaKey}
              helperText={errors.actaKey?.message}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              fullWidth
              label="Tipo equipo"
              placeholder="EXC"
              {...register("tipoEquipoKey")}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              multiline
              minRows={3}
              label="Descripción"
              {...register("descripcion", {
                required: "La descripción es obligatoria"
              })}
              error={!!errors.descripcion}
              helperText={errors.descripcion?.message}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 3 }}>
            <TextField
              fullWidth
              type="number"
              label="Cantidad"
              {...register("cantidad", {
                valueAsNumber: true
              })}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 3 }}>
            <TextField
              fullWidth
              type="number"
              label="Valor unitario"
              {...register("valorUnitario", {
                valueAsNumber: true
              })}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 3 }}>
            <TextField
              fullWidth
              type="number"
              label="Valor total"
              slotProps={{
                input: {
                  readOnly: true
                }
              }}
              {...register("valorTotal", {
                valueAsNumber: true
              })}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 3 }}>
            <TextField
              fullWidth
              label="Estado"
              {...register("estado")}
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancelar
        </Button>

        <Button
          variant="contained"
          disabled={loading}
          onClick={handleSubmit(onSubmit)}
        >
          {loading ? "Guardando..." : "Guardar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}