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
  duration: string;
  daysRemaining?: number;
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
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=800',
    duration: 'MAY 10, 2026 - JUN 10, 2026',
    daysRemaining: 21
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
    image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80&w=800',
    duration: 'MAY 01, 2026 - MAY 24, 2026',
    daysRemaining: 4
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
    image: 'https://images.unsplash.com/photo-1614013410980-6e1307224211?auto=format&fit=crop&q=80&w=800',
    duration: 'JUN 15, 2026 - JUN 30, 2026',
    daysRemaining: 26
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
            <section className="grid grid-cols-1 md:grid-cols-12 border-b border-outline pb-8 sm:pb-xl relative">
              <div className="absolute top-0 right-0 hidden lg:block text-[8px] font-mono text-on-surface/30 vertical-text h-full tracking-[0.5em] pointer-events-none">
                EVENTS_ACTIVE
              </div>
              
              <div className="md:col-span-12 flex flex-col gap-8 md:gap-12">
                {/* Header Section */}
                <div className="flex justify-between items-start">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-1 h-1 bg-primary animate-ping" />
                      <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">Live Events</span>
                    </div>
                    <span className="text-[10px] font-mono text-on-surface/60 uppercase tracking-widest">Track current in-game events // 42 active challenges</span>
                  </div>
                  <div className="hidden md:flex gap-12">
                    <div className="flex flex-col items-end">
                      <span className="text-[9px] font-mono text-on-surface/40 uppercase">Event Count</span>
                      <span className="text-sm font-medium text-on-surface">3 Active</span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-[9px] font-mono text-on-surface/40 uppercase">Active Players</span>
                      <span className="text-sm font-medium text-on-surface">12.4K</span>
                    </div>
                  </div>
                </div>
                
                <div className="relative flex flex-col lg:flex-row gap-8 lg:gap-12 items-start w-full">
                  <div className="flex flex-col w-full lg:w-auto">
                    <h2 className="text-[54px] xs:text-[72px] sm:text-[100px] md:text-[140px] xl:text-[180px] leading-[0.8] font-black uppercase tracking-tighter select-none sm:-ml-1 shrink-0 transition-all text-on-surface">
                      Elden<br/>
                      <span className="text-primary italic">R</span>ing
                    </h2>
                    <div className="mt-6 sm:mt-8 flex items-center gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse border border-red-500/50" />
                      <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-on-surface leading-tight">Expansion: Shadow of the Erdtree // In-game Sync</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-6 md:gap-8 lg:mt-32 max-w-sm z-10 w-full">
                    <p className="text-xs md:text-sm text-on-surface/60 leading-relaxed italic font-serif">
                      The Lands Between calls again. Track your progression through the Shadow Realm, manage boss reminders, and optimize your character builds in real-time. 
                    </p>
                    <div className="h-[1px] w-16 sm:w-24 bg-primary"></div>
                    
                    <div className="flex flex-wrap items-center gap-6 sm:gap-8">
                      <button className="flex items-center gap-4 group">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 border border-primary flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-background transition-all transform group-hover:rotate-6 font-black">
                          <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" />
                        </div>
                        <div className="flex flex-col text-left">
                          <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-on-surface">Watch Stream</span>
                          <span className="text-[8px] font-mono text-on-surface/50 uppercase mt-0.5">45.2K Viewers</span>
                        </div>
                      </button>
                    </div>
                  </div>
 
                  {/* SMALLER LIVESTREAM BOX */}
                  <div className="lg:absolute lg:right-0 lg:top-0 w-full lg:w-[320px] xl:w-[400px] aspect-video bg-surface border border-outline group overflow-hidden relative">
                    <img 
                      alt="Tournament" 
                      src="https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=1200"
                      className="w-full h-full object-cover grayscale opacity-40 group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-on-surface/10 to-transparent pointer-events-none" />
                    <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="flex flex-col">
                        <span className="text-[8px] font-bold uppercase tracking-widest text-primary">Live Feed</span>
                        <span className="text-[10px] font-black uppercase text-on-surface">Main Stage Camera</span>
                      </div>
                      <Maximize2 className="w-3 h-3 text-on-surface/40" />
                    </div>
                    <div className="absolute top-3 left-3">
                      <span className="text-[8px] font-mono bg-red-600 text-white px-2 py-0.5 rounded-sm">02:14:59</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>
 
            {/* Active Events Grid */}
            <section className="grid grid-cols-1 md:grid-cols-4 border-t border-outline">
              {EVENT_DATA.map(event => (
                <ActiveEventCard 
                  key={event.id}
                  title={event.title}
                  subtitle={event.subtitle}
                  progress={event.progress}
                  objective={event.objective}
                  status={event.status}
                  duration={event.duration}
                  daysRemaining={event.daysRemaining}
                  onClick={() => setSelectedEventId(event.id)}
                />
              ))}
              <div className="p-6 sm:p-8 flex flex-col justify-between bg-primary text-background cursor-pointer hover:brightness-110 transition-all min-h-[160px] md:min-h-[340px] h-auto">
                <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">Past Events</span>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-xl font-black uppercase">Completed</span>
                  <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 stroke-[3]" />
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
            className="border border-outline bg-surface-bright/20 overflow-hidden"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[500px] lg:min-h-[600px]">
              {/* Media Section */}
              <div className="lg:col-span-12 px-4 py-3 sm:px-6 sm:py-4 border-b border-outline flex justify-between items-center bg-surface-dim/40 gap-4">
                <button 
                  onClick={() => setSelectedEventId(null)}
                  className="flex items-center gap-2 sm:gap-3 text-[10px] font-bold uppercase tracking-widest text-on-surface/40 hover:text-on-surface transition-colors"
                >
                  <ArrowRight className="w-3.5 h-3.5 rotate-180" />
                  <span>Back to Events</span>
                </button>
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="px-2 py-0.5 sm:px-3 sm:py-1 border border-primary/20 bg-primary/10 text-primary text-[9px] sm:text-[10px] font-bold uppercase tracking-widest">
                    {selectedEvent?.status}
                  </div>
                  <X 
                    className="w-4 h-4 sm:w-5 sm:h-5 text-on-surface/20 hover:text-on-surface cursor-pointer" 
                    onClick={() => setSelectedEventId(null)}
                  />
                </div>
              </div>

              <div className="lg:col-span-7 relative h-[250px] xs:h-[300px] sm:h-[400px] lg:h-full border-b lg:border-b-0 lg:border-r border-outline p-6 sm:p-10 lg:p-12 flex flex-col justify-end overflow-hidden group">
                <img 
                   src={selectedEvent?.image} 
                   className="absolute inset-0 w-full h-full object-cover opacity-20 scale-105 group-hover:scale-100 transition-transform duration-2000"
                   alt=""
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-on-surface/10 to-transparent" />
                
                <div className="relative z-10">
                  <motion.div 
                    initial={{ y: 20, opacity: 0 }} 
                    animate={{ y: 0, opacity: 1 }} 
                    transition={{ delay: 0.2 }}
                    className="space-y-2 sm:space-y-4"
                  >
                    <span className="text-[10px] sm:text-xs font-mono text-primary tracking-[0.5em] uppercase">{selectedEvent?.title}</span>
                    <h2 className="text-4xl sm:text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none italic text-on-surface">
                      {selectedEvent?.subtitle.split(' ')[0]}<br/>
                      <span className="text-primary">{selectedEvent?.subtitle.split(' ')[1]}</span>
                    </h2>
                    <p className="max-w-md text-xs sm:text-sm text-on-surface/60 leading-relaxed font-serif italic pt-2 sm:pt-4">
                      {selectedEvent?.description}
                    </p>
                  </motion.div>
                </div>
              </div>

              {/* Interaction Section */}
              <div className="lg:col-span-5 p-6 sm:p-10 lg:p-12 flex flex-col justify-between bg-on-surface/2 gap-8 lg:gap-12">
                <div className="space-y-8 sm:space-y-12">
                  <div className="grid grid-cols-2 gap-4 sm:gap-6">
                    {selectedEvent?.stats.map((stat, i) => (
                      <motion.div 
                        key={stat.label}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + i * 0.1 }}
                        className="flex flex-col gap-1.5 p-3.5 sm:p-5 border border-outline bg-on-surface/2"
                      >
                        <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-on-surface/30 italic">{stat.label}</span>
                        <span className="text-xl sm:text-2xl font-mono text-on-surface/90">{stat.value}</span>
                      </motion.div>
                    ))}
                  </div>

                  <div className="space-y-4 sm:space-y-6">
                    <div className="flex justify-between items-end">
                      <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-on-surface/40 italic">Event Progress</span>
                      <span className="text-lg sm:text-xl font-mono text-primary">{selectedEvent?.progress}</span>
                    </div>
                    <div className="h-1 bg-on-surface/5 relative">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: selectedEvent?.progress }}
                        transition={{ duration: 1.5, ease: "circOut" }}
                        className="absolute h-full bg-primary"
                      />
                    </div>
                    <p className="text-[9px] sm:text-[10px] font-mono text-on-surface/30 uppercase tracking-widest">{selectedEvent?.objective}</p>
                  </div>

                  {/* Campaign Duration and Expiration Alerts */}
                  {selectedEvent && (
                    <div className="p-4 sm:p-6 bg-on-surface/[0.03] border border-outline/10 space-y-4">
                      <div className="flex items-center gap-2.5">
                        <Trophy className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
                        <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface/60">Event Duration</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-on-surface/[0.02] border border-outline/5 p-4 rounded-sm">
                        <div className="space-y-1">
                          <span className="text-[9px] sm:text-[10px] font-mono uppercase text-on-surface/40 block leading-tight">Dates</span>
                          <span className="text-xs sm:text-sm font-mono text-on-surface/90 font-extrabold leading-normal block">{selectedEvent.duration}</span>
                        </div>
                        <div className="space-y-1 pt-3 sm:pt-0 border-t sm:border-t-0 sm:border-l border-outline/10 sm:pl-6">
                          <span className="text-[9px] sm:text-[10px] font-mono uppercase text-on-surface/40 block leading-tight">Time Left</span>
                          <span className={`text-xs sm:text-sm font-mono font-extrabold leading-normal block ${selectedEvent.daysRemaining !== undefined && selectedEvent.daysRemaining <= 5 ? 'text-red-500' : 'text-on-surface/90'}`}>
                            {selectedEvent.daysRemaining} days left
                          </span>
                        </div>
                      </div>

                      {selectedEvent.daysRemaining !== undefined && selectedEvent.daysRemaining <= 5 && (
                        <div className="border border-red-500/20 bg-red-500/10 p-3 sm:p-4 space-y-1.5">
                          <div className="flex items-center gap-2 text-red-500">
                            <Zap className="w-3.5 h-3.5 animate-bounce" />
                            <span className="text-[9px] font-black uppercase tracking-[0.15em]">ENDING SOON</span>
                          </div>
                          <p className="text-[10px] sm:text-[10.5px] font-mono text-red-400 leading-relaxed uppercase">
                            This event is ending soon. Be sure to complete your challenges in {selectedEvent.daysRemaining} days to collect all event rewards!
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="pt-6 sm:pt-12 space-y-3 sm:space-y-4">
                  <button className="w-full py-3.5 sm:py-5 bg-primary text-background font-black uppercase tracking-[0.3em] text-xs hover:bg-on-surface hover:text-background transition-all flex items-center justify-center gap-4 group">
                    <Shield className="w-4 h-4" />
                    <span>Join Event</span>
                  </button>
                  <button className="w-full py-3.5 sm:py-5 border border-outline text-on-surface/40 font-black uppercase tracking-[0.3em] text-xs hover:border-on-surface hover:text-on-surface transition-all">
                    Leaderboards
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

function ActiveEventCard({ title, subtitle, progress, objective, status, duration, daysRemaining, onClick }: { title: string; subtitle: string; progress: string; objective: string; status: string; duration?: string; daysRemaining?: number; onClick: () => void; key?: string }) {
  const isLocked = status === 'LOCKED';
  const isCloseToExpiration = daysRemaining !== undefined && daysRemaining <= 5;

  return (
    <div 
      onClick={isLocked ? undefined : onClick}
      className={`border-b md:border-b-0 md:border-r p-6 sm:p-8 flex flex-col justify-between transition-all h-auto min-h-[300px] sm:min-h-[340px] relative group cursor-pointer ${
        isLocked 
          ? 'border-outline opacity-40 cursor-not-allowed' 
          : isCloseToExpiration
            ? 'border-red-500/30 bg-red-500/[0.02] hover:bg-red-500/[0.05] hover:border-red-500/50'
            : 'border-outline hover:bg-on-surface/5'
      }`}
    >
      {/* Red Accent Tab at the top of the expiring card */}
      {isCloseToExpiration && (
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-red-500" />
      )}

      <div className="absolute top-4 right-4 flex items-center gap-2">
        {isCloseToExpiration && (
          <span className="flex items-center gap-1 px-1.5 py-0.5 bg-red-500 text-background font-mono text-[7px] font-black uppercase tracking-widest">
            ⚠️ ENDS IN {daysRemaining}D
          </span>
        )}
        <Target className={`w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity ${isCloseToExpiration ? 'text-red-500' : 'text-primary'}`} />
      </div>
      
      <div className="flex flex-col space-y-4">
        <div className="space-y-1">
          <span className={`text-[10px] font-bold uppercase tracking-widest ${isCloseToExpiration ? 'text-red-400' : 'text-on-surface/60'}`}>{title}</span>
          <span className={`text-xl font-black uppercase mt-1 leading-none group-hover:text-primary transition-colors text-on-surface block ${isCloseToExpiration ? 'group-hover:text-red-500' : ''}`}>{subtitle}</span>
        </div>

        {duration && (
          <div className={`space-y-1.5 border p-4 rounded-sm ${isCloseToExpiration ? 'bg-red-500/[0.03] border-red-500/20' : 'bg-on-surface/[0.02] border-outline/10'}`}>
            <span className={`text-[9px] font-mono uppercase tracking-wider block ${isCloseToExpiration ? 'text-red-400/50' : 'text-on-surface/40'}`}>Event Duration</span>
            <span className={`text-xs md:text-sm font-mono block leading-relaxed ${isCloseToExpiration ? 'text-red-400 font-extrabold' : 'text-on-surface/90 font-bold'}`}>{duration}</span>
          </div>
        )}
      </div>

      <div className="flex flex-col space-y-4 pt-4 border-t border-outline/5 mt-4">
        <div className="flex flex-col">
          <div className="flex items-baseline justify-between mb-2">
            <span className={`text-3xl font-light font-mono text-on-surface ${isCloseToExpiration ? 'text-red-400' : ''}`}>{progress}</span>
            <Zap className={`w-3 h-3 ${progress !== '0%' ? (isCloseToExpiration ? 'text-red-500' : 'text-primary') : 'text-on-surface/20'}`} />
          </div>
          <div className="flex flex-col">
            <div className="h-[2px] w-full bg-on-surface/5 mb-3">
               <div className={`h-full transition-all duration-500 ${isCloseToExpiration ? 'bg-red-500' : 'bg-primary/40'}`} style={{ width: progress }} />
            </div>
            <span className={`text-[9px] font-mono uppercase tracking-[0.2em] ${isCloseToExpiration ? 'text-red-400/60' : 'text-on-surface/50'}`}>{objective}</span>
          </div>
        </div>
      </div>

      {isLocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-[2px]">
          <Shield className="w-8 h-8 text-on-surface/20" />
        </div>
      )}
    </div>
  );
}


