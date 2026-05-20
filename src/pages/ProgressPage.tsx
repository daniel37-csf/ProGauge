import { Shield, Trophy, Award, Star, ArrowRight, Activity, Clock, Target, Zap, ChevronRight, X, BarChart3, Binary, Flame } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState, FormEvent, useEffect } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, Tooltip } from 'recharts';

const PERFORMANCE_DATA = [
  { name: 'JAN', value: 45 },
  { name: 'FEB', value: 52 },
  { name: 'MAR', value: 48 },
  { name: 'APR', value: 61 },
  { name: 'MAY', value: 55 },
  { name: 'JUN', value: 78 },
];

const SKILL_DATA = [
  { id: 'tactical', label: 'Tactical Awareness', value: 88, desc: 'Efficiency in node capture speed and stealth infiltration.' },
  { id: 'combat', label: 'Combat Proficiency', value: 94, desc: 'K/D ratio optimization and precision firing accuracy.' },
  { id: 'network', label: 'Network Integrity', value: 72, desc: 'Resilience against system breaches and firewall stability.' }
];

interface Pursuit {
  id: string;
  title: string;
  subtitle: string;
  gameUid: string;
  progress: number;
  stats: string;
  active?: boolean;
  detailedStats: { label: string; value: string }[];
}

const PURSUITS: Pursuit[] = [
  { 
    id: 'elden-ring', 
    title: "Elden Ring", 
    subtitle: "Shadow of the Erdtree", 
    gameUid: "Steam ID", 
    progress: 88, 
    stats: "38/42",
    detailedStats: [
      { label: 'Bosses Defeated', value: '142' },
      { label: 'Points Logged', value: '12.4M' },
      { label: 'Attempts Tracked', value: '412' }
    ]
  },
  { 
    id: 'cyberpunk', 
    title: "Cyberpunk 2077", 
    subtitle: "Phantom Liberty", 
    gameUid: "GOG Account", 
    progress: 62, 
    stats: "28/45", 
    active: true,
    detailedStats: [
      { label: 'Cyberware Sync', value: '98%' },
      { label: 'Eddies Collected', value: '450k' },
      { label: 'Respect', value: 'MAX' }
    ]
  },
  { 
    id: 'fortnite', 
    title: "Fortnite", 
    subtitle: "Chapter 5 / S2", 
    gameUid: "Epic Account", 
    progress: 45, 
    stats: "12 Days",
    detailedStats: [
      { label: 'Crown Victories', value: '12' },
      { label: 'Total Eliminations', value: '842' },
      { label: 'Battle Pass Level', value: '142' }
    ]
  }
];

const STEAM_GAME_IDS: Record<string, string> = {
  'VALORANT': '',
  'ELDEN RING': '1245620',
  'NEON BLADE': '',
  'APEX LEGENDS': '1172470',
  'STELLAR VOID': '',
  'HALO': '1240440',
  'CYBERPUNK': '1091500',
};

export function ProgressPage({ onNavigateToArchive, steamId: globalSteamId }: { onNavigateToArchive?: () => void; steamId: string | null }) {
  const [pursuits, setPursuits] = useState<Pursuit[]>(PURSUITS);
  const [selectedPursuitId, setSelectedPursuitId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);
  
  // New Pursuit Form State
  const [newTitle, setNewTitle] = useState('');
  const [newGameUid, setNewGameUid] = useState('');
  const [newSubtitle, setNewSubtitle] = useState('');
  const [isSteamSynced, setIsSteamSynced] = useState(!!globalSteamId);
  const [steamId, setSteamId] = useState(globalSteamId || '');

  useEffect(() => {
    if (globalSteamId && !steamId) {
      setSteamId(globalSteamId);
      setIsSteamSynced(true);
    }
  }, [globalSteamId]);

  const selectedPursuit = pursuits.find(p => p.id === selectedPursuitId);

  const handleAddPursuit = async (e: FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;

    if (isSteamSynced) {
      if (!steamId) {
        setSyncError('Steam ID is required');
        return;
      }
      const appId = STEAM_GAME_IDS[newTitle];
      if (!appId) {
        setSyncError('Steam Sync not available for this node');
        return;
      }

      setIsSyncing(true);
      setSyncError(null);

      try {
        const response = await fetch(`/api/steam/achievements?steamId=${steamId}&appId=${appId}`);
        const data = await response.json();

        if (!response.ok) throw new Error(data.error || 'Sync Failed');

        const achievements = data.achievements || [];
        const completed = achievements.filter((a: any) => a.achieved === 1).length;
        const total = achievements.length;
        const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

        const newPursuit: Pursuit = {
          id: Math.random().toString(36).substr(2, 9),
          title: newTitle,
          subtitle: newSubtitle || 'Steam Linked',
          gameUid: `STEAM_${appId}`,
          progress,
          stats: `${completed}/${total}`,
          detailedStats: [
            { label: 'Sync Status', value: 'Live' },
            { label: 'Network', value: 'Steam Cloud' },
            { label: 'Achievements', value: `${completed}/${total}` }
          ]
        };

        setPursuits([newPursuit, ...pursuits]);
        setIsAdding(false);
        resetForm();
      } catch (err: any) {
        setSyncError(err.message);
      } finally {
        setIsSyncing(false);
      }
    } else {
      if (!newGameUid) return;
      const newPursuit: Pursuit = {
        id: Math.random().toString(36).substr(2, 9),
        title: newTitle,
        subtitle: newSubtitle || 'Local',
        gameUid: newGameUid,
        progress: 0,
        stats: 'Pending',
        detailedStats: [
          { label: 'Sync Status', value: 'Manual' },
          { label: 'Data Source', value: 'Local Storage' },
          { label: 'Auth Level', value: 'Local' }
        ]
      };

      setPursuits([newPursuit, ...pursuits]);
      setIsAdding(false);
      resetForm();
    }
  };

  const resetForm = () => {
    setNewTitle('');
    setNewGameUid('');
    setNewSubtitle('');
    setIsSteamSynced(false);
    setSteamId('');
    setSyncError(null);
  };

  return (
    <div className="space-y-xl animate-in fade-in duration-700">
      <AnimatePresence mode="wait">
        {!selectedPursuitId ? (
          <motion.div 
            key="grid"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="space-y-xl"
          >
            {/* Bento Grid: High-Level Stats */}
            <section className="grid grid-cols-1 md:grid-cols-12 border border-outline group">
              <div className="md:col-span-8 p-12 lg:p-16 border-b md:border-b-0 md:border-r border-outline flex flex-col justify-between group hover:bg-on-surface/[0.03] transition-all relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 text-[8px] font-mono text-on-surface/5 uppercase tracking-[0.5em] vertical-text h-full pointer-events-none">
                  RANK_PROTOCOL_84
                </div>
                
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">Global Rank</span>
                  <span className="text-[10px] font-mono text-on-surface/60 uppercase tracking-widest">Protocol 084 // Sector 7</span>
                </div>

                <div className="flex flex-col lg:flex-row items-center lg:items-end justify-between gap-12 mt-12 md:mt-24">
                  <h2 className="text-[100px] md:text-[140px] lg:text-[180px] leading-[0.7] font-black uppercase tracking-tighter select-none -ml-4 transition-all hover:italic cursor-default text-on-surface">
                    Lvl<br/>
                    <span className="text-primary italic group-hover:not-italic transition-all">8</span>4
                  </h2>
                  
                  <div className="relative w-48 h-48 lg:w-64 lg:h-64 flex items-center justify-center group/circle">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" fill="transparent" r="48" stroke="var(--outline)" strokeOpacity="0.1" strokeWidth="2" />
                      <motion.circle 
                        initial={{ strokeDashoffset: 301.6 }}
                        animate={{ strokeDashoffset: 301.6 * (1 - 0.78) }}
                        transition={{ duration: 2.5, ease: [0.16, 1, 0.3, 1] }}
                        cx="50" cy="50" fill="transparent" r="48" stroke="var(--primary)" 
                        strokeDasharray="301.6" strokeLinecap="square" strokeWidth="2" 
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center">
                      <span className="text-4xl lg:text-5xl font-light font-mono tracking-tight transition-all group-hover/circle:scale-110 text-on-surface">78%</span>
                      <span className="text-[9px] font-bold uppercase tracking-widest text-on-surface/70 mt-1">Progress</span>
                    </div>
                  </div>
                </div>

                <div className="mt-12 lg:mt-24 flex flex-wrap items-center gap-12 border-t border-outline/5 pt-8">
                  <div className="flex items-center gap-4">
                    <Shield className="w-5 h-5 text-primary" />
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface">Master Rank</span>
                      <span className="text-[9px] font-mono text-on-surface/60 uppercase mt-0.5">Elite Tier</span>
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[9px] font-mono text-on-surface/60 uppercase">Next Tier At</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest mt-0.5 text-on-surface">14,200 EXP</span>
                  </div>
                </div>
              </div>

              <div 
                onClick={onNavigateToArchive}
                className="md:col-span-4 p-12 flex flex-col justify-between bg-on-surface text-background hover:bg-primary transition-colors duration-500 cursor-pointer group/archive"
              >
                <div className="flex justify-between items-start">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">Data Milestone</span>
                    <h3 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mt-2">Archive</h3>
                  </div>
                  <Trophy className="w-10 h-10 opacity-20 group-hover/archive:scale-110 transition-transform" />
                </div>

                <div className="space-y-12 mt-12 md:mt-0">
                  <div className="flex flex-col">
                    <span className="text-6xl md:text-8xl font-light font-mono italic leading-[0.8] tracking-tighter transition-all">1,402</span>
                    <div className="flex items-center gap-3 mt-4">
                      <div className="h-[1px] w-8 bg-background/40"></div>
                      <span className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-40">Total Achievements</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4 pt-8 border-t border-background/10">
                    <AchievementRow icon={<Award className="w-4 h-4" />} count="14" label="Platinum" bgOnSurface />
                    <AchievementRow icon={<Shield className="w-4 h-4" />} count="86" label="Gold" bgOnSurface />
                    <AchievementRow icon={<Star className="w-4 h-4" />} count="245" label="Silver" bgOnSurface />
                  </div>
                </div>
              </div>
            </section>


            {/* Performance Section */}
            <section className="grid grid-cols-1 md:grid-cols-12 border border-outline overflow-hidden">
              <div className="md:col-span-4 p-12 border-b md:border-b-0 md:border-r border-outline flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">Performance</span>
                  <h3 className="text-4xl font-black uppercase tracking-tighter mt-2 leading-none text-on-surface">Activity Metrics</h3>
                  <p className="text-xs text-on-surface/60 italic font-serif mt-4 pr-4">
                    Real-time synchronization of tactical achievements and response latency across all active nodes.
                  </p>
                </div>
                <div className="mt-12 flex flex-col gap-2">
                  <span className="text-4xl font-mono font-light italic text-primary">+24.5%</span>
                  <span className="text-[9px] font-bold uppercase tracking-widest text-on-surface/40">Monthly Delta</span>
                </div>
              </div>
              <div className="md:col-span-8 h-80 pt-12 pr-4 bg-on-surface/[0.02]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={PERFORMANCE_DATA}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis 
                      dataKey="name" 
                      stroke="var(--on-surface-variant)" 
                      fontSize={10} 
                      tickLine={false} 
                      axisLine={false} 
                      className="font-mono"
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'var(--surface)', border: '1px solid var(--outline)', borderRadius: '0px' }}
                      itemStyle={{ color: 'var(--primary)', fontSize: '10px', fontWeight: 'bold' }}
                      labelStyle={{ color: 'var(--on-surface-variant)', fontSize: '9px', marginBottom: '4px' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="value" 
                      stroke="var(--primary)" 
                      strokeWidth={2}
                      fillOpacity={1} 
                      fill="url(#colorValue)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </section>


            {/* Active Pursuits */}
            <section className="bg-background border border-outline">
              <div className="p-8 border-b border-outline flex justify-between items-center">
                <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-on-surface">Active Pursuits / {pursuits.length}</h3>
                <Binary className="w-4 h-4 text-primary" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-outline/10 group/pursuits">
                {pursuits.map(p => (
                  <PursuitItem 
                    key={p.id}
                    {...p}
                    onClick={() => setSelectedPursuitId(p.id)}
                  />
                ))}
                
                <motion.div 
                  layout
                  onClick={() => setIsAdding(true)}
                  className="p-10 flex flex-col justify-center items-center gap-6 cursor-pointer hover:bg-on-surface/5 transition-all text-on-surface/20 hover:text-primary group/add border-t md:border-t-0"
                >
                  <div className="w-16 h-16 border border-current flex items-center justify-center group-hover/add:rotate-90 transition-transform duration-500 font-black">
                    <Zap className="w-6 h-6 fill-current" />
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em]">Add Game</span>
                    <span className="text-[8px] font-mono uppercase opacity-40">Connect new game data</span>
                  </div>
                </motion.div>
              </div>
            </section>


            {/* History Link */}
            <div 
              onClick={onNavigateToArchive}
              className="p-12 flex flex-col justify-center items-center text-background bg-primary cursor-pointer group hover:bg-on-surface hover:text-background transition-all border border-outline font-black"
            >
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">Full History Access</span>
            </div>


            {/* Add New Pursuit Overlay */}
            <AnimatePresence>
              {isAdding && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-50 bg-background/90 backdrop-blur-md flex items-center justify-center p-8"
                >
                  <motion.div 
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    className="w-full max-w-xl bg-surface border border-outline overflow-hidden"
                  >
                    <div className="p-8 border-b border-outline flex justify-between items-center bg-on-surface/[0.02]">
                       <div className="flex items-center gap-4 text-primary">
                          <Binary className="w-5 h-5" />
                          <h3 className="text-[10px] font-bold uppercase tracking-[0.3em]">New Tracking Setup</h3>
                       </div>
                       <button onClick={() => setIsAdding(false)} className="text-on-surface/20 hover:text-on-surface transition-colors">
                          <X className="w-5 h-5" />
                       </button>
                    </div>

                    <form onSubmit={handleAddPursuit} className="p-12 space-y-12">
                       <div className="space-y-10">
                           <div className="space-y-4">
                             <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface/30 italic">Game Title</label>
                             <div className="relative group/select">
                               <select 
                                  required
                                  value={newTitle}
                                  onChange={(e) => setNewTitle(e.target.value)}
                                  className="w-full bg-surface border-b border-outline py-4 text-2xl font-black uppercase tracking-tighter text-primary focus:outline-none focus:border-primary transition-colors appearance-none cursor-pointer pr-10"
                               >
                                  <option value="" disabled className="bg-surface text-on-surface/20">Select Game</option>
                                  <option value="VALORANT" className="bg-surface">VALORANT</option>
                                  <option value="ELDEN RING" className="bg-surface">ELDEN RING</option>
                                  <option value="NEON BLADE" className="bg-surface">NEON BLADE</option>
                                  <option value="APEX LEGENDS" className="bg-surface">APEX LEGENDS</option>
                                  <option value="STELLAR VOID" className="bg-surface">STELLAR VOID</option>
                                  <option value="HALO" className="bg-surface">HALO</option>
                                  <option value="CYBERPUNK" className="bg-surface">CYBERPUNK</option>
                               </select>
                               <ChevronRight className="absolute right-0 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/40 group-hover/select:text-primary transition-colors rotate-90" />
                             </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            <div className="space-y-4">
                               <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface/30 italic">Connection Method</label>
                               <div className="flex gap-4 font-black">
                                  <button 
                                    type="button"
                                    onClick={() => setIsSteamSynced(false)}
                                    className={`flex-1 py-4 border text-[10px] font-bold uppercase tracking-widest transition-all ${!isSteamSynced ? 'bg-on-surface text-background border-on-surface' : 'border-outline text-on-surface/40 hover:border-on-surface'}`}
                                  >
                                     Manual ID
                                  </button>
                                  <button 
                                    type="button"
                                    onClick={() => setIsSteamSynced(true)}
                                    className={`flex-1 py-4 border text-[10px] font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${isSteamSynced ? 'bg-primary text-background border-primary' : 'border-outline text-on-surface/40 hover:border-on-surface'}`}
                                  >
                                     <Activity className="w-4 h-4" />
                                     Sync with Steam
                                  </button>
                               </div>
                            </div>
                            
                             <div className="space-y-4">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface/30 italic">{isSteamSynced ? 'Steam ID / URL' : 'Game ID'}</label>
                                {isSteamSynced ? (
                                  <input 
                                    required
                                    value={steamId}
                                    onChange={(e) => setSteamId(e.target.value)}
                                    placeholder="Enter SteamID64"
                                    className="w-full bg-transparent border-b border-outline py-4 text-sm font-mono text-on-surface focus:outline-none focus:border-primary transition-colors"
                                  />
                                ) : (
                                  <input 
                                    required
                                    value={newGameUid}
                                    onChange={(e) => setNewGameUid(e.target.value)}
                                    placeholder="APP_ID_X77"
                                    className="w-full bg-transparent border-b border-outline py-4 text-sm font-mono text-on-surface focus:outline-none focus:border-primary transition-colors"
                                  />
                                )}
                             </div>
                          </div>

                          {syncError && (
                            <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-[9px] font-bold uppercase tracking-widest">
                              Error: {syncError}
                            </div>
                          )}

                          <div className="space-y-4">
                             <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface/30 italic">Sub-Label (Optional)</label>
                             <input 
                                value={newSubtitle}
                                onChange={(e) => setNewSubtitle(e.target.value)}
                                placeholder="e.g. DLC Name or Session Label"
                                className="w-full bg-transparent border-b border-outline py-4 text-sm font-mono text-on-surface focus:outline-none focus:border-primary transition-colors"
                             />
                          </div>
                       </div>

                       <div className="grid grid-cols-2 gap-6 pt-12">
                          <button 
                            type="button"
                            onClick={() => setIsAdding(false)}
                            className="py-5 border border-outline text-on-surface/40 font-black uppercase tracking-[0.4em] text-[10px] hover:text-on-surface hover:border-on-surface transition-all"
                          >
                             Cancel
                          </button>
                          <button 
                            type="submit"
                            disabled={isSyncing}
                            className="py-5 bg-primary text-background font-black uppercase tracking-[0.4em] text-[10px] hover:bg-on-surface hover:text-background transition-all shadow-xl shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                             {isSyncing ? 'Syncing...' : 'Add Game'}
                          </button>
                       </div>
                    </form>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

          </motion.div>
        ) : (
          <motion.div 
            key="detail"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="border border-outline bg-on-surface/2 overflow-hidden"
          >
            <div className="p-6 border-b border-outline flex justify-between items-center bg-surface-dim/40">
              <button 
                onClick={() => setSelectedPursuitId(null)}
                className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-on-surface/40 hover:text-on-surface font-black"
              >
                <ArrowRight className="w-4 h-4 rotate-180" />
                <span>Back to Progress</span>
              </button>
              <div className="flex items-center gap-4">
                <div className="px-3 py-1 border border-primary/20 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest">
                  ACTIVE SYNC
                </div>
                <X className="w-5 h-5 text-on-surface/20 hover:text-on-surface cursor-pointer" onClick={() => setSelectedPursuitId(null)} />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-px bg-outline/5">
              <div className="lg:col-span-8 p-12 lg:p-16 flex flex-col justify-between min-h-[400px]">
                <div>
                  <span className="text-xs font-mono text-primary tracking-[0.5em] uppercase">{selectedPursuit?.gameUid}</span>
                  <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none mt-4 italic text-on-surface">
                    {selectedPursuit?.title.split(' ')[0]}<br/>
                    <span className="text-primary">{selectedPursuit?.title.split(' ')[1] || ''}</span>
                  </h2>
                  <p className="text-sm text-on-surface/60 italic font-serif max-w-sm mt-8 border-l border-outline/20 pl-6">
                    {selectedPursuit?.subtitle} // Operational status confirmed. High-fidelity data sync ongoing.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 pt-12 border-t border-outline/5">
                  {selectedPursuit?.detailedStats.map(stat => (
                    <div key={stat.label} className="space-y-1">
                      <span className="text-[9px] font-bold uppercase tracking-widest text-on-surface/30">{stat.label}</span>
                      <p className="text-2xl font-mono text-on-surface/90">{stat.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-4 p-12 flex flex-col justify-between bg-on-surface/5 border-l border-outline/10">
                <div className="space-y-12">
                  <div className="space-y-6">
                    <div className="flex justify-between items-end">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface/40 italic">Sync Level</span>
                      <span className="text-3xl font-mono text-primary italic">{selectedPursuit?.progress}%</span>
                    </div>
                    <div className="h-1 bg-on-surface/5">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${selectedPursuit?.progress}%` }}
                        transition={{ duration: 1, ease: "circOut" }}
                        className="h-full bg-primary"
                      />
                    </div>
                  </div>

                  <div className="space-y-8">
                     <h4 className="text-[10px] font-bold uppercase tracking-widest italic group-hover:text-primary transition-colors text-on-surface">Skill Progression</h4>
                     <div className="space-y-6">
                        {SKILL_DATA.map(skill => (
                          <div key={skill.id} className="space-y-3">
                            <div className="flex justify-between text-[10px] font-mono">
                              <span className="text-on-surface/60">{skill.label}</span>
                              <span className="text-primary">{skill.value}%</span>
                            </div>
                            <div className="h-0.5 bg-on-surface/5">
                               <div className="h-full bg-on-surface/40" style={{ width: `${skill.value}%` }} />
                            </div>
                          </div>
                        ))}
                     </div>
                  </div>
                </div>

                <button 
                   onClick={async () => {
                     // ... logic
                   }}
                   className="w-full py-5 bg-primary text-background font-black uppercase tracking-[0.3em] text-[10px] hover:bg-on-surface hover:text-background transition-all mt-12 flex items-center justify-center gap-3"
                >
                   <Zap className="w-4 h-4" />
                   <span>{selectedPursuit?.gameUid.startsWith('STEAM_') ? 'Sync Data' : 'Save Progress'}</span>
                </button>
              </div>
            </div>
          </motion.div>

        )}
      </AnimatePresence>
    </div>
  );
}

function AchievementRow({ icon, count, label, bgOnSurface = false }: { icon: any; count: string; label: string; bgOnSurface?: boolean }) {
  return (
    <div className="flex items-center justify-between group cursor-default">
      <div className="flex items-center gap-3">
        <div className={`opacity-40 group-hover:opacity-100 transition-opacity ${bgOnSurface ? 'text-background' : 'text-on-surface'}`}>{icon}</div>
        <span className={`text-[10px] font-bold uppercase tracking-widest opacity-60 ${bgOnSurface ? 'text-background' : 'text-on-surface'}`}>{label}</span>
      </div>
      <span className={`font-mono font-bold ${bgOnSurface ? 'text-background' : 'text-on-surface'}`}>{count}</span>
    </div>
  );
}

function PursuitItem({ title, subtitle, gameUid, progress, stats, active, onClick }: Pursuit & { onClick: () => void }) {
  return (
    <div 
      onClick={onClick}
      className={`p-10 transition-all hover:bg-on-surface/5 cursor-pointer bg-background relative group overflow-hidden ${active ? 'bg-on-surface/2' : ''}`}
    >
      <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <Target className="w-4 h-4 text-primary" />
      </div>
      
      <div className="flex justify-between items-start mb-8">
        <div>
          <span className="text-[10px] font-mono text-on-surface/40 uppercase tracking-widest">[{gameUid}]</span>
          <h4 className="text-xl font-black uppercase tracking-tight mt-2 group-hover:text-primary transition-colors text-on-surface">{title}</h4>
          <p className="text-[11px] text-on-surface/50 italic font-serif mt-1">{subtitle}</p>
        </div>
        {active && <span className="text-[8px] font-bold uppercase tracking-widest text-primary px-2 py-0.5 border border-primary">Active</span>}
      </div>

      <div className="space-y-5">
        <div className="flex justify-between items-end">
          <span className="text-3xl font-light font-mono tracking-tighter italic text-on-surface">{progress}%</span>
          <span className="text-[9px] font-mono text-on-surface/40 uppercase tracking-widest">{stats} UNITS</span>
        </div>
        <div className="h-[2px] w-full bg-on-surface/5 relative">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className="absolute top-0 left-0 h-full bg-on-surface/30" 
          />
        </div>
      </div>
    </div>
  );
}

