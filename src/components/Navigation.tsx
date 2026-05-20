import { Calendar, TrendingUp, Library, Bell, Settings, LogOut, ChevronDown, Shield, Info, CheckCircle2, AlertTriangle, XCircle, X, ExternalLink, Palette, Newspaper } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useMemo } from 'react';
import type { ReactNode } from 'react';

import { Tab, Notification } from '../types';
import { useTheme, ThemeType, THEMES } from '../ThemeContext';

interface HeaderProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  onLogout: () => void;
  isAdmin?: boolean;
  avatarUrl?: string;
  steamId?: string | null;
}

export function Header({ activeTab, onTabChange, onLogout, isAdmin, avatarUrl, steamId }: HeaderProps) {
  const { theme, setTheme } = useTheme();
  const [showSettings, setShowSettings] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'Steam Synchronized',
      message: 'Your Steam profile has been successfully linked to your account.',
      timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 mins ago
      status: 'unread',
      type: 'success',
      details: 'Steam ID 76561198034567890 is now connected. Sync complete for Achievements and Playtime tracking.'
    },
    {
      id: '2',
      title: 'Daily Quest Reminder',
      message: 'Your daily challenges in Elden Ring reset in 30 minutes.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      status: 'unread',
      type: 'info',
      details: 'Ensure you have completed all weekly objectives before the Tuesday reset.'
    },
    {
      id: '3',
      title: 'System Patch',
      message: 'QuestGate v1.1.0 update is preparing for deployment.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      status: 'read',
      type: 'warning',
      details: 'The platform will be offline for approximately 2 hours tomorrow at 04:00 UTC for structural optimization.'
    }
  ]);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);

  const unreadCount = useMemo(() => notifications.filter(n => n.status === 'unread').length, [notifications]);

  const toggleNotification = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, status: 'read' as const } : n));
  };

  const defaultAvatar = "https://lh3.googleusercontent.com/aida-public/AB6AXuBlyoNV8_PVYDDruJJedgEnmdArjXVrU4qn62bh9a-asl-VzcRO0jgggZ-p6IePJ32zC57V2imV19GyNZSwhC02eaGGEZks_ryxvLd4n6O25L_pImGnuDGEXnjQZ5MYh89U_UGDwFEPfwbBIroqzOZaEy6i-5wqe0co3EsreXpsmmlE9-is_91-oGiTqC-K-cLQhNBF8GVenOPqw-nUgDyAo3RapzjH16TyEpWtgQTqq95a3I5Czs9hDbwBWPAVMPUIYjEd6nWwbXs";

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success': return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'error': return <XCircle className="w-4 h-4 text-red-500" />;
      default: return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <>
      <header className="bg-background border-b border-outline fixed top-0 w-full z-50 flex justify-between items-center px-6 md:px-12 py-6 md:py-8">
        <div className="flex items-center gap-3.5 group cursor-pointer select-none">
          {/* Cybernetic Techno Icon / Logo Glyph */}
          <div className="relative w-9 h-9 flex items-center justify-center overflow-hidden border border-primary/30 bg-primary/5 transition-all duration-300 group-hover:border-primary group-hover:bg-primary/10">
            {/* High-tech corners */}
            <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-primary" />
            <div className="absolute top-0 right-0 w-1.5 h-1.5 border-t border-r border-primary" />
            <div className="absolute bottom-0 left-0 w-1.5 h-1.5 border-b border-l border-primary" />
            <div className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r border-primary" />
            
            {/* Center geometric element */}
            <div className="w-3.5 h-3.5 bg-primary/20 border border-primary rotate-45 transform transition-all duration-500 group-hover:scale-110 group-hover:bg-primary group-hover:rotate-90 flex items-center justify-center">
              <div className="w-1 h-1 bg-background rounded-full transition-transform duration-300 group-hover:scale-125" />
            </div>
            
            {/* Scanning line indicator */}
            <div className="absolute inset-x-0 h-[1.5px] bg-primary/50 top-1/2 -translate-y-1/2 group-hover:animate-ping opacity-60 pointer-events-none" />
          </div>

          <div className="flex flex-col text-left">
            <h1 className="text-base md:text-[18px] font-black tracking-[0.2em] uppercase leading-none text-on-surface">
              QUEST<span className="text-primary font-mono select-none">_</span>GATE
            </h1>
            <span className="text-[7.5px] font-mono text-primary/70 tracking-[0.3em] uppercase leading-none mt-1 font-black">
              SYS // INTEL_CORP
            </span>
          </div>
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
          <NavButton active={activeTab === 'news'} label="News" onClick={() => {
            if (activeTab === 'news') window.scrollTo({ top: 0, behavior: 'smooth' });
            onTabChange('news');
          }} />
          <NavButton active={activeTab === 'alerts'} label="Alerts" onClick={() => {
            if (activeTab === 'alerts') window.scrollTo({ top: 0, behavior: 'smooth' });
            onTabChange('alerts');
          }} />
        </nav>

        <div className="flex items-center gap-4 md:gap-8">
          <div className="hidden sm:flex flex-col items-end mr-4">
            <span className="text-[9px] font-mono text-on-surface/20 uppercase tracking-widest leading-none">System Status</span>
            <div className="flex items-center gap-2 mt-1">
              {steamId && (
                <div className="px-1.5 py-0.5 bg-primary/20 border border-primary/30 rounded-[2px] flex items-center gap-1">
                  <div className="w-1 h-1 rounded-full bg-primary animate-pulse" />
                  <span className="text-[7px] font-black text-primary uppercase tracking-[0.2em] italic">Linked</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <div className="w-1 h-1 rounded-full bg-green-500" />
                <span className="text-[10px] font-bold text-on-surface/60 uppercase">Operational</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Notification Bell */}
            <div className="relative">
              <button 
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setShowSettings(false);
                  setShowThemeMenu(false);
                }}
                className={`w-10 md:w-12 h-10 md:h-12 border border-outline flex items-center justify-center transition-colors group relative ${showNotifications ? 'bg-primary text-on-primary' : 'hover:bg-on-surface hover:text-background'}`}
              >
                <Bell className={`w-5 h-5 ${showNotifications ? 'animate-none' : 'group-hover:animate-bounce'}`} />
                {unreadCount > 0 && (
                  <span className="absolute top-2 right-2 w-2 h-2 bg-primary border border-background rounded-full" />
                )}
              </button>

              <AnimatePresence>
                {showNotifications && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-[-48px] sm:right-0 mt-2 w-[calc(100vw-48px)] sm:w-80 md:w-96 bg-surface-bright border border-outline shadow-2xl z-[60]"
                  >
                    <div className="p-4 border-b border-outline bg-surface-bright/2 flex justify-between items-center">
                      <span className="text-[9px] font-black font-mono text-on-surface/40 uppercase tracking-widest">Inbox ({unreadCount})</span>
                      <button 
                        onClick={() => setNotifications(prev => prev.map(n => ({ ...n, status: 'read' as const })))}
                        className="text-[8px] font-bold text-primary uppercase tracking-widest hover:underline"
                      >
                        Mark all as read
                      </button>
                    </div>
                    
                    <div className="max-h-[400px] overflow-y-auto overflow-x-hidden scrollbar-hide">
                      {notifications.length > 0 ? (
                        <div className="flex flex-col divide-y divide-outline/20">
                          {notifications.map((n) => (
                            <button 
                              key={n.id}
                              onClick={() => {
                                toggleNotification(n.id);
                                setSelectedNotification(n);
                              }}
                              className={`p-4 text-left hover:bg-on-surface/5 transition-colors relative group
                                ${n.status === 'unread' ? 'bg-on-surface/2' : 'opacity-60'}`}
                            >
                              {n.status === 'unread' && (
                                <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-primary" />
                              )}
                              <div className="flex gap-3">
                                <div className="mt-0.5">{getIcon(n.type)}</div>
                                <div className="flex flex-col gap-1 min-w-0">
                                  <div className="flex justify-between items-start">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-on-surface truncate pr-2">{n.title}</span>
                                    <span className="text-[8px] font-mono text-on-surface/20 whitespace-nowrap">
                                      {n.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                  </div>
                                  <p className="text-[10px] text-on-surface/40 leading-relaxed font-medium line-clamp-2">{n.message}</p>
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div className="p-12 text-center">
                          <p className="text-[10px] font-mono text-on-surface/20 uppercase tracking-widest">No notifications</p>
                        </div>
                      )}
                    </div>

                    <div className="p-4 border-t border-outline flex justify-center">
                      <button 
                        onClick={() => {
                          onTabChange('alerts');
                          setShowNotifications(false);
                        }}
                        className="text-[9px] font-black uppercase tracking-[0.2em] text-on-surface/40 hover:text-on-surface transition-colors"
                      >
                        View System Logs
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="relative">
              <button 
                onClick={() => {
                  setShowSettings(!showSettings);
                  setShowNotifications(false);
                  setShowThemeMenu(false);
                }}
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
                    className="absolute right-0 mt-2 w-48 bg-surface-bright border border-outline shadow-2xl z-[60]"
                  >
                    <div className="p-4 border-b border-outline bg-on-surface/2">
                      <span className="text-[9px] font-mono text-on-surface/40 uppercase tracking-widest">Menu</span>
                    </div>
                    <div className="flex flex-col">
                      <button 
                        onClick={() => {
                          onTabChange('profile');
                          setShowSettings(false);
                        }}
                        className="flex items-center justify-between p-4 hover:bg-on-surface/5 transition-colors group"
                      >
                        <span className="text-[10px] font-bold uppercase tracking-widest">Profile Settings</span>
                        <ChevronDown className="w-4 h-4 -rotate-90 opacity-20 group-hover:opacity-100 transition-opacity" />
                      </button>
                      
                      <div className="relative">
                        <button 
                          onClick={() => setShowThemeMenu(!showThemeMenu)}
                          className={`w-full flex items-center justify-between p-4 hover:bg-on-surface/5 transition-colors group border-t border-outline ${showThemeMenu ? 'bg-on-surface/5' : ''}`}
                        >
                          <div className="flex items-center gap-2">
                             <Palette className="w-3 h-3 text-primary" />
                             <span className="text-[10px] font-bold uppercase tracking-widest">Aesthetics</span>
                          </div>
                          <ChevronDown className={`w-3 h-3 transition-transform ${showThemeMenu ? '' : '-rotate-90'}`} />
                        </button>
                        
                        <AnimatePresence>
                          {showThemeMenu && (
                            <motion.div 
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="overflow-hidden bg-on-surface/2"
                            >
                              {THEMES.map((t) => (
                                <button
                                  key={t.id}
                                  onClick={() => {
                                    setTheme(t.id);
                                    setShowThemeMenu(false);
                                    setShowSettings(false);
                                  }}
                                  className="w-full flex items-center justify-between px-6 py-3 hover:bg-on-surface/5 transition-colors"
                                >
                                  <span className={`text-[9px] font-bold uppercase tracking-widest ${theme === t.id ? 'text-primary' : 'text-on-surface/60'}`}>
                                    {t.label}
                                  </span>
                                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: t.color }} />
                                </button>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

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
                        className="flex items-center justify-between p-4 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-on-primary transition-all group border-t border-outline"
                      >
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Logout</span>
                        <LogOut className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="p-4 border-t border-outline flex justify-between items-center text-[8px] font-mono text-on-surface/20">
                      <span>v1.1.0</span>
                      <span>SECURE</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <button 
            onClick={() => {
              onTabChange('profile');
              setShowSettings(false);
              setShowNotifications(false);
              setShowThemeMenu(false);
            }}
            className={`w-10 md:w-12 h-10 md:h-12 border transition-all duration-500 overflow-hidden hidden sm:block group/avatar ${activeTab === 'profile' ? 'border-primary grayscale-0' : 'border-outline grayscale hover:grayscale-0'}`}
          >
            <img 
              alt="User Avatar" 
              className={`w-full h-full object-cover transition-all duration-500 ${activeTab === 'profile' ? 'brightness-100' : 'brightness-75 group-hover/avatar:brightness-100'}`} 
              src={avatarUrl || defaultAvatar}
            />
          </button>
        </div>
      </header>


      {/* Notification Detail Modal */}
      <AnimatePresence>
        {selectedNotification && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-background/80 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-lg bg-surface border border-outline shadow-2xl"
            >
              <div className="p-4 border-b border-outline bg-on-surface/2 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  {getIcon(selectedNotification.type)}
                  <span className="text-[10px] font-black font-mono text-on-surface/40 uppercase tracking-widest">Notification Detail</span>
                </div>
                <button onClick={() => setSelectedNotification(null)} className="p-2 hover:bg-on-surface/10 transition-colors">
                  <X className="w-4 h-4 text-on-surface" />
                </button>
              </div>

              <div className="p-8 space-y-6">
                <div className="space-y-2">
                  <h3 className="text-2xl font-black uppercase italic tracking-tighter text-on-surface">
                    {selectedNotification.title}
                  </h3>
                  <div className="flex items-center gap-4 text-[9px] font-mono text-on-surface/20 uppercase tracking-widest">
                    <span>{selectedNotification.timestamp.toLocaleDateString()}</span>
                    <span>•</span>
                    <span>{selectedNotification.timestamp.toLocaleTimeString()}</span>
                  </div>
                </div>

                <div className="p-6 bg-on-surface/2 border border-outline/10 space-y-4">
                  <p className="text-sm text-on-surface/60 leading-relaxed font-medium">
                    {selectedNotification.message}
                  </p>
                  {selectedNotification.details && (
                    <div className="pt-4 border-t border-outline/10">
                       <p className="text-[11px] font-mono text-on-surface/40 leading-relaxed uppercase tracking-wide">
                        {selectedNotification.details}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex gap-4 pt-4">
                  {selectedNotification.link && (
                    <button className="flex-1 px-6 py-4 bg-primary text-on-primary text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:brightness-110 transition-all">
                      Open Resource <ExternalLink className="w-3 h-3" />
                    </button>
                  )}
                  <button 
                    onClick={() => setSelectedNotification(null)}
                    className="flex-1 px-6 py-4 border border-outline text-on-surface text-[10px] font-black uppercase tracking-[0.2em] hover:bg-on-surface/5 transition-all text-center"
                  >
                    Acknowledge
                  </button>
                </div>
              </div>
              
              <div className="p-4 border-t border-outline flex justify-between items-center text-[8px] font-mono text-on-surface/20">
                <span>SYSTEM_MSG_ID: {selectedNotification.id}</span>
                <span className="text-primary font-bold">ENCRYPTED</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
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
    <nav className="md:hidden bg-background/90 backdrop-blur-md border-t border-outline/10 fixed bottom-0 w-full z-50 flex justify-around items-center h-[76px] px-2 shadow-[0_-8px_30px_rgba(0,0,0,0.2)] pb-[env(safe-area-inset-bottom,12px)] pt-1">
      <BottomNavButton 
        active={activeTab === 'progress'} 
        label="Progress" 
        icon={<TrendingUp className="w-5 h-5 stroke-[2]" />}
        onClick={() => handleTabClick('progress')}
      />
      <BottomNavButton 
        active={activeTab === 'library'} 
        label="Library" 
        icon={<Library className="w-5 h-5 stroke-[2]" />}
        onClick={() => handleTabClick('library')}
      />
      
      {/* Techno-ish Center Button representing Events */}
      <button 
        onClick={() => handleTabClick('events')}
        className="flex flex-col items-center justify-center flex-grow h-full relative transition-transform active:scale-95 select-none group px-1 pb-1"
      >
        {activeTab === 'events' && (
          <motion.div 
            layoutId="activeTabIndicator"
            className="absolute top-0 w-6 h-[2px] bg-primary rounded-full"
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
          />
        )}
        
        {/* Cybernetic Techno Icon */}
        <div className={`relative w-10 h-10 flex items-center justify-center border transition-all duration-300 rounded-[2px] 
          ${activeTab === 'events' 
            ? 'border-primary bg-primary/10 shadow-[0_0_12px_rgba(var(--color-primary),0.25)] scale-110 -translate-y-1' 
            : 'border-primary/20 bg-primary/5 group-hover:border-primary/40 group-hover:bg-primary/10'}`}>
          
          {/* Cyberpunk brackets inside button */}
          <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-primary/65" />
          <div className="absolute top-0 right-0 w-1.5 h-1.5 border-t border-r border-primary/65" />
          <div className="absolute bottom-0 left-0 w-1.5 h-1.5 border-b border-l border-primary/65" />
          <div className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r border-primary/65" />
          
          {/* Calendar icon inside high-tech frame */}
          <Calendar className={`w-5 h-5 transition-transform duration-300 group-hover:scale-110 ${activeTab === 'events' ? 'text-primary' : 'text-on-surface/40 group-hover:text-on-surface/70'}`} />
          
          {/* Subtle horizontal pulse laser */}
          <div className="absolute inset-x-0 h-[1px] bg-primary/25 top-1/2 -translate-y-1/2 opacity-70 group-hover:animate-pulse pointer-events-none" />
        </div>
        
        {/* Label Text */}
        <span className={`text-[8px] font-mono uppercase tracking-[0.15em] mt-1 transition-colors duration-300 select-none ${activeTab === 'events' ? 'text-primary font-bold' : 'text-on-surface/40 group-hover:text-on-surface/60'}`}>
          Events
        </span>
      </button>

      <BottomNavButton 
        active={activeTab === 'news'} 
        label="News" 
        icon={<Newspaper className="w-5 h-5 stroke-[2]" />}
        onClick={() => handleTabClick('news')}
      />
      <BottomNavButton 
        active={activeTab === 'alerts'} 
        label="Alerts" 
        icon={<Bell className="w-5 h-5 stroke-[2]" />}
        onClick={() => handleTabClick('alerts')}
      />
    </nav>
  );
}

function BottomNavButton({ active, label, icon, onClick }: { active: boolean; label: string; icon: ReactNode; onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className="flex flex-col items-center justify-center flex-grow h-full relative transition-transform active:scale-95 py-1 select-none group"
    >
      {/* Dynamic Animated Indicator Dot */}
      {active && (
        <motion.div 
          layoutId="activeTabIndicator"
          className="absolute top-0 w-4 h-[2px] bg-primary rounded-full"
          transition={{ type: "spring", stiffness: 380, damping: 30 }}
        />
      )}
      
      {/* Icon Frame */}
      <div className={`transition-all duration-300 ${active ? 'text-primary scale-110 -translate-y-0.5' : 'text-on-surface/40 group-hover:text-on-surface/70'}`}>
        {icon}
      </div>
      
      {/* Label Text */}
      <span className={`text-[8px] font-mono uppercase tracking-[0.15em] mt-1 transition-colors duration-300 select-none ${active ? 'text-primary font-bold' : 'text-on-surface/40'}`}>
        {label}
      </span>
    </button>
  );
}

