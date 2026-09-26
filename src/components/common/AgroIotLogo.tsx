import React from 'react';

import { ASSETS } from '../../assets/assetMap';

interface AgroIotLogoProps {
  className?: string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  useImage?: boolean;
}

export const AgroIotLogo: React.FC<AgroIotLogoProps> = ({
  className = '',
  showText = true,
  size = 'md',
  useImage = true,
}) => {
  const sizeMap = {
    sm: { icon: 'w-7 h-7', text: 'text-base', sub: 'text-[8px]' },
    md: { icon: 'w-9 h-9', text: 'text-xl', sub: 'text-[9px]' },
    lg: { icon: 'w-12 h-12', text: 'text-2xl', sub: 'text-[10px]' },
    xl: { icon: 'w-16 h-16', text: 'text-3xl', sub: 'text-xs' },
  };

  const currentSize = sizeMap[size];

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* Official Circular AGRO-IoT Logo Image (User's provided asset) */}
      {useImage ? (
        <img
          src={ASSETS.officialLogo}
          alt="AGRO-IoT Official Logo"
          className={`${currentSize.icon} object-contain rounded-full shadow-xs flex-shrink-0 bg-white ring-1 ring-emerald-500/30`}
        />
      ) : (
      <svg
        viewBox="0 0 200 200"
        className={`${currentSize.icon} drop-shadow-2xs flex-shrink-0`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="agroGreenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e7b3e" />
            <stop offset="50%" stopColor="#15803d" />
            <stop offset="100%" stopColor="#0f4a24" />
          </linearGradient>
          <linearGradient id="agroLeafGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4ade80" />
            <stop offset="100%" stopColor="#16a34a" />
          </linearGradient>
          <linearGradient id="agroSoilGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#5c381e" />
            <stop offset="100%" stopColor="#3d2311" />
          </linearGradient>
        </defs>

        {/* Outer Circular Ring */}
        <circle
          cx="100"
          cy="100"
          r="92"
          stroke="url(#agroGreenGrad)"
          strokeWidth="11"
          fill="#ffffff"
          className="dark:fill-[#121613]"
        />

        {/* Top IoT Wi-Fi Broadcast Waves */}
        {/* Dot */}
        <circle cx="100" cy="54" r="5" fill="#15803d" />
        {/* Inner Arc */}
        <path
          d="M 83 45 A 24 24 0 0 1 117 45"
          stroke="#15803d"
          strokeWidth="6"
          strokeLinecap="round"
        />
        {/* Middle Arc */}
        <path
          d="M 74 35 A 38 38 0 0 1 126 35"
          stroke="#16a34a"
          strokeWidth="7"
          strokeLinecap="round"
        />
        {/* Outer Arc */}
        <path
          d="M 64 24 A 52 52 0 0 1 136 24"
          stroke="#22c55e"
          strokeWidth="8"
          strokeLinecap="round"
        />

        {/* Bottom Soil Furrows (Brown Strata) */}
        <path
          d="M 28 122 Q 100 152 172 122 C 160 168 120 186 100 186 C 80 186 40 168 28 122 Z"
          fill="url(#agroSoilGrad)"
        />
        {/* Furrow Lines */}
        <path
          d="M 50 138 Q 100 165 150 138"
          stroke="#8c582f"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        <path
          d="M 70 155 Q 100 174 130 155"
          stroke="#8c582f"
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* Terraced Green Field Layer Arc */}
        <path
          d="M 26 122 Q 100 150 174 122 Q 100 136 26 122 Z"
          fill="url(#agroLeafGrad)"
        />

        {/* Center Circuit Stems & IoT Contact Pads */}
        {/* Left Circuit Branch */}
        <path
          d="M 100 126 L 100 106 L 78 94"
          stroke="#15803d"
          strokeWidth="4.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="78" cy="94" r="5" fill="#ffffff" stroke="#15803d" strokeWidth="4" />

        {/* Center Circuit Branch */}
        <path
          d="M 100 126 L 100 78"
          stroke="#15803d"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <circle cx="100" cy="78" r="5.5" fill="#ffffff" stroke="#15803d" strokeWidth="4" />

        {/* Right Circuit Branch */}
        <path
          d="M 100 126 L 100 106 L 122 94"
          stroke="#15803d"
          strokeWidth="4.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="122" cy="94" r="5" fill="#ffffff" stroke="#15803d" strokeWidth="4" />

        {/* Growing Plant Leaves */}
        {/* Center-Right Main Leaf */}
        <path
          d="M 98 116 C 98 84 126 62 146 54 C 146 76 138 106 102 120 Z"
          fill="url(#agroLeafGrad)"
          stroke="#0f4a24"
          strokeWidth="2"
        />

        {/* Center-Left Secondary Leaf */}
        <path
          d="M 98 120 C 86 98 62 82 50 68 C 64 64 92 78 98 110 Z"
          fill="url(#agroLeafGrad)"
          stroke="#0f4a24"
          strokeWidth="2"
        />
      </svg>
      )}

      {/* Styled Official Text "AGRO-IoT" */}
      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center tracking-tight font-black font-sans leading-none">
            <span className={`${currentSize.text} text-[#134e28] dark:text-emerald-400 font-extrabold`}>
              AGR
            </span>
            {/* The letter 'O' with stylized leaf inside */}
            <span className="relative inline-flex items-center justify-center">
              <span className={`${currentSize.text} text-[#134e28] dark:text-emerald-400 font-extrabold`}>
                O
              </span>
              <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <svg viewBox="0 0 10 10" className="w-2.5 h-2.5 text-emerald-500 fill-current">
                  <path d="M 5 2 C 7 3 8 5 8 7 C 6 7 4 6 3 5 C 4 4 4.5 3 5 2 Z" />
                </svg>
              </span>
            </span>
            <span className={`${currentSize.text} text-[#134e28] dark:text-stone-100 font-extrabold`}>
              -IoT
            </span>
          </div>
          <span className={`${currentSize.sub} font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400`}>
            Smart Farming Platform
          </span>
        </div>
      )}
    </div>
  );
};
