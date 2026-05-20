import { useState, useMemo, MouseEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Flame, Cpu, Layout, Eye, BookOpen, Clock, ArrowRight, Share2, CornerDownRight, CheckCircle, Newspaper, Terminal, ThumbsUp } from 'lucide-react';

interface NewsArticle {
  id: string;
  title: string;
  category: 'GAMING' | 'TECHNOLOGY' | 'HARDWARE' | 'REPORTS';
  summary: string;
  author: string;
  source: string;
  publishedAt: string;
  readingTime: string;
  views: number;
  featured: boolean;
  content: string[];
  specs?: Record<string, string>;
}

const NEWS_DATA: NewsArticle[] = [
  {
    id: '1',
    title: 'THE STATE OF UNREAL ENGINE 5.5: NANITE, LUMEN, AND THE REAL-TIME AI REVOLUTION',
    category: 'TECHNOLOGY',
    summary: 'A deep-dive investigation into how Epic Games is decoupling rendering fidelity from hardware limits using Neural-network frame reconstruction and advanced hardware Lumen solutions.',
    author: 'CYBER_SEC_INTEL',
    source: 'Epic Games Dev / Digital Foundry',
    publishedAt: '2026-05-19',
    readingTime: '6 MIN READ',
    views: 14205,
    featured: true,
    content: [
      'Epic Games has officially deployed Unreal Engine 5.5, signaling the next paradigm shift in real-time virtual production and gaming infrastructure. This revision directly addresses the compute overhead introduced by initial Lumen iterations, introducing a highly optimized compute shader path that reduces volumetric light baking times by up to 40%.',
      'The biggest breakthrough comes in the form of "Lumen Neural Reconstruction." Rather than relying purely on hardware ray-tracing clusters, the engine now leverages an onboard lightweight neural model to fill in sparse ray data. The result is a noise-free, high-fidelity light representation that runs fluidly on standard mid-tier graphics hardware.',
      'Nanite has also received massive upgrades, enabling real-time displacement maps to generate unlimited geometric micro-details without consuming VRAM buffers. Artists can now import high-density scan files directly into active viewports with zero compression loss.',
      'In addition, the brand new "Massive Entity System" allows for full deterministic simulation of half a million active agents. This means virtual worlds will soon feature organic crowds, complete with individual thermal maps and autonomous steering protocols.'
    ],
    specs: {
      'Engine Version': 'UE 5.5.0-PRO',
      'Lumen Overhead': '-40% Compute Latency',
      'Mesh Support': 'Nanite Tessellation Direct',
      'Min Hardware VRAM': '8GB GDDR6'
    }
  },
  {
    id: '2',
    title: 'NVIDIA BLACKWELL ARCHITECTURE DECOUPLES COMPUTE PERFORMANCE',
    category: 'HARDWARE',
    summary: 'Next-generation RT cores and transformative FP4 computational engines set a new benchmark for ultra-high-refresh-rate path-traced gaming.',
    author: 'HARDWARE_ANALYST_08',
    source: 'AnandTech & Tom\'s Hardware',
    publishedAt: '2026-05-18',
    readingTime: '4 MIN READ',
    views: 8902,
    featured: false,
    content: [
      'Nvidia has finalized the gaming variations of their Blackwell architecture, bringing server-room intelligence engines down into consumer tactical rigs. The flagship micro-architecture introduces the concept of split-die computing to modern GPUs, optimizing silicon yields while delivering unmatched rendering bandwidth.',
      'Test sheets for the architecture indicate a 1.8x raw rasterization increase, which expands to over 3.5x when path-tracing pipelines are fully engaged. By decoupling global illumination calculations from standard raster nodes, Blackwell maintains clean frame timings even at native 4K resolutions.',
      'Physically, the boards adopt a dual-channel power delivery structure to limit high-frequency resonance and heat spikes. Testing with high-load workloads shows thermal ratings stabilized at a constant 64°C under liquid-cooling modules.'
    ],
    specs: {
      'Silicon Node': 'TSMC 4NP Custom',
      'Transistor Density': '208 Billion',
      'Memory Interface': 'GDD7 Dual-Path',
      'Power Target': '450W Nominal'
    }
  },
  {
    id: '3',
    title: 'ELDEN RING: SHADOW OF THE ERDTREE SETS NEW METRIC FOR DLC CAPACITY',
    category: 'GAMING',
    summary: 'An autopsy of FromSoftware’s level design, exploring how vertically stacked maps replace horizontal spread to create spatial tension.',
    author: 'LORE_STUDIES_UNIT',
    source: 'Eurogamer & Famitsu Review',
    publishedAt: '2026-05-15',
    readingTime: '5 MIN READ',
    views: 22150,
    featured: false,
    content: [
      'FromSoftware has effectively shattered the standard concept of expansion scaling. "Shadow of the Erdtree" is not merely an extension of the existing map; it is a masterclass in hyper-condensed spatial planning. The entire Land of Shadow fits in a tight horizontal grid, yet hosts five times the vertical density of Limgrave.',
      'Through clever architectural overlaps, players can traverse four different vertical tiers—from sub-surface catacombs to suspended sky bridges—without a single loading screen. Dynamic occlusion culling on the engine side handles this complexity by breaking geometry into interlocking octree structures that load instantly.',
      'The Scadutree blessing active balance ensures that endgame statistics are normalized, resetting player power to levels that force strategic mastery. It proves that narrative context can be perfectly reinforced by deliberate mechanical difficulty.'
    ],
    specs: {
      'World Space Size': 'Approx. 40% of Base Map',
      'Vertical Playability': '5 Distinct Layers',
      'Added Enemies': '85 Unique Units',
      'Soundtrack Depth': '2.5 Hours Core Orchestral'
    }
  },
  {
    id: '4',
    title: 'CYBERPUNK 2077 SEQUEL "PROJECT ORION" ENTERS INTEGRATION PHASE',
    category: 'GAMING',
    summary: 'CD PROJEKT RED shifts Boston studio teams to full production mode to build a fully seamless dystopia using custom UE5.5 integration.',
    author: 'SYSTEM_INTEL_REPORTER',
    source: 'IGN News & Developer Diary',
    publishedAt: '2026-05-12',
    readingTime: '5 MIN READ',
    views: 18944,
    featured: false,
    content: [
      'Project Orion, the highly anticipated sequel to Cyberpunk 2077, has officially entered full-scale integration. Our investigation into Boston production nodes reveals that CD PROJEKT RED has transitioned entirely to a co-development model with Epic Games, pushing Unreal Engine 5.5 to its absolute structural boundaries.',
      'The core goal of Orion is to completely remove loading walls, creating a truly continuous multi-tiered urban sprawl. Advanced asset streaming protocols will allow players to seamlessly transition from deep subways to towering aerocraft ports at high speeds without a single drop in rendering consistency.',
      'In addition, the AI interaction engine is being completely rebuilt. Every citizen will operate on a dynamic schedule influenced by local district corporate control levels, active weather currents, and player reputation indicators.'
    ],
    specs: {
      'Engine Framework': 'Epic UE5.5 Custom Code',
      'Target Platform': 'PC / Next-Gen Consoles',
      'Team Allocation': '450+ Active Personnel',
      'Design Scope': 'Dynamic Sub-system Sprawl'
    }
  },
  {
    id: '5',
    title: 'NINTENDO HANDHELD PROTOCOLS: DEVELOPER ACCELERATION CONFIRMED',
    category: 'HARDWARE',
    summary: 'Leaks disclose target specifications for the raw silicon layout of the upcoming hybrid handheld, featuring localized DLSS hardware.',
    author: 'HARDWARE_ANALYST_08',
    source: 'The Verge Insights',
    publishedAt: '2026-05-10',
    readingTime: '4 MIN READ',
    views: 11025,
    featured: false,
    content: [
      'Documentation leaks across primary Southeast Asian assembly corridors have confirmed developer acceleration programs for Nintendo’s next-generation console. The reports highlight custom high-density silicon built on an advanced mobile node, designed to balance extreme thermal constraints with home-dock output power.',
      'Unlike the existing iteration, the new architecture integrates a dedicated tensor module. This enables real-time Deep Learning Super Resolution (DLSS) in docked configuration, taking a sub-1080p mobile rendering output and upscaling it smoothly to native-looking 4K on modern display terminals.',
      'In handheld mode, memory bandwidth operates at dynamic frequencies, scaling down during lighter 2D sequences to prolong battery lifetimes while triggering clock boosts during heavy asset-streaming scenarios.'
    ],
    specs: {
      'SoC Platform': 'Nvidia Custom Tegra Orin-X',
      'Memory Buffers': '12GB LPDDR5X',
      'Upscale Tech': 'DLSS 3.5 Direct Integration',
      'Display Out': 'HDMI 2.1 4K60 Capable'
    }
  },
  {
    id: '6',
    title: 'THE ADVENT OF SPATIAL AUDIO ARCHITECTURE IN COMBAT ENGINES',
    category: 'TECHNOLOGY',
    summary: 'How physical ray-traced sound waves are changing situational awareness and tactical response metrics in competitive esports.',
    author: 'CYBER_SEC_INTEL',
    source: 'Rock Paper Shotgun Academy',
    publishedAt: '2026-05-08',
    readingTime: '3 MIN READ',
    views: 6712,
    featured: false,
    content: [
      'Competitive shooter design is undergoing an auditory shift. Where classic audio relies on static pan percentages, modern engines physicalize or "ray-trace" sound waves through geometric models. If a firearm discharges behind concrete walls, the audio waves bend around columns and reflect off metals dynamically.',
      'This advanced acoustic modeling translates directly to a reduction in player reaction delay from 220ms down to less than 160ms. Athletes are using auditory clues to locate threats through walls with pixel-perfect accuracy before visually confirming targets.',
      'Specialized software matrices like Dolby Atmos API and custom HRTF (Head-Related Transfer Function) calculation models are now standard requirements for esports league standardizations.'
    ],
    specs: {
      'Audio Pipeline': 'Ray-Traced Geometry Acoustic',
      'LFC Support': 'Multi-channel Subwoofer Direct',
      'Spatial Resolution': '720-Degree Spherical Matrix',
      'Processing Cost': '<0.8ms Thread Allocation'
    }
  }
];

export function NewsPage() {
  const [filter, setFilter] = useState<'ALL' | 'GAMING' | 'TECHNOLOGY' | 'HARDWARE' | 'REPORTS'>('ALL');
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [likedArticles, setLikedArticles] = useState<Record<string, boolean>>({});

  const toggleLike = (id: string, e: MouseEvent) => {
    e.stopPropagation();
    setLikedArticles(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredArticles = useMemo(() => {
    return NEWS_DATA.filter(art => {
      const matchesSearch = art.title.toLowerCase().includes(search.toLowerCase()) || 
                            art.summary.toLowerCase().includes(search.toLowerCase()) ||
                            art.author.toLowerCase().includes(search.toLowerCase());
      const matchesFilter = filter === 'ALL' || art.category === filter;
      return matchesSearch && matchesFilter;
    });
  }, [search, filter]);

  const featuredArticle = useMemo(() => {
    return NEWS_DATA.find(art => art.featured && (filter === 'ALL' || art.category === filter)) || filteredArticles[0];
  }, [filter, filteredArticles]);

  const regularArticles = useMemo(() => {
    if (!filteredArticles.length) return [];
    if (featuredArticle) {
      return filteredArticles.filter(art => art.id !== featuredArticle.id);
    }
    return filteredArticles;
  }, [filteredArticles, featuredArticle]);

  const activeArticle = useMemo(() => {
    return NEWS_DATA.find(art => art.id === selectedId);
  }, [selectedId]);

  return (
    <div className="space-y-xl animate-in fade-in duration-700 max-w-7xl mx-auto pb-24 text-on-surface">
      
      {/* Deep-Scan Detail Modal/Side-panel */}
      <AnimatePresence>
        {activeArticle && (
          <div className="fixed inset-0 z-[100] flex items-center justify-end bg-background/80 backdrop-blur-sm p-0 md:p-6">
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 120 }}
              className="w-full md:max-w-3xl h-full bg-background border-l border-outline/10 flex flex-col shadow-2xl relative"
            >
              <div className="sticky top-0 bg-background border-b border-outline/10 p-6 flex justify-between items-center z-10">
                <div className="flex items-center gap-4">
                  <span className="text-[10px] font-mono text-primary border border-primary/20 bg-primary/5 px-3 py-1 font-black uppercase tracking-wider">
                    {activeArticle.category} // INTEL_REPORT
                  </span>
                  <div className="flex items-center gap-2 text-[9px] font-mono text-on-surface/40 uppercase tracking-widest">
                    <Clock className="w-3 h-3" />
                    <span>{activeArticle.readingTime}</span>
                  </div>
                </div>
                
                <button 
                  onClick={() => setSelectedId(null)}
                  className="px-4 py-2 border border-outline/10 hover:border-primary text-on-surface/40 hover:text-primary transition-all text-[10px] font-bold uppercase tracking-widest"
                >
                  Close Scan
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 md:p-12 space-y-12 scrollbar-hide">
                <div className="space-y-6">
                  <div className="flex flex-wrap items-center gap-4 text-[9px] font-mono text-primary font-bold tracking-widest">
                    <span>BY {activeArticle.author}</span>
                    <span>•</span>
                    <span>SOURCE: {activeArticle.source.toUpperCase()}</span>
                    <span>•</span>
                    <span>PUBLISHED: {activeArticle.publishedAt}</span>
                  </div>
                  <h3 className="text-3xl md:text-5xl font-black uppercase tracking-tighter leading-[0.95] text-on-surface">
                    {activeArticle.title}
                  </h3>
                  <p className="text-on-surface/60 font-serif italic text-lg leading-relaxed border-l-2 border-primary/40 pl-6">
                    {activeArticle.summary}
                  </p>
                </div>

                {/* Tactical Specs Box if present */}
                {activeArticle.specs && (
                  <div className="border border-outline/15 bg-on-surface/[0.02] p-6 space-y-4">
                    <div className="flex items-center gap-3 text-[10px] font-bold text-primary uppercase tracking-[0.2em]">
                      <Terminal className="w-4 h-4" />
                      <span>METRIC DATA INDEX</span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-2 font-mono">
                      {Object.entries(activeArticle.specs).map(([key, val]) => (
                        <div key={key} className="space-y-1">
                          <div className="text-[8px] text-on-surface/30 uppercase tracking-wider">{key}</div>
                          <div className="text-xs font-black text-on-surface uppercase tracking-wide">{val}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Core Content */}
                <div className="space-y-8 text-on-surface/70 leading-relaxed font-sans text-sm md:text-base">
                  {activeArticle.content.map((paragraph, index) => (
                    <p key={index} className="first-letter:text-3xl first-letter:font-black first-letter:text-primary first-letter:mr-1">
                      {paragraph}
                    </p>
                  ))}
                </div>

                <div className="border-t border-outline/10 pt-8 flex justify-between items-center text-[10px] uppercase font-mono">
                  <button 
                    onClick={(e) => toggleLike(activeArticle.id, e)} 
                    className="flex items-center gap-2 hover:text-primary transition-colors font-bold tracking-widest"
                  >
                    <ThumbsUp className={`w-4 h-4 ${likedArticles[activeArticle.id] ? 'fill-primary text-primary' : ''}`} />
                    <span>{likedArticles[activeArticle.id] ? 'SAVED TO RIG' : 'SAVE TO RIG'}</span>
                  </button>
                  <span className="text-on-surface/30">READ_STATE: FULL_COMPLETION</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Main Page Header */}
      <div className="border-b border-outline/10 pb-12 flex flex-col md:flex-row justify-between items-end gap-12">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">Intelligence & Log Files</span>
          <h2 className="text-[60px] md:text-[80px] lg:text-[100px] leading-[0.7] font-black uppercase tracking-tighter mt-4 transition-all">Intel<span className="text-primary italic">.</span></h2>
          <p className="text-on-surface/60 font-serif italic text-sm md:text-base mt-6 max-w-sm leading-tight uppercase tracking-widest opacity-40">
            Live news coverage mapping major transformations in video games and high-end consumer technology.
          </p>
        </div>

        {/* Search controls */}
        <div className="relative group w-full md:w-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface/20 group-focus-within:text-primary transition-colors" />
          <input 
            type="text" 
            placeholder="Search Intel Files..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-80 bg-on-surface/[0.02] border border-outline/10 py-4 pl-12 pr-6 text-[10px] font-bold uppercase tracking-widest focus:outline-none focus:border-primary transition-all text-on-surface"
          />
        </div>
      </div>

      {/* Category Toggles */}
      <div className="flex flex-wrap gap-3 border-b border-outline/5 pb-10">
        {(['ALL', 'GAMING', 'TECHNOLOGY', 'HARDWARE', 'REPORTS'] as const).map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-6 py-3 border text-[10px] font-bold uppercase tracking-[0.2em] transition-all
              ${filter === cat 
                ? 'bg-primary text-on-primary border-primary font-black scale-102 shadow-lg shadow-primary/15' 
                : 'border-outline/10 hover:border-on-surface/30 text-on-surface/60 hover:text-on-surface bg-on-surface/[0.01]'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Empty State */}
      {filteredArticles.length === 0 && (
        <div className="py-24 text-center border border-dashed border-outline/10 bg-on-surface/[0.01] space-y-4">
          <Newspaper className="w-12 h-12 text-on-surface/20 mx-auto" />
          <p className="text-[10px] font-mono uppercase tracking-[0.3em] font-bold text-on-surface/40">
            No dynamic intelligence bulletins indexed for search criterion.
          </p>
        </div>
      )}

      {/* Featured Bento Area */}
      {featuredArticle && filteredArticles.length > 0 && (
        <div 
          onClick={() => setSelectedId(featuredArticle.id)}
          className="group cursor-pointer border border-outline/15 bg-on-surface/[0.02] hover:bg-on-surface/[0.04] p-8 md:p-12 transition-all duration-500 relative overflow-hidden"
        >
          {/* Subtle line background layout */}
          <div className="absolute right-0 top-0 bottom-0 w-[40%] bg-gradient-to-l from-primary/5 to-transparent pointer-events-none hidden md:block" />
          
          <div className="max-w-4xl space-y-6 md:space-y-8 relative z-10">
            <div className="flex flex-wrap gap-4 items-center">
              <span className="text-[9px] font-mono bg-primary text-on-primary font-black px-3 py-1 uppercase tracking-widest">
                {featuredArticle.category}
              </span>
              <div className="flex items-center gap-2 text-[9px] font-mono text-on-surface/40 uppercase tracking-widest">
                <Clock className="w-3.5 h-3.5" />
                <span>{featuredArticle.readingTime}</span>
              </div>
              <div className="flex items-center gap-1.5 text-[9px] font-mono text-primary/60 uppercase tracking-widest font-bold bg-primary/5 border border-primary/10 px-2.5 py-0.5 animate-pulse">
                <Flame className="w-3 h-3" />
                <span>Featured Report</span>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-3xl md:text-6xl font-black uppercase tracking-tighter leading-[0.95] group-hover:text-primary transition-colors duration-500">
                {featuredArticle.title}
              </h3>
              <p className="text-on-surface/60 font-serif italic text-base md:text-xl leading-relaxed max-w-3xl">
                {featuredArticle.summary}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-6 border-t border-outline/5 gap-4">
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[9px] font-mono text-on-surface/40 uppercase tracking-widest">
                <span>By {featuredArticle.author}</span>
                <span>•</span>
                <span className="text-primary font-bold">Source: {featuredArticle.source}</span>
                <span>•</span>
                <span>{featuredArticle.publishedAt}</span>
              </div>
              
              <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-primary group-hover:translate-x-2 transition-transform duration-300">
                Initiate Full Deep-Scan 
                <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Grid of Regular Articles */}
      {regularArticles.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-10">
          {regularArticles.map((art) => (
            <div
              key={art.id}
              onClick={() => setSelectedId(art.id)}
              className="group cursor-pointer border border-outline/10 bg-on-surface/[0.01]/70 hover:bg-on-surface/[0.025] p-8 transition-all duration-300 flex flex-col justify-between space-y-12"
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-[8px] font-mono font-black text-primary border border-primary/20 px-2.5 py-0.5 uppercase tracking-widest">
                    {art.category}
                  </span>
                  <div className="flex items-center gap-3 text-[9px] font-mono text-on-surface/30">
                    <Clock className="w-3 h-3" />
                    <span>{art.readingTime}</span>
                  </div>
                </div>

                <div className="space-y-6">
                  <h4 className="text-lg md:text-xl font-black uppercase tracking-tight group-hover:text-primary transition-colors leading-relaxed">
                    {art.title}
                  </h4>
                  <div className="h-px bg-outline/10 w-12" />
                  <p className="text-[13px] text-on-surface/60 leading-relaxed font-serif italic">
                    {art.summary}
                  </p>
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-outline/5">
                <div className="flex items-center gap-3 text-[8px] font-mono text-on-surface/45 uppercase tracking-widest">
                  <span>{art.publishedAt}</span>
                  <span>•</span>
                  <span className="text-primary font-bold">{art.source}</span>
                </div>

                <button 
                  onClick={(e) => toggleLike(art.id, e)}
                  className="p-2 text-on-surface/20 hover:text-primary transition-colors"
                >
                  <ThumbsUp className={`w-3.5 h-3.5 ${likedArticles[art.id] ? 'fill-primary text-primary' : ''}`} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Decorative Status Line */}
      <div className="border-t border-outline/10 pt-10 flex flex-col md:flex-row justify-between items-center gap-4 text-on-surface/30">
        <span className="text-[8px] font-mono uppercase tracking-[0.2em]">INTELLIGENCE REPORT SECTOR COMPLETE</span>
        <div className="flex items-center gap-2">
          <CheckCircle className="w-3.5 h-3.5 text-primary" />
          <span className="text-[8px] font-mono uppercase tracking-[0.2em] text-primary">All channels synchronized</span>
        </div>
      </div>

    </div>
  );
}
