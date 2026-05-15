import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Facas Artesanais — Controle de Estoque",
  description:
    "Dashboard administrativo para gestão de compras e reposição de facas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen font-sans">{children}</body>
    </html>
  );
}
