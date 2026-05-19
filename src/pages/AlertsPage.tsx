import { Calendar, TrendingUp, Clock, Bell, Trash2, MailOpen, X, ChevronDown, Binary, Shield, Zap, Search, Activity, Terminal } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface Notification {
  id: number;
  title: string;
  type: 'EVENT' | 'PROGRESS' | 'SYSTEM' | 'SOCIAL';
  time: string;
  read: boolean;
  logs: { timestamp: string; message: string; code: string }[];
}

const INITIAL_NOTIFICATIONS: Notification[] = [
  { 
    id: 1, 
    title: 'Tournament Access Granted', 
    type: 'EVENT', 
    time: '12M AGO', 
    read: false,
    logs: [
      { timestamp: '18:12:04', message: 'Auth token generated', code: '200_OK' },
      { timestamp: '18:12:05', message: 'Berlin Arena A1 sync', code: 'SYNC_UP' },
      { timestamp: '18:12:10', message: 'Competitor profile loaded', code: 'USER_MAPPED' }
    ]
  },
  { 
    id: 2, 
    title: 'Rank Sync Complete: Lvl 84', 
    type: 'PROGRESS', 
    time: '2H AGO', 
    read: true,
    logs: [
      { timestamp: '16:04:12', message: 'XP delta calculated', code: '+2,400' },
      { timestamp: '16:04:15', message: 'Milestone threshold: PASS', code: 'LVL_UP' },
      { timestamp: '16:04:20', message: 'Global index updated', code: 'RANK_84' }
    ]
  },
  { 
    id: 3, 
    title: 'New Patch: Protocol 1.2.4', 
    type: 'SYSTEM', 
    time: '5H AGO', 
    read: true,
    logs: [
      { timestamp: '13:00:00', message: 'Inbound patch detected', code: 'DL_START' },
      { timestamp: '13:15:30', message: 'SHA-256 verification', code: 'VERIFIED' },
      { timestamp: '13:20:00', message: 'Hotfix applied to server side', code: 'DONE' }
    ]
  },
  { 
    id: 4, 
    title: 'Team Invitation: Void Squad', 
    type: 'SOCIAL', 
    time: '1D AGO', 
    read: false,
    logs: [
      { timestamp: '09:00:22', message: 'Peer signal detected', code: 'INBOUND' },
      { timestamp: '09:00:25', message: 'Invitation buffer loaded', code: 'MSG_PEND' },
      { timestamp: '09:00:30', message: 'Sender: X_RAY_ALPHA', code: 'USER_ID' }
    ]
  },
];

export function AlertsPage() {
  const [settings, setSettings] = useState({
    tournamentStarts: true,
    matchInvites: true,
    patchNotes: false,
    rankChange: true,
    weeklySummary: true,
    goalMilestones: false
  });

  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    if (selectedId === id) setSelectedId(null);
  };

  const selectedAlert = notifications.find(n => n.id === selectedId);

  return (
    <div className="space-y-xl animate-in fade-in duration-700 max-w-5xl mx-auto pb-12 relative">
      <div className="absolute top-0 right-[-100px] hidden xl:block text-[8px] font-mono text-white/5 vertical-text h-full tracking-[1em] pointer-events-none">
        SIGNAL_PREFERENCE_LOADED
      </div>

      <div className="border-b border-white/10 pb-12 flex flex-col md:flex-row justify-between items-end gap-12">
        <div className="max-w-xl">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">Notification Center</span>
          <h2 className="text-[80px] md:text-[100px] lg:text-[140px] leading-[0.7] font-black uppercase tracking-tighter mt-4 transition-all">Alerts</h2>
          <p className="text-white/60 font-serif italic text-lg md:text-xl mt-8 max-w-xs leading-tight">
            Manage account notifications and system alerts.
          </p>
        </div>
        <div className="hidden lg:flex flex-col items-end gap-2 text-right">
          <span className="text-[10px] font-mono text-white/40 uppercase tracking-[0.3em]">Network Status</span>
          <span className="text-4xl font-mono font-light italic text-primary">Online</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/10 border border-white/10">
        <section className="bg-background p-12 flex flex-col gap-12">
          <div className="flex items-center gap-4">
            <Calendar className="w-5 h-5 text-primary" />
            <h3 className="text-[10px] font-bold uppercase tracking-[0.3em]">Event Notifications</h3>
          </div>
          <div className="space-y-2">
            <ToggleRow label="Tournament Starts" enabled={settings.tournamentStarts} onToggle={() => toggleSetting('tournamentStarts')} />
            <ToggleRow label="Match Invites" enabled={settings.matchInvites} onToggle={() => toggleSetting('matchInvites')} />
            <ToggleRow label="Patch Notes" enabled={settings.patchNotes} onToggle={() => toggleSetting('patchNotes')} />
          </div>
        </section>

        <section className="bg-background p-12 flex flex-col gap-12 lg:border-l border-white/10">
          <div className="flex items-center gap-4">
            <TrendingUp className="w-5 h-5 text-primary" />
            <h3 className="text-[10px] font-bold uppercase tracking-[0.3em]">Activity Updates</h3>
          </div>
          <div className="space-y-2">
            <ToggleRow label="Rank Changes" enabled={settings.rankChange} onToggle={() => toggleSetting('rankChange')} />
            <ToggleRow label="Weekly Summary" enabled={settings.weeklySummary} onToggle={() => toggleSetting('weeklySummary')} />
            <ToggleRow label="Milestone Achievements" enabled={settings.goalMilestones} onToggle={() => toggleSetting('goalMilestones')} />
          </div>
        </section>
      </div>

      {/* Notification Inbox */}
      <section className="border border-white/10 bg-background overflow-hidden relative min-h-[400px]">
        <div className="p-8 border-b border-white/10 flex justify-between items-center bg-white/[0.02]">
          <div className="flex items-center gap-4">
            <Bell className="w-5 h-5 text-primary" />
            <h3 className="text-[10px] font-bold uppercase tracking-[0.3em]">Inbox</h3>
          </div>
          <button 
            onClick={markAllRead}
            className="text-[9px] font-bold uppercase tracking-widest text-white/40 hover:text-primary transition-colors flex items-center gap-2"
          >
            <MailOpen className="w-3 h-3" /> Mark Read
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 divide-x divide-white/10">
          <div className="lg:col-span-12 flex flex-col divide-y divide-white/5">
            <AnimatePresence initial={false}>
              {notifications.map((n) => (
                <div key={n.id}>
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`p-8 flex items-center justify-between group hover:bg-white/[0.03] transition-all cursor-pointer ${!n.read ? 'bg-primary/5 border-l-2 border-primary' : ''} ${selectedId === n.id ? 'bg-white/5' : ''}`}
                    onClick={() => setSelectedId(selectedId === n.id ? null : n.id)}
                  >
                    <div className="flex flex-col">
                      <div className="flex items-center gap-3">
                        <span className={`text-[8px] font-mono uppercase tracking-[0.3em] ${n.read ? 'text-white/30' : 'text-primary'}`}>{n.type}</span>
                        {!n.read && <div className="w-1 h-1 rounded-full bg-primary animate-pulse" />}
                      </div>
                      <span className={`text-xl font-black uppercase mt-2 tracking-tight ${n.read ? 'text-white/60' : 'text-white'}`}>{n.title}</span>
                    </div>
                    <div className="flex items-center gap-8">
                      <span className="text-[9px] font-mono text-white/20 uppercase group-hover:text-white/40 transition-colors">{n.time}</span>
                      <button 
                        onClick={(e) => { e.stopPropagation(); deleteNotification(n.id); }}
                        className="opacity-0 group-hover:opacity-100 text-white/20 hover:text-red-500 transition-all p-2"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                  
                  {/* EXPANDED LOG VIEW */}
                  <AnimatePresence>
                    {selectedId === n.id && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden bg-black/40"
                      >
                         <div className="p-12 border-t border-white/5 space-y-8">
                            <div className="flex items-center gap-4 text-primary">
                               <Terminal className="w-4 h-4" />
                               <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Details</span>
                            </div>
                            <div className="space-y-4 font-mono">
                               {n.logs.map((log, i) => (
                                 <div key={i} className="flex gap-8 group/log">
                                    <span className="text-[10px] text-white/20 group-hover/log:text-white/40 transition-colors">[{log.timestamp}]</span>
                                    <span className="text-[11px] text-white/60 flex-grow italic">{log.message}</span>
                                    <span className="text-[10px] text-primary/40 group-hover/log:text-primary transition-colors">{log.code}</span>
                                 </div>
                               ))}
                            </div>
                            <div className="pt-8 grid grid-cols-2 gap-4">
                               <button className="py-4 border border-white/10 text-[9px] font-black uppercase tracking-[0.3em] text-white/40 hover:text-white hover:border-white transition-all">
                                  Trace Route
                               </button>
                               <button className="py-4 bg-white/5 text-[9px] font-black uppercase tracking-[0.3em] text-white/80 hover:bg-white hover:text-black transition-all">
                                  Dismiss
                               </button>
                            </div>
                         </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </AnimatePresence>
            {notifications.length === 0 && (
              <div className="p-32 flex flex-col items-center justify-center grayscale opacity-10 space-y-6">
                <Shield className="w-16 h-16" />
                <span className="text-[10px] font-bold uppercase tracking-[0.4em]">No Notifications</span>
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="flex justify-end pt-12">
        <button className="bg-white text-black font-black uppercase tracking-[0.4em] px-16 py-6 text-sm hover:bg-primary transition-all active:scale-95 shadow-xl shadow-primary/20">
          Save Settings
        </button>
      </div>
    </div>
  );
}

function ToggleRow({ label, enabled, onToggle }: { label: string; enabled: boolean; onToggle: () => void }) {
  return (
    <div className="flex justify-between items-center py-5 border-b border-white/5 hover:bg-white/5 px-4 transition-colors group cursor-pointer" onClick={onToggle}>
      <span className={`text-[10px] font-bold uppercase tracking-[0.2em] transition-colors ${enabled ? 'text-white' : 'text-white/30 group-hover:text-white/60'}`}>{label}</span>
      <button 
        className={`w-12 h-6 border transition-all duration-300 flex items-center px-1 ${enabled ? 'bg-primary border-primary' : 'bg-transparent border-white/20'}`}
      >
        <motion.div 
          animate={{ x: enabled ? 22 : 0 }}
          className={`w-4 h-4 ${enabled ? 'bg-black' : 'bg-white/20'}`}
        />
      </button>
    </div>
  );
}
