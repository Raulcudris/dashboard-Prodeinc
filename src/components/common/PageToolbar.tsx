"use client";

import { Box } from "@mui/material";

interface PageToolbarProps {
  left?: React.ReactNode;
  right?: React.ReactNode;
}

export function PageToolbar({ left, right }: PageToolbarProps) {
  return (
    <Box
      sx={{
        mb: 2,
        p: 1.5,
        borderRadius: 4,
        bgcolor: "#ffffff",
        border: "1px solid",
        borderColor: "divider",
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        alignItems: { xs: "stretch", sm: "center" },
        justifyContent: "space-between",
        gap: 1.5
      }}
    >
      <Box
        sx={{
          minWidth: { xs: "100%", sm: 260 },
          maxWidth: { xs: "100%", sm: 320 },
          "& .MuiTextField-root": {
            width: "100%"
          },
          "& .MuiInputBase-root": {
            borderRadius: 3,
            height: 44
          }
        }}
      >
        {left}
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: { xs: "flex-start", sm: "flex-end" },
          "& .MuiButton-root": {
            borderRadius: 3,
            textTransform: "none",
            fontWeight: 800,
            height: 42
          }
        }}
      >
        {right}
      </Box>
    </Box>
  );
}