import { Archive, ArrowRight, Shield, Award, Star, Search, Filter } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';

const ARCHIVED_DATA = [
  {
    id: '1',
    title: 'VALORANT Protocol',
    subtitle: 'Act III Mastery',
    date: 'APR 2026',
    progress: 100,
    tier: 'Platinum',
    nodes: 84
  },
  {
    id: '2',
    title: 'ELDEN ROOT Index',
    subtitle: 'Base Game Completion',
    date: 'MAR 2026',
    progress: 100,
    tier: 'Elden Lord',
    nodes: 142
  },
  {
    id: '3',
    title: 'NEON BLADE Sync',
    subtitle: 'Speedrun Phase 04',
    date: 'JAN 2026',
    progress: 100,
    tier: 'Ghost',
    nodes: 56
  },
   {
    id: '4',
    title: 'HALO SYNC',
    subtitle: 'Legendary Campaign',
    date: 'DEC 2025',
    progress: 100,
    tier: 'Heroic',
    nodes: 92
  }
];

export function ArchivePage({ onBack }: { onBack: () => void }) {
  const [filter, setFilter] = useState('');

  const filteredData = ARCHIVED_DATA.filter(item => 
    item.title.toLowerCase().includes(filter.toLowerCase()) || 
    item.subtitle.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="space-y-xl animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="border-b border-white/10 pb-12 flex flex-col md:flex-row justify-between items-end gap-12">
        <div>
          <button 
            onClick={onBack}
            className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-white/40 hover:text-white transition-all group mb-8"
          >
            <ArrowRight className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Progress</span>
          </button>
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">Data Repository</span>
          <h2 className="text-[80px] md:text-[100px] lg:text-[140px] leading-[0.7] font-black uppercase tracking-tighter mt-4 transition-all">Archiv<span className="text-primary italic">e</span></h2>
          <p className="text-white/60 font-serif italic text-lg md:text-xl mt-8 max-w-sm leading-tight">
            Historical records of successfully synchronized tactical nodes and milestones.
          </p>
        </div>
        
        <div className="w-full md:w-auto relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-primary transition-colors" />
          <input 
            type="text" 
            placeholder="Search Records..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full md:w-80 bg-white/[0.03] border border-white/10 py-5 pl-12 pr-6 text-[10px] font-bold uppercase tracking-widest focus:outline-none focus:border-primary transition-all"
          />
        </div>
      </div>

      {/* Archive Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/10 border border-white/10">
        <ArchiveStat label="Total Retained Nodes" value="374" icon={<Archive className="w-5 h-5" />} />
        <ArchiveStat label="Mastered Tiers" value="12" icon={<Award className="w-5 h-5" />} />
        <ArchiveStat label="Integrity Score" value="99.9%" icon={<Shield className="w-5 h-5" />} />
      </div>

      {/* Archive List */}
      <div className="grid grid-cols-1 gap-12">
        {filteredData.length > 0 ? (
          filteredData.map((item, index) => (
            <div key={item.id}>
              <ArchiveRow item={item} index={index} />
            </div>
          ))
        ) : (
          <div className="py-32 flex flex-col items-center justify-center grayscale opacity-20 space-y-6">
            <Search className="w-16 h-16" />
            <span className="text-[10px] font-bold uppercase tracking-[0.4em]">No Records Found</span>
          </div>
        )}
      </div>

      {/* Footer Decoration */}
      <div className="pt-24 flex flex-col items-center gap-6 opacity-10">
        <div className="h-[1px] w-32 bg-white" />
        <span className="text-[8px] font-mono uppercase tracking-[1em]">End of Index</span>
      </div>
    </div>
  );
}

function ArchiveStat({ label, value, icon }: { label: string; value: string; icon: any }) {
  return (
    <div className="bg-background p-10 flex flex-col gap-6 group hover:bg-white/[0.02] transition-colors">
      <div className="flex justify-between items-start text-white/40">
        <span className="text-[9px] font-bold uppercase tracking-widest">{label}</span>
        <div className="group-hover:text-primary transition-colors">{icon}</div>
      </div>
      <span className="text-4xl font-mono font-light italic">{value}</span>
    </div>
  );
}

function ArchiveRow({ item, index }: { item: any; index: number }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="group relative overflow-hidden"
    >
      <div className="border border-white/10 p-12 lg:p-16 flex flex-col lg:flex-row lg:items-center justify-between gap-12 hover:bg-white/[0.02] transition-all relative z-10">
        <div className="flex flex-col md:flex-row md:items-center gap-12 lg:gap-24">
          <div className="flex flex-col">
            <span className="text-[9px] font-mono text-white/20 uppercase tracking-widest">{item.date} // REF_{item.id.padStart(3, '0')}</span>
            <h3 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mt-2 group-hover:italic transition-all">
              {item.title}
            </h3>
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary mt-2">{item.subtitle}</span>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-12 border-l border-white/5 pl-12 md:pl-0 md:border-l-0">
             <div className="flex flex-col gap-1">
                <span className="text-[8px] font-mono text-white/20 uppercase tracking-widest">Achieved Tier</span>
                <span className="text-sm font-black uppercase tracking-widest italic">{item.tier}</span>
             </div>
             <div className="flex flex-col gap-1">
                <span className="text-[8px] font-mono text-white/20 uppercase tracking-widest">Nodes Decrypted</span>
                <span className="text-sm font-black uppercase tracking-widest italic">{item.nodes} Units</span>
             </div>
             <div className="hidden lg:flex flex-col gap-1">
                <span className="text-[8px] font-mono text-white/20 uppercase tracking-widest">Efficiency</span>
                <span className="text-sm font-black uppercase tracking-widest italic text-primary">OPTIMAL</span>
             </div>
          </div>
        </div>

        <div className="flex items-center gap-12">
          <div className="w-16 h-16 flex items-center justify-center border border-white/10 group-hover:border-primary transition-colors">
            <Star className="w-5 h-5 text-white/20 group-hover:text-primary transition-colors" />
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[8px] font-mono text-white/20 uppercase tracking-widest mb-1">Integrity</span>
            <span className="text-3xl font-mono font-light italic text-white/80">{item.progress}%</span>
          </div>
        </div>
      </div>
      
      {/* Background Index Number */}
      <div className="absolute top-1/2 -translate-y-1/2 right-[-5%] text-[200px] font-black text-white/[0.02] pointer-events-none select-none italic leading-none transition-all group-hover:right-[0%] uppercase">
        {item.title.split(' ')[0]}
      </div>
    </motion.div>
  );
}
