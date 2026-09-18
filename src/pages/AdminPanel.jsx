import React, { useState, useEffect, useCallback } from 'react';
import PawletLogo from '../components/PawletLogo';
import UserAvatar from '../components/UserAvatar';
import PetAvatar from '../components/PetAvatar';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { calculateAge } from '../utils/calculateAge';
import {
  PawPrint,
  Users,
  Heart,
  AlertTriangle,
  FileText,
  Search,
  ChevronLeft,
  ChevronRight,
  LogOut,
  RefreshCw,
  X,
  Trash2,
  Download,
  Eye,
  Tag,
  Filter,
  Layers,
  Sparkles,
  Calendar,
  MapPin,
  Phone,
  ShieldCheck,
  Loader2,
  AlertCircle,
} from 'lucide-react';

const speciesEmoji = {
  Dogs: '🐕',
  Cats: '🐈',
  Birds: '🦜',
  'Small mammals': '🐹',
  'Farm Animals': '🐄',
};

// ─── Individual Pet Detail Modal ──────────────────────────────────────────────
function PetDetailModal({ petId, isOpen, onClose, onPetDeleted }) {
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deletingDocId, setDeletingDocId] = useState(null);

  const fetchPet = useCallback(async () => {
    if (!petId) return;
    try {
      setLoading(true);
      setError(null);
      const data = await api.getPet(petId);
      setPet(data);
    } catch (err) {
      setError(err.message || 'Failed to load pet details.');
    } finally {
      setLoading(false);
    }
  }, [petId]);

  useEffect(() => {
    if (isOpen && petId) {
      fetchPet();
    } else {
      setPet(null);
    }
  }, [isOpen, petId, fetchPet]);

  const handleDeletePet = async () => {
    if (!window.confirm(`Are you sure you want to permanently delete ${pet?.name || 'this pet'}?`)) {
      return;
    }
    try {
      setDeleting(true);
      await api.deletePet(petId);
      if (onPetDeleted) onPetDeleted(petId);
      onClose();
    } catch (err) {
      alert(err.message || 'Failed to delete pet record.');
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteDoc = async (docId) => {
    if (!window.confirm('Delete this document from storage?')) return;
    try {
      setDeletingDocId(docId);
      await api.deleteDocument(docId);
      await fetchPet();
    } catch (err) {
      alert(err.message || 'Failed to delete document.');
    } finally {
      setDeletingDocId(null);
    }
  };

  const handleDownloadDoc = async (doc) => {
    try {
      const blob = await api.getDocumentBlob(doc.id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = doc.original_filename || 'document';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert(err.message || 'Failed to download document.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-[#FAF7F2] border-2 border-[#D9B045] rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col text-[#1A2748] overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#EADFCB] bg-white/80">
          <div className="flex items-center gap-2.5">
            <PawPrint className="w-5 h-5 text-[#CFA255]" />
            <h2 className="text-lg font-extrabold text-[#141E38]">
              {loading ? 'Pet Dossier' : pet?.name ? `${pet.name}'s Dossier` : 'Pet Dossier'}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            {pet && (
              <button
                type="button"
                onClick={handleDeletePet}
                disabled={deleting}
                className="flex items-center gap-1 text-xs font-bold text-rose-600 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
              >
                {deleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                <span>Delete Record</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="text-[#85735B] hover:text-[#1A2748] p-1.5 rounded-full hover:bg-[#EEDFCA] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {loading && (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-9 h-9 text-[#CFA255] animate-spin mb-3" />
              <p className="text-sm font-bold text-[#8A7550]">Loading pet details...</p>
            </div>
          )}

          {error && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-center">
              <AlertCircle className="w-7 h-7 text-rose-500 mx-auto mb-2" />
              <p className="text-sm font-bold text-rose-800 mb-1">{error}</p>
              <button
                type="button"
                onClick={fetchPet}
                className="px-3 py-1 bg-rose-600 text-white rounded-lg text-xs font-bold hover:bg-rose-700 mt-2"
              >
                Retry
              </button>
            </div>
          )}

          {!loading && !error && pet && (
            <>
              {/* Pet Hero */}
              <div className="bg-white border border-[#DECFA9] rounded-2xl p-5 flex items-center gap-4 shadow-xs">
                <PetAvatar species={pet.species} className="w-[84px] h-[84px]" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-2xl font-black text-[#141E38] truncate">{pet.name}</h3>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#EDF5F0] text-[#2E7D59] font-bold border border-[#BDE3CC]">
                      {pet.gender}
                    </span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#FBF7F0] text-[#8C6B1C] font-bold border border-[#DECFA9]">
                      {pet.species}
                    </span>
                  </div>
                  <p className="text-sm text-[#6C5B42] font-semibold mt-0.5">
                    {pet.breed} • {pet.age || calculateAge(pet.dob)}
                  </p>
                  <p className="text-xs text-[#A09070] mt-1">
                    Recorded:{' '}
                    {new Date(pet.created_at).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>

              {/* Dynamic Categories */}
              {pet.categories && pet.categories.length > 0 && (
                <div className="bg-[#FFFDF7] border border-[#EBDAB4] rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-2.5">
                    <Tag className="w-4 h-4 text-[#D99A26]" />
                    <h4 className="text-xs font-black uppercase tracking-wider text-[#141E38]">
                      Database Generated Segments
                    </h4>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {pet.categories.map((c, i) => (
                      <div
                        key={i}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#FCEFCE] border border-[#E9C87B] text-xs font-bold text-[#573E0E]"
                      >
                        <span className="text-[10px] uppercase text-[#9E782E] opacity-75">{c.type}:</span>
                        <span>{c.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Pet Info Grid */}
              <div className="bg-[#FAF7F2] border border-[#EADFCB] rounded-2xl p-5">
                <h4 className="text-xs font-black uppercase tracking-wider text-[#141E38] mb-3 flex items-center gap-1.5">
                  <PawPrint className="w-4 h-4 text-[#CFA255]" />
                  <span>Pet Details</span>
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                  <div>
                    <span className="text-[#8A7550] block font-medium">Date of Birth</span>
                    <strong className="text-sm font-bold text-[#141E38]">{pet.dob}</strong>
                  </div>
                  <div>
                    <span className="text-[#8A7550] block font-medium">Location</span>
                    <strong className="text-sm font-bold text-[#141E38]">{pet.place}</strong>
                  </div>
                  <div>
                    <span className="text-[#8A7550] block font-medium">Height</span>
                    <strong className="text-sm font-bold text-[#141E38]">
                      {pet.height ? `${pet.height} cm` : '—'}
                    </strong>
                  </div>
                  <div>
                    <span className="text-[#8A7550] block font-medium">Weight</span>
                    <strong className="text-sm font-bold text-[#141E38]">
                      {pet.weight ? `${pet.weight} kg` : '—'}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Owner Info */}
              {pet.owner && (
                <div className="bg-[#D3EDE2] border border-[#BCE2D3] rounded-2xl p-5">
                  <h4 className="text-xs font-black uppercase tracking-wider text-[#141E38] mb-3 flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-[#2E7D59]" />
                    <span>Owner Dossier</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-[#3F6A56] block font-medium">Full Name</span>
                      <strong className="text-sm font-bold text-[#141E38]">{pet.owner.name}</strong>
                    </div>
                    <div>
                      <span className="text-[#3F6A56] block font-medium">Contact Number</span>
                      <strong className="text-sm font-bold text-[#141E38]">{pet.owner.contact}</strong>
                    </div>
                    <div>
                      <span className="text-[#3F6A56] block font-medium">Aadhar Card</span>
                      <strong className="text-sm font-bold text-[#141E38]">
                        {pet.owner.aadhar || '(Not Provided)'}
                      </strong>
                    </div>
                    <div>
                      <span className="text-[#3F6A56] block font-medium">Registered Address</span>
                      <strong className="text-sm font-bold text-[#141E38]">{pet.owner.address}</strong>
                    </div>
                  </div>
                </div>
              )}

              {/* Health Details */}
              <div className="bg-[#E3D4FA]/40 border border-[#CFBCF2] rounded-2xl p-5">
                <h4 className="text-xs font-black uppercase tracking-wider text-[#3C1E70] mb-3 flex items-center gap-1.5">
                  <Heart className="w-4 h-4 text-[#754EB8]" />
                  <span>Health & Wellness Journal</span>
                </h4>
                <div className="space-y-3 text-xs">
                  <div>
                    <span className="text-[#64429B] font-bold block mb-1">Vaccines:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {pet.vaccines?.length > 0 ? (
                        pet.vaccines.map((v, idx) => (
                          <span
                            key={idx}
                            className="px-2.5 py-0.5 rounded-lg bg-[#EFC967] border border-[#DFB342] text-[#4F3606] font-bold"
                          >
                            {v}
                          </span>
                        ))
                      ) : (
                        <span className="text-[#8A7550] italic">None recorded</span>
                      )}
                    </div>
                  </div>
                  <div>
                    <span className="text-[#64429B] font-bold block mb-1">Allergies:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {pet.allergies?.length > 0 ? (
                        pet.allergies.map((a, idx) => (
                          <span
                            key={idx}
                            className="px-2.5 py-0.5 rounded-lg bg-[#FBBF8C] border border-[#F0A06C] text-[#6B2C10] font-bold"
                          >
                            {a}
                          </span>
                        ))
                      ) : (
                        <span className="text-[#8A7550] italic">None recorded</span>
                      )}
                    </div>
                  </div>
                  <div>
                    <span className="text-[#64429B] font-bold block mb-1">Diseases:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {pet.diseases?.length > 0 ? (
                        pet.diseases.map((d, idx) => (
                          <span
                            key={idx}
                            className="px-2.5 py-0.5 rounded-lg bg-[#FCC2C2] border border-[#F4A0A0] text-[#7B1D1D] font-bold"
                          >
                            {d}
                          </span>
                        ))
                      ) : (
                        <span className="text-[#8A7550] italic">None recorded</span>
                      )}
                    </div>
                  </div>
                  <div>
                    <span className="text-[#64429B] font-bold block mb-1">Medications:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {pet.medications?.length > 0 ? (
                        pet.medications.map((m, idx) => (
                          <span
                            key={idx}
                            className="px-2.5 py-0.5 rounded-lg bg-[#F4DB96] border border-[#E0C070] text-[#66490C] font-bold"
                          >
                            {m}
                          </span>
                        ))
                      ) : (
                        <span className="text-[#8A7550] italic">None recorded</span>
                      )}
                    </div>
                  </div>
                  <div>
                    <span className="text-[#64429B] font-bold block mb-1">Food / Diet:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {pet.food?.length > 0 ? (
                        pet.food.map((f, idx) => (
                          <span
                            key={idx}
                            className="px-2.5 py-0.5 rounded-lg bg-[#C8EAD0] border border-[#9ED4B0] text-[#1A5A30] font-bold"
                          >
                            {f}
                          </span>
                        ))
                      ) : (
                        <span className="text-[#8A7550] italic">None recorded</span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-[#DECFA9]/50">
                    <div>
                      <span className="text-[#64429B] block font-medium">Grooming</span>
                      <strong className="text-[#141E38]">{pet.health?.grooming || '—'}</strong>
                    </div>
                    <div>
                      <span className="text-[#64429B] block font-medium">Checkup Routine</span>
                      <strong className="text-[#141E38]">{pet.health?.routine || '—'}</strong>
                    </div>
                    <div>
                      <span className="text-[#64429B] block font-medium">Last Visit</span>
                      <strong className="text-[#141E38]">{pet.health?.last_visit || '—'}</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Documents Vault */}
              <div className="bg-white border border-[#EADFCB] rounded-2xl p-5">
                <h4 className="text-xs font-black uppercase tracking-wider text-[#141E38] mb-3 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-[#CFA255]" />
                  <span>Official Vault Documents ({pet.documents?.length || 0})</span>
                </h4>
                {pet.documents && pet.documents.length > 0 ? (
                  <div className="space-y-2">
                    {pet.documents.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between p-3 bg-[#FAF7F2] border border-[#E5D7B7] rounded-xl text-xs"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <FileText className="w-4 h-4 text-[#CFA255] flex-shrink-0" />
                          <div className="truncate">
                            <span className="font-bold text-[#141E38] block truncate">
                              {doc.document_type}
                            </span>
                            <span className="text-[11px] text-[#8A7550] block truncate">
                              {doc.original_filename} (
                              {doc.file_size ? `${Math.round(doc.file_size / 1024)} KB` : ''})
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleDownloadDoc(doc)}
                            className="px-2.5 py-1.5 rounded-lg bg-[#1B52D8] hover:bg-[#1541B0] text-white font-bold flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Download</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteDoc(doc.id)}
                            disabled={deletingDocId === doc.id}
                            className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          >
                            {deletingDocId === doc.id ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Trash2 className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-[#8A7550] italic py-2">No documents uploaded for this pet.</p>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Admin Panel Main Page ───────────────────────────────────────────────────
export default function AdminPanel({ onNavigate }) {
  const { admin, logout } = useAuth();

  // Summary State
  const [summary, setSummary] = useState(null);
  const [loadingSummary, setLoadingSummary] = useState(true);

  // Segments State
  const [segments, setSegments] = useState(null);
  const [loadingSegments, setLoadingSegments] = useState(true);

  // Filter & Pagination State
  const [search, setSearch] = useState('');
  const [speciesFilter, setSpeciesFilter] = useState('');
  const [genderFilter, setGenderFilter] = useState('');
  const [activeSegment, setActiveSegment] = useState(null); // { type, value }
  const [pageOffset, setPageOffset] = useState(0);
  const PAGE_LIMIT = 20;

  // Pet List State
  const [petsData, setPetsData] = useState({ items: [], total: 0 });
  const [loadingPets, setLoadingPets] = useState(true);
  const [petsError, setPetsError] = useState(null);

  // Selected pet for detail modal
  const [selectedPetId, setSelectedPetId] = useState(null);

  // Load Dashboard Summary
  const loadSummary = useCallback(async () => {
    try {
      setLoadingSummary(true);
      const data = await api.getAdminDashboard();
      setSummary(data);
    } catch (err) {
      console.error('Failed to load dashboard summary:', err);
    } finally {
      setLoadingSummary(false);
    }
  }, []);

  // Load Segments
  const loadSegments = useCallback(async () => {
    try {
      setLoadingSegments(true);
      const data = await api.getAdminSegments();
      setSegments(data);
    } catch (err) {
      console.error('Failed to load segments:', err);
    } finally {
      setLoadingSegments(false);
    }
  }, []);

  // Load Paginated Pets
  const loadPets = useCallback(async () => {
    try {
      setLoadingPets(true);
      setPetsError(null);
      const data = await api.getAdminPets({
        search,
        species: speciesFilter,
        gender: genderFilter,
        category_type: activeSegment?.type || '',
        category_value: activeSegment?.value || '',
        limit: PAGE_LIMIT,
        offset: pageOffset,
      });
      setPetsData(data);
    } catch (err) {
      console.error('Failed to load pets:', err);
      setPetsError(err.message || 'Failed to load pet records.');
    } finally {
      setLoadingPets(false);
    }
  }, [search, speciesFilter, genderFilter, activeSegment, pageOffset]);

  // Initial load
  useEffect(() => {
    loadSummary();
    loadSegments();
  }, [loadSummary, loadSegments]);

  // Reload pets on filter changes
  useEffect(() => {
    loadPets();
  }, [loadPets]);

  const handleRefreshAll = () => {
    loadSummary();
    loadSegments();
    loadPets();
  };

  const handleSegmentClick = (type, value) => {
    // Toggle active segment filter
    if (activeSegment?.type === type && activeSegment?.value === value) {
      setActiveSegment(null);
    } else {
      setActiveSegment({ type, value });
    }
    setPageOffset(0);
  };

  const clearAllFilters = () => {
    setSearch('');
    setSpeciesFilter('');
    setGenderFilter('');
    setActiveSegment(null);
    setPageOffset(0);
  };

  const handleLogout = () => {
    logout();
    if (onNavigate) {
      onNavigate('/admin/login');
    } else if (typeof window !== 'undefined') {
      window.history.pushState(null, '', '/admin/login');
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  };

  const totalPages = Math.ceil((petsData.total || 0) / PAGE_LIMIT);
  const currentPage = Math.floor(pageOffset / PAGE_LIMIT) + 1;

  return (
    <div className="min-h-screen flex flex-col bg-paw-pattern text-[#1A2748]">
      {/* Top Header */}
      <header className="h-[75px] bg-[#FAF7F2] border-b border-[#E8E0D2] px-6 lg:px-10 flex items-center justify-between select-none sticky top-0 z-30 shadow-xs">
        <div className="flex items-center gap-3">
          <div
            className="flex items-center cursor-pointer"
            onClick={() => onNavigate && onNavigate('/')}
          >
            <PawletLogo />
          </div>
          <span className="text-[#CFA255] font-light text-lg">|</span>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#141E38] text-white text-xs font-black uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5 text-[#CFA255]" />
            <span>Admin Panel</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={handleRefreshAll}
            title="Refresh Data"
            className="p-2 rounded-xl text-[#8C6B1C] hover:text-[#141E38] hover:bg-[#EEDFCA] transition-colors cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2.5">
            <UserAvatar size="w-8 h-8" />
            <span className="text-xs font-bold text-[#141E38] hidden sm:inline">
              {admin?.username || 'Admin'}
            </span>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            title="Logout"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Main Admin Content */}
      <main className="flex-1 w-full max-w-[1450px] mx-auto px-4 sm:px-6 lg:px-10 py-8 space-y-8">
        {/* ═══════════════════════════════════════════════════════════
            SECTION 1: OVERVIEW DASHBOARD
        ═══════════════════════════════════════════════════════════ */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <PawPrint className="w-5 h-5 text-[#CFA255]" />
              <h2 className="text-xl font-extrabold text-[#141E38]">1. System Overview</h2>
            </div>
            <span className="text-xs font-bold text-[#8A7550]">PostgreSQL Live Aggregates</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {/* Total Pets */}
            <div className="bg-white border-2 border-[#EADFCB] rounded-2xl p-4 shadow-xs">
              <span className="text-[11px] uppercase tracking-wider font-bold text-[#8A7550] block mb-1">
                Total Pets
              </span>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-black text-[#141E38]">
                  {loadingSummary ? '…' : summary?.total_pets ?? 0}
                </span>
                <PawPrint className="w-5 h-5 text-[#CFA255]" />
              </div>
            </div>

            {/* Total Owners */}
            <div className="bg-white border-2 border-[#EADFCB] rounded-2xl p-4 shadow-xs">
              <span className="text-[11px] uppercase tracking-wider font-bold text-[#8A7550] block mb-1">
                Total Owners
              </span>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-black text-[#141E38]">
                  {loadingSummary ? '…' : summary?.total_owners ?? 0}
                </span>
                <Users className="w-5 h-5 text-[#2E7D59]" />
              </div>
            </div>

            {/* Dogs */}
            <div className="bg-white border-2 border-[#EADFCB] rounded-2xl p-4 shadow-xs">
              <span className="text-[11px] uppercase tracking-wider font-bold text-[#8A7550] block mb-1">
                Dogs 🐕
              </span>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-black text-[#141E38]">
                  {loadingSummary ? '…' : summary?.species?.['Dogs'] ?? 0}
                </span>
                <span className="text-sm font-bold text-[#8A7550]">Canine</span>
              </div>
            </div>

            {/* Cats */}
            <div className="bg-white border-2 border-[#EADFCB] rounded-2xl p-4 shadow-xs">
              <span className="text-[11px] uppercase tracking-wider font-bold text-[#8A7550] block mb-1">
                Cats 🐈
              </span>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-black text-[#141E38]">
                  {loadingSummary ? '…' : summary?.species?.['Cats'] ?? 0}
                </span>
                <span className="text-sm font-bold text-[#8A7550]">Feline</span>
              </div>
            </div>

            {/* Pets with Allergies */}
            <div className="bg-[#FFF5EC] border-2 border-[#F0D0B8] rounded-2xl p-4 shadow-xs">
              <span className="text-[11px] uppercase tracking-wider font-bold text-[#8A7550] block mb-1">
                Allergies
              </span>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-black text-[#6B2C10]">
                  {loadingSummary ? '…' : summary?.pets_with_allergies ?? 0}
                </span>
                <AlertTriangle className="w-5 h-5 text-[#F0A06C]" />
              </div>
            </div>

            {/* Pets with Documents */}
            <div className="bg-[#EEF8F4] border-2 border-[#BCE2D3] rounded-2xl p-4 shadow-xs">
              <span className="text-[11px] uppercase tracking-wider font-bold text-[#3F6A56] block mb-1">
                Vault Files
              </span>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-black text-[#2E7D59]">
                  {loadingSummary ? '…' : summary?.pets_with_documents ?? 0}
                </span>
                <FileText className="w-5 h-5 text-[#2E7D59]" />
              </div>
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════
            SECTION 2: DATA SEGMENTATION
        ═══════════════════════════════════════════════════════════ */}
        <div className="bg-white/95 border-2 border-[#EADFCB] rounded-[28px] p-6 lg:p-8 shadow-card">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-[#CFA255]" />
                <h2 className="text-xl font-extrabold text-[#141E38]">2. Data Segmentation</h2>
              </div>
              <p className="text-xs text-[#8A7550] mt-0.5">
                Click any segment chip below to filter the pet records table in real time.
              </p>
            </div>

            {activeSegment && (
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#8C6B1C]">Active Filter:</span>
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#141E38] text-white text-xs font-bold">
                  <span>{activeSegment.type}: {activeSegment.value}</span>
                  <X
                    className="w-3.5 h-3.5 cursor-pointer hover:text-rose-300"
                    onClick={() => setActiveSegment(null)}
                  />
                </span>
                <button
                  type="button"
                  onClick={() => setActiveSegment(null)}
                  className="text-xs text-rose-600 font-bold hover:underline cursor-pointer"
                >
                  Clear
                </button>
              </div>
            )}
          </div>

          {loadingSegments ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="w-6 h-6 animate-spin text-[#CFA255] mr-2" />
              <span className="text-xs font-bold text-[#8A7550]">Calculating segmentation...</span>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Row 1: Species & Age Group */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Species */}
                <div className="bg-[#FAF7F2] border border-[#EADFCB] rounded-2xl p-4">
                  <span className="text-[11px] font-black uppercase tracking-wider text-[#8A7550] block mb-2.5">
                    Species Segmentation
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(segments?.species || {}).map(([sp, count]) => {
                      const isActive =
                        activeSegment?.type === 'species' && activeSegment?.value === sp;
                      return (
                        <button
                          key={sp}
                          type="button"
                          onClick={() => handleSegmentClick('species', sp)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
                            isActive
                              ? 'bg-[#141E38] text-white border-[#141E38] shadow-sm scale-105'
                              : 'bg-white hover:bg-[#F5EDE1] text-[#141E38] border-[#DECFA9]'
                          }`}
                        >
                          <span>{speciesEmoji[sp] || '🐾'} {sp}</span>
                          <span
                            className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                              isActive ? 'bg-[#CFA255] text-[#141E38]' : 'bg-[#EFE5D3] text-[#8C6B1C]'
                            }`}
                          >
                            {count}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Age Group */}
                <div className="bg-[#FAF7F2] border border-[#EADFCB] rounded-2xl p-4">
                  <span className="text-[11px] font-black uppercase tracking-wider text-[#8A7550] block mb-2.5">
                    Age Group Segmentation
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(segments?.age_group || {}).map(([ag, count]) => {
                      const isActive =
                        activeSegment?.type === 'age_group' && activeSegment?.value === ag;
                      return (
                        <button
                          key={ag}
                          type="button"
                          onClick={() => handleSegmentClick('age_group', ag)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
                            isActive
                              ? 'bg-[#141E38] text-white border-[#141E38] shadow-sm scale-105'
                              : 'bg-white hover:bg-[#F5EDE1] text-[#141E38] border-[#DECFA9]'
                          }`}
                        >
                          <span>{ag}</span>
                          <span
                            className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                              isActive ? 'bg-[#CFA255] text-[#141E38]' : 'bg-[#EFE5D3] text-[#8C6B1C]'
                            }`}
                          >
                            {count}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Row 2: Health, Allergies, Size, Breed */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Health */}
                <div className="bg-[#FAF7F2] border border-[#EADFCB] rounded-2xl p-4">
                  <span className="text-[11px] font-black uppercase tracking-wider text-[#8A7550] block mb-2">
                    Health Status
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {Object.entries(segments?.health || {}).map(([h, count]) => {
                      const isActive =
                        activeSegment?.type === 'health' && activeSegment?.value === h;
                      return (
                        <button
                          key={h}
                          type="button"
                          onClick={() => handleSegmentClick('health', h)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-all cursor-pointer flex items-center gap-1 ${
                            isActive
                              ? 'bg-[#141E38] text-white border-[#141E38]'
                              : 'bg-white text-[#141E38] border-[#DECFA9] hover:bg-[#F8F2E8]'
                          }`}
                        >
                          <span>{h}</span>
                          <span className="text-[10px] opacity-75 font-mono">({count})</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Allergy */}
                <div className="bg-[#FAF7F2] border border-[#EADFCB] rounded-2xl p-4">
                  <span className="text-[11px] font-black uppercase tracking-wider text-[#8A7550] block mb-2">
                    Allergy Status
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {Object.entries(segments?.allergy_status || {}).map(([a, count]) => {
                      const isActive =
                        activeSegment?.type === 'allergy_status' && activeSegment?.value === a;
                      return (
                        <button
                          key={a}
                          type="button"
                          onClick={() => handleSegmentClick('allergy_status', a)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-all cursor-pointer flex items-center gap-1 ${
                            isActive
                              ? 'bg-[#141E38] text-white border-[#141E38]'
                              : 'bg-white text-[#141E38] border-[#DECFA9] hover:bg-[#F8F2E8]'
                          }`}
                        >
                          <span>{a}</span>
                          <span className="text-[10px] opacity-75 font-mono">({count})</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Size */}
                <div className="bg-[#FAF7F2] border border-[#EADFCB] rounded-2xl p-4">
                  <span className="text-[11px] font-black uppercase tracking-wider text-[#8A7550] block mb-2">
                    Calculated Size
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {Object.entries(segments?.size || {}).map(([s, count]) => {
                      const isActive =
                        activeSegment?.type === 'size' && activeSegment?.value === s;
                      return (
                        <button
                          key={s}
                          type="button"
                          onClick={() => handleSegmentClick('size', s)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-all cursor-pointer flex items-center gap-1 ${
                            isActive
                              ? 'bg-[#141E38] text-white border-[#141E38]'
                              : 'bg-white text-[#141E38] border-[#DECFA9] hover:bg-[#F8F2E8]'
                          }`}
                        >
                          <span>{s}</span>
                          <span className="text-[10px] opacity-75 font-mono">({count})</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Breed Group */}
                <div className="bg-[#FAF7F2] border border-[#EADFCB] rounded-2xl p-4">
                  <span className="text-[11px] font-black uppercase tracking-wider text-[#8A7550] block mb-2">
                    Breed Groups
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {Object.entries(segments?.breed_group || {}).map(([bg, count]) => {
                      const isActive =
                        activeSegment?.type === 'breed_group' && activeSegment?.value === bg;
                      return (
                        <button
                          key={bg}
                          type="button"
                          onClick={() => handleSegmentClick('breed_group', bg)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-all cursor-pointer flex items-center gap-1 ${
                            isActive
                              ? 'bg-[#141E38] text-white border-[#141E38]'
                              : 'bg-white text-[#141E38] border-[#DECFA9] hover:bg-[#F8F2E8]'
                          }`}
                        >
                          <span>{bg}</span>
                          <span className="text-[10px] opacity-75 font-mono">({count})</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ═══════════════════════════════════════════════════════════
            SECTION 3: ALL PET RECORDS TABLE
        ═══════════════════════════════════════════════════════════ */}
        <div className="bg-white/95 border-2 border-[#EADFCB] rounded-[28px] p-6 lg:p-8 shadow-card">
          {/* Header & Controls */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-[#CFA255]" />
                <h2 className="text-xl font-extrabold text-[#141E38]">3. All Pet Records</h2>
                <span className="ml-1 px-2.5 py-0.5 rounded-full bg-[#EFC967] border border-[#DFB342] text-xs font-bold text-[#4F3606]">
                  {petsData.total} records
                </span>
              </div>
              <p className="text-xs text-[#8A7550] mt-0.5">
                Complete database records retrieved directly from PostgreSQL
              </p>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Search */}
              <div className="relative min-w-[220px]">
                <Search className="w-4 h-4 text-[#A09070] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPageOffset(0);
                  }}
                  placeholder="Search name, breed, owner..."
                  className="w-full pl-9 pr-3 py-2 bg-white border border-[#DECFA9] rounded-xl text-xs font-semibold text-[#141E38] placeholder-[#B5A080] outline-none focus:border-[#CFA255] focus:ring-2 focus:ring-[#CFA255]/20 shadow-2xs"
                />
              </div>

              {/* Species Filter */}
              <select
                value={speciesFilter}
                onChange={(e) => {
                  setSpeciesFilter(e.target.value);
                  setPageOffset(0);
                }}
                className="py-2 px-3 bg-white border border-[#DECFA9] rounded-xl text-xs font-bold text-[#141E38] outline-none cursor-pointer"
              >
                <option value="">All Species</option>
                <option value="Dogs">Dogs</option>
                <option value="Cats">Cats</option>
                <option value="Birds">Birds</option>
                <option value="Small mammals">Small mammals</option>
                <option value="Farm Animals">Farm Animals</option>
              </select>

              {/* Gender Filter */}
              <select
                value={genderFilter}
                onChange={(e) => {
                  setGenderFilter(e.target.value);
                  setPageOffset(0);
                }}
                className="py-2 px-3 bg-white border border-[#DECFA9] rounded-xl text-xs font-bold text-[#141E38] outline-none cursor-pointer"
              >
                <option value="">All Genders</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>

              {(search || speciesFilter || genderFilter || activeSegment) && (
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="px-3 py-2 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 text-xs font-bold transition-colors cursor-pointer"
                >
                  Reset
                </button>
              )}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto border border-[#EADFCB] rounded-2xl bg-white shadow-2xs">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#FAF7F2] border-b border-[#EADFCB] text-[#8A7550] uppercase tracking-wider font-extrabold text-[11px]">
                  <th className="py-3.5 px-4">Pet</th>
                  <th className="py-3.5 px-4">Species & Breed</th>
                  <th className="py-3.5 px-4">Age / Gender</th>
                  <th className="py-3.5 px-4">Location</th>
                  <th className="py-3.5 px-4">Weight / Height</th>
                  <th className="py-3.5 px-4">Owner</th>
                  <th className="py-3.5 px-4">Recorded</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F2EAE0]">
                {loadingPets ? (
                  <tr>
                    <td colSpan={8} className="py-16 text-center text-[#8A7550]">
                      <Loader2 className="w-8 h-8 text-[#CFA255] animate-spin mx-auto mb-2" />
                      <span className="font-bold">Fetching records from PostgreSQL...</span>
                    </td>
                  </tr>
                ) : petsError ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-rose-600 font-bold">
                      {petsError}
                    </td>
                  </tr>
                ) : petsData.items.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-16 text-center">
                      <PawPrint className="w-10 h-10 text-[#D8CCB8] mx-auto mb-2" />
                      <p className="font-extrabold text-sm text-[#141E38]">No pet records found</p>
                      <p className="text-xs text-[#8A7550] mt-1">
                        Try modifying search or filter criteria
                      </p>
                    </td>
                  </tr>
                ) : (
                  petsData.items.map((pet) => (
                    <tr
                      key={pet.id}
                      onClick={() => setSelectedPetId(pet.id)}
                      className="hover:bg-[#FAF7F2] transition-colors cursor-pointer group"
                    >
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <PetAvatar species={pet.species} className="w-10 h-10 flex-shrink-0" />
                          <span className="font-extrabold text-sm text-[#141E38] group-hover:text-[#8C6B1C] transition-colors">
                            {pet.name}
                          </span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-bold text-[#141E38] block">{pet.species}</span>
                        <span className="text-[11px] text-[#8A7550]">{pet.breed}</span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-[#141E38] block">{pet.age}</span>
                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#EDF5F0] text-[#2E7D59] font-bold border border-[#BDE3CC] inline-block mt-0.5">
                          {pet.gender}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-[#141E38] font-semibold">{pet.place}</td>

                      <td className="py-3.5 px-4">
                        <span className="font-bold text-[#141E38] block">
                          {pet.weight ? `${pet.weight} kg` : '—'}
                        </span>
                        <span className="text-[11px] text-[#8A7550]">
                          {pet.height ? `${pet.height} cm` : '—'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-bold text-[#141E38] block">{pet.owner_name}</span>
                        <span className="text-[11px] text-[#8A7550]">{pet.owner_contact}</span>
                      </td>

                      <td className="py-3.5 px-4 text-[11px] text-[#8A7550]">
                        {new Date(pet.created_at).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedPetId(pet.id);
                          }}
                          className="px-3 py-1.5 bg-[#141E38] hover:bg-[#0D1C3D] text-white rounded-lg text-xs font-bold transition-all shadow-2xs inline-flex items-center gap-1 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5 text-[#CFA255]" />
                          <span>View</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-4 pt-4 border-t border-[#EADFCB]/60 text-xs text-[#8A7550]">
            <div>
              Showing{' '}
              <strong className="text-[#141E38]">
                {petsData.total === 0 ? 0 : pageOffset + 1}
              </strong>{' '}
              to{' '}
              <strong className="text-[#141E38]">
                {Math.min(pageOffset + PAGE_LIMIT, petsData.total)}
              </strong>{' '}
              of <strong className="text-[#141E38]">{petsData.total}</strong> pet records
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              <button
                type="button"
                onClick={() => setPageOffset((prev) => Math.max(0, prev - PAGE_LIMIT))}
                disabled={pageOffset === 0 || loadingPets}
                className="px-3 py-1.5 rounded-xl border border-[#DECFA9] bg-white hover:bg-[#FAF7F2] text-[#141E38] font-bold disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Prev</span>
              </button>

              <span className="font-bold px-2 text-[#141E38]">
                {currentPage} / {totalPages || 1}
              </span>

              <button
                type="button"
                onClick={() => setPageOffset((prev) => prev + PAGE_LIMIT)}
                disabled={pageOffset + PAGE_LIMIT >= petsData.total || loadingPets}
                className="px-3 py-1.5 rounded-xl border border-[#DECFA9] bg-white hover:bg-[#FAF7F2] text-[#141E38] font-bold disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer transition-colors"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Individual Pet Detail Modal */}
      <PetDetailModal
        petId={selectedPetId}
        isOpen={!!selectedPetId}
        onClose={() => setSelectedPetId(null)}
        onPetDeleted={() => {
          handleRefreshAll();
        }}
      />
    </div>
  );
}
