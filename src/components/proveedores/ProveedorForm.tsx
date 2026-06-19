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

import { ProveedorDto } from "../../types/proveedores.types";
import { EstadoRegistro } from "../../types/common.types";

interface FormValues {
  prvIdentifkeyMprv: string;
  prvNumeronitMprv: string;
  prvRazonsocialMprv: string;
  prvObjetosocialMprv: string;
  sisTiposociedadTpso: string;
  sisCodactividadCiiu: string;
  prvFechconstMprv: string;
  prvPaginawebMprv: string;
  prvDireccionMprv: string;
  prvTelefonoMprv: string;
  prvCorreoMprv: string;
  sisCodpaiSipa: string;
  sisIdedptSidp: string;
  sisCodproSipr: string;
  prvCodposMprv: string;
  prvIdentifkeyRelg: string;
  prvEstadoregMprv: string;
}

interface ProveedorFormProps {
  open: boolean;
  loading?: boolean;
  initialData?: ProveedorDto | null;
  onClose: () => void;
  onSubmit: (data: ProveedorDto) => Promise<void> | void;
}

const emptyValues: FormValues = {
  prvIdentifkeyMprv: "",
  prvNumeronitMprv: "",
  prvRazonsocialMprv: "",
  prvObjetosocialMprv: "",
  sisTiposociedadTpso: "",
  sisCodactividadCiiu: "",
  prvFechconstMprv: "",
  prvPaginawebMprv: "",
  prvDireccionMprv: "",
  prvTelefonoMprv: "",
  prvCorreoMprv: "",
  sisCodpaiSipa: "CO",
  sisIdedptSidp: "",
  sisCodproSipr: "",
  prvCodposMprv: "",
  prvIdentifkeyRelg: "",
  prvEstadoregMprv: "1"
};

function normalizeEstadoRegistro(value?: string) {
  const normalizedValue = String(value ?? "1");

  return ["1", "2"].includes(normalizedValue) ? normalizedValue : "1";
}

function normalizeKey(value: string) {
  return value.trim().toUpperCase();
}

function normalizeText(value: string) {
  return value.trim();
}

function normalizeLowerText(value: string) {
  return value.trim().toLowerCase();
}

function mapInitialData(data: ProveedorDto): FormValues {
  return {
    prvIdentifkeyMprv: data.prvIdentifkeyMprv ?? "",
    prvNumeronitMprv: data.prvNumeronitMprv ?? "",
    prvRazonsocialMprv: data.prvRazonsocialMprv ?? "",
    prvObjetosocialMprv: data.prvObjetosocialMprv ?? "",
    sisTiposociedadTpso: data.sisTiposociedadTpso ?? "",
    sisCodactividadCiiu: data.sisCodactividadCiiu ?? "",
    prvFechconstMprv: data.prvFechconstMprv ?? "",
    prvPaginawebMprv: data.prvPaginawebMprv ?? "",
    prvDireccionMprv: data.prvDireccionMprv ?? "",
    prvTelefonoMprv: data.prvTelefonoMprv ?? "",
    prvCorreoMprv: data.prvCorreoMprv ?? "",
    sisCodpaiSipa: data.sisCodpaiSipa ?? "CO",
    sisIdedptSidp: data.sisIdedptSidp ?? "",
    sisCodproSipr: data.sisCodproSipr ?? "",
    prvCodposMprv: data.prvCodposMprv ?? "",
    prvIdentifkeyRelg: data.prvIdentifkeyRelg ?? "",
    prvEstadoregMprv: normalizeEstadoRegistro(data.prvEstadoregMprv)
  };
}

export function ProveedorForm({
  open,
  loading = false,
  initialData,
  onClose,
  onSubmit
}: ProveedorFormProps) {
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
      prvPrimarykeyMprv: initialData?.prvPrimarykeyMprv,
      prvIdentifkeyMprv: normalizeKey(values.prvIdentifkeyMprv),
      prvNumeronitMprv: normalizeText(values.prvNumeronitMprv),
      prvRazonsocialMprv: normalizeText(values.prvRazonsocialMprv),
      prvObjetosocialMprv:
        normalizeText(values.prvObjetosocialMprv) || undefined,
      sisTiposociedadTpso: normalizeKey(values.sisTiposociedadTpso) || undefined,
      sisCodactividadCiiu:
        normalizeText(values.sisCodactividadCiiu) || undefined,
      prvFechconstMprv: values.prvFechconstMprv || undefined,
      prvPaginawebMprv: normalizeLowerText(values.prvPaginawebMprv) || undefined,
      prvDireccionMprv: normalizeText(values.prvDireccionMprv) || undefined,
      prvTelefonoMprv: normalizeText(values.prvTelefonoMprv) || undefined,
      prvCorreoMprv: normalizeLowerText(values.prvCorreoMprv) || undefined,
      sisCodpaiSipa: normalizeKey(values.sisCodpaiSipa) || undefined,
      sisIdedptSidp: normalizeKey(values.sisIdedptSidp) || undefined,
      sisCodproSipr: normalizeKey(values.sisCodproSipr) || undefined,
      prvCodposMprv: normalizeText(values.prvCodposMprv) || undefined,
      prvIdentifkeyRelg: normalizeKey(values.prvIdentifkeyRelg) || null,
      prvEstadoregMprv: normalizeEstadoRegistro(
        values.prvEstadoregMprv
      ) as EstadoRegistro
    });
  };

  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      maxWidth="lg"
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
          {initialData ? "Editar proveedor" : "Crear proveedor"}
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
          Registra proveedores de maquinaria, equipos, suministros, materiales o
          servicios asociados a la operación de obra.
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
            Identificación del proveedor
          </Box>

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label="Código proveedor"
                placeholder="PROV-0001"
                error={Boolean(errors.prvIdentifkeyMprv)}
                helperText={
                  errors.prvIdentifkeyMprv?.message ??
                  "Código único del proveedor."
                }
                slotProps={{
                  input: {
                    readOnly: Boolean(initialData)
                  }
                }}
                {...register("prvIdentifkeyMprv", {
                  required: "El código del proveedor es obligatorio",
                  minLength: {
                    value: 3,
                    message: "El código debe tener mínimo 3 caracteres"
                  },
                  validate: value =>
                    value.trim().length > 0 ||
                    "El código del proveedor es obligatorio"
                })}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label="NIT"
                placeholder="900123456-7"
                error={Boolean(errors.prvNumeronitMprv)}
                helperText={errors.prvNumeronitMprv?.message}
                {...register("prvNumeronitMprv", {
                  required: "El NIT es obligatorio",
                  minLength: {
                    value: 5,
                    message: "El NIT debe tener mínimo 5 caracteres"
                  },
                  validate: value =>
                    value.trim().length > 0 || "El NIT es obligatorio"
                })}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label="Tipo sociedad"
                placeholder="SAS, LTDA, SA"
                helperText="Opcional. Tipo societario o clasificación jurídica."
                {...register("sisTiposociedadTpso")}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Razón social"
                placeholder="Nombre legal del proveedor"
                error={Boolean(errors.prvRazonsocialMprv)}
                helperText={errors.prvRazonsocialMprv?.message}
                {...register("prvRazonsocialMprv", {
                  required: "La razón social es obligatoria",
                  minLength: {
                    value: 3,
                    message: "La razón social debe tener mínimo 3 caracteres"
                  },
                  validate: value =>
                    value.trim().length > 0 ||
                    "La razón social es obligatoria"
                })}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                multiline
                minRows={3}
                label="Objeto social"
                placeholder="Describe la actividad principal del proveedor."
                error={Boolean(errors.prvObjetosocialMprv)}
                helperText={errors.prvObjetosocialMprv?.message}
                {...register("prvObjetosocialMprv", {
                  minLength: {
                    value: 5,
                    message: "El objeto social debe tener mínimo 5 caracteres"
                  }
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
            Información comercial
          </Box>

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label="Código actividad CIIU"
                placeholder="Ejemplo: 4210"
                helperText="Opcional. Actividad económica registrada."
                {...register("sisCodactividadCiiu")}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                type="date"
                label="Fecha constitución"
                slotProps={{
                  inputLabel: {
                    shrink: true
                  }
                }}
                {...register("prvFechconstMprv")}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label="Página web"
                placeholder="https://www.proveedor.com"
                error={Boolean(errors.prvPaginawebMprv)}
                helperText={errors.prvPaginawebMprv?.message}
                {...register("prvPaginawebMprv", {
                  validate: value => {
                    const cleanValue = value.trim();

                    if (!cleanValue) return true;

                    return (
                      cleanValue.startsWith("http://") ||
                      cleanValue.startsWith("https://") ||
                      "La página web debe iniciar con http:// o https://"
                    );
                  }
                })}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label="Representante legal / key"
                placeholder="RELG-0001"
                helperText="Opcional. Código del representante legal."
                {...register("prvIdentifkeyRelg")}
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
            Contacto y ubicación
          </Box>

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Dirección"
                placeholder="Dirección principal del proveedor"
                {...register("prvDireccionMprv")}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 3 }}>
              <TextField
                fullWidth
                label="Teléfono"
                placeholder="3001234567"
                error={Boolean(errors.prvTelefonoMprv)}
                helperText={errors.prvTelefonoMprv?.message}
                {...register("prvTelefonoMprv", {
                  minLength: {
                    value: 7,
                    message: "El teléfono debe tener mínimo 7 caracteres"
                  }
                })}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 3 }}>
              <TextField
                fullWidth
                type="email"
                label="Correo"
                placeholder="contacto@proveedor.com"
                error={Boolean(errors.prvCorreoMprv)}
                helperText={errors.prvCorreoMprv?.message}
                {...register("prvCorreoMprv", {
                  validate: value => {
                    const cleanValue = value.trim();

                    if (!cleanValue) return true;

                    return (
                      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanValue) ||
                      "El correo no tiene un formato válido"
                    );
                  }
                })}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 3 }}>
              <TextField
                fullWidth
                label="País"
                placeholder="CO"
                helperText="Código del país."
                {...register("sisCodpaiSipa")}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 3 }}>
              <TextField
                fullWidth
                label="Departamento"
                placeholder="CUNDINAMARCA"
                {...register("sisIdedptSidp")}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 3 }}>
              <TextField
                fullWidth
                label="Municipio"
                placeholder="BOGOTA"
                {...register("sisCodproSipr")}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 3 }}>
              <TextField
                fullWidth
                label="Código postal"
                placeholder="110111"
                {...register("prvCodposMprv")}
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
                name="prvEstadoregMprv"
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
            {loading ? "Guardando..." : "Guardar proveedor"}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}