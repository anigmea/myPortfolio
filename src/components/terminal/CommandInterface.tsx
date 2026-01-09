"use client";

import { useState, useEffect, useRef, useMemo } from 'react';
import { getSuggestions, findBestMatch } from '@/lib/utils/commandSuggestions';
import { CommandSuggestion } from '@/types';

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
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  const suggestions = useMemo(() => getSuggestions(input), [input]);
  const bestMatch = useMemo(() => findBestMatch(input), [input]);

  useEffect(() => {
    if (!disabled && !isThinking) {
      inputRef.current?.focus();
    }
  }, [disabled, isThinking]);

  useEffect(() => {
    setShowSuggestions(input.length > 0 && suggestions.length > 0 && !isThinking);
    setSelectedSuggestionIndex(-1);
  }, [input, suggestions.length, isThinking]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (showSuggestions && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
      e.preventDefault();
      if (e.key === 'ArrowDown') {
        setSelectedSuggestionIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
      } else {
        setSelectedSuggestionIndex(prev => prev > 0 ? prev - 1 : suggestions.length - 1);
      }
      return;
    }

    if (e.key === 'Tab' && bestMatch && input.trim()) {
      e.preventDefault();
      setInput(bestMatch.command);
      setShowSuggestions(false);
      return;
    }

    if (e.key === 'Enter' && selectedSuggestionIndex >= 0 && showSuggestions) {
      e.preventDefault();
      const selected = suggestions[selectedSuggestionIndex];
      setInput(selected.command);
      setShowSuggestions(false);
      onCommand(selected.command);
      setInput('');
      onHistoryChange(-1);
      return;
    }

    if (e.key === 'Escape') {
      setShowSuggestions(false);
      setSelectedSuggestionIndex(-1);
      return;
    }

    if (e.key === 'ArrowUp' && !showSuggestions) {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex < commandHistory.length - 1 ? historyIndex + 1 : historyIndex;
        onHistoryChange(newIndex);
        if (newIndex >= 0) {
          setInput(commandHistory[commandHistory.length - 1 - newIndex]);
        }
      }
    } else if (e.key === 'ArrowDown' && !showSuggestions) {
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

  const handleSuggestionClick = (suggestion: CommandSuggestion) => {
    setInput(suggestion.command);
    setShowSuggestions(false);
    onCommand(suggestion.command);
    setInput('');
    onHistoryChange(-1);
  };

  return (
    <div className="relative w-full">
      <form onSubmit={handleSubmit} className="flex items-center gap-3 w-full">
        <div className="flex-grow relative">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setShowSuggestions(input.length > 0 && suggestions.length > 0)}
            // onBlur={() => {
            //   // Delay to allow click on suggestions
            //   setTimeout(() => setShowSuggestions(false), 200);
            // }}
            className={`w-full px-4 py-3 text-lg rounded-xl bg-transparent border-none focus:outline-none ${
              lightMode 
                ? 'text-blue-900 placeholder-blue-400' 
                : 'text-green-300 placeholder-green-500/60'
            }`}
            placeholder={isThinking ? "🤔 Thinking..." : (disabled ? "Processing..." : "Ask me anything... (Type Help to learn more)")}
            disabled={disabled || isThinking}
            autoFocus
            aria-label="Command input"
            aria-autocomplete="list"
            aria-expanded={showSuggestions}
            aria-controls="command-suggestions"
          />
          {showSuggestions && suggestions.length > 0 && (
            <div
              ref={suggestionsRef}
              id="command-suggestions"
              className={`absolute z-50 w-full mt-1 rounded-lg shadow-lg border backdrop-blur-sm max-h-64 overflow-y-auto ${
                lightMode
                  ? 'bg-white border-blue-300'
                  : 'bg-black/95 border-green-500/50'
              }`}
              role="listbox"
            >
              {suggestions.map((suggestion, index) => (
                <button
                  key={suggestion.command}
                  type="button"
                  onClick={() => handleSuggestionClick(suggestion)}
                  className={`w-full text-left px-4 py-2 hover:bg-opacity-80 transition-colors ${
                    index === selectedSuggestionIndex
                      ? lightMode
                        ? 'bg-blue-100'
                        : 'bg-green-900/50'
                      : ''
                  } ${
                    lightMode
                      ? 'text-blue-900 hover:bg-blue-50'
                      : 'text-green-300 hover:bg-green-900/30'
                  }`}
                  role="option"
                  aria-selected={index === selectedSuggestionIndex}
                >
                  <div className="font-semibold">{suggestion.command}</div>
                  <div className={`text-sm ${lightMode ? 'text-blue-600' : 'text-green-400'}`}>
                    {suggestion.description}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
        <button
          type="submit"
          disabled={disabled || isThinking || !input.trim()}
          className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
            lightMode
              ? 'bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-300'
              : 'bg-green-600 text-black hover:bg-green-500 disabled:bg-green-900 disabled:text-green-700'
          } disabled:cursor-not-allowed`}
          aria-label="Submit command"
        >
          {isThinking ? '...' : '→'}
        </button>
      </form>
      {bestMatch && input.trim() && !showSuggestions && (
        <div className={`absolute top-full mt-1 text-xs ${lightMode ? 'text-blue-600' : 'text-green-400'}`}>
          Press <kbd className="px-1 py-0.5 rounded bg-opacity-20">Tab</kbd> to autocomplete: {bestMatch.command}
        </div>
      )}
    </div>
  );
}
