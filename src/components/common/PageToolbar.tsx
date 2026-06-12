"use client";

import { Box } from "@mui/material";
import type { ReactNode } from "react";

interface PageToolbarProps {
  left?: ReactNode;
  right?: ReactNode;
}

export function PageToolbar({ left, right }: PageToolbarProps) {
  return (
    <Box
      sx={{
        mb: 2,
        p: 2,
        backgroundColor: "#FFFFFF",
        border: "1px solid #EEF2F7",
        borderRadius: 4,
        display: "flex",
        flexDirection: {
          xs: "column",
          md: "row"
        },
        justifyContent: "space-between",
        alignItems: {
          xs: "stretch",
          md: "center"
        },
        gap: 2
      }}
    >
      <Box
        sx={{
          display: "flex",
          flex: 1,
          flexDirection: {
            xs: "column",
            md: "row"
          },
          gap: 1.5
        }}
      >
        {left}
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: {
            xs: "column",
            md: "row"
          },
          gap: 1.5
        }}
      >
        {right}
      </Box>
    </Box>
  );
}