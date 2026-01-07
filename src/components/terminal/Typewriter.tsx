"use client";

import { useEffect, useState, useRef } from 'react';
import type { JSX, CSSProperties } from 'react';

interface TypewriterProps {
  text: string;
  speed?: number;
  delay?: number;
  onComplete?: () => void;
  className?: string;
  wrapper?: keyof JSX.IntrinsicElements;
  style?: CSSProperties;
}

export function Typewriter({ 
  text, 
  speed = 10, 
  delay = 5, 
  onComplete, 
  className, 
  wrapper = 'div', 
  style 
}: TypewriterProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [isDone, setIsDone] = useState(false);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    if (!text) return;
    setDisplayedText('');
    setIsDone(false);
    let charIndex = 0;
    let timeoutId: NodeJS.Timeout;

    const startTyping = () => {
      if (charIndex < text.length) {
        setDisplayedText(prev => prev + text.charAt(charIndex));
        charIndex++;
        timeoutId = setTimeout(startTyping, speed);
      } else {
        setIsDone(true);
        if (onCompleteRef.current) onCompleteRef.current();
      }
    };

    const delayId = setTimeout(startTyping, delay);
    return () => { 
      clearTimeout(timeoutId); 
      clearTimeout(delayId); 
    };
  }, [text, speed, delay]);

  const Wrapper = wrapper as keyof JSX.IntrinsicElements;
  return (
    <Wrapper className={className} style={style}>
      {displayedText}
      {!isDone && <span className="blinking-cursor">_</span>}
    </Wrapper>
  );
}
