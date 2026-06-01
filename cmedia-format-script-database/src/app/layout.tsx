import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CMedia Format & Script Database",
  description: "Centrale database voor formats, scripts, draaiboeken en pitchdecks."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl" className="dark">
      <body className="min-h-screen font-sans antialiased">{children}</body>
    </html>
  );
}
