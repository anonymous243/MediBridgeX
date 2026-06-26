"use client";

export function BackgroundMesh() {
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
      {/* ── Background Color Base ── */}
      <div className="absolute inset-0 bg-white" />

      {/* ── Animated Blobs ── */}
      <div className="absolute inset-0">
        {/* Magenta Blob */}
        <div 
          className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-[#ec4899] opacity-[0.04] blur-[120px]"
          style={{ animation: "blobOne 25s ease-in-out infinite alternate" }}
        />
        
        {/* Blue Blob */}
        <div 
          className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-[#3b82f6] opacity-[0.04] blur-[120px]"
          style={{ animation: "blobTwo 30s ease-in-out infinite alternate" }}
        />

        {/* Center Accent (Berry) */}
        <div 
          className="absolute top-[20%] right-[10%] w-[40%] h-[40%] rounded-full bg-[#9d174d] opacity-[0.02] blur-[100px]"
          style={{ animation: "blobThree 20s ease-in-out infinite alternate" }}
        />
      </div>

      {/* ── Noise Texture (Optional but adds premium feel) ── */}
      <div className="absolute inset-0 opacity-[0.015] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

      <style jsx global>{`
        @keyframes blobOne {
          0% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(10%, 15%) scale(1.1); }
          66% { transform: translate(-5%, 20%) scale(0.9); }
          100% { transform: translate(0, 0) scale(1); }
        }
        @keyframes blobTwo {
          0% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-15%, -10%) scale(1.2); }
          100% { transform: translate(0, 0) scale(1); }
        }
        @keyframes blobThree {
          0% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(10%, -20%) scale(0.85); }
          100% { transform: translate(0, 0) scale(1); }
        }
      `}</style>
    </div>
  );
}
