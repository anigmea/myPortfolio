// Global type definitions

export interface LogEntry {
  type: 'system' | 'user' | 'ai';
  text: string;
}

export interface ChatMessage {
  role: 'user' | 'ai';
  content: string;
}

export interface Project {
  title: string;
  description: string;
  tech: string[];
  link: string;
  keywords: string[];
}

export interface Experience {
  year: string;
  title: string;
  company: string;
  description: string;
  tech: string[];
  color: string;
}

export interface Education {
  university: string;
  degree: string;
  majors: string[];
  gpa: string;
  graduationYear: string;
  location: string;
  description: string;
  modules: Record<string, string[]>;
  achievements: string[];
  researchInterests: string[];
}

export interface ContentDisplayProps {
  type: string;
  title?: string;
  payload?: any;
}

export type AIStatus = 'idle' | 'thinking' | 'processing' | 'projects' | 'intelligence' | 'future' | 'contact' | 'experience' | 'education' | 'system_status';
