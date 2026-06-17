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
  sisCodpaiSipa: "",
  sisIdedptSidp: "",
  sisCodproSipr: "",
  prvCodposMprv: "",
  prvIdentifkeyRelg: "",
  prvEstadoregMprv: "1"
};

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
    sisCodpaiSipa: data.sisCodpaiSipa ?? "",
    sisIdedptSidp: data.sisIdedptSidp ?? "",
    sisCodproSipr: data.sisCodproSipr ?? "",
    prvCodposMprv: data.prvCodposMprv ?? "",
    prvIdentifkeyRelg: data.prvIdentifkeyRelg ?? "",
    prvEstadoregMprv: data.prvEstadoregMprv ?? "1"
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
      prvIdentifkeyMprv: values.prvIdentifkeyMprv.trim(),
      prvNumeronitMprv: values.prvNumeronitMprv.trim(),
      prvRazonsocialMprv: values.prvRazonsocialMprv.trim(),
      prvObjetosocialMprv: values.prvObjetosocialMprv.trim(),
      sisTiposociedadTpso: values.sisTiposociedadTpso.trim(),
      sisCodactividadCiiu: values.sisCodactividadCiiu.trim(),
      prvFechconstMprv: values.prvFechconstMprv,
      prvPaginawebMprv: values.prvPaginawebMprv.trim(),
      prvDireccionMprv: values.prvDireccionMprv.trim(),
      prvTelefonoMprv: values.prvTelefonoMprv.trim(),
      prvCorreoMprv: values.prvCorreoMprv.trim(),
      sisCodpaiSipa: values.sisCodpaiSipa.trim(),
      sisIdedptSidp: values.sisIdedptSidp.trim(),
      sisCodproSipr: values.sisCodproSipr.trim(),
      prvCodposMprv: values.prvCodposMprv.trim(),
      prvIdentifkeyRelg: values.prvIdentifkeyRelg.trim() || null,
      prvEstadoregMprv: (values.prvEstadoregMprv || "1") as EstadoRegistro
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
        {initialData ? "Editar proveedor" : "Crear proveedor"}
      </DialogTitle>

      <Box component="form" onSubmit={handleSubmit(submitForm)}>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label="Código proveedor"
                placeholder="PROV-0001"
                error={Boolean(errors.prvIdentifkeyMprv)}
                helperText={errors.prvIdentifkeyMprv?.message}
                {...register("prvIdentifkeyMprv", {
                  required: "El código del proveedor es obligatorio"
                })}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label="NIT"
                error={Boolean(errors.prvNumeronitMprv)}
                helperText={errors.prvNumeronitMprv?.message}
                {...register("prvNumeronitMprv", {
                  required: "El NIT es obligatorio"
                })}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label="Tipo sociedad"
                placeholder="SAS, LTDA, SA"
                {...register("sisTiposociedadTpso")}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Razón social"
                error={Boolean(errors.prvRazonsocialMprv)}
                helperText={errors.prvRazonsocialMprv?.message}
                {...register("prvRazonsocialMprv", {
                  required: "La razón social es obligatoria"
                })}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                multiline
                minRows={3}
                label="Objeto social"
                {...register("prvObjetosocialMprv")}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label="Código actividad CIIU"
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
                {...register("prvPaginawebMprv")}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Dirección"
                {...register("prvDireccionMprv")}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 3 }}>
              <TextField
                fullWidth
                label="Teléfono"
                {...register("prvTelefonoMprv")}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 3 }}>
              <TextField
                fullWidth
                type="email"
                label="Correo"
                {...register("prvCorreoMprv")}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 3 }}>
              <TextField
                fullWidth
                label="País"
                placeholder="CO"
                {...register("sisCodpaiSipa")}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 3 }}>
              <TextField
                fullWidth
                label="Departamento"
                {...register("sisIdedptSidp")}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 3 }}>
              <TextField
                fullWidth
                label="Municipio"
                {...register("sisCodproSipr")}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 3 }}>
              <TextField
                fullWidth
                label="Código postal"
                {...register("prvCodposMprv")}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Representante legal / key"
                {...register("prvIdentifkeyRelg")}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Estado"
                placeholder="1"
                {...register("prvEstadoregMprv")}
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