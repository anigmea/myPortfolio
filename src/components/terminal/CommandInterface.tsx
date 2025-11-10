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
    <form onSubmit={handleSubmit} className="flex items-center gap-3 w-full">
      <input
        ref={inputRef}
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        className={`flex-grow px-4 py-3 text-lg rounded-xl bg-transparent border-none focus:outline-none ${
          lightMode 
            ? 'text-blue-900 placeholder-blue-400' 
            : 'text-green-300 placeholder-green-500/60'
        }`}
        placeholder={isThinking ? "🤔 Thinking..." : (disabled ? "Processing..." : "Ask me anything...")}
        disabled={disabled || isThinking}
        autoFocus
      />
      <button
        type="submit"
        disabled={disabled || isThinking || !input.trim()}
        className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
          lightMode
            ? 'bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-300'
            : 'bg-green-600 text-black hover:bg-green-500 disabled:bg-green-900 disabled:text-green-700'
        } disabled:cursor-not-allowed`}
      >
        {isThinking ? '...' : '→'}
      </button>
    </form>
  );
}
