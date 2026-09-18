import React, { useState, useEffect } from 'react';
import { X, Search, ChevronLeft, PawPrint, User, Heart, FileText, Download, Trash2, Loader2, AlertCircle, Tag, Pencil } from 'lucide-react';
import PetAvatar from './PetAvatar';
import { calculateAge } from '../utils/calculateAge';
import api from '../services/api';

// ─── Species emoji map ────────────────────────────────────────────────────────
const speciesEmoji = {
  Dogs: '🐕',
  Cats: '🐈',
  Birds: '🦜',
  'Small mammals': '🐹',
  'Farm Animals': '🐄',
};

// ─── Pet Card ─────────────────────────────────────────────────────────────────
function PetCard({ pet, onClick, onEdit, onDelete }) {
  const emoji = speciesEmoji[pet.species] || '🐾';
  return (
    <div className="w-full flex items-center bg-white border border-[#DECFA9] rounded-2xl p-4 shadow-sm hover:shadow-md hover:border-[#CFA255] transition-all group">
      <button
        type="button"
        onClick={() => onClick(pet)}
        className="flex-1 min-w-0 text-left flex items-center gap-4 cursor-pointer"
      >
        <div className="flex-shrink-0">
          <PetAvatar species={pet.species} className="w-[60px] h-[60px]" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-lg">{emoji}</span>
            <h3 className="text-base font-extrabold text-[#141E38] truncate">{pet.name || '(Unnamed)'}</h3>
            {pet.gender && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#EDF5F0] text-[#2E7D59] font-semibold border border-[#BDE3CC]">
                {pet.gender}
              </span>
            )}
          </div>
          <p className="text-xs text-[#6C5B42] font-medium">{pet.species}</p>
          {pet.breed && <p className="text-xs text-[#8A7550]">{pet.breed}</p>}
          {pet.dob && (
            <p className="text-xs text-[#A09070] mt-0.5">{pet.age || calculateAge(pet.dob)}</p>
          )}
          {pet.owner_name && (
            <p className="text-xs text-[#9E8B6D] mt-0.5">Owner: {pet.owner_name}</p>
          )}
        </div>
        <div className="flex-shrink-0 text-[#CFA255] group-hover:translate-x-1 transition-transform mr-2">
          <ChevronLeft className="w-5 h-5 rotate-180" />
        </div>
      </button>

      {/* Actions */}
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onEdit(pet);
          }}
          title="Edit pet record"
          className="p-2 text-[#8C6B1C] hover:text-[#141E38] hover:bg-[#FAF7F2] rounded-xl transition-colors cursor-pointer"
        >
          <Pencil className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(pet);
          }}
          title="Delete pet record"
          className="p-2 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// ─── Pet Detail View ──────────────────────────────────────────────────────────
function PetDetail({ petId, onBack, onDeleted, onEdit }) {
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        setLoading(true);
        setError(null);
        const data = await api.getPet(petId);
        if (mounted) setPet(data);
      } catch (err) {
        if (mounted) setError(err.message || 'Failed to load pet details.');
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, [petId]);

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete ${pet?.name || 'this pet'}?`)) return;
    try {
      setDeleting(true);
      await api.deletePet(petId);
      onDeleted(petId);
    } catch (err) {
      alert(err.message || 'Failed to delete pet.');
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-[#CFA255] animate-spin mb-3" />
        <p className="text-sm font-semibold text-[#8A7550]">Loading pet details...</p>
      </div>
    );
  }

  if (error || !pet) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <AlertCircle className="w-10 h-10 text-rose-500 mb-3" />
        <p className="text-sm font-bold text-rose-700 mb-2">{error || 'Pet not found'}</p>
        <button
          type="button"
          onClick={onBack}
          className="text-xs font-bold text-[#8C6B1C] hover:underline"
        >
          ← Back to list
        </button>
      </div>
    );
  }

  const age = pet.age || calculateAge(pet.dob);

  const Section = ({ title, icon, children, bg = 'bg-[#FAF7F2]', border = 'border-[#EADFCB]' }) => (
    <div className={`${bg} border ${border} rounded-2xl p-5`}>
      <div className="flex items-center gap-2 mb-4">
        {icon}
        <h3 className="text-sm font-extrabold text-[#141E38] uppercase tracking-wide">{title}</h3>
      </div>
      {children}
    </div>
  );

  const Field = ({ label, value }) => {
    if (!value && value !== 0) return null;
    return (
      <div className="mb-2.5">
        <span className="text-xs font-medium text-[#8A7550] block">{label}</span>
        <span className="text-sm font-bold text-[#141E38]">{value}</span>
      </div>
    );
  };

  const TagList = ({ tags }) => {
    if (!tags || tags.length === 0) return <span className="text-xs text-[#A09070] italic">None recorded</span>;
    return (
      <div className="flex flex-wrap gap-1.5">
        {tags.map((t, idx) => (
          <span key={idx} className="inline-flex items-center px-2.5 py-1 rounded-lg bg-[#EFC967] border border-[#DFB342] text-xs font-bold text-[#4F3606]">
            {t}
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full">
      {/* Detail header */}
      <div className="flex items-center justify-between gap-3 mb-5">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm font-bold text-[#8C6B1C] hover:text-[#141E38] transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to list
        </button>

        <div className="flex items-center gap-2">
          {onEdit && (
            <button
              type="button"
              onClick={() => onEdit(pet)}
              className="flex items-center gap-1.5 text-xs font-bold text-[#8C6B1C] hover:text-[#141E38] bg-[#FAF5EB] hover:bg-[#F2E8D7] border border-[#DECFA9] px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
            >
              <Pencil className="w-3.5 h-3.5" />
              <span>Edit Record</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="flex items-center gap-1 text-xs font-bold text-rose-600 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
          >
            {deleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
            <span>Delete Record</span>
          </button>
        </div>
      </div>

      {/* Pet hero card */}
      <div className="bg-white border border-[#DECFA9] rounded-2xl p-5 mb-4 flex items-center gap-4">
        <PetAvatar species={pet.species} className="w-[80px] h-[80px]" />
        <div>
          <h2 className="text-xl font-extrabold text-[#141E38]">{pet.name || '(Unnamed)'}</h2>
          <p className="text-sm text-[#6C5B42]">{pet.species} • {pet.breed}</p>
          <p className="text-xs text-[#A09070] mt-0.5">{age}</p>
          {pet.created_at && (
            <p className="text-xs text-[#B5A080] mt-1">
              Recorded: {new Date(pet.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-3 overflow-y-auto flex-1 pr-1">
        {/* Categories (Derived tags) */}
        {pet.categories && pet.categories.length > 0 && (
          <Section title="Auto-Generated Tags" icon={<Tag className="w-4 h-4 text-[#D99A26]" />} bg="bg-[#FFFDF7]" border="border-[#EBDAB4]">
            <div className="flex flex-wrap gap-2">
              {pet.categories.map((c, i) => (
                <div key={i} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FCEFCE] border border-[#E9C87B] text-xs font-bold text-[#573E0E]">
                  <span className="text-[10px] uppercase tracking-wider text-[#9E782E] opacity-75">{c.type}:</span>
                  <span>{c.value}</span>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Pet Info */}
        <Section title="Pet Information" icon={<PawPrint className="w-4 h-4 text-[#CFA255]" />}>
          <div className="grid grid-cols-2 gap-x-6">
            <Field label="Species" value={pet.species} />
            <Field label="Gender" value={pet.gender} />
            <Field label="Breed" value={pet.breed} />
            <Field label="Age" value={age} />
            <Field label="Date of Birth" value={pet.dob} />
            <Field label="Place" value={pet.place} />
            <Field label="Height" value={pet.height ? `${pet.height} cm` : null} />
            <Field label="Weight" value={pet.weight ? `${pet.weight} kg` : null} />
          </div>
        </Section>

        {/* Owner Info */}
        {pet.owner && (
          <Section title="Owner Information" icon={<User className="w-4 h-4 text-[#2E7D59]" />} bg="bg-[#EEF8F4]" border="border-[#BCE2D3]">
            <div className="grid grid-cols-2 gap-x-6">
              <Field label="Owner Name" value={pet.owner.name} />
              <Field label="Contact" value={pet.owner.contact} />
              <Field label="Aadhar Card" value={pet.owner.aadhar || '(Not provided)'} />
              <Field label="Address" value={pet.owner.address} />
            </div>
          </Section>
        )}

        {/* Health */}
        <Section title="Health & Wellness" icon={<Heart className="w-4 h-4 text-[#9B4DCA]" />} bg="bg-[#F5F0FC]" border="border-[#DDD0F5]">
          <div className="space-y-3">
            <div>
              <span className="text-xs font-medium text-[#8A7550] block mb-1">Vaccines</span>
              <TagList tags={pet.vaccines} />
            </div>
            <div>
              <span className="text-xs font-medium text-[#8A7550] block mb-1">Allergies</span>
              <TagList tags={pet.allergies} />
            </div>
            <div>
              <span className="text-xs font-medium text-[#8A7550] block mb-1">Diseases</span>
              <TagList tags={pet.diseases} />
            </div>
            <div>
              <span className="text-xs font-medium text-[#8A7550] block mb-1">Medications</span>
              <TagList tags={pet.medications} />
            </div>
            <div>
              <span className="text-xs font-medium text-[#8A7550] block mb-1">Food</span>
              <TagList tags={pet.food} />
            </div>
            {pet.health?.grooming && <Field label="Grooming Details" value={pet.health.grooming} />}
            {pet.health?.routine && <Field label="Checkup Routine" value={pet.health.routine} />}
            {pet.health?.last_visit && <Field label="Last Visit" value={pet.health.last_visit} />}
          </div>
        </Section>

        {/* Documents */}
        {pet.documents && pet.documents.length > 0 && (
          <Section title="Documents" icon={<FileText className="w-4 h-4 text-[#CFA255]" />}>
            <div className="space-y-2">
              {pet.documents.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-2.5 bg-white border border-[#E5D7B7] rounded-xl text-sm">
                  <div className="flex items-center gap-2 min-w-0">
                    <FileText className="w-4 h-4 text-[#CFA255] flex-shrink-0" />
                    <div className="truncate">
                      <span className="font-semibold text-[#141E38] block truncate">{doc.document_type}</span>
                      <span className="text-xs text-[#8A7550] block truncate">
                        {doc.original_filename} ({doc.file_size ? `${Math.round(doc.file_size / 1024)} KB` : ''})
                      </span>
                    </div>
                  </div>
                  <a
                    href={api.getDocumentUrl(doc.id)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-[#1B52D8] hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-1 text-xs font-bold"
                  >
                    <Download className="w-4 h-4" />
                    <span>View</span>
                  </a>
                </div>
              ))}
            </div>
          </Section>
        )}
      </div>
    </div>
  );
}

// ─── Main ViewPetsModal ───────────────────────────────────────────────────────
export default function ViewPetsModal({ isOpen, onClose, onEditPet }) {
  const [search, setSearch] = useState('');
  const [selectedPetId, setSelectedPetId] = useState(null);
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch pets whenever modal is opened
  const fetchPets = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getPets();
      setPets(data);
    } catch (err) {
      setError(err.message || 'Failed to connect to backend.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchPets();
    } else {
      setSearch('');
      setSelectedPetId(null);
    }
  }, [isOpen]);

  const handleDeletePet = async (pet) => {
    if (!window.confirm(`Are you sure you want to delete ${pet.name || 'this pet'}?`)) return;
    try {
      await api.deletePet(pet.id);
      setPets((prev) => prev.filter((p) => p.id !== pet.id));
    } catch (err) {
      alert(err.message || 'Failed to delete pet.');
    }
  };

  const handleEdit = async (pet) => {
    try {
      const fullPet = (pet.owner && pet.categories) ? pet : await api.getPet(pet.id);
      if (onEditPet) {
        onEditPet(fullPet);
      }
    } catch (err) {
      alert(err.message || 'Failed to load pet details for editing.');
    }
  };

  const handlePetDeletedFromDetail = (id) => {
    setPets((prev) => prev.filter((p) => p.id !== id));
    setSelectedPetId(null);
  };

  const filtered = pets.filter(
    (p) =>
      (p.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (p.species || '').toLowerCase().includes(search.toLowerCase()) ||
      (p.breed || '').toLowerCase().includes(search.toLowerCase()) ||
      (p.owner_name || '').toLowerCase().includes(search.toLowerCase())
  );

  if (!isOpen) return null;

  const handleClose = () => {
    setSearch('');
    setSelectedPetId(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-[#FAF7F2] border-2 border-[#D9B045] rounded-3xl shadow-2xl w-full max-w-xl max-h-[88vh] flex flex-col text-[#1A2748] overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#EADFCB]">
          <div className="flex items-center gap-2.5">
            <PawPrint className="w-5 h-5 text-[#CFA255]" />
            <h2 className="text-xl font-extrabold text-[#141E38]">
              {selectedPetId ? 'Pet Record' : 'Stored Pets'}
            </h2>
            {!selectedPetId && (
              <span className="ml-1 px-2 py-0.5 rounded-full bg-[#EFC967] border border-[#DFB342] text-xs font-bold text-[#4F3606]">
                {pets.length}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="text-[#85735B] hover:text-[#1A2748] p-1.5 rounded-full hover:bg-[#EEDFCA] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {selectedPetId ? (
            <PetDetail
              petId={selectedPetId}
              onBack={() => setSelectedPetId(null)}
              onDeleted={handlePetDeletedFromDetail}
              onEdit={handleEdit}
            />
          ) : (
            <>
              {/* Search */}
              <div className="relative mb-4">
                <Search className="w-4 h-4 text-[#A09070] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search pets..."
                  className="w-full pl-9 pr-4 py-2.5 bg-white border border-[#DECFA9] rounded-xl text-sm text-[#141E38] placeholder-[#B5A080] outline-none focus:border-[#CFA255] focus:ring-2 focus:ring-[#CFA255]/20 shadow-xs"
                />
              </div>

              {/* Loading */}
              {loading && (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <Loader2 className="w-8 h-8 text-[#CFA255] animate-spin mb-3" />
                  <p className="text-sm font-semibold text-[#8A7550]">Loading pets from database...</p>
                </div>
              )}

              {/* Error */}
              {!loading && error && (
                <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-center my-4">
                  <AlertCircle className="w-6 h-6 text-rose-500 mx-auto mb-2" />
                  <p className="text-sm font-bold text-rose-800 mb-1">Could not load pets</p>
                  <p className="text-xs text-rose-600 mb-3">{error}</p>
                  <button
                    type="button"
                    onClick={fetchPets}
                    className="px-3 py-1.5 bg-rose-600 text-white rounded-lg text-xs font-bold hover:bg-rose-700 cursor-pointer"
                  >
                    Retry
                  </button>
                </div>
              )}

              {/* Pet list */}
              {!loading && !error && filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <PawPrint className="w-12 h-12 text-[#D8CCB8] mb-3" />
                  <p className="text-base font-bold text-[#8A7550]">
                    {pets.length === 0 ? 'No pets recorded yet.' : 'No matching pets found.'}
                  </p>
                  <p className="text-xs text-[#A09070] mt-1">
                    {pets.length === 0
                      ? 'Complete the form to record your first pet.'
                      : 'Try a different search term.'}
                  </p>
                </div>
              ) : (
                !loading && !error && (
                  <div className="space-y-3">
                    {filtered.map((pet) => (
                      <PetCard
                        key={pet.id}
                        pet={pet}
                        onClick={() => setSelectedPetId(pet.id)}
                        onEdit={handleEdit}
                        onDelete={handleDeletePet}
                      />
                    ))}
                  </div>
                )
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
