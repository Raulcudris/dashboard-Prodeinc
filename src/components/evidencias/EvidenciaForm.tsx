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
import { EvidenciaDto } from "../../types/evidencias.types";

const schema = z.object({
  eviIdentifkeyEvid: z.string().min(1, "La key de evidencia es obligatoria"),
  eviIdentifkeyTiev: z.string().min(1, "El tipo de evidencia es obligatorio"),
  eviNombrearchivoEvid: z.string().min(1, "El nombre del archivo es obligatorio"),
  eviDescripcionEvid: z.string().optional(),
  eviUrlarchivoEvid: z.string().min(1, "La URL del archivo es obligatoria"),
  eviFechacapturaEvid: z.string().min(1, "La fecha de captura es obligatoria"),
  eviLatitudEvid: z.coerce.number().optional(),
  eviLongitudEvid: z.coerce.number().optional(),
  eviTiporegistEvid: z.string().optional(),
  eviEstadoregEvid: z.string().optional()
});

type FormValues = z.infer<typeof schema>;

interface EvidenciaFormProps {
  loading?: boolean;
  tipoKeyDefault?: string;
  onCancel: () => void;
  onSubmit: (data: EvidenciaDto) => void;
}

export function EvidenciaForm({
  loading = false,
  tipoKeyDefault = "",
  onCancel,
  onSubmit
}: EvidenciaFormProps) {
  const today = new Date().toISOString().slice(0, 10);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      eviIdentifkeyEvid: `EVID-${Date.now().toString().slice(-6)}`,
      eviIdentifkeyTiev: tipoKeyDefault,
      eviNombrearchivoEvid: "",
      eviDescripcionEvid: "",
      eviUrlarchivoEvid: "",
      eviFechacapturaEvid: today,
      eviLatitudEvid: 0,
      eviLongitudEvid: 0,
      eviTiporegistEvid: "1",
      eviEstadoregEvid: "1"
    }
  });

  const submitForm = (values: FormValues) => {
    onSubmit({
      eviIdentifkeyEvid: values.eviIdentifkeyEvid,
      eviIdentifkeyTiev: values.eviIdentifkeyTiev,
      eviNombrearchivoEvid: values.eviNombrearchivoEvid,
      eviDescripcionEvid: values.eviDescripcionEvid || "",
      eviUrlarchivoEvid: values.eviUrlarchivoEvid,
      eviFechacapturaEvid: values.eviFechacapturaEvid,
      eviLatitudEvid: Number(values.eviLatitudEvid || 0),
      eviLongitudEvid: Number(values.eviLongitudEvid || 0),
      eviTiporegistEvid: values.eviTiporegistEvid || "1",
      eviEstadoregEvid: values.eviEstadoregEvid || "1"
    });
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
            label="Key evidencia"
            fullWidth
            error={Boolean(errors.eviIdentifkeyEvid)}
            helperText={errors.eviIdentifkeyEvid?.message}
            {...register("eviIdentifkeyEvid")}
          />

          <TextField
            label="Key tipo evidencia"
            fullWidth
            error={Boolean(errors.eviIdentifkeyTiev)}
            helperText={errors.eviIdentifkeyTiev?.message}
            {...register("eviIdentifkeyTiev")}
          />

          <TextField
            label="Nombre archivo"
            fullWidth
            error={Boolean(errors.eviNombrearchivoEvid)}
            helperText={errors.eviNombrearchivoEvid?.message}
            {...register("eviNombrearchivoEvid")}
          />

          <TextField
            label="Fecha captura"
            type="date"
            fullWidth
            slotProps={{ inputLabel: { shrink: true } }}
            error={Boolean(errors.eviFechacapturaEvid)}
            helperText={errors.eviFechacapturaEvid?.message}
            {...register("eviFechacapturaEvid")}
          />

          <TextField
            label="Latitud"
            type="number"
            fullWidth
            {...register("eviLatitudEvid")}
          />

          <TextField
            label="Longitud"
            type="number"
            fullWidth
            {...register("eviLongitudEvid")}
          />

          <TextField
            label="URL archivo"
            fullWidth
            sx={{ gridColumn: { xs: "auto", md: "1 / 3" } }}
            error={Boolean(errors.eviUrlarchivoEvid)}
            helperText={errors.eviUrlarchivoEvid?.message}
            {...register("eviUrlarchivoEvid")}
          />

          <TextField
            label="Descripción"
            fullWidth
            multiline
            minRows={3}
            sx={{ gridColumn: { xs: "auto", md: "1 / 3" } }}
            {...register("eviDescripcionEvid")}
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