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

import { NovedadDto } from "../../types/controlObras.types";
import { EstadoRegistro } from "../../types/common.types";

interface FormValues {
  orsIdentifkeyNove: string;
  orsIdentifkeyOrde: string;
  orsFechreportNove: string;
  orsTiponovedadNovt: string;
  orsRegistrbaseNove: string;
  orsRegistbaseNove: string;
  orsRegistrnoveNove: string;
  orsEstadoregNove: string;
}

interface NovedadFormProps {
  open: boolean;
  loading?: boolean;
  initialData?: NovedadDto | null;
  onClose: () => void;
  onSubmit: (data: NovedadDto) => Promise<void> | void;
}

const emptyValues: FormValues = {
  orsIdentifkeyNove: "",
  orsIdentifkeyOrde: "",
  orsFechreportNove: "",
  orsTiponovedadNovt: "",
  orsRegistrbaseNove: "",
  orsRegistbaseNove: "",
  orsRegistrnoveNove: "",
  orsEstadoregNove: "1"
};

function mapInitialData(data: NovedadDto): FormValues {
  return {
    orsIdentifkeyNove: data.orsIdentifkeyNove ?? "",
    orsIdentifkeyOrde: data.orsIdentifkeyOrde ?? "",
    orsFechreportNove: data.orsFechreportNove ?? "",
    orsTiponovedadNovt: data.orsTiponovedadNovt ?? "",
    orsRegistrbaseNove:
      data.orsRegistrbaseNove ?? data.orsRegistbaseNove ?? "",
    orsRegistbaseNove:
      data.orsRegistbaseNove ?? data.orsRegistrbaseNove ?? "",
    orsRegistrnoveNove: data.orsRegistrnoveNove ?? "",
    orsEstadoregNove: data.orsEstadoregNove ?? "1"
  };
}

export function NovedadForm({
  open,
  loading = false,
  initialData,
  onClose,
  onSubmit
}: NovedadFormProps) {
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
    const registroBase = values.orsRegistrbaseNove.trim();

    onSubmit({
      orsPrimarykeyNove: initialData?.orsPrimarykeyNove,
      orsIdentifkeyNove: values.orsIdentifkeyNove.trim().toUpperCase(),
      orsIdentifkeyOrde: values.orsIdentifkeyOrde.trim(),
      orsFechreportNove: values.orsFechreportNove,
      orsTiponovedadNovt: values.orsTiponovedadNovt.trim(),
      orsRegistrbaseNove: registroBase,
      orsRegistbaseNove: values.orsRegistbaseNove.trim() || registroBase,
      orsRegistrnoveNove: values.orsRegistrnoveNove.trim(),
      orsEstadoregNove: (values.orsEstadoregNove || "1") as EstadoRegistro
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
        {initialData ? "Editar novedad" : "Crear novedad"}
      </DialogTitle>

      <Box component="form" onSubmit={handleSubmit(submitForm)}>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label="Código novedad"
                placeholder="NOVE-0001"
                error={Boolean(errors.orsIdentifkeyNove)}
                helperText={errors.orsIdentifkeyNove?.message}
                {...register("orsIdentifkeyNove", {
                  required: "El código de la novedad es obligatorio"
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
                type="date"
                label="Fecha novedad"
                slotProps={{
                  inputLabel: {
                    shrink: true
                  }
                }}
                {...register("orsFechreportNove")}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label="Tipo novedad"
                placeholder="ATRASO / CLIMA / EQUIPO / MATERIAL"
                {...register("orsTiponovedadNovt")}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label="Registro base"
                placeholder="REPORTE_DIARIO / PLAN_SEMANAL"
                {...register("orsRegistrbaseNove")}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label="Referencia base"
                placeholder="PDIA-0001 / PLSE-0001"
                {...register("orsRegistbaseNove")}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                multiline
                minRows={4}
                label="Descripción de la novedad"
                error={Boolean(errors.orsRegistrnoveNove)}
                helperText={errors.orsRegistrnoveNove?.message}
                {...register("orsRegistrnoveNove", {
                  required: "La descripción de la novedad es obligatoria"
                })}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Estado"
                placeholder="1"
                {...register("orsEstadoregNove")}
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