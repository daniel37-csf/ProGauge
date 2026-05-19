import { Calendar, TrendingUp, Library, Bell, Settings, LogOut, ChevronDown, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import type { ReactNode } from 'react';

import { Tab } from '../types';
import { useTheme } from './ThemeProvider';

interface HeaderProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  onLogout: () => void;
  isAdmin?: boolean;
  avatarUrl?: string;
}

export function Header({ activeTab, onTabChange, onLogout, isAdmin, avatarUrl }: HeaderProps) {
  const [showSettings, setShowSettings] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const defaultAvatar = "https://lh3.googleusercontent.com/aida-public/AB6AXuBlyoNV8_PVYDDruJJedgEnmdArjXVrU4qn62bh9a-asl-VzcRO0jgggZ-p6IePJ32zC57V2imV19GyNZSwhC02eaGGEZks_ryxvLd4n6O25L_pImGnuDGEXnjQZ5MYh89U_UGDwFEPfwbBIroqzOZaEy6i-5wqe0co3EsreXpsmmlE9-is_91-oGiTqC-K-cLQhNBF8GVenOPqw-nUgDyAo3RapzjH16TyEpWtgQTqq95a3I5Czs9hDbwBWPAVMPUIYjEd6nWwbXs";

  return (
    <header className="bg-background border-b border-outline fixed top-0 w-full z-50 flex justify-between items-center px-6 md:px-12 py-6 md:py-8">
      <div className="flex items-center gap-xs">
        <h1 className="text-xl md:text-2xl font-black tracking-tighter uppercase select-none group">
          PRO<span className="text-primary italic transition-all group-hover:not-italic">/</span>GAUGE
        </h1>
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex gap-12 lg:gap-16 items-center">
        <NavButton active={activeTab === 'events'} label="Events" onClick={() => {
          if (activeTab === 'events') window.scrollTo({ top: 0, behavior: 'smooth' });
          onTabChange('events');
        }} />
        <NavButton active={activeTab === 'progress'} label="Progress" onClick={() => {
          if (activeTab === 'progress') window.scrollTo({ top: 0, behavior: 'smooth' });
          onTabChange('progress');
        }} />
        <NavButton active={activeTab === 'library'} label="Library" onClick={() => {
          if (activeTab === 'library') window.scrollTo({ top: 0, behavior: 'smooth' });
          onTabChange('library');
        }} />
        <NavButton active={activeTab === 'alerts'} label="Alerts" onClick={() => {
          if (activeTab === 'alerts') window.scrollTo({ top: 0, behavior: 'smooth' });
          onTabChange('alerts');
        }} />
      </nav>

      <div className="flex items-center gap-4 md:gap-8">
        <div className="hidden lg:flex flex-col items-end mr-4">
          <span className="text-[9px] font-mono text-on-surface/40 uppercase tracking-widest leading-none">System Status</span>
          <span className="text-[10px] font-bold text-primary uppercase mt-1">Online</span>
        </div>
        
        <div className="relative">
          <button 
            onClick={() => setShowSettings(!showSettings)}
            className={`w-10 md:w-12 h-10 md:h-12 border border-outline flex items-center justify-center transition-colors group ${showSettings ? 'bg-on-surface text-background' : 'hover:bg-on-surface hover:text-background'}`}
          >
            <Settings className={`w-5 h-5 transition-transform ${showSettings ? 'rotate-90' : 'group-hover:rotate-90'}`} />
          </button>

          <AnimatePresence>
            {showSettings && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute right-0 mt-2 w-48 bg-background border border-outline shadow-2xl z-[60]"
              >
                <div className="p-4 border-b border-outline bg-surface-bright">
                  <span className="text-[9px] font-mono text-on-surface/40 uppercase tracking-widest">Menu</span>
                </div>
                <div className="flex flex-col">
                  <button 
                    onClick={() => {
                      onTabChange('profile');
                      setShowSettings(false);
                    }}
                    className="flex items-center justify-between p-4 hover:bg-on-surface/10 transition-colors group"
                  >
                    <span className="text-[10px] font-bold uppercase tracking-widest">Profile Settings</span>
                    <ChevronDown className="w-4 h-4 -rotate-90 opacity-20 group-hover:opacity-100 transition-opacity" />
                  </button>
                  <button 
                    onClick={toggleTheme}
                    className="flex items-center justify-between p-4 hover:bg-on-surface/10 transition-colors group border-t border-outline"
                  >
                    <span className="text-[10px] font-bold uppercase tracking-widest">Theme: {theme === 'dark' ? 'Dark' : 'Light'}</span>
                    <div className={`w-2 h-2 rounded-full ${theme === 'dark' ? 'bg-primary' : 'bg-on-surface'}`} />
                  </button>
                  {isAdmin && (
                    <button 
                      onClick={() => {
                        onTabChange('admin');
                        setShowSettings(false);
                      }}
                      className="flex items-center justify-between p-4 hover:bg-primary hover:text-on-primary transition-colors group border-t border-outline"
                    >
                      <span className="text-[10px] font-bold uppercase tracking-widest">Admin Console</span>
                      <Shield className="w-4 h-4 opacity-20 group-hover:opacity-100 transition-opacity" />
                    </button>
                  )}
                  <button 
                    onClick={onLogout}
                    className="flex items-center justify-between p-4 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white transition-all group border-t border-outline"
                  >
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Logout</span>
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
                <div className="p-4 border-t border-outline flex justify-between items-center text-[8px] font-mono text-on-surface/40">
                  <span>v1.0.0</span>
                  <span>SECURE</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button 
          onClick={() => onTabChange('profile')}
          className="w-10 md:w-12 h-10 md:h-12 grayscale border border-outline overflow-hidden hidden sm:block focus:outline-none focus:border-primary transition-colors"
        >
          <img 
            alt="User Avatar" 
            className="w-full h-full object-cover grayscale brightness-75 hover:grayscale-0 hover:brightness-100 transition-all duration-500" 
            src={avatarUrl || defaultAvatar}
          />
        </button>
      </div>
    </header>
  );
}

function NavButton({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`text-[10px] font-bold uppercase tracking-[0.2em] transition-colors
        ${active ? 'text-primary' : 'text-on-surface/60 hover:text-on-surface'}`}
    >
      {label}
    </button>
  );
}

interface BottomNavProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const handleTabClick = (tab: Tab) => {
    if (activeTab === tab) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    onTabChange(tab);
  };

  return (
    <nav className="md:hidden bg-background border-t border-outline fixed bottom-0 w-full z-50 grid grid-cols-4 h-20">
      <BottomNavButton 
        active={activeTab === 'events'} 
        label="Events" 
        onClick={() => handleTabClick('events')}
      />
      <BottomNavButton 
        active={activeTab === 'progress'} 
        label="Progress" 
        onClick={() => handleTabClick('progress')}
      />
      <BottomNavButton 
        active={activeTab === 'library'} 
        label="Library" 
        onClick={() => handleTabClick('library')}
      />
      <BottomNavButton 
        active={activeTab === 'alerts'} 
        label="Alerts" 
        onClick={() => handleTabClick('alerts')}
      />
    </nav>
  );
}

function BottomNavButton({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center justify-center border-r border-outline last:border-r-0 transition-colors
        ${active ? 'bg-primary text-on-primary' : 'text-on-surface/40 hover:text-on-surface'}`}
    >
      <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
    </button>
  );
}
