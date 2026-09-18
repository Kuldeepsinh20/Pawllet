import React from 'react';

// ─────────────────────────────────────────────
// SVG avatars for each species + neutral
// ─────────────────────────────────────────────

function DogAvatar() {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="dogFur" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#F5BF68" />
          <stop offset="100%" stopColor="#E39D3D" />
        </linearGradient>
        <linearGradient id="dogEarFur" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#DE8E30" />
          <stop offset="100%" stopColor="#C4731E" />
        </linearGradient>
        <linearGradient id="dogMuzzle" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FDEBC4" />
          <stop offset="100%" stopColor="#F8DA9D" />
        </linearGradient>
      </defs>
      <circle cx="100" cy="100" r="96" fill="#88CCD9" />
      {/* Ears */}
      <path d="M 38 65 C 20 85 18 135 32 155 C 42 170 60 162 60 145 C 60 120 54 85 45 65 Z" fill="url(#dogEarFur)" />
      <path d="M 162 65 C 180 85 182 135 168 155 C 158 170 140 162 140 145 C 140 120 146 85 155 65 Z" fill="url(#dogEarFur)" />
      {/* Body */}
      <path d="M 40 200 C 45 160 80 155 100 155 C 120 155 155 160 160 200 Z" fill="#E39D3D" />
      <path d="M 75 200 C 80 170 100 165 100 165 C 100 165 120 170 125 200 Z" fill="#FDF3DE" />
      {/* Head */}
      <ellipse cx="100" cy="98" rx="56" ry="52" fill="url(#dogFur)" />
      <path d="M 46 95 C 40 105 42 120 50 125 C 50 115 50 105 52 95 Z" fill="#E39D3D" />
      <path d="M 154 95 C 160 105 158 120 150 125 C 150 115 150 105 148 95 Z" fill="#E39D3D" />
      {/* Muzzle */}
      <ellipse cx="100" cy="122" rx="34" ry="26" fill="url(#dogMuzzle)" />
      <path d="M 85 130 C 85 155 115 155 115 130 Z" fill="#5A1A1A" />
      <path d="M 88 136 C 88 162 112 162 112 136 C 105 140 95 140 88 136 Z" fill="#FF829B" />
      <path d="M 100 138 L 100 152" stroke="#E66A82" strokeWidth="2" strokeLinecap="round" />
      <path d="M 82 128 C 92 135 100 132 100 125 C 100 132 108 135 118 128" stroke="#2B1A0E" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M 90 115 C 90 110 93 107 100 107 C 107 107 110 110 110 115 C 110 122 104 125 100 125 C 96 125 90 122 90 115 Z" fill="#231F20" />
      <ellipse cx="96" cy="112" rx="3" ry="1.5" fill="#6B6667" />
      {/* Eyes */}
      <ellipse cx="76" cy="90" rx="9.5" ry="11" fill="#2A1B0E" />
      <circle cx="74" cy="87" r="3.5" fill="#FFFFFF" />
      <circle cx="78" cy="93" r="1.5" fill="#FFFFFF" />
      <path d="M 68 76 C 73 72 82 73 85 77" stroke="#C57E24" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <ellipse cx="124" cy="90" rx="9.5" ry="11" fill="#2A1B0E" />
      <circle cx="122" cy="87" r="3.5" fill="#FFFFFF" />
      <circle cx="126" cy="93" r="1.5" fill="#FFFFFF" />
      <path d="M 132 76 C 127 72 118 73 115 77" stroke="#C57E24" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    </svg>
  );
}

function CatAvatar() {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="catFur" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#B8A090" />
          <stop offset="100%" stopColor="#8C6E60" />
        </linearGradient>
        <linearGradient id="catBg" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#E8C5A0" />
          <stop offset="100%" stopColor="#D4A870" />
        </linearGradient>
      </defs>
      <circle cx="100" cy="100" r="96" fill="#E8D5C4" />
      {/* Body */}
      <path d="M 45 200 C 50 165 80 158 100 158 C 120 158 150 165 155 200 Z" fill="#B8A090" />
      {/* Ears */}
      <path d="M 52 75 L 38 35 L 75 62 Z" fill="#B8A090" />
      <path d="M 148 75 L 162 35 L 125 62 Z" fill="#B8A090" />
      <path d="M 55 72 L 44 44 L 72 65 Z" fill="#E8C5B8" />
      <path d="M 145 72 L 156 44 L 128 65 Z" fill="#E8C5B8" />
      {/* Head */}
      <ellipse cx="100" cy="100" rx="55" ry="50" fill="url(#catFur)" />
      {/* Muzzle */}
      <ellipse cx="100" cy="118" rx="22" ry="16" fill="#E8C5B8" />
      {/* Nose */}
      <path d="M 95 112 L 100 117 L 105 112 C 103 109 97 109 95 112 Z" fill="#F4A0B0" />
      {/* Mouth */}
      <path d="M 100 117 L 92 122" stroke="#8C5060" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <path d="M 100 117 L 108 122" stroke="#8C5060" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      {/* Whiskers */}
      <line x1="65" y1="115" x2="88" y2="118" stroke="#666" strokeWidth="1" />
      <line x1="65" y1="120" x2="88" y2="120" stroke="#666" strokeWidth="1" />
      <line x1="65" y1="125" x2="88" y2="122" stroke="#666" strokeWidth="1" />
      <line x1="135" y1="115" x2="112" y2="118" stroke="#666" strokeWidth="1" />
      <line x1="135" y1="120" x2="112" y2="120" stroke="#666" strokeWidth="1" />
      <line x1="135" y1="125" x2="112" y2="122" stroke="#666" strokeWidth="1" />
      {/* Eyes */}
      <ellipse cx="76" cy="90" rx="11" ry="13" fill="#2A4040" />
      <ellipse cx="76" cy="90" rx="4" ry="10" fill="#1A2828" />
      <circle cx="73" cy="85" r="3" fill="#FFFFFF" />
      <ellipse cx="124" cy="90" rx="11" ry="13" fill="#2A4040" />
      <ellipse cx="124" cy="90" rx="4" ry="10" fill="#1A2828" />
      <circle cx="121" cy="85" r="3" fill="#FFFFFF" />
      {/* Eyebrows */}
      <path d="M 66 76 C 72 72 82 74 85 78" stroke="#6B5040" strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M 134 76 C 128 72 118 74 115 78" stroke="#6B5040" strokeWidth="2" strokeLinecap="round" fill="none" />
      {/* Forehead stripes */}
      <path d="M 92 68 C 93 74 93 80 92 86" stroke="#7A5E50" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
      <path d="M 100 65 C 100 72 100 79 100 86" stroke="#7A5E50" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
      <path d="M 108 68 C 107 74 107 80 108 86" stroke="#7A5E50" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
    </svg>
  );
}

function BirdAvatar() {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="birdBody" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#5DA8E0" />
          <stop offset="100%" stopColor="#2E7CB0" />
        </linearGradient>
        <linearGradient id="birdWing" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3E8FC8" />
          <stop offset="100%" stopColor="#1A5A8A" />
        </linearGradient>
      </defs>
      <circle cx="100" cy="100" r="96" fill="#D0EEF8" />
      {/* Tail feathers */}
      <path d="M 72 175 C 60 190 50 200 40 200 C 55 185 68 165 80 150 Z" fill="#3E8FC8" />
      <path d="M 100 180 C 95 195 90 200 85 200 C 95 185 100 165 105 150 Z" fill="#2E7CB0" />
      <path d="M 128 175 C 140 190 150 200 160 200 C 145 185 132 165 120 150 Z" fill="#3E8FC8" />
      {/* Body */}
      <ellipse cx="100" cy="130" rx="38" ry="32" fill="url(#birdBody)" />
      <ellipse cx="100" cy="140" rx="24" ry="20" fill="#E8F4F8" />
      {/* Wings */}
      <path d="M 62 120 C 40 100 35 75 45 55 C 55 70 60 95 65 115 Z" fill="url(#birdWing)" />
      <path d="M 138 120 C 160 100 165 75 155 55 C 145 70 140 95 135 115 Z" fill="url(#birdWing)" />
      <path d="M 45 55 C 50 42 58 32 70 28 C 64 42 62 58 62 72 Z" fill="#5DA8E0" />
      <path d="M 155 55 C 150 42 142 32 130 28 C 136 42 138 58 138 72 Z" fill="#5DA8E0" />
      {/* Head */}
      <circle cx="100" cy="82" r="36" fill="url(#birdBody)" />
      {/* Crest */}
      <path d="M 90 48 C 88 35 92 22 100 18 C 108 22 112 35 110 48 Z" fill="#2E7CB0" />
      <circle cx="100" cy="16" r="5" fill="#FFD700" />
      {/* Cheek patches */}
      <ellipse cx="72" cy="86" rx="10" ry="7" fill="#FF9060" opacity="0.7" />
      <ellipse cx="128" cy="86" rx="10" ry="7" fill="#FF9060" opacity="0.7" />
      {/* Beak */}
      <path d="M 88 92 L 100 98 L 112 92 L 100 86 Z" fill="#FFD700" />
      <path d="M 88 92 L 100 96 L 112 92" stroke="#E0A800" strokeWidth="1.5" fill="none" />
      {/* Eyes */}
      <circle cx="80" cy="76" r="9" fill="#FFFFFF" />
      <circle cx="80" cy="76" r="6" fill="#1A2040" />
      <circle cx="78" cy="73" r="2" fill="#FFFFFF" />
      <circle cx="120" cy="76" r="9" fill="#FFFFFF" />
      <circle cx="120" cy="76" r="6" fill="#1A2040" />
      <circle cx="118" cy="73" r="2" fill="#FFFFFF" />
    </svg>
  );
}

function SmallMammalAvatar() {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="hamFur" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#E8A870" />
          <stop offset="100%" stopColor="#C87840" />
        </linearGradient>
        <linearGradient id="hamBelly" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FAE0C8" />
          <stop offset="100%" stopColor="#F0C8A0" />
        </linearGradient>
      </defs>
      <circle cx="100" cy="100" r="96" fill="#F0E0D0" />
      {/* Ears */}
      <circle cx="62" cy="60" r="20" fill="url(#hamFur)" />
      <circle cx="62" cy="60" r="13" fill="#F4A0A0" />
      <circle cx="138" cy="60" r="20" fill="url(#hamFur)" />
      <circle cx="138" cy="60" r="13" fill="#F4A0A0" />
      {/* Body */}
      <ellipse cx="100" cy="148" rx="50" ry="38" fill="url(#hamFur)" />
      <ellipse cx="100" cy="155" rx="32" ry="24" fill="url(#hamBelly)" />
      {/* Cheek pouches */}
      <ellipse cx="56" cy="112" rx="22" ry="18" fill="url(#hamFur)" />
      <ellipse cx="144" cy="112" rx="22" ry="18" fill="url(#hamFur)" />
      {/* Head */}
      <ellipse cx="100" cy="100" rx="48" ry="44" fill="url(#hamFur)" />
      {/* Face */}
      <ellipse cx="100" cy="110" rx="30" ry="22" fill="url(#hamBelly)" />
      {/* Nose */}
      <ellipse cx="100" cy="106" rx="5" ry="4" fill="#F06090" />
      <path d="M 100 110 L 90 116" stroke="#C04060" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <path d="M 100 110 L 110 116" stroke="#C04060" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      {/* Whiskers */}
      <line x1="60" y1="108" x2="82" y2="110" stroke="#888" strokeWidth="1" />
      <line x1="60" y1="113" x2="82" y2="112" stroke="#888" strokeWidth="1" />
      <line x1="140" y1="108" x2="118" y2="110" stroke="#888" strokeWidth="1" />
      <line x1="140" y1="113" x2="118" y2="112" stroke="#888" strokeWidth="1" />
      {/* Eyes */}
      <circle cx="78" cy="90" r="10" fill="#3A2818" />
      <circle cx="75" cy="87" r="3.5" fill="#FFFFFF" />
      <circle cx="122" cy="90" r="10" fill="#3A2818" />
      <circle cx="119" cy="87" r="3.5" fill="#FFFFFF" />
      {/* Tiny paws */}
      <ellipse cx="62" cy="178" rx="12" ry="8" fill="url(#hamFur)" />
      <ellipse cx="138" cy="178" rx="12" ry="8" fill="url(#hamFur)" />
    </svg>
  );
}

function FarmAnimalAvatar() {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="cowBody" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#F0E8D8" />
          <stop offset="100%" stopColor="#D8CCB8" />
        </linearGradient>
      </defs>
      <circle cx="100" cy="100" r="96" fill="#E8F0D8" />
      {/* Horns */}
      <path d="M 65 58 C 50 38 42 22 50 15 C 56 22 60 40 68 56 Z" fill="#D4B878" />
      <path d="M 135 58 C 150 38 158 22 150 15 C 144 22 140 40 132 56 Z" fill="#D4B878" />
      {/* Ears */}
      <ellipse cx="52" cy="72" rx="16" ry="12" fill="url(#cowBody)" transform="rotate(-20, 52, 72)" />
      <ellipse cx="52" cy="72" rx="10" ry="7" fill="#F4C0C0" transform="rotate(-20, 52, 72)" />
      <ellipse cx="148" cy="72" rx="16" ry="12" fill="url(#cowBody)" transform="rotate(20, 148, 72)" />
      <ellipse cx="148" cy="72" rx="10" ry="7" fill="#F4C0C0" transform="rotate(20, 148, 72)" />
      {/* Body */}
      <ellipse cx="100" cy="148" rx="52" ry="36" fill="url(#cowBody)" />
      {/* Spots */}
      <path d="M 72 140 C 62 132 60 150 72 155 C 80 157 86 148 80 140 Z" fill="#4A3828" opacity="0.3" />
      <path d="M 118 135 C 128 130 132 148 122 152 C 115 154 110 143 118 135 Z" fill="#4A3828" opacity="0.3" />
      {/* Head */}
      <ellipse cx="100" cy="97" rx="52" ry="48" fill="url(#cowBody)" />
      {/* Muzzle */}
      <ellipse cx="100" cy="120" rx="28" ry="20" fill="#F4C8C8" />
      {/* Nostrils */}
      <ellipse cx="90" cy="120" rx="5" ry="4" fill="#C88888" />
      <ellipse cx="110" cy="120" rx="5" ry="4" fill="#C88888" />
      {/* Mouth */}
      <path d="M 88 130 C 94 134 106 134 112 130" stroke="#A06868" strokeWidth="2" strokeLinecap="round" fill="none" />
      {/* Eyes */}
      <ellipse cx="75" cy="88" rx="12" ry="13" fill="#2A2018" />
      <ellipse cx="75" cy="88" rx="8" ry="10" fill="#3A3028" />
      <circle cx="72" cy="84" r="3.5" fill="#FFFFFF" />
      <ellipse cx="125" cy="88" rx="12" ry="13" fill="#2A2018" />
      <ellipse cx="125" cy="88" rx="8" ry="10" fill="#3A3028" />
      <circle cx="122" cy="84" r="3.5" fill="#FFFFFF" />
      {/* Forehead spot */}
      <path d="M 85 68 C 88 58 112 58 115 68 C 112 76 88 76 85 68 Z" fill="#4A3828" opacity="0.25" />
    </svg>
  );
}

function NeutralAvatar() {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="neutralBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E8E0D0" />
          <stop offset="100%" stopColor="#D0C8B8" />
        </linearGradient>
      </defs>
      <circle cx="100" cy="100" r="96" fill="#EAE4D8" />
      {/* Subtle paw print in center */}
      <circle cx="100" cy="100" r="28" fill="#C8C0B0" opacity="0.4" />
      <circle cx="78" cy="76" r="10" fill="#C8C0B0" opacity="0.4" />
      <circle cx="100" cy="70" r="10" fill="#C8C0B0" opacity="0.4" />
      <circle cx="122" cy="76" r="10" fill="#C8C0B0" opacity="0.4" />
      {/* Question mark feel - paw silhouette */}
      <text x="100" y="112" textAnchor="middle" fontSize="36" fill="#9A9080" opacity="0.6" fontFamily="sans-serif">?</text>
      {/* Ring around */}
      <circle cx="100" cy="100" r="60" fill="none" stroke="#C8C0B0" strokeWidth="3" strokeDasharray="8 6" opacity="0.5" />
    </svg>
  );
}

// ─────────────────────────────────────────────
// Main PetAvatar component
// ─────────────────────────────────────────────
export default function PetAvatar({ species, className = "w-[145px] h-[145px]" }) {
  const renderAvatar = () => {
    switch (species) {
      case 'Dogs': return <DogAvatar />;
      case 'Cats': return <CatAvatar />;
      case 'Birds': return <BirdAvatar />;
      case 'Small mammals': return <SmallMammalAvatar />;
      case 'Farm Animals': return <FarmAnimalAvatar />;
      default: return <NeutralAvatar />;
    }
  };

  return (
    <div className={`relative rounded-full p-1 bg-[#141E38] shadow-md flex-shrink-0 ${className}`}>
      <div className="w-full h-full rounded-full border-2 border-[#FAF7F2] overflow-hidden flex items-center justify-center relative">
        {renderAvatar()}
      </div>
    </div>
  );
}
