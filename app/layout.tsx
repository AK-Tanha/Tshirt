import type {Metadata} from 'next';
import { Inter, Bebas_Neue, IBM_Plex_Mono } from 'next/font/google';
import './globals.css'; 
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { CartProvider } from '@/context/CartContext';

const inter = Inter({ subsets: ['latin'], variable: '--font-body' });
const bebas = Bebas_Neue({ subsets: ['latin'], weight: '400', variable: '--font-display' });
const plex = IBM_Plex_Mono({ subsets: ['latin'], weight: '400', variable: '--font-mono' });

export const metadata: Metadata = {
  title: 'Apan Apparel',
  description: 'Premium Polos and T-Shirts for the modern Bangladeshi.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`${inter.variable} ${bebas.variable} ${plex.variable}`}>
      <body className="bg-bone text-navy font-body antialiased" suppressHydrationWarning>
        <CartProvider>
          <Navbar />
          {/* Facebook Pixel Placeholder */}
          <script dangerouslySetInnerHTML={{ __html: `/* Facebook Pixel Code */` }} />
          <div className="pt-16">
            {children}
          </div>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
