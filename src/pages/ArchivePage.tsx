import { Archive, ArrowRight, Shield, Award, Star, Search, Filter, Gamepad2, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { useState, useEffect } from 'react';

const ARCHIVED_DATA = [
  {
    id: '1',
    title: 'VALORANT Protocol',
    subtitle: 'Act III Mastery',
    date: 'APR 2026',
    progress: 100,
    tier: 'Platinum',
    nodes: 84,
    source: 'local'
  },
  {
    id: '2',
    title: 'ELDEN ROOT Index',
    subtitle: 'Base Game Completion',
    date: 'MAR 2026',
    progress: 100,
    tier: 'Elden Lord',
    nodes: 142,
    source: 'local'
  },
  {
    id: '3',
    title: 'NEON BLADE Sync',
    subtitle: 'Speedrun Phase 04',
    date: 'JAN 2026',
    progress: 100,
    tier: 'Ghost',
    nodes: 56,
    source: 'local'
  },
   {
    id: '4',
    title: 'HALO SYNC',
    subtitle: 'Legendary Campaign',
    date: 'DEC 2025',
    progress: 100,
    tier: 'Heroic',
    nodes: 92,
    source: 'local'
  }
];

interface SteamGame {
  appid: number;
  name: string;
  playtime_forever: number;
  img_icon_url: string;
  has_community_visible_stats?: boolean;
}

export function ArchivePage({ onBack, steamId }: { onBack: () => void; steamId: string | null }) {
  const [filter, setFilter] = useState('');
  const [steamGames, setSteamGames] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [news, setNews] = useState<any[]>([]);
  const [isLoadingNews, setIsLoadingNews] = useState(false);
  const [globalNews, setGlobalNews] = useState<any[]>([]);
  const [isLoadingGlobalNews, setIsLoadingGlobalNews] = useState(false);

  useEffect(() => {
    const fetchSteamGames = async () => {
      if (!steamId) return;
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/steam/games?steamId=${steamId}`);
        if (!res.ok) throw new Error('Steam Data Link Failed');
        const data = await res.json();
        
        if (data.games) {
          const transformed = data.games
            .filter((g: SteamGame) => g.playtime_forever > 0)
            .sort((a: SteamGame, b: SteamGame) => b.playtime_forever - a.playtime_forever)
            .map((g: SteamGame) => ({
              id: `steam-${g.appid}`,
              appid: g.appid,
              title: g.name,
              subtitle: 'Steam Synchronized',
              date: 'LIVE SYNC',
              progress: 0,
              tier: `${Math.floor(g.playtime_forever / 60)}H Playtime`,
              nodes: g.has_community_visible_stats ? 'LINKED' : 'PRIVATE',
              source: 'steam',
              playtime: g.playtime_forever,
              icon: g.img_icon_url ? `http://media.steampowered.com/steamcommunity/public/images/apps/${g.appid}/${g.img_icon_url}.jpg` : null
            }));
          setSteamGames(transformed);
        }
      } catch (err: any) {
        console.error('Archive Steam Fetch Error:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSteamGames();
  }, [steamId]);

  useEffect(() => {
    const fetchNews = async () => {
      if (!selectedItem) {
        setNews([]);
        return;
      }
      
      setIsLoadingNews(true);
      try {
        let url = '';
        if (selectedItem.source === 'steam' && selectedItem.appid) {
          url = `/api/steam/news?appId=${selectedItem.appid}`;
        } else {
          url = `/api/app/news?originId=${selectedItem.id}`;
        }

        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          setNews(data);
        }
      } catch (err) {
        console.error('News Fetch Error:', err);
      } finally {
        setIsLoadingNews(false);
      }
    };

    fetchNews();
  }, [selectedItem]);

  useEffect(() => {
    const fetchGlobalNews = async () => {
      setIsLoadingGlobalNews(true);
      try {
        const res = await fetch('/api/app/news');
        if (res.ok) {
          const data = await res.json();
          setGlobalNews(data);
        }
      } catch (err) {
        console.error('Global News Fetch Error:', err);
      } finally {
        setIsLoadingGlobalNews(false);
      }
    };

    fetchGlobalNews();
  }, []);

  const allData = [...ARCHIVED_DATA, ...steamGames];
  const filteredData = allData.filter(item => 
    item.title?.toLowerCase().includes(filter.toLowerCase()) || 
    item.subtitle?.toLowerCase().includes(filter.toLowerCase())
  );

  const totalNodes = allData.length > 0 ? (ARCHIVED_DATA.length * 84 + steamGames.length * 10) : 374;

  if (selectedItem) {
    return (
      <div className="space-y-xl animate-in fade-in slide-in-from-bottom-4 duration-700 text-on-surface pb-32 pt-24">
        {/* Fixed Navigation Bar */}
        <div className="fixed top-[4.5rem] md:top-[5.75rem] left-0 w-full z-40 bg-background/90 backdrop-blur-md border-b border-outline/10 py-6 px-6 md:px-12 shadow-sm">
          <div className="max-w-[1600px] mx-auto flex items-center justify-between">
             <button 
               onClick={() => setSelectedItem(null)}
               className="flex items-center gap-4 text-xs font-bold uppercase tracking-[0.4em] text-on-surface hover:text-primary transition-colors group py-1"
             >
               <ArrowRight className="w-5 h-5 rotate-180 group-hover:-translate-x-1.5 transition-transform" />
               Back to Record Directory
             </button>
             <div className="hidden md:block text-xs font-mono text-primary uppercase tracking-widest italic opacity-40">
               Deep Scan // {selectedItem.title}
             </div>
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-0 bg-on-surface/[0.02] -z-10" />
          <div className="border border-outline/10 p-12 md:p-24 space-y-16">
            <div className="flex flex-col md:flex-row gap-12 md:items-end justify-between">
               <div className="space-y-4">
                  <div className="flex items-center gap-4 text-[10px] font-mono text-primary uppercase tracking-[0.3em]">
                    <Shield className="w-3 h-3" />
                    <span>Verified Archives</span>
                  </div>
                  <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none">
                    {selectedItem.title}
                  </h2>
               </div>
               <div className="flex flex-col items-end gap-2">
                 <span className="text-[8px] font-mono uppercase tracking-widest text-on-surface/30">Engagement Metric</span>
                 <div className="text-4xl font-mono font-light italic text-primary">{selectedItem.tier}</div>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
               <DetailStat label="Source Origin" value={selectedItem.source.toUpperCase()} />
               <DetailStat label="Handshake Signal" value={selectedItem.nodes} />
               <DetailStat label="Synchronization" value={selectedItem.date} />
               <DetailStat label="Efficiency" value="OPTIMAL" highlight />
            </div>

            <div className="space-y-12 pt-12 border-t border-outline/5">
               <div className="flex items-center justify-between">
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary">Intelligence & Intel Reports</h3>
                  <div className="h-[1px] flex-1 mx-8 bg-outline/10" />
                  <span className="text-[8px] font-mono uppercase text-on-surface/20">Updated in Real-Time</span>
               </div>

               <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                  <div className="lg:col-span-2 space-y-8">
                     <h4 className="text-sm font-bold uppercase tracking-widest opacity-40">Operational Field Reports</h4>
                     {isLoadingNews ? (
                       <div className="py-24 flex flex-col items-center gap-4 border border-outline/5 bg-on-surface/[0.02]">
                          <Loader2 className="w-6 h-6 text-primary animate-spin" />
                          <span className="text-[10px] uppercase font-bold tracking-widest opacity-40">Intercepting Transmissions...</span>
                       </div>
                     ) : news.length > 0 ? (
                       <div className="space-y-4">
                         {news.map((item, i) => (
                           <motion.a 
                             key={i}
                             href={item.url}
                             target="_blank"
                             rel="noopener noreferrer"
                             initial={{ opacity: 0, x: -10 }}
                             animate={{ opacity: 1, x: 0 }}
                             transition={{ delay: i * 0.1 }}
                             className="block border border-outline/10 p-8 hover:bg-on-surface/[0.03] transition-all group"
                           >
                             <div className="flex justify-between items-start mb-2">
                               <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                                  <span className="text-[9px] font-mono text-primary uppercase">{new Date(item.date * 1000).toLocaleDateString()}</span>
                                  <span className="text-[8px] font-mono text-on-surface/40 uppercase tracking-widest font-black">Source: {item.feedlabel || item.author || 'Steam Core'}</span>
                                </div>
                               <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-40 transition-opacity" />
                             </div>
                             <div className="space-y-4">
                               <h5 className="text-lg font-bold uppercase tracking-tight group-hover:text-primary transition-colors leading-relaxed">{item.title}</h5>
                               <div className="h-px bg-outline/10 w-8" />
                               <p className="text-xs font-serif italic text-on-surface/60 leading-relaxed">{item.contents.replace(/<[^>]*>?/gm, '')}</p>
                             </div>
                           </motion.a>
                         ))}
                       </div>
                     ) : (
                       <div className="py-24 border border-outline/5 bg-on-surface/[0.02] text-center italic text-xs opacity-20">
                         No operational field reports found for this node.
                       </div>
                     )}
                  </div>
                  
                  <div className="space-y-8">
                     <h4 className="text-sm font-bold uppercase tracking-widest opacity-40">Node Imagery</h4>
                     <div className="aspect-video border border-outline/10 bg-on-surface/[0.05] relative overflow-hidden group">
                        {selectedItem.icon ? (
                          <img src={selectedItem.icon.replace('_icon.jpg', '_header.jpg')} alt="" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center opacity-10">
                            <Archive className="w-12 h-12" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                     </div>
                     <div className="p-8 border border-primary/20 bg-primary/5 text-[9px] font-mono leading-relaxed space-y-2">
                        <div className="text-primary font-bold">NODE_INTEL_LOG:</div>
                        <div className="opacity-60 italic uppercase">Integrity scanning complete. No corrupted sectors detected in this record block. All telemetry remains synchronized with external hosts.</div>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-xl animate-in fade-in slide-in-from-bottom-4 duration-700 text-on-surface pb-32 pt-24">
      {/* Fixed Navigation Bar */}
      <div className="fixed top-[4.5rem] md:top-[5.75rem] left-0 w-full z-40 bg-background/90 backdrop-blur-md border-b border-outline/10 py-6 px-6 md:px-12 shadow-sm">
        <div className="max-w-[1600px] mx-auto flex justify-between items-center">
          <button 
            onClick={onBack}
            className="flex items-center gap-4 text-xs font-bold uppercase tracking-[0.3em] text-on-surface hover:text-primary transition-all group py-1"
          >
            <ArrowRight className="w-5 h-5 rotate-180 group-hover:-translate-x-1.5 transition-transform" />
            <span>Back to Progress</span>
          </button>
          
          <div className="flex items-center gap-6 opacity-40">
             <span className="text-xs font-bold uppercase tracking-[0.3em] text-primary">Data Repository</span>
             {steamId && (
              <div className="hidden lg:flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-primary italic">
                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                <span>Sync Active</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Hero Header (Non-sticky) */}
      <div className="border-b border-outline/10 pb-12 mb-12 flex flex-col md:flex-row justify-between items-end gap-12">
        <div>
          <h2 className="text-[60px] md:text-[80px] lg:text-[100px] leading-[0.7] font-black uppercase tracking-tighter mt-4 transition-all">Archiv<span className="text-primary italic">e</span></h2>
          <p className="text-on-surface/60 font-serif italic text-sm md:text-base mt-6 max-w-sm leading-tight uppercase tracking-widest opacity-40">
            Historical records of successfully synchronized tactical nodes and milestones.
          </p>
        </div>
        
        <div className="w-full md:w-auto flex flex-col gap-4">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface/20 group-focus-within:text-primary transition-colors" />
            <input 
              type="text" 
              placeholder="Search Records..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full md:w-80 bg-on-surface/[0.03] border border-outline/10 py-5 pl-12 pr-6 text-[10px] font-bold uppercase tracking-widest focus:outline-none focus:border-primary transition-all text-on-surface"
            />
          </div>
        </div>
      </div>

      {/* Archive Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-outline/10 border border-outline/10">
        <ArchiveStat label="Total Retained Nodes" value={totalNodes.toString()} icon={<Archive className="w-5 h-5" />} />
        <ArchiveStat label="Stream Integrations" value={steamGames.length.toString()} icon={<Gamepad2 className="w-5 h-5" />} />
        <ArchiveStat label="Integrity Score" value="99.9%" icon={<Shield className="w-5 h-5" />} />
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 mt-12 items-start">
        {/* Archive List Column */}
        <div className="lg:col-span-3 space-y-8">
          <div className="flex items-center justify-between border-b border-outline/10 pb-4">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Archived Record Inventory</span>
            <span className="text-[10px] font-mono text-on-surface/40 uppercase">{filteredData.length} records localized</span>
          </div>

          <div className="grid grid-cols-1 gap-12">
            {isLoading ? (
              <div className="py-32 flex flex-col items-center justify-center space-y-4 border border-outline/5 bg-on-surface/[0.01]">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary">Interfacing Steam Record...</span>
              </div>
            ) : filteredData.length > 0 ? (
              filteredData.map((item, index) => (
                <div key={item.id} onClick={() => setSelectedItem(item)} className="cursor-pointer">
                  <ArchiveRow item={item} index={index} />
                </div>
              ))
            ) : (
              <div className="py-32 flex flex-col items-center justify-center grayscale opacity-25 space-y-6 border border-outline/5 bg-on-surface/[0.01]">
                <Search className="w-16 h-16 text-on-surface" />
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-on-surface">No Records Found</span>
              </div>
            )}
          </div>
        </div>

        {/* Global News Sidebar */}
        <div className="space-y-8 border-t lg:border-t-0 lg:border-l border-outline/10 pt-12 lg:pt-0 lg:pl-12 self-stretch">
          <div className="flex items-center justify-between border-b border-outline/10 pb-4">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">QuestGate Core News</span>
            <span className="text-[8px] font-mono text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 animate-pulse uppercase tracking-[0.2em] font-black">Live Uplink</span>
          </div>

          {isLoadingGlobalNews ? (
            <div className="py-12 flex flex-col items-center justify-center gap-4 text-on-surface/40 border border-dashed border-outline/10 p-6">
              <Loader2 className="w-5 h-5 text-primary animate-spin" />
              <span className="text-[9px] uppercase font-mono tracking-[0.2em]">Intercepting Bulletins...</span>
            </div>
          ) : globalNews.length > 0 ? (
            <div className="space-y-6">
              {globalNews.map((item, i) => (
                <div 
                  key={i}
                  className="border border-outline/10 p-6 bg-on-surface/[0.01] hover:bg-on-surface/[0.03] transition-colors group space-y-3"
                >
                  <div className="flex justify-between items-baseline">
                    <span className="text-[8px] font-mono text-primary uppercase tracking-widest font-black">
                      {new Date(item.date * 1000).toLocaleDateString()}
                    </span>
                    <span className="text-[7px] font-mono text-on-surface/30">{item.feedlabel || item.source || 'SYS_INTEL'} // {i + 1}</span>
                  </div>
                  <h4 className="text-[11px] font-black uppercase tracking-wider group-hover:text-primary transition-colors leading-snug">
                    {item.title}
                  </h4>
                  <p className="text-[10px] font-serif italic text-on-surface/40 leading-relaxed uppercase tracking-wide">
                    {item.contents}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-[10px] font-mono opacity-25 italic uppercase border border-dashed border-outline/10 p-6">
              Uplink idle. No bulletins received.
            </div>
          )}
        </div>
      </div>

      {/* Footer Decoration */}
      <div className="pt-24 flex flex-col items-center gap-6 opacity-10">
        <div className="h-[1px] w-32 bg-on-surface" />
        <span className="text-[8px] font-mono uppercase tracking-[1em] text-on-surface">End of Index</span>
      </div>
    </div>

  );
}

function DetailStat({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="bg-on-surface/[0.03] border border-outline/5 p-8 flex flex-col gap-2">
      <span className="text-[8px] font-mono uppercase tracking-widest text-on-surface/30">{label}</span>
      <span className={`text-xl font-black uppercase tracking-tighter ${highlight ? 'text-primary italic' : 'text-on-surface'}`}>{value}</span>
    </div>
  );
}

function ArchiveStat({ label, value, icon }: { label: string; value: string; icon: any }) {
  return (
    <div className="bg-background p-10 flex flex-col gap-6 group hover:bg-on-surface/[0.02] transition-colors">
      <div className="flex justify-between items-start text-on-surface/40">
        <span className="text-[9px] font-bold uppercase tracking-widest">{label}</span>
        <div className="group-hover:text-primary transition-colors">{icon}</div>
      </div>
      <span className="text-4xl font-mono font-light italic text-on-surface">{value}</span>
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
      <div className="border border-outline/10 p-12 lg:p-16 flex flex-col lg:flex-row lg:items-center justify-between gap-12 hover:bg-on-surface/[0.02] transition-all relative z-10 bg-background/50 backdrop-blur-sm">
        <div className="flex flex-col md:flex-row md:items-center gap-12 lg:gap-24">
          <div className="flex items-center gap-8">
            {item.source === 'steam' && item.icon && (
              <img src={item.icon} alt="" className="w-12 h-12 border border-outline/20 grayscale group-hover:grayscale-0 transition-all" />
            )}
            <div className="flex flex-col">
              <span className="text-[9px] font-mono text-on-surface/20 uppercase tracking-widest">{item.date} // {item.source === 'steam' ? 'STEAM_SYNC' : `REF_${item.id.padStart(3, '0')}`}</span>
              <h3 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mt-2 group-hover:italic transition-all text-on-surface">
                {item.title}
              </h3>
              <span className={`text-[10px] font-bold uppercase tracking-[0.3em] mt-2 ${item.source === 'steam' ? 'text-primary' : 'text-primary'}`}>
                {item.subtitle}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-12 border-l border-outline/5 pl-12 md:pl-0 md:border-l-0">
             <div className="flex flex-col gap-1">
                <span className="text-[8px] font-mono text-on-surface/20 uppercase tracking-widest">{item.source === 'steam' ? 'Engagement' : 'Achieved Tier'}</span>
                <span className="text-sm font-black uppercase tracking-widest italic text-on-surface">{item.tier}</span>
             </div>
             <div className="flex flex-col gap-1">
                <span className="text-[8px] font-mono text-on-surface/20 uppercase tracking-widest">{item.source === 'steam' ? 'Sync Logic' : 'Nodes Decrypted'}</span>
                <span className="text-sm font-black uppercase tracking-widest italic text-on-surface">
                  {item.source === 'steam' ? 'HARDWARE_LINK' : `${item.nodes} Units`}
                </span>
             </div>
             <div className="hidden lg:flex flex-col gap-1">
                <span className="text-[8px] font-mono text-on-surface/20 uppercase tracking-widest">Efficiency</span>
                <span className={`text-sm font-black uppercase tracking-widest italic ${item.source === 'steam' ? 'text-green-500' : 'text-primary'}`}>
                  {item.source === 'steam' ? 'REALTIME' : 'OPTIMAL'}
                </span>
             </div>
          </div>
        </div>

        <div className="flex items-center gap-12">
          {item.source === 'steam' ? (
            <div className="w-16 h-16 flex items-center justify-center border border-primary/20 group-hover:border-primary transition-colors bg-primary/5">
              <Gamepad2 className="w-6 h-6 text-primary" />
            </div>
          ) : (
            <div className="w-16 h-16 flex items-center justify-center border border-outline/10 group-hover:border-primary transition-colors bg-on-surface/[0.02]">
              <Star className="w-5 h-5 text-on-surface/20 group-hover:text-primary transition-colors" />
            </div>
          )}
          <div className="flex flex-col items-end">
            <span className="text-[8px] font-mono text-on-surface/20 uppercase tracking-widest mb-1">Integrity</span>
            <span className={`text-3xl font-mono font-light italic ${item.source === 'steam' ? 'text-primary' : 'text-on-surface/80'}`}>
              {item.source === 'steam' ? 'SYNC' : `${item.progress}%`}
            </span>
          </div>
        </div>
      </div>
      
      {/* Background Index Number */}
      <div className="absolute top-1/2 -translate-y-1/2 right-[-5%] text-[200px] font-black text-on-surface/[0.02] pointer-events-none select-none italic leading-none transition-all group-hover:right-[0%] uppercase">
        {item.title?.split(' ')[0]}
      </div>
    </motion.div>
  );
}

