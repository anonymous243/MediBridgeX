export function Logo({
  size = 32,
  showText = true,
  layout = "horizontal",
  className = "",
}: {
  size?: number;
  showText?: boolean;
  layout?: "horizontal" | "vertical";
  className?: string;
}) {
  const isVertical = layout === "vertical";

  // Icon only path
  if (!showText) {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <HeartIcon size={size} />
      </div>
    );
  }

  // Horizontal Layout (for Navbar/Footer)
  if (!isVertical) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <HeartIcon size={size} />
        <span
          className="font-bold tracking-tight"
          style={{
            fontSize: `${size * 0.6}px`,
            color: "#1e3a5f"
          }}
        >MediBridgeX
        </span>
      </div>
    );
  }

  // Vertical Layout (Matching the user's provided image)
  return (
    <div className={`flex flex-col items-center text-center ${className}`}>
      <HeartIcon size={size * 1.5} />
      <div className="mt-4 flex flex-col items-center">
        <span
          className="font-bold"
          style={{
            fontSize: `${size * 0.75}px`,
            color: "#0f172a",
            lineHeight: 1
          }}
        >
          MediBridgeX
        </span>

        {/* ECG Line Separator */}
        <div className="w-full max-w-[120px] h-8 relative flex items-center justify-center overflow-hidden">
          <svg width="100%" height="20" viewBox="0 0 100 20" fill="none" className="opacity-80">
            <line x1="0" y1="10" x2="35" y2="10" stroke="#ec4899" strokeWidth="0.5" strokeOpacity="0.4" />
            <path
              className="ecg-line-anim"
              d="M35 10 L38 10 L42 2 L48 18 L52 10 L100 10"
              stroke="url(#heartGradLogo)"
              strokeWidth="1.2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <line x1="65" y1="10" x2="100" y2="10" stroke="#3b82f6" strokeWidth="0.5" strokeOpacity="0.4" />
            <defs>
              <linearGradient id="heartGradLogo" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ec4899" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
            </defs>
          </svg>
          <style>{`
            @keyframes ecgLinePulse {
              0% { stroke-dashoffset: 100; opacity: 0.3; }
              50% { stroke-dashoffset: 0; opacity: 1; }
              100% { stroke-dashoffset: -100; opacity: 0.3; }
            }
            .ecg-line-anim {
              stroke-dasharray: 100;
              animation: ecgLinePulse 3s linear infinite;
            }
          `}</style>
        </div>

        <span
          className="font-semibold uppercase tracking-[0.35em] text-gray-800"
          style={{ fontSize: `${size * 0.25}px` }}
        >
          Healthcare solutions
        </span>
      </div>
    </div>
  );
}

function HeartIcon({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ overflow: "visible" }}
    >
      <defs>
        <linearGradient id="heartGradIcon" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ec4899" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>
        <style>{`
          @keyframes heartbeatLogo {
            0%   { transform: scale(1); }
            50%  { transform: scale(1.04); }
            100% { transform: scale(1); }
          }
          .logo-heart-base {
            transform-origin: 20px 20px;
            animation: heartbeatLogo 3s ease-in-out infinite;
          }
          @keyframes heartlineFlow {
            0% { stroke-dashoffset: 60; }
            100% { stroke-dashoffset: 0; }
          }
          .heartline-flow-anim {
            stroke-dasharray: 30 30;
            animation: heartlineFlow 3s linear infinite;
          }
        `}</style>
      </defs>

      <g className="logo-heart-base">
        {/* Solid Heart */}
        <path
          d="M20 34 C16 31 4 22 4 13 C4 8 8 4 13 4 C16 4 18 6 20 10 C22 6 24 4 27 4 C32 4 36 8 36 13 C36 22 24 31 20 34"
          fill="url(#heartGradIcon)"
        />

        {/* Heartline Passing Through */}
        <path
          className="heartline-flow-anim"
          d="M2 18 L12 18 L15 12 L18 24 L22 18 L38 18"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeOpacity="0.9"
        />
      </g>
    </svg>
  );
}