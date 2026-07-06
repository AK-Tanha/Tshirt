import React from 'react';
import Link from 'next/link';

export const Footer = () => {
  return (
    <footer className="bg-black text-white py-16 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-2">
            <Link href="/" className="font-display text-2xl tracking-tight font-bold mb-4 block">APAN</Link>
            <p className="font-body text-sm text-white/50 max-w-sm leading-relaxed">
              Crafting the future of apparel through high-quality materials and timeless design. Based in Bangladesh.
            </p>
          </div>
          
          <div>
            <h4 className="font-mono text-[10px] uppercase tracking-widest text-white/40 mb-6">Shop</h4>
            <ul className="space-y-3 font-body text-sm">
              <li><Link href="/products" className="text-white/70 hover:text-white transition-colors">All Products</Link></li>
              <li><Link href="/products?category=polo" className="text-white/70 hover:text-white transition-colors">Polos</Link></li>
              <li><Link href="/products?category=tshirt" className="text-white/70 hover:text-white transition-colors">Tees</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-mono text-[10px] uppercase tracking-widest text-white/40 mb-6">Connect</h4>
            <ul className="space-y-3 font-body text-sm">
              <li><a href="#" className="text-white/70 hover:text-white transition-colors">Instagram</a></li>
              <li><a href="#" className="text-white/70 hover:text-white transition-colors">Facebook</a></li>
              <li><a href="#" className="text-white/70 hover:text-white transition-colors">Support</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-mono text-[9px] text-white/30 tracking-wider">
            © 2026 APAN APPAREL
          </p>
          <div className="flex gap-6 font-mono text-[9px] text-white/30 tracking-wider">
            <span>Privacy</span>
            <span>Terms</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
