import React from 'react';
import { AlertCircle, X, RotateCcw } from 'lucide-react';

export default function ResetConfirmModal({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fadeIn">
      <div className="bg-[#FAF7F2] border-2 border-[#D9B045] rounded-2xl shadow-xl max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#85735B] hover:text-[#1A2748] p-1 rounded-full"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-700 flex-shrink-0">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#141E38] tracking-tight">
              Reset Pet Dossier?
            </h3>
            <p className="text-sm text-[#6C5B42] mt-1.5 leading-relaxed">
              This will reset all edits back to Buddy's default registered dossier data. Any unsaved modifications will be reverted.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-sm font-semibold text-[#5A4B35] hover:bg-[#EDE3CE] transition-colors"
          >
            Keep Editing
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-4 py-2 rounded-xl bg-[#9B2C2C] hover:bg-[#802222] text-white text-sm font-bold shadow-sm flex items-center gap-2 transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset to Default</span>
          </button>
        </div>
      </div>
    </div>
  );
}
