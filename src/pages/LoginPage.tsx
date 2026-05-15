import { Play, Shield, Lock, ArrowRight, Zap, Terminal, Gamepad2, Chrome, Apple } from 'lucide-react';
import { useState, FormEvent, ReactNode } from 'react';
import { motion } from 'motion/react';

interface LoginPageProps {
  onLogin: () => void;
  onAdminAccess: () => void;
}

export function LoginPage({ onLogin, onAdminAccess }: LoginPageProps) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [ident, setIdent] = useState(''); // Email or Username
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate auth delay
    setTimeout(() => {
      setIsLoading(false);
      onLogin();
    }, 1500);
  };

  const handleSocialLogin = (platform: string) => {
    setIsLoading(true);
    console.log(`Initializing handshake with ${platform}...`);
    setTimeout(() => {
      setIsLoading(false);
      onLogin();
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center relative overflow-hidden px-6 py-12">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-5">
        <div className="absolute top-10 left-10 text-[10px] font-mono vertical-text tracking-[1em]">SYSTEM_INTRUSION_DETECTED_REF_00x</div>
        <div className="absolute bottom-10 right-10 text-[10px] font-mono vertical-text tracking-[1em]">HANDSHAKE_PROTOCOL_INITIALIZED</div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[400px] font-black uppercase tracking-tighter opacity-20 leading-none select-none">
          {isRegistering ? 'JOIN' : 'SYNC'}
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-xl z-10"
      >
        <div className="flex flex-col items-center mb-12">
          <div className="flex items-center gap-2 mb-6">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">
              {isRegistering ? 'New Node Registration' : 'Secure Access Node'}
            </span>
          </div>
          <h1 className="text-[80px] md:text-[120px] font-black uppercase tracking-tighter leading-[0.8] text-center">
            Pro<span className="text-primary italic">/</span>Gauge<br/>
            <span className="text-3xl md:text-5xl tracking-widest opacity-40 block mt-4">Terminal 01</span>
          </h1>
        </div>

        {!isRegistering && (
          <div className="grid grid-cols-3 gap-4 mb-8">
            <SocialButton icon={<Chrome className="w-5 h-5" />} label="Google" onClick={() => handleSocialLogin('Google')} />
            <SocialButton icon={<Apple className="w-5 h-5" />} label="Apple" onClick={() => handleSocialLogin('Apple')} />
            <SocialButton icon={<Gamepad2 className="w-5 h-5" />} label="Steam" onClick={() => handleSocialLogin('Steam')} />
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative group">
            <input 
              required
              type="text" 
              placeholder={isRegistering ? "EMAIL_ADDRESS" : "EMAIL_OR_ALIAS"}
              value={isRegistering ? email : ident}
              onChange={(e) => isRegistering ? setEmail(e.target.value) : setIdent(e.target.value)}
              className="w-full bg-transparent border border-white/20 p-6 text-sm font-mono uppercase tracking-widest focus:outline-none focus:border-primary transition-colors placeholder:text-white/40"
            />
            <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-20 group-focus-within:opacity-100 transition-opacity">
              <Terminal className="w-4 h-4 text-primary" />
            </div>
          </div>

          {isRegistering && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="relative group"
            >
              <input 
                required
                type="text" 
                placeholder="USER_ALIAS"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-transparent border border-white/20 p-6 text-sm font-mono uppercase tracking-widest focus:outline-none focus:border-primary transition-colors placeholder:text-white/40"
              />
              <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-20 group-focus-within:opacity-100 transition-opacity">
                <Play className="w-4 h-4 text-primary rotate-[-90deg]" />
              </div>
            </motion.div>
          )}

          <div className="relative group">
            <input 
              required
              type="password" 
              placeholder="ACCESS_CRYPT"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-transparent border border-white/20 p-6 text-sm font-mono uppercase tracking-widest focus:outline-none focus:border-primary transition-colors placeholder:text-white/40"
            />
            <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-20 group-focus-within:opacity-100 transition-opacity">
              <Lock className="w-4 h-4 text-primary" />
            </div>
          </div>

          {isRegistering && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="relative group"
            >
              <input 
                required
                type="password" 
                placeholder="RE_ENTER_CRYPT"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-transparent border border-white/20 p-6 text-sm font-mono uppercase tracking-widest focus:outline-none focus:border-primary transition-colors placeholder:text-white/40"
              />
              <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-20 group-focus-within:opacity-100 transition-opacity">
                <Shield className="w-4 h-4 text-primary" />
              </div>
            </motion.div>
          )}

          <button 
            disabled={isLoading}
            className="w-full py-8 bg-white text-black font-black uppercase tracking-[0.4em] hover:bg-primary transition-all flex items-center justify-center gap-4 group relative overflow-hidden"
          >
            {isLoading ? (
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              >
                <Zap className="w-6 h-6 fill-current" />
              </motion.div>
            ) : (
              <>
                <span>{isRegistering ? 'Confirm Registration' : 'Initialize Node'}</span>
                <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform stroke-[3]" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 flex flex-col items-center gap-4">
          <button 
            onClick={() => setIsRegistering(!isRegistering)}
            className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/60 hover:text-primary transition-colors"
          >
            {isRegistering 
              ? 'Return to Access Hub' 
              : 'Create New Identification Node'}
          </button>
          
          <button 
            onClick={onAdminAccess}
            className="text-[9px] font-mono text-white/20 hover:text-red-500 uppercase tracking-[0.5em] transition-colors mt-4 flex items-center gap-2"
          >
            <Shield className="w-3 h-3" />
            <span>Administrator Portal Access</span>
          </button>
        </div>

        <div className="mt-12 flex flex-wrap justify-center gap-12 border-t border-white/10 pt-12">
          <div className="flex flex-col items-center">
            <Shield className="w-5 h-5 text-white/40 mb-2" />
            <span className="text-[9px] font-mono text-white/40 uppercase tracking-widest italic font-serif">Encrypted Link</span>
          </div>
          <div className="flex flex-col items-center">
            <Zap className="w-5 h-5 text-white/40 mb-2" />
            <span className="text-[9px] font-mono text-white/40 uppercase tracking-widest italic font-serif">Fast Auth</span>
          </div>
        </div>
      </motion.div>

      {/* Bottom Footer Decor */}
      <div className="absolute bottom-10 w-full px-12 flex justify-between items-end text-[9px] font-mono text-white/30 uppercase tracking-widest pointer-events-none">
        <div className="flex flex-col">
          <span>Local Node: 45.72 N / 122.41 W</span>
          <span className="mt-1">Handshake: RSA_4096</span>
        </div>
        <span>© 2026 PRO-GAUGE INTNL.</span>
      </div>
    </div>
  );
}

function SocialButton({ icon, label, onClick }: { icon: ReactNode, label: string, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className="flex flex-col items-center justify-center p-4 border border-white/10 hover:border-primary hover:bg-white/5 transition-all gap-2 group"
    >
      <div className="text-white/40 group-hover:text-primary transition-colors">
        {icon}
      </div>
      <span className="text-[8px] font-bold uppercase tracking-widest text-white/20 group-hover:text-white/60">{label}</span>
    </button>
  );
}

