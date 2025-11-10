"use client";

import { useState, useEffect, useMemo, memo } from 'react';
import { motion } from 'framer-motion';
import { AIStatus } from '@/types';

interface NeuralBlobProps {
  status: AIStatus;
}

interface Node {
  id: number;
  x: number;
  y: number;
  x3d: number;
  y3d: number;
  z3d: number;
  size: number;
}

interface Connection {
  from: Node;
  to: Node;
  opacity: number;
}

export const NeuralBlob = memo(function NeuralBlob({ status }: NeuralBlobProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [rotationZ, setRotationZ] = useState(0);

  const theme = useMemo(() => {
    switch(status) {
      case 'thinking': 
        return { base: "#FFFFFF", glow: "rgba(255, 255, 255, 0.9)", line: "rgba(255, 255, 255, 0.8)", scale: 1.15 };
      case 'processing': 
        return { base: "#FFFFFF", glow: "rgba(255, 255, 255, 0.8)", line: "rgba(255, 255, 255, 0.7)", scale: 1.1 };
      case 'projects': 
        return { base: "#00FFAA", glow: "rgba(0, 255, 170, 0.6)", line: "rgba(0, 255, 170, 0.4)", scale: 1 };
      case 'intelligence': 
        return { base: "#B469FF", glow: "rgba(180, 105, 255, 0.6)", line: "rgba(180, 105, 255, 0.4)", scale: 1 };
      case 'future': 
        return { base: "#FFDC64", glow: "rgba(255, 220, 100, 0.6)", line: "rgba(255, 220, 100, 0.4)", scale: 1 };
      case 'contact': 
        return { base: "#64B4FF", glow: "rgba(100, 180, 255, 0.6)", line: "rgba(100, 180, 255, 0.4)", scale: 1 };
      case 'experience': 
        return { base: "#00AAFF", glow: "rgba(0, 170, 255, 0.6)", line: "rgba(0, 170, 255, 0.4)", scale: 1 };
      case 'education': 
        return { base: "#3B82F6", glow: "rgba(59, 130, 246, 0.6)", line: "rgba(59, 130, 246, 0.4)", scale: 1 };
      case 'system_status': 
        return { base: "#10B981", glow: "rgba(16, 185, 129, 0.6)", line: "rgba(16, 185, 129, 0.4)", scale: 1 };
      default: 
        return { base: "#00b5e6", glow: "rgba(0, 200, 255, 0.6)", line: "rgba(0, 150, 200, 0.4)", scale: 1 };
    }
  }, [status]);

  // Continuous rotation animation
  useEffect(() => {
    let animationFrameId: number;
    const animateRotation = () => {
      setRotationZ(prevZ => (prevZ + 0.3) % 360);
      animationFrameId = requestAnimationFrame(animateRotation);
    };
    animationFrameId = requestAnimationFrame(animateRotation);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePosition({ x, y });
  };

  // Generate 3D sphere nodes and connections
  const { nodes, connections } = useMemo(() => {
    const nodesData: Node[] = [];
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

      nodesData.push({ 
        id: i, 
        x, 
        y, 
        x3d: x3dNoisy, 
        y3d: y3dNoisy, 
        z3d: z3dNoisy, 
        size: 4.5 
      });
    }

    const connectionsData: Connection[] = [];
    const connectionThreshold = 95;

    nodesData.forEach((node, i) => {
      nodesData.forEach((otherNode, j) => {
        if (i > j) {
          const distance3d = Math.sqrt(
            Math.pow(node.x3d - otherNode.x3d, 2) + 
            Math.pow(node.y3d - otherNode.y3d, 2) + 
            Math.pow(node.z3d - otherNode.z3d, 2)
          );
          if (distance3d < connectionThreshold && Math.random() > 0.1) {
            connectionsData.push({ 
              from: node, 
              to: otherNode, 
              opacity: Math.max(0.3, 1 - distance3d / connectionThreshold) 
            });
          }
        }
      });
    });

    return { nodes: nodesData, connections: connectionsData };
  }, []);

  return (
    <div 
      className="w-full md:w-1/2 flex items-center justify-center p-4" 
      onMouseMove={handleMouseMove}
      style={{ minHeight: '480px' }}
    >
      <motion.div
        className="relative w-[30rem] h-[30rem] flex items-center justify-center transition-all duration-500 ease-out"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: theme.scale, rotate: rotationZ }}
        transition={{ 
          type: "spring", 
          stiffness: 100, 
          damping: 20,
          rotate: { type: "tween", duration: 0, ease: "linear" }
        }}
      >
        <svg className="absolute inset-0 w-full h-full" style={{ overflow: 'visible' }}>
          {connections.map((connection, i) => {
            const fromX = connection.from.x;
            const fromY = connection.from.y;
            const toX = connection.to.x;
            const toY = connection.to.y;
            const distance = Math.sqrt(
              Math.pow(fromX - mousePosition.x, 2) + 
              Math.pow(fromY - mousePosition.y, 2)
            );
            const proximity = Math.max(0, 1 - distance / 100);

            return (
              <motion.line
                key={i}
                x1={fromX}
                y1={fromY}
                x2={toX}
                y2={toY}
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

        {nodes.map((node) => {
          const distance = Math.sqrt(
            Math.pow(node.x - mousePosition.x, 2) + 
            Math.pow(node.y - mousePosition.y, 2)
          );
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
                scale: [
                  (1 + proximity * 0.3) * (0.8 + depth * 0.4),
                  (1 + proximity * 0.3) * (1.1 + depth * 0.4),
                  (1 + proximity * 0.3) * (0.8 + depth * 0.4)
                ],
                opacity: [
                  (0.7 + proximity * 0.2) * opacity3d,
                  (1.0 + proximity * 0.2) * opacity3d,
                  (0.7 + proximity * 0.2) * opacity3d
                ],
                x: [0, Math.sin(node.id * 0.5 + rotationZ * 0.5) * 1.5, 0],
                y: [0, Math.cos(node.id * 0.5 + rotationZ * 0.5) * 1.5, 0],
              }}
              transition={{
                duration: 4 + Math.random(),
                repeat: Infinity,
                ease: "easeInOut",
                delay: Math.random(),
              }}
            />
          );
        })}
      </motion.div>
    </div>
  );
});
