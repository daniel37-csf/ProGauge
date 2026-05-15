import { Play, Users, Bell, BellOff, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

export function EventsPage() {
  return (
    <div className="space-y-xl animate-in fade-in duration-700">
      {/* Featured Events */}
      <section className="grid grid-cols-1 md:grid-cols-12 border-b border-white/10 pb-xl relative">
        <div className="absolute top-0 right-0 hidden lg:block text-[8px] font-mono text-white/30 vertical-text h-full tracking-[0.5em] pointer-events-none">
          SYSTEM_LOG_PHASE_01_ACTIVE_REF_992.00
        </div>
        
        <div className="md:col-span-12 flex flex-col gap-12">
          {/* Header Section */}
          <div className="flex justify-between items-start">
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">Live Phase 01</span>
              <span className="text-[10px] font-mono text-white/60 uppercase tracking-widest">Global / 2026 // Active Nodes: 42</span>
            </div>
            <div className="hidden md:flex gap-12">
              <div className="flex flex-col items-end">
                <span className="text-[9px] font-mono text-white/40 uppercase">Network Load</span>
                <span className="text-sm font-medium">82.4%</span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[9px] font-mono text-white/40 uppercase">Latent Delay</span>
                <span className="text-sm font-medium">12ms</span>
              </div>
            </div>
          </div>
          
          <div className="relative flex flex-col lg:flex-row gap-12 items-start">
            <div className="flex flex-col">
              <h2 className="text-[100px] md:text-[180px] xl:text-[240px] leading-[0.7] font-black uppercase tracking-tighter select-none -ml-4 shrink-0 transition-all">
                Neon<br/>
                <span className="text-primary italic">G</span>enesis
              </h2>
              <div className="mt-8 flex items-center gap-4">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse border border-red-500/50" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/90">Broadcasting Live From Berlin // Arena A1</span>
              </div>
            </div>
            
            <div className="flex flex-col gap-12 md:mt-20 lg:mt-32 max-w-lg z-10">
              <p className="text-sm md:text-md text-white/80 leading-relaxed italic font-serif">
                A brutalist interpretation of competitive tactical showdowns. The premier global tournament enters its final stages where architecture meets adrenaline. 
              </p>
              <div className="h-[1px] w-48 bg-primary"></div>
              
              <div className="flex flex-wrap items-center gap-12">
                <button className="flex items-center gap-6 group">
                  <div className="w-16 h-16 border-2 border-primary flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-black transition-all transform group-hover:rotate-6">
                    <Play className="w-6 h-6 fill-current" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[11px] font-black uppercase tracking-[0.2em]">Watch Stream</span>
                    <span className="text-[9px] font-mono text-white/50 uppercase mt-1">45.2K Viewers</span>
                  </div>
                </button>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Ends In</span>
                  <span className="text-3xl md:text-4xl font-light font-mono italic">02:14:59</span>
                </div>
              </div>
            </div>

            <div className="lg:absolute right-0 top-[-60px] w-full lg:w-[500px] xl:w-[600px] aspect-[4/5] bg-neutral-900 grayscale overflow-hidden border border-white/10 group-hover:border-primary/50 transition-all duration-1000">
              <img 
                alt="Tournament" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBCXHnhOTwNlH77vEyMuuDyMFXAVGfFzKg5FE45UpKeND5-VtnYif18tBep_1X1iZ89kaMlfstEozazT1Gp_n4APviJhX9n-Pc7eujQu_XN6YHAsrxPGHEZrkCpkz-0Vv-2GaWDoJOcTyKAEkOsFTMWwlqxN0pYGI8eOvgmkWWUmSXdlTyIUMBkGWDF0hOWSkmKjakorhVVR-sPN4xkN8NsilycYbzoZorV9Wr4c28ODSbLBhALDwcFCarEcDV6-EanoDZKBcsDXvg"
                className="w-full h-full object-cover mix-blend-luminosity opacity-40 hover:opacity-100 transition-opacity duration-1000 scale-105 hover:scale-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent pointer-events-none" />
            </div>
          </div>
        </div>
      </section>

      {/* Active Events Grid */}
      <section className="grid grid-cols-1 md:grid-cols-4 border-t border-white/10 h-64">
        <ActiveEventCard 
          title="Operation"
          subtitle="Silent Strike"
          progress="75%"
          objective="3/4 COMPLETE"
        />
        <ActiveEventCard 
          title="Cybernetix"
          subtitle="Season 4"
          progress="40%"
          objective="4 DAYS LEFT"
          highlight
        />
        <ActiveEventCard 
          title="Winter"
          subtitle="Solstice Brawl"
          progress="0%"
          objective="REGISTRATION OPEN"
        />
        <div className="p-8 flex flex-col justify-between bg-primary text-black cursor-pointer hover:brightness-110 transition-all">
          <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">Interaction</span>
          <div className="flex items-center justify-between">
            <span className="text-xl font-black uppercase">View All</span>
            <ArrowRight className="w-6 h-6 stroke-[3]" />
          </div>
        </div>
      </section>
    </div>
  );
}

function ActiveEventCard({ title, subtitle, progress, objective, highlight = false }: { title: string; subtitle: string; progress: string; objective: string; highlight?: boolean }) {
  return (
    <div className={`border-r border-white/10 p-8 flex flex-col justify-between transition-colors hover:bg-white/5 cursor-pointer ${highlight ? 'bg-white text-black' : ''}`}>
      <div className="flex flex-col">
        <span className={`text-[10px] font-bold uppercase tracking-widest ${highlight ? 'opacity-40' : 'text-white/60'}`}>{title}</span>
        <span className="text-lg font-black uppercase mt-1 leading-none">{subtitle}</span>
      </div>
      <div className="flex flex-col">
        <span className="text-3xl font-light font-mono truncate">{progress}</span>
        <span className={`text-[9px] font-mono uppercase tracking-[0.2em] mt-1 ${highlight ? 'opacity-60' : 'text-white/50'}`}>{objective}</span>
      </div>
    </div>
  );
}
