import { Shield, Trophy, Award, Star, ArrowRight, Activity, Clock, Target, Zap, ChevronRight, X, BarChart3, Binary, Flame } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState, FormEvent } from 'react';
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
    gameUid: "STEAM_76561198084", 
    progress: 88, 
    stats: "38/42",
    detailedStats: [
      { label: 'Bosses Defeated', value: '142' },
      { label: 'Runes Logged', value: '12.4M' },
      { label: 'Deaths Tracked', value: '412' }
    ]
  },
  { 
    id: 'cyberpunk', 
    title: "Cyberpunk 2077", 
    subtitle: "Phantom Liberty", 
    gameUid: "GOG_V_1.0.4", 
    progress: 62, 
    stats: "28/45", 
    active: true,
    detailedStats: [
      { label: 'Cyberware Sync', value: '98%' },
      { label: 'EDD Captured', value: '450k' },
      { label: 'NCPD Rep', value: 'MAX' }
    ]
  },
  { 
    id: 'fortnite', 
    title: "Fortnite", 
    subtitle: "Chapter 5 / S2", 
    gameUid: "EPIC_8842X", 
    progress: 45, 
    stats: "12 Days",
    detailedStats: [
      { label: 'Crown Victories', value: '12' },
      { label: 'Total Eliminations', value: '842' },
      { label: 'Battle Pass Level', value: '142' }
    ]
  }
];

export function ProgressPage() {
  const [pursuits, setPursuits] = useState<Pursuit[]>(PURSUITS);
  const [selectedPursuitId, setSelectedPursuitId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  
  // New Pursuit Form State
  const [newTitle, setNewTitle] = useState('');
  const [newGameUid, setNewGameUid] = useState('');
  const [newSubtitle, setNewSubtitle] = useState('');
  const [isSteamSynced, setIsSteamSynced] = useState(false);

  const selectedPursuit = pursuits.find(p => p.id === selectedPursuitId);

  const handleAddPursuit = (e: FormEvent) => {
    e.preventDefault();
    if (!newTitle || (!newGameUid && !isSteamSynced)) return;

    const newPursuit: Pursuit = {
      id: Math.random().toString(36).substr(2, 9),
      title: newTitle,
      subtitle: newSubtitle || (isSteamSynced ? 'Steam_Linked_Node' : 'Local_Sync_Active'),
      gameUid: isSteamSynced ? 'STEAM_PROFILE_AUTO' : newGameUid,
      progress: 0,
      stats: 'Pending',
      detailedStats: [
        { label: 'Sync Status', value: isSteamSynced ? 'LINKED' : 'MANUAL' },
        { label: 'Data Source', value: isSteamSynced ? 'STEAM_CLOUD' : 'LOC_CACHE' },
        { label: 'Auth Level', value: isSteamSynced ? 'SECURE_API' : 'LOCAL_USER' }
      ]
    };

    setPursuits([newPursuit, ...pursuits]);
    setIsAdding(false);
    setNewTitle('');
    setNewGameUid('');
    setNewSubtitle('');
    setIsSteamSynced(false);
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
            <section className="grid grid-cols-1 md:grid-cols-12 border border-white/10 group">
              <div className="md:col-span-8 p-12 lg:p-16 border-b md:border-b-0 md:border-r border-white/10 flex flex-col justify-between group hover:bg-white/[0.03] transition-all relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 text-[8px] font-mono text-white/5 uppercase tracking-[0.5em] vertical-text h-full pointer-events-none">
                  RANK_PROTOCOL_84_STRATA_EPSILON
                </div>
                
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">Global Rank Index</span>
                  <span className="text-[10px] font-mono text-white/60 uppercase tracking-widest">Protocol 084 // Sub-Sector 7</span>
                </div>

                <div className="flex flex-col lg:flex-row items-center lg:items-end justify-between gap-12 mt-12 md:mt-24">
                  <h2 className="text-[100px] md:text-[140px] lg:text-[180px] leading-[0.7] font-black uppercase tracking-tighter select-none -ml-4 transition-all hover:italic cursor-default">
                    Lvl<br/>
                    <span className="text-primary italic group-hover:not-italic transition-all">8</span>4
                  </h2>
                  
                  <div className="relative w-48 h-48 lg:w-64 lg:h-64 flex items-center justify-center group/circle">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" fill="transparent" r="48" stroke="rgba(255,255,255,0.03)" strokeWidth="2" />
                      <motion.circle 
                        initial={{ strokeDashoffset: 301.6 }}
                        animate={{ strokeDashoffset: 301.6 * (1 - 0.78) }}
                        transition={{ duration: 2.5, ease: [0.16, 1, 0.3, 1] }}
                        cx="50" cy="50" fill="transparent" r="48" stroke="#F0FF42" 
                        strokeDasharray="301.6" strokeLinecap="square" strokeWidth="2" 
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center">
                      <span className="text-4xl lg:text-5xl font-light font-mono truncate tracking-tight transition-all group-hover/circle:scale-110">78%</span>
                      <span className="text-[9px] font-bold uppercase tracking-widest text-white/70 mt-1">Sync Latency</span>
                    </div>
                  </div>
                </div>

                <div className="mt-12 lg:mt-24 flex flex-wrap items-center gap-12 border-t border-white/5 pt-8">
                  <div className="flex items-center gap-4">
                    <Shield className="w-5 h-5 text-primary" />
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Master Vanguard</span>
                      <span className="text-[9px] font-mono text-white/60 uppercase mt-0.5">Tactical Tier Elite</span>
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[9px] font-mono text-white/60 uppercase">Next Tier At</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest mt-0.5">14,200 EXP</span>
                  </div>
                </div>
              </div>

              <div className="md:col-span-4 p-12 flex flex-col justify-between bg-white text-black hover:bg-primary transition-colors duration-500">
                <div className="flex justify-between items-start">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">Data Milestone</span>
                    <h3 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mt-2">Archive</h3>
                  </div>
                  <Trophy className="w-10 h-10 opacity-20" />
                </div>

                <div className="space-y-12 mt-12 md:mt-0">
                  <div className="flex flex-col">
                    <span className="text-6xl md:text-8xl font-light font-mono italic leading-[0.8] tracking-tighter transition-all">1,402</span>
                    <div className="flex items-center gap-3 mt-4">
                      <div className="h-[1px] w-8 bg-black/40"></div>
                      <span className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-40">Total Unlocked Nodes</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4 pt-8 border-t border-black/10">
                    <AchievementRow icon={<Award className="w-4 h-4" />} count="14" label="Platinum Strata" />
                    <AchievementRow icon={<Shield className="w-4 h-4" />} count="86" label="Gold Vector" />
                    <AchievementRow icon={<Star className="w-4 h-4" />} count="245" label="Silver Core" />
                  </div>
                </div>
              </div>
            </section>

            {/* Performance Section */}
            <section className="grid grid-cols-1 md:grid-cols-12 border border-white/10 overflow-hidden">
              <div className="md:col-span-4 p-12 border-b md:border-b-0 md:border-r border-white/10 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">Performance</span>
                  <h3 className="text-4xl font-black uppercase tracking-tighter mt-2 leading-none">Activity Metrics</h3>
                  <p className="text-xs text-white/60 italic font-serif mt-4 pr-4">
                    Real-time synchronization of tactical achievements and response latency across all active nodes.
                  </p>
                </div>
                <div className="mt-12 flex flex-col gap-2">
                  <span className="text-4xl font-mono font-light italic text-primary">+24.5%</span>
                  <span className="text-[9px] font-bold uppercase tracking-widest text-white/40">Monthly Delta</span>
                </div>
              </div>
              <div className="md:col-span-8 h-80 pt-12 pr-4 bg-white/[0.02]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={PERFORMANCE_DATA}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#F0FF42" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#F0FF42" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis 
                      dataKey="name" 
                      stroke="#333" 
                      fontSize={10} 
                      tickLine={false} 
                      axisLine={false} 
                      className="font-mono"
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0A0A0A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0px' }}
                      itemStyle={{ color: '#F0FF42', fontSize: '10px', fontWeight: 'bold' }}
                      labelStyle={{ color: 'rgba(255,255,255,0.5)', fontSize: '9px', marginBottom: '4px' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#F0FF42" 
                      strokeWidth={2}
                      fillOpacity={1} 
                      fill="url(#colorValue)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </section>

            {/* Active Pursuits */}
            <section className="bg-background border border-white/10">
              <div className="p-8 border-b border-white/10 flex justify-between items-center">
                <h3 className="text-[10px] font-bold uppercase tracking-[0.3em]">Active Pursuits / {pursuits.length}</h3>
                <Binary className="w-4 h-4 text-primary" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-white/10 group/pursuits">
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
                  className="p-10 flex flex-col justify-center items-center gap-6 cursor-pointer hover:bg-white/5 transition-all text-white/20 hover:text-primary group/add border-t md:border-t-0"
                >
                  <div className="w-16 h-16 border border-current flex items-center justify-center group-hover/add:rotate-90 transition-transform duration-500">
                    <Zap className="w-6 h-6 fill-current" />
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em]">Initialize_Node</span>
                    <span className="text-[8px] font-mono uppercase opacity-40">Bridge New Data Stream</span>
                  </div>
                </motion.div>
              </div>
            </section>

            {/* History Link */}
            <div className="p-12 flex flex-col justify-center items-center text-black bg-primary cursor-pointer group hover:brightness-110 transition-all border border-white/10">
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">Full Node Log Access</span>
            </div>

            {/* Add New Pursuit Overlay */}
            <AnimatePresence>
              {isAdding && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-8"
                >
                  <motion.div 
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    className="w-full max-w-xl bg-neutral-900 border border-white/10 overflow-hidden"
                  >
                    <div className="p-8 border-b border-white/10 flex justify-between items-center bg-white/[0.02]">
                       <div className="flex items-center gap-4 text-primary">
                          <Binary className="w-5 h-5" />
                          <h3 className="text-[10px] font-bold uppercase tracking-[0.3em]">Protocol_Initialization</h3>
                       </div>
                       <button onClick={() => setIsAdding(false)} className="text-white/20 hover:text-white transition-colors">
                          <X className="w-5 h-5" />
                       </button>
                    </div>

                    <form onSubmit={handleAddPursuit} className="p-12 space-y-12">
                       <div className="space-y-10">
                          <div className="space-y-4">
                             <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 italic">Signal_Title</label>
                             <div className="relative group/select">
                               <select 
                                  required
                                  value={newTitle}
                                  onChange={(e) => setNewTitle(e.target.value)}
                                  className="w-full bg-neutral-900 border-b border-white/10 py-4 text-2xl font-black uppercase tracking-tighter text-primary focus:outline-none focus:border-primary transition-colors appearance-none cursor-pointer pr-10"
                               >
                                  <option value="" disabled className="bg-neutral-900 text-white/20">Select_Node_Index</option>
                                  <option value="VALORANT_X" className="bg-neutral-900">VALORANT_X</option>
                                  <option value="ELDEN_ROOT" className="bg-neutral-900">ELDEN_ROOT</option>
                                  <option value="NEON_BLADE" className="bg-neutral-900">NEON_BLADE</option>
                                  <option value="APEX_VECTOR" className="bg-neutral-900">APEX_VECTOR</option>
                                  <option value="STELLAR_VOID" className="bg-neutral-900">STELLAR_VOID</option>
                                  <option value="HALO_SYNC" className="bg-neutral-900">HALO_SYNC</option>
                                  <option value="CYBER_CORE" className="bg-neutral-900">CYBER_CORE</option>
                               </select>
                               <ChevronRight className="absolute right-0 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/40 group-hover/select:text-primary transition-colors rotate-90" />
                             </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            <div className="space-y-4">
                               <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 italic">Sync_Method</label>
                               <div className="flex gap-4">
                                  <button 
                                    type="button"
                                    onClick={() => setIsSteamSynced(false)}
                                    className={`flex-1 py-4 border text-[10px] font-bold uppercase tracking-widest transition-all ${!isSteamSynced ? 'bg-white text-black border-white' : 'border-white/10 text-white/40 hover:border-white'}`}
                                  >
                                     Manual_UID
                                  </button>
                                  <button 
                                    type="button"
                                    onClick={() => setIsSteamSynced(true)}
                                    className={`flex-1 py-4 border text-[10px] font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${isSteamSynced ? 'bg-primary text-black border-primary' : 'border-white/10 text-white/40 hover:border-white'}`}
                                  >
                                     <Activity className="w-4 h-4" />
                                     Sync_Steam
                                  </button>
                               </div>
                            </div>
                            
                            <div className="space-y-4">
                               <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 italic">{isSteamSynced ? 'Steam_Status' : 'Game_UID'}</label>
                               {isSteamSynced ? (
                                 <div className="w-full bg-primary/5 border border-primary/20 p-4 flex items-center justify-between text-primary">
                                    <span className="text-[10px] font-bold uppercase tracking-widest">Steam_API_Ready</span>
                                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                                 </div>
                               ) : (
                                 <input 
                                    required
                                    value={newGameUid}
                                    onChange={(e) => setNewGameUid(e.target.value)}
                                    placeholder="APP_ID_X77"
                                    className="w-full bg-transparent border-b border-white/10 py-4 text-sm font-mono text-white/80 focus:outline-none focus:border-white transition-colors"
                                 />
                               )}
                            </div>
                          </div>

                          <div className="space-y-4">
                             <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 italic">Sub_Link (Optional)</label>
                             <input 
                                value={newSubtitle}
                                onChange={(e) => setNewSubtitle(e.target.value)}
                                placeholder="e.g. DLC Name or Session Label"
                                className="w-full bg-transparent border-b border-white/10 py-4 text-sm font-mono text-white/80 focus:outline-none focus:border-white transition-colors"
                             />
                          </div>
                       </div>

                       <div className="grid grid-cols-2 gap-6 pt-12">
                          <button 
                            type="button"
                            onClick={() => setIsAdding(false)}
                            className="py-5 border border-white/10 text-white/40 font-black uppercase tracking-[0.4em] text-[10px] hover:text-white hover:border-white transition-all"
                          >
                             Abort_Process
                          </button>
                          <button 
                            type="submit"
                            className="py-5 bg-primary text-black font-black uppercase tracking-[0.4em] text-[10px] hover:bg-white transition-all shadow-xl shadow-primary/20"
                          >
                             Commit_Node
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
            className="border border-white/10 bg-white/[0.02] overflow-hidden"
          >
            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-black/40">
              <button 
                onClick={() => setSelectedPursuitId(null)}
                className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-white/40 hover:text-white"
              >
                <ArrowRight className="w-4 h-4 rotate-180" />
                <span>Return_To_Protocol</span>
              </button>
              <div className="flex items-center gap-4">
                <div className="px-3 py-1 border border-primary/20 bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest">
                  SYNC_ACTIVE
                </div>
                <X className="w-5 h-5 text-white/20 hover:text-white cursor-pointer" onClick={() => setSelectedPursuitId(null)} />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-px bg-white/5">
              <div className="lg:col-span-8 p-12 lg:p-16 flex flex-col justify-between min-h-[400px]">
                <div>
                  <span className="text-xs font-mono text-primary tracking-[0.5em] uppercase">{selectedPursuit?.gameUid}</span>
                  <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none mt-4 italic">
                    {selectedPursuit?.title.split(' ')[0]}<br/>
                    <span className="text-primary">{selectedPursuit?.title.split(' ')[1] || ''}</span>
                  </h2>
                  <p className="text-sm text-white/60 italic font-serif max-w-sm mt-8 border-l border-white/20 pl-6">
                    {selectedPursuit?.subtitle} // Operational status confirmed. High-fidelity data sync ongoing.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 pt-12 border-t border-white/5">
                  {selectedPursuit?.detailedStats.map(stat => (
                    <div key={stat.label} className="space-y-1">
                      <span className="text-[9px] font-bold uppercase tracking-widest text-white/30">{stat.label}</span>
                      <p className="text-2xl font-mono text-white/90">{stat.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-4 p-12 flex flex-col justify-between bg-black/40 border-l border-white/10">
                <div className="space-y-12">
                  <div className="space-y-6">
                    <div className="flex justify-between items-end">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-white/40 italic">Sync Level</span>
                      <span className="text-3xl font-mono text-primary italic">{selectedPursuit?.progress}%</span>
                    </div>
                    <div className="h-1 bg-white/5">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${selectedPursuit?.progress}%` }}
                        transition={{ duration: 1, ease: "circOut" }}
                        className="h-full bg-primary"
                      />
                    </div>
                  </div>

                  <div className="space-y-8">
                     <h4 className="text-[10px] font-bold uppercase tracking-widest italic group-hover:text-primary transition-colors">Skill_Tree_Sync</h4>
                     <div className="space-y-6">
                        {SKILL_DATA.map(skill => (
                          <div key={skill.id} className="space-y-3">
                            <div className="flex justify-between text-[10px] font-mono">
                              <span className="text-white/60">{skill.label}</span>
                              <span className="text-primary">{skill.value}%</span>
                            </div>
                            <div className="h-0.5 bg-white/5">
                               <div className="h-full bg-white/40" style={{ width: `${skill.value}%` }} />
                            </div>
                          </div>
                        ))}
                     </div>
                  </div>
                </div>

                <button className="w-full py-5 bg-primary text-black font-black uppercase tracking-[0.3em] text-[10px] hover:bg-white transition-all mt-12 flex items-center justify-center gap-3">
                   <Zap className="w-4 h-4" />
                   <span>Manual_Archive</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function AchievementRow({ icon, count, label }: { icon: any; count: string; label: string }) {
  return (
    <div className="flex items-center justify-between group cursor-default">
      <div className="flex items-center gap-3">
        <div className="opacity-40 group-hover:opacity-100 transition-opacity">{icon}</div>
        <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">{label}</span>
      </div>
      <span className="font-mono font-bold">{count}</span>
    </div>
  );
}

function PursuitItem({ title, subtitle, gameUid, progress, stats, active, onClick }: Pursuit & { onClick: () => void }) {
  return (
    <div 
      onClick={onClick}
      className={`p-10 transition-all hover:bg-white/5 cursor-pointer bg-background relative group overflow-hidden ${active ? 'bg-white/[0.02]' : ''}`}
    >
      <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <Target className="w-4 h-4 text-primary" />
      </div>
      
      <div className="flex justify-between items-start mb-8">
        <div>
          <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">[{gameUid}]</span>
          <h4 className="text-xl font-black uppercase tracking-tight mt-2 group-hover:text-primary transition-colors">{title}</h4>
          <p className="text-[11px] text-white/50 italic font-serif mt-1">{subtitle}</p>
        </div>
        {active && <span className="text-[8px] font-bold uppercase tracking-widest text-primary px-2 py-0.5 border border-primary">Active</span>}
      </div>

      <div className="space-y-5">
        <div className="flex justify-between items-end">
          <span className="text-3xl font-light font-mono tracking-tighter italic">{progress}%</span>
          <span className="text-[9px] font-mono text-white/40 uppercase tracking-widest">{stats} UNITS</span>
        </div>
        <div className="h-[2px] w-full bg-white/5 relative">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className="absolute top-0 left-0 h-full bg-white/30" 
          />
        </div>
      </div>
    </div>
  );
}
