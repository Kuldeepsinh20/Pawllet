import React, { useState, useRef } from 'react';
import PetAvatar from '../components/PetAvatar';
import { Bone, Calendar, MapPin, Phone, ChevronDown, AlertCircle } from 'lucide-react';
import { calculateAge } from '../utils/calculateAge';
import { speciesOptions } from '../data/initialData';

// ─── Inline error message ─────────────────────────────────────────────────────
function FieldError({ message }) {
  if (!message) return null;
  return (
    <p className="flex items-center gap-1 text-xs font-semibold text-red-600 mt-1">
      <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
      {message}
    </p>
  );
}

// ─── Input wrapper with error state ──────────────────────────────────────────
function FieldWrapper({ label, required, error, children }) {
  return (
    <div>
      <label className="text-sm font-semibold text-[#1A2748] block mb-1">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      <FieldError message={error} />
    </div>
  );
}

export default function ProfilePage({ petData, onChange, onNext, onCancel, isEditing = false }) {
  const [errors, setErrors] = useState({});

  // Dynamic age from DOB
  const calculatedAge = calculateAge(petData.dob);

  // ─── Refs for scroll-to-error ─────────────────────────────────────────────
  const refs = {
    species: useRef(null),
    name: useRef(null),
    breed: useRef(null),
    dob: useRef(null),
    place: useRef(null),
    height: useRef(null),
    weight: useRef(null),
    gender: useRef(null),
    ownerName: useRef(null),
    ownerContact: useRef(null),
    ownerAadhar: useRef(null),
    address: useRef(null),
  };

  // ─── Validate ─────────────────────────────────────────────────────────────
  const validate = () => {
    const newErrors = {};

    if (!petData.species) newErrors.species = 'Species is required.';
    if (!petData.name?.trim()) newErrors.name = 'Pet name is required.';
    if (!petData.breed?.trim()) newErrors.breed = 'Breed is required.';
    if (!petData.dob) newErrors.dob = 'Date of birth is required.';
    if (!petData.place?.trim()) newErrors.place = 'Place is required.';
    if (!petData.height?.toString().trim()) newErrors.height = 'Height is required.';
    if (!petData.weight?.toString().trim()) newErrors.weight = 'Weight is required.';
    if (!petData.gender) newErrors.gender = 'Gender is required.';
    if (!petData.ownerName?.trim()) newErrors.ownerName = 'Owner name is required.';
    if (!petData.ownerContact?.trim()) newErrors.ownerContact = 'Owner contact is required.';
    // ownerAadhar is OPTIONAL — no validation
    if (!petData.address?.trim()) newErrors.address = 'Address is required.';

    setErrors(newErrors);

    // Scroll to first error
    const firstErrorKey = Object.keys(newErrors)[0];
    if (firstErrorKey && refs[firstErrorKey]?.current) {
      refs[firstErrorKey].current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validate()) {
      onNext();
    }
  };

  // ─── Field ring class helper ──────────────────────────────────────────────
  const ring = (field) =>
    errors[field]
      ? 'border-red-400 ring-2 ring-red-300/50'
      : 'border-[#DECFA9] focus-within:border-[#B58A32] focus-within:ring-2 focus-within:ring-[#B58A32]/20';

  return (
    <div className="w-full max-w-[1400px] mx-auto pb-10">
      {/* Main Dossier Card */}
      <div className="relative bg-white/95 rounded-[28px] border-2 border-[#EADFCB] shadow-card p-8 lg:p-10">

        {/* Card Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-[26px] font-extrabold text-[#141E38] tracking-tight">
            1. Pet Personal Dossier {isEditing && <span className="text-sm font-bold text-[#8C6B1C] ml-2">(Editing)</span>}
          </h2>
          <div className="px-5 py-1 rounded-full bg-[#FBF7F0] border border-[#DFCFA8] text-xs font-bold text-[#6B5A3D] uppercase tracking-wider">
            {isEditing ? 'Editing' : 'Profile'}
          </div>
        </div>

        {/* ── Avatar + Species + Pet Details ── */}
        <div className="flex flex-col lg:flex-row items-start gap-8 mb-8">
          {/* Avatar */}
          <div className="flex flex-col items-center flex-shrink-0 gap-3">
            <PetAvatar species={petData.species} className="w-[160px] h-[160px]" />
            <span className="text-xs text-[#8A7550] font-medium text-center max-w-[140px]">
              {petData.species ? petData.species : 'Select a species above'}
            </span>
          </div>

          {/* Details grid */}
          <div className="flex-1 w-full space-y-5">
            {/* Species — FIRST required field */}
            <div ref={refs.species}>
              <FieldWrapper label="Species" required error={errors.species}>
                <div className={`relative flex items-center bg-white border rounded-xl shadow-xs ${ring('species')}`}>
                  <select
                    value={petData.species}
                    onChange={(e) => {
                      onChange('species', e.target.value);
                      if (errors.species) setErrors((prev) => ({ ...prev, species: '' }));
                    }}
                    className="w-full py-3 px-3.5 text-sm font-semibold text-[#1A2748] bg-transparent outline-none cursor-pointer appearance-none"
                  >
                    <option value="">Select species</option>
                    {speciesOptions.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-[#8C7651] absolute right-3 pointer-events-none" />
                </div>
              </FieldWrapper>
            </div>

            {/* Row 1: Pet Name & Breed */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div ref={refs.name}>
                <FieldWrapper label="Pet Name" required error={errors.name}>
                  <input
                    type="text"
                    value={petData.name}
                    onChange={(e) => {
                      onChange('name', e.target.value);
                      if (errors.name) setErrors((prev) => ({ ...prev, name: '' }));
                    }}
                    placeholder="e.g. Buddy"
                    className={`w-full py-3 px-3.5 text-sm font-semibold text-[#1A2748] bg-white border rounded-xl outline-none shadow-xs transition-all ${ring('name')}`}
                  />
                </FieldWrapper>
              </div>

              <div ref={refs.breed}>
                <FieldWrapper label="Breed" required error={errors.breed}>
                  <div className={`flex items-center bg-white border rounded-xl py-3 px-3.5 shadow-xs transition-all ${ring('breed')}`}>
                    <Bone className="w-4 h-4 text-[#8C7651] mr-2 flex-shrink-0" />
                    <input
                      type="text"
                      value={petData.breed}
                      onChange={(e) => {
                        onChange('breed', e.target.value);
                        if (errors.breed) setErrors((prev) => ({ ...prev, breed: '' }));
                      }}
                      placeholder="e.g. Golden Retriever"
                      className="w-full text-sm font-semibold text-[#1A2748] bg-transparent outline-none"
                    />
                  </div>
                </FieldWrapper>
              </div>
            </div>

            {/* Row 2: DOB & Place */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div ref={refs.dob}>
                <FieldWrapper label="Date of Birth" required error={errors.dob}>
                  <div className={`relative flex items-center bg-white border rounded-xl shadow-xs transition-all ${ring('dob')}`}>
                    <input
                      type="date"
                      value={petData.dob}
                      onChange={(e) => {
                        onChange('dob', e.target.value);
                        if (errors.dob) setErrors((prev) => ({ ...prev, dob: '' }));
                      }}
                      className="w-full py-3 px-3.5 text-sm font-semibold text-[#1A2748] bg-transparent outline-none cursor-pointer"
                    />
                    <Calendar className="w-4 h-4 text-[#8C7651] absolute right-3 pointer-events-none" />
                  </div>
                </FieldWrapper>
              </div>

              <div ref={refs.place}>
                <FieldWrapper label="Place" required error={errors.place}>
                  <div className={`flex items-center bg-white border rounded-xl py-3 px-3.5 shadow-xs transition-all ${ring('place')}`}>
                    <MapPin className="w-4 h-4 text-[#8C7651] mr-2 flex-shrink-0" />
                    <input
                      type="text"
                      value={petData.place}
                      onChange={(e) => {
                        onChange('place', e.target.value);
                        if (errors.place) setErrors((prev) => ({ ...prev, place: '' }));
                      }}
                      placeholder="City, State"
                      className="w-full text-sm font-semibold text-[#1A2748] bg-transparent outline-none"
                    />
                  </div>
                </FieldWrapper>
              </div>
            </div>

            {/* Row 3: Age (auto) & Height */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="text-sm font-semibold text-[#1A2748] block mb-1">
                  Age <span className="text-[#8A7550] font-normal text-xs">(auto-calculated)</span>
                </label>
                <div className="bg-[#FAF7F2] border border-[#DECFA9] rounded-xl py-3 px-3.5 text-sm font-bold text-[#141E38] shadow-xs select-none min-h-[46px] flex items-center">
                  {calculatedAge || <span className="text-[#A09070] font-normal italic">Enter DOB above</span>}
                </div>
              </div>

              <div ref={refs.height}>
                <FieldWrapper label="Height" required error={errors.height}>
                  <div className={`flex items-center bg-white border rounded-xl py-3 px-3.5 shadow-xs transition-all ${ring('height')}`}>
                    <input
                      type="text"
                      value={petData.height}
                      onChange={(e) => {
                        onChange('height', e.target.value);
                        if (errors.height) setErrors((prev) => ({ ...prev, height: '' }));
                      }}
                      placeholder="e.g. 62"
                      className="w-full text-sm font-semibold text-[#1A2748] bg-transparent outline-none"
                    />
                    <span className="text-xs font-bold text-[#8C7651] ml-2 select-none">cm</span>
                  </div>
                </FieldWrapper>
              </div>
            </div>

            {/* Row 4: Weight & Gender */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div ref={refs.weight}>
                <FieldWrapper label="Weight" required error={errors.weight}>
                  <div className={`flex items-center bg-white border rounded-xl py-3 px-3.5 shadow-xs transition-all ${ring('weight')}`}>
                    <input
                      type="text"
                      value={petData.weight}
                      onChange={(e) => {
                        onChange('weight', e.target.value);
                        if (errors.weight) setErrors((prev) => ({ ...prev, weight: '' }));
                      }}
                      placeholder="e.g. 29"
                      className="w-full text-sm font-semibold text-[#1A2748] bg-transparent outline-none"
                    />
                    <span className="text-xs font-bold text-[#8C7651] ml-2 select-none">kg</span>
                  </div>
                </FieldWrapper>
              </div>

              <div ref={refs.gender}>
                <FieldWrapper label="Gender" required error={errors.gender}>
                  <div className={`flex items-center h-[46px] px-3.5 bg-white border rounded-xl gap-8 shadow-xs transition-all ${ring('gender')}`}>
                    {['Male', 'Female'].map((g) => (
                      <label key={g} className="flex items-center gap-2 cursor-pointer group">
                        <input
                          type="radio"
                          name="gender"
                          value={g}
                          checked={petData.gender === g}
                          onChange={(e) => {
                            onChange('gender', e.target.value);
                            if (errors.gender) setErrors((prev) => ({ ...prev, gender: '' }));
                          }}
                          className="w-4 h-4 accent-[#1A2748] cursor-pointer"
                        />
                        <span className="text-sm font-semibold text-[#1A2748] group-hover:text-black">
                          {g}
                        </span>
                      </label>
                    ))}
                  </div>
                </FieldWrapper>
              </div>
            </div>
          </div>
        </div>

        {/* ── Owner Information (Mint Card) ── */}
        <div className="bg-[#D3EDE2] border border-[#BCE2D3] rounded-[24px] p-7 shadow-xs">
          <h3 className="text-base font-extrabold text-[#1A2748] mb-5">Owner Information</h3>
          <div className="space-y-5">
            {/* Owner Name & Contact */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div ref={refs.ownerName}>
                <FieldWrapper label="Owner Name" required error={errors.ownerName}>
                  <input
                    type="text"
                    value={petData.ownerName}
                    onChange={(e) => {
                      onChange('ownerName', e.target.value);
                      if (errors.ownerName) setErrors((prev) => ({ ...prev, ownerName: '' }));
                    }}
                    placeholder="Full name"
                    className={`w-full py-3 px-3.5 text-sm font-semibold text-[#1A2748] bg-white border rounded-xl outline-none shadow-xs transition-all ${ring('ownerName')}`}
                  />
                </FieldWrapper>
              </div>

              <div ref={refs.ownerContact}>
                <FieldWrapper label="Owner Contact" required error={errors.ownerContact}>
                  <div className={`flex items-center bg-white border rounded-xl py-3 px-3.5 shadow-xs transition-all ${ring('ownerContact')}`}>
                    <Phone className="w-4 h-4 text-[#8C7651] mr-2 flex-shrink-0" />
                    <input
                      type="text"
                      value={petData.ownerContact}
                      onChange={(e) => {
                        onChange('ownerContact', e.target.value);
                        if (errors.ownerContact) setErrors((prev) => ({ ...prev, ownerContact: '' }));
                      }}
                      placeholder="+91 98765-43210"
                      className="w-full text-sm font-semibold text-[#1A2748] bg-transparent outline-none"
                    />
                  </div>
                </FieldWrapper>
              </div>
            </div>

            {/* Aadhar */}
            <div>
              <FieldWrapper label="Owner Aadhar Card" required={false} error="">
                <input
                  type="text"
                  value={petData.ownerAadhar}
                  onChange={(e) => onChange('ownerAadhar', e.target.value)}
                  placeholder="XXXX-XXXX-XXXX (optional)"
                  className="w-full py-3 px-3.5 text-sm font-semibold text-[#1A2748] bg-white border border-[#DECFA9] rounded-xl outline-none shadow-xs focus:border-[#B58A32] focus:ring-2 focus:ring-[#B58A32]/20 transition-all"
                />
              </FieldWrapper>
            </div>

            {/* Address */}
            <div ref={refs.address}>
              <FieldWrapper label="Location / Address" required error={errors.address}>
                <textarea
                  rows={2}
                  value={petData.address}
                  onChange={(e) => {
                    onChange('address', e.target.value);
                    if (errors.address) setErrors((prev) => ({ ...prev, address: '' }));
                  }}
                  placeholder="Street, City, State, PIN"
                  className={`w-full py-3 px-3.5 text-sm font-semibold text-[#1A2748] bg-white border rounded-xl outline-none shadow-xs resize-y transition-all ${ring('address')}`}
                />
              </FieldWrapper>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom Action Bar ── */}
      <div className="flex items-center justify-between mt-6 px-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2.5 rounded-xl border border-[#1A2748] bg-white hover:bg-[#FAF7F2] text-[#1A2748] text-sm font-bold shadow-xs transition-all active:scale-95 cursor-pointer"
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={handleNext}
          className="px-7 py-2.5 rounded-xl bg-[#14264F] hover:bg-[#0D1C3D] text-white text-sm font-bold shadow-md flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
        >
          <span>Next: Health & Documents</span>
          <span className="text-base font-bold">→</span>
        </button>
      </div>
    </div>
  );
}
