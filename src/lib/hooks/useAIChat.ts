"use client";

import { useState, useCallback } from 'react';
import { ChatMessage, LogEntry, AIStatus } from '@/types';

export function useAIChat() {
  const [log, setLog] = useState<LogEntry[]>([
    { type: 'system', text: "Welcome, Visitor.\nDK-01 Cognitive Interface active.\n\n> [ Awaiting command... ]" }
  ]);
  const [conversationHistory, setConversationHistory] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(true);
  const [isThinking, setIsThinking] = useState(false);
  const [aiStatus, setAiStatus] = useState<AIStatus>('idle');

  // +++ ADD THIS NEW STATE +++
  const [streamingResponse, setStreamingResponse] = useState<string>('');

  const invokeAI = async (prompt: string, history: ChatMessage[]) => {
    // ... (this function is unchanged)
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, history })
      });

      if (!response.ok) {
        console.error("API Error:", response.status, await response.text());
        return { responseText: "Error: Could not connect to the cognitive core. Authorization failed." };
      }

      return { stream: response.body };
    } catch (error) {
      console.error("Failed to invoke AI Agent:", error);
      return { responseText: "System Error: Cognitive core is offline." };
    }
  };

  const processCommand = useCallback(async (command: string) => {
    setLog(prev => [...prev, { type: 'user', text: command }]);
    setIsTyping(true); // Keep this for the welcome message logic
    setIsThinking(true);
    setAiStatus('thinking');
    
    // +++ CLEAR PREVIOUS STREAM +++
    setStreamingResponse('');

    const userMessage: ChatMessage = { role: 'user', content: command };

    // Handle local commands
    if (command.toLowerCase() === 'clear' || command.toLowerCase() === 'clear console') {
      setLog([{ type: 'system', text: "Console cleared.\n> [ System ready. Awaiting command... ]" }]);
      setIsThinking(false);
      setIsTyping(false);
      setAiStatus('idle');
      return null;
    }

    // Call AI
    const { stream, responseText: errorText } = await invokeAI(command, [...conversationHistory, userMessage]);

    if (errorText) {
      setLog(prev => [...prev, { type: 'ai', text: errorText }]);
      setIsThinking(false);
      setIsTyping(false);
      setAiStatus('idle');
      return null;
    }

    if (!stream) {
      throw new Error('No stream received');
    }

    let aiResponseText = "";
    const reader = stream.getReader();
    const decoder = new TextDecoder('utf-8', { fatal: false, ignoreBOM: true });

    setIsThinking(false);

    try {
      while (true) {
        const { value, done } = await reader.read();
        if (done) {
          const remainingText = decoder.decode();
          if (remainingText) {
            aiResponseText += remainingText;
            // (No need to update stream state here, it's done)
          }
          // +++ ADD FINAL LOG & CLEAR STREAM +++
          setLog(prev => [...prev, { type: 'ai', text: aiResponseText }]);
          setStreamingResponse('');
          break;
        }

        if (value) {
          const decodedChunk = decoder.decode(value, { stream: true });
          if (decodedChunk) {
            aiResponseText += decodedChunk;
            // +++ UPDATE STREAMING STATE LIVE +++
            setStreamingResponse(prev => prev + decodedChunk);
          }
        }
      }
    } finally {
      reader.releaseLock();
    }

    setConversationHistory(prev => [...prev, userMessage, { role: 'ai', content: aiResponseText }]);
    setIsTyping(false);

    // Try to parse as tool call
    try {
      const toolCall = JSON.parse(aiResponseText);
      if (toolCall.tool) {
        return { type: toolCall.tool, payload: toolCall.argument };
      }
    } catch {
      // Not a tool call, just a text response
    }

    setAiStatus('idle');
    return null;
  }, [conversationHistory]);

  return {
    log,
    setLog,
    isTyping,
    setIsTyping,
    isThinking,
    aiStatus,
    setAiStatus,
    processCommand,
    streamingResponse, // +++ EXPORT THE NEW STATE +++
  };
}