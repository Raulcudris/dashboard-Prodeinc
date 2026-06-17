"use client";

import { useEffect } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField
} from "@mui/material";
import { useForm } from "react-hook-form";

import { ResumenEquipoDto } from "../../types/controlObras.types";
import { EstadoRegistro } from "../../types/common.types";

interface FormValues {
  orsIdentifkeyRseq: string;
  orsIdentifkeyOrde: string;
  prvIdentifkeyInve: string;
  orsCantidadRseq: number | "";
  orsValorunidadRseq: number | "";
  orsValortotalRseq: number | "";
  orsEstadoregRseq: string;
}

interface ResumenEquipoFormProps {
  open: boolean;
  loading?: boolean;
  initialData?: ResumenEquipoDto | null;
  onClose: () => void;
  onSubmit: (data: ResumenEquipoDto) => Promise<void> | void;
}

const emptyValues: FormValues = {
  orsIdentifkeyRseq: "",
  orsIdentifkeyOrde: "",
  prvIdentifkeyInve: "",
  orsCantidadRseq: "",
  orsValorunidadRseq: "",
  orsValortotalRseq: "",
  orsEstadoregRseq: "1"
};

function mapInitialData(data: ResumenEquipoDto): FormValues {
  return {
    orsIdentifkeyRseq: data.orsIdentifkeyRseq ?? "",
    orsIdentifkeyOrde: data.orsIdentifkeyOrde ?? "",
    prvIdentifkeyInve: data.prvIdentifkeyInve ?? "",
    orsCantidadRseq:
      typeof data.orsCantidadRseq === "number" ? data.orsCantidadRseq : "",
    orsValorunidadRseq:
      typeof data.orsValorunidadRseq === "number"
        ? data.orsValorunidadRseq
        : "",
    orsValortotalRseq:
      typeof data.orsValortotalRseq === "number"
        ? data.orsValortotalRseq
        : "",
    orsEstadoregRseq: data.orsEstadoregRseq ?? "1"
  };
}

function toOptionalNumber(value: number | "" | undefined) {
  if (value === "" || value === undefined || Number.isNaN(value)) {
    return undefined;
  }

  return Number(value);
}

export function ResumenEquipoForm({
  open,
  loading = false,
  initialData,
  onClose,
  onSubmit
}: ResumenEquipoFormProps) {
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
      orsPrimarykeyRseq: initialData?.orsPrimarykeyRseq,
      orsIdentifkeyRseq: values.orsIdentifkeyRseq.trim().toUpperCase(),
      orsIdentifkeyOrde: values.orsIdentifkeyOrde.trim(),
      prvIdentifkeyInve: values.prvIdentifkeyInve.trim(),
      orsCantidadRseq: toOptionalNumber(values.orsCantidadRseq),
      orsValorunidadRseq: toOptionalNumber(values.orsValorunidadRseq),
      orsValortotalRseq: toOptionalNumber(values.orsValortotalRseq),
      orsEstadoregRseq: (values.orsEstadoregRseq || "1") as EstadoRegistro
    });
  };

  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        {initialData ? "Editar resumen de equipo" : "Crear resumen de equipo"}
      </DialogTitle>

      <Box component="form" onSubmit={handleSubmit(submitForm)}>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label="Código resumen"
                placeholder="RSEQ-0001"
                error={Boolean(errors.orsIdentifkeyRseq)}
                helperText={errors.orsIdentifkeyRseq?.message}
                {...register("orsIdentifkeyRseq", {
                  required: "El código del resumen es obligatorio"
                })}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label="Orden de servicio"
                placeholder="ORDE-0001"
                error={Boolean(errors.orsIdentifkeyOrde)}
                helperText={errors.orsIdentifkeyOrde?.message}
                {...register("orsIdentifkeyOrde", {
                  required: "La orden de servicio es obligatoria"
                })}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label="Equipo / inventario"
                placeholder="INVE-0001"
                error={Boolean(errors.prvIdentifkeyInve)}
                helperText={errors.prvIdentifkeyInve?.message}
                {...register("prvIdentifkeyInve", {
                  required: "El equipo o inventario es obligatorio"
                })}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                type="number"
                label="Cantidad"
                {...register("orsCantidadRseq", {
                  valueAsNumber: true
                })}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                type="number"
                label="Valor unidad"
                {...register("orsValorunidadRseq", {
                  valueAsNumber: true
                })}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                type="number"
                label="Valor total"
                {...register("orsValortotalRseq", {
                  valueAsNumber: true
                })}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Estado"
                placeholder="1"
                {...register("orsEstadoregRseq")}
              />
            </Grid>
          </Grid>
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