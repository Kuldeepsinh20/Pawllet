import React, { useEffect, useState } from 'react';
import { CheckCircle, PlusCircle, X, ShieldCheck, Sparkles } from 'lucide-react';
import PetAvatar from './PetAvatar';

export default function SuccessModal({ isOpen, onClose, petData, onStartNewRecord, isEditing = false }) {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    if (isOpen) {
      const colors = ['#D4A02A', '#2E7D59', '#1A2748', '#FF829B', '#CFA255', '#E9C365'];
      const newParticles = Array.from({ length: 40 }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 80,
        size: Math.random() * 8 + 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
      }));
      setParticles(newParticles);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      {/* Confetti particles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-[60]">
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute rounded-sm animate-bounce"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: `${p.size}px`,
              height: `${p.size * 0.6}px`,
              backgroundColor: p.color,
              transform: `rotate(${p.rotation}deg)`,
              opacity: 0.85,
            }}
          />
        ))}
      </div>

      <div className="bg-[#FAF7F2] border-2 border-[#D9B045] rounded-3xl shadow-2xl max-w-lg w-full p-7 relative overflow-hidden text-[#1A2748] z-[70]">
        {/* Decorative bg icon */}
        <div className="absolute -right-8 -bottom-8 text-[#CFA255]/10 pointer-events-none">
          <Sparkles className="w-56 h-56" />
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-[#85735B] hover:text-[#1A2748] p-1.5 rounded-full hover:bg-[#EEDFCA] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-4 mb-5">
          <div className="w-14 h-14 rounded-2xl bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-600 shadow-sm flex-shrink-0">
            <CheckCircle className="w-8 h-8" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 mb-1 border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5" /> {isEditing ? 'Updated & Recorded' : 'Saved & Recorded'}
            </div>
            <h3 className="text-2xl font-black text-[#141E38] tracking-tight">
              {isEditing ? 'Pet Record Updated!' : 'Pet Record Created!'}
            </h3>
          </div>
        </div>

        {/* Summary card */}
        <div className="bg-white border border-[#DFCEAE] rounded-2xl p-4 shadow-sm mb-6">
          <div className="flex items-center gap-4 border-b border-[#F0E6D4] pb-4 mb-4">
            <PetAvatar species={petData.species} className="w-[64px] h-[64px]" />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="text-xl font-bold text-[#141E38]">{petData.name || '—'}</h4>
                {petData.breed && (
                  <span className="text-xs px-2 py-0.5 rounded-md bg-[#F5EEDD] text-[#846522] font-semibold border border-[#DFCEAE]">
                    {petData.breed}
                  </span>
                )}
                {petData.gender && (
                  <span className="text-xs px-2 py-0.5 rounded-md bg-[#E2F3EA] text-emerald-800 font-semibold border border-[#BDE3CC]">
                    {petData.gender}
                  </span>
                )}
              </div>
              <p className="text-sm text-[#6C5B42] mt-0.5 font-semibold">{petData.species}</p>
              {petData.ownerName && (
                <p className="text-sm text-[#6C5B42] mt-0.5">
                  Owner: <strong className="text-[#141E38]">{petData.ownerName}</strong>
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 text-sm">
            <div className="bg-[#FAF7F2] p-2.5 rounded-xl border border-[#EFE5D3]">
              <span className="text-xs text-[#7A6B54] font-medium block">Date of Birth</span>
              <strong className="text-[#141E38] text-sm">{petData.dob || '—'}</strong>
            </div>
            <div className="bg-[#FAF7F2] p-2.5 rounded-xl border border-[#EFE5D3]">
              <span className="text-xs text-[#7A6B54] font-medium block">Height / Weight</span>
              <strong className="text-[#141E38] text-sm">
                {petData.height ? `${petData.height} cm` : '—'} / {petData.weight ? `${petData.weight} kg` : '—'}
              </strong>
            </div>
            <div className="bg-[#FAF7F2] p-2.5 rounded-xl border border-[#EFE5D3]">
              <span className="text-xs text-[#7A6B54] font-medium block">Vaccines</span>
              <strong className="text-[#141E38] text-sm">
                {Array.isArray(petData.vaccines) ? petData.vaccines.length : 0} logged
              </strong>
            </div>
          </div>

          <div className="mt-3 text-xs text-[#715F47] flex items-center justify-between pt-2 border-t border-[#F2EAE0]">
            <span>
              {Array.isArray(petData.vaccines) && petData.vaccines.length > 0
                ? `Vaccines: ${petData.vaccines.join(', ')}`
                : 'No vaccines recorded'}
            </span>
            <span>
              {Array.isArray(petData.documents) && petData.documents.length > 0
                ? `${petData.documents.length} document(s) attached`
                : 'No documents'}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onStartNewRecord}
            className="px-5 py-2.5 rounded-xl bg-[#CFA255] hover:bg-[#BA8E42] active:scale-95 text-[#141E38] font-bold text-sm shadow-md flex items-center gap-2 transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4 stroke-[2.5]" />
            <span>{isEditing ? 'Start New Record' : 'Record Another Pet'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

