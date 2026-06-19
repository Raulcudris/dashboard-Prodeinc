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

import { EquipoDto } from "../../types/equipos.types";
import { EstadoRegistro } from "../../types/common.types";

interface FormValues {
  prvIdentifkeyInve: string;
  prvIdentifkeyMprv: string;
  prvTipoequipoTieq: string;
  prvNombrequipoInve: string;
  prvRefermodeloInve: string;
  prvEquipoestadoInve: string;
  prvEquipoactivoInve: string;
  prvEstadoregInve: string;
  prvDescripcionInve: string;
}

interface EquipoFormProps {
  open: boolean;
  loading?: boolean;
  initialData?: EquipoDto | null;
  onClose: () => void;
  onSubmit: (data: EquipoDto) => Promise<void> | void;
}

const emptyValues: FormValues = {
  prvIdentifkeyInve: "",
  prvIdentifkeyMprv: "",
  prvTipoequipoTieq: "",
  prvNombrequipoInve: "",
  prvRefermodeloInve: "",
  prvEquipoestadoInve: "OPERATIVO",
  prvEquipoactivoInve: "1",
  prvEstadoregInve: "1",
  prvDescripcionInve: ""
};

function normalizeEstadoRegistro(value?: string) {
  const normalizedValue = String(value ?? "1");

  return ["1", "2"].includes(normalizedValue) ? normalizedValue : "1";
}

function normalizeEstadoOperativo(value?: string) {
  const normalizedValue = String(value ?? "OPERATIVO").trim().toUpperCase();

  return [
    "OPERATIVO",
    "MANTENIMIENTO",
    "FUERA_SERVICIO",
    "ASIGNADO",
    "DISPONIBLE"
  ].includes(normalizedValue)
    ? normalizedValue
    : "OPERATIVO";
}

function normalizeKey(value: string) {
  return value.trim().toUpperCase();
}

function normalizeText(value: string) {
  return value.trim();
}

function mapInitialData(data: EquipoDto): FormValues {
  return {
    prvIdentifkeyInve: data.prvIdentifkeyInve ?? "",
    prvIdentifkeyMprv: data.prvIdentifkeyMprv ?? "",
    prvTipoequipoTieq: data.prvTipoequipoTieq ?? "",
    prvNombrequipoInve: data.prvNombrequipoInve ?? "",
    prvRefermodeloInve: data.prvRefermodeloInve ?? "",
    prvEquipoestadoInve: normalizeEstadoOperativo(data.prvEquipoestadoInve),
    prvEquipoactivoInve: normalizeEstadoRegistro(data.prvEquipoactivoInve),
    prvEstadoregInve: normalizeEstadoRegistro(data.prvEstadoregInve),
    prvDescripcionInve: data.prvDescripcionInve ?? ""
  };
}

export function EquipoForm({
  open,
  loading = false,
  initialData,
  onClose,
  onSubmit
}: EquipoFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    control,
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
      prvPrimarykeyInve: initialData?.prvPrimarykeyInve,
      prvIdentifkeyInve: normalizeKey(values.prvIdentifkeyInve),
      prvIdentifkeyMprv: normalizeKey(values.prvIdentifkeyMprv),
      prvTipoequipoTieq: normalizeKey(values.prvTipoequipoTieq),
      prvNombrequipoInve: normalizeText(values.prvNombrequipoInve),
      prvRefermodeloInve: normalizeText(values.prvRefermodeloInve) || undefined,
      prvEquipoestadoInve: normalizeEstadoOperativo(values.prvEquipoestadoInve),
      prvEquipoactivoInve: normalizeEstadoRegistro(
        values.prvEquipoactivoInve
      ) as EstadoRegistro,
      prvEstadoregInve: normalizeEstadoRegistro(
        values.prvEstadoregInve
      ) as EstadoRegistro,
      prvDescripcionInve: normalizeText(values.prvDescripcionInve) || undefined
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
          {initialData ? "Editar equipo" : "Crear equipo"}
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
          Registra maquinaria, vehículos, herramientas o equipos disponibles
          para la operación de obra.
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
            Identificación del equipo
          </Box>

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label="Código equipo"
                placeholder="EQ-0001"
                error={Boolean(errors.prvIdentifkeyInve)}
                helperText={
                  errors.prvIdentifkeyInve?.message ??
                  "Código único del equipo o inventario."
                }
                slotProps={{
                  input: {
                    readOnly: Boolean(initialData)
                  }
                }}
                {...register("prvIdentifkeyInve", {
                  required: "El código del equipo es obligatorio",
                  minLength: {
                    value: 3,
                    message: "El código debe tener mínimo 3 caracteres"
                  },
                  validate: value =>
                    value.trim().length > 0 ||
                    "El código del equipo es obligatorio"
                })}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label="Proveedor"
                placeholder="PROV-0001"
                error={Boolean(errors.prvIdentifkeyMprv)}
                helperText={
                  errors.prvIdentifkeyMprv?.message ??
                  "Código del proveedor asociado."
                }
                {...register("prvIdentifkeyMprv", {
                  required: "El proveedor es obligatorio",
                  validate: value =>
                    value.trim().length > 0 || "El proveedor es obligatorio"
                })}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label="Tipo equipo"
                placeholder="RETROEXCAVADORA"
                error={Boolean(errors.prvTipoequipoTieq)}
                helperText={
                  errors.prvTipoequipoTieq?.message ??
                  "Código del tipo de equipo."
                }
                {...register("prvTipoequipoTieq", {
                  required: "El tipo de equipo es obligatorio",
                  validate: value =>
                    value.trim().length > 0 ||
                    "El tipo de equipo es obligatorio"
                })}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Nombre equipo"
                placeholder="Retroexcavadora CAT 420"
                error={Boolean(errors.prvNombrequipoInve)}
                helperText={errors.prvNombrequipoInve?.message}
                {...register("prvNombrequipoInve", {
                  required: "El nombre del equipo es obligatorio",
                  minLength: {
                    value: 3,
                    message:
                      "El nombre del equipo debe tener mínimo 3 caracteres"
                  },
                  validate: value =>
                    value.trim().length > 0 ||
                    "El nombre del equipo es obligatorio"
                })}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Referencia / modelo"
                placeholder="CAT 420F2"
                helperText="Modelo, referencia, placa, serial o identificación comercial."
                {...register("prvRefermodeloInve")}
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
            Estado operativo y disponibilidad
          </Box>

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Controller
                name="prvEquipoestadoInve"
                control={control}
                defaultValue="OPERATIVO"
                render={({ field }) => (
                  <TextField
                    select
                    fullWidth
                    label="Estado operativo"
                    value={field.value ?? "OPERATIVO"}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    inputRef={field.ref}
                  >
                    <MenuItem value="OPERATIVO">Operativo</MenuItem>
                    <MenuItem value="MANTENIMIENTO">Mantenimiento</MenuItem>
                    <MenuItem value="FUERA_SERVICIO">Fuera de servicio</MenuItem>
                    <MenuItem value="ASIGNADO">Asignado</MenuItem>
                    <MenuItem value="DISPONIBLE">Disponible</MenuItem>
                  </TextField>
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <Controller
                name="prvEquipoactivoInve"
                control={control}
                defaultValue="1"
                render={({ field }) => (
                  <TextField
                    select
                    fullWidth
                    label="Disponible"
                    value={field.value ?? "1"}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    inputRef={field.ref}
                  >
                    <MenuItem value="1">Sí</MenuItem>
                    <MenuItem value="2">No</MenuItem>
                  </TextField>
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <Controller
                name="prvEstadoregInve"
                control={control}
                defaultValue="1"
                render={({ field }) => (
                  <TextField
                    select
                    fullWidth
                    label="Estado registro"
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
            Descripción
          </Box>

          <Grid container spacing={2}>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                multiline
                minRows={3}
                label="Descripción"
                placeholder="Describe características, capacidad, observaciones técnicas o condiciones del equipo."
                error={Boolean(errors.prvDescripcionInve)}
                helperText={errors.prvDescripcionInve?.message}
                {...register("prvDescripcionInve", {
                  minLength: {
                    value: 5,
                    message: "La descripción debe tener mínimo 5 caracteres"
                  }
                })}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={onClose} disabled={loading}>
            Cancelar
          </Button>

          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? "Guardando..." : "Guardar equipo"}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}