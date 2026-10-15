import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', showText = true }) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-10 h-10',
    lg: 'w-13 h-13',
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  return (
    <div className="flex items-center gap-2.5 select-none group">
      {/* Gift Box Combined with Dollar Coin Vector Graphic */}
      <div className={`relative ${iconSizes[size]} flex items-center justify-center`}>
        <div className="absolute inset-0 bg-gradient-to-tr from-pink-600 via-purple-600 to-amber-400 rounded-xl blur-xs opacity-75 group-hover:opacity-100 transition-opacity" />
        <div className="relative w-full h-full bg-gradient-to-b from-[#2a1147] to-[#150727] border border-pink-500/40 rounded-xl p-1.5 flex items-center justify-center shadow-lg">
          <svg
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full"
          >
            {/* Gift Box Base */}
            <rect x="8" y="18" width="32" height="22" rx="4" fill="#3B185F" stroke="#EC4899" strokeWidth="2" />
            {/* Gift Box Lid */}
            <rect x="6" y="13" width="36" height="7" rx="2" fill="#581C87" stroke="#F472B6" strokeWidth="1.5" />
            {/* Gift Ribbon Vertical */}
            <rect x="22" y="13" width="4" height="27" fill="#F59E0B" />
            {/* Gift Ribbon Horizontal */}
            <rect x="8" y="27" width="32" height="4" fill="#F59E0B" />
            
            {/* Golden Dollar Coin overlapping top right */}
            <circle cx="34" cy="14" r="10" fill="url(#goldGradient)" stroke="#FEF08A" strokeWidth="1.5" filter="drop-shadow(0px 2px 4px rgba(0,0,0,0.4))" />
            <circle cx="34" cy="14" r="8" fill="none" stroke="#D97706" strokeWidth="1" strokeDasharray="1.5 1.5" />
            <text
              x="34"
              y="18.5"
              textAnchor="middle"
              fill="#78350F"
              fontWeight="900"
              fontSize="12"
              fontFamily="Outfit, sans-serif"
            >
              $
            </text>

            {/* Sparkles */}
            <path d="M12 9L13 12L16 13L13 14L12 17L11 14L8 13L11 12L12 9Z" fill="#FDE047" opacity="0.9" />
            <path d="M42 32L42.8 34L45 34.8L42.8 35.6L42 38L41.2 35.6L39 34.8L41.2 34L42 32Z" fill="#F472B6" opacity="0.8" />

            <defs>
              <linearGradient id="goldGradient" x1="26" y1="6" x2="42" y2="22" gradientUnits="userSpaceOnUse">
                <stop stopColor="#FDE047" />
                <stop offset="0.5" stopColor="#F59E0B" />
                <stop offset="1" stopColor="#D97706" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      {showText && (
        <div className="flex flex-col leading-tight">
          <span className={`font-extrabold tracking-tight text-white ${textSizes[size]}`}>
            Sweet<span className="text-pink-400">Cash</span>
            <span className="text-amber-400 text-xs uppercase tracking-widest font-black ml-1.5 px-1.5 py-0.5 rounded bg-amber-400/10 border border-amber-400/30">
              Rewards
            </span>
          </span>
          <span className="text-[10px] text-pink-300/70 font-medium tracking-wide">
            Complete Offers. Earn Rewards.
          </span>
        </div>
      )}
    </div>
  );
};
