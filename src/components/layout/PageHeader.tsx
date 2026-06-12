"use client";

import { Box, Typography } from "@mui/material";
import type { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  breadcrumb?: ReactNode;
}

export function PageHeader({
  title,
  subtitle,
  action,
  breadcrumb
}: PageHeaderProps) {
  return (
    <Box
      sx={{
        mb: 3,
        display: "flex",
        flexDirection: {
          xs: "column",
          md: "row"
        },
        justifyContent: "space-between",
        alignItems: {
          xs: "flex-start",
          md: "center"
        },
        gap: 2
      }}
    >
      <Box>
        {breadcrumb ? (
          <Box sx={{ mb: 0.5 }}>
            {breadcrumb}
          </Box>
        ) : null}

        <Typography component="div" variant="h5" sx={{ mb: 0.5 }}>
          {title}
        </Typography>

        {subtitle ? (
          <Typography component="div" variant="body2" color="text.secondary">
            {subtitle}
          </Typography>
        ) : null}
      </Box>

      {action ? <Box>{action}</Box> : null}
    </Box>
  );
}