'use client';

import { useEffect, useRef } from 'react';

// Extend Window to include mountScrollWorld from scrub-engine.js
declare global {
  interface Window {
    mountScrollWorld?: (container: HTMLElement, config: object) => void;
  }
}

const SCROLL_WORLD_CONFIG = {
  brand: { name: 'DK-01' },
  diveScroll: 1.2,
  connScroll: 0,
  sections: [
    {
      id: 'mission-control',
      label: 'Mission Control',
      still: '/scroll-world/stills/scene1.webp',
      clip: '/scroll-world/vid/leg1.mp4',
      scroll: 1.4,
      linger: 0.35,
      accent: '#00FFFF',
      eyebrow: 'Building systems',
      title: 'DK-01 Online.',
      body: 'Reinforcement learning. Quantitative finance. Labor economics.',
      tags: ['RL', 'Quant', 'Research'],
    },
    {
      id: 'the-markets',
      label: 'The Markets',
      still: '/scroll-world/stills/scene2.webp',
      clip: '/scroll-world/vid/leg2.mp4',
      scroll: 1.2,
      linger: 0.3,
      accent: '#00FF88',
      eyebrow: 'Valuation & modeling',
      title: 'Where numbers tell a story.',
      body: 'KPMG valuation models, Monte Carlo simulations — finding signal in noise.',
      tags: ['Finance', 'Optimization'],
    },
    {
      id: 'research-lab',
      label: 'The Research Lab',
      still: '/scroll-world/stills/scene3.webp',
      clip: '/scroll-world/vid/leg3.mp4',
      scroll: 1.2,
      linger: 0.3,
      accent: '#B469FF',
      eyebrow: 'Multi-agent systems',
      title: 'Teaching machines to cooperate.',
      body: 'Fleet Attack, Frozen Lake, LLM-robotics integration at Tan Labs.',
      tags: ['PyTorch', 'MATLAB', 'Gym'],
    },
    {
      id: 'data-observatory',
      label: 'The Data Observatory',
      still: '/scroll-world/stills/scene4.webp',
      clip: '/scroll-world/vid/leg4.mp4',
      scroll: 1.2,
      linger: 0.3,
      accent: '#00AAFF',
      eyebrow: 'Labor & economics',
      title: 'Measuring the unmeasurable.',
      body: 'Indian labor market analysis, food rating prediction, basketball gravity metrics.',
      tags: ['Econometrics', 'Stata', 'Python'],
    },
    {
      id: 'connect',
      label: 'Connect',
      still: '/scroll-world/stills/scene5.webp',
      clip: '/scroll-world/vid/leg5.mp4',
      scroll: 1.4,
      linger: 0.45,
      accent: '#00FFFF',
      eyebrow: "Let's work together",
      title: 'Ready to contribute.',
      body: 'Open to quant research, data science, and software engineering roles.',
      tags: [],
      cta: { label: 'Download Resume', href: '/resume.pdf' },
    },
  ],
  connectors: [],
};

export function ScrollWorld() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mountedRef = useRef(false);

  useEffect(() => {
    if (mountedRef.current || !containerRef.current) return;
    mountedRef.current = true;

    const script = document.createElement('script');
    script.src = '/scroll-world/scrub-engine.js';
    script.onload = () => {
      if (containerRef.current && window.mountScrollWorld) {
        window.mountScrollWorld(containerRef.current, SCROLL_WORLD_CONFIG);
      }
    };
    document.head.appendChild(script);

    return () => {
      mountedRef.current = false;
    };
  }, []);

  return (
    <div
      ref={containerRef}
      id="scroll-world-root"
      style={{ width: '100%' }}
      aria-label="Scroll to explore DK-01's world"
    />
  );
}
