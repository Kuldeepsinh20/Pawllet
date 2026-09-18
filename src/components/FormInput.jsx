import React from 'react';

export default function FormInput({
  label,
  value,
  onChange,
  type = "text",
  placeholder = "",
  unit = null,
  icon: Icon = null,
  disabled = false,
  readOnly = false,
  className = "",
  inputClassName = "",
  required = false
}) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label className="text-sm font-semibold text-[#1A2748] tracking-tight">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className={`relative flex items-center bg-white border border-[#DECFA9] rounded-xl shadow-xs transition-all duration-200 focus-within:border-[#B58A32] focus-within:ring-2 focus-within:ring-[#B58A32]/20 hover:border-[#C4A96E] ${readOnly ? 'bg-[#FAF7F2]' : ''}`}>
        {Icon && (
          <div className="pl-3.5 pr-1 text-[#8C7651] flex items-center pointer-events-none">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <input
          type={type}
          value={value ?? ''}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          className={`w-full py-2.5 px-3.5 text-[15px] font-medium text-[#1A2748] bg-transparent outline-none rounded-xl placeholder-[#A89A84] ${unit ? 'pr-10' : ''} ${inputClassName}`}
        />
        {unit && (
          <div className="absolute right-3 text-sm font-semibold text-[#6E5D43] select-none">
            {unit}
          </div>
        )}
      </div>
    </div>
  );
}
