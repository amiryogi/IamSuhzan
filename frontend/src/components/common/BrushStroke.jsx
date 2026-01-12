import React from 'react';
import { motion } from 'framer-motion';

/**
 * BrushStroke component creates a decorative SVG brush stroke.
 * It uses Framer Motion to animate the drawing effect.
 * 
 * @param {string} color - Stroke color (defaults to primary)
 * @param {string} className - Additional CSS classes
 * @param {number} delay - Animation delay
 */
const BrushStroke = ({ color = '#C9A962', className = '', delay = 0 }) => {
    return (
        <svg
            viewBox="0 0 300 20"
            preserveAspectRatio="none"
            className={`${className} pointer-events-none`}
            xmlns="http://www.w3.org/2000/svg"
        >
            <motion.path
                d="M5,12 C50,5 150,25 295,8"
                fill="transparent"
                stroke={color}
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 1 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{
                    duration: 1.2,
                    ease: "easeInOut",
                    delay: delay
                }}
            />
            {/* Secondary stroke for texture */}
            <motion.path
                d="M15,15 C80,10 200,20 285,12"
                fill="transparent"
                stroke={color}
                strokeWidth="2"
                strokeOpacity="0.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 1 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{
                    duration: 1.5,
                    ease: "easeInOut",
                    delay: delay + 0.2
                }}
            />
        </svg>
    );
};

export default BrushStroke;
