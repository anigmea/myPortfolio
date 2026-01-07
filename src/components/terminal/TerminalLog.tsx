"use client";

import { useEffect, useRef, memo } from 'react';
import { Typewriter } from './Typewriter';
import { LogEntry } from '@/types';

interface TerminalLogProps {
  log: LogEntry[];
  onTypingComplete: () => void;
  lightMode: boolean;
  isTyping: boolean;
  streamingResponse?: string; // +++ ADD THIS NEW PROP +++
}

export const TerminalLog = memo(function TerminalLog({ 
  log, 
  onTypingComplete, 
  lightMode, 
  isTyping,
  streamingResponse // +++ GET THE PROP +++
}: TerminalLogProps) {
  const logRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [log, streamingResponse]); // +++ ADD streamingResponse as dependency

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
          
          // --- MODIFIED LOGIC ---
          // Typewriter is *only* for the very first welcome message
          if (index === 0 && isTyping && isSystemEntry) {
            return (
              <Typewriter
                key="entry-welcome" // Use a static key
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
          
          // Render all other *completed* log entries normally
          return (
            <div
              key={`entry-${index}`}
              className={`font-mono mb-3 p-3 rounded-lg ${
                entry.type === 'user' 
                  ? lightMode ? 'bg-blue-50 border-l-4 border-blue-400' : 'bg-green-900/20 border-l-4 border-green-500'
                  : lightMode ? 'bg-gray-50' : 'bg-black/40'
              }`}
              style={{ 
                whiteSpace: "pre-line", 
                display: "block", 
                lineHeight: "1.6", 
                fontSize: "0.9rem",
                color: lightMode ? '#2563eb' : '#6ee7b7'
              }}
            >
              {entry.type === 'user' && <span className={`font-bold ${lightMode ? 'text-blue-600' : 'text-green-400'}`}>You: </span>}
              {entry.type === 'ai' && <span className={`font-bold ${lightMode ? 'text-purple-600' : 'text-cyan-400'}`}>DK-01: </span>}
              {entry.text || ''}
            </div>
          );
        }) : (
          <div className="text-gray-500">No commands yet...</div>
        )}

        {/* +++ ADD THIS BLOCK TO RENDER THE LIVE STREAM +++ */}
        {streamingResponse && (
          <div
            className={`font-mono mb-3 p-3 rounded-lg ${lightMode ? 'bg-gray-50' : 'bg-black/40'}`}
            style={{ 
              whiteSpace: "pre-line", 
              display: "block", 
              lineHeight: "1.6", 
              fontSize: "0.9rem",
              color: lightMode ? '#2563eb' : '#6ee7b7'
            }}
          >
            <span className={`font-bold ${lightMode ? 'text-purple-600' : 'text-cyan-400'}`}>DK-01: </span>
            {streamingResponse}
            <span className="blinking-cursor">_</span>
          </div>
        )}
      </div>
    </div>
  );
});