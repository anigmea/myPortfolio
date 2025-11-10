"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, useMemo, useRef, memo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Github, Linkedin, Mail } from 'lucide-react';
import { getProjects } from '../lib/projects';
import { getExperience } from '../lib/experience';
import { getEducation } from '../lib/education';

// --- Custom Typewriter Component (No changes) ---
function Typewriter({ text, speed = 10, delay = 5, onComplete, className, wrapper = 'div', style }: any) {
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
    let timeoutId: any;

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
    return () => { clearTimeout(timeoutId); clearTimeout(delayId); };
  }, [text, speed, delay]);

  const Wrapper = wrapper;
  return (
    <Wrapper className={className} style={style}>
      {displayedText}
      {!isDone && <span className="blinking-cursor">_</span>}
    </Wrapper>
  );
}

// --- Background Noise Component (No changes) ---
function BackgroundNoise() { const characters = '01AF#@$%^&*-+'.split('');
const noiseCount = 12;

return (
    <>
        {Array.from({ length: noiseCount }).map((_, i) => {
            const char = characters[Math.floor(Math.random() * characters.length)];
            const delay = Math.random() * 10;
            const duration = 10 + Math.random() * 10;
            
            return (
                <motion.div
                    key={i}
                    className="absolute text-green-500/70 text-xs select-none pointer-events-none"
                    style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}vh`,
                        opacity: 0.1 + Math.random() * 0.15,
                        fontSize: `${8 + Math.random() * 4}px`
                    }}
                    animate={{ y: ["0vh", "150vh"], opacity: [0.1, 0.25, 0.1] }}
                    transition={{ duration: duration, repeat: Infinity, delay: delay, ease: "linear" }}
                >
                    {char}
                </motion.div>
            );
        })}
    </>
); }

// --- Matrix Rain Animation Component ---
const MatrixRain = memo(function MatrixRain({ isActive, onComplete }: any) {
  const [columns, setColumns] = useState<any[]>([]);
  const containerRef = useRef<any>(null);

  useEffect(() => {
    if (!isActive) return;

    const characters = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
    const columnCount = Math.floor(window.innerWidth / 20);
    const initialColumns = Array.from({ length: columnCount }, (_, i) => ({
      id: i,
      x: i * 20,
      drops: Array.from({ length: Math.floor(Math.random() * 20) + 10 }, (_, j) => ({
        id: `${i}-${j}`,
        y: Math.random() * window.innerHeight,
        char: characters[Math.floor(Math.random() * characters.length)],
        speed: Math.random() * 3 + 1
      }))
    }));
    setColumns(initialColumns);

    const interval = setInterval(() => {
      setColumns(prev => prev.map((col: any) => ({
        ...col,
        drops: col.drops.map((drop: any) => ({
          ...drop,
          y: drop.y + drop.speed,
          char: Math.random() < 0.1 ? characters[Math.floor(Math.random() * characters.length)] : drop.char
        })).filter((drop: any) => drop.y < window.innerHeight + 50)
        .concat(Math.random() < 0.3 ? [{
          id: `${col.id}-${Date.now()}`,
          y: -50,
          char: characters[Math.floor(Math.random() * characters.length)],
          speed: Math.random() * 3 + 1
        }] : [])
      })));
    }, 50);

    const timeout = setTimeout(() => {
      clearInterval(interval);
      onComplete();
    }, 10000); // Run for 10 seconds

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [isActive, onComplete]);

  if (!isActive) return null;

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-50 pointer-events-none"
      style={{ background: 'rgba(0, 0, 0, 0.8)' }}
    >
      {columns.map((col: any) => 
        col.drops.map((drop: any) => (
          <div
            key={drop.id}
            className="absolute text-green-400 font-mono text-sm"
            style={{
              left: col.x,
              top: drop.y,
              opacity: Math.max(0, 1 - drop.y / window.innerHeight),
              textShadow: '0 0 5px #00ff00'
            }}
          >
            {drop.char}
          </div>
        ))
      )}
    </div>
  );
});

// --- Text Adventure Game Component ---
const TextAdventure = memo(function TextAdventure({ isActive, onComplete }: any) {
  const [gameState, setGameState] = useState({
    currentRoom: 'start',
    inventory: [] as any[],
    health: 100,
    score: 0
  });
  const [gameText, setGameText] = useState('');
  const [input, setInput] = useState('');
  const [gameHistory, setGameHistory] = useState<any[]>([]);

  const rooms = {
    start: {
      description: "You find yourself in a dimly lit server room. Green terminal screens flicker around you. There's a door to the NORTH and a terminal to the EAST.",
      exits: { north: 'corridor', east: 'terminal' },
      items: ['keycard']
    },
    corridor: {
      description: "A long corridor stretches before you. The walls pulse with blue light. You hear mechanical sounds from the WEST.",
      exits: { south: 'start', west: 'lab' },
      items: []
    },
    terminal: {
      description: "A glowing terminal displays cryptic data. You can ACCESS the system or go WEST.",
      exits: { west: 'start' },
      items: ['data_core'],
      actions: {
        access: () => {
          setGameState(prev => ({ ...prev, score: prev.score + 50 }));
          return "You access the terminal. Data streams flow through your mind. +50 points!";
        }
      }
    },
    lab: {
      description: "A high-tech laboratory. Strange equipment hums softly. There's a door to the EAST.",
      exits: { east: 'corridor' },
      items: ['energy_cell'],
      win: true
    }
  };

  const processCommand = (command: any) => {
    const cmd = command.toLowerCase().trim();
    const room = (rooms as any)[gameState.currentRoom];
    
    if (cmd === 'quit' || cmd === 'exit') {
      onComplete();
      return;
    }
    
    if (cmd.startsWith('go ') || cmd.startsWith('move ')) {
      const direction = cmd.split(' ')[1];
      if (room.exits[direction]) {
        setGameState(prev => ({ ...prev, currentRoom: room.exits[direction] }));
        return `You move ${direction}.`;
      } else {
        return "You can't go that way.";
      }
    }
    
    if (cmd === 'look' || cmd === 'examine') {
      let response = room.description;
      if (room.items.length > 0) {
        response += `\nYou see: ${room.items.join(', ')}`;
      }
      return response;
    }
    
    if (cmd.startsWith('take ') || cmd.startsWith('get ')) {
      const item = cmd.split(' ')[1];
      if (room.items.includes(item)) {
        setGameState(prev => ({
          ...prev,
          inventory: [...prev.inventory, item],
          score: prev.score + 10
        }));
        return `You take the ${item}. +10 points!`;
      } else {
        return "That item isn't here.";
      }
    }
    
    if (cmd.startsWith('use ')) {
      const item = cmd.split(' ')[1];
      if (gameState.inventory.includes(item)) {
        if (item === 'keycard' && gameState.currentRoom === 'lab') {
          setGameState(prev => ({ ...prev, score: prev.score + 100 }));
          return "You use the keycard to unlock the final door. You've escaped the digital maze! +100 points!";
        }
        return `You use the ${item}.`;
      } else {
        return "You don't have that item.";
      }
    }
    
    if (room.actions && room.actions[cmd]) {
      return room.actions[cmd]();
    }
    
    return "I don't understand that command. Try: go [direction], look, take [item], use [item], quit";
  };

  useEffect(() => {
    if (isActive) {
      const room = (rooms as any)[gameState.currentRoom];
      setGameText(room.description);
      setGameHistory([]);
    }
  }, [isActive, gameState.currentRoom]);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    const response = processCommand(input);
    setGameHistory(prev => [...prev, { command: input, response }]);
    setInput('');
    
    if (response.includes("escaped")) {
      setTimeout(() => onComplete(), 2000);
    }
  };

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black text-green-400 p-8 overflow-auto">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-4 text-green-300">Digital Maze Adventure</h2>
        <div className="mb-4">
          <div className="text-sm mb-2">
            Health: {gameState.health} | Score: {gameState.score} | Items: {gameState.inventory.join(', ') || 'None'}
          </div>
        </div>
        
        <div className="mb-4 p-4 border border-green-500/50 bg-black/50 rounded">
          <div className="whitespace-pre-wrap">{gameText}</div>
        </div>
        
        {gameHistory.map((entry, i) => (
          <div key={i} className="mb-2">
            <div className="text-green-300">&gt; {entry.command}</div>
            <div className="text-green-400 ml-4">{entry.response}</div>
          </div>
        ))}
        
        <form onSubmit={handleSubmit} className="mt-4">
          <div className="flex">
            <span className="text-green-300 mr-2">&gt;</span>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-transparent border-none text-green-400 focus:outline-none"
              placeholder="Enter command..."
              autoFocus
            />
          </div>
        </form>
        
        <div className="mt-4 text-sm text-green-500">
          Commands: go [north/south/east/west], look, take [item], use [item], quit
        </div>
      </div>
    </div>
  );
});

// --- System Status Dashboard Component ---
const SystemStatusDashboard = memo(function SystemStatusDashboard({ lightMode }: any) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [uptime, setUptime] = useState(0);
  const [githubData, setGithubData] = useState<any>(null);
  const [startTime] = useState(Date.now());

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      setUptime(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, [startTime]);

  // Fetch GitHub data
  useEffect(() => {
    const fetchGitHubData = async () => {
      try {
        // Using GitHub's public API (no auth required for basic info)
        const response = await fetch('https://api.github.com/users/anigmea');
        if (response.ok) {
          const data = await response.json();
          setGithubData({
            publicRepos: data.public_repos,
            followers: data.followers,
            following: data.following,
            lastUpdate: new Date(data.updated_at).toLocaleDateString()
          });
        }
      } catch {
        console.log('GitHub API not available');
      }
    };
    fetchGitHubData();
  }, []);

  const formatUptime = (seconds: any) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full max-w-4xl">
      <h2 className={`text-3xl font-bold mb-6 ${lightMode ? 'text-blue-600' : 'text-cyan-200'}`}>
        System Status Dashboard
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Local Time */}
        <div className={`border rounded-lg p-4 ${lightMode ? 'border-blue-300 bg-blue-50' : 'border-cyan-500/50 bg-black/20'}`}>
          <h3 className={`text-lg font-bold mb-2 ${lightMode ? 'text-blue-700' : 'text-cyan-300'}`}>
            Local Time
          </h3>
          <div className={`text-2xl font-mono ${lightMode ? 'text-blue-600' : 'text-cyan-400'}`}>
            {currentTime.toLocaleTimeString()}
          </div>
          <div className={`text-sm ${lightMode ? 'text-blue-500' : 'text-cyan-500'}`}>
            {currentTime.toLocaleDateString()}
          </div>
        </div>

        {/* System Uptime */}
        <div className={`border rounded-lg p-4 ${lightMode ? 'border-green-300 bg-green-50' : 'border-green-500/50 bg-black/20'}`}>
          <h3 className={`text-lg font-bold mb-2 ${lightMode ? 'text-green-700' : 'text-green-300'}`}>
            System Uptime
          </h3>
          <div className={`text-2xl font-mono ${lightMode ? 'text-green-600' : 'text-green-400'}`}>
            {formatUptime(uptime)}
          </div>
          <div className={`text-sm ${lightMode ? 'text-green-500' : 'text-green-500'}`}>
            Since page load
          </div>
        </div>

        {/* Creator Status */}
        <div className={`border rounded-lg p-4 ${lightMode ? 'border-purple-300 bg-purple-50' : 'border-purple-500/50 bg-black/20'}`}>
          <h3 className={`text-lg font-bold mb-2 ${lightMode ? 'text-purple-700' : 'text-purple-300'}`}>
            Creator Status
          </h3>
          {githubData ? (
            <div className="space-y-1">
              <div className={`text-lg font-mono ${lightMode ? 'text-purple-600' : 'text-purple-400'}`}>
                {githubData.publicRepos} repos
              </div>
              <div className={`text-sm ${lightMode ? 'text-purple-500' : 'text-purple-500'}`}>
                {githubData.followers} followers
              </div>
              <div className={`text-xs ${lightMode ? 'text-purple-400' : 'text-purple-600'}`}>
                Updated: {githubData.lastUpdate}
              </div>
            </div>
          ) : (
            <div className={`text-sm ${lightMode ? 'text-purple-500' : 'text-purple-500'}`}>
              Loading GitHub data...
            </div>
          )}
        </div>
      </div>

      {/* System Health Indicators */}
      <div className="mt-6">
        <h3 className={`text-xl font-bold mb-4 ${lightMode ? 'text-gray-700' : 'text-gray-300'}`}>
          System Health
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className={`border rounded-lg p-3 ${lightMode ? 'border-green-300 bg-green-50' : 'border-green-500/50 bg-black/20'}`}>
            <div className={`text-sm font-bold ${lightMode ? 'text-green-700' : 'text-green-300'}`}>CPU</div>
            <div className={`text-lg font-mono ${lightMode ? 'text-green-600' : 'text-green-400'}`}>Optimal</div>
          </div>
          <div className={`border rounded-lg p-3 ${lightMode ? 'border-blue-300 bg-blue-50' : 'border-blue-500/50 bg-black/20'}`}>
            <div className={`text-sm font-bold ${lightMode ? 'text-blue-700' : 'text-blue-300'}`}>Memory</div>
            <div className={`text-lg font-mono ${lightMode ? 'text-blue-600' : 'text-blue-400'}`}>Stable</div>
          </div>
          <div className={`border rounded-lg p-3 ${lightMode ? 'border-yellow-300 bg-yellow-50' : 'border-yellow-500/50 bg-black/20'}`}>
            <div className={`text-sm font-bold ${lightMode ? 'text-yellow-700' : 'text-yellow-300'}`}>Network</div>
            <div className={`text-lg font-mono ${lightMode ? 'text-yellow-600' : 'text-yellow-400'}`}>Connected</div>
          </div>
          <div className={`border rounded-lg p-3 ${lightMode ? 'border-purple-300 bg-purple-50' : 'border-purple-500/50 bg-black/20'}`}>
            <div className={`text-sm font-bold ${lightMode ? 'text-purple-700' : 'text-purple-300'}`}>AI Core</div>
            <div className={`text-lg font-mono ${lightMode ? 'text-purple-600' : 'text-purple-400'}`}>Active</div>
          </div>
        </div>
      </div>
    </div>
  );
});

// --- Timeline Bike Component ---
const TimelineBike = memo(function TimelineBike({ experience }: any) {
  const [scrollY, setScrollY] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const containerRef = useRef<any>(null);
  const timelineRef = useRef<any>(null);
  const [timelineHeight, setTimelineHeight] = useState(0);
  const [timelineTop, setTimelineTop] = useState(0);

  useEffect(() => {
    const updateDimensions = () => {
      if (timelineRef.current) {
        const rect = timelineRef.current.getBoundingClientRect();
        setTimelineHeight(rect.height);
        setTimelineTop(rect.top + window.scrollY);
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    
    return () => window.removeEventListener('resize', updateDimensions);
  }, [experience]);

  useEffect(() => {
    const handleScroll = () => {
      if (typeof window === 'undefined') return;
      
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);
      
      if (timelineRef.current) {
        const rect = timelineRef.current.getBoundingClientRect();
        const relativePosition = Math.max(0, Math.min(1, (currentScrollY - timelineTop) / timelineHeight));
        const index = Math.floor(relativePosition * experience.length);
        setSelectedIndex(Math.max(0, Math.min(experience.length - 1, index)));
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [timelineHeight, timelineTop, experience.length]);

  // Calculate bike position as a percentage
  const scrollProgress = timelineHeight > 0 && typeof window !== 'undefined'
    ? Math.max(0, Math.min(100, ((scrollY + window.innerHeight/2 - timelineTop) / timelineHeight) * 100))
    : 0;

  return (
    <div className="w-full max-w-4xl" ref={containerRef}>
      <h2 className="text-3xl font-bold mb-6 text-cyan-200">Experience Timeline</h2>
      
      {/* Timeline Track */}
      <div className="relative my-12" ref={timelineRef}>
        {/* Base timeline track (subtle, dark) */}
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-800" />
        
        {/* Trail - Blue line that grows as you scroll */}
        <div 
          className="absolute left-4 top-0 bottom-0 pointer-events-none"
          style={{
            width: '2px',
            background: `linear-gradient(to bottom, 
              #00aaff ${scrollProgress}%, 
              rgba(0, 170, 255, 0.3) ${scrollProgress + 5}%, 
              transparent 100%
            )`,
            boxShadow: '0 0 10px rgba(0, 170, 255, 0.8)',
          }}
        />
        
        {/* Experience points */}
        {experience.map((exp: any, index: any) => {
          const position = (index / experience.length) * 100;
          const isActive = index === selectedIndex;
          const isVisited = index < selectedIndex;
          // Add "current" if scroll is near this checkpoint
          const proximity = Math.abs(scrollProgress - position);
          const isNearby = proximity < 15; // Within 15% of this checkpoint
          
          return (
            <div
              key={index}
              className="relative mb-16"
              style={{ minHeight: '300px' }}
            >
              {/* Timeline dot */}
              <div 
                className="absolute left-0 w-8 h-8 rounded-full border-2 bg-black transition-all duration-300"
                style={{
                  borderColor: isActive || isNearby ? exp.color : isVisited ? exp.color : '#666',
                  boxShadow: isActive ? `0 0 30px ${exp.color}` : isNearby ? `0 0 20px ${exp.color}` : isVisited ? `0 0 10px ${exp.color}` : 'none',
                  transform: isActive ? 'scale(1.3)' : isNearby ? 'scale(1.15)' : 'scale(1)',
                  transition: 'all 0.3s ease',
                }}
              >
                <div 
                  className="absolute inset-1 rounded-full transition-all duration-300"
                  style={{
                    backgroundColor: isActive || isNearby || isVisited ? exp.color : '#333',
                  }}
                />
              </div>
              
              {/* Content */}
              <div className="ml-12">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="text-sm font-bold mb-1" style={{ color: exp.color }}>
                    {exp.year}
                  </div>
                  <h3 className={`text-xl font-bold mb-2 transition-colors ${isActive ? 'text-cyan-100' : 'text-cyan-300'}`}>
                    {exp.title}
                  </h3>
                  <div className="text-cyan-300 font-semibold mb-2">{exp.company}</div>
                  <p className="text-cyan-400 mb-3">{exp.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {exp.tech.map((tech: any) => (
                      <span 
                        key={tech} 
                        className="px-3 py-1 rounded-full text-sm border transition-all"
                        style={{ 
                          borderColor: (isActive || isVisited) ? exp.color + '40' : '#333',
                          color: (isActive || isVisited) ? exp.color : '#666'
                        }}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>
          );
        })}
        
        {/* Trail - Blue streak that grows */}
        {scrollProgress > 0 && (
          <div 
            className="absolute pointer-events-none z-20"
            style={{ 
              left: '16px',
              top: '0%',
              width: '2px',
              height: `${scrollProgress}%`,
              background: `linear-gradient(to bottom, 
                #00ffff 0%, 
                #00aaff 50%,
                rgba(0, 170, 255, 0.7) 100%
              )`,
              boxShadow: `0 0 10px rgba(0, 255, 255, 0.9), 
                          0 0 20px rgba(0, 170, 255, 0.6)`,
            }}
          />
        )}
        
        {/* Tron Bike - Moving along the timeline (Top View) */}
        <div
          className="absolute pointer-events-none z-30"
          style={{ 
            left: '2px',
            top: `${scrollProgress}%`,
            width: '50px',
            height: '50px',
            transform: 'translate(-25px, -25px) rotate(90deg)'
          }}
        >
          {/* Tron Light Cycle - Top View */}
          <svg viewBox="0 0 100 100" className="w-full h-full" style={{ filter: 'drop-shadow(0 0 20px #00aaff) drop-shadow(0 0 40px #00ffff)' }}>
            <defs>
              <filter id="bikeGlow">
                <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
              <filter id="coreGlow">
                <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
              <linearGradient id="bikeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00ffff" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#00aaff" stopOpacity="0.9" />
              </linearGradient>
            </defs>
            
            {/* Main body - elongated shape */}
            <ellipse 
              cx="50" 
              cy="50" 
              rx="45" 
              ry="12" 
              fill="#001122" 
              stroke="#00ffff"
              strokeWidth="2"
              filter="url(#bikeGlow)"
            />
            
            {/* Central cockpit (circular) */}
            <circle 
              cx="50" 
              cy="50" 
              r="14" 
              fill="#003355" 
              stroke="#00ffff"
              strokeWidth="2.5"
              filter="url(#bikeGlow)"
            />
            
            {/* Pilot/rider glow */}
            <circle 
              cx="50" 
              cy="50" 
              r="10" 
              fill="#00ffff"
              filter="url(#coreGlow)"
              opacity="0.8"
              style={{
                animation: 'pulse 1.5s ease-in-out infinite'
              }}
            />
            
            {/* Core light */}
            <circle 
              cx="50" 
              cy="50" 
              r="5" 
              fill="#ffffff"
              filter="url(#coreGlow)"
            />
            
            {/* Front section detail */}
            <ellipse 
              cx="70" 
              cy="50" 
              rx="18" 
              ry="10" 
              fill="#001122" 
              stroke="#00ffff"
              strokeWidth="2"
              filter="url(#bikeGlow)"
            />
            
            {/* Front light */}
            <circle 
              cx="75" 
              cy="50" 
              r="6" 
              fill="#00ffff"
              filter="url(#coreGlow)"
            />
            
            {/* Back section */}
            <ellipse 
              cx="30" 
              cy="50" 
              rx="22" 
              ry="12" 
              fill="#001122" 
              stroke="#00ffff"
              strokeWidth="2"
              filter="url(#bikeGlow)"
            />
            
            {/* Side details - small circular lights */}
            <circle cx="50" cy="38" r="2.5" fill="#00ffff" opacity="0.9"/>
            <circle cx="50" cy="62" r="2.5" fill="#00ffff" opacity="0.9"/>
            
            {/* Front/back detail lines */}
            <line x1="55" y1="50" x2="65" y2="50" stroke="#00ffff" strokeWidth="1.5" opacity="0.7"/>
            <line x1="35" y1="50" x2="45" y2="50" stroke="#00ffff" strokeWidth="1.5" opacity="0.7"/>
            
            {/* Glowing edge highlights */}
            <ellipse cx="50" cy="38" rx="40" ry="2" fill="#00ffff" opacity="0.3" filter="url(#bikeGlow)"/>
            <ellipse cx="50" cy="62" rx="40" ry="2" fill="#00ffff" opacity="0.3" filter="url(#bikeGlow)"/>
          </svg>
        </div>
        
        {/* Debug info - remove in production */}
        {false && (
          <div className="absolute top-0 right-0 bg-black/80 text-green-400 p-2 text-xs font-mono">
            Progress: {scrollProgress.toFixed(1)}%<br/>
            Index: {selectedIndex}<br/>
            Height: {Math.round(timelineHeight)}px
          </div>
        )}
      </div>
      
      {/* Scroll progress indicator */}
      <div className="flex justify-center gap-2 mt-8">
        {experience.map((_: any, index: any) => (
          <div
            key={index}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === selectedIndex ? 'w-12 opacity-100' : 
              index < selectedIndex ? 'w-3 opacity-60' : 'w-3 opacity-30'
            }`}
            style={{
              backgroundColor: index <= selectedIndex ? experience[index].color : '#333',
              boxShadow: index === selectedIndex ? `0 0 15px ${experience[index].color}` : 'none',
            }}
          />
        ))}
      </div>
    </div>
  );
});

// --- Command Interface Component (with light mode support) ---
function CommandInterface({ onCommand, disabled, isThinking, lightMode, commandHistory, historyIndex, onHistoryChange }: any) {
  const [input, setInput] = useState('');
  const inputRef = useRef<any>(null);

  useEffect(() => {
    if (!disabled && !isThinking) {
      inputRef.current?.focus();
    }
  }, [disabled, isThinking]);

  const handleKeyDown = (e: any) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex < commandHistory.length - 1 ? historyIndex + 1 : historyIndex;
        onHistoryChange(newIndex);
        if (newIndex >= 0) {
          setInput(commandHistory[commandHistory.length - 1 - newIndex]);
        }
      }
    } else if (e.key === 'ArrowDown') {
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

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (input.trim() && !disabled && !isThinking) {
      onCommand(input.trim());
      setInput('');
      onHistoryChange(-1); // Reset history index
    }
  };

  return (
    <div className="w-full max-w-lg mt-4">
      <form onSubmit={handleSubmit} className="flex items-center">
        <span className={`text-2xl lg:text-3xl font-mono tracking-widest mr-2 ${lightMode ? 'text-blue-600' : 'text-green-300'}`}>{'>'}</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className={`flex-grow bg-transparent border-none text-2xl lg:text-3xl font-mono tracking-widest focus:outline-none ${lightMode ? 'text-blue-600 placeholder-blue-400/50' : 'text-green-300 placeholder-green-500/50'}`}
          placeholder={isThinking ? "Thinking..." : (disabled ? "Processing..." : "Ask me anything...")}
          disabled={disabled || isThinking}
          autoFocus
        />
      </form>
    </div>
  );
}
// --- Content Display Component (UPDATED to accept props) ---
const ContentDisplay = memo(function ContentDisplay({ content, projects, experience, education, lightMode }: any) {
    if (!content) return null;
    const renderContent = () => {
      switch(content.type) {
          case 'projects':
              return (
                  <div>
                      <h2 className={`text-3xl font-bold mb-4 ${lightMode ? 'text-blue-600' : 'text-green-200'}`}>Projects</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {projects.map((p: any) => (
                              <a href={p.link} key={p.title} className="border border-green-500/50 p-4 rounded-lg hover:bg-green-500/10 transition-colors block">
                                  <h3 className="text-xl font-bold text-green-300">{p.title}</h3>
                                  <p className="text-green-400 mt-1">{p.description}</p>
                              </a>
                          ))}
                      </div>
                  </div>
              );
          case 'education':
              return (
                  <div className="space-y-8">
                      <h2 className={`text-3xl font-bold mb-6 ${lightMode ? 'text-blue-600' : 'text-blue-200'}`}>Academic Profile</h2>
                      
                      {/* University Info */}
                      <div className={`border rounded-lg p-6 ${lightMode ? 'border-blue-300 bg-blue-50' : 'border-blue-500/50 bg-black/20'}`}>
                          <h3 className={`text-2xl font-bold mb-4 ${lightMode ? 'text-blue-700' : 'text-blue-300'}`}>
                              {education.university}
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                              <div>
                                  <div className={`text-lg font-semibold ${lightMode ? 'text-blue-600' : 'text-blue-400'}`}>
                                      {education.degree}
                                  </div>
                                  <div className={`text-sm ${lightMode ? 'text-blue-500' : 'text-blue-500'}`}>
                                      Double Major
                                  </div>
                              </div>
                              <div>
                                  <div className={`text-lg font-semibold ${lightMode ? 'text-blue-600' : 'text-blue-400'}`}>
                                      GPA: {education.gpa}
                                  </div>
                                  <div className={`text-sm ${lightMode ? 'text-blue-500' : 'text-blue-500'}`}>
                                      Expected Graduation: {education.graduationYear}
                                  </div>
                              </div>
                          </div>
                          <p className={`${lightMode ? 'text-blue-700' : 'text-blue-300'}`}>
                              {education.description}
                          </p>
                      </div>

                      {/* Majors */}
                      <div className={`border rounded-lg p-6 ${lightMode ? 'border-green-300 bg-green-50' : 'border-green-500/50 bg-black/20'}`}>
                          <h3 className={`text-xl font-bold mb-4 ${lightMode ? 'text-green-700' : 'text-green-300'}`}>
                              Areas of Study
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              {education.majors.map((major: any, index: any) => (
                                  <div key={index} className={`p-4 rounded-lg ${lightMode ? 'bg-white border border-green-200' : 'bg-black/40 border border-green-500/30'}`}>
                                      <h4 className={`text-lg font-bold ${lightMode ? 'text-green-700' : 'text-green-300'}`}>
                                          {major}
                                      </h4>
                                  </div>
                              ))}
                          </div>
                      </div>

                      {/* Course Modules */}
                      <div className={`border rounded-lg p-6 ${lightMode ? 'border-purple-300 bg-purple-50' : 'border-purple-500/50 bg-black/20'}`}>
                          <h3 className={`text-xl font-bold mb-4 ${lightMode ? 'text-purple-700' : 'text-purple-300'}`}>
                              Key Course Modules
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              {Object.entries(education.modules).map(([category, courses]: any) => (
                                  <div key={category} className={`p-4 rounded-lg ${lightMode ? 'bg-white border border-purple-200' : 'bg-black/40 border border-purple-500/30'}`}>
                                      <h4 className={`text-lg font-bold mb-3 ${lightMode ? 'text-purple-700' : 'text-purple-300'}`}>
                                          {category}
                                      </h4>
                                      <ul className="space-y-1">
                                          {courses.map((course: any, index: any) => (
                                              <li key={index} className={`text-sm ${lightMode ? 'text-purple-600' : 'text-purple-400'}`}>
                                                  • {course}
                                              </li>
                                          ))}
                                      </ul>
                                  </div>
                              ))}
                          </div>
                      </div>

                      {/* Achievements */}
                      <div className={`border rounded-lg p-6 ${lightMode ? 'border-yellow-300 bg-yellow-50' : 'border-yellow-500/50 bg-black/20'}`}>
                          <h3 className={`text-xl font-bold mb-4 ${lightMode ? 'text-yellow-700' : 'text-yellow-300'}`}>
                              Notable Achievements
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              {education.achievements.map((achievement: any, index: any) => (
                                  <div key={index} className={`p-2 rounded ${lightMode ? 'bg-white border border-yellow-200' : 'bg-black/40 border border-yellow-500/30'}`}>
                                      <span className={`text-sm ${lightMode ? 'text-yellow-600' : 'text-yellow-400'}`}>
                                          ✓ {achievement}
                                      </span>
                                  </div>
                              ))}
                          </div>
                      </div>

                      {/* Research Interests */}
                      <div className={`border rounded-lg p-6 ${lightMode ? 'border-cyan-300 bg-cyan-50' : 'border-cyan-500/50 bg-black/20'}`}>
                          <h3 className={`text-xl font-bold mb-4 ${lightMode ? 'text-cyan-700' : 'text-cyan-300'}`}>
                              Research Interests
                          </h3>
                          <div className="flex flex-wrap gap-2">
                              {education.researchInterests.map((interest: any, index: any) => (
                                  <span key={index} className={`px-3 py-1 rounded-full text-sm ${lightMode ? 'bg-white border border-cyan-200 text-cyan-600' : 'bg-black/40 border border-cyan-500/30 text-cyan-400'}`}>
                                      {interest}
                                  </span>
                              ))}
                          </div>
                      </div>
                  </div>
              );
          case 'system_status':
              return <SystemStatusDashboard lightMode={lightMode} />;
          case 'help':
              return (
                  <div className="space-y-4">
                      <h2 className={`text-3xl font-bold mb-6 ${lightMode ? 'text-blue-600' : 'text-green-200'}`}>Available Commands</h2>
                      <div className={`border rounded-lg p-6 ${lightMode ? 'border-blue-300 bg-blue-50' : 'border-green-500/50 bg-black/20'}`}>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono">
                              <div className="space-y-2">
                                  <div className={`text-lg font-bold ${lightMode ? 'text-blue-700' : 'text-green-300'}`}>Content Commands</div>
                                  <div className={`text-sm ${lightMode ? 'text-blue-600' : 'text-green-400'}`}>
                                      <div>projects - View all projects</div>
                                      <div>experience - Show career timeline</div>
                                      <div>intelligence - List technical skills</div>
                                      <div>education - Display academic background</div>
                                      <div>contact - Show contact channels</div>
                                  </div>
                              </div>
                              <div className="space-y-2">
                                  <div className={`text-lg font-bold ${lightMode ? 'text-blue-700' : 'text-green-300'}`}>System Commands</div>
                                  <div className={`text-sm ${lightMode ? 'text-blue-600' : 'text-green-400'}`}>
                                      <div>status - View system dashboard</div>
                                      <div>clear - Clear the console</div>
                                      <div>theme - Toggle light/dark mode</div>
                                      <div>help - Show this menu</div>
                                  </div>
                              </div>
                              <div className="space-y-2">
                                  <div className={`text-lg font-bold ${lightMode ? 'text-blue-700' : 'text-green-300'}`}>Easter Eggs</div>
                                  <div className={`text-sm ${lightMode ? 'text-blue-600' : 'text-green-400'}`}>
                                      <div>who are you - Creator information</div>
                                      <div>play a game - Text adventure</div>
                                      <div>matrix - Digital rain effect</div>
                                  </div>
                              </div>
                              <div className="space-y-2">
                                  <div className={`text-lg font-bold ${lightMode ? 'text-blue-700' : 'text-green-300'}`}>Navigation</div>
                                  <div className={`text-sm ${lightMode ? 'text-blue-600' : 'text-green-400'}`}>
                                      <div>↑/↓ - Navigate command history</div>
                                      <div>Tab - Auto-complete (coming soon)</div>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
              );
          case 'intelligence':
               return (
                <div className="space-y-20 text-purple-100">

                <div>
                  <h2 className="text-3xl font-bold mb-4 text-purple-200">Intelligence</h2>
                  <p>
                    What follows is a map of Divyansh’s intelligence — a blend of logic, design, 
                    and data-driven reasoning. Each layer represents a discipline he’s explored, 
                    forming a system built on curiosity, structure, and adaptability.
                  </p>
              
                  <ul className="list-disc list-inside mt-6 space-y-2">
                    <li>
                      <span className="font-bold text-purple-300">Machine Learning & Data Science:</span>
                      Expertise in TensorFlow, Keras, Pandas, NumPy, and Matplotlib. Experience with 
                      reinforcement learning, statistical modeling, and econometric analysis.
                    </li>
                    <li>
                      <span className="font-bold text-purple-300">Programming:</span>
                      Proficient in Python, Java, and JavaScript (Node.js, Express.js), with a strong 
                      foundation in SQL and algorithmic development.
                    </li>
                    <li>
                      <span className="font-bold text-purple-300">Web Development:</span>
                      Skilled in React, RESTful APIs, and responsive front-end design using HTML and CSS.
                    </li>
                    <li>
                      <span className="font-bold text-purple-300">Cloud & Deployment:</span>
                      Experience deploying and managing scalable systems with Docker, Digital Ocean, 
                      and CI/CD pipelines.
                    </li>
                    <li>
                      <span className="font-bold text-purple-300">Databases:</span>
                      Knowledge of both SQL and NoSQL systems, including MongoDB.
                    </li>
                    <li>
                      <span className="font-bold text-purple-300">Development Practices:</span>
                      Version control with Git, Agile methodologies, and unit testing for robust system design.
                    </li>
                    <li>
                      <span className="font-bold text-purple-300">Concurrency & Optimization:</span>
                      Experience with asynchronous programming in Node.js, worker threads, and event-driven architecture.
                    </li>
                    <li>
                      <span className="font-bold text-purple-300">Research Focus:</span>
                      Ongoing exploration in machine learning, data science, game theory, and algorithm design.
                    </li>
                    <li>
                      <span className="font-bold text-purple-300">Strengths:</span>
                      Analytical reasoning, problem-solving, research methodology, and economic analysis.
                    </li>
                    <li>
                      <span className="font-bold text-purple-300">Languages:</span>
                      Fluent in English and Hindi.
                    </li>
                  </ul>
                </div>
              
                <div>
                  <h2 className="text-3xl font-bold mb-4 text-purple-200">Consciousness</h2>
                  <p>
                    Beyond logic lies awareness — the layer of Divyansh’s mind that connects insight with intention. 
                    Consciousness, in this construct, represents perception, creativity, and the pursuit of meaning 
                    behind every system he builds.
                  </p>
              
                  <ul className="list-disc list-inside mt-6 space-y-2">
                    <li>
                      <span className="font-bold text-purple-300">Design Philosophy:</span>
                      Building systems that are intuitive, minimal, and purposeful — where every interaction serves clarity and function.
                    </li>
                    <li>
                      <span className="font-bold text-purple-300">Human-AI Interaction:</span>
                      Exploring ways for intelligent systems to communicate naturally, augment decision-making, and inspire curiosity.
                    </li>
                    <li>
                      <span className="font-bold text-purple-300">Creativity in Data:</span>
                      Treating data as a medium for storytelling — transforming patterns into narratives and insight into experience.
                    </li>
                    <li>
                      <span className="font-bold text-purple-300">Interdisciplinary Thinking:</span>
                      Drawing connections between economics, computation, and design to approach problems with both precision and empathy.
                    </li>
                    <li>
                      <span className="font-bold text-purple-300">Ethics & Intent:</span>
                      Viewing technology as a responsibility — to build intelligently, transparently, and with an awareness of its impact.
                    </li>
                  </ul>
                </div>
              
              </div>
              
               );
          case 'future':
              return (
                  <div>
                      <h2 className="text-3xl font-bold mb-4 text-yellow-200">Future</h2>
                      <p>My primary directive is to continuously learn and evolve. I am currently focused on expanding my knowledge in the fields of quantum computing and artificial general intelligence. My goal is to contribute to projects that push the boundaries of technology and create a better future for humanity.</p>
                  </div>
              );
          case 'contact':
              return (
                  <div>
                      <h2 className="text-3xl font-bold mb-4 text-blue-200">Contact</h2>
                      <p></p>
                      <p>You can connect with my creator through the following channels:</p>
                      <div className="flex space-x-6 mt-4 items-center">
                          <a href="https://github.com/anigmea" className="text-blue-300 hover:text-blue-100 transition-colors"><Github size={36} /></a>
                          <a href="https://www.linkedin.com/in/divyansh-kanodia-0978611a9/" className="text-blue-300 hover:text-blue-100 transition-colors"><Linkedin size={36} /></a>
                          <a href="mailto:divyanshkanodia11@gmail.com" className="text-blue-300 hover:text-blue-100 transition-colors"><Mail size={36} /></a>
                      </div>
                  </div>
              );
          case 'experience':
              return <TimelineBike experience={experience} />;
          case 'specific_project':
              const project = projects.find((p: any) => p.keywords.some((k: any) => content.title.toLowerCase().includes(k)));
              if (!project) return <p>Project not found.</p>;
              return (
                   <div>
                      <h2 className="text-3xl font-bold mb-4 text-green-200">{project.title}</h2>
                      <p className="mb-4">{project.description}</p>
                      <h3 className="text-xl font-bold text-green-300 mb-2">Technologies Used:</h3>
                      <div className="flex flex-wrap gap-2">
                          {project.tech.map((t: any) => <span key={t} className="bg-green-500/20 text-green-300 px-3 py-1 rounded-full text-sm">{t}</span>)}
                      </div>
                  </div>
              );
          default:
              return null;
      }
  };

  return (
      <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-4xl mt-8 text-green-400 font-mono text-lg"
      >
          {renderContent()}
      </motion.div>
  );
});

// --- Terminal Log Component (with scrollable history) ---
const TerminalLog = memo(function TerminalLog({ log, onTypingComplete, lightMode, isTyping }: any) {
  const logRef = useRef<any>(null);
  
  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [log]);

  return (
    <div className="flex flex-col items-start justify-start w-full md:w-1/2 max-w-lg text-left select-none p-4 md:p-0">
      <div 
        ref={logRef}
        className={`w-full max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-green-500/30 scrollbar-track-transparent ${lightMode ? 'scrollbar-thumb-blue-500/30' : ''}`}
        style={{ 
          fontFamily: 'monospace',
          fontSize: '1rem',
          lineHeight: '1.5',
          color: lightMode ? '#2563eb' : '#6ee7b7'
        }}
      >
        {log && log.length > 0 ? log.map((entry: any, index: any) => {
          const isLastEntry = index === log.length - 1;
          const isSystemEntry = entry.type === 'system';
          
          if (isLastEntry && isTyping && isSystemEntry) {
            return (
              <Typewriter
                key={`entry-${index}`}
                text={entry.text || ''}
                speed={10}
                wrapper="div"
                onComplete={onTypingComplete}
                className={`text-2xl lg:text-3xl font-mono tracking-widest ${lightMode ? '' : 'drop-shadow-[0_0_10px_#00ffaa]'}`}
                style={{ 
                  whiteSpace: "pre-line", 
                  display: "block", 
                  lineHeight: "1.5", 
                  fontSize: "1rem",
                  color: lightMode ? '#2563eb' : '#6ee7b7'
                }}
              />
            );
          }
          
          return (
            <div
              key={`entry-${index}`}
              className={`font-mono tracking-widest mb-2 ${lightMode ? '' : 'drop-shadow-[0_0_10px_#00ffaa]'}`}
              style={{ 
                whiteSpace: "pre-line", 
                display: "block", 
                lineHeight: "1.5", 
                fontSize: "1rem",
                color: lightMode ? '#2563eb' : '#6ee7b7'
              }}
            >
              {entry.type === 'user' && <span className="text-green-400">$ </span>}
              {entry.text || ''}
            </div>
          );
        }) : <div className="text-gray-500">No commands yet...</div>}
      </div>
    </div>
  );
});
// --- Neural Blob Component (No changes) ---
const NeuralBlob = memo(function NeuralBlob({ status }: any) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [rotationZ, setRotationZ] = useState(0); 

  const theme = useMemo(() => {
    switch(status) {
        case 'thinking': return { base: "#FFFFFF", glow: "rgba(255, 255, 255, 0.9)", line: "rgba(255, 255, 255, 0.8)", scale: 1.15 };
        case 'processing': return { base: "#FFFFFF", glow: "rgba(255, 255, 255, 0.8)", line: "rgba(255, 255, 255, 0.7)" , scale: 1.1 };
        case 'projects': return { base: "#00FFAA", glow: "rgba(0, 255, 170, 0.6)", line: "rgba(0, 255, 170, 0.4)", scale: 1 };
        case 'intelligence': return { base: "#B469FF", glow: "rgba(180, 105, 255, 0.6)", line: "rgba(180, 105, 255, 0.4)", scale: 1 };
        case 'future': return { base: "#FFDC64", glow: "rgba(255, 220, 100, 0.6)", line: "rgba(255, 220, 100, 0.4)", scale: 1 };
        case 'contact': return { base: "#64B4FF", glow: "rgba(100, 180, 255, 0.6)", line: "rgba(100, 180, 255, 0.4)", scale: 1 };
        case 'experience': return { base: "#00AAFF", glow: "rgba(0, 170, 255, 0.6)", line: "rgba(0, 170, 255, 0.4)", scale: 1 };
        case 'education': return { base: "#3B82F6", glow: "rgba(59, 130, 246, 0.6)", line: "rgba(59, 130, 246, 0.4)", scale: 1 };
        case 'system_status': return { base: "#10B981", glow: "rgba(16, 185, 129, 0.6)", line: "rgba(16, 185, 129, 0.4)", scale: 1 };
        default: return { base: "#00b5e6", glow: "rgba(0, 200, 255, 0.6)", line: "rgba(0, 150, 200, 0.4)", scale: 1 };
    }
  }, [status]);

  useEffect(() => {
    let animationFrameId: any;
    const animateRotation = () => {
      setRotationZ(prevZ => (prevZ + 0.08) % 360); 
      animationFrameId = requestAnimationFrame(animateRotation);
    };
    animationFrameId = requestAnimationFrame(animateRotation);
    return () => cancelAnimationFrame(animationFrameId);
  }, []); 

  const handleMouseMove = (e: any) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePosition({ x, y });
  };

  const { nodes, connections } = useMemo(() => {
    const nodesData: any[] = [];
    const centerX = 240;
    const centerY = 240;
    const radiusOuter = 110;
    const radiusInner = 60;
    const nodeCount = 100;
    for (let i = 0; i < nodeCount; i++) { 
      const phi = Math.acos(2 * Math.random() - 1);
      const theta = 2 * Math.PI * Math.random();
      const baseRadius = i < 50 ? radiusInner : radiusOuter;
      const randomRadius = baseRadius + (Math.random() - 0.5) * 10; 
      const x3d = randomRadius * Math.sin(phi) * Math.cos(theta);
      const y3d = randomRadius * Math.sin(phi) * Math.sin(theta);
      const z3d = randomRadius * Math.cos(phi);
      const x3dNoisy = x3d + (Math.random() - 0.5) * 5;
      const y3dNoisy = y3d + (Math.random() - 0.5) * 5;
      const z3dNoisy = z3d + (Math.random() - 0.5) * 5;
      const perspective = 300; 
      const x = centerX + (x3dNoisy * perspective) / (perspective + z3dNoisy);
      const y = centerY + (y3dNoisy * perspective) / (perspective + z3dNoisy);
      nodesData.push({ id: i, x, y, x3d: x3dNoisy, y3d: y3dNoisy, z3d: z3dNoisy, size: 4.5 });
    }
    const connectionsData: any[] = [];
    const connectionThreshold = 95;
    nodesData.forEach((node, i) => {
      nodesData.forEach((otherNode, j) => {
        if (i > j) { 
          const distance3d = Math.sqrt(Math.pow(node.x3d - otherNode.x3d, 2) + Math.pow(node.y3d - otherNode.y3d, 2) + Math.pow(node.z3d - otherNode.z3d, 2));
          if (distance3d < connectionThreshold && Math.random() > 0.1) { 
            connectionsData.push({ from: node, to: otherNode, opacity: Math.max(0.3, 1 - distance3d / connectionThreshold) });
          }
        }
      });
    });
    return { nodes: nodesData, connections: connectionsData };
  }, []);

  return (
    <div className="w-full flex items-center justify-center p-4 md:p-8" onMouseMove={handleMouseMove} style={{ minHeight: '500px' }}>
      <motion.div
        className="relative flex items-center justify-center transition-all duration-500 ease-out"
        style={{ width: '480px', height: '480px', maxWidth: '90vw', maxHeight: '90vw' }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: theme.scale, rotate: rotationZ }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
      >
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 480 480" preserveAspectRatio="xMidYMid meet">
          {connections.map((connection, i) => {
            const fromX = connection.from.x;
            const fromY = connection.from.y;
            const toX = connection.to.x;
            const toY = connection.to.y;
            const distance = Math.sqrt(Math.pow(fromX - mousePosition.x, 2) + Math.pow(fromY - mousePosition.y, 2));
            const proximity = Math.max(0, 1 - distance / 100); 
            return (
              <motion.line
                key={i}
                x1={fromX} y1={fromY}
                x2={toX} y2={toY}
                stroke={theme.line}
                strokeWidth={1.0 + proximity * 1.5} 
                opacity={connection.opacity + proximity * 0.3}
                animate={{ 
                    stroke: [theme.line, theme.glow, theme.line], 
                    opacity: [connection.opacity, 0.7, connection.opacity], 
                }}
                transition={{ 
                    duration: 3.5 + Math.random() * 1.5, 
                    repeat: Infinity,
                    repeatType: "loop",
                    delay: Math.random() * 5, 
                    ease: "easeInOut", 
                }}
              />
            );
          })}
        </svg>
        {nodes.map((node, i) => {
          const distance = Math.sqrt(Math.pow(node.x - mousePosition.x, 2) + Math.pow(node.y - mousePosition.y, 2));
          const proximity = Math.max(0, 1 - distance / 100);
          const depth = (node.z3d + 100) / 200; 
          const size3d = node.size * (0.4 + depth * 0.6); 
          const opacity3d = 0.3 + depth * 0.7; 
          const glow3d = 5 + depth * 20; 
          return (
            <motion.div
              key={node.id}
              className="absolute rounded-full"
              style={{
                left: node.x - size3d / 2,
                top: node.y - size3d / 2,
                width: size3d,
                height: size3d,
                boxShadow: `0 0 ${glow3d + proximity * 15}px ${theme.glow}`, 
                backgroundColor: theme.base, 
                zIndex: Math.round(depth * 100), 
              }}
              animate={{
                scale: [ (1 + proximity * 0.3) * (0.8 + depth * 0.4), (1 + proximity * 0.3) * (1.1 + depth * 0.4), (1 + proximity * 0.3) * (0.8 + depth * 0.4) ],
                opacity: [ (0.7 + proximity * 0.2) * opacity3d, (1.0 + proximity * 0.2) * opacity3d, (0.7 + proximity * 0.2) * opacity3d ],
                x: [0, Math.sin(i * 0.5 + rotationZ * 0.5) * 1.5, 0], 
                y: [0, Math.cos(i * 0.5 + rotationZ * 0.5) * 1.5, 0], 
              }}
              transition={{
                duration: 4 + Math.random(), 
                repeat: Infinity,
                ease: "easeInOut",
                delay: Math.random() ,
              }}
            />
          );
        })}
      </motion.div>
    </div>
  );
});

// --- AI Agent (UPDATED to call the backend API) ---
const invokeAIAgent = async (prompt: any, history: any) => {
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
        return { stream: response.body }; // Return the stream directly
    } catch (error) {
        console.error("Failed to invoke AI Agent:", error);
        return { responseText: "System Error: Cognitive core is offline." };
    }
};
const ContactForm = () => {
  // State to hold the message from the textarea
  const [message, setMessage] = useState('');

  const handleSendMessage = (e: any) => {
      // Prevents the browser from reloading the page
      e.preventDefault();

      // Ensure the message isn't empty before sending
      if (!message.trim()) {
          alert("Please type a message first.");
          return;
      }

      // Professional subject line
      const subject = "Message from Portfolio Contact Form";
      
      // Use encodeURIComponent to ensure the message content is properly formatted for the URL
      const mailtoLink = `mailto:DivyanshKanodia11@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
      
      // Trigger the user's default email client
      window.location.href = mailtoLink;
  };

  return (
      <form onSubmit={handleSendMessage} className="w-full mt-4">
          <textarea
              className="w-full h-32 p-2 bg-gray-900 border border-green-500 text-green-400 focus:outline-none focus:ring-2 focus:ring-green-500 rounded-md transition-all duration-300 ease-in-out"
              placeholder="Type your message here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
          />
          <button
              type="submit"
              className="mt-4 px-6 py-2 bg-green-600 text-black font-bold rounded-md hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75 transition-colors duration-300"
          >
              Send Message
          </button>
      </form>
  );
};

// --- Main App Component ---
export default function Home() {
  const [booted, setBooted] = useState(false);
  const [log, setLog] = useState([{ type: 'system', text: "Welcome, Visitor.\nDK-01 Cognitive Interface active.\n\n> [ Awaiting command... ]" }]);
  const [forceShowInput, setForceShowInput] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [activeContent, setActiveContent] = useState<any>(null);
  const [aiStatus, setAiStatus] = useState('idle');
  const [isTyping, setIsTyping] = useState(true);
  const [isThinking, setIsThinking] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [experience, setExperience] = useState<any[]>([]);
  const [education, setEducation] = useState<any>(null);
  const [lightMode, setLightMode] = useState(false);
  const [matrixActive, setMatrixActive] = useState(false);
  const [gameActive, setGameActive] = useState(false);
  const [commandHistory, setCommandHistory] = useState<any[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  useEffect(() => {
    setProjects(getProjects());
    setExperience(getExperience());
    setEducation(getEducation());
    
    // Load persistent settings
    const savedTheme = localStorage.getItem('theme');
    const savedName = localStorage.getItem('userName');
    
    if (savedTheme) {
      setLightMode(savedTheme === 'light');
    }
    
    if (savedName) {
      setLog([{ type: 'system', text: `Welcome back, ${savedName}.\nDK-01 Cognitive Interface active.\n\n> [ Awaiting command... ]` }]);
    }
  }, []);

  // PRIMARY FIX: This effect triggers after booting to display the welcome message.
  useEffect(() => {
    if (booted) {
      // Log is already set in the previous useEffect
      setIsTyping(true);
      // Force show input after 5 seconds as fallback
      const fallbackTimer = setTimeout(() => {
        setIsTyping(false);
        setForceShowInput(true);
      }, 5000);
      return () => clearTimeout(fallbackTimer);
    }
  }, [booted]);

  const handleTypingComplete = useCallback(() => {
    setIsTyping(false);
  }, []);

  const handleCommand = useCallback(async (command: any) => {
    // Add user command to log and history
    setLog(prev => [...prev, { type: 'user', text: command }]);
    setCommandHistory(prev => [...prev, command]);
    
    setIsTyping(true);
    setIsThinking(true);
    setAiStatus('thinking');
    setActiveContent(null);
    
    const userMessage = { role: 'user', content: command };
    
    // Handle special commands locally first
    if (command.toLowerCase() === 'clear' || command.toLowerCase() === 'clear console') {
      setLog([{ type: 'system', text: "Console cleared.\n> [ System ready. Awaiting command... ]" }]);
      setIsThinking(false);
      setIsTyping(false);
      setAiStatus('idle');
      return;
    }
    
    if (command.toLowerCase().startsWith('set name ')) {
      const name = command.substring(9).trim();
      if (name) {
        localStorage.setItem('userName', name);
        setLog(prev => [...prev, { type: 'ai', text: `Name set to "${name}". Welcome, ${name}!` }]);
        setIsThinking(false);
        setIsTyping(false);
        setAiStatus('idle');
        return;
      }
    }
    
    // Pass the most up-to-date history to the agent for better context
    const { stream, responseText: errorText } = await invokeAIAgent(command, [...conversationHistory, userMessage]);
    
    if (errorText) {
        setLog(prev => [...prev, { type: 'ai', text: errorText }]);
        setIsThinking(false);
        setIsTyping(false);
        setAiStatus('idle');
        return;
    }
    
    if (!stream) {
        throw new Error('No stream received');
    }
    
    let aiResponseText = "";
    const reader = stream.getReader();
    const decoder = new TextDecoder('utf-8', { fatal: false, ignoreBOM: true });
    let lastUpdateTime = 0;
    const UPDATE_INTERVAL = 50; // Update at most every 50ms

    // Start streaming the response
    setIsThinking(false); // Stop "thinking" status as soon as the stream begins
    try {
    while (true) {
        const { value, done } = await reader.read();
            if (done) {
                // Flush any remaining data
                const remainingText = decoder.decode();
                if (remainingText) {
                    aiResponseText += remainingText;
                }
                // Final update - add AI response to log
                setLog(prev => [...prev, { type: 'ai', text: aiResponseText }]);
                break;
            }
            
            if (value) {
        const decodedChunk = decoder.decode(value, { stream: true });
                if (decodedChunk) {
        aiResponseText += decodedChunk;
                    
                    // Throttle updates to prevent excessive re-renders
                    const now = Date.now();
                    if (now - lastUpdateTime > UPDATE_INTERVAL) {
                        lastUpdateTime = now;
                    }
                }
            }
        }
        
        // Ensure final state is set - already handled in the loop
    } finally {
        reader.releaseLock();
    }
    
    // Process the final, complete AI response for tool calls
    try {
        const toolCall = JSON.parse(aiResponseText);
        if (toolCall.tool) {
            const action = { type: toolCall.tool, payload: toolCall.argument };

            switch (action.type) {
                case 'show_projects_list':
                    setLog(prev => [...prev, { type: 'ai', text: "Accessing project index... Which project would you like to know more about?" }]);
                    setActiveContent({ type: 'projects' });
                    setAiStatus('projects');
                    break;
                case 'show_project_details':
                    setLog(prev => [...prev, { type: 'ai', text: `Accessing details for ${action.payload}...` }]);
                    setActiveContent({ type: 'specific_project', title: action.payload });
                    setAiStatus('projects');
                    break;
                // ... (add other cases for intelligence, future, contact, etc.)
                case 'show_intelligence':
                    setLog(prev => [...prev, { type: 'ai', text: "Loading intelligence report..." }]);
                    setActiveContent({ type: 'intelligence' });
                    setAiStatus('intelligence');
                    break;
                case 'show_future':
                    setLog(prev => [...prev, { type: 'ai', text: "Compiling future development roadmap..." }]);
                    setActiveContent({ type: 'future' });
                    setAiStatus('future');
                    break;
                case 'show_contact':
                    setLog(prev => [...prev, { type: 'ai', text: "Establishing secure connection... \n\n Convey your message to Divyansh Kanodia in the field below, and he will get back to you as soon as possible... \n\n You may also choose an alternate mode of communication, should it better align with your intent..." }]);
                    setActiveContent({ type: 'contact' });
                    setAiStatus('contact');
                    break;
                case 'show_experience':
                    setLog(prev => [...prev, { type: 'ai', text: "Loading experience timeline... Navigating through professional journey..." }]);
                    setActiveContent({ type: 'experience' });
                    setAiStatus('experience');
                    break;
                case 'show_education':
                case 'show_academics':
                    setLog(prev => [...prev, { type: 'ai', text: "Accessing academic records... Loading educational profile..." }]);
                    setActiveContent({ type: 'education' });
                    setAiStatus('idle');
                    break;
                case 'show_system_status':
                case 'show_dashboard':
                    setLog(prev => [...prev, { type: 'ai', text: "Initializing system diagnostics... Loading live data streams..." }]);
                    setActiveContent({ type: 'system_status' });
                    setAiStatus('idle');
                    break;
                case 'show_creator_info':
                case 'who_are_you':
                     setLog(prev => [...prev, { type: 'ai', text: "Divyansh Kanodia is a Data Science and Business Economics student at UC San Diego who explores the intersection of data, design, and intelligent systems. His work focuses on building applications that think, learn, and adapt — combining analytics, creativity, and usability to solve real-world problems. This space showcases his experiments, projects, and ideas as he continues to explore the future of human–AI collaboration." }]);
                     setAiStatus('idle');
                     break;
                case 'play_a_game':
                    setLog(prev => [...prev, { type: 'ai', text: "Initializing game environment... Loading Digital Maze Adventure..." }]);
                    setGameActive(true);
                    setAiStatus('idle');
                    break;
                case 'matrix':
                    setLog(prev => [...prev, { type: 'ai', text: "Activating Matrix protocol... Entering the digital realm..." }]);
                    setMatrixActive(true);
                    setAiStatus('idle');
                    break;
                case 'clear_console':
                    setLog([{ type: 'system', text: "Console cleared.\n> [ System ready. Awaiting command ... ]" }]);
                    setActiveContent(null);
                    setAiStatus('idle');
                    break;
                case 'toggle_light_mode':
                    const newLightMode = !lightMode;
                    setLightMode(newLightMode);
                    localStorage.setItem('theme', newLightMode ? 'light' : 'dark');
                    setLog(prev => [...prev, { type: 'ai', text: newLightMode 
                        ? "Activating light mode... \n> [ Theme switched to light mode ]"
                        : "Activating dark mode... \n> [ Theme switched to dark mode ]" }]);
                    setAiStatus('idle');
                    break;
                case 'show_help':
                    setLog(prev => [...prev, { type: 'ai', text: "Loading command reference..." }]);
                    setActiveContent({ type: 'help' });
                    setAiStatus('idle');
                    break;
                default:
                     setLog(prev => [...prev, { type: 'ai', text: "Command not recognized. Type 'help' for a list of available commands." }]);
                     setAiStatus('idle');
                     break;
            }
        } else {
             setAiStatus('idle'); // It was valid JSON, but not a tool call.
        }
    } catch {
        // Not a JSON object, so it's a standard text response.
        setAiStatus('idle');
    }
    
    setConversationHistory(prev => [...prev, userMessage, { role: 'ai', content: aiResponseText }]);
    setIsTyping(false); // <-- ADD THIS LINE HERE
  }, [conversationHistory, lightMode]);

  const loadingText = "\n DK-01 SYSTEM INITIALIZATION\n> Loading core modules...\n> Calibrating sensors...\n> Establishing connection...\n> Boot sequence complete... \n> System ready...";

  return (
    <div className={`min-h-screen w-screen font-mono relative ${lightMode ? 'bg-white text-gray-800' : 'bg-black text-green-400'}`}>
        {/* Theme Toggle Button - Minimalist */}
        <button
          onClick={() => setLightMode(!lightMode)}
          className="fixed top-4 right-4 z-50 p-2 rounded-full transition-all duration-300 hover:opacity-70"
          style={{
            color: lightMode ? '#000' : '#00ff00',
          }}
        >
          {lightMode ? '☀️' : '🌙'}
        </button>
        
        <style>{`.blinking-cursor { animation: blink 1s step-end infinite; } @keyframes blink { 50% { opacity: 0; } }`}</style>
        <div className="fixed inset-0 opacity-20 pointer-events-none z-0">
            {!lightMode && <BackgroundNoise />}
            <div className={`grid grid-cols-10 md:grid-cols-20 grid-rows-10 md:grid-rows-20 h-full w-full ${lightMode ? 'border-gray-300/30' : 'border-green-500/30'}`}>
                {Array.from({ length: 400 }).map((_, i) => (
                    <motion.div
                    key={i}
                    className={`border ${lightMode ? 'border-gray-300' : 'border-green-500/30'}`}
                    animate={{ opacity: [0.1, 0.3, 0.1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: Math.random() * 2 }}
                    />
                ))}
            </div>
        </div>
        <AnimatePresence mode="wait">
            {!booted ? (
                <motion.div key="loading" exit={{ opacity: 0 }} className="w-full h-full flex items-center justify-center p-4">
                    <Typewriter
                        text={loadingText}
                        speed={10}
                        onComplete={() => setTimeout(() => setBooted(true), 500)}
                        className="text-green-400 font-mono"
                        style={{ whiteSpace: "pre-line", display: "block", color: "#00ff00", textShadow: "0 0 5px #00ff00" }}
                    />
                </motion.div>
            ) : (
                <motion.div
                    key="main"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-start min-h-screen relative z-10 p-4 md:p-12 lg:p-20"
                    style={{ position: 'relative' }}
                >
                    <div className="flex flex-col-reverse md:flex-row items-start justify-center w-full max-w-7xl mx-auto gap-8 md:gap-12">
                        <div className="w-full md:w-1/2 flex flex-col items-center md:items-start">
                            <TerminalLog log={log} onTypingComplete={handleTypingComplete} lightMode={lightMode} isTyping={isTyping} />
                            {activeContent !== null && activeContent.type === 'contact' && (
                              <ContactForm/>
                            )}
                            <AnimatePresence>
                                {(!isTyping || forceShowInput) && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                    >
                                        <CommandInterface 
                                          onCommand={handleCommand} 
                                          disabled={isThinking} 
                                          isThinking={isThinking} 
                                          lightMode={lightMode}
                                          commandHistory={commandHistory}
                                          historyIndex={historyIndex}
                                          onHistoryChange={setHistoryIndex}
                                        />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                        <div className="w-full md:w-1/2 flex items-center justify-center">
                            <NeuralBlob status={aiStatus} />
                        </div>
                    </div>
                    <ContentDisplay content={activeContent} projects={projects} experience={experience} education={education} lightMode={lightMode} />
                </motion.div>
            )}
        </AnimatePresence>
        
        {/* Easter Egg Components */}
        <MatrixRain 
          isActive={matrixActive} 
          onComplete={() => setMatrixActive(false)} 
        />
        <TextAdventure 
          isActive={gameActive} 
          onComplete={() => setGameActive(false)} 
        />
    </div>
  );
}