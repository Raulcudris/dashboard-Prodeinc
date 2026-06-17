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
import { DetalleEquipoOperacionDto } from "../../types/controlObras.types";
import { EstadoRegistro } from "../../types/common.types";

interface FormValues {
  orsIdentifkeyDeop: string;
  orsIdentifkeyRope: string;
  orsIdentifkeyOrde: string;
  orsIdentifkeyPsem: string;
  orsIdentifkeyPlse: string;
  orsIdentifkeyPunt: string;

  prvIdentifkeyInve: string;
  prvTipoequipoTieq: string;

  orsNombrequipoDeop: string;
  orsRefermodeloDeop: string;
  orsNroregistroDeop: string;

  orsUnidadDeop: string;
  orsTipocontrolDeop: string;
  orsFechatrabajoDeop: string;

  orsHorometroiniDeop: number | "";
  orsHorometrofinDeop: number | "";

  orsKminicialDeop: number | "";
  orsKmfinalDeop: number | "";

  orsDiatrabajadoDeop: number | "";
  orsValorunidadDeop: number | "";

  orsObservacionDeop: string;
  orsFirmasuministroDeop: string;
  orsFirmaseguimientoDeop: string;

  orsTiporegistDeop: string;
  orsEstadoregDeop: string;
}

interface DetalleEquipoOperacionFormProps {
  open: boolean;
  loading?: boolean;
  initialData?: DetalleEquipoOperacionDto | null;
  onClose: () => void;
  onSubmit: (data: DetalleEquipoOperacionDto) => Promise<void> | void;
}

const emptyValues: FormValues = {
  orsIdentifkeyDeop: "",
  orsIdentifkeyRope: "",
  orsIdentifkeyOrde: "",
  orsIdentifkeyPsem: "",
  orsIdentifkeyPlse: "",
  orsIdentifkeyPunt: "",

  prvIdentifkeyInve: "",
  prvTipoequipoTieq: "",

  orsNombrequipoDeop: "",
  orsRefermodeloDeop: "",
  orsNroregistroDeop: "",

  orsUnidadDeop: "",
  orsTipocontrolDeop: "",
  orsFechatrabajoDeop: "",

  orsHorometroiniDeop: "",
  orsHorometrofinDeop: "",

  orsKminicialDeop: "",
  orsKmfinalDeop: "",

  orsDiatrabajadoDeop: "",
  orsValorunidadDeop: "",

  orsObservacionDeop: "",
  orsFirmasuministroDeop: "",
  orsFirmaseguimientoDeop: "",

  orsTiporegistDeop: "1",
  orsEstadoregDeop: "1"
};

function mapInitialData(data: DetalleEquipoOperacionDto): FormValues {
  return {
    orsIdentifkeyDeop: data.orsIdentifkeyDeop ?? "",
    orsIdentifkeyRope: data.orsIdentifkeyRope ?? "",
    orsIdentifkeyOrde: data.orsIdentifkeyOrde ?? "",
    orsIdentifkeyPsem: data.orsIdentifkeyPsem ?? "",
    orsIdentifkeyPlse: data.orsIdentifkeyPlse ?? "",
    orsIdentifkeyPunt: data.orsIdentifkeyPunt ?? "",

    prvIdentifkeyInve: data.prvIdentifkeyInve ?? "",
    prvTipoequipoTieq: data.prvTipoequipoTieq ?? "",

    orsNombrequipoDeop: data.orsNombrequipoDeop ?? "",
    orsRefermodeloDeop: data.orsRefermodeloDeop ?? "",
    orsNroregistroDeop: data.orsNroregistroDeop ?? "",

    orsUnidadDeop: data.orsUnidadDeop ?? "",
    orsTipocontrolDeop: data.orsTipocontrolDeop ?? "",
    orsFechatrabajoDeop: data.orsFechatrabajoDeop ?? "",

    orsHorometroiniDeop:
      typeof data.orsHorometroiniDeop === "number"
        ? data.orsHorometroiniDeop
        : "",
    orsHorometrofinDeop:
      typeof data.orsHorometrofinDeop === "number"
        ? data.orsHorometrofinDeop
        : "",

    orsKminicialDeop:
      typeof data.orsKminicialDeop === "number" ? data.orsKminicialDeop : "",
    orsKmfinalDeop:
      typeof data.orsKmfinalDeop === "number" ? data.orsKmfinalDeop : "",

    orsDiatrabajadoDeop:
      typeof data.orsDiatrabajadoDeop === "number"
        ? data.orsDiatrabajadoDeop
        : "",
    orsValorunidadDeop:
      typeof data.orsValorunidadDeop === "number"
        ? data.orsValorunidadDeop
        : "",

    orsObservacionDeop: data.orsObservacionDeop ?? "",
    orsFirmasuministroDeop: data.orsFirmasuministroDeop ?? "",
    orsFirmaseguimientoDeop: data.orsFirmaseguimientoDeop ?? "",

    orsTiporegistDeop: data.orsTiporegistDeop ?? "1",
    orsEstadoregDeop: data.orsEstadoregDeop ?? "1"
  };
}

function toOptionalNumber(value: number | "" | undefined) {
  if (value === "" || value === undefined || Number.isNaN(value)) {
    return undefined;
  }

  return Number(value);
}

export function DetalleEquipoOperacionForm({
  open,
  loading = false,
  initialData,
  onClose,
  onSubmit
}: DetalleEquipoOperacionFormProps) {
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
      orsPrimarykeyDeop: initialData?.orsPrimarykeyDeop,

      orsIdentifkeyDeop: values.orsIdentifkeyDeop.trim().toUpperCase(),
      orsIdentifkeyRope: values.orsIdentifkeyRope.trim(),
      orsIdentifkeyOrde: values.orsIdentifkeyOrde.trim(),
      orsIdentifkeyPsem: values.orsIdentifkeyPsem.trim(),
      orsIdentifkeyPlse: values.orsIdentifkeyPlse.trim(),
      orsIdentifkeyPunt: values.orsIdentifkeyPunt.trim(),

      prvIdentifkeyInve: values.prvIdentifkeyInve.trim(),
      prvTipoequipoTieq: values.prvTipoequipoTieq.trim().toUpperCase(),

      orsNombrequipoDeop: values.orsNombrequipoDeop.trim(),
      orsRefermodeloDeop: values.orsRefermodeloDeop.trim(),
      orsNroregistroDeop: values.orsNroregistroDeop.trim(),

      orsUnidadDeop: values.orsUnidadDeop.trim().toUpperCase(),
      orsTipocontrolDeop: values.orsTipocontrolDeop.trim().toUpperCase(),
      orsFechatrabajoDeop: values.orsFechatrabajoDeop,

      orsHorometroiniDeop: toOptionalNumber(values.orsHorometroiniDeop),
      orsHorometrofinDeop: toOptionalNumber(values.orsHorometrofinDeop),

      orsKminicialDeop: toOptionalNumber(values.orsKminicialDeop),
      orsKmfinalDeop: toOptionalNumber(values.orsKmfinalDeop),

      orsDiatrabajadoDeop: toOptionalNumber(values.orsDiatrabajadoDeop),
      orsValorunidadDeop: toOptionalNumber(values.orsValorunidadDeop),

      orsObservacionDeop: values.orsObservacionDeop.trim(),
      orsFirmasuministroDeop: values.orsFirmasuministroDeop.trim(),
      orsFirmaseguimientoDeop: values.orsFirmaseguimientoDeop.trim(),

      orsTiporegistDeop: values.orsTiporegistDeop || "1",
      orsEstadoregDeop: (values.orsEstadoregDeop || "1") as EstadoRegistro
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
        {initialData
          ? "Editar detalle de operación"
          : "Crear detalle de operación"}
      </DialogTitle>

      <Box component="form" onSubmit={handleSubmit(submitForm)}>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 3 }}>
              <TextField
                fullWidth
                label="Código detalle"
                placeholder="DEOP-0001"
                error={Boolean(errors.orsIdentifkeyDeop)}
                helperText={errors.orsIdentifkeyDeop?.message}
                {...register("orsIdentifkeyDeop", {
                  required: "El código del detalle es obligatorio"
                })}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 3 }}>
              <TextField
                fullWidth
                label="Reporte operación"
                placeholder="ROPE-0001"
                error={Boolean(errors.orsIdentifkeyRope)}
                helperText={errors.orsIdentifkeyRope?.message}
                {...register("orsIdentifkeyRope", {
                  required: "El reporte de operación es obligatorio"
                })}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 3 }}>
              <TextField
                fullWidth
                label="Orden servicio"
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
                label="Sitio / punto"
                placeholder="PUNT-0001"
                {...register("orsIdentifkeyPunt")}
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
                label="Equipo / inventario"
                placeholder="EQ-0001"
                error={Boolean(errors.prvIdentifkeyInve)}
                helperText={errors.prvIdentifkeyInve?.message}
                {...register("prvIdentifkeyInve", {
                  required: "El equipo es obligatorio"
                })}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 3 }}>
              <TextField
                fullWidth
                label="Tipo equipo"
                placeholder="RETROEXCAVADORA"
                {...register("prvTipoequipoTieq")}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label="Nombre equipo"
                placeholder="Retroexcavadora CAT 420"
                {...register("orsNombrequipoDeop")}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label="Referencia / modelo"
                placeholder="CAT 420F2"
                {...register("orsRefermodeloDeop")}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label="Número registro"
                placeholder="PLACA / SERIAL"
                {...register("orsNroregistroDeop")}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label="Unidad"
                placeholder="HORA, DIA, KM"
                {...register("orsUnidadDeop")}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label="Tipo control"
                placeholder="HOROMETRO, KILOMETRAJE, DIA"
                {...register("orsTipocontrolDeop")}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                type="date"
                label="Fecha trabajo"
                slotProps={{
                  inputLabel: {
                    shrink: true
                  }
                }}
                {...register("orsFechatrabajoDeop")}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 3 }}>
              <TextField
                fullWidth
                type="number"
                label="Horómetro inicial"
                {...register("orsHorometroiniDeop", {
                  valueAsNumber: true
                })}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 3 }}>
              <TextField
                fullWidth
                type="number"
                label="Horómetro final"
                {...register("orsHorometrofinDeop", {
                  valueAsNumber: true
                })}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 3 }}>
              <TextField
                fullWidth
                type="number"
                label="Km inicial"
                {...register("orsKminicialDeop", {
                  valueAsNumber: true
                })}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 3 }}>
              <TextField
                fullWidth
                type="number"
                label="Km final"
                {...register("orsKmfinalDeop", {
                  valueAsNumber: true
                })}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 3 }}>
              <TextField
                fullWidth
                type="number"
                label="Día trabajado"
                {...register("orsDiatrabajadoDeop", {
                  valueAsNumber: true
                })}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 3 }}>
              <TextField
                fullWidth
                type="number"
                label="Valor unidad"
                {...register("orsValorunidadDeop", {
                  valueAsNumber: true
                })}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 3 }}>
              <TextField
                fullWidth
                label="Tipo registro interno"
                placeholder="1"
                {...register("orsTiporegistDeop")}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 3 }}>
              <TextField
                fullWidth
                label="Estado"
                placeholder="1"
                {...register("orsEstadoregDeop")}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                multiline
                minRows={3}
                label="Observación"
                {...register("orsObservacionDeop")}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Firma suministro"
                placeholder="Nombre, URL o referencia de firma"
                {...register("orsFirmasuministroDeop")}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Firma seguimiento"
                placeholder="Nombre, URL o referencia de firma"
                {...register("orsFirmaseguimientoDeop")}
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