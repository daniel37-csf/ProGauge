import { Shield, Lock, ArrowRight, Zap, Terminal, AlertTriangle, AlertCircle } from 'lucide-react';
import { useState, FormEvent } from 'react';
import { motion } from 'motion/react';
import { auth, db, handleFirestoreError, OperationType } from '../lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

import { useNavigate } from 'react-router-dom';

export function AdminLoginPage() {
  const navigate = useNavigate();
  const [adminToken, setAdminToken] = useState('');
  const [accessKey, setAccessKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      // For the admin portal, we expect an email (token) and secret key (password)
      const masterEmail = 'drd3773@gmail.com';
      const cleanToken = adminToken.trim().toLowerCase();
      const { user } = await signInWithEmailAndPassword(auth, cleanToken, accessKey);
      
      // Verify admin status
      const adminDoc = await getDoc(doc(db, 'admins', user.uid));
      const userEmail = user.email?.toLowerCase() || '';
      const isMasterEmail = userEmail === masterEmail || cleanToken === masterEmail;
      
      if (!adminDoc.exists() && !isMasterEmail) {
        console.warn(`Admin access denied. Current: ${userEmail}, Token: ${cleanToken}, Expected: ${masterEmail}`);
        await auth.signOut();
        throw new Error('Admin Access Required');
      }
      
      // If we are bootstrapping the admin, we might want to create the doc
      if (!adminDoc.exists() && isMasterEmail) {
        const { setDoc, serverTimestamp } = await import('firebase/firestore');
        try {
          await setDoc(doc(db, 'admins', user.uid), {
            userId: user.uid,
            role: 'root',
            email: userEmail || cleanToken,
            createdAt: serverTimestamp()
          });
        } catch (e: any) {
          console.error("Failed to bootstrap admin doc:", e);
          // If the error was specifically permissions, we should report it
          if (e.code === 'permission-denied') {
             throw e;
          }
        }
      }
      
      navigate('/dashboard', { state: { fromAdminLogin: true } });
    } catch (err: any) {
      let displayError = err.message;
      if (err.code === 'auth/operation-not-allowed') {
        displayError = 'Login failed: Email/Password login is not enabled.';
      } else if (err.code === 'auth/invalid-credential') {
        displayError = 'Access Denied: Invalid Admin ID or Master Password.';
      } else if (err.code === 'auth/user-not-found') {
        displayError = 'Account Not Found: This Admin ID does not exist.';
      } else if (err.code === 'auth/wrong-password') {
        displayError = 'Incorrect Password: Check your master password.';
      }
      setError(displayError);
      handleFirestoreError(err, OperationType.GET, 'admins');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center relative overflow-hidden px-6">
      {/* Intense Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-red-500/20 animate-[pulse_2s_infinite]" />
        <div className="absolute bottom-0 left-0 w-full h-1 bg-red-500/20 animate-[pulse_2s_infinite_1s]" />
        
        <div className="absolute inset-0 opacity-10">
          {Array.from({ length: 20 }).map((_, i) => (
            <div 
              key={i}
              className="text-[8px] font-mono whitespace-nowrap overflow-hidden text-on-surface"
              style={{ 
                animation: `scroll-x ${10 + i}s linear infinite`,
                opacity: 0.1 + (i % 5) * 0.1
              }}
            >
              {Array.from({ length: 50 }).map(() => 'ADMIN ACCESS ONLY ').join('')}
            </div>
          ))}
        </div>

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[300px] font-black uppercase tracking-tighter opacity-5 leading-none select-none border-red-500 border-4 px-20 text-on-surface">
          ADMIN
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg z-10 p-12 border-2 border-red-500/30 bg-surface shadow-[0_0_100px_rgba(239,68,68,0.1)]"
      >
        <div className="flex flex-col items-center mb-12">
          <div className="w-16 h-16 bg-red-500/10 border border-red-500/40 flex items-center justify-center mb-6">
            <Shield className="w-8 h-8 text-red-500" />
          </div>
          <h1 className="text-4xl font-black uppercase tracking-widest text-center text-on-surface">
            Admin Access
          </h1>
          <p className="mt-4 text-[10px] font-mono text-red-500/50 uppercase tracking-[0.4em]">Authorized Access Only</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="bg-red-500/10 border border-red-500/20 p-4 flex items-center gap-3 text-red-500 text-[10px] font-mono uppercase tracking-widest"
            >
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}
          <div className="relative group">
            <div className="absolute -top-3 left-6 px-2 bg-surface text-[9px] font-mono text-red-500/60 uppercase tracking-widest z-20">Admin ID</div>
            <input 
              required
              type="text" 
              placeholder="XXXX-XXXX-XXXX"
              value={adminToken}
              onChange={(e) => setAdminToken(e.target.value)}
              className="w-full bg-transparent border border-red-500/20 p-6 text-sm font-mono uppercase tracking-widest focus:outline-none focus:border-red-500 transition-colors placeholder:text-red-500/10 text-on-surface"
            />
            <Terminal className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-red-500/20 group-focus-within:text-red-500 transition-colors" />
          </div>

          <div className="relative group">
            <div className="absolute -top-3 left-6 px-2 bg-surface text-[9px] font-mono text-red-500/60 uppercase tracking-widest z-20">Master Password</div>
            <input 
              required
              type="password" 
              placeholder="••••••••••••"
              value={accessKey}
              onChange={(e) => setAccessKey(e.target.value)}
              className="w-full bg-transparent border border-red-500/20 p-6 text-sm font-mono uppercase tracking-widest focus:outline-none focus:border-red-500 transition-colors placeholder:text-red-500/10 text-on-surface"
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
                <span>Admin Login</span>
                <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform stroke-[3]" />
              </>
            )}
          </button>
        </form>

        <button 
          onClick={() => navigate('/login')}
          className="mt-8 w-full py-4 text-[10px] font-bold uppercase tracking-[0.3em] text-on-surface/20 hover:text-on-surface transition-colors flex items-center justify-center gap-2"
        >
          <ArrowRight className="w-4 h-4 rotate-180" />
          <span>Back to User Login</span>
        </button>
      </motion.div>

      
      <div className="mt-12 text-[9px] font-mono text-red-500/20 uppercase tracking-[0.5em] text-center max-w-sm">
        WARNING: UNAUTHORIZED ACCESS AT THIS LEVEL IS PROHIBITED. TRACING IS ACTIVE.
      </div>
    </div>
  );
}
