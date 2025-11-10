"use client";

import { useState, useEffect, useRef } from 'react';

interface CommandInterfaceProps {
  onCommand: (command: string) => void;
  disabled: boolean;
  isThinking: boolean;
  lightMode: boolean;
  commandHistory: string[];
  historyIndex: number;
  onHistoryChange: (index: number) => void;
}

export function CommandInterface({ 
  onCommand, 
  disabled, 
  isThinking, 
  lightMode, 
  commandHistory, 
  historyIndex, 
  onHistoryChange 
}: CommandInterfaceProps) {
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!disabled && !isThinking) {
      inputRef.current?.focus();
    }
  }, [disabled, isThinking]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex < commandHistory.length - 1 ? historyIndex + 1 : historyIndex;
        onHistoryChange(newIndex);
        if (newIndex >= 0) {
          setInput(commandHistory[commandHistory.length - 1 - newIndex]);
        }
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        onHistoryChange(newIndex);
        setInput(commandHistory[commandHistory.length - 1 - newIndex]);
      } else if (historyIndex === 0) {
        onHistoryChange(-1);
        setInput('');
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !disabled && !isThinking) {
      onCommand(input.trim());
      setInput('');
      onHistoryChange(-1);
    }
  };

  return (
    <div className="w-full max-w-lg mt-4">
      <form onSubmit={handleSubmit} className="flex items-center">
        <span className={`text-2xl lg:text-3xl font-mono tracking-widest mr-2 ${lightMode ? 'text-blue-600' : 'text-green-300'}`}>
          {'>'}
        </span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className={`flex-grow bg-transparent border-none text-2xl lg:text-3xl font-mono tracking-widest focus:outline-none ${lightMode ? 'text-blue-600 placeholder-blue-400/50' : 'text-green-300 placeholder-green-500/50'}`}
          placeholder={isThinking ? "Thinking..." : (disabled ? "Processing..." : "Ask me anything...")}
          disabled={disabled || isThinking}
          autoFocus
        />
      </form>
    </div>
  );
}
