'use client';

import { usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

const CartDrawer = dynamic(() => import('./CartDrawer').then((m) => m.CartDrawer), {
  ssr: false,
  loading: () => null,
});

export function AppShell({ children }: { children: React.ReactNode }) {
 const pathname = usePathname();
 const isAdmin = pathname.startsWith('/admin');
 const isAuth = pathname === '/login' || pathname === '/register';

 if (isAdmin || isAuth) return <>{children}</>;

 return (
 <>
 <Navbar />
 <CartDrawer />
 <div className="pt-14 md:pt-16">{children}</div>
 <Footer />
 </>
 );
}
