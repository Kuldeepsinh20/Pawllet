import React from 'react';

export default function GoldenRetrieverAvatar({ className = "w-36 h-36" }) {
  return (
    <div className={`relative rounded-full p-1 bg-[#141E38] shadow-md flex-shrink-0 ${className}`}>
      <div className="w-full h-full rounded-full border-2 border-[#FAF7F2] overflow-hidden bg-[#7AC7D9]/20 flex items-center justify-center relative">
        <svg viewBox="0 0 200 200" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            {/* Fur gradient */}
            <linearGradient id="dogFur" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#F5BF68" />
              <stop offset="100%" stopColor="#E39D3D" />
            </linearGradient>
            <linearGradient id="earFur" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#DE8E30" />
              <stop offset="100%" stopColor="#C4731E" />
            </linearGradient>
            <linearGradient id="muzzleFur" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FDEBC4" />
              <stop offset="100%" stopColor="#F8DA9D" />
            </linearGradient>
          </defs>

          {/* Background circle inside avatar */}
          <circle cx="100" cy="100" r="96" fill="#88CCD9" />

          {/* Golden Retriever Left Ear */}
          <path
            d="M 38 65 C 20 85 18 135 32 155 C 42 170 60 162 60 145 C 60 120 54 85 45 65 Z"
            fill="url(#earFur)"
          />
          {/* Golden Retriever Right Ear */}
          <path
            d="M 162 65 C 180 85 182 135 168 155 C 158 170 140 162 140 145 C 140 120 146 85 155 65 Z"
            fill="url(#earFur)"
          />

          {/* Body / Shoulders */}
          <path
            d="M 40 200 C 45 160 80 155 100 155 C 120 155 155 160 160 200 Z"
            fill="#E39D3D"
          />
          <path
            d="M 75 200 C 80 170 100 165 100 165 C 100 165 120 170 125 200 Z"
            fill="#FDF3DE"
          />

          {/* Head Base */}
          <ellipse cx="100" cy="98" rx="56" ry="52" fill="url(#dogFur)" />

          {/* Fur tufts on cheeks */}
          <path d="M 46 95 C 40 105 42 120 50 125 C 50 115 50 105 52 95 Z" fill="#E39D3D" />
          <path d="M 154 95 C 160 105 158 120 150 125 C 150 115 150 105 148 95 Z" fill="#E39D3D" />

          {/* Forehead Golden stripe */}
          <path
            d="M 92 50 C 96 70 96 85 92 95 L 108 95 C 104 85 104 70 108 50 Z"
            fill="#F7CE83"
            opacity="0.6"
          />

          {/* Snout / Muzzle */}
          <ellipse cx="100" cy="122" rx="34" ry="26" fill="url(#muzzleFur)" />

          {/* Happy Open Mouth */}
          <path
            d="M 85 130 C 85 155 115 155 115 130 Z"
            fill="#5A1A1A"
          />

          {/* Cute Pink Tongue */}
          <path
            d="M 88 136 C 88 162 112 162 112 136 C 105 140 95 140 88 136 Z"
            fill="#FF829B"
          />
          <path d="M 100 138 L 100 152" stroke="#E66A82" strokeWidth="2" strokeLinecap="round" />

          {/* Upper Lip Line */}
          <path
            d="M 82 128 C 92 135 100 132 100 125 C 100 132 108 135 118 128"
            stroke="#2B1A0E"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
          />

          {/* Nose */}
          <path
            d="M 90 115 C 90 110 93 107 100 107 C 107 107 110 110 110 115 C 110 122 104 125 100 125 C 96 125 90 122 90 115 Z"
            fill="#231F20"
          />
          {/* Nose highlight */}
          <ellipse cx="96" cy="112" rx="3" ry="1.5" fill="#6B6667" />

          {/* Whiskers dots */}
          <circle cx="82" cy="123" r="1" fill="#7A6044" />
          <circle cx="77" cy="125" r="1" fill="#7A6044" />
          <circle cx="83" cy="128" r="1" fill="#7A6044" />
          <circle cx="118" cy="123" r="1" fill="#7A6044" />
          <circle cx="123" cy="125" r="1" fill="#7A6044" />
          <circle cx="117" cy="128" r="1" fill="#7A6044" />

          {/* Left Eye */}
          <ellipse cx="76" cy="90" rx="9.5" ry="11" fill="#2A1B0E" />
          <circle cx="74" cy="87" r="3.5" fill="#FFFFFF" />
          <circle cx="78" cy="93" r="1.5" fill="#FFFFFF" />
          {/* Left Eyebrow highlight */}
          <path d="M 68 76 C 73 72 82 73 85 77" stroke="#C57E24" strokeWidth="2.5" strokeLinecap="round" fill="none" />

          {/* Right Eye */}
          <ellipse cx="124" cy="90" rx="9.5" ry="11" fill="#2A1B0E" />
          <circle cx="122" cy="87" r="3.5" fill="#FFFFFF" />
          <circle cx="126" cy="93" r="1.5" fill="#FFFFFF" />
          {/* Right Eyebrow highlight */}
          <path d="M 132 76 C 127 72 118 73 115 77" stroke="#C57E24" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        </svg>
      </div>
    </div>
  );
}
