"use client";

import { Box } from "@mui/material";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export function PageHeader({ title, subtitle, action }: PageHeaderProps) {
  return (
    <Box
      sx={{
        width: "100%",
        mb: 2.5,
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        alignItems: { xs: "flex-start", md: "center" },
        justifyContent: "space-between",
        gap: 2
      }}
    >
      <Box sx={{ minWidth: 0 }}>
        <Box
          component="h1"
          sx={{
            m: 0,
            fontSize: {
              xs: "1.5rem",
              sm: "1.65rem",
              md: "1.85rem"
            },
            fontWeight: 850,
            color: "#0b2341",
            lineHeight: 1.15,
            letterSpacing: "-0.02em"
          }}
        >
          {title}
        </Box>

        {subtitle && (
          <Box
            component="p"
            sx={{
              m: 0,
              mt: 0.6,
              fontSize: {
                xs: "0.88rem",
                md: "0.94rem"
              },
              color: "#5f6b7a",
              lineHeight: 1.45,
              maxWidth: "900px"
            }}
          >
            {subtitle}
          </Box>
        )}
      </Box>

      {action && <Box sx={{ flexShrink: 0 }}>{action}</Box>}
    </Box>
  );
}