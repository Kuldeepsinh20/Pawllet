import React, { useState } from 'react';
import {
  Stethoscope,
  Pill,
  Scissors,
  Calendar,
  ChevronDown,
  ChevronLeft,
  Syringe,
  Apple,
  Bug,
} from 'lucide-react';
import UploadCard from '../components/UploadCard';
import TagInput from '../components/TagInput';
import { routineOptions } from '../data/initialData';

export default function HealthDocumentsPage({
  petData,
  onChange,
  onAddVaccine,
  onRemoveVaccine,
  onAddAllergy,
  onRemoveAllergy,
  onAddDisease,
  onRemoveDisease,
  onAddMedication,
  onRemoveMedication,
  onAddFood,
  onRemoveFood,
  onFileUpload,
  onBack,
  onComplete,
  isEditing = false,
}) {
  const [showRoutineDropdown, setShowRoutineDropdown] = useState(false);

  return (
    <div className="w-full max-w-[1400px] mx-auto pb-10 space-y-6">

      {/* ═══════════════════════════════════════════════════════════
          SECTION 2: HEALTH & WELLNESS JOURNAL
      ═══════════════════════════════════════════════════════════ */}
      <div className="relative bg-white/95 rounded-[28px] border-2 border-[#EADFCB] shadow-card p-8 lg:p-10">
        {/* Floating left back arrow */}
        <button
          type="button"
          onClick={onBack}
          title="Back to Profile"
          className="absolute -left-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-[#DCAE4F] hover:bg-[#C89A38] text-[#141E38] flex items-center justify-center shadow-lg border border-[#C59632] transition-transform hover:scale-110 active:scale-95 z-10 cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
        </button>

        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-[24px] font-extrabold text-[#141E38] tracking-tight">
            2. Health & Wellness Journal
          </h2>
          <div className="px-5 py-1 rounded-full bg-[#FBF7F0] border border-[#DFCFA8] text-xs font-bold text-[#6B5A3D] uppercase tracking-wider">
            Health & Documents
          </div>
        </div>

        {/* Optional notice */}
        <p className="text-xs text-[#8A7550] italic mb-6">
          All fields on this page are optional. You can proceed directly to "Complete & Record Pet".
        </p>

        {/* ── Two-column grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

          {/* LEFT COLUMN */}
          <div className="space-y-6">

            {/* Vaccines */}
            <TagInput
              label="Vaccines"
              icon={<Syringe className="w-4 h-4 text-[#2E7D59]" />}
              tags={Array.isArray(petData.vaccines) ? petData.vaccines : []}
              onAdd={onAddVaccine}
              onRemove={onRemoveVaccine}
              placeholder="Type vaccine & Enter"
              colorClass="bg-[#EFC967] border-[#DFB342] text-[#4F3606]"
              containerColorClass="bg-[#FAF7F2] border-[#DECFA9]"
            />

            {/* Diseases */}
            <TagInput
              label="Diseases"
              icon={<Stethoscope className="w-4 h-4 text-[#2E7D59]" />}
              tags={Array.isArray(petData.diseases) ? petData.diseases : []}
              onAdd={onAddDisease}
              onRemove={onRemoveDisease}
              placeholder="Type disease & Enter"
              colorClass="bg-[#FCC2C2] border-[#F4A0A0] text-[#7B1D1D]"
              containerColorClass="bg-[#FFF0F0] border-[#F4C0C0]"
            />

            {/* Medications */}
            <TagInput
              label="Medications"
              icon={<Pill className="w-4 h-4 text-[#8C6B1C]" />}
              tags={Array.isArray(petData.medications) ? petData.medications : []}
              onAdd={onAddMedication}
              onRemove={onRemoveMedication}
              placeholder="Type medication & Enter"
              colorClass="bg-[#F4DB96] border-[#E0C070] text-[#66490C]"
              containerColorClass="bg-[#FDFBEC] border-[#EDE0A0]"
            />

          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-6">

            {/* Allergies */}
            <TagInput
              label="Allergies"
              tags={Array.isArray(petData.allergies) ? petData.allergies : []}
              onAdd={onAddAllergy}
              onRemove={onRemoveAllergy}
              placeholder="Type allergy & Enter"
              colorClass="bg-[#FBBF8C] border-[#F0A06C] text-[#6B2C10]"
              containerColorClass="bg-[#FFF5EC] border-[#F0D0B8]"
            />

            {/* Food */}
            <TagInput
              label="Food"
              icon={<Apple className="w-4 h-4 text-[#2E7D59]" />}
              tags={Array.isArray(petData.food) ? petData.food : []}
              onAdd={onAddFood}
              onRemove={onRemoveFood}
              placeholder="Type food & Enter"
              colorClass="bg-[#C8EAD0] border-[#9ED4B0] text-[#1A5A30]"
              containerColorClass="bg-[#EFF8F2] border-[#BCE8CE]"
            />

            {/* Grooming Details */}
            <div>
              <div className="flex items-center gap-1.5 text-sm font-bold text-[#141E38] mb-1.5">
                <span>Grooming Details</span>
                <Scissors className="w-4 h-4 text-[#663FAF]" />
              </div>
              <textarea
                rows={2}
                value={petData.grooming || ''}
                onChange={(e) => onChange('grooming', e.target.value)}
                placeholder="e.g. Monthly Bath, Nail Trimming..."
                className="w-full py-2.5 px-3.5 text-sm font-semibold text-[#3C1E70] bg-[#E3D4FA] border border-[#CFBCF2] rounded-xl outline-none focus:ring-2 focus:ring-[#754EB8]/20 shadow-xs resize-none"
              />
            </div>

            {/* Checkups Routine & Last Visit */}
            <div className="grid grid-cols-2 gap-4">
              {/* Routine Dropdown */}
              <div className="relative">
                <div className="flex items-center gap-1 text-xs font-bold text-[#141E38] mb-1">
                  <span>Checkup Routine</span>
                  <Calendar className="w-3.5 h-3.5 text-[#8C7651]" />
                </div>
                <div
                  onClick={() => setShowRoutineDropdown(!showRoutineDropdown)}
                  className="flex items-center justify-between bg-white border border-[#DECFA9] rounded-xl py-2.5 px-3 cursor-pointer shadow-xs hover:border-[#B58A32] transition-colors"
                >
                  <span className="text-xs font-bold text-[#141E38]">
                    {petData.checkupRoutine || 'Select...'}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-[#8C7651]" />
                </div>

                {showRoutineDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#DFCEAE] rounded-xl shadow-lg z-30 py-1 max-h-40 overflow-y-auto">
                    <div
                      onClick={() => { onChange('checkupRoutine', ''); setShowRoutineDropdown(false); }}
                      className="px-3 py-1.5 text-xs cursor-pointer hover:bg-[#F8F3E9] text-[#A09070] italic"
                    >
                      None
                    </div>
                    {routineOptions.map((opt) => (
                      <div
                        key={opt}
                        onClick={() => { onChange('checkupRoutine', opt); setShowRoutineDropdown(false); }}
                        className={`px-3 py-1.5 text-xs cursor-pointer hover:bg-[#F8F3E9] ${
                          petData.checkupRoutine === opt ? 'font-bold text-[#8C6B1C] bg-[#FAF5EB]' : 'text-[#141E38]'
                        }`}
                      >
                        {opt}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Last Visit */}
              <div>
                <div className="flex items-center gap-1 text-xs font-bold text-[#141E38] mb-1">
                  <span>Last Visit</span>
                  <Calendar className="w-3.5 h-3.5 text-[#8C7651]" />
                </div>
                <div className="relative flex items-center bg-white border border-[#DECFA9] rounded-xl py-2.5 px-3 shadow-xs">
                  <input
                    type="date"
                    value={petData.lastVisit || ''}
                    onChange={(e) => onChange('lastVisit', e.target.value)}
                    className="w-full text-xs font-bold text-[#141E38] bg-transparent outline-none cursor-pointer"
                  />
                  <Calendar className="w-3.5 h-3.5 text-[#8C7651] absolute right-2.5 pointer-events-none" />
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 3: OFFICIAL VAULT
      ═══════════════════════════════════════════════════════════ */}
      <div className="bg-white/95 rounded-[28px] border-2 border-[#EADFCB] shadow-card p-8 lg:p-10">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-[24px] font-extrabold text-[#141E38] tracking-tight">
            3. Official Vault
          </h2>
          <div className="px-5 py-1 rounded-full bg-[#FBF7F0] border border-[#DFCFA8] text-xs font-bold text-[#6B5A3D] uppercase tracking-wider">
            Documents
          </div>
        </div>

        <p className="text-xs text-[#8A7550] italic mb-6">
          Upload any documents you have available. All document fields are optional.
        </p>

        {/* Three document cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          <UploadCard
            title="Birth Certificate"
            docKey="birthCert"
            docState={
              Array.isArray(petData.documents)
                ? petData.documents.find((d) => d.key === 'birthCert') || null
                : null
            }
            onFileUpload={onFileUpload}
            type="folder"
          />
          <UploadCard
            title="Vaccination Record"
            docKey="vaccinationRecord"
            docState={
              Array.isArray(petData.documents)
                ? petData.documents.find((d) => d.key === 'vaccinationRecord') || null
                : null
            }
            onFileUpload={onFileUpload}
            type="folder"
          />
          <UploadCard
            title="Insurance Policy"
            docKey="insurancePolicy"
            docState={
              Array.isArray(petData.documents)
                ? petData.documents.find((d) => d.key === 'insurancePolicy') || null
                : null
            }
            onFileUpload={onFileUpload}
            type="folder"
          />
        </div>
      </div>

      {/* ── Bottom Action Bar ── */}
      <div className="flex items-center justify-between mt-6 px-2">
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-2.5 rounded-xl border border-[#1A2748] bg-white hover:bg-[#FAF7F2] text-[#1A2748] text-sm font-bold shadow-xs flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
        >
          <span className="text-base font-bold">←</span>
          <span>Back to Profile</span>
        </button>

        <button
          type="button"
          onClick={onComplete}
          className="px-8 py-2.5 rounded-xl bg-[#CFA255] hover:bg-[#B88C3C] text-[#141E38] text-sm font-bold shadow-md flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
        >
          <span>{isEditing ? 'Update Pet Record' : 'Complete & Record Pet'}</span>
          <span>💾</span>
        </button>
      </div>
    </div>
  );
}
