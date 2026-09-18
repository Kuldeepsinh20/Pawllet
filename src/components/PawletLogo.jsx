import React from 'react';

export default function PawletLogo() {
  return (
    <div className="flex items-center gap-3">
      {/* Pawlet Logo Icon */}
      <div className="flex items-center gap-2">
        <svg className="w-8 h-8 text-[#141E38] fill-current" viewBox="0 0 24 24">
          <ellipse cx="6.5" cy="8.5" rx="2" ry="2.6" />
          <ellipse cx="11.2" cy="6.2" rx="2" ry="2.6" />
          <ellipse cx="16" cy="7.2" rx="2" ry="2.6" />
          <ellipse cx="19.5" cy="11.2" rx="1.8" ry="2.4" />
          <path d="M 7.5 14.5 C 7.5 12.5 9 11 12 11 C 15 11 17 12.5 17.5 14.5 C 18 16.5 16.8 19.5 12 19.5 C 7.2 19.5 7 16.5 7.5 14.5 Z" />
        </svg>
        <span className="text-2xl font-black tracking-tight text-[#141E38] font-sans">
          Pawllet
        </span>
      </div>

      <div className="h-6 w-[1.5px] bg-[#D6CBB8] mx-1"></div>

      <span className="text-[17px] font-medium text-[#1A2748] tracking-tight">
        One Pet. One Profile. Trusted Everywhere.
      </span>
    </div>
  );
}
