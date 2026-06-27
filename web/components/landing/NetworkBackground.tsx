"use client";

import React, { useEffect, useRef } from "react";

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
}

const COLORS = ["#ec4899", "#a855f7", "#14b8a6"]; // Pink, Purple, Teal
const NUM_NODES = 70; 
const CONNECTION_DISTANCE = 200;
const NODE_SPEED = 0.4;

export function NetworkBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let nodes: Node[] = [];
    let width = 0;
    let height = 0;

    const initNodes = () => {
      nodes = [];
      for (let i = 0; i < NUM_NODES; i++) {
        nodes.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * NODE_SPEED,
          vy: (Math.random() - 0.5) * NODE_SPEED,
          radius: Math.random() * 3 + 2,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
        });
      }
    };

    const resize = () => {
      const parent = canvas.parentElement;
      if (parent) {
        const rect = parent.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) return;
        
        width = rect.width;
        height = rect.height;
        canvas.width = width;
        canvas.height = height;
        initNodes(); 
      }
    };

    const resizeObserver = new ResizeObserver(() => {
      resize();
    });

    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    }
    
    // Initial call
    resize();

    const draw = () => {
      // Clear canvas
      ctx.clearRect(0, 0, width, height);

      // Update and draw nodes
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];

        // Move node
        node.x += node.vx;
        node.y += node.vy;

        // Bounce off edges smoothly
        if (node.x < 0 || node.x > width) node.vx *= -1;
        if (node.y < 0 || node.y > height) node.vy *= -1;

        // Draw connections
        for (let j = i + 1; j < nodes.length; j++) {
          const other = nodes[j];
          const dx = node.x - other.x;
          const dy = node.y - other.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < CONNECTION_DISTANCE) {
            // Opacity based on distance
            const opacity = 1 - distance / CONNECTION_DISTANCE;
            
            // Create a gradient line between the two nodes
            const gradient = ctx.createLinearGradient(node.x, node.y, other.x, other.y);
            // Convert hex to rgba for opacity support
            const color1 = hexToRgba(node.color, opacity * 0.8);
            const color2 = hexToRgba(other.color, opacity * 0.8);
            
            gradient.addColorStop(0, color1);
            gradient.addColorStop(1, color2);

            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(other.x, other.y);
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 1.5;
            ctx.stroke();
          }
        }

        // Draw node (add a glowing effect)
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        
        // Add shadow for glow
        ctx.shadowBlur = 10;
        ctx.shadowColor = node.color;
        ctx.fill();
        
        // Reset shadow for lines
        ctx.shadowBlur = 0;
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      resizeObserver.disconnect();
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
      {/* The canvas itself */}
      <canvas
        ref={canvasRef}
        className="block w-full h-full opacity-100"
      />
    </div>
  );
}

// Helper to convert hex to rgba
function hexToRgba(hex: string, alpha: number) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

