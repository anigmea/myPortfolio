// Global type definitions

export interface LogEntry {
  type: 'system' | 'user' | 'ai';
  text: string;
  timestamp?: number;
  id?: string;
}

export interface ChatMessage {
  role: 'user' | 'ai';
  content: string;
  tool_calls?: ToolCall[];
  timestamp?: number;
}

export interface ToolCall {
  name: string;
  args: Record<string, unknown>;
  id?: string;
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
  payload?: unknown;
}

export type AIStatus = 'idle' | 'thinking' | 'processing' | 'projects' | 'intelligence' | 'future' | 'contact' | 'experience' | 'education' | 'system_status' | 'analytics';

// API Types
export interface APIRequest {
  history: ChatMessage[];
  prompt: string;
}

export interface APIResponse {
  text_response: string;
  ui_update?: UIUpdate;
  ai_message: ChatMessage;
  error?: string;
}

export interface UIUpdate {
  type: string;
  payload?: unknown;
}

// Component Props Types
export interface TimelineBikeProps {
  experience: Experience[];
}

export interface ContentDisplayComponentProps {
  content: ContentDisplayProps | null;
  projects: Project[];
  experience: Experience[];
  education: Education | null;
  lightMode: boolean;
}

export interface CommandSuggestion {
  command: string;
  description: string;
  category: 'navigation' | 'information' | 'action' | 'system';
}

// Toast Notification Types
export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

// Search Types
export interface SearchResult {
  type: 'project' | 'experience' | 'education' | 'command';
  title: string;
  description: string;
  data: Project | Experience | Education | string;
}
