"use client";

import { Card, CardContent, Box, Typography } from "@mui/material";
import type { ReactNode } from "react";

type MetricCardColor =
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "error"
  | "info";

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: ReactNode;
  color?: MetricCardColor;
}

const colorMap: Record<MetricCardColor, string> = {
  primary: "rgba(11, 61, 46, 0.08)",
  secondary: "rgba(217, 164, 65, 0.14)",
  success: "rgba(46, 125, 50, 0.10)",
  warning: "rgba(237, 108, 2, 0.10)",
  error: "rgba(211, 47, 47, 0.10)",
  info: "rgba(2, 136, 209, 0.10)"
};

export function MetricCard({
  title,
  value,
  subtitle,
  icon,
  color = "primary"
}: MetricCardProps) {
  return (
    <Card>
      <CardContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 2
          }}
        >
          <Box sx={{ flex: 1 }}>
            <Typography
              component="div"
              variant="body2"
              color="text.secondary"
              sx={{ mb: 1 }}
            >
              {title}
            </Typography>

            <Typography
              component="div"
              variant="h4"
              sx={{ fontWeight: 800, mb: subtitle ? 0.5 : 0 }}
            >
              {value}
            </Typography>

            {subtitle ? (
              <Typography
                component="div"
                variant="caption"
                color="text.secondary"
              >
                {subtitle}
              </Typography>
            ) : null}
          </Box>

          {icon ? (
            <Box
              sx={theme => ({
                width: 48,
                height: 48,
                borderRadius: 3,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: colorMap[color],
                color: theme.palette[color].main
              })}
            >
              {icon}
            </Box>
          ) : null}
        </Box>
      </CardContent>
    </Card>
  );
}