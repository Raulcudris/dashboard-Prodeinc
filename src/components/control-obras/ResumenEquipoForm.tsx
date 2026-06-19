"use client";

import { useEffect } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  MenuItem,
  TextField
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";

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

function normalizeEstadoRegistro(value?: string) {
  const normalizedValue = String(value ?? "1");

  return ["1", "2"].includes(normalizedValue) ? normalizedValue : "1";
}

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
    orsEstadoregRseq: normalizeEstadoRegistro(data.orsEstadoregRseq)
  };
}

function toOptionalNumber(value: number | "" | undefined) {
  if (value === "" || value === undefined || Number.isNaN(value)) {
    return undefined;
  }

  return Number(value);
}

function safeNumber(value: number | "") {
  if (value === "" || Number.isNaN(value)) return 0;

  return Number(value);
}

function normalizeKey(value: string) {
  return value.trim().toUpperCase();
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
    watch,
    setValue,
    control,
    formState: { errors }
  } = useForm<FormValues>({
    defaultValues: emptyValues
  });

  const cantidad = watch("orsCantidadRseq");
  const valorUnidad = watch("orsValorunidadRseq");

  useEffect(() => {
    if (!open) return;

    if (initialData) {
      reset(mapInitialData(initialData));
      return;
    }

    reset(emptyValues);
  }, [open, initialData, reset]);

  useEffect(() => {
    if (!open) return;

    const total = safeNumber(cantidad) * safeNumber(valorUnidad);

    if (total > 0) {
      setValue("orsValortotalRseq", total, {
        shouldValidate: true,
        shouldDirty: true
      });
      return;
    }

    setValue("orsValortotalRseq", "", {
      shouldValidate: true,
      shouldDirty: true
    });
  }, [open, cantidad, valorUnidad, setValue]);

  const submitForm = (values: FormValues) => {
    onSubmit({
      orsPrimarykeyRseq: initialData?.orsPrimarykeyRseq,
      orsIdentifkeyRseq: normalizeKey(values.orsIdentifkeyRseq),
      orsIdentifkeyOrde: normalizeKey(values.orsIdentifkeyOrde),
      prvIdentifkeyInve: normalizeKey(values.prvIdentifkeyInve),
      orsCantidadRseq: toOptionalNumber(values.orsCantidadRseq),
      orsValorunidadRseq: toOptionalNumber(values.orsValorunidadRseq),
      orsValortotalRseq: toOptionalNumber(values.orsValortotalRseq),
      orsEstadoregRseq: normalizeEstadoRegistro(
        values.orsEstadoregRseq
      ) as EstadoRegistro
    });
  };

  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      maxWidth="md"
      fullWidth
      disableRestoreFocus
    >
      <DialogTitle>
        <Box
          component="div"
          sx={{
            m: 0,
            fontSize: "1.25rem",
            fontWeight: 900
          }}
        >
          {initialData ? "Editar resumen de equipo" : "Crear resumen de equipo"}
        </Box>

        <Box
          component="p"
          sx={{
            m: 0,
            mt: 0.5,
            color: "text.secondary",
            fontSize: "0.9rem"
          }}
        >
          Registra la relación presupuestada de equipo, cantidad y valor dentro
          de una orden de servicio.
        </Box>
      </DialogTitle>

      <Box component="form" onSubmit={handleSubmit(submitForm)}>
        <DialogContent dividers>
          <Box
            component="h3"
            sx={{
              m: 0,
              mb: 2,
              fontSize: "1rem",
              fontWeight: 850
            }}
          >
            Información principal
          </Box>

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label="Código resumen"
                placeholder="RSEQ-0001"
                error={Boolean(errors.orsIdentifkeyRseq)}
                helperText={
                  errors.orsIdentifkeyRseq?.message ??
                  "Código único del resumen de equipo."
                }
                slotProps={{
                  input: {
                    readOnly: Boolean(initialData)
                  }
                }}
                {...register("orsIdentifkeyRseq", {
                  required: "El código del resumen es obligatorio",
                  minLength: {
                    value: 3,
                    message: "El código debe tener mínimo 3 caracteres"
                  },
                  validate: value =>
                    value.trim().length > 0 ||
                    "El código del resumen es obligatorio"
                })}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label="Orden de servicio"
                placeholder="ORDE-0001"
                error={Boolean(errors.orsIdentifkeyOrde)}
                helperText={
                  errors.orsIdentifkeyOrde?.message ??
                  "Código de la orden de servicio."
                }
                {...register("orsIdentifkeyOrde", {
                  required: "La orden de servicio es obligatoria",
                  validate: value =>
                    value.trim().length > 0 ||
                    "La orden de servicio es obligatoria"
                })}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label="Equipo / inventario"
                placeholder="INVE-0001"
                error={Boolean(errors.prvIdentifkeyInve)}
                helperText={
                  errors.prvIdentifkeyInve?.message ??
                  "Código del equipo o inventario asociado."
                }
                {...register("prvIdentifkeyInve", {
                  required: "El equipo o inventario es obligatorio",
                  validate: value =>
                    value.trim().length > 0 ||
                    "El equipo o inventario es obligatorio"
                })}
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          <Box
            component="h3"
            sx={{
              m: 0,
              mb: 2,
              fontSize: "1rem",
              fontWeight: 850
            }}
          >
            Cantidades y valores
          </Box>

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                type="number"
                label="Cantidad"
                error={Boolean(errors.orsCantidadRseq)}
                helperText={errors.orsCantidadRseq?.message}
                slotProps={{
                  htmlInput: {
                    min: 0,
                    step: "0.01"
                  }
                }}
                {...register("orsCantidadRseq", {
                  valueAsNumber: true,
                  min: {
                    value: 0,
                    message: "La cantidad no puede ser negativa"
                  }
                })}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                type="number"
                label="Valor unidad"
                error={Boolean(errors.orsValorunidadRseq)}
                helperText={errors.orsValorunidadRseq?.message}
                slotProps={{
                  htmlInput: {
                    min: 0,
                    step: "0.01"
                  }
                }}
                {...register("orsValorunidadRseq", {
                  valueAsNumber: true,
                  min: {
                    value: 0,
                    message: "El valor unidad no puede ser negativo"
                  }
                })}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                type="number"
                label="Valor total"
                helperText="Se calcula automáticamente: cantidad x valor unidad."
                slotProps={{
                  input: {
                    readOnly: true
                  },
                  htmlInput: {
                    min: 0,
                    step: "0.01"
                  }
                }}
                {...register("orsValortotalRseq", {
                  valueAsNumber: true
                })}
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          <Box
            component="h3"
            sx={{
              m: 0,
              mb: 2,
              fontSize: "1rem",
              fontWeight: 850
            }}
          >
            Control interno
          </Box>

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="orsEstadoregRseq"
                control={control}
                defaultValue="1"
                render={({ field }) => (
                  <TextField
                    select
                    fullWidth
                    label="Estado"
                    value={field.value ?? "1"}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    inputRef={field.ref}
                  >
                    <MenuItem value="1">Activo</MenuItem>
                    <MenuItem value="2">Inactivo</MenuItem>
                  </TextField>
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={onClose} disabled={loading}>
            Cancelar
          </Button>

          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? "Guardando..." : "Guardar resumen"}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}