// Command autocomplete and suggestions

import { CommandSuggestion } from '@/types';

// Note: These are base English commands. For multi-lingual support,
// commands should work in any language but suggestions can be localized
export const COMMAND_SUGGESTIONS: CommandSuggestion[] = [
  // Navigation
  { command: 'show projects', description: 'View all projects', category: 'navigation' },
  { command: 'show experience', description: 'View work experience', category: 'navigation' },
  { command: 'show education', description: 'View education history', category: 'navigation' },
  { command: 'show intelligence', description: 'View skills and capabilities', category: 'navigation' },
  { command: 'show contact', description: 'View contact information', category: 'navigation' },
  { command: 'show system status', description: 'View system dashboard', category: 'navigation' },
  { command: 'show analytics', description: 'View portfolio analytics and data insights', category: 'navigation' },
  { command: 'show help', description: 'View available commands', category: 'navigation' },
  
  // Information
  { command: 'tell me about divyansh', description: 'Learn about the creator', category: 'information' },
  { command: 'who made you', description: 'Learn about the creator', category: 'information' },
  { command: 'what can you do', description: 'View capabilities', category: 'information' },
  
  // Actions
  { command: 'play a game', description: 'Start text adventure game', category: 'action' },
  { command: 'matrix', description: 'Activate Matrix effect', category: 'action' },
  { command: 'clear', description: 'Clear the console', category: 'action' },
  { command: 'toggle theme', description: 'Switch between light/dark mode', category: 'action' },
];

export function getSuggestions(input: string): CommandSuggestion[] {
  if (!input.trim()) {
    return COMMAND_SUGGESTIONS.slice(0, 5); // Show top 5 when empty
  }

  const lowerInput = input.toLowerCase();
  return COMMAND_SUGGESTIONS
    .filter(suggestion => 
      suggestion.command.toLowerCase().includes(lowerInput) ||
      suggestion.description.toLowerCase().includes(lowerInput)
    )
    .slice(0, 8); // Limit to 8 suggestions
}

export function findBestMatch(input: string): CommandSuggestion | null {
  const lowerInput = input.toLowerCase().trim();
  
  // Exact match
  const exact = COMMAND_SUGGESTIONS.find(
    s => s.command.toLowerCase() === lowerInput
  );
  if (exact) return exact;

  // Starts with match
  const startsWith = COMMAND_SUGGESTIONS.find(
    s => s.command.toLowerCase().startsWith(lowerInput)
  );
  if (startsWith) return startsWith;

  // Contains match
  const contains = COMMAND_SUGGESTIONS.find(
    s => s.command.toLowerCase().includes(lowerInput)
  );
  return contains || null;
}

