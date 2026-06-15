"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Box, Divider, Drawer } from "@mui/material";
import { dashboardSections } from "./dashboardNavigation";

interface DashboardSidebarProps {
  drawerWidth: number;
  collapsedWidth: number;
  collapsed: boolean;
  mobileOpen: boolean;
  onClose: () => void;
}

export function DashboardSidebar({
  drawerWidth,
  collapsedWidth,
  collapsed,
  mobileOpen,
  onClose
}: DashboardSidebarProps) {
  const pathname = usePathname();

  const renderContent = (isCollapsed: boolean) => (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        bgcolor: "#ffffff"
      }}
    >
      <Box
        sx={{
          px: isCollapsed ? 1.2 : 2,
          py: 2,
          minHeight: 72,
          display: "flex",
          alignItems: "center",
          justifyContent: isCollapsed ? "center" : "space-between",
          borderBottom: "1px solid",
          borderColor: "divider"
        }}
      >
        {isCollapsed ? (
          <Box
            sx={{
              width: 42,
              height: 42,
              borderRadius: "50%",
              bgcolor: "#0b5137",
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1rem",
              fontWeight: 900
            }}
          >
            P
          </Box>
        ) : (
          <Box>
            <Box
              component="h1"
              sx={{
                m: 0,
                fontSize: "1.2rem",
                fontWeight: 900,
                lineHeight: 1.1,
                color: "#0b2341"
              }}
            >
              PRODEINC
            </Box>

            <Box
              component="p"
              sx={{
                m: 0,
                mt: 0.25,
                fontSize: "0.78rem",
                color: "text.secondary"
              }}
            >
              Control de Obras
            </Box>
          </Box>
        )}
      </Box>

      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          px: isCollapsed ? 1 : 1.5,
          py: 1.5
        }}
      >
        {dashboardSections.map(section => (
          <Box key={section.title} sx={{ mb: isCollapsed ? 1.2 : 2.2 }}>
            {!isCollapsed && (
              <Box
                component="p"
                sx={{
                  m: 0,
                  mb: 0.8,
                  px: 1,
                  fontSize: "0.68rem",
                  fontWeight: 900,
                  letterSpacing: "0.09em",
                  color: "#9ca3af"
                }}
              >
                {section.title}
              </Box>
            )}

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 0.35
              }}
            >
              {section.items.map(item => {
                const active =
                  pathname === item.href || pathname.startsWith(`${item.href}/`);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    style={{ textDecoration: "none" }}
                    onClick={onClose}
                    title={isCollapsed ? item.label : undefined}
                  >
                    <Box
                      sx={{
                        minHeight: 44,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: isCollapsed ? "center" : "flex-start",
                        gap: 1.2,
                        px: isCollapsed ? 0 : 1.3,
                        py: 1,
                        borderRadius: 3,
                        color: active ? "#0b5137" : "#5f6673",
                        bgcolor: active
                          ? "rgba(11, 81, 55, 0.09)"
                          : "transparent",
                        fontWeight: active ? 800 : 600,
                        transition: "all 0.18s ease",
                        "&:hover": {
                          bgcolor: "rgba(11, 81, 55, 0.06)",
                          color: "#0b5137"
                        },
                        "& svg": {
                          fontSize: "1.25rem"
                        }
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          minWidth: 24
                        }}
                      >
                        {item.icon}
                      </Box>

                      {!isCollapsed && (
                        <Box
                          component="span"
                          sx={{
                            fontSize: "0.86rem",
                            lineHeight: 1.25
                          }}
                        >
                          {item.label}
                        </Box>
                      )}
                    </Box>
                  </Link>
                );
              })}
            </Box>
          </Box>
        ))}
      </Box>

      {!isCollapsed && (
        <>
          <Divider />

          <Box
            sx={{
              px: 2,
              py: 1.5,
              fontSize: "0.74rem",
              color: "text.secondary",
              lineHeight: 1.4
            }}
          >
            Plataforma de gestión de obra civil
          </Box>
        </>
      )}
    </Box>
  );

  return (
    <>
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            borderRight: "1px solid",
            borderColor: "divider"
          }
        }}
      >
        {renderContent(false)}
      </Drawer>

      <Drawer
        variant="permanent"
        open
        sx={{
          display: { xs: "none", md: "block" },
          width: collapsed ? collapsedWidth : drawerWidth,
          flexShrink: 0,
          transition: "width 0.22s ease",
          "& .MuiDrawer-paper": {
            width: collapsed ? collapsedWidth : drawerWidth,
            boxSizing: "border-box",
            borderRight: "1px solid",
            borderColor: "divider",
            overflowX: "hidden",
            transition: "width 0.22s ease"
          }
        }}
      >
        {renderContent(collapsed)}
      </Drawer>
    </>
  );
}