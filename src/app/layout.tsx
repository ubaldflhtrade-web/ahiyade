import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ahiyade",
  description: "Marketplace B2B pour le marche local beninois."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
