import React from 'react';

interface MarqueeProps {
 text: string;
}

export const Marquee: React.FC<MarqueeProps> = ({ text }) => {
 return (
 <div className="overflow-hidden whitespace-nowrap py-5 border-y border-border bg-stone">
 <div className="inline-block animate-marquee">
 {[...Array(10)].map((_, i) => (
 <span key={i} className="font-display text-3xl md:text-5xl mx-8 text-black/20 font-bold tracking-tight">
 {text}
 </span>
 ))}
 </div>
 </div>
 );
};
