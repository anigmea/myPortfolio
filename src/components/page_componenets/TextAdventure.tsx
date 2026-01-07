import { useEffect, useState, useMemo, useRef, memo, useCallback } from "react";

export const TextAdventure = memo(function TextAdventure({ isActive, onComplete }: any) {
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
                className="flex-1 bg-transparent border-none text-green-40JText/tsx"
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