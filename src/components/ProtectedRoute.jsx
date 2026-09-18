import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

export default function ProtectedRoute({ children, onRedirectToLogin }) {
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      if (onRedirectToLogin) {
        onRedirectToLogin();
      } else if (typeof window !== 'undefined') {
        window.history.pushState(null, '', '/admin/login');
        window.dispatchEvent(new PopStateEvent('popstate'));
      }
    }
  }, [isAuthenticated, loading, onRedirectToLogin]);

  if (loading) {
    return (
      <div className="min-h-screen bg-paw-pattern flex flex-col items-center justify-center">
        <div className="bg-white rounded-3xl p-6 shadow-xl border border-[#DECFA9] flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-[#CFA255] animate-spin" />
          <p className="text-sm font-bold text-[#141E38]">Verifying Admin Session...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return children;
}
