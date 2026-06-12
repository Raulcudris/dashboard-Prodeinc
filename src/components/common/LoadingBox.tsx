"use client";

import { Box, CircularProgress, Typography } from "@mui/material";

interface LoadingBoxProps {
  message?: string;
  minHeight?: number | string;
}

export function LoadingBox({
  message = "Cargando información...",
  minHeight = 240
}: LoadingBoxProps) {
  return (
    <Box
      sx={{
        minHeight,
        py: 4,
        px: 2,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 2,
        width: "100%"
      }}
    >
      <CircularProgress size={36} thickness={4} />

      <Typography
        component="div"
        variant="body2"
        color="text.secondary"
        sx={{ textAlign: "center" }}
      >
        {message}
      </Typography>
    </Box>
  );
}