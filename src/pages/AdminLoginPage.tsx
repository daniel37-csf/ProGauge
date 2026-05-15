import { Shield, Lock, ArrowRight, Zap, Terminal, AlertTriangle } from 'lucide-react';
import { useState, FormEvent } from 'react';
import { motion } from 'motion/react';

interface AdminLoginPageProps {
  onLogin: () => void;
  onBack: () => void;
}

export function AdminLoginPage({ onLogin, onBack }: AdminLoginPageProps) {
  const [adminToken, setAdminToken] = useState('');
  const [accessKey, setAccessKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLogin();
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center relative overflow-hidden px-6">
      {/* Intense Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-red-500/20 animate-[pulse_2s_infinite]" />
        <div className="absolute bottom-0 left-0 w-full h-1 bg-red-500/20 animate-[pulse_2s_infinite_1s]" />
        
        <div className="absolute inset-0 opacity-10">
          {Array.from({ length: 20 }).map((_, i) => (
            <div 
              key={i}
              className="text-[8px] font-mono whitespace-nowrap overflow-hidden"
              style={{ 
                animation: `scroll-x ${10 + i}s linear infinite`,
                opacity: 0.1 + (i % 5) * 0.1
              }}
            >
              {Array.from({ length: 50 }).map(() => 'ADMIN_OVERRIDE_REQUIRED ').join('')}
            </div>
          ))}
        </div>

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[300px] font-black uppercase tracking-tighter opacity-5 leading-none select-none border-red-500 border-4 px-20">
          ROOT
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg z-10 p-12 border-2 border-red-500/30 bg-black shadow-[0_0_100px_rgba(239,68,68,0.1)]"
      >
        <div className="flex flex-col items-center mb-12">
          <div className="w-16 h-16 bg-red-500/10 border border-red-500/40 flex items-center justify-center mb-6">
            <Shield className="w-8 h-8 text-red-500" />
          </div>
          <h1 className="text-4xl font-black uppercase tracking-widest text-center">
            Restrict<span className="text-red-500">e</span>d Zone
          </h1>
          <p className="mt-4 text-[10px] font-mono text-red-500/50 uppercase tracking-[0.4em]">Level 04 Auth Required</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="relative group">
            <div className="absolute -top-3 left-6 px-2 bg-black text-[9px] font-mono text-red-500/60 uppercase tracking-widest z-20">Admin_Terminal_ID</div>
            <input 
              required
              type="text" 
              placeholder="XXXX-XXXX-XXXX"
              value={adminToken}
              onChange={(e) => setAdminToken(e.target.value)}
              className="w-full bg-transparent border border-red-500/20 p-6 text-sm font-mono uppercase tracking-widest focus:outline-none focus:border-red-500 transition-colors placeholder:text-red-500/10"
            />
            <Terminal className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-red-500/20 group-focus-within:text-red-500 transition-colors" />
          </div>

          <div className="relative group">
            <div className="absolute -top-3 left-6 px-2 bg-black text-[9px] font-mono text-red-500/60 uppercase tracking-widest z-20">Master_Crypt_Key</div>
            <input 
              required
              type="password" 
              placeholder="••••••••••••"
              value={accessKey}
              onChange={(e) => setAccessKey(e.target.value)}
              className="w-full bg-transparent border border-red-500/20 p-6 text-sm font-mono uppercase tracking-widest focus:outline-none focus:border-red-500 transition-colors placeholder:text-red-500/10"
            />
            <Lock className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-red-500/20 group-focus-within:text-red-500 transition-colors" />
          </div>

          <button 
            disabled={isLoading}
            className="w-full py-8 bg-red-500 text-white font-black uppercase tracking-[0.5em] hover:bg-red-600 transition-all flex items-center justify-center gap-4 group relative overflow-hidden"
          >
            {isLoading ? (
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                <Zap className="w-6 h-6 fill-current" />
              </motion.div>
            ) : (
              <>
                <AlertTriangle className="w-5 h-5" />
                <span>Override Core</span>
                <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform stroke-[3]" />
              </>
            )}
          </button>
        </form>

        <button 
          onClick={onBack}
          className="mt-8 w-full py-4 text-[10px] font-bold uppercase tracking-[0.3em] text-white/20 hover:text-white transition-colors flex items-center justify-center gap-2"
        >
          <ArrowRight className="w-4 h-4 rotate-180" />
          <span>Abort Admin Protocol</span>
        </button>
      </motion.div>
      
      <div className="mt-12 text-[9px] font-mono text-red-500/20 uppercase tracking-[0.5em] text-center max-w-sm">
        WARNING: UNOTHORIZED ACCESS TO THE CORE DIRECTIVE AT THIS LEVEL IS A VIOLATION OF PROTOCOL 42-A. TRACING IS ACTIVE.
      </div>
    </div>
  );
}
