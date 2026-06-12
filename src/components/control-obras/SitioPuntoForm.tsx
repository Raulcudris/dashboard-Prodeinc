"use client";

import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  TextField
} from "@mui/material";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { SitioPuntoDto } from "../../types/controlObras.types";

const schema = z.object({
  orsIdentifkeyPunt: z.string().min(1, "La key del punto es obligatoria"),
  orsIdentifkeyOrde: z.string().min(1, "La orden es obligatoria"),
  orsNombresitioPunt: z.string().min(1, "El nombre del sitio es obligatorio"),
  sisCodproSipr: z.string().optional(),
  orsGeolatitudePunt: z.coerce.number().optional(),
  orsGeolongitudePunt: z.coerce.number().optional(),
  orsPathimagenPunt: z.string().optional(),
  orsTiporegistPunt: z.string().optional(),
  orsEstadoregPunt: z.string().optional()
});

type FormValues = z.infer<typeof schema>;

interface SitioPuntoFormProps {
  loading?: boolean;
  ordenKeyDefault?: string;
  onCancel: () => void;
  onSubmit: (data: SitioPuntoDto) => void;
}

export function SitioPuntoForm({
  loading = false,
  ordenKeyDefault = "",
  onCancel,
  onSubmit
}: SitioPuntoFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      orsIdentifkeyPunt: "",
      orsIdentifkeyOrde: ordenKeyDefault,
      orsNombresitioPunt: "",
      sisCodproSipr: "",
      orsGeolatitudePunt: 0,
      orsGeolongitudePunt: 0,
      orsPathimagenPunt: "",
      orsTiporegistPunt: "1",
      orsEstadoregPunt: "1"
    }
  });

  const submitForm = (values: FormValues) => {
    const data: SitioPuntoDto = {
      orsIdentifkeyPunt: values.orsIdentifkeyPunt,
      orsIdentifkeyOrde: values.orsIdentifkeyOrde,
      orsNombresitioPunt: values.orsNombresitioPunt,
      sisCodproSipr: values.sisCodproSipr || "",
      orsGeolatitudePunt: Number(values.orsGeolatitudePunt || 0),
      orsGeolongitudePunt: Number(values.orsGeolongitudePunt || 0),
      orsPathimagenPunt: values.orsPathimagenPunt || "",
      orsTiporegistPunt: values.orsTiporegistPunt || "1",
      orsEstadoregPunt: values.orsEstadoregPunt || "1"
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
            label="Key punto"
            fullWidth
            error={Boolean(errors.orsIdentifkeyPunt)}
            helperText={errors.orsIdentifkeyPunt?.message}
            {...register("orsIdentifkeyPunt")}
          />

          <TextField
            label="Key orden"
            fullWidth
            error={Boolean(errors.orsIdentifkeyOrde)}
            helperText={errors.orsIdentifkeyOrde?.message}
            {...register("orsIdentifkeyOrde")}
          />

          <TextField
            label="Nombre sitio"
            fullWidth
            error={Boolean(errors.orsNombresitioPunt)}
            helperText={errors.orsNombresitioPunt?.message}
            {...register("orsNombresitioPunt")}
          />

          <TextField
            label="Municipio / código"
            fullWidth
            {...register("sisCodproSipr")}
          />

          <TextField
            label="Latitud"
            type="number"
            fullWidth
            {...register("orsGeolatitudePunt")}
          />

          <TextField
            label="Longitud"
            type="number"
            fullWidth
            {...register("orsGeolongitudePunt")}
          />

          <TextField
            label="URL imagen"
            fullWidth
            sx={{ gridColumn: { xs: "auto", md: "1 / 3" } }}
            {...register("orsPathimagenPunt")}
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