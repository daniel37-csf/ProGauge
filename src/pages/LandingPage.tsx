import { motion } from 'motion/react';
import { ArrowRight, Shield, Zap, Terminal, Activity, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-on-surface selection:bg-primary selection:text-on-primary overflow-x-hidden">
      {/* Cinematic Navigation */}
      <nav className="fixed top-0 w-full z-50 px-6 py-8 md:px-12 flex justify-between items-center border-b border-outline/5 bg-background/50 backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-primary" />
          <span className="font-black uppercase tracking-[0.3em] text-sm italic">QuestGate</span>
        </div>
        <div className="flex items-center gap-8 md:gap-12">
          <button 
            onClick={() => navigate('/login')}
            className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface/60 hover:text-primary transition-colors"
          >
            Login
          </button>
          <button 
            onClick={() => navigate('/login')}
            className="px-6 py-2 border border-outline/20 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-on-surface hover:text-background transition-all"
          >
            Sign Up
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-24 px-6 overflow-hidden">
        {/* Background Grid & Elements */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:40px_40px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] border border-outline/20 rounded-full animate-pulse" />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative z-10 text-center"
        >
          <div className="flex items-center justify-center gap-4 mb-8">
            <span className="h-px w-8 md:w-12 bg-primary/40" />
            <span className="text-[10px] font-mono uppercase tracking-[0.5em] text-primary">Live Updates Available</span>
            <span className="h-px w-8 md:w-12 bg-primary/40" />
          </div>

          <h1 className="text-[70px] sm:text-[100px] md:text-[160px] lg:text-[200px] font-black uppercase tracking-tighter leading-[0.75] mb-8 text-on-surface">
            Player<br/>
            Terminal<span className="text-primary italic">.</span><br/>
            Beta
          </h1>

          <p className="max-w-xl mx-auto text-sm md:text-base text-on-surface/40 font-mono tracking-widest uppercase mb-12 px-4 italic">
            Command Center for tracking gaming progress, event reminders, and real-time Steam synchronization.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <button 
              onClick={() => navigate('/login')}
              className="w-full sm:w-auto px-12 py-5 bg-primary text-on-primary font-black uppercase tracking-[0.3em] text-xs hover:bg-on-surface hover:text-background transition-all flex items-center justify-center gap-4 group"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button 
              className="w-full sm:w-auto px-12 py-5 border border-outline/20 text-on-surface font-black uppercase tracking-[0.3em] text-xs hover:bg-on-surface/10 transition-all"
            >
              Learn More
            </button>
          </div>
        </motion.div>

        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 opacity-20"
        >
          <ChevronDown className="w-8 h-8 text-on-surface" />
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="py-32 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <FeatureCard 
            icon={<Shield className="w-8 h-8 text-primary" />}
            title="Secure Storage"
            desc="Advanced encryption and multi-factor authentication protocols to keep your profile and data protected."
          />
          <FeatureCard 
            icon={<Activity className="w-8 h-8 text-primary" />}
            title="Real-time Sync"
            desc="Optimized connections ensuring your data is synchronized instantly across all your devices."
          />
          <FeatureCard 
            icon={<Zap className="w-8 h-8 text-primary" />}
            title="Cloud Powered"
            desc="Distributed computing capabilities allowing for complex data management without hardware limitations."
          />
        </div>
      </section>

      {/* Technical Banner */}
      <section className="border-y border-outline/5 py-12 bg-on-surface/[0.02] flex items-center justify-center overflow-hidden whitespace-nowrap">
        <div className="flex gap-24 animate-carousel">
          <TechItem label="STATUS" value="SECURE" />
          <TechItem label="UPTIME" value="99.9%" />
          <TechItem label="SECURITY" value="ENCRYPTED" />
          <TechItem label="REGION" value="GLOBAL" />
          <TechItem label="SPEED" value="FAST" />
          {/* Duplicate for seamless scroll */}
          <TechItem label="STATUS" value="SECURE" />
          <TechItem label="UPTIME" value="99.9%" />
          <TechItem label="SECURITY" value="ENCRYPTED" />
          <TechItem label="REGION" value="GLOBAL" />
          <TechItem label="SPEED" value="FAST" />
        </div>
      </section>

      {/* Footer */}
      <footer className="py-24 px-6 md:px-12 border-t border-outline/5 mt-32">
        <div className="flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 bg-primary" />
              <span className="font-black uppercase tracking-[0.3em] text-sm italic">QuestGate</span>
            </div>
            <p className="text-[10px] font-mono text-on-surface/20 uppercase tracking-widest text-center md:text-left">
              Advanced Player Intelligence & Progress Tracking.<br/>
              Developed for high-fidelity gaming.
            </p>
          </div>
          <div className="flex gap-12 text-[10px] font-bold uppercase tracking-widest text-on-surface/40">
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-primary transition-colors">Support</a>
          </div>
        </div>
        <div className="mt-24 text-center text-[8px] font-mono text-on-surface/10 uppercase tracking-[1em]">
          © 2026 QUESTGATE GLOBAL ARCHIVE
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: any, title: string, desc: string }) {
  return (
    <div className="p-12 border border-outline/5 bg-on-surface/[0.01] hover:bg-on-surface/[0.03] transition-all group">
      <div className="mb-8 group-hover:scale-110 transition-transform">{icon}</div>
      <h3 className="text-xl font-black uppercase tracking-widest mb-4 italic">{title}</h3>
      <p className="text-sm text-on-surface/40 font-mono tracking-wider leading-relaxed">{desc}</p>
    </div>
  );
}

function TechItem({ label, value }: { label: string, value: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-[8px] font-mono text-on-surface/20 uppercase tracking-widest mb-1">{label}</span>
      <span className="text-xs font-bold font-mono text-on-surface/80">{value}</span>
    </div>
  );
}

