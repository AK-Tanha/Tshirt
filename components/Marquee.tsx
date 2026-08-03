import React from 'react';

interface MarqueeProps {
 text: string;
}

export const Marquee: React.FC<MarqueeProps> = ({ text }) => {
 return (
 <div className="overflow-hidden whitespace-nowrap py-6 md:py-8 border-y border-border bg-cream">
 <div className="inline-block animate-marquee will-change-transform">
 {[...Array(10)].map((_, i) => (
  <span key={i} className="font-display text-2xl md:text-4xl mx-8 text-ink/20 font-semibold tracking-tight">
  {text}
  </span>
 ))}
 </div>
 </div>
 );
};