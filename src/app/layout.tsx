import type { Metadata } from "next";
import ThemeRegistry from "../theme/ThemeRegistry";
import "./globals.css";

export const metadata: Metadata = {
  title: "Prodeinc - Control de Obras",
  description: "Plataforma de control de obras civiles"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>
        <ThemeRegistry>{children}</ThemeRegistry>
      </body>
    </html>
  );
}