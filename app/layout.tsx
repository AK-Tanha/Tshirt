import type {Metadata} from 'next';
import { Inter, IBM_Plex_Mono } from 'next/font/google';
import './globals.css'; 
import { CartProvider } from '@/context/CartContext';
import { AppShell } from '@/components/AppShell';

const inter = Inter({ subsets: ['latin'], variable: '--font-body' });
const plex = IBM_Plex_Mono({ subsets: ['latin'], weight: '400', variable: '--font-mono' });

export const metadata: Metadata = {
  title: 'Apan Apparel',
  description: 'Premium Polos and T-Shirts for the modern Bangladeshi.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`${inter.variable} ${plex.variable}`}>
      <body className="bg-white text-black font-body antialiased" suppressHydrationWarning>
        <CartProvider>
          <AppShell>
            {children}
          </AppShell>
          <script dangerouslySetInnerHTML={{ __html: `/* Facebook Pixel Code */` }} />
        </CartProvider>
      </body>
    </html>
  );
}
