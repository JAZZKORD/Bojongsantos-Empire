import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AksesPangan — Dari Surplus ke Solusi",
  description: "Platform penghubung surplus makanan dari pelaku usaha dengan masyarakat secara real-time. Menyelamatkan makanan, mengurangi kelaparan, menekan emisi.",
  keywords: "food waste, surplus makanan, food rescue, akses pangan, keberlanjutan",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="h-full antialiased">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#f04923" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
      </head>
      <body className="min-h-full flex flex-col" style={{ fontFamily: "'Inter', sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
