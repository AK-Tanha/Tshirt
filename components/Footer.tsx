import React from 'react';
import Link from 'next/link';

export const Footer = () => {
  return (
    <footer className="bg-navy text-bone py-16 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-2">
            <Link href="/" className="font-display text-4xl tracking-tighter mb-6 block">APAN</Link>
            <p className="font-body text-xs text-bone/60 max-w-sm leading-relaxed uppercase tracking-widest">
              Crafting the future of apparel through high-quality materials and timeless design. Based in Bangladesh, serving the global archive.
            </p>
          </div>
          
          <div>
            <h4 className="font-mono text-[10px] uppercase tracking-[0.3em] text-forest mb-6">Archive</h4>
            <ul className="space-y-4 font-body text-[10px] uppercase tracking-widest">
              <li><Link href="/products" className="hover:text-forest transition-colors">All Products</Link></li>
              <li><Link href="/products?category=polo" className="hover:text-forest transition-colors">Polos</Link></li>
              <li><Link href="/products?category=tshirt" className="hover:text-forest transition-colors">Tees</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-mono text-[10px] uppercase tracking-[0.3em] text-forest mb-6">Connect</h4>
            <ul className="space-y-4 font-body text-[10px] uppercase tracking-widest">
              <li><a href="#" className="hover:text-forest transition-colors">Instagram</a></li>
              <li><a href="#" className="hover:text-forest transition-colors">Facebook</a></li>
              <li><a href="#" className="hover:text-forest transition-colors">Support</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-bone/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-mono text-[8px] text-bone/40 uppercase tracking-[0.2em]">
            © 2026 APAN APPAREL. ALL RIGHTS RESERVED.
          </p>
          <div className="flex gap-8 font-mono text-[8px] text-bone/40 uppercase tracking-[0.2em]">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
