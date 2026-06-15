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
import { ProveedorDto } from "../../types/proveedores.types";

interface ProveedorFormProps {
  open: boolean;
  loading?: boolean;
  initialData?: ProveedorDto | null;
  onClose: () => void;
  onSubmit: (data: ProveedorDto) => Promise<void> | void;
}

const defaultValues: ProveedorDto = {
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
  } = useForm<ProveedorDto>({
    defaultValues
  });

  useEffect(() => {
    reset(initialData ?? defaultValues);
  }, [initialData, reset, open]);

  return (
    <Dialog open={open} onClose={loading ? undefined : onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {initialData ? "Editar proveedor" : "Crear proveedor"}
      </DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              fullWidth
              label="Código proveedor"
              {...register("prvIdentifkeyMprv", {
                required: "El código del proveedor es obligatorio"
              })}
              error={!!errors.prvIdentifkeyMprv}
              helperText={errors.prvIdentifkeyMprv?.message}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              fullWidth
              label="NIT"
              {...register("prvNumeronitMprv", {
                required: "El NIT es obligatorio"
              })}
              error={!!errors.prvNumeronitMprv}
              helperText={errors.prvNumeronitMprv?.message}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              fullWidth
              label="Estado"
              {...register("prvEstadoregMprv")}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              label="Razón social"
              {...register("prvRazonsocialMprv", {
                required: "La razón social es obligatoria"
              })}
              error={!!errors.prvRazonsocialMprv}
              helperText={errors.prvRazonsocialMprv?.message}
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
              label="Tipo sociedad"
              {...register("sisTiposociedadTpso")}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              fullWidth
              label="Actividad CIIU"
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

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Página web"
              {...register("prvPaginawebMprv")}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Correo"
              type="email"
              {...register("prvCorreoMprv")}
              error={!!errors.prvCorreoMprv}
              helperText={errors.prvCorreoMprv?.message}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              label="Dirección"
              {...register("prvDireccionMprv")}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              fullWidth
              label="Teléfono"
              {...register("prvTelefonoMprv")}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              fullWidth
              label="País"
              {...register("sisCodpaiSipa")}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              fullWidth
              label="Departamento"
              {...register("sisIdedptSidp")}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              fullWidth
              label="Municipio"
              {...register("sisCodproSipr")}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              fullWidth
              label="Código postal"
              {...register("prvCodposMprv")}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              fullWidth
              label="Representante legal"
              {...register("prvIdentifkeyRelg")}
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