'use client';

import { usePathname } from 'next/navigation';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

export function AppShell({ children }: { children: React.ReactNode }) {
 const pathname = usePathname();
 const isAdmin = pathname.startsWith('/admin');
 const isAuth = pathname === '/login' || pathname === '/register';

 if (isAdmin || isAuth) return <>{children}</>;

 return (
 <>
 <Navbar />
 <div className="pt-14 md:pt-16">{children}</div>
 <Footer />
 </>
 );
}
