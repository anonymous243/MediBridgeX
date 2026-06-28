"use client";

import React, { useEffect, useRef } from "react";

export function AmbientBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;

    // Grid details
    const gridSize = 40;

    // Drift particles
    interface Particle {
      x: number;
      y: number;
      radius: number;
      speedY: number;
      opacity: number;
      symbol: string;
    }

    const symbols = ["🧬", "●", "🩺", "⚡", "💊", "🏥"];
    const particles: Particle[] = [];

    // Faint ECG Wave lines
    interface ECGWave {
      y: number;
      x: number;
      speed: number;
      points: number[];
      pulseX: number;
    }

    const waves: ECGWave[] = [];

    const resize = () => {
      width = window.innerWidth;
      // Get document total height to span the entire scrolling area if needed,
      // or match parent clientHeight
      const parent = canvas.parentElement;
      height = parent ? parent.clientHeight : window.innerHeight;
      
      canvas.width = width;
      canvas.height = height;

      // Populate particles
      particles.length = 0;
      const particleCount = Math.floor((width * height) / 80000); // density
      for (let i = 0; i < Math.max(15, particleCount); i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: Math.random() * 4 + 2,
          speedY: -(Math.random() * 0.3 + 0.1),
          opacity: Math.random() * 0.08 + 0.02,
          symbol: symbols[Math.floor(Math.random() * symbols.length)],
        });
      }

      // Populate horizontal waves
      waves.length = 0;
      waves.push({
        y: height * 0.18,
        x: 0,
        speed: 2,
        points: [],
        pulseX: 0,
      });
      waves.push({
        y: height * 0.52,
        x: 0,
        speed: 1.5,
        points: [],
        pulseX: 0,
      });
      waves.push({
        y: height * 0.82,
        x: 0,
        speed: 2.2,
        points: [],
        pulseX: 0,
      });
    };

    window.addEventListener("resize", resize);
    resize();

    // Helper to draw standard ECG pattern centered around x
    const getECGHeight = (currentX: number, pulseX: number) => {
      const dist = currentX - pulseX;
      if (dist < -50 || dist > 50) return 0;
      
      // Standard ECG signal path: P, Q, R, S, T waves
      if (dist > -50 && dist < -35) {
        // P Wave
        return Math.sin((dist + 42.5) * (Math.PI / 7.5)) * 3;
      }
      if (dist >= -35 && dist < -25) return 0;
      if (dist >= -25 && dist < -20) {
        // Q Wave (slight dip)
        return -2;
      }
      if (dist >= -20 && dist < -10) {
        // R Wave (big peak)
        return 22;
      }
      if (dist >= -10 && dist < -5) {
        // S Wave (big dip)
        return -8;
      }
      if (dist >= -5 && dist < 15) {
        // T Wave (medium wave)
        return Math.sin((dist - 5) * (Math.PI / 10)) * 6;
      }
      return 0;
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Draw Technical Grid
      ctx.strokeStyle = "rgba(241, 245, 249, 0.4)"; // faint slate
      ctx.lineWidth = 0.5;
      
      // Vertical grid lines
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      // Horizontal grid lines
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // 2. Draw drift particles
      particles.forEach((p) => {
        p.y += p.speedY;
        if (p.y < -20) {
          p.y = height + 20;
          p.x = Math.random() * width;
        }

        ctx.fillStyle = `rgba(148, 163, 184, ${p.opacity})`;
        if (p.symbol === "●") {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.font = `${p.radius * 2.5}px Arial`;
          ctx.fillText(p.symbol, p.x, p.y);
        }
      });

      // 3. Draw ECG pulse lines
      waves.forEach((w) => {
        w.pulseX += w.speed;
        if (w.pulseX > width + 100) {
          w.pulseX = -100;
        }

        ctx.beginPath();
        ctx.lineWidth = 1.2;
        
        // Gradient for ECG pulse trailing
        const grad = ctx.createLinearGradient(w.pulseX - 180, w.y, w.pulseX + 20, w.y);
        grad.addColorStop(0, "rgba(241, 245, 249, 0)");
        grad.addColorStop(0.5, "rgba(168, 85, 247, 0.08)"); // Faint Purple
        grad.addColorStop(0.8, "rgba(236, 72, 153, 0.16)");  // Pink
        grad.addColorStop(1, "rgba(20, 184, 166, 0.4)");    // Teal peak

        ctx.strokeStyle = grad;

        for (let x = 0; x < width; x += 3) {
          const ecgVal = getECGHeight(x, w.pulseX);
          const y = w.y - ecgVal;
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none">
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
}
