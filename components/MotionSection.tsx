'use client';
import { motion } from 'motion/react';

export const MotionSection = ({ children, className }: { children: React.ReactNode, className?: string }) => {
 return (
 <motion.section
 initial={{ opacity: 0, y: 20 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true, margin: "-100px" }}
 transition={{ duration: 0.5, ease: "easeOut" }}
 className={className}
 >
 {children}
 </motion.section>
 );
};
