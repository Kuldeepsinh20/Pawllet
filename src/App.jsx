import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ProfilePage from './pages/ProfilePage';
import HealthDocumentsPage from './pages/HealthDocumentsPage';
import SuccessModal from './components/SuccessModal';
import ResetConfirmModal from './components/ResetConfirmModal';
import AdminLogin from './pages/AdminLogin';
import AdminPanel from './pages/AdminPanel';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import { initialPetData } from './data/initialData';
import api from './services/api';
import { AlertCircle, Loader2 } from 'lucide-react';

function freshPetData() {
  return JSON.parse(JSON.stringify(initialPetData));
}

function AppContent() {
  // Navigation / Path state
  const [currentPath, setCurrentPath] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.location.pathname || '/';
    }
    return '/';
  });

  // Current form data
  const [petData, setPetData] = useState(freshPetData);
  const [editingPetId, setEditingPetId] = useState(null);

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  // Modal states
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);

  // Browser popstate handler
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname || '/';
      setCurrentPath(path);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (path) => {
    setCurrentPath(path);
    if (typeof window !== 'undefined') {
      window.history.pushState(null, '', path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // ─── Field change handler ────────────────────────────────────────────────────
  const handleFieldChange = (field, value) => {
    setPetData((prev) => ({ ...prev, [field]: value }));
  };

  // ─── Tag handlers ────────────────────────────────────────────────────────────
  const makeAddTag = (field) => (tag) => {
    setPetData((prev) => {
      const current = Array.isArray(prev[field]) ? prev[field] : [];
      if (current.includes(tag)) return prev;
      return { ...prev, [field]: [...current, tag] };
    });
  };

  const makeRemoveTag = (field) => (tagToRemove) => {
    setPetData((prev) => {
      const current = Array.isArray(prev[field]) ? prev[field] : [];
      return { ...prev, [field]: current.filter((t) => t !== tagToRemove) };
    });
  };

  const handleAddVaccine = makeAddTag('vaccines');
  const handleRemoveVaccine = makeRemoveTag('vaccines');
  const handleAddAllergy = makeAddTag('allergies');
  const handleRemoveAllergy = makeRemoveTag('allergies');
  const handleAddDisease = makeAddTag('diseases');
  const handleRemoveDisease = makeRemoveTag('diseases');
  const handleAddMedication = makeAddTag('medications');
  const handleRemoveMedication = makeRemoveTag('medications');
  const handleAddFood = makeAddTag('food');
  const handleRemoveFood = makeRemoveTag('food');

  // ─── Document upload ─────────────────────────────────────────────────────────
  const handleFileUpload = (docKey, fileData) => {
    setPetData((prev) => {
      const currentDocs = Array.isArray(prev.documents) ? prev.documents : [];
      // Replace if same key already exists
      const filtered = currentDocs.filter((d) => d.key !== docKey);
      return { ...prev, documents: [...filtered, { ...fileData, key: docKey }] };
    });
  };

  // ─── Reset form ───────────────────────────────────────────────────────────────
  const handleResetConfirm = () => {
    setEditingPetId(null);
    setPetData(freshPetData());
    setSubmitError(null);
    navigateTo('/dashboard');
  };

  // ─── Complete & Record / Submit to Database ──────────────────────────────────
  const handleComplete = async () => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      let petRecord;
      if (editingPetId) {
        petRecord = await api.updatePet(editingPetId, petData);
      } else {
        petRecord = await api.createPet(petData);
      }

      // Upload any new document files
      if (Array.isArray(petData.documents) && petData.documents.length > 0) {
        const targetId = editingPetId || petRecord?.id;
        for (const doc of petData.documents) {
          if (doc.file && targetId) {
            try {
              await api.uploadDocument(targetId, doc.title || doc.key, doc.file);
            } catch (uploadErr) {
              console.error(`Failed to upload ${doc.title}:`, uploadErr);
            }
          }
        }
      }

      // Show success celebration modal
      setShowSuccessModal(true);
    } catch (err) {
      console.error('Failed to submit pet record:', err);
      setSubmitError(err.message || 'Failed to save pet record to database. Please ensure backend is running.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Called from SuccessModal — start a new record
  const handleStartNewRecord = () => {
    setShowSuccessModal(false);
    setEditingPetId(null);
    setPetData(freshPetData());
    setSubmitError(null);
    navigateTo('/dashboard');
  };

  // ─── ROUTING LOGIC ──────────────────────────────────────────────────────────
  if (currentPath === '/admin') {
    return (
      <ProtectedRoute onRedirectToLogin={() => navigateTo('/admin/login')}>
        <AdminPanel onNavigate={navigateTo} />
      </ProtectedRoute>
    );
  }

  if (currentPath === '/admin/login') {
    return <AdminLogin onNavigate={navigateTo} />;
  }

  // Determine current step for public registration
  const currentStep = currentPath.includes('/health') ? 2 : 1;

  return (
    <div className="min-h-screen flex flex-col bg-paw-pattern text-[#1A2748]">
      {/* Header */}
      <Header
        currentStep={currentStep}
        onNavigate={navigateTo}
      />

      {/* Submission Error Banner */}
      {submitError && (
        <div className="w-full max-w-[1400px] mx-auto px-4 mt-4">
          <div className="bg-rose-50 border border-rose-300 rounded-2xl p-4 flex items-center justify-between gap-4 text-rose-900 shadow-sm">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
              <div>
                <p className="font-bold text-sm">Submission Error</p>
                <p className="text-xs text-rose-700">{submitError}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setSubmitError(null)}
              className="text-xs font-bold text-rose-600 hover:text-rose-900 px-3 py-1 rounded-lg hover:bg-rose-100 transition-colors cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Submitting Overlay */}
      {isSubmitting && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 shadow-2xl flex flex-col items-center gap-3 border border-[#DECFA9]">
            <Loader2 className="w-10 h-10 text-[#CFA255] animate-spin" />
            <p className="text-base font-extrabold text-[#141E38]">
              {editingPetId ? 'Updating Pet in Database...' : 'Saving Pet to Database...'}
            </p>
            <p className="text-xs text-[#8A7550]">
              {editingPetId ? 'Updating record and documents' : 'Storing record and uploading documents'}
            </p>
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 w-full max-w-[1450px] mx-auto px-4 sm:px-6 lg:px-10 py-8 flex flex-col items-center">
        {currentStep === 1 ? (
          <ProfilePage
            petData={petData}
            isEditing={!!editingPetId}
            onChange={handleFieldChange}
            onNext={() => navigateTo('/dashboard/health')}
            onCancel={() => setShowResetModal(true)}
          />
        ) : (
          <HealthDocumentsPage
            petData={petData}
            isEditing={!!editingPetId}
            onChange={handleFieldChange}
            onAddVaccine={handleAddVaccine}
            onRemoveVaccine={handleRemoveVaccine}
            onAddAllergy={handleAddAllergy}
            onRemoveAllergy={handleRemoveAllergy}
            onAddDisease={handleAddDisease}
            onRemoveDisease={handleRemoveDisease}
            onAddMedication={handleAddMedication}
            onRemoveMedication={handleRemoveMedication}
            onAddFood={handleAddFood}
            onRemoveFood={handleRemoveFood}
            onFileUpload={handleFileUpload}
            onBack={() => navigateTo('/dashboard')}
            onComplete={handleComplete}
          />
        )}
      </main>

      {/* Modals */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        petData={petData}
        isEditing={!!editingPetId}
        onStartNewRecord={handleStartNewRecord}
      />

      <ResetConfirmModal
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
        onConfirm={handleResetConfirm}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
