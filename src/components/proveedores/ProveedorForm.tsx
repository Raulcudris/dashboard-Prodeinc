"use client";

import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  TextField
} from "@mui/material";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProveedorDto } from "../../types/proveedores.types";

const proveedorSchema = z.object({
  prvIdentifkeyMprv: z.string().min(1, "La key del proveedor es obligatoria"),
  prvNumeronitMprv: z.string().min(1, "El NIT es obligatorio"),
  prvRazonsocialMprv: z.string().min(1, "La razón social es obligatoria"),
  prvObjetosocialMprv: z.string().optional(),
  sisTiposociedadTpso: z.string().optional(),
  sisCodactividadCiiu: z.string().optional(),
  prvFechconstMprv: z.string().optional(),
  prvPaginawebMprv: z.string().optional(),
  prvDireccionMprv: z.string().optional(),
  prvTelefonoMprv: z.string().optional(),
  prvCorreoMprv: z
    .string()
    .email("Correo inválido")
    .optional()
    .or(z.literal("")),
  sisCodpaiSipa: z.string().optional(),
  sisIdedptSidp: z.string().optional(),
  sisCodproSipr: z.string().optional(),
  prvCodposMprv: z.string().optional(),
  prvIdentifkeyRelg: z.string().nullable().optional(),
  prvEstadoregMprv: z.string().optional()
});

type ProveedorFormValues = z.infer<typeof proveedorSchema>;

interface ProveedorFormProps {
  initialData?: ProveedorDto | null;
  loading?: boolean;
  onCancel: () => void;
  onSubmit: (data: ProveedorDto) => void;
}

const defaultValues: ProveedorFormValues = {
  prvIdentifkeyMprv: "",
  prvNumeronitMprv: "",
  prvRazonsocialMprv: "",
  prvObjetosocialMprv: "",
  sisTiposociedadTpso: "S",
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
  prvIdentifkeyRelg: null,
  prvEstadoregMprv: "1"
};

export function ProveedorForm({
  initialData,
  loading = false,
  onCancel,
  onSubmit
}: ProveedorFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<ProveedorFormValues>({
    resolver: zodResolver(proveedorSchema),
    defaultValues
  });

  useEffect(() => {
    if (initialData) {
      reset({
        prvIdentifkeyMprv: initialData.prvIdentifkeyMprv ?? "",
        prvNumeronitMprv: initialData.prvNumeronitMprv ?? "",
        prvRazonsocialMprv: initialData.prvRazonsocialMprv ?? "",
        prvObjetosocialMprv: initialData.prvObjetosocialMprv ?? "",
        sisTiposociedadTpso: initialData.sisTiposociedadTpso ?? "S",
        sisCodactividadCiiu: initialData.sisCodactividadCiiu ?? "",
        prvFechconstMprv: initialData.prvFechconstMprv ?? "",
        prvPaginawebMprv: initialData.prvPaginawebMprv ?? "",
        prvDireccionMprv: initialData.prvDireccionMprv ?? "",
        prvTelefonoMprv: initialData.prvTelefonoMprv ?? "",
        prvCorreoMprv: initialData.prvCorreoMprv ?? "",
        sisCodpaiSipa: initialData.sisCodpaiSipa ?? "CO",
        sisIdedptSidp: initialData.sisIdedptSidp ?? "",
        sisCodproSipr: initialData.sisCodproSipr ?? "",
        prvCodposMprv: initialData.prvCodposMprv ?? "",
        prvIdentifkeyRelg: initialData.prvIdentifkeyRelg ?? null,
        prvEstadoregMprv: initialData.prvEstadoregMprv ?? "1"
      });
    } else {
      reset(defaultValues);
    }
  }, [initialData, reset]);

  const submitForm = (values: ProveedorFormValues) => {
    const data: ProveedorDto = {
      prvIdentifkeyMprv: values.prvIdentifkeyMprv,
      prvNumeronitMprv: values.prvNumeronitMprv,
      prvRazonsocialMprv: values.prvRazonsocialMprv,
      prvObjetosocialMprv: values.prvObjetosocialMprv || "",
      sisTiposociedadTpso: values.sisTiposociedadTpso || "S",
      sisCodactividadCiiu: values.sisCodactividadCiiu || "",
      prvFechconstMprv: values.prvFechconstMprv || "",
      prvPaginawebMprv: values.prvPaginawebMprv || "",
      prvDireccionMprv: values.prvDireccionMprv || "",
      prvTelefonoMprv: values.prvTelefonoMprv || "",
      prvCorreoMprv: values.prvCorreoMprv || "",
      sisCodpaiSipa: values.sisCodpaiSipa || "CO",
      sisIdedptSidp: values.sisIdedptSidp || "",
      sisCodproSipr: values.sisCodproSipr || "",
      prvCodposMprv: values.prvCodposMprv || "",
      prvIdentifkeyRelg: values.prvIdentifkeyRelg || null,
      prvEstadoregMprv: values.prvEstadoregMprv || "1"
    };

    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(submitForm)}>
      <DialogContent dividers>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "1fr 1fr"
            },
            gap: 2
          }}
        >
          <TextField
            label="Key proveedor"
            fullWidth
            disabled={Boolean(initialData)}
            error={Boolean(errors.prvIdentifkeyMprv)}
            helperText={errors.prvIdentifkeyMprv?.message}
            {...register("prvIdentifkeyMprv")}
          />

          <TextField
            label="NIT"
            fullWidth
            error={Boolean(errors.prvNumeronitMprv)}
            helperText={errors.prvNumeronitMprv?.message}
            {...register("prvNumeronitMprv")}
          />

          <TextField
            label="Razón social"
            fullWidth
            error={Boolean(errors.prvRazonsocialMprv)}
            helperText={errors.prvRazonsocialMprv?.message}
            {...register("prvRazonsocialMprv")}
          />

          <TextField
            label="Correo"
            fullWidth
            error={Boolean(errors.prvCorreoMprv)}
            helperText={errors.prvCorreoMprv?.message}
            {...register("prvCorreoMprv")}
          />

          <TextField
            label="Teléfono"
            fullWidth
            {...register("prvTelefonoMprv")}
          />

          <TextField
            label="Dirección"
            fullWidth
            {...register("prvDireccionMprv")}
          />

          <TextField
            label="País"
            fullWidth
            {...register("sisCodpaiSipa")}
          />

          <TextField
            label="Departamento"
            fullWidth
            {...register("sisIdedptSidp")}
          />

          <TextField
            label="Municipio"
            fullWidth
            {...register("sisCodproSipr")}
          />

          <TextField
            label="Código postal"
            fullWidth
            {...register("prvCodposMprv")}
          />

          <TextField
            label="Tipo sociedad"
            fullWidth
            {...register("sisTiposociedadTpso")}
          />

          <TextField
            label="Actividad CIIU"
            fullWidth
            {...register("sisCodactividadCiiu")}
          />

          <TextField
            label="Fecha constitución"
            type="date"
            fullWidth
            slotProps={{
              inputLabel: {
                shrink: true
              }
            }}
            {...register("prvFechconstMprv")}
          />

          <TextField
            label="Página web"
            fullWidth
            {...register("prvPaginawebMprv")}
          />

          <TextField
            label="Objeto social"
            fullWidth
            multiline
            minRows={3}
            sx={{ gridColumn: { xs: "auto", md: "1 / 3" } }}
            {...register("prvObjetosocialMprv")}
          />
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onCancel} disabled={loading}>
          Cancelar
        </Button>

        <Button type="submit" variant="contained" disabled={loading}>
          {loading ? "Guardando..." : "Guardar"}
        </Button>
      </DialogActions>
    </form>
  );
}