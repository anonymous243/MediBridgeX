"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface BarChartProps {
    values: number[];
}

export function BarChart({
    values,
}: BarChartProps) {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    return (
        <div className="flex h-[240px] items-end gap-3 pt-8">
            {values.map((height, index) => (
                <div 
                    key={index}
                    className="relative flex-1 flex flex-col justify-end h-full"
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                >
                    <AnimatePresence>
                        {hoveredIndex === index && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 5 }}
                                className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 whitespace-nowrap rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-bold text-white shadow-xl"
                                style={{ zIndex: 10 }}
                            >
                                {height} / sec
                                <div className="absolute left-1/2 top-full -mt-0.5 h-2 w-2 -translate-x-1/2 rotate-45 bg-slate-900" />
                            </motion.div>
                        )}
                    </AnimatePresence>
                    
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: `${height}%`, opacity: hoveredIndex === null || hoveredIndex === index ? 1 : 0.6 }}
                        transition={{ 
                            height: { type: 'spring', stiffness: 50, damping: 15, delay: index * 0.05 },
                            opacity: { duration: 0.2 }
                        }}
                        className="w-full rounded-t-xl bg-gradient-to-t from-blue-600 via-purple-500 to-pink-500 shadow-sm transition-shadow hover:shadow-lg hover:shadow-pink-500/20"
                    />
                </div>
            ))}
        </div>
    );
}