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
import { getSiteSettings } from "@/lib/server/site";

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

const DEFAULT_LOGO = "/apan-logo-ink.png";

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSiteSettings();
  return {
    title: {
      default: site.siteName,
      template: `%s | ${site.siteName}`,
    },
    description:
      site.description ??
      "Premium Polos, T-Shirts, Activewear, and Kids Wear for the modern Bangladeshi.",
    icons: {
      icon: site.logoUrl ? [{ url: site.logoUrl }] : [
        { url: "/apan-logo-ink.png", media: "(prefers-color-scheme: light)" },
        { url: "/apan-logo-white.png", media: "(prefers-color-scheme: dark)" },
      ],
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const site = await getSiteSettings();
  const logoUrl = site.logoUrl ?? DEFAULT_LOGO;

  return (
    <html
      lang="en"
      className={`${inter.variable} ${plex.variable} ${fraunces.variable}`}
    >
      <head>
        <style>{`
          @keyframes apan-in {
            0% { opacity: 0; transform: scale(0.9) translateY(8px); }
            60% { opacity: 1; transform: scale(1.02) translateY(0); }
            100% { opacity: 1; transform: scale(1); }
          }
          @keyframes apan-pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.035); }
          }
          @keyframes apan-sweep {
            0% { transform: translateX(-120%); }
            100% { transform: translateX(320%); }
          }
          @media (prefers-reduced-motion: reduce) {
            #apan-loader * { animation: none !important; }
          }
        `}</style>
      </head>
      <body
        className="bg-white text-black font-body antialiased"
        suppressHydrationWarning
      >
        <div
          id="apan-loader"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#ffffff",
            transition: "opacity 0.4s ease, visibility 0.4s ease",
          }}
        >
          <div style={{ textAlign: "center", animation: "apan-in 0.6s ease-out both" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={logoUrl}
              alt={site.siteName}
              fetchPriority="high"
              style={{
                width: 150,
                height: "auto",
                animation: "apan-pulse 2s ease-in-out infinite 0.7s",
              }}
            />
            <div
              style={{
                margin: "20px auto 0",
                width: 120,
                height: 2,
                borderRadius: 9999,
                background: "#f0f0f0",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: "40%",
                  height: "100%",
                  borderRadius: 9999,
                  background: "#0a0a0a",
                  animation: "apan-sweep 1.1s ease-in-out infinite",
                }}
              />
            </div>
          </div>
        </div>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){
              var el = document.getElementById('apan-loader');
              var done = false;
              function hide() {
                if (done || !el) return;
                done = true;
                el.style.opacity = '0';
                el.style.visibility = 'hidden';
                el.style.pointerEvents = 'none';
              }
              window.addEventListener('load', function(){ setTimeout(hide, 250); });
              setTimeout(hide, 4000);
            })();`,
          }}
        />
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