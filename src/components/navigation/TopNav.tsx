'use client';

import { useEffect, useState } from 'react';
import { Search, Download } from 'lucide-react';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';

const NAV_ITEMS: { label: string; command: string }[] = [
  { label: 'Projects', command: 'projects' },
  { label: 'Experience', command: 'experience' },
  { label: 'Education', command: 'education' },
  { label: 'Skills', command: 'intelligence' },
  { label: 'Contact', command: 'contact' },
];

interface TopNavProps {
  activeSection: string | null;
  lightMode: boolean;
  onSearch: () => void;
  onThemeToggle: () => void;
}

export function TopNav({ activeSection, lightMode, onSearch, onThemeToggle }: TopNavProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fireCommand = (command: string) => {
    window.dispatchEvent(new CustomEvent('dk-command', { detail: { command } }));
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 h-10 flex items-center justify-between px-6 font-mono text-xs transition-all duration-200 ${
        scrolled
          ? 'bg-black/70 backdrop-blur-md border-b border-cyan-500/20'
          : 'bg-transparent'
      }`}
    >
      <span className={`font-bold tracking-widest ${lightMode ? 'text-blue-600' : 'text-cyan-400'}`}>
        DK-01
      </span>

      <nav className="hidden md:flex items-center gap-5">
        {NAV_ITEMS.map(({ label, command }) => (
          <button
            key={command}
            onClick={() => fireCommand(command)}
            className={`transition-colors ${
              activeSection === command
                ? lightMode ? 'text-blue-600' : 'text-cyan-300'
                : lightMode ? 'text-gray-500 hover:text-blue-600' : 'text-cyan-700 hover:text-cyan-400'
            }`}
          >
            {label}
          </button>
        ))}
      </nav>

      <div className="flex items-center gap-2">
        <LanguageSwitcher lightMode={lightMode} />
        <button
          onClick={onSearch}
          aria-label="Search (Ctrl+K)"
          className={`p-1.5 rounded transition-colors ${
            lightMode ? 'text-gray-500 hover:text-blue-600' : 'text-cyan-700 hover:text-cyan-400'
          }`}
        >
          <Search size={14} />
        </button>
        <a
          href="/resume.pdf"
          download
          aria-label="Download resume"
          className={`p-1.5 rounded transition-colors ${
            lightMode ? 'text-gray-500 hover:text-blue-600' : 'text-cyan-700 hover:text-cyan-400'
          }`}
        >
          <Download size={14} />
        </a>
        <button
          onClick={onThemeToggle}
          aria-label="Toggle theme"
          className={`p-1.5 rounded text-base transition-colors ${
            lightMode ? 'text-gray-500 hover:text-blue-600' : 'text-cyan-700 hover:text-cyan-400'
          }`}
        >
          {lightMode ? '☀️' : '🌙'}
        </button>
      </div>
    </header>
  );
}
