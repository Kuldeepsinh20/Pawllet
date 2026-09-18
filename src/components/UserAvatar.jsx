import React from 'react';

export default function UserAvatar({ size = "w-10 h-10", showBorder = true, statusBorder = false }) {
  return (
    <div className={`relative ${size} rounded-full overflow-hidden flex-shrink-0 ${showBorder ? (statusBorder ? 'ring-2 ring-emerald-500' : 'ring-1 ring-pawGold-300') : ''} shadow-sm bg-[#4A2E2B]`}>
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {/* Background */}
        <circle cx="50" cy="50" r="50" fill="#EAD9CE" />
        {/* Shirt (Red/Burgundy) */}
        <path d="M 15 100 C 15 78 30 72 50 72 C 70 72 85 78 85 100 Z" fill="#9B2C2C" />
        <path d="M 44 72 L 50 84 L 56 72 Z" fill="#7B1D1D" />
        <path d="M 42 72 L 50 82 L 35 100 Z" fill="#FAF5EF" opacity="0.3" />
        {/* Neck */}
        <rect x="42" y="60" width="16" height="15" rx="3" fill="#C98A62" />
        {/* Head */}
        <ellipse cx="50" cy="48" rx="20" ry="24" fill="#D99B75" />
        {/* Hair */}
        <path d="M 28 42 C 28 26 36 20 50 20 C 64 20 72 26 72 42 C 67 36 60 34 50 34 C 40 34 33 36 28 42 Z" fill="#241B18" />
        {/* Beard & Mustache */}
        <path d="M 38 52 C 38 68 44 72 50 72 C 56 72 62 68 62 52 C 62 58 56 64 50 64 C 44 64 38 58 38 52 Z" fill="#241B18" />
        <path d="M 44 58 C 47 60 53 60 56 58 C 53 59 47 59 44 58 Z" stroke="#241B18" strokeWidth="2.5" />
        {/* Eyes */}
        <circle cx="42" cy="46" r="2.5" fill="#241B18" />
        <circle cx="58" cy="46" r="2.5" fill="#241B18" />
        {/* Eyebrows */}
        <path d="M 38 41 C 41 40 45 41 46 43" stroke="#241B18" strokeWidth="2" strokeLinecap="round" />
        <path d="M 62 41 C 59 40 55 41 54 43" stroke="#241B18" strokeWidth="2" strokeLinecap="round" />
        {/* Nose */}
        <path d="M 50 46 L 49 53 L 52 53" stroke="#B87852" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      </svg>
    </div>
  );
}
