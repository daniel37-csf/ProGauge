import { Calendar, TrendingUp, Clock, Bell, Trash2, MailOpen } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export function AlertsPage() {
  const [settings, setSettings] = useState({
    tournamentStarts: true,
    matchInvites: true,
    patchNotes: false,
    rankChange: true,
    weeklySummary: true,
    goalMilestones: false
  });

  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Tournament Access Granted', type: 'EVENT', time: '12M AGO', read: false },
    { id: 2, title: 'Rank Sync Complete: Lvl 84', type: 'PROGRESS', time: '2H AGO', read: true },
    { id: 3, title: 'New Patch: Protocol 1.2.4', type: 'SYSTEM', time: '5H AGO', read: true },
    { id: 4, title: 'Team Invitation: Void Squad', type: 'SOCIAL', time: '1D AGO', read: false },
  ]);

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div className="space-y-xl animate-in fade-in duration-700 max-w-5xl mx-auto pb-12 relative">
      <div className="absolute top-0 right-[-100px] hidden xl:block text-[8px] font-mono text-white/5 vertical-text h-full tracking-[1em] pointer-events-none">
        ENCRYPTED_SIGNAL_PREFERENCE_LOAD_SUCCESS_DATA_PKT_082.9
      </div>

      <div className="border-b border-white/10 pb-12 flex flex-col md:flex-row justify-between items-end gap-12">
        <div className="max-w-xl">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">Global Preferences</span>
          <h2 className="text-[80px] md:text-[100px] lg:text-[140px] leading-[0.7] font-black uppercase tracking-tighter mt-4 transition-all">Alert<br/><span className="text-primary italic">S</span>ync</h2>
          <p className="text-white/80 font-serif italic text-lg md:text-xl mt-8 max-w-sm leading-relaxed">
            Manage your tactical alerts and node notifications with millisecond precision.
          </p>
        </div>
        <div className="hidden lg:flex flex-col items-end gap-2 text-right">
          <span className="text-[10px] font-mono text-white/40 uppercase tracking-[0.3em]">Latency Threshold</span>
          <span className="text-4xl font-mono font-light italic text-primary">±0.02ms</span>
          <div className="w-32 h-[1px] bg-white/10 mt-2"></div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/10 border border-white/10">
        {/* Event Alerts */}
        <section className="bg-background p-12 flex flex-col gap-12">
          <div className="flex items-center gap-4">
            <Calendar className="w-5 h-5 text-primary" />
            <h3 className="text-[10px] font-bold uppercase tracking-[0.3em]">Event Alerts</h3>
          </div>
          
          <div className="space-y-4">
            <ToggleRow 
              label="Tournament Starts" 
              enabled={settings.tournamentStarts} 
              onToggle={() => toggleSetting('tournamentStarts')}
            />
            <ToggleRow 
              label="Match Invites" 
              enabled={settings.matchInvites} 
              onToggle={() => toggleSetting('matchInvites')}
            />
            <ToggleRow 
              label="Patch Notes" 
              enabled={settings.patchNotes} 
              onToggle={() => toggleSetting('patchNotes')}
            />
          </div>
        </section>

        {/* Progress Alerts */}
        <section className="bg-background p-12 flex flex-col gap-12 border-l border-white/10">
          <div className="flex items-center gap-4">
            <TrendingUp className="w-5 h-5 text-primary" />
            <h3 className="text-[10px] font-bold uppercase tracking-[0.3em]">Progress Alerts</h3>
          </div>
          
          <div className="space-y-4">
            <ToggleRow 
              label="Rank Up / Down" 
              enabled={settings.rankChange} 
              onToggle={() => toggleSetting('rankChange')}
            />
            <ToggleRow 
              label="Weekly Summary" 
              enabled={settings.weeklySummary} 
              onToggle={() => toggleSetting('weeklySummary')}
            />
            <ToggleRow 
              label="Goal Milestones" 
              enabled={settings.goalMilestones} 
              onToggle={() => toggleSetting('goalMilestones')}
            />
          </div>
        </section>
      </div>

      {/* Notification Inbox */}
      <section className="border border-white/10 bg-background overflow-hidden">
        <div className="p-8 border-b border-white/10 flex justify-between items-center bg-white/[0.02]">
          <div className="flex items-center gap-4">
            <Bell className="w-5 h-5 text-primary" />
            <h3 className="text-[10px] font-bold uppercase tracking-[0.3em]">Notification Inbox</h3>
          </div>
          <button 
            onClick={markAllRead}
            className="text-[9px] font-bold uppercase tracking-widest text-white/60 hover:text-primary transition-colors flex items-center gap-2"
          >
            <MailOpen className="w-3 h-3" /> Mark All Read
          </button>
        </div>

        <div className="flex flex-col divide-y divide-white/5">
          <AnimatePresence initial={false}>
            {notifications.map((n) => (
              <motion.div 
                key={n.id}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className={`p-8 flex items-center justify-between group hover:bg-white/5 transition-colors ${!n.read ? 'border-l-2 border-primary' : ''}`}
              >
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className={`text-[9px] font-mono uppercase tracking-widest ${n.read ? 'text-white/50' : 'text-primary'}`}>{n.type}</span>
                    {!n.read && <div className="w-1 h-1 rounded-full bg-primary" />}
                  </div>
                  <span className={`text-lg font-black uppercase mt-1 ${n.read ? 'text-white/80' : 'text-white'}`}>{n.title}</span>
                </div>
                <div className="flex items-center gap-8">
                  <span className="text-[9px] font-mono text-white/40 uppercase">{n.time}</span>
                  <button 
                    onClick={() => deleteNotification(n.id)}
                    className="opacity-0 group-hover:opacity-100 text-white/20 hover:text-red-500 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {notifications.length === 0 && (
            <div className="p-20 flex flex-col items-center justify-center grayscale opacity-20">
              <Bell className="w-12 h-12 mb-4" />
              <span className="text-[10px] font-bold uppercase tracking-[0.3em]">No Active Alerts</span>
            </div>
          )}
        </div>
      </section>

      <div className="flex justify-end pt-12">
        <button className="bg-white text-black font-black uppercase tracking-[0.4em] px-16 py-6 text-sm hover:bg-primary transition-colors">
          Commit Changes
        </button>
      </div>
    </div>
  );
}

function ToggleRow({ label, enabled, onToggle }: { label: string; enabled: boolean; onToggle: () => void }) {
  return (
    <div className="flex justify-between items-center py-4 border-b border-white/5 hover:bg-white/5 px-2 transition-colors group">
      <span className={`text-[10px] font-bold uppercase tracking-[0.2em] transition-colors ${enabled ? 'text-white' : 'text-white/40 group-hover:text-white/60'}`}>{label}</span>
      <button 
        onClick={onToggle}
        className={`w-12 h-6 border transition-all duration-200 flex items-center px-1 ${enabled ? 'bg-primary border-primary' : 'bg-transparent border-white/20'}`}
      >
        <motion.div 
          animate={{ x: enabled ? 22 : 0 }}
          className={`w-4 h-4 ${enabled ? 'bg-black' : 'bg-white/40'}`}
        />
      </button>
    </div>
  );
}
