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
import { EvidenciaDto } from "../../types/evidencias.types";
import { EstadoRegistro } from "../../types/common.types";

interface FormValues {
  eviIdentifkeyEvid: string;
  eviIdentifkeyTiev: string;
  eviNombrearchivoEvid: string;
  eviDescripcionEvid: string;
  eviUrlarchivoEvid: string;
  eviFechacapturaEvid: string;
  eviLatitudEvid: number | "";
  eviLongitudEvid: number | "";
  eviTiporegistEvid: string;
  eviEstadoregEvid: string;
}

interface EvidenciaFormProps {
  open: boolean;
  loading?: boolean;
  initialData?: EvidenciaDto | null;
  onClose: () => void;
  onSubmit: (data: EvidenciaDto) => Promise<void> | void;
}

const emptyValues: FormValues = {
  eviIdentifkeyEvid: "",
  eviIdentifkeyTiev: "",
  eviNombrearchivoEvid: "",
  eviDescripcionEvid: "",
  eviUrlarchivoEvid: "",
  eviFechacapturaEvid: "",
  eviLatitudEvid: "",
  eviLongitudEvid: "",
  eviTiporegistEvid: "1",
  eviEstadoregEvid: "1"
};

function mapInitialData(data: EvidenciaDto): FormValues {
  return {
    eviIdentifkeyEvid: data.eviIdentifkeyEvid ?? "",
    eviIdentifkeyTiev: data.eviIdentifkeyTiev ?? "",
    eviNombrearchivoEvid: data.eviNombrearchivoEvid ?? "",
    eviDescripcionEvid: data.eviDescripcionEvid ?? "",
    eviUrlarchivoEvid: data.eviUrlarchivoEvid ?? "",
    eviFechacapturaEvid: data.eviFechacapturaEvid ?? "",
    eviLatitudEvid:
      typeof data.eviLatitudEvid === "number" ? data.eviLatitudEvid : "",
    eviLongitudEvid:
      typeof data.eviLongitudEvid === "number" ? data.eviLongitudEvid : "",
    eviTiporegistEvid: data.eviTiporegistEvid ?? "1",
    eviEstadoregEvid: data.eviEstadoregEvid ?? "1"
  };
}

function toOptionalNumber(value: number | "" | undefined) {
  if (value === "" || value === undefined || Number.isNaN(value)) {
    return undefined;
  }

  return Number(value);
}

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
      eviPrimarykeyEvid: initialData?.eviPrimarykeyEvid,
      eviIdentifkeyEvid: values.eviIdentifkeyEvid.trim(),
      eviIdentifkeyTiev: values.eviIdentifkeyTiev.trim(),
      eviNombrearchivoEvid: values.eviNombrearchivoEvid.trim(),
      eviDescripcionEvid: values.eviDescripcionEvid.trim(),
      eviUrlarchivoEvid: values.eviUrlarchivoEvid.trim(),
      eviFechacapturaEvid: values.eviFechacapturaEvid,
      eviLatitudEvid: toOptionalNumber(values.eviLatitudEvid),
      eviLongitudEvid: toOptionalNumber(values.eviLongitudEvid),
      eviTiporegistEvid: values.eviTiporegistEvid || "1",
      eviEstadoregEvid: (values.eviEstadoregEvid || "1") as EstadoRegistro
    });
  };

  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        {initialData ? "Editar evidencia" : "Crear evidencia / foto"}
      </DialogTitle>

      <Box component="form" onSubmit={handleSubmit(submitForm)}>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Código evidencia"
                error={Boolean(errors.eviIdentifkeyEvid)}
                helperText={errors.eviIdentifkeyEvid?.message}
                {...register("eviIdentifkeyEvid", {
                  required: "El código de evidencia es obligatorio"
                })}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Tipo evidencia"
                error={Boolean(errors.eviIdentifkeyTiev)}
                helperText={errors.eviIdentifkeyTiev?.message}
                {...register("eviIdentifkeyTiev", {
                  required: "El tipo de evidencia es obligatorio"
                })}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Nombre archivo"
                error={Boolean(errors.eviNombrearchivoEvid)}
                helperText={errors.eviNombrearchivoEvid?.message}
                {...register("eviNombrearchivoEvid", {
                  required: "El nombre del archivo es obligatorio"
                })}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="URL archivo"
                error={Boolean(errors.eviUrlarchivoEvid)}
                helperText={errors.eviUrlarchivoEvid?.message}
                {...register("eviUrlarchivoEvid", {
                  required: "La URL del archivo es obligatoria"
                })}
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
                {...register("eviLatitudEvid", {
                  valueAsNumber: true
                })}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                type="number"
                label="Longitud"
                {...register("eviLongitudEvid", {
                  valueAsNumber: true
                })}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Tipo registro interno"
                placeholder="1"
                {...register("eviTiporegistEvid")}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Estado"
                placeholder="1"
                {...register("eviEstadoregEvid")}
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