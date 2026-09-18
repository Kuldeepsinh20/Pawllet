import React, { useState } from 'react';
import PawletLogo from '../components/PawletLogo';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Lock, User, AlertCircle, Loader2, ArrowLeft } from 'lucide-react';

export default function AdminLogin({ onNavigate }) {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      setError('Please enter both username and password.');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      await login(username, password);
      if (onNavigate) {
        onNavigate('/admin');
      } else if (typeof window !== 'undefined') {
        window.history.pushState(null, '', '/admin');
        window.dispatchEvent(new PopStateEvent('popstate'));
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Invalid username or password');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-paw-pattern text-[#1A2748]">
      {/* Top Bar */}
      <header className="h-[75px] bg-[#FAF7F2] border-b border-[#E8E0D2] px-6 lg:px-10 flex items-center justify-between select-none">
        <div
          className="flex items-center cursor-pointer"
          onClick={() => onNavigate && onNavigate('/')}
        >
          <PawletLogo />
        </div>

        <button
          type="button"
          onClick={() => onNavigate && onNavigate('/')}
          className="flex items-center gap-1.5 text-xs font-bold text-[#8C6B1C] hover:text-[#141E38] px-3.5 py-2 rounded-xl hover:bg-[#EEDFCA] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Registration</span>
        </button>
      </header>

      {/* Main Login Card */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white/95 border-2 border-[#EADFCB] rounded-[28px] shadow-card p-8 sm:p-10 relative overflow-hidden">
          {/* Header decorative badge */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-[#FBF7F0] border-2 border-[#DFCFA8] flex items-center justify-center text-[#CFA255] shadow-xs mb-4">
              <ShieldCheck className="w-8 h-8 stroke-[2.2]" />
            </div>
            <h1 className="text-2xl font-black text-[#141E38] tracking-tight">Admin Access</h1>
            <p className="text-xs text-[#8A7550] font-medium mt-1">
              Sign in to manage and inspect pet records
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-6 bg-rose-50 border border-rose-300 rounded-2xl p-3.5 flex items-center gap-3 text-rose-900 shadow-xs">
              <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
              <p className="text-xs font-bold text-rose-700 leading-snug">{error}</p>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username Input */}
            <div>
              <label className="text-xs font-bold text-[#141E38] block mb-1.5 uppercase tracking-wide">
                Username
              </label>
              <div className="flex items-center bg-white border border-[#DECFA9] rounded-xl py-3 px-3.5 shadow-xs focus-within:border-[#B58A32] focus-within:ring-2 focus-within:ring-[#B58A32]/20 transition-all">
                <User className="w-4 h-4 text-[#8C7651] mr-2.5 flex-shrink-0" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter admin username"
                  disabled={submitting}
                  autoComplete="username"
                  className="w-full text-sm font-semibold text-[#1A2748] bg-transparent outline-none placeholder-[#B5A080]"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="text-xs font-bold text-[#141E38] block mb-1.5 uppercase tracking-wide">
                Password
              </label>
              <div className="flex items-center bg-white border border-[#DECFA9] rounded-xl py-3 px-3.5 shadow-xs focus-within:border-[#B58A32] focus-within:ring-2 focus-within:ring-[#B58A32]/20 transition-all">
                <Lock className="w-4 h-4 text-[#8C7651] mr-2.5 flex-shrink-0" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  disabled={submitting}
                  autoComplete="current-password"
                  className="w-full text-sm font-semibold text-[#1A2748] bg-transparent outline-none placeholder-[#B5A080]"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 px-4 rounded-xl bg-[#14264F] hover:bg-[#0D1C3D] text-white text-sm font-bold shadow-md flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer mt-2"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#CFA255]" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-[#CFA255]" />
                  <span>Login to Admin Panel</span>
                </>
              )}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
