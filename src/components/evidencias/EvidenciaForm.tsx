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
import { EvidenciaDto } from "../../types/evidencias.types";

interface EvidenciaFormProps {
  open: boolean;
  loading?: boolean;
  initialData?: EvidenciaDto | null;
  onClose: () => void;
  onSubmit: (data: EvidenciaDto) => Promise<void> | void;
}

const defaultValues: EvidenciaDto = {
  eviIdentifkeyEvid: "",
  eviIdentifkeyTiev: "",
  eviNombrearchivoEvid: "",
  eviDescripcionEvid: "",
  eviUrlarchivoEvid: "",
  eviFechacapturaEvid: "",
  eviLatitudEvid: undefined,
  eviLongitudEvid: undefined,
  eviTiporegistEvid: "1",
  eviEstadoregEvid: "1"
};

export function EvidenciaForm({
  open,
  loading = false,
  initialData,
  onClose,
  onSubmit
}: EvidenciaFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<EvidenciaDto>({
    defaultValues
  });

  useEffect(() => {
    reset(initialData ?? defaultValues);
  }, [initialData, reset, open]);

  return (
    <Dialog open={open} onClose={loading ? undefined : onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {initialData ? "Editar evidencia" : "Crear evidencia / foto"}
      </DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Código evidencia"
              {...register("eviIdentifkeyEvid", {
                required: "El código de evidencia es obligatorio"
              })}
              error={!!errors.eviIdentifkeyEvid}
              helperText={errors.eviIdentifkeyEvid?.message}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Tipo evidencia"
              {...register("eviIdentifkeyTiev", {
                required: "El tipo de evidencia es obligatorio"
              })}
              error={!!errors.eviIdentifkeyTiev}
              helperText={errors.eviIdentifkeyTiev?.message}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              label="Nombre archivo"
              {...register("eviNombrearchivoEvid", {
                required: "El nombre del archivo es obligatorio"
              })}
              error={!!errors.eviNombrearchivoEvid}
              helperText={errors.eviNombrearchivoEvid?.message}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              label="URL archivo"
              {...register("eviUrlarchivoEvid", {
                required: "La URL del archivo es obligatoria"
              })}
              error={!!errors.eviUrlarchivoEvid}
              helperText={errors.eviUrlarchivoEvid?.message}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              multiline
              minRows={3}
              label="Descripción"
              {...register("eviDescripcionEvid")}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              fullWidth
              type="date"
              label="Fecha captura"
              slotProps={{
                inputLabel: {
                  shrink: true
                }
              }}
              {...register("eviFechacapturaEvid")}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              fullWidth
              type="number"
              label="Latitud"
              {...register("eviLatitudEvid", { valueAsNumber: true })}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              fullWidth
              type="number"
              label="Longitud"
              {...register("eviLongitudEvid", { valueAsNumber: true })}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Tipo registro"
              {...register("eviTiporegistEvid")}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Estado"
              {...register("eviEstadoregEvid")}
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