import React from 'react';
import { LayoutGrid, Pencil, FileText, Settings, LogOut } from 'lucide-react';
import UserAvatar from './UserAvatar';

export default function Sidebar({ activeTab, onTabChange }) {
  return (
    <aside className="w-[85px] bg-[#FAF7F2] border-r border-[#E8E0D2] flex flex-col items-center justify-between py-6 z-20 select-none flex-shrink-0">
      {/* Top 4 Navigation Icons */}
      <div className="flex flex-col items-center gap-4 w-full px-3">
        {/* Dashboard Grid */}
        <button
          type="button"
          onClick={() => onTabChange('dashboard')}
          title="Dashboard"
          className={`w-[52px] h-[52px] rounded-2xl flex items-center justify-center transition-all ${
            activeTab === 'dashboard'
              ? 'bg-[#1A2748] text-white shadow-md'
              : 'bg-[#F2E8D7] border border-[#DFCEAE] text-[#826732] hover:bg-[#EBDDC8]'
          }`}
        >
          <LayoutGrid className="w-5 h-5" />
        </button>

        {/* Edit / Data Entry */}
        <button
          type="button"
          onClick={() => onTabChange('entry')}
          title="Pet Data Entry"
          className={`w-[52px] h-[52px] rounded-2xl flex items-center justify-center transition-all ${
            activeTab === 'entry'
              ? 'bg-[#1A2748] text-white shadow-md'
              : 'bg-[#F2E8D7] border border-[#DFCEAE] text-[#826732] hover:bg-[#EBDDC8]'
          }`}
        >
          <Pencil className="w-5 h-5" />
        </button>

        {/* Documents */}
        <button
          type="button"
          onClick={() => onTabChange('docs')}
          title="Documents"
          className={`w-[52px] h-[52px] rounded-2xl flex items-center justify-center transition-all ${
            activeTab === 'docs'
              ? 'bg-[#1A2748] text-white shadow-md'
              : 'bg-[#F2E8D7] border border-[#DFCEAE] text-[#826732] hover:bg-[#EBDDC8]'
          }`}
        >
          <FileText className="w-5 h-5" />
        </button>

        {/* Settings */}
        <button
          type="button"
          onClick={() => onTabChange('settings')}
          title="Settings"
          className={`w-[52px] h-[52px] rounded-2xl flex items-center justify-center transition-all ${
            activeTab === 'settings'
              ? 'bg-[#1A2748] text-white shadow-md'
              : 'bg-[#F2E8D7] border border-[#DFCEAE] text-[#826732] hover:bg-[#EBDDC8]'
          }`}
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>

      {/* Bottom Profile & Logout */}
      <div className="flex flex-col items-center gap-5">
        <UserAvatar size="w-11 h-11" statusBorder={true} />
        <button
          type="button"
          title="Log out"
          className="text-[#6D5D45] hover:text-[#141E38] hover:rotate-6 transition-all p-2 rounded-xl"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </aside>
  );
}
