"use client";

import { useEffect, useState, useMemo, useRef, memo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Github, Linkedin, Mail } from 'lucide-react';
import { getProjects } from '../lib/projects'; // NEW: Import data accessor

// --- Custom Typewriter Component (No changes) ---
function Typewriter({ text, speed = 50, delay = 0, onComplete, className, wrapper = 'div', style }) {
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
    let timeoutId;
    const delayId;

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
    delayId = setTimeout(startTyping, delay);
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
const noiseCount = 120;

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

// --- Command Interface Component (No changes) ---
function CommandInterface({ onCommand, disabled, isThinking }) {
  const [input, setInput] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (!disabled && !isThinking) {
      inputRef.current?.focus();
    }
  }, [disabled, isThinking]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && !disabled && !isThinking) {
      onCommand(input.trim());
      setInput('');
    }
  };

  return (
    <div className="w-full max-w-lg mt-4">
      <form onSubmit={handleSubmit} className="flex items-center">
        <span className="text-green-300 text-2xl lg:text-3xl font-mono tracking-widest mr-2">{'>'}</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-grow bg-transparent border-none text-green-300 text-2xl lg:text-3xl font-mono tracking-widest focus:outline-none placeholder-green-500/50"
          placeholder={isThinking ? "Thinking..." : (disabled ? "Processing..." : "Ask me anything...")}
          disabled={disabled || isThinking}
          autoFocus
        />
      </form>
    </div>
  );
}
// --- Content Display Component (UPDATED to accept props) ---
const ContentDisplay = memo(function ContentDisplay({ content, projects }) {
    if (!content) return null;
    const renderContent = () => {
      switch(content.type) {
          case 'projects':
              return (
                  <div>
                      <h2 className="text-3xl font-bold mb-4 text-green-200">Projects</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {projects.map(p => (
                              <a href={p.link} key={p.title} className="border border-green-500/50 p-4 rounded-lg hover:bg-green-500/10 transition-colors block">
                                  <h3 className="text-xl font-bold text-green-300">{p.title}</h3>
                                  <p className="text-green-400 mt-1">{p.description}</p>
                              </a>
                          ))}
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
          case 'specific_project':
              const project = projects.find(p => p.keywords.some(k => content.title.toLowerCase().includes(k)));
              if (!project) return <p>Project not found.</p>;
              return (
                   <div>
                      <h2 className="text-3xl font-bold mb-4 text-green-200">{project.title}</h2>
                      <p className="mb-4">{project.description}</p>
                      <h3 className="text-xl font-bold text-green-300 mb-2">Technologies Used:</h3>
                      <div className="flex flex-wrap gap-2">
                          {project.tech.map(t => <span key={t} className="bg-green-500/20 text-green-300 px-3 py-1 rounded-full text-sm">{t}</span>)}
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

// --- Text Display Component (No changes) ---
const TextDisplay = memo(function TextDisplay({ output, onTypingComplete }) {
  return (
      <motion.div
          className="flex flex-col items-start justify-center w-full md:w-1/2 max-w-lg text-left select-none p-4 md:p-0"
      >
          <Typewriter
              key={output}
              text={output}
              speed={30}
              wrapper="div"
              onComplete={onTypingComplete}
              style={{ whiteSpace: "pre-line", display: "block", lineHeight: "1.5", fontSize: "1rem" }}
              className="text-2xl lg:text-3xl font-mono text-green-300 tracking-widest drop-shadow-[0_0_10px_#00ffaa] min-h-[180px]"
          />
      </motion.div>
  );
});
// --- Neural Blob Component (No changes) ---
const NeuralBlob = memo(function NeuralBlob({ status }) {
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
        default: return { base: "#00b5e6", glow: "rgba(0, 200, 255, 0.6)", line: "rgba(0, 150, 200, 0.4)", scale: 1 };
    }
  }, [status]);

  useEffect(() => {
    let animationFrameId;
    const animateRotation = () => {
      setRotationZ(prevZ => (prevZ + 0.08) % 360); 
      animationFrameId = requestAnimationFrame(animateRotation);
    };
    animationFrameId = requestAnimationFrame(animateRotation);
    return () => cancelAnimationFrame(animationFrameId);
  }, []); 

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePosition({ x, y });
  };

  const { nodes, connections } = useMemo(() => {
    const nodesData = [];
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
    const connectionsData = [];
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
    <div className="w-full md:w-1/2 flex items-center justify-center p-4" onMouseMove={handleMouseMove}>
      <motion.div
        className="relative w-[30rem] h-[30rem] flex items-center justify-center transition-all duration-500 ease-out"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: theme.scale, rotate: rotationZ }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
      >
        <svg className="absolute inset-0 w-full h-full">
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
const invokeAIAgent = async (prompt, history) => {
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

  const handleSendMessage = (e) => {
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
  const [output, setOutput] = useState("");
  const [activeContent, setActiveContent] = useState(null);
  const [aiStatus, setAiStatus] = useState('idle');
  const [isTyping, setIsTyping] = useState(true);
  const [isThinking, setIsThinking] = useState(false);
  const [conversationHistory, setConversationHistory] = useState([]);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    setProjects(getProjects());
  }, []);

  // PRIMARY FIX: This effect triggers after booting to display the welcome message.
  useEffect(() => {
    if (booted) {
      setOutput("Welcome, Visitor.\nDK-01 Cognitive Interface active.\n\n> [ Awaiting command... ]");
      // The `isTyping` state is already `true`, so the Typewriter will start automatically.
    }
  }, [booted]);

  const handleTypingComplete = useCallback(() => {
    setIsTyping(false);
  }, []);

  const handleCommand = useCallback(async (command) => {
    setIsTyping(true);
    setIsThinking(true);
    setAiStatus('thinking');
    setActiveContent(null);
    
    const userMessage = { role: 'user', content: command };
    const promptText = `> ${command}\n\n`;
    setOutput(promptText); // Immediately show the user's command
    
    // Pass the most up-to-date history to the agent for better context
    const { stream, responseText: errorText } = await invokeAIAgent(command, [...conversationHistory, userMessage]);
    
    if (errorText) {
        setOutput(prev => prev + errorText);
        setIsThinking(false);
        setIsTyping(false);
        setAiStatus('idle');
        return;
    }
    
    let aiResponseText = "";
    const reader = stream.getReader();
    const decoder = new TextDecoder();

    // Start streaming the response
    setIsThinking(false); // Stop "thinking" status as soon as the stream begins
    while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const decodedChunk = decoder.decode(value, { stream: true });
        aiResponseText += decodedChunk;
        setOutput(promptText + aiResponseText);
    }
    
    // Process the final, complete AI response for tool calls
    try {
        const toolCall = JSON.parse(aiResponseText);
        if (toolCall.tool) {
            const action = { type: toolCall.tool, payload: toolCall.argument };
            let userFriendlyOutput = promptText;

            switch (action.type) {
                case 'show_projects_list':
                    userFriendlyOutput += "Accessing project index... Which project would you like to know more about?";
                    setActiveContent({ type: 'projects' });
                    setAiStatus('projects');
                    break;
                case 'show_project_details':
                    userFriendlyOutput += `Accessing details for ${action.payload}...`;
                    setActiveContent({ type: 'specific_project', title: action.payload });
                    setAiStatus('projects');
                    break;
                // ... (add other cases for intelligence, future, contact, etc.)
                case 'show_intelligence':
                    userFriendlyOutput += "Loading intelligence report...";
                    setActiveContent({ type: 'intelligence' });
                    setAiStatus('intelligence');
                    break;
                case 'show_future':
                    userFriendlyOutput += "Compiling future development roadmap...";
                    setActiveContent({ type: 'future' });
                    setAiStatus('future');
                    break;
                case 'show_contact':
                    userFriendlyOutput += "Establishing secure connection... \n\n Convey your message to Divyansh Kanodia in the field below, and he will get back to you as soon as possible... \n\n You may also choose an alternate mode of communication, should it better align with your intent...";
                    setActiveContent({ type: 'contact' });
                    setAiStatus('contact');
                    break;
                case 'show_creator_info':
                     userFriendlyOutput += "Divyansh Kanodia is a Data Science and Business Economics student at UC San Diego who explores the intersection of data, design, and intelligent systems. His work focuses on building applications that think, learn, and adapt — combining analytics, creativity, and usability to solve real-world problems. This space showcases his experiments, projects, and ideas as he continues to explore the future of human–AI collaboration.";
                     setAiStatus('idle');
                     break;
                case 'clear_console':
                    userFriendlyOutput = "Console cleared.\n> [ System ready. Awaiting command ... ]";
                    setActiveContent(null);
                    setAiStatus('idle');
                    break;
                default:
                     setAiStatus('idle');
                     break;
            }
            // Overwrite the raw JSON output with the clean, user-friendly text
            setOutput(userFriendlyOutput); 
        } else {
             setAiStatus('idle'); // It was valid JSON, but not a tool call.
        }
    } catch (e) {
        // Not a JSON object, so it's a standard text response.
        setAiStatus('idle');
    }
    
    setConversationHistory(prev => [...prev, userMessage, { role: 'ai', content: aiResponseText }]);

  }, [conversationHistory]);

  const loadingText = "\n DK-01 SYSTEM INITIALIZATION\n> Loading core modules...\n> Calibrating sensors...\n> Establishing connection...\n> Boot sequence complete... \n> System ready...";

  return (
    <div className="h-screen w-screen bg-black text-green-400 font-mono overflow-y-auto relative">
        <style>{`.blinking-cursor { animation: blink 1s step-end infinite; } @keyframes blink { 50% { opacity: 0; } }`}</style>
        <div className="absolute inset-0 opacity-20">
            <BackgroundNoise />
            <div className="grid grid-cols-10 md:grid-cols-20 grid-rows-10 md:grid-rows-20 h-full w-full">
                {Array.from({ length: 400 }).map((_, i) => (
                    <motion.div
                    key={i}
                    className="border border-green-500/30"
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
                        speed={100}
                        onComplete={() => setTimeout(() => setBooted(true), 500)}
                        style={{ whiteSpace: "pre-line", display: "block", color: "#00ff00", textShadow: "0 0 5px #00ff00" }}
                    />
                </motion.div>
            ) : (
                <motion.div
                    key="main"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-start min-h-screen relative z-10 p-4 md:p-12 lg:p-20"
                >
                    <div className="flex flex-col-reverse md:flex-row items-center justify-center w-full max-w-7xl mx-auto gap-12">
                        <div className="w-full md:w-3/5"> {/* Adjusted width for better balance */}
                            <TextDisplay output={output} onTypingComplete={handleTypingComplete} />
                            {activeContent !== null && activeContent.type === 'contact' && (
                              <ContactForm/>
                            )}
                            <AnimatePresence>
                                {!isTyping && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                    >
                                        <CommandInterface onCommand={handleCommand} disabled={isThinking} isThinking={isThinking} />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                        <div className="w-full md:w-2/5 flex justify-center"> {/* Adjusted width */}
                            <NeuralBlob status={aiStatus} />
                        </div>
                    </div>
                    <ContentDisplay content={activeContent} projects={projects} />
                </motion.div>
            )}
        </AnimatePresence>
    </div>
  );
}