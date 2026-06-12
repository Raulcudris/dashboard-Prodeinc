import type { Metadata } from "next";
import ThemeRegistry from "../theme/ThemeRegistry";

export const metadata: Metadata = {
  title: "Prodeinc",
  description: "Dashboard de control de obras civiles"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <ThemeRegistry>{children}</ThemeRegistry>
      </body>
    </html>
  );
}