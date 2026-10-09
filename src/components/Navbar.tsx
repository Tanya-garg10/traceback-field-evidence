import React from 'react';
import { Play } from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';

export type ActiveTab =
  | 'home'
  | 'capture'
  | 'trace'
  | 'discover'
  | 'journal'
  | 'how-it-works';

interface NavbarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  onTriggerDemo: () => void;
  journalCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  onTriggerDemo,
  journalCount,
}) => {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-4 sm:px-8 py-3.5 bg-[#F7F5F0]/90 backdrop-blur-md border-b border-[#E2DDD2]">
      <button
        onClick={() => onSelectTab('home')}
        className="text-xl font-semibold tracking-tight font-serif-display text-[#1C241E] hover:text-[#1E4620] transition-colors cursor-pointer text-left"
      >
        TraceBack
      </button>

      <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-[#545E56]">
        <button
          onClick={() => onSelectTab('home')}
          className={`py-1 transition-colors whitespace-nowrap cursor-pointer border-b-2 ${
            activeTab === 'home'
              ? 'text-[#1E4620] border-[#1E4620] font-semibold'
              : 'border-transparent hover:text-[#1C241E] hover:border-[#1C241E]/20'
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => onSelectTab('capture')}
          className={`py-1 transition-colors whitespace-nowrap cursor-pointer border-b-2 ${
            activeTab === 'capture'
              ? 'text-[#1E4620] border-[#1E4620] font-semibold'
              : 'border-transparent hover:text-[#1C241E] hover:border-[#1C241E]/20'
          }`}
        >
          Field Capture
        </button>
        <button
          onClick={() => onSelectTab('trace')}
          className={`py-1 transition-colors whitespace-nowrap cursor-pointer border-b-2 ${
            activeTab === 'trace'
              ? 'text-[#1E4620] border-[#1E4620] font-semibold'
              : 'border-transparent hover:text-[#1C241E] hover:border-[#1C241E]/20'
          }`}
        >
          Evidence Trace
        </button>
        <button
          onClick={() => onSelectTab('discover')}
          className={`py-1 transition-colors whitespace-nowrap cursor-pointer border-b-2 ${
            activeTab === 'discover'
              ? 'text-[#1E4620] border-[#1E4620] font-semibold'
              : 'border-transparent hover:text-[#1C241E] hover:border-[#1C241E]/20'
          }`}
        >
          Discovery & Clusters
        </button>
        <button
          onClick={() => onSelectTab('journal')}
          className={`py-1 transition-colors whitespace-nowrap cursor-pointer border-b-2 ${
            activeTab === 'journal'
              ? 'text-[#1E4620] border-[#1E4620] font-semibold'
              : 'border-transparent hover:text-[#1C241E] hover:border-[#1C241E]/20'
          }`}
        >
          Field Journal ({journalCount})
        </button>
        <button
          onClick={() => onSelectTab('how-it-works')}
          className={`py-1 transition-colors whitespace-nowrap cursor-pointer border-b-2 ${
            activeTab === 'how-it-works'
              ? 'text-[#1E4620] border-[#1E4620] font-semibold'
              : 'border-transparent hover:text-[#1C241E] hover:border-[#1C241E]/20'
          }`}
        >
          How It Works
        </button>
      </nav>

      <div className="flex items-center gap-2.5">
        <PWAInstallButton />
        <button
          onClick={onTriggerDemo}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#1E4620] rounded-lg hover:bg-[#163518] transition-colors whitespace-nowrap shrink-0 cursor-pointer shadow-xs"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>Try Demo</span>
        </button>
      </div>
    </header>
  );
};
