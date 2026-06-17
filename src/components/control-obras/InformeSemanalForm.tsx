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
import { InformeSemanalDto } from "../../types/controlObras.types";
import { EstadoRegistro } from "../../types/common.types";

interface FormValues {
  orsIdentifkeyInse: string;

  orsIdentifkeyOrde: string;
  orsIdentifkeyPsem: string;
  orsIdentifkeyPlse: string;

  orsFechainicioInse: string;
  orsFechafinInse: string;
  orsDescripcionInse: string;
  orsObservacionInse: string;

  orsAvanceprogramadoInse: number | "";
  orsAvanceejecutadoInse: number | "";
  orsPorccumplimientoInse: number | "";

  orsTiporegistInse: string;
  orsEstadoregInse: string;
}

interface InformeSemanalFormProps {
  open: boolean;
  loading?: boolean;
  initialData?: InformeSemanalDto | null;
  onClose: () => void;
  onSubmit: (data: InformeSemanalDto) => Promise<void> | void;
}

const emptyValues: FormValues = {
  orsIdentifkeyInse: "",

  orsIdentifkeyOrde: "",
  orsIdentifkeyPsem: "",
  orsIdentifkeyPlse: "",

  orsFechainicioInse: "",
  orsFechafinInse: "",
  orsDescripcionInse: "",
  orsObservacionInse: "",

  orsAvanceprogramadoInse: "",
  orsAvanceejecutadoInse: "",
  orsPorccumplimientoInse: "",

  orsTiporegistInse: "1",
  orsEstadoregInse: "1"
};

function mapInitialData(data: InformeSemanalDto): FormValues {
  return {
    orsIdentifkeyInse: data.orsIdentifkeyInse ?? "",

    orsIdentifkeyOrde: data.orsIdentifkeyOrde ?? "",
    orsIdentifkeyPsem: data.orsIdentifkeyPsem ?? "",
    orsIdentifkeyPlse: data.orsIdentifkeyPlse ?? "",

    orsFechainicioInse: data.orsFechainicioInse ?? "",
    orsFechafinInse: data.orsFechafinInse ?? "",
    orsDescripcionInse: data.orsDescripcionInse ?? "",
    orsObservacionInse: data.orsObservacionInse ?? "",

    orsAvanceprogramadoInse:
      typeof data.orsAvanceprogramadoInse === "number"
        ? data.orsAvanceprogramadoInse
        : "",
    orsAvanceejecutadoInse:
      typeof data.orsAvanceejecutadoInse === "number"
        ? data.orsAvanceejecutadoInse
        : "",
    orsPorccumplimientoInse:
      typeof data.orsPorccumplimientoInse === "number"
        ? data.orsPorccumplimientoInse
        : "",

    orsTiporegistInse: data.orsTiporegistInse ?? "1",
    orsEstadoregInse: data.orsEstadoregInse ?? "1"
  };
}

function toOptionalNumber(value: number | "" | undefined) {
  if (value === "" || value === undefined || Number.isNaN(value)) {
    return undefined;
  }

  return Number(value);
}

function calculateCompliance(programado: number | "", ejecutado: number | "") {
  const planned = toOptionalNumber(programado) ?? 0;
  const executed = toOptionalNumber(ejecutado) ?? 0;

  if (planned <= 0) return 0;

  return Number(((executed / planned) * 100).toFixed(2));
}

export function InformeSemanalForm({
  open,
  loading = false,
  initialData,
  onClose,
  onSubmit
}: InformeSemanalFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors }
  } = useForm<FormValues>({
    defaultValues: emptyValues
  });

  const avanceProgramado = watch("orsAvanceprogramadoInse");
  const avanceEjecutado = watch("orsAvanceejecutadoInse");

  useEffect(() => {
    if (!open) return;

    if (initialData) {
      reset(mapInitialData(initialData));
      return;
    }

    reset(emptyValues);
  }, [open, initialData, reset]);

  useEffect(() => {
    const compliance = calculateCompliance(avanceProgramado, avanceEjecutado);

    setValue("orsPorccumplimientoInse", compliance, {
      shouldDirty: true,
      shouldValidate: false
    });
  }, [avanceProgramado, avanceEjecutado, setValue]);

  const submitForm = (values: FormValues) => {
    onSubmit({
      orsPrimarykeyInse: initialData?.orsPrimarykeyInse,
      orsIdentifkeyInse: values.orsIdentifkeyInse.trim().toUpperCase(),

      orsIdentifkeyOrde: values.orsIdentifkeyOrde.trim(),
      orsIdentifkeyPsem: values.orsIdentifkeyPsem.trim(),
      orsIdentifkeyPlse: values.orsIdentifkeyPlse.trim(),

      orsFechainicioInse: values.orsFechainicioInse,
      orsFechafinInse: values.orsFechafinInse,
      orsDescripcionInse: values.orsDescripcionInse.trim(),
      orsObservacionInse: values.orsObservacionInse.trim(),

      orsAvanceprogramadoInse: toOptionalNumber(
        values.orsAvanceprogramadoInse
      ),
      orsAvanceejecutadoInse: toOptionalNumber(values.orsAvanceejecutadoInse),
      orsPorccumplimientoInse: toOptionalNumber(
        values.orsPorccumplimientoInse
      ),

      orsTiporegistInse: values.orsTiporegistInse || "1",
      orsEstadoregInse: (values.orsEstadoregInse || "1") as EstadoRegistro
    });
  };

  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      maxWidth="lg"
      fullWidth
    >
      <DialogTitle>
        {initialData ? "Editar informe semanal" : "Crear informe semanal"}
      </DialogTitle>

      <Box component="form" onSubmit={handleSubmit(submitForm)}>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 3 }}>
              <TextField
                fullWidth
                label="Código informe"
                placeholder="INSE-0001"
                error={Boolean(errors.orsIdentifkeyInse)}
                helperText={errors.orsIdentifkeyInse?.message}
                {...register("orsIdentifkeyInse", {
                  required: "El código del informe es obligatorio"
                })}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 3 }}>
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

            <Grid size={{ xs: 12, md: 3 }}>
              <TextField
                fullWidth
                label="Proyección semanal"
                placeholder="PSEM-0001"
                {...register("orsIdentifkeyPsem")}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 3 }}>
              <TextField
                fullWidth
                label="Plan semanal"
                placeholder="PLSE-0001"
                {...register("orsIdentifkeyPlse")}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 3 }}>
              <TextField
                fullWidth
                type="date"
                label="Fecha inicio"
                slotProps={{
                  inputLabel: {
                    shrink: true
                  }
                }}
                {...register("orsFechainicioInse")}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 3 }}>
              <TextField
                fullWidth
                type="date"
                label="Fecha fin"
                slotProps={{
                  inputLabel: {
                    shrink: true
                  }
                }}
                {...register("orsFechafinInse")}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 2 }}>
              <TextField
                fullWidth
                type="number"
                label="Avance programado"
                {...register("orsAvanceprogramadoInse", {
                  valueAsNumber: true
                })}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 2 }}>
              <TextField
                fullWidth
                type="number"
                label="Avance ejecutado"
                {...register("orsAvanceejecutadoInse", {
                  valueAsNumber: true
                })}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 2 }}>
              <TextField
                fullWidth
                type="number"
                label="% cumplimiento"
                slotProps={{
                  input: {
                    readOnly: true
                  }
                }}
                {...register("orsPorccumplimientoInse", {
                  valueAsNumber: true
                })}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Descripción"
                multiline
                minRows={3}
                {...register("orsDescripcionInse")}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Observación"
                multiline
                minRows={3}
                {...register("orsObservacionInse")}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Tipo registro interno"
                placeholder="1"
                {...register("orsTiporegistInse")}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Estado"
                placeholder="1"
                {...register("orsEstadoregInse")}
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