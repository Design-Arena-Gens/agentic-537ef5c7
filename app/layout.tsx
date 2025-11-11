import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "Dedo Duro GitHub Monitor",
  description:
    "Radar de produtividade para equipes no GitHub com alertas de subutilização e sobrecarga."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
