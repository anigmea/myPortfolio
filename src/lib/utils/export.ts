// Export utilities for conversations and content

import { LogEntry } from '@/types';

export function exportConversation(log: LogEntry[]): string {
  const lines = log.map(entry => {
    const prefix = entry.type === 'user' ? 'You' : entry.type === 'ai' ? 'DK-01' : 'System';
    return `[${prefix}]: ${entry.text}`;
  });
  return lines.join('\n\n');
}

export function downloadText(content: string, filename: string) {
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function copyToClipboard(text: string): Promise<void> {
  return navigator.clipboard.writeText(text);
}

export function shareContent(title: string, text: string, url?: string) {
  if (navigator.share) {
    return navigator.share({
      title,
      text,
      url: url || window.location.href,
    });
  } else {
    // Fallback: copy to clipboard
    const fullText = `${title}\n\n${text}${url ? `\n\n${url}` : ''}`;
    return copyToClipboard(fullText).then(() => {
      alert('Content copied to clipboard!');
    });
  }
}




