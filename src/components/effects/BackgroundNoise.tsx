"use client";

import { motion } from 'framer-motion';

export function BackgroundNoise() {
  const characters = '01AF#@$%^&*-+'.split('');
  const noiseCount = 12;

  return (
    <>
      {Array.from({ length: noiseCount }).map((_, i) => {
        const char = characters[Math.floor(Math.random() * characters.length)];
        const delay = Math.random() * 10;
        const duration = 10 + Math.random() * 10;
        
        return (
          <motion.div
            key={i}
            className="absolute text-green-500/70 text-xs select-none pointer-events-none"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}vh`,
              opacity: 0.1 + Math.random() * 0.15,
              fontSize: `${8 + Math.random() * 4}px`
            }}
            animate={{ 
              y: ["0vh", "150vh"], 
              opacity: [0.1, 0.25, 0.1] 
            }}
            transition={{ 
              duration: duration, 
              repeat: Infinity, 
              delay: delay, 
              ease: "linear" 
            }}
          >
            {char}
          </motion.div>
        );
      })}
    </>
  );
}
