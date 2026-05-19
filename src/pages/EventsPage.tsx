import { Play, Users, Bell, BellOff, ArrowRight, X, Maximize2, Shield, Zap, Target, Trophy } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';

interface EventDetail {
  id: string;
  title: string;
  subtitle: string;
  progress: string;
  objective: string;
  status: 'ACTIVE' | 'PENDING' | 'LOCKED';
  stats: { label: string; value: string }[];
  description: string;
  image: string;
}

const EVENT_DATA: EventDetail[] = [
  {
    id: 'silent-strike',
    title: 'Operation',
    subtitle: 'Silent Strike',
    progress: '75%',
    objective: '3/4 COMPLETE',
    status: 'ACTIVE',
    stats: [
      { label: 'K/D Ratio', value: '2.4' },
      { label: 'Objectives', value: '12/15' },
      { label: 'Experience Bonus', value: '1.5x' }
    ],
    description: 'Covert infiltration mission in the Neo-Berlin industrial sector. High stakes, stealth primary objective.',
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'cybernetix-s4',
    title: 'Cybernetix',
    subtitle: 'Season 4',
    progress: '40%',
    objective: '4 DAYS LEFT',
    status: 'ACTIVE',
    stats: [
      { label: 'Global Rank', value: '#412' },
      { label: 'Matches Played', value: '156' },
      { label: 'Season Points', value: '12,400' }
    ],
    description: 'The pinnacle of global electronic sports. Battle through layers of network security to reach the core.',
    image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'winter-solstice',
    title: 'Winter',
    subtitle: 'Solstice Brawl',
    progress: '0%',
    objective: 'REGISTRATION OPEN',
    status: 'PENDING',
    stats: [
      { label: 'Registered', value: '1,202' },
      { label: 'Prize Pool', value: '$50,000' },
      { label: 'Mode', value: '1v1 Arena' }
    ],
    description: 'Limited time holiday event. Master the elements and survive the sub-zero environmental hazards.',
    image: 'https://images.unsplash.com/photo-1614013410980-6e1307224211?auto=format&fit=crop&q=80&w=800'
  }
];

export function EventsPage() {
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  const selectedEvent = EVENT_DATA.find(e => e.id === selectedEventId);

  return (
    <div className="space-y-xl animate-in fade-in duration-700">
      <AnimatePresence mode="wait">
        {!selectedEventId ? (
          <motion.div 
            key="grid-view"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="space-y-xl"
          >
            {/* Featured Events */}
            <section className="grid grid-cols-1 md:grid-cols-12 border-b border-white/10 pb-xl relative">
              <div className="absolute top-0 right-0 hidden lg:block text-[8px] font-mono text-white/30 vertical-text h-full tracking-[0.5em] pointer-events-none">
                SYSTEM_LOG_ACTIVE
              </div>
              
              <div className="md:col-span-12 flex flex-col gap-12">
                {/* Header Section */}
                <div className="flex justify-between items-start">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-1 h-1 bg-primary animate-ping" />
                      <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">Live Events</span>
                    </div>
                    <span className="text-[10px] font-mono text-white/60 uppercase tracking-widest">Global / 2026 // Active Users: 42</span>
                  </div>
                  <div className="hidden md:flex gap-12">
                    <div className="flex flex-col items-end">
                      <span className="text-[9px] font-mono text-white/40 uppercase">Server Load</span>
                      <span className="text-sm font-medium">82.4%</span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-[9px] font-mono text-white/40 uppercase">Latency</span>
                      <span className="text-sm font-medium">12ms</span>
                    </div>
                  </div>
                </div>
                
                <div className="relative flex flex-col lg:flex-row gap-12 items-start">
                  <div className="flex flex-col">
                    <h2 className="text-[80px] md:text-[140px] xl:text-[180px] leading-[0.7] font-black uppercase tracking-tighter select-none -ml-4 shrink-0 transition-all">
                      Neon<br/>
                      <span className="text-primary italic">G</span>enesis
                    </h2>
                    <div className="mt-8 flex items-center gap-4">
                      <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse border border-red-500/50" />
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/90">Broadcasting Live From Berlin // Arena A1</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-8 md:mt-20 lg:mt-32 max-w-sm z-10">
                    <p className="text-xs md:text-sm text-white/60 leading-relaxed italic font-serif">
                      A brutalist interpretation of competitive tactical showdowns. The premier global tournament enters its final stages where architecture meets adrenaline. 
                    </p>
                    <div className="h-[1px] w-24 bg-primary"></div>
                    
                    <div className="flex flex-wrap items-center gap-8">
                      <button className="flex items-center gap-4 group">
                        <div className="w-12 h-12 border border-primary flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-black transition-all transform group-hover:rotate-6">
                          <Play className="w-4 h-4 fill-current" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Watch Stream</span>
                          <span className="text-[8px] font-mono text-white/50 uppercase mt-1">45.2K Viewers</span>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* SMALLER LIVESTREAM BOX */}
                  <div className="lg:absolute lg:right-0 lg:top-0 w-full lg:w-[320px] xl:w-[400px] aspect-video bg-neutral-900 border border-white/10 group overflow-hidden relative">
                    <img 
                      alt="Tournament" 
                      src="https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=1200"
                      className="w-full h-full object-cover grayscale opacity-40 group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-black/20 to-transparent pointer-events-none" />
                    <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="flex flex-col">
                        <span className="text-[8px] font-bold uppercase tracking-widest text-primary">Live Feed</span>
                        <span className="text-[10px] font-black uppercase">Main Stage Camera</span>
                      </div>
                      <Maximize2 className="w-3 h-3 text-white/40" />
                    </div>
                    <div className="absolute top-4 left-4">
                      <span className="text-[8px] font-mono bg-red-600 px-2 py-0.5 rounded-sm">02:14:59</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Active Events Grid */}
            <section className="grid grid-cols-1 md:grid-cols-4 border-t border-white/10">
              {EVENT_DATA.map(event => (
                <ActiveEventCard 
                  key={event.id}
                  title={event.title}
                  subtitle={event.subtitle}
                  progress={event.progress}
                  objective={event.objective}
                  status={event.status}
                  onClick={() => setSelectedEventId(event.id)}
                />
              ))}
              <div className="p-8 flex flex-col justify-between bg-primary text-black cursor-pointer hover:brightness-110 transition-all h-64 md:h-auto">
                <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">System Records</span>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-black uppercase">Archives</span>
                  <ArrowRight className="w-6 h-6 stroke-[3]" />
                </div>
              </div>
            </section>
          </motion.div>
        ) : (
          <motion.div 
            key="detail-view"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="border border-white/10 bg-white/[0.02] overflow-hidden"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[600px]">
              {/* Media Section */}
              <div className="lg:col-span-12 p-6 border-b border-white/10 flex justify-between items-center bg-black/40">
                <button 
                  onClick={() => setSelectedEventId(null)}
                  className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-white/40 hover:text-white transition-colors"
                >
                  <ArrowRight className="w-4 h-4 rotate-180" />
                  <span>Back to Events</span>
                </button>
                <div className="flex items-center gap-4">
                  <div className="px-3 py-1 border border-primary/20 bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest">
                    {selectedEvent?.status}
                  </div>
                  <X 
                    className="w-5 h-5 text-white/20 hover:text-white cursor-pointer" 
                    onClick={() => setSelectedEventId(null)}
                  />
                </div>
              </div>

              <div className="lg:col-span-7 relative h-[400px] lg:h-full border-r border-white/10 p-12 flex flex-col justify-end overflow-hidden group">
                <img 
                   src={selectedEvent?.image} 
                   className="absolute inset-0 w-full h-full object-cover opacity-20 scale-105 group-hover:scale-100 transition-transform duration-2000"
                   alt=""
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-black/40 to-transparent" />
                
                <div className="relative z-10">
                  <motion.div 
                    initial={{ y: 20, opacity: 0 }} 
                    animate={{ y: 0, opacity: 1 }} 
                    transition={{ delay: 0.2 }}
                    className="space-y-4"
                  >
                    <span className="text-xs font-mono text-primary tracking-[0.5em] uppercase">{selectedEvent?.title}</span>
                    <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none italic">
                      {selectedEvent?.subtitle.split(' ')[0]}<br/>
                      <span className="text-primary">{selectedEvent?.subtitle.split(' ')[1]}</span>
                    </h2>
                    <p className="max-w-md text-sm text-white/60 leading-relaxed font-serif italic pt-4">
                      {selectedEvent?.description}
                    </p>
                  </motion.div>
                </div>
              </div>

              {/* Interaction Section */}
              <div className="lg:col-span-5 p-12 flex flex-col justify-between bg-black/20">
                <div className="space-y-12">
                  <div className="grid grid-cols-2 gap-8">
                    {selectedEvent?.stats.map((stat, i) => (
                      <motion.div 
                        key={stat.label}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + i * 0.1 }}
                        className="flex flex-col gap-2 p-4 border border-white/5 bg-white/[0.02]"
                      >
                        <span className="text-[10px] font-bold uppercase tracking-widest text-white/30 italic">{stat.label}</span>
                        <span className="text-2xl font-mono text-white/90">{stat.value}</span>
                      </motion.div>
                    ))}
                  </div>

                  <div className="space-y-6">
                    <div className="flex justify-between items-end">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-white/40 italic">Event Progress</span>
                      <span className="text-xl font-mono text-primary">{selectedEvent?.progress}</span>
                    </div>
                    <div className="h-1 bg-white/5 relative">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: selectedEvent?.progress }}
                        transition={{ duration: 1.5, ease: "circOut" }}
                        className="absolute h-full bg-primary"
                      />
                    </div>
                    <p className="text-[10px] font-mono text-white/30 uppercase tracking-widest">{selectedEvent?.objective}</p>
                  </div>
                </div>

                <div className="pt-12 space-y-4">
                  <button className="w-full py-5 bg-primary text-black font-black uppercase tracking-[0.3em] text-xs hover:bg-white transition-all flex items-center justify-center gap-4 group">
                    <Shield className="w-4 h-4" />
                    <span>Join Event</span>
                  </button>
                  <button className="w-full py-5 border border-white/10 text-white/40 font-black uppercase tracking-[0.3em] text-xs hover:border-white hover:text-white transition-all">
                    View Records
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ActiveEventCard({ title, subtitle, progress, objective, status, onClick }: { title: string; subtitle: string; progress: string; objective: string; status: string; onClick: () => void; key?: string }) {
  const isLocked = status === 'LOCKED';

  return (
    <div 
      onClick={isLocked ? undefined : onClick}
      className={`border-r border-white/10 p-8 flex flex-col justify-between transition-all hover:bg-white/5 h-64 relative group cursor-pointer ${isLocked ? 'opacity-40 cursor-not-allowed' : ''}`}
    >
      <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <Target className="w-4 h-4 text-primary" />
      </div>
      
      <div className="flex flex-col">
        <span className={`text-[10px] font-bold uppercase tracking-widest text-white/60`}>{title}</span>
        <span className="text-xl font-black uppercase mt-1 leading-none group-hover:text-primary transition-colors">{subtitle}</span>
      </div>

      <div className="flex flex-col">
        <div className="flex items-baseline justify-between mb-2">
          <span className="text-3xl font-light font-mono truncate">{progress}</span>
          <Zap className={`w-3 h-3 ${progress !== '0%' ? 'text-primary' : 'text-white/20'}`} />
        </div>
        <div className="flex flex-col">
          <div className="h-[2px] w-full bg-white/5 mb-3">
             <div className="h-full bg-primary/40" style={{ width: progress }} />
          </div>
          <span className={`text-[9px] font-mono uppercase tracking-[0.2em] text-white/50`}>{objective}</span>
        </div>
      </div>

      {isLocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-[2px]">
          <Shield className="w-8 h-8 text-white/20" />
        </div>
      )}
    </div>
  );
}

