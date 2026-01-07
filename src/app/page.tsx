"use client";

import { useEffect, useState, useMemo, useRef, memo, useCallback, lazy, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Github, Linkedin, Mail, Search, Download, Copy } from 'lucide-react';
import { getProjects } from '../lib/projects';
import { getExperience } from '../lib/experience';
import { getEducation } from '../lib/education';

// --- COMPONENT IMPORTS ---
import { NeuralBlob } from "@/components/neural/NeuralBlob";
import { ContactForm } from "@/components/forms/ContactForm";
import { BackgroundNoise } from "@/components/effects/BackgroundNoise";
import { Typewriter } from "@/components/terminal/Typewriter";
import { TerminalLog } from "@/components/terminal/TerminalLog";
import { CommandInterface } from "@/components/terminal/CommandInterface";
import { ToastContainer } from "@/components/ui/Toast";
import { SearchModal } from "@/components/ui/SearchModal";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { PortfolioAnalytics } from "@/components/dataScience/PortfolioAnalytics";
import { useTranslation } from "@/lib/i18n/useTranslation";

// Lazy load heavy components
const MatrixRain = lazy(() => import("@/components/effects/matrixRain").then(m => ({ default: m.MatrixRain })));
const TextAdventure = lazy(() => import("@/components/page_componenets/TextAdventure").then(m => ({ default: m.TextAdventure })));
const SystemStatusDashboard = lazy(() => import("@/components/page_componenets/SystemStatus").then(m => ({ default: m.SystemStatusDashboard })));

// --- HOOK & TYPE IMPORTS ---
import { 
  AIStatus, 
  LogEntry, 
  ChatMessage, 
  Project, 
  Experience, 
  Education,
  ContentDisplayProps,
  SearchResult,
} from '@/types';
import { showToast } from '@/lib/utils/toast';
import { exportConversation, downloadText, copyToClipboard } from '@/lib/utils/export';
import { time } from "console";

interface TimelineBikeProps {
  experience: Experience[];
}

const TimelineBike = memo(function TimelineBike({ experience }: TimelineBikeProps) {
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
        {experience.map((exp: Experience, index: number) => {
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
                    {exp.tech.map((tech: string) => (
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
              return (
                <Suspense fallback={<div className="text-center p-8">Loading system status...</div>}>
                  <SystemStatusDashboard lightMode={lightMode} />
                </Suspense>
              );
          case 'analytics':
              return (
                <PortfolioAnalytics
                  projects={projects}
                  experience={experience}
                  education={education}
                  lightMode={lightMode}
                />
              );
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
                    A map of Divyansh’s operating system — where machine learning, economics, and systems thinking converge. Each layer reflects applied research, engineering rigor, and strategic decision-making.
                  </p>
              
                  <ul className="list-disc list-inside mt-6 space-y-2">
                    <li>
                      <span className="font-bold text-purple-300">Machine Learning & Data Science:</span>
                      TensorFlow, Keras, scikit-learn, Pandas, NumPy, and Matplotlib; end-to-end ML workflows from feature engineering to evaluation.
                    </li>
                    <li>
                      <span className="font-bold text-purple-300">Reinforcement Learning:</span>
                      Q-learning, Min-Max search, policy iteration, and simulation design for decision-making under uncertainty.
                    </li>
                    <li>
                      <span className="font-bold text-purple-300">Programming & Development:</span>
                      Python, Java, JavaScript (Node.js, Express.js), MATLAB, SQL, and PHP; REST API design and algorithmic problem-solving.
                    </li>
                    <li>
                      <span className="font-bold text-purple-300">Web Development:</span>
                      React, HTML/CSS, and B2C frameworks for production web systems.
                    </li>
                    <li>
                      <span className="font-bold text-purple-300">Databases:</span>
                      SQL and NoSQL (MongoDB) for transactional and analytical workloads.
                    </li>
                    <li>
                      <span className="font-bold text-purple-300">Tools & Deployment:</span>
                      Git, Docker, AWS, Digital Ocean, CI/CD pipelines, and asynchronous programming patterns.
                    </li>
                    <li>
                      <span className="font-bold text-purple-300">Econometrics & Analysis:</span>
                      Statistical modeling, econometric analysis, and optimization for labor market and policy datasets.
                    </li>
                    <li>
                      <span className="font-bold text-purple-300">Research & Simulation:</span>
                      MATLAB simulations for robotics + LLM integration; game-theoretic reasoning for strategic systems.
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
                    Beyond logic lies intention — connecting insight with impact. This layer blends human contexts (economics, policy, teamwork) with technical systems (LLMs, robotics, analytics).
                  </p>
              
                  <ul className="list-disc list-inside mt-6 space-y-2">
                    <li>
                      <span className="font-bold text-purple-300">Interdisciplinary Thinking:</span>
                      Bridging AI, economics, and robotics to design systems that reason, adapt, and align with human goals.
                    </li>
                    <li>
                      <span className="font-bold text-purple-300">Human-AI Interaction:</span>
                      Translating natural language instructions into actions, focusing on explainability and decision support.
                    </li>
                    <li>
                      <span className="font-bold text-purple-300">Simulation & Strategy:</span>
                      Using game theory and simulation to test policies, incentives, and robotic behaviors under uncertainty.
                    </li>
                    <li>
                      <span className="font-bold text-purple-300">Ethics & Impact:</span>
                      Responsible deployment of AI systems with attention to incentives, transparency, and real-world outcomes.
                    </li>
                  </ul>
                </div>
              
              </div>
              
               );
          case 'future':
              return (
                  <div>
                      <h2 className="text-3xl font-bold mb-4 text-yellow-200">Future</h2>
                      <p>Focused on reinforcement learning for decision-making, LLM-enabled robotics, and economic modeling of incentives. Exploring how autonomous systems can operate transparently in complex, uncertain environments.</p>
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
                          <a href="mailto:jobs.divyansh@gmail.com" className="text-blue-300 hover:text-blue-100 transition-colors"><Mail size={36} /></a>
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

// --- Main App Component ---
export default function Home() {
  const { t } = useTranslation();
  const [booted, setBooted] = useState(false);
  const [forceShowInput, setForceShowInput] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [activeContent, setActiveContent] = useState<ContentDisplayProps | null>(null);
  const [showSearch, setShowSearch] = useState(false);
  
  // We manage this state locally now
  const [log, setLog] = useState<LogEntry[]>([]);
  const [conversationHistory, setConversationHistory] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false); // Start false
  const [isThinking, setIsThinking] = useState(false);
  const [aiStatus, setAiStatus] = useState<AIStatus>('idle');
  const [streamingResponse, setStreamingResponse] = useState<string | undefined>(undefined);
  
  // --- These states are for UI and data, not chat logic ---
  const [projects, setProjects] = useState<Project[]>([]);
  const [experience, setExperience] = useState<Experience[]>([]);
  const [education, setEducation] = useState<Education | null>(null);
  const [lightMode, setLightMode] = useState(false);
  const [matrixActive, setMatrixActive] = useState(false);
  const [gameActive, setGameActive] = useState(false);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const [isClient, setIsClient] = useState(false);
  useEffect(() => { setIsClient(true); }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + K for search
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setShowSearch(true);
      }
      // Ctrl/Cmd + E for export
      if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
        e.preventDefault();
        handleExportConversation();
      }
      // Ctrl/Cmd + L for clear
      if ((e.ctrlKey || e.metaKey) && e.key === 'l') {
        e.preventDefault();
        setLog([{ type: 'system', text: 'Console cleared. \n> [ Awaiting command... ]' }]);
        setConversationHistory([]);
      }
      // Escape to close modals
      if (e.key === 'Escape') {
        setShowSearch(false);
        setShowHistory(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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
      setLog([{ type: 'system', text: `Welcome back, ${savedName}.\nDK-01 Cognitive Interface active.\n\n> ${t('awaitingCommand')}` }]);
    } else {
      // Default welcome message if no name is saved
      setLog([{ type: 'system', text: `${t('welcome')}\nDK-01 Cognitive Interface active.\n\n> ${t('awaitingCommand')}` }]);
    }
  }, []); // Empty dependency array, runs once

  // Export and utility functions
  const handleExportConversation = useCallback(() => {
    const content = exportConversation(log);
    downloadText(content, `dk-01-conversation-${Date.now()}.txt`);
    showToast(t('conversationExported'), 'success');
  }, [log, t]);

  const handleCopyLog = useCallback(async () => {
    const content = exportConversation(log);
    await copyToClipboard(content);
    showToast(t('conversationCopied'), 'success');
  }, [log, t]);

  const handleSearchResult = useCallback((result: SearchResult) => {
    if (result.type === 'project') {
      setActiveContent({ type: 'specific_project', title: (result.data as Project).title });
      setAiStatus('projects');
    } else if (result.type === 'experience') {
      setActiveContent({ type: 'experience' });
      setAiStatus('experience');
    } else if (result.type === 'education') {
      setActiveContent({ type: 'education' });
      setAiStatus('education');
    }
    showToast(`Navigated to ${result.title}`, 'info');
  }, []);

  // This effect triggers after booting to display the welcome message.
  useEffect(() => {
    if (booted) {
      // Set to true to type out the welcome message
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
  }, []); // No dependencies

  // --- REFACTORED handleCommand for LANGGRAPH ---
  const handleCommand = useCallback(
    async (command: string) => {
      setCommandHistory((prev) => [...prev, command]);
      setLog((prev) => [...prev, { type: 'user', text: command }]);


      setActiveContent(null);
      
      setIsThinking(true);
      setAiStatus('thinking');
      setStreamingResponse(undefined); 

      // Create user message for conversation history
      const userMessage: ChatMessage = { role: 'user', content: command };

      // --- API call with proper conversation history ---
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          history: conversationHistory,
          prompt: command,
        }),
        cache: 'no-store'
      });

      console.log(response);
      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = 'Error: Failed to connect to cognitive core.';
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.error || errorMessage;
        } catch {
          // Use default error message
        }
        
        setLog((prev) => [
          ...prev,
          { type: 'ai', text: errorMessage },
        ]);
        showToast(errorMessage, 'error');
        setIsThinking(false);
        setAiStatus('idle');
        return;
      }

      const { text_response, ui_update, ai_message } = await response.json();
      console.log("text_response:", text_response);
      console.log("ui_update:", ui_update);
      console.log("ai_message:", ai_message);

      // 1. Always add the AI's text response to the log (even if empty, we'll show a default)
      // If text_response exists and is not empty, use it. Otherwise, provide a contextual message.
      let displayText = text_response;
      if (!displayText || displayText.trim() === '') {
        // Provide default messages based on the tool being called
        if (ai_message?.tool_calls && ai_message.tool_calls.length > 0) {
          const toolName = ai_message.tool_calls[0].name;
          const toolMessages: { [key: string]: string } = {
            'show_projects_list': 'Accessing project index...',
            'show_project_details': 'Retrieving project details...',
            'show_intelligence': 'Loading intelligence data...',
            'show_experience': 'Accessing experience records...',
            'show_education': 'Retrieving education history...',
            'show_system_status': 'Loading system status...',
            'show_contact': 'Opening contact interface...',
            'show_help': 'Displaying help information...',
            'play_a_game': 'Initializing game...',
            'matrix': 'Activating Matrix effect...',
            'clear_console': 'Clearing console...',
            'toggle_light_mode': 'Toggling theme...',
            'show_analytics': 'Loading portfolio analytics...',
            'show_creator_info': `Divyansh Kanodia (GitHub: anigmea) is a Data Science and Business Economics student at UC San Diego. He works on reinforcement learning projects like Tic Tac Toe Bot and Frozen Lake Solver, researches LLM-enabled robotics and labor market analytics, and builds systems that connect AI with economic strategy. Reach him via LinkedIn or email.`,
          };
          displayText = toolMessages[toolName] || 'Processing request...';
        } else {
          displayText = 'Processing...';
        }
      }
      
      // Always add to log
      setLog((prev) => [...prev, { type: 'ai', text: displayText }]);

      // 2. Update conversation history with both user message and AI message (including tool_calls)
      if (ai_message) {
        setConversationHistory((prev) => [...prev, userMessage, ai_message]);
      } else {
        // Fallback if ai_message is not provided
        setConversationHistory((prev) => [...prev, userMessage, { role: 'ai' as const, content: text_response || displayText }]);
      }
      // 2. Execute the UI update command
      if (ui_update) {
        switch (ui_update.type) {
          case 'setActiveContent':
            setActiveContent(ui_update.payload); // Set new content
            // ... (statusMap logic is fine) ...
            const statusMap: { [key: string]: AIStatus } = {
                'projects': 'projects',
                'specific_project': 'projects',
                'intelligence': 'intelligence',
                'experience': 'experience',
                'education': 'education',
                'system_status': 'system_status',
                'contact': 'contact',
                'analytics': 'analytics',
            };
            if (ui_update.payload?.type in statusMap) {
                setAiStatus(statusMap[ui_update.payload.type]);
            } else {
                setAiStatus('idle');
            }
            break;
          case 'setGameActive':
            setGameActive(ui_update.payload);
            setAiStatus('idle');
            break;
          case 'setMatrixActive':
            await new Promise(resolve => setTimeout(resolve, 500)); // wait 10s
            setMatrixActive(ui_update.payload);
            setAiStatus('idle');
            break;
          case 'clearLog':
            setLog([
              {
                type: 'system',
                text: 'Console cleared. \n> [ Awaiting command... ]',
              },
            ]);
            // Clear conversation history as well
            setConversationHistory([]);
            // activeContent is already null from the top of the function
            setAiStatus('idle');
            break;
          case 'toggleTheme':
            const newLightMode = !lightMode;
            setLightMode(newLightMode);
            localStorage.setItem('theme', newLightMode ? 'light' : 'dark');
            setLog((prev) => [
              ...prev,
              { type: 'ai', text: `Theme set to ${newLightMode ? 'light' : 'dark'} mode.` },
            ]);
            setAiStatus('idle');
            break;
          default:
            setAiStatus('idle');
            break;
        }
      } else {
        // If no ui_update (e.g., simple chat), just stay idle.
        // activeContent is already null from the top of the function.
        setAiStatus('idle');
      }

      setIsThinking(false);
      setIsTyping(false); 
    },
    [conversationHistory, lightMode] // Dependencies - use conversationHistory instead of log
  );

  const loadingText = "\n DK-01 SYSTEM INITIALIZATION\n> Loading core modules...\n> Calibrating sensors...\n> Establishing connection...\n> Boot sequence complete... \n> System ready...";

  return (
    <div className={`min-h-screen w-screen font-mono relative ${lightMode ? 'bg-white text-gray-800' : 'bg-black text-green-400'}`}>
        {/* Toast Container */}
        <ToastContainer lightMode={lightMode} />
        
        {/* Search Modal */}
        <SearchModal
          isOpen={showSearch}
          onClose={() => setShowSearch(false)}
          projects={projects}
          experience={experience}
          education={education}
          lightMode={lightMode}
          onSelectResult={handleSearchResult}
        />

        {/* Top Action Buttons */}
        <div className="fixed top-4 right-4 z-50 flex gap-2 items-center">
          {/* Language Switcher */}
          <LanguageSwitcher lightMode={lightMode} />
          
          {/* Search Button */}
          <button
            onClick={() => setShowSearch(true)}
            className={`p-2 rounded-lg transition-all duration-300 hover:opacity-70 ${
              lightMode
                ? 'bg-blue-100 hover:bg-blue-200 text-blue-700'
                : 'bg-green-900/30 hover:bg-green-900/50 text-green-400'
            }`}
            aria-label={`${t('search')} (Ctrl+K)`}
            title={`${t('search')} (Ctrl+K)`}
          >
            <Search size={20} />
          </button>
          
          {/* Export Button */}
          <button
            onClick={handleExportConversation}
            className={`p-2 rounded-lg transition-all duration-300 hover:opacity-70 ${
              lightMode
                ? 'bg-blue-100 hover:bg-blue-200 text-blue-700'
                : 'bg-green-900/30 hover:bg-green-900/50 text-green-400'
            }`}
            aria-label={`${t('export')} (Ctrl+E)`}
            title={`${t('export')} (Ctrl+E)`}
          >
            <Download size={20} />
          </button>
          
          {/* Copy Button */}
          <button
            onClick={handleCopyLog}
            className={`p-2 rounded-lg transition-all duration-300 hover:opacity-70 ${
              lightMode
                ? 'bg-blue-100 hover:bg-blue-200 text-blue-700'
                : 'bg-green-900/30 hover:bg-green-900/50 text-green-400'
            }`}
            aria-label={t('copy')}
            title={t('copy')}
          >
            <Copy size={20} />
          </button>
          
          {/* Theme Toggle Button */}
          <button
            onClick={() => {
              const newLightMode = !lightMode;
              setLightMode(newLightMode);
              localStorage.setItem('theme', newLightMode ? 'light' : 'dark');
              showToast(t('themeChanged'), 'info');
            }}
            className={`p-2 rounded-lg transition-all duration-300 hover:opacity-70 ${
              lightMode
                ? 'bg-blue-100 hover:bg-blue-200 text-blue-700'
                : 'bg-green-900/30 hover:bg-green-900/50 text-green-400'
            }`}
            aria-label={t('toggleTheme')}
            title={t('toggleTheme')}
          >
            {lightMode ? '☀️' : '🌙'}
          </button>
        </div>
        
        
        <style>{`.blinking-cursor { animation: blink 1s step-end infinite; } @keyframes blink { 50% { opacity: 0; } }`}</style>
        <div className="fixed inset-0 opacity-20 pointer-events-none z-0">
                {!lightMode && isClient && <BackgroundNoise />}            
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
                    {/* Neural Blob - Centered at top */}
                    <div className="flex justify-center w-full mb-8">
                        <NeuralBlob status={aiStatus as AIStatus} />
                    </div>

                    {/* History Toggle Button */}
                    <motion.button
                        onClick={() => setShowHistory(!showHistory)}
                        className={`fixed top-20 left-4 z-40 px-4 py-2 rounded-lg border transition-all duration-300 ${
                            lightMode 
                                ? 'bg-blue-50 border-blue-300 text-blue-700 hover:bg-blue-100' 
                                : 'bg-black/80 border-green-500/50 text-green-400 hover:bg-green-500/10'
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        {showHistory ? '✕ Close History' : '📜 View History'}
                    </motion.button>

                    {/* History Panel - Sliding from right */}
                    <AnimatePresence>
                        {showHistory && (
                            <motion.div
                                initial={{ x: '0%' }}
                                animate={{ x: 0 }}
                                exit={{ x: '0%' }}
                                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                                className={`fixed top-0 left-0 h-full w-full md:w-96 z-50 ${
                                    lightMode ? 'bg-white border-l border-blue-300' : 'bg-black/95 border-l border-green-500/50'
                                } shadow-2xl overflow-y-auto p-6`}
                            >
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className={`text-xl font-bold ${lightMode ? 'text-blue-700' : 'text-green-300'}`}>
                                        Command History
                                    </h2>
                                    <button
                                        onClick={() => setShowHistory(false)}
                                        className={`px-3 py-1 rounded ${
                                            lightMode 
                                                ? 'hover:bg-blue-100 text-blue-700' 
                                                : 'hover:bg-green-500/10 text-green-400'
                                        }`}
                                    >
                                        ✕
                                    </button>
                                </div>
                                <TerminalLog 
                                  log={log} 
                                  onTypingComplete={handleTypingComplete} 
                                  lightMode={lightMode} 
                                  isTyping={isTyping}
                                  streamingResponse={streamingResponse} // <-- Pass the live stream
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* === ADDED MAIN SCREEN LOG === */}
                    <div className={`w-full max-w-3xl h-96 overflow-y-auto mb-4 p-4 rounded-lg border ${
                        lightMode 
                            ? 'bg-white/80 border-blue-300' 
                            : 'bg-black/80 border-green-500/50'
                    } backdrop-blur-sm`}>
                        <TerminalLog 
                          log={log} 
                          onTypingComplete={handleTypingComplete} 
                          lightMode={lightMode} 
                          isTyping={isTyping}
                          streamingResponse={streamingResponse}
                        />
                    </div>
                    {/* === END OF NEW BLOCK === */}

                    {/* Contact Form if active */}
                    {activeContent !== null && activeContent.type === 'contact' && (
                        <div className="w-full max-w-2xl mx-auto mb-8">
                            <ContactForm/>
                        </div>
                    )}

                    {/* Centered Command Input - FIXED positioning */}
                    <div className="w-full max-w-3xl px-4 z-30">
                        <AnimatePresence>
                            {(!isTyping || forceShowInput) && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 20 }}
                                    className={`rounded-2xl shadow-2xl ${
                                        lightMode 
                                            ? 'bg-white border-2 border-blue-300' 
                                            : 'bg-black/90 border-2 border-green-500/50'
                                    } backdrop-blur-lg p-4`}
                                >
                                    <CommandInterface 
                                        onCommand={handleCommand} 
                                        disabled={isThinking} // <-- Simplified
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
                    <ContentDisplay content={activeContent} projects={projects} experience={experience} education={education} lightMode={lightMode} />
                </motion.div>
            )}
        </AnimatePresence>
        
        {/* Easter Egg Components - Lazy Loaded */}
        <Suspense fallback={null}>
          {matrixActive && (
            <MatrixRain 
              isActive={matrixActive} 
              onClick={() => setMatrixActive(false)}
              onComplete={() => setMatrixActive(false)} 
            />
          )}
        </Suspense>
        <Suspense fallback={null}>
          {gameActive && (
            <TextAdventure 
              isActive={gameActive} 
              onComplete={() => setGameActive(false)} 
            />
          )}
        </Suspense>
    </div>
  );
}