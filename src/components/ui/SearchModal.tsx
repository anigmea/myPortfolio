"use client";

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { searchAll, SearchResult } from '@/lib/utils/search';
import { Project, Experience, Education } from '@/types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
  experience: Experience[];
  education: Education | null;
  lightMode: boolean;
  onSelectResult: (result: SearchResult) => void;
}

export function SearchModal({
  isOpen,
  onClose,
  projects,
  experience,
  education,
  lightMode,
  onSelectResult,
}: SearchModalProps) {
  const [query, setQuery] = useState('');
  const results = useMemo(
    () => searchAll(query, projects, experience, education),
    [query, projects, experience, education]
  );

  const handleSelect = (result: SearchResult) => {
    onSelectResult(result);
    onClose();
    setQuery('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-2xl max-h-[80vh] rounded-xl shadow-2xl ${
              lightMode
                ? 'bg-white border-2 border-blue-300'
                : 'bg-black/95 border-2 border-green-500/50'
            }`}
          >
            <div className="p-4 border-b border-opacity-20 flex items-center justify-between">
              <h2 className={`text-xl font-bold ${lightMode ? 'text-blue-900' : 'text-green-300'}`}>
                Search
              </h2>
              <button
                onClick={onClose}
                className={`text-2xl leading-none ${lightMode ? 'text-blue-600' : 'text-green-400'} hover:opacity-70`}
                aria-label="Close search"
              >
                ×
              </button>
            </div>
            <div className="p-4">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search projects, experience, education..."
                autoFocus
                className={`w-full px-4 py-2 rounded-lg border ${
                  lightMode
                    ? 'bg-white border-blue-300 text-blue-900'
                    : 'bg-black/50 border-green-500/50 text-green-300'
                } focus:outline-none focus:ring-2 ${
                  lightMode ? 'focus:ring-blue-500' : 'focus:ring-green-500'
                }`}
              />
              <div className="mt-4 max-h-96 overflow-y-auto">
                {query.trim() ? (
                  results.length > 0 ? (
                    <div className="space-y-2">
                      {results.map((result, index) => (
                        <button
                          key={index}
                          onClick={() => handleSelect(result)}
                          className={`w-full text-left p-3 rounded-lg hover:bg-opacity-80 transition-colors ${
                            lightMode
                              ? 'bg-blue-50 hover:bg-blue-100 text-blue-900'
                              : 'bg-green-900/20 hover:bg-green-900/30 text-green-300'
                          }`}
                        >
                          <div className="font-semibold">{result.title}</div>
                          <div className={`text-sm mt-1 ${lightMode ? 'text-blue-600' : 'text-green-400'}`}>
                            {result.description}
                          </div>
                          <div className={`text-xs mt-1 ${lightMode ? 'text-blue-500' : 'text-green-500'}`}>
                            Type: {result.type}
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className={`text-center py-8 ${lightMode ? 'text-blue-600' : 'text-green-400'}`}>
                      No results found
                    </div>
                  )
                ) : (
                  <div className={`text-center py-8 ${lightMode ? 'text-blue-600' : 'text-green-400'}`}>
                    Start typing to search...
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}




