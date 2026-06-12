"use client";

import {
  Box,
  Button,
  Card,
  CardContent,
  DialogActions,
  DialogContent,
  FormControlLabel,
  MenuItem,
  Switch,
  TextField,
  Typography
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";

import { equiposMaquinariaService } from "../../services/equipos.service";
import { DetalleEquipoOperacionDto } from "../../types/detalle-equipo-operacion.types";
import {
  EquipoDto,
  TipoEquipoDto,
  UnidadMedidaDto
} from "../../types/equipos.types";

interface DetalleEquipoOperacionFormProps {
  loading?: boolean;
  reporteOperacionKeyDefault?: string;
  ordenKeyDefault?: string;
  puntoKeyDefault?: string;
  proyeccionKeyDefault?: string;
  planSemanalKeyDefault?: string;
  initialValues?: Partial<DetalleEquipoOperacionDto>;
  onCancel: () => void;
  onSubmit: (data: DetalleEquipoOperacionDto) => void;
}

function todayString() {
  return new Date().toISOString().slice(0, 10);
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0
  }).format(value || 0);
}

function getTipoControlByUnidad(unidadKey?: string) {
  if (unidadKey === "KM") return "KILOMETRAJE";
  if (unidadKey === "DIA") return "DIA";
  return "HOROMETRO";
}

function calculateCantidad(data: DetalleEquipoOperacionDto) {
  if (data.orsUnidadDeop === "KM") {
    return Math.max(
      Number(data.orsKmfinalDeop || 0) - Number(data.orsKminicialDeop || 0),
      0
    );
  }

  if (data.orsUnidadDeop === "DIA") {
    return Number(data.orsDiatrabajadoDeop || 0);
  }

  return Math.max(
    Number(data.orsHorometrofinDeop || 0) -
      Number(data.orsHorometroiniDeop || 0),
    0
  );
}

export function DetalleEquipoOperacionForm({
  loading = false,
  reporteOperacionKeyDefault = "",
  ordenKeyDefault = "",
  puntoKeyDefault = "",
  proyeccionKeyDefault = "",
  planSemanalKeyDefault = "",
  initialValues,
  onCancel,
  onSubmit
}: DetalleEquipoOperacionFormProps) {
  const [equiposCatalogo, setEquiposCatalogo] = useState<EquipoDto[]>([]);
  const [tiposCatalogo, setTiposCatalogo] = useState<TipoEquipoDto[]>([]);
  const [unidadesCatalogo, setUnidadesCatalogo] = useState<UnidadMedidaDto[]>(
    []
  );

  const [form, setForm] = useState<DetalleEquipoOperacionDto>({
    orsIdentifkeyDeop:
      initialValues?.orsIdentifkeyDeop ||
      `DEOP-${Date.now().toString().slice(-6)}`,
    orsIdentifkeyRope:
      initialValues?.orsIdentifkeyRope || reporteOperacionKeyDefault,
    orsIdentifkeyOrde: initialValues?.orsIdentifkeyOrde || ordenKeyDefault,
    orsIdentifkeyPunt: initialValues?.orsIdentifkeyPunt || puntoKeyDefault,
    orsIdentifkeyPsem: initialValues?.orsIdentifkeyPsem || proyeccionKeyDefault,
    orsIdentifkeyPlse:
      initialValues?.orsIdentifkeyPlse || planSemanalKeyDefault,

    prvIdentifkeyInve: initialValues?.prvIdentifkeyInve || "",
    prvTipoequipoTieq: initialValues?.prvTipoequipoTieq || "",

    orsNombrequipoDeop: initialValues?.orsNombrequipoDeop || "",
    orsRefermodeloDeop: initialValues?.orsRefermodeloDeop || "",
    orsNroregistroDeop: initialValues?.orsNroregistroDeop || "",

    orsUnidadDeop: initialValues?.orsUnidadDeop || "HORA",
    orsTipocontrolDeop: initialValues?.orsTipocontrolDeop || "HOROMETRO",
    orsFechatrabajoDeop: initialValues?.orsFechatrabajoDeop || todayString(),

    orsHorometroiniDeop: initialValues?.orsHorometroiniDeop || 0,
    orsHorometrofinDeop: initialValues?.orsHorometrofinDeop || 0,
    orsKminicialDeop: initialValues?.orsKminicialDeop || 0,
    orsKmfinalDeop: initialValues?.orsKmfinalDeop || 0,
    orsDiatrabajadoDeop: initialValues?.orsDiatrabajadoDeop || 0,
    orsValorunidadDeop: initialValues?.orsValorunidadDeop || 0,

    orsObservacionDeop: initialValues?.orsObservacionDeop || "",

    orsFirmasuministroDeop: initialValues?.orsFirmasuministroDeop || "2",
    orsFirmaseguimientoDeop: initialValues?.orsFirmaseguimientoDeop || "2",

    orsTiporegistDeop: initialValues?.orsTiporegistDeop || "1",
    orsEstadoregDeop: initialValues?.orsEstadoregDeop || "1"
  });

  const preview = useMemo(() => {
    const cantidad = calculateCantidad(form);
    const valor = cantidad * Number(form.orsValorunidadDeop || 0);

    return {
      cantidad,
      valor
    };
  }, [form]);

  const loadCatalogos = async () => {
    const [equiposResponse, tiposResponse, unidadesResponse] =
      await Promise.all([
        equiposMaquinariaService.equipos.getByDisponible("1"),
        equiposMaquinariaService.tipos.getByEstado("1"),
        equiposMaquinariaService.unidades.getByEstado("1")
      ]);

    setEquiposCatalogo(equiposResponse.rspData || []);
    setTiposCatalogo(tiposResponse.rspData || []);
    setUnidadesCatalogo(unidadesResponse.rspData || []);
  };

  useEffect(() => {
    loadCatalogos().catch(console.error);
  }, []);

  const handleChange = (
    field: keyof DetalleEquipoOperacionDto,
    value: string | number
  ) => {
    setForm(previous => ({
      ...previous,
      [field]: value
    }));
  };

  const handleSwitchChange = (
    field: keyof DetalleEquipoOperacionDto,
    checked: boolean
  ) => {
    setForm(previous => ({
      ...previous,
      [field]: checked ? "1" : "2"
    }));
  };

  const handleUnidadChange = (unidadKey: string) => {
    setForm(previous => ({
      ...previous,
      orsUnidadDeop: unidadKey,
      orsTipocontrolDeop: getTipoControlByUnidad(unidadKey)
    }));
  };

  const handleEquipoChange = (equipoKey: string) => {
    const equipo = equiposCatalogo.find(
      item => item.prvIdentifkeyInve === equipoKey
    );

    const tipoEquipoKey = equipo?.prvTipoequipoTieq || "";

    const tipoEquipo = tiposCatalogo.find(
      item => item.prvTipoequipoTieq === tipoEquipoKey
    );

    const unidadKey = tipoEquipo?.prvIdentifkeyUnme || "HORA";

    setForm(previous => ({
      ...previous,
      prvIdentifkeyInve: equipoKey,
      prvTipoequipoTieq: tipoEquipoKey,
      orsUnidadDeop: unidadKey,
      orsTipocontrolDeop: getTipoControlByUnidad(unidadKey),
      orsNombrequipoDeop:
        equipo?.prvNombrequipoInve ||
        equipo?.prvDescripcionInve ||
        previous.orsNombrequipoDeop ||
        "",
      orsRefermodeloDeop:
        equipo?.prvRefermodeloInve || previous.orsRefermodeloDeop || "",
      orsNroregistroDeop:
        equipo?.prvIdentifkeyInve || previous.orsNroregistroDeop || ""
    }));
  };

  const handleTipoEquipoChange = (tipoEquipoKey: string) => {
    const tipoEquipo = tiposCatalogo.find(
      item => item.prvTipoequipoTieq === tipoEquipoKey
    );

    const unidadKey = tipoEquipo?.prvIdentifkeyUnme || form.orsUnidadDeop || "HORA";

    setForm(previous => ({
      ...previous,
      prvTipoequipoTieq: tipoEquipoKey,
      orsUnidadDeop: unidadKey,
      orsTipocontrolDeop: getTipoControlByUnidad(unidadKey)
    }));
  };

  const submitForm = () => {
    const payload: DetalleEquipoOperacionDto = {
      ...form,
      orsIdentifkeyDeop: form.orsIdentifkeyDeop?.trim().toUpperCase(),
      orsIdentifkeyRope: form.orsIdentifkeyRope?.trim().toUpperCase(),
      orsIdentifkeyOrde: form.orsIdentifkeyOrde?.trim().toUpperCase(),
      orsIdentifkeyPsem: form.orsIdentifkeyPsem?.trim().toUpperCase(),
      orsIdentifkeyPlse: form.orsIdentifkeyPlse?.trim().toUpperCase(),
      orsIdentifkeyPunt: form.orsIdentifkeyPunt?.trim().toUpperCase(),
      prvIdentifkeyInve: form.prvIdentifkeyInve?.trim().toUpperCase(),
      prvTipoequipoTieq: form.prvTipoequipoTieq?.trim().toUpperCase(),
      orsUnidadDeop: form.orsUnidadDeop?.trim().toUpperCase(),
      orsHorometroiniDeop: Number(form.orsHorometroiniDeop || 0),
      orsHorometrofinDeop: Number(form.orsHorometrofinDeop || 0),
      orsKminicialDeop: Number(form.orsKminicialDeop || 0),
      orsKmfinalDeop: Number(form.orsKmfinalDeop || 0),
      orsDiatrabajadoDeop: Number(form.orsDiatrabajadoDeop || 0),
      orsValorunidadDeop: Number(form.orsValorunidadDeop || 0),
      orsTiporegistDeop: form.orsTiporegistDeop || "1",
      orsEstadoregDeop: form.orsEstadoregDeop || "1"
    };

    onSubmit(payload);
  };

  return (
    <>
      <DialogContent dividers>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "repeat(2, 1fr)"
            },
            gap: 2
          }}
        >
          <TextField
            label="Código detalle"
            value={form.orsIdentifkeyDeop || ""}
            onChange={event =>
              handleChange("orsIdentifkeyDeop", event.target.value)
            }
            fullWidth
            required
          />

          <TextField
            label="Reporte operación"
            value={form.orsIdentifkeyRope || ""}
            onChange={event =>
              handleChange("orsIdentifkeyRope", event.target.value)
            }
            fullWidth
            required
          />

          <TextField
            label="Orden"
            value={form.orsIdentifkeyOrde || ""}
            onChange={event =>
              handleChange("orsIdentifkeyOrde", event.target.value)
            }
            fullWidth
            required
          />

          <TextField
            label="Punto"
            value={form.orsIdentifkeyPunt || ""}
            onChange={event =>
              handleChange("orsIdentifkeyPunt", event.target.value)
            }
            fullWidth
          />

          <TextField
            label="Proyección"
            value={form.orsIdentifkeyPsem || ""}
            onChange={event =>
              handleChange("orsIdentifkeyPsem", event.target.value)
            }
            fullWidth
          />

          <TextField
            label="Plan semanal"
            value={form.orsIdentifkeyPlse || ""}
            onChange={event =>
              handleChange("orsIdentifkeyPlse", event.target.value)
            }
            fullWidth
          />

          <TextField
            select
            label="Equipo inventario"
            value={form.prvIdentifkeyInve || ""}
            onChange={event => handleEquipoChange(event.target.value)}
            fullWidth
            required
          >
            {equiposCatalogo.map(equipo => (
              <MenuItem
                key={equipo.prvIdentifkeyInve}
                value={equipo.prvIdentifkeyInve}
              >
                {equipo.prvIdentifkeyInve} -{" "}
                {equipo.prvNombrequipoInve ||
                  equipo.prvDescripcionInve ||
                  "Sin nombre"}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Tipo equipo"
            value={form.prvTipoequipoTieq || ""}
            onChange={event => handleTipoEquipoChange(event.target.value)}
            fullWidth
            required
          >
            {tiposCatalogo.map(tipo => (
              <MenuItem
                key={tipo.prvTipoequipoTieq}
                value={tipo.prvTipoequipoTieq}
              >
                {tipo.prvTipoequipoTieq} - {tipo.prvDescripcionTieq}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Nombre equipo"
            value={form.orsNombrequipoDeop || ""}
            onChange={event =>
              handleChange("orsNombrequipoDeop", event.target.value)
            }
            fullWidth
            required
          />

          <TextField
            label="Referencia / modelo"
            value={form.orsRefermodeloDeop || ""}
            onChange={event =>
              handleChange("orsRefermodeloDeop", event.target.value)
            }
            fullWidth
          />

          <TextField
            label="Registro / placa"
            value={form.orsNroregistroDeop || ""}
            onChange={event =>
              handleChange("orsNroregistroDeop", event.target.value)
            }
            fullWidth
          />

          <TextField
            select
            label="Unidad"
            value={form.orsUnidadDeop || "HORA"}
            onChange={event => handleUnidadChange(event.target.value)}
            fullWidth
            required
          >
            {unidadesCatalogo.map(unidad => (
              <MenuItem
                key={unidad.prvTipunidamedUnme}
                value={unidad.prvTipunidamedUnme}
              >
                {unidad.prvTipunidamedUnme} - {unidad.prvDescmedidaUnme}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Tipo control"
            value={form.orsTipocontrolDeop || "HOROMETRO"}
            onChange={event =>
              handleChange("orsTipocontrolDeop", event.target.value)
            }
            fullWidth
          >
            <MenuItem value="HOROMETRO">Horómetro</MenuItem>
            <MenuItem value="KILOMETRAJE">Kilometraje</MenuItem>
            <MenuItem value="DIA">Día</MenuItem>
          </TextField>

          <TextField
            label="Fecha trabajo"
            type="date"
            value={form.orsFechatrabajoDeop || ""}
            onChange={event =>
              handleChange("orsFechatrabajoDeop", event.target.value)
            }
            fullWidth
            slotProps={{ inputLabel: { shrink: true } }}
          />

          {form.orsUnidadDeop === "HORA" && (
            <>
              <TextField
                label="Horómetro inicial"
                type="number"
                value={form.orsHorometroiniDeop || 0}
                onChange={event =>
                  handleChange(
                    "orsHorometroiniDeop",
                    Number(event.target.value)
                  )
                }
                fullWidth
              />

              <TextField
                label="Horómetro final"
                type="number"
                value={form.orsHorometrofinDeop || 0}
                onChange={event =>
                  handleChange(
                    "orsHorometrofinDeop",
                    Number(event.target.value)
                  )
                }
                fullWidth
              />
            </>
          )}

          {form.orsUnidadDeop === "KM" && (
            <>
              <TextField
                label="KM inicial"
                type="number"
                value={form.orsKminicialDeop || 0}
                onChange={event =>
                  handleChange("orsKminicialDeop", Number(event.target.value))
                }
                fullWidth
              />

              <TextField
                label="KM final"
                type="number"
                value={form.orsKmfinalDeop || 0}
                onChange={event =>
                  handleChange("orsKmfinalDeop", Number(event.target.value))
                }
                fullWidth
              />
            </>
          )}

          {form.orsUnidadDeop === "DIA" && (
            <TextField
              label="Días trabajados"
              type="number"
              value={form.orsDiatrabajadoDeop || 0}
              onChange={event =>
                handleChange("orsDiatrabajadoDeop", Number(event.target.value))
              }
              fullWidth
            />
          )}

          <TextField
            label="Valor unitario"
            type="number"
            value={form.orsValorunidadDeop || 0}
            onChange={event =>
              handleChange("orsValorunidadDeop", Number(event.target.value))
            }
            fullWidth
            required
          />

          <Card
            variant="outlined"
            sx={{ gridColumn: { xs: "auto", md: "1 / 3" } }}
          >
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                Vista previa cálculo
              </Typography>

              <Typography variant="h6" sx={{ fontWeight: 800 }}>
                Cantidad: {preview.cantidad.toFixed(2)}
              </Typography>

              <Typography variant="h6" sx={{ fontWeight: 800 }}>
                Valor ejecutado: {formatCurrency(preview.valor)}
              </Typography>
            </CardContent>
          </Card>

          <TextField
            label="Observación"
            value={form.orsObservacionDeop || ""}
            onChange={event =>
              handleChange("orsObservacionDeop", event.target.value)
            }
            multiline
            minRows={3}
            fullWidth
            sx={{ gridColumn: { xs: "auto", md: "1 / 3" } }}
          />

          <FormControlLabel
            control={
              <Switch
                checked={form.orsFirmasuministroDeop === "1"}
                onChange={event =>
                  handleSwitchChange(
                    "orsFirmasuministroDeop",
                    event.target.checked
                  )
                }
              />
            }
            label="Firma suministro"
          />

          <FormControlLabel
            control={
              <Switch
                checked={form.orsFirmaseguimientoDeop === "1"}
                onChange={event =>
                  handleSwitchChange(
                    "orsFirmaseguimientoDeop",
                    event.target.checked
                  )
                }
              />
            }
            label="Firma seguimiento"
          />
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onCancel} disabled={loading}>
          Cancelar
        </Button>

        <Button
          type="button"
          variant="contained"
          disabled={loading}
          onClick={submitForm}
        >
          {loading ? "Guardando..." : "Guardar"}
        </Button>
      </DialogActions>
    </>
  );
}