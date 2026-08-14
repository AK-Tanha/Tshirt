import type { Metadata } from "next";
import {
  Inter,
  IBM_Plex_Mono,
  Fraunces,
} from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { AppShell } from "@/components/AppShell";
import { QueryProvider } from "@/context/QueryProvider";
import { AuthProvider } from "@/components/AuthProvider";

const inter = Inter({ subsets: ["latin"], variable: "--font-body" });
const plex = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-mono",
});
const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "APAN Apparel",
  description: "Premium Polos, T-Shirts, Activewear, and Kids Wear for the modern Bangladeshi.",
  icons: {  
    icon: [
      { url: "/apan-logo-ink.png", media: "(prefers-color-scheme: light)" },
      { url: "/apan-logo-white.png", media: "(prefers-color-scheme: dark)" },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${plex.variable} ${fraunces.variable}`}
    >
      <body
        className="bg-white text-black font-body antialiased"
        suppressHydrationWarning
      >
        <QueryProvider>
          <AuthProvider>
            <CartProvider>
              <AppShell>{children}</AppShell>
              <script
                dangerouslySetInnerHTML={{ __html: `/* Facebook Pixel Code */` }}
              />
            </CartProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}