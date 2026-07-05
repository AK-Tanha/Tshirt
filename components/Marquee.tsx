import React from 'react';

interface MarqueeProps {
  text: string;
  className?: string;
}

export const Marquee: React.FC<MarqueeProps> = ({ text, className = "" }) => {
  return (
    <div className={`overflow-hidden whitespace-nowrap py-4 border-y border-slate/20 ${className}`}>
      <div className="inline-block animate-marquee">
        {[...Array(10)].map((_, i) => (
          <span key={i} className="font-display text-4xl md:text-6xl mx-8 text-navy/40 uppercase tracking-widest">
            {text}
          </span>
        ))}
      </div>
    </div>
  );
};
