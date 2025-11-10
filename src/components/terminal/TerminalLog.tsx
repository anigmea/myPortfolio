"use client";

import { useEffect, useRef, memo } from 'react';
import { Typewriter } from './Typewriter';
import { LogEntry } from '@/types';

interface TerminalLogProps {
  log: LogEntry[];
  onTypingComplete: () => void;
  lightMode: boolean;
  isTyping: boolean;
}

export const TerminalLog = memo(function TerminalLog({ 
  log, 
  onTypingComplete, 
  lightMode, 
  isTyping 
}: TerminalLogProps) {
  const logRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [log]);

  return (
    <div className="flex flex-col items-start justify-start w-full text-left select-none">
      <div 
        ref={logRef}
        className={`w-full overflow-y-auto scrollbar-thin ${lightMode ? 'scrollbar-thumb-blue-500/30' : 'scrollbar-thumb-green-500/30'} scrollbar-track-transparent`}
        style={{ 
          fontFamily: 'monospace',
          fontSize: '0.9rem',
          lineHeight: '1.6',
          color: lightMode ? '#2563eb' : '#6ee7b7'
        }}
      >
        {log && log.length > 0 ? log.map((entry, index) => {
          const isLastEntry = index === log.length - 1;
          const isSystemEntry = entry.type === 'system' || entry.type === 'ai';
          
          if (isLastEntry && isTyping && isSystemEntry) {
            return (
              <Typewriter
                key={`entry-${index}`}
                text={entry.text || ''}
                speed={10}
                wrapper="div"
                onComplete={onTypingComplete}
                className={`text-2xl lg:text-3xl font-mono tracking-widest ${lightMode ? '' : 'drop-shadow-[0_0_10px_#00ffaa]'}`}
                style={{ 
                  whiteSpace: "pre-line", 
                  display: "block", 
                  lineHeight: "1.5", 
                  fontSize: "1rem",
                  color: lightMode ? '#2563eb' : '#6ee7b7'
                }}
              />
            );
          }
          
          return (
            <div
              key={`entry-${index}`}
              className={`font-mono tracking-widest mb-2 ${lightMode ? '' : 'drop-shadow-[0_0_10px_#00ffaa]'}`}
              style={{ 
                whiteSpace: "pre-line", 
                display: "block", 
                lineHeight: "1.5", 
                fontSize: "1rem",
                color: lightMode ? '#2563eb' : '#6ee7b7'
              }}
            >
              {entry.type === 'user' && <span className="text-green-400">$ </span>}
              {entry.text || ''}
            </div>
          );
        }) : (
          <div className="text-gray-500">No commands yet...</div>
        )}
      </div>
    </div>
  );
});
