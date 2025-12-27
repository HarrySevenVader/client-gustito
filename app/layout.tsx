import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/contexts/CartContext";

export const metadata: Metadata = {
  title: "Gustito - Sabores que te dan un Gustito",
  description: "Comida casera chilena con un toque único, hecha con amor. Descubre nuestros completos, empanadas, chorrillanas y más.",
  keywords: ["comida chilena", "restaurant", "completos", "empanadas", "delivery", "Santiago"],
  authors: [{ name: "Gustito" }],
  icons: {
    icon: '/favicon.jpg',
    apple: '/favicon.jpg',
  },
  openGraph: {
    title: "Gustito - Sabores que te dan un Gustito",
    description: "Comida casera chilena con un toque único, hecha con amor.",
    type: "website",
    locale: "es_CL",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es-CL">
      <head>
        <link rel="icon" href="/favicon.jpg" type="image/jpeg" />
        <link rel="apple-touch-icon" href="/favicon.jpg" />
      </head>
      <body className="antialiased">
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
