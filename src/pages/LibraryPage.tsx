import { Search, Heart, Clock, RefreshCw, Download, Play, ArrowRight, Zap } from 'lucide-react';
import { motion } from 'motion/react';

export function LibraryPage() {
  return (
    <div className="space-y-xl animate-in fade-in duration-700 pb-12">
      {/* Search & Filters */}
      <section className="space-y-12">
        <div className="relative border-b border-white/20 pb-4">
          <Search className="absolute left-0 top-1/2 -translate-y-1/2 text-primary w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search library..." 
            className="w-full bg-transparent py-4 pl-10 pr-4 text-white font-black uppercase tracking-widest focus:outline-none placeholder:text-white/50"
          />
        </div>

        <div className="flex flex-wrap gap-4 scrollbar-hide">
          <FilterChip label="All Games" active />
          <FilterChip label="Installed" />
          <FilterChip label="Favorites" />
          <FilterChip label="Recent" />
        </div>
      </section>

      {/* Featured Section */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-px bg-white/10 border border-white/10 overflow-hidden">
        <div className="lg:col-span-8 bg-white text-black p-12 lg:p-16 flex flex-col justify-between group cursor-pointer relative overflow-hidden">
          <div className="absolute top-[-20%] right-[-10%] p-8 opacity-5 group-hover:opacity-100 transition-all duration-1000 rotate-12 group-hover:rotate-0">
            <Zap className="w-96 h-96" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-40">Featured Hub // Phase 01</span>
            <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter mt-4 leading-[0.8] transition-all">Vanguard<br/>Protocol</h2>
            <p className="text-sm md:text-md font-serif italic mt-8 max-w-sm opacity-60 leading-relaxed">
              Access the latest experimental builds and tactical simulations released in Phase 01. Integrated support for multi-node synchronization.
            </p>
          </div>
          <div className="mt-12 flex items-center gap-6 group">
            <div className="w-16 h-16 border-2 border-black flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all transform group-hover:scale-110">
              <Play className="w-6 h-6 fill-current" />
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] font-black uppercase tracking-[0.2em]">Resume Session</span>
              <span className="text-[9px] font-mono opacity-40 uppercase">Last Active: 2H Ago</span>
            </div>
          </div>
        </div>
        <div className="lg:col-span-4 bg-background p-12 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-white/10 group cursor-pointer hover:bg-white/[0.02] transition-colors relative h-full">
          <div className="absolute bottom-0 right-0 p-4 hidden lg:block">
             <span className="text-[8px] font-mono text-white/5 uppercase vertical-text tracking-widest">SPOTLIGHT_REF_X99</span>
          </div>
          <div className="flex justify-between items-start">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary underline underline-offset-8">Spotlight</span>
              <h3 className="text-4xl lg:text-5xl font-black uppercase tracking-tighter mt-6 leading-none">Stellar<br/>Frontier</h3>
            </div>
            <span className="text-[9px] font-mono text-white/20 uppercase tracking-widest">[EXPANSION]</span>
          </div>
          <div className="mt-12 flex items-center justify-between border-t border-white/10 pt-8">
            <div className="flex flex-col">
              <span className="text-4xl font-mono font-light italic">89 HRS</span>
              <span className="text-[9px] font-mono text-white/20 uppercase mt-1">Playtime Logged</span>
            </div>
            <div className="w-12 h-12 border border-white/20 flex items-center justify-center group-hover:border-primary group-hover:bg-primary group-hover:text-black transition-all">
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </section>

      {/* Game List Grid */}
      <div className="grid grid-cols-1 gap-px bg-white/10 border border-white/10">
        <GameRow 
          title="Neon Protocol"
          image="https://lh3.googleusercontent.com/aida-public/AB6AXuBA0Sa4OIk9iuVF6dyutgi-DZwr9oQlhUdfag2pqUJPhMBD9Kf2iZk-C-pOeO_6urGs_QTUcd3s0uoSnggrYfrjmmzAZQTzwD7zjy_xSxyKXicpGF-qsfBVLLAy7Ibqe63BcPEtPkncKMWBgBS7BRzvmTTknCQHIgVxRN1r9SNSymVxBF8wGNkqivLuPAdFauwM9tHcOavCaonw5cQuKBsctKSLYUawgD4kbWnCghyp7evUFLQrk2cpZtQ_brm2aXPta6bQVV6bPiw"
          status="Installed"
          hours="124 hrs"
          lastPlayed="2 days ago"
          liked={false}
          action="Play"
        />
        <GameRow 
          title="Velocity X"
          image="https://lh3.googleusercontent.com/aida-public/AB6AXuAUz-jfnyZvH5Dcs6cnn7y3JimocOZv1Qhlq46TSQ-j83eYZclS_0OCFhz0SH7dWDEdAg7W5HVTkQNQDGNlq_7JMNLk1RCmXKsDBQRrQdccf-5u54JQsGT7k_Pi4eaFsP3G-9-3ywADspfNxY9DdPaEKYm8dVrzjNzAqspG8vU8sO8vhGUQ9ZGz6Az-Ekm0T5Bd3sb4gr-IeVoin0Y1u0vsFldMJbar5FTLeqLAyaazCUvYcB5BDUMlEK1ezg_1wcbIWbBS30_K8ao"
          hours="45 hrs"
          lastPlayed="Not Installed"
          liked={true}
          action="Install"
        />
        <GameRow 
          title="Shadow Tactics"
          image="https://lh3.googleusercontent.com/aida-public/AB6AXuC012P3nOma7rwcKVakIr6PilcTZFxMDmILT1LvSXB37YUtMRql9Ho7irsTmeW0F1_xcEUw3WdiW3x29hpsGMG2wMsJm0g7wDDrDJAXfRCMKSncXAE_BHw3v6eukHpgsT1oQlS9ZdJVBM_1GdxslDOQ8vj2_SpDbsXhZ0xW5Kbc_Xr2zC4jNkvlLRDlahtOLGNN6CM8EQdL1Y5_cT74Y_eHmY_NEteSxxYRpgapREXjE93Z9E4_yOg_iQmuNmwTrNaL7cYSzaMpkKI"
          status="Installed"
          hours="12 hrs"
          lastPlayed="Today"
          liked={false}
          action="Play"
        />
        <div className="bg-primary p-12 flex flex-col justify-center items-center text-black cursor-pointer group hover:bg-white transition-colors">
          <RefreshCw className="w-12 h-12 mb-4 group-hover:rotate-180 transition-transform duration-500" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em]">Load Index</span>
        </div>
      </div>
    </div>
  );
}

function FilterChip({ label, active = false }: { label: string; active?: boolean }) {
  return (
    <button className={`px-6 py-2 border text-[10px] uppercase font-bold tracking-widest transition-colors ${
      active ? 'bg-primary text-black border-primary' : 'bg-transparent text-white/70 border-white/20 hover:border-white/60 hover:text-white'
    }`}>
      {label}
    </button>
  );
}

function GameRow({ title, image, status, hours, lastPlayed, liked, action }: { title: string; image: string; status?: string; hours: string; lastPlayed?: string; liked: boolean; action: string }) {
  return (
    <div className="p-8 bg-background flex flex-col md:flex-row items-center gap-12 group hover:bg-white/5 transition-colors cursor-pointer border-b border-white/5 last:border-b-0">
      <div className="w-full md:w-32 h-40 shrink-0 bg-neutral-900 grayscale border border-white/10 overflow-hidden">
        <img alt={title} src={image} className="w-full h-full object-cover mix-blend-luminosity opacity-40 group-hover:opacity-100 transition-all duration-500" />
      </div>
      
      <div className="flex-grow flex flex-col gap-4">
        <div className="flex justify-between items-start">
          <h3 className="text-3xl font-black uppercase tracking-tighter leading-none">{title}</h3>
          <button className={`transition-colors ${liked ? 'text-primary' : 'text-white/40 hover:text-primary'}`}>
            <Heart className={`w-6 h-6 ${liked ? 'fill-current' : ''}`} />
          </button>
        </div>

        <div className="flex flex-wrap gap-8 text-[9px] font-mono uppercase tracking-[0.2em] text-white/60">
          <div className="flex items-center gap-2"><Clock className="w-3 h-3" /> {hours} SESSION</div>
          <div className="flex items-center gap-2"><RefreshCw className="w-3 h-3" /> {lastPlayed}</div>
          {status && <div className="text-primary border border-primary px-2">STATUS: {status}</div>}
        </div>
      </div>

      <div className="w-full md:w-48">
        <button className={`w-full py-4 text-[10px] font-black uppercase tracking-[0.3em] transition-all border ${
          action === 'Play' 
            ? 'bg-white text-black border-white hover:bg-primary hover:border-primary' 
            : 'bg-transparent text-white border-white/20 hover:border-white hover:text-white'
        }`}>
          {action} VIEW
        </button>
      </div>
    </div>
  );
}

