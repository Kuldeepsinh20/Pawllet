import React from 'react';
import PawletLogo from './PawletLogo';
import UserAvatar from './UserAvatar';
import { ShieldCheck, LogIn, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Header({ currentStep, onNavigate }) {
  const { isAuthenticated } = useAuth();

  const handleAdminClick = () => {
    if (onNavigate) {
      onNavigate(isAuthenticated ? '/admin' : '/admin/login');
    } else if (typeof window !== 'undefined') {
      window.history.pushState(null, '', isAuthenticated ? '/admin' : '/admin/login');
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  };

  return (
    <header className="h-[75px] bg-[#FAF7F2] border-b border-[#E8E0D2] px-6 lg:px-10 flex items-center justify-between z-30 select-none">
      {/* Left Branding */}
      <div
        className="flex items-center cursor-pointer"
        onClick={() => onNavigate && onNavigate('/')}
      >
        <PawletLogo />
      </div>

      {/* Right Area */}
      <div className="flex items-center gap-4">
        {/* Admin Login Button */}
        <button
          type="button"
          onClick={handleAdminClick}
          id="admin-login-button"
          title={isAuthenticated ? 'Open Admin Panel' : 'Admin Login'}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#141E38] hover:bg-[#0D1C3D] text-white text-sm font-bold shadow-sm transition-all active:scale-95 cursor-pointer"
        >
          {isAuthenticated ? (
            <>
              <LayoutDashboard className="w-4 h-4 text-[#CFA255]" />
              <span>Admin Panel</span>
            </>
          ) : (
            <>
              <ShieldCheck className="w-4 h-4 text-[#CFA255]" />
              <span>Admin Login</span>
            </>
          )}
        </button>
      </div>
    </header>
  );
}
