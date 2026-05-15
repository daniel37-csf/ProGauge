import { Shield, Trophy, Award, Star, ArrowRight, Stars, RefreshCw, Clock } from 'lucide-react';
import { motion } from 'motion/react';
import type { ReactNode } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

const PERFORMANCE_DATA = [
  { name: 'JAN', value: 45 },
  { name: 'FEB', value: 52 },
  { name: 'MAR', value: 48 },
  { name: 'APR', value: 61 },
  { name: 'MAY', value: 55 },
  { name: 'JUN', value: 78 },
];

export function ProgressPage() {
  return (
    <div className="space-y-xl animate-in fade-in duration-700">
      {/* Bento Grid: High-Level Stats */}
      <section className="grid grid-cols-1 md:grid-cols-12 border border-white/10 group">
        {/* Overall Level Card */}
        <div className="md:col-span-8 p-12 lg:p-16 border-b md:border-b-0 md:border-r border-white/10 flex flex-col justify-between group hover:bg-white/[0.03] transition-all relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 text-[8px] font-mono text-white/5 uppercase tracking-[0.5em] vertical-text h-full pointer-events-none">
            RANK_PROTOCOL_84_STRATA_EPSILON
          </div>
          
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">Global Rank Index</span>
            <span className="text-[10px] font-mono text-white/60 uppercase tracking-widest">Protocol 084 // Sub-Sector 7</span>
          </div>

          <div className="flex flex-col lg:flex-row items-center lg:items-end justify-between gap-12 mt-12 md:mt-24">
            <h2 className="text-[120px] md:text-[180px] lg:text-[240px] leading-[0.7] font-black uppercase tracking-tighter select-none -ml-4 transition-all hover:italic cursor-default">
              Lvl<br/>
              <span className="text-primary italic group-hover:not-italic transition-all">8</span>4
            </h2>
            
            <div className="relative w-48 h-48 lg:w-64 lg:h-64 flex items-center justify-center">
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
                <span className="text-4xl lg:text-6xl font-light font-mono truncate tracking-tight transition-all">78%</span>
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

        {/* Milestone Card */}
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
            <p className="text-sm text-white/80 italic font-serif mt-4 pr-4">
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

      {/* Active Pursuits & History */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-white/10 border border-white/10">
        <div className="bg-background flex flex-col">
          <div className="p-8 border-b border-white/10 flex justify-between items-center">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.3em]">Active Pursuits / 03</h3>
            <ArrowRight className="w-4 h-4 text-primary" />
          </div>
          <div className="flex flex-col divide-y divide-white/5">
            <PursuitItem title="Elden Ring" subtitle="Shadow of the Erdtree" genre="RPG" progress={88} stats="38/42" />
            <PursuitItem title="Cyberpunk 2077" subtitle="Phantom Liberty" genre="ACT" progress={62} stats="28/45" active />
            <PursuitItem title="Fortnite" subtitle="Chapter 5 / S2" genre="BR" progress={45} stats="12 Days" />
          </div>
        </div>

        <div className="bg-background flex flex-col border-t lg:border-t-0 lg:border-l border-white/10">
          <div className="p-8 border-b border-white/10 flex justify-between items-center">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.3em]">Archive Log // Recent</h3>
            <span className="text-[9px] font-mono text-white/50 uppercase">Total: 42</span>
          </div>
          <div className="flex flex-col divide-y divide-white/5">
            <HistoryRow title="Protocol Overrun" detail="Neon Genesis / Platinum" time="2H AGO" color="text-primary" />
            <HistoryRow title="System Breach" detail="Cybernetix / Tier Upgrade" time="5H AGO" />
            <HistoryRow title="Core Sync" detail="Global / Level 84 Reached" time="1D AGO" />
            <HistoryRow title="Tactical Shift" detail="Stellar Frontier / Update" time="2D AGO" />
            <div className="p-12 flex flex-col justify-center items-center text-black bg-primary cursor-pointer group hover:brightness-110 transition-all">
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">Full Log Access</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function AchievementRow({ icon, count, label }: { icon: ReactNode; count: string; label: string }) {
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

function PursuitItem({ title, subtitle, genre, progress, stats, active = false }: { title: string; subtitle: string; genre: string; progress: number; stats: string; active?: boolean }) {
  return (
    <div className={`p-8 transition-colors hover:bg-white/5 cursor-pointer bg-background ${active ? 'ring-1 ring-inset ring-primary' : ''}`}>
      <div className="flex justify-between items-start mb-6">
        <div>
          <span className="text-[10px] font-mono text-white/60 uppercase tracking-widest">[{genre}]</span>
          <h4 className="text-xl font-black uppercase tracking-tight mt-1">{title}</h4>
          <p className="text-xs text-white/80 italic font-serif mt-1">{subtitle}</p>
        </div>
        {active && <span className="text-[9px] font-bold uppercase tracking-widest text-primary px-2 py-1 border border-primary">Active</span>}
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-end">
          <span className="text-2xl font-light font-mono tracking-tighter italic">{progress}%</span>
          <span className="text-[9px] font-mono text-white/50 uppercase tracking-widest">{stats}</span>
        </div>
        <div className="h-[2px] w-full bg-white/5 relative">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className="absolute top-0 left-0 h-full bg-white opacity-40 transition-all duration-1000" 
          />
        </div>
      </div>
    </div>
  );
}

function HistoryRow({ title, detail, time, color = 'text-white' }: { title: string; detail: string; time: string; color?: string }) {
  return (
    <div className="p-8 flex items-center justify-between group hover:bg-white/5 transition-colors cursor-pointer">
      <div className="flex flex-col">
        <span className={`text-lg font-black uppercase tracking-tight ${color}`}>{title}</span>
        <span className="text-[10px] font-bold uppercase tracking-widest text-white/60">{detail}</span>
      </div>
      <span className="text-[9px] font-mono text-white/50 uppercase group-hover:text-white transition-colors">{time}</span>
    </div>
  );
}
