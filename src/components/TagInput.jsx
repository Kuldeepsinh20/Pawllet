import React, { useState, useRef } from 'react';
import { Plus, X } from 'lucide-react';

/**
 * TagInput – reusable chip/tag manager.
 *
 * Props:
 *   tags       – string[]
 *   onAdd      – (tag: string) => void
 *   onRemove   – (tag: string) => void
 *   placeholder – string (default "Type & press Enter")
 *   label       – string (section label)
 *   icon        – React element (optional Lucide icon)
 *   colorClass  – Tailwind classes for chip background (optional)
 */
export default function TagInput({
  tags = [],
  onAdd,
  onRemove,
  placeholder = "Type & press Enter",
  label,
  icon,
  colorClass = "bg-[#EFC967] border-[#DFB342] text-[#4F3606]",
  inputColorClass = "border-[#CFA255] bg-white text-[#141E38]",
  containerColorClass = "bg-[#FAF7F2] border-[#DECFA9]",
}) {
  const [inputValue, setInputValue] = useState('');
  const [showInput, setShowInput] = useState(false);
  const inputRef = useRef(null);

  const handleAdd = () => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;
    // Prevent duplicates (case-insensitive)
    const isDuplicate = tags.some(t => t.toLowerCase() === trimmed.toLowerCase());
    if (!isDuplicate) {
      onAdd(trimmed);
    }
    setInputValue('');
    setShowInput(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    }
    if (e.key === 'Escape') {
      setInputValue('');
      setShowInput(false);
    }
  };

  const handleShowInput = () => {
    setShowInput(true);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  return (
    <div>
      {(label || icon) && (
        <div className="flex items-center gap-1.5 text-sm font-bold text-[#141E38] mb-1.5">
          {label && <span>{label}</span>}
          {icon && icon}
        </div>
      )}

      <div className={`min-h-[52px] p-2.5 border rounded-xl flex flex-wrap items-center gap-2 shadow-xs ${containerColorClass}`}>
        {/* Existing tags */}
        {tags.map((tag) => (
          <span
            key={tag}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold shadow-2xs transition-all ${colorClass}`}
          >
            <span>{tag}</span>
            <button
              type="button"
              onClick={() => onRemove(tag)}
              className="hover:opacity-70 rounded-full transition-opacity cursor-pointer"
              title={`Remove ${tag}`}
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}

        {/* Inline input */}
        {showInput ? (
          <div className="inline-flex items-center gap-1">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              className={`text-xs py-1 px-2.5 border rounded-lg outline-none w-36 shadow-2xs ${inputColorClass}`}
            />
            <button
              type="button"
              onClick={handleAdd}
              className="w-6 h-6 rounded-lg bg-[#CFA255] hover:bg-[#B58A32] text-white flex items-center justify-center transition-colors cursor-pointer"
              title="Add"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => { setInputValue(''); setShowInput(false); }}
              className="w-6 h-6 rounded-lg border border-gray-300 text-gray-500 hover:text-gray-700 flex items-center justify-center transition-colors cursor-pointer"
              title="Cancel"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={handleShowInput}
            className="w-7 h-7 rounded-lg border border-dashed border-[#B5985C] text-[#8C6B1C] hover:text-[#141E38] hover:border-[#141E38] flex items-center justify-center transition-colors cursor-pointer"
            title="Add tag"
          >
            <Plus className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
