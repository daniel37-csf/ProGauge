import { motion } from 'motion/react';
import { ArrowRight, Shield, Zap, Terminal, Activity, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white selection:bg-primary selection:text-black overflow-x-hidden">
      {/* Cinematic Navigation */}
      <nav className="fixed top-0 w-full z-50 px-6 py-8 md:px-12 flex justify-between items-center border-b border-white/5 bg-black/50 backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-primary" />
          <span className="font-black uppercase tracking-[0.3em] text-sm italic">Pro/Gauge</span>
        </div>
        <div className="flex items-center gap-8 md:gap-12">
          <button 
            onClick={() => navigate('/login')}
            className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/60 hover:text-primary transition-colors"
          >
            Access_Node
          </button>
          <button 
            onClick={() => navigate('/login')}
            className="px-6 py-2 border border-white/20 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all"
          >
            Register_Terminal
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-24 px-6 overflow-hidden">
        {/* Background Grid & Elements */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:40px_40px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] border border-white/20 rounded-full animate-pulse" />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative z-10 text-center"
        >
          <div className="flex items-center justify-center gap-4 mb-8">
            <span className="h-px w-8 md:w-12 bg-primary/40" />
            <span className="text-[10px] font-mono uppercase tracking-[0.5em] text-primary">Global_Sync_Available</span>
            <span className="h-px w-8 md:w-12 bg-primary/40" />
          </div>

          <h1 className="text-[70px] sm:text-[100px] md:text-[160px] lg:text-[220px] font-black uppercase tracking-tighter leading-[0.75] mb-8">
            Node<br/>
            Sync<span className="text-primary italic">.</span><br/>
            C<span className="text-primary">o</span>re
          </h1>

          <p className="max-w-xl mx-auto text-sm md:text-base text-white/40 font-mono tracking-widest uppercase mb-12 px-4 italic">
            The ultimate terminal for real-time node monitoring, cluster management, and high-fidelity encrypted data synchronization.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <button 
              onClick={() => navigate('/login')}
              className="w-full sm:w-auto px-12 py-5 bg-primary text-black font-black uppercase tracking-[0.3em] text-xs hover:bg-white transition-all flex items-center justify-center gap-4 group"
            >
              <span>Initialize_Link</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button 
              className="w-full sm:w-auto px-12 py-5 border border-white/20 text-white font-black uppercase tracking-[0.3em] text-xs hover:bg-white/10 transition-all"
            >
              System_Specs
            </button>
          </div>
        </motion.div>

        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 opacity-20"
        >
          <ChevronDown className="w-8 h-8" />
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="py-32 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <FeatureCard 
            icon={<Shield className="w-8 h-8 text-primary" />}
            title="Ironclad_Security"
            desc="RSA_4096 endpoint encryption and multi-factor biometric handshake protocols across all synced nodes."
          />
          <FeatureCard 
            icon={<Activity className="w-8 h-8 text-primary" />}
            title="Zero_Latency"
            desc="Optimized WebSocket tunnels ensuring sub-millisecond data propagation across the global cluster."
          />
          <FeatureCard 
            icon={<Zap className="w-8 h-8 text-primary" />}
            title="Async_Compute"
            desc="Distributed processing capabilities allowing for complex node management without local overhead."
          />
        </div>
      </section>

      {/* Technical Banner */}
      <section className="border-y border-white/5 py-12 bg-white/[0.02] flex items-center justify-center overflow-hidden whitespace-nowrap">
        <div className="flex gap-24 animate-carousel">
          <TechItem label="PROTOCOL" value="SECURE_SYNC_v4.2" />
          <TechItem label="UPTIME" value="99.9997%" />
          <TechItem label="ENCRYPTION" value="AES_256_GCM" />
          <TechItem label="NODES" value="8,492_ACTIVE" />
          <TechItem label="LATENCY" value="<0.02ms" />
          {/* Duplicate for seamless scroll */}
          <TechItem label="PROTOCOL" value="SECURE_SYNC_v4.2" />
          <TechItem label="UPTIME" value="99.9997%" />
          <TechItem label="ENCRYPTION" value="AES_256_GCM" />
          <TechItem label="NODES" value="8,492_ACTIVE" />
          <TechItem label="LATENCY" value="<0.02ms" />
        </div>
      </section>

      {/* Footer */}
      <footer className="py-24 px-6 md:px-12 border-t border-white/5 mt-32">
        <div className="flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 bg-primary" />
              <span className="font-black uppercase tracking-[0.3em] text-sm italic">Pro/Gauge</span>
            </div>
            <p className="text-[10px] font-mono text-white/20 uppercase tracking-widest text-center md:text-left">
              Advanced Node Synchronization Interface.<br/>
              Developed for high-stakes cluster management.
            </p>
          </div>
          <div className="flex gap-12 text-[10px] font-bold uppercase tracking-widest text-white/40">
            <a href="#" className="hover:text-primary transition-colors">Privacy_Core</a>
            <a href="#" className="hover:text-primary transition-colors">System_Terms</a>
            <a href="#" className="hover:text-primary transition-colors">Contact_Support</a>
          </div>
        </div>
        <div className="mt-24 text-center text-[8px] font-mono text-white/10 uppercase tracking-[1em]">
          © 2026 PRO-GAUGE INTNL GLOBAL SYSTEMS DIVISION
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: any, title: string, desc: string }) {
  return (
    <div className="p-12 border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-all group">
      <div className="mb-8 group-hover:scale-110 transition-transform">{icon}</div>
      <h3 className="text-xl font-black uppercase tracking-widest mb-4 italic">{title}</h3>
      <p className="text-sm text-white/40 font-mono tracking-wider leading-relaxed">{desc}</p>
    </div>
  );
}

function TechItem({ label, value }: { label: string, value: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-[8px] font-mono text-white/20 uppercase tracking-widest mb-1">{label}</span>
      <span className="text-xs font-bold font-mono text-white/80">{value}</span>
    </div>
  );
}
