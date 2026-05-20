import { Shield, Lock, ArrowRight, Zap, Gamepad2, Chrome, Apple, AlertCircle, Mail, User } from 'lucide-react';
import { useState, FormEvent, ReactNode } from 'react';
import { motion } from 'motion/react';
import { auth, db, googleProvider, appleProvider, handleFirestoreError, OperationType } from '../lib/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, sendPasswordResetEmail } from 'firebase/auth';
import { doc, getDoc, setDoc, writeBatch, serverTimestamp } from 'firebase/firestore';

import { useNavigate } from 'react-router-dom';

const SteamIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M12 .004c-5.23 0-9.691 3.391-11.233 8.093l4.8 1.986c.38-.301.861-.482 1.385-.482.164 0 .323.018.476.052l2.36-3.407a2.122 2.122 0 0 1 3.037-2.613l1.373-1.996a1.26 1.26 0 0 1-.044-.241c0-.698.566-1.263 1.264-1.263.698 0 1.264.565 1.264 1.263 0 .698-.566 1.264-1.264 1.264a1.26 1.26 0 0 1-.166-.011l-1.996 1.373a2.123 2.123 0 0 1-2.613 3.037l-3.407 2.361c.034.153.053.312.053.475 0 1.242-1.007 2.249-2.25 2.249-.524 0-1.005-.181-1.385-.482L.767 15.908c1.542 4.704 6.004 8.094 11.233 8.094 6.627 0 12-5.373 12-12s-5.373-12-12-12z" />
  </svg>
);

export function LoginPage() {
  const navigate = useNavigate();
  const [isRegistering, setIsRegistering] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [ident, setIdent] = useState(''); // Email or Username
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useState(() => {
    // Only run on mount
    const params = new URLSearchParams(window.location.search);
    const errorParam = params.get('error');
    if (errorParam) {
      setError(decodeURIComponent(errorParam).replace(/_/g, ' '));
    }
  });

  const handleResetPassword = async (e: FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please provide your communication node (email).');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    try {
      const actionCodeSettings = {
        // URL you want to redirect back to. The domain (www.example.com) for this
        // URL must be in the authorized domains list in the Firebase Console.
        url: `${window.location.origin}/reset-password`,
        // This must be true for email link sign-in.
        handleCodeInApp: true,
      };
      await sendPasswordResetEmail(auth, email, actionCodeSettings);
      setResetSent(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (isForgotPassword) return handleResetPassword(e);
    
    setIsLoading(true);
    setError(null);

    try {
      if (isRegistering) {
        const cleanEmail = email.trim().toLowerCase();
        const cleanUsername = username.trim();
        
        if (password.length < 6) {
          throw new Error('Password must be at least 6 characters');
        }
        if (password !== confirmPassword) {
          throw new Error('Passwords do not match');
        }
        if (cleanUsername.length < 3) {
          throw new Error('Username must be at least 3 characters');
        }
        if (!/^[a-zA-Z0-9_]+$/.test(cleanUsername)) {
          throw new Error('Username can only contain letters, numbers, and underscores');
        }

        const usernameRef = doc(db, 'usernames', cleanUsername.toLowerCase());
        const usernameSnap = await getDoc(usernameRef);
        if (usernameSnap.exists()) {
          throw new Error('Username already exists');
        }

        const { user } = await createUserWithEmailAndPassword(auth, cleanEmail, password);
        
        const batch = writeBatch(db);
        batch.set(doc(db, 'users', user.uid), {
          email: user.email,
          username: cleanUsername,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
        batch.set(usernameRef, {
          userId: user.uid
        });
        
        await batch.commit();
      } else {
        if (!ident) throw new Error('Email or username required');
        let loginEmail = ident;
        if (!ident.includes('@')) {
          // Attempt username lookup
          const usernameDoc = await getDoc(doc(db, 'usernames', ident.toLowerCase()));
          if (usernameDoc.exists()) {
            const userId = usernameDoc.data().userId;
            const userDoc = await getDoc(doc(db, 'users', userId));
            if (userDoc.exists()) {
              loginEmail = userDoc.data().email;
            } else {
              throw new Error('User profile data missing');
            }
          } else {
            throw new Error('Username not found');
          }
        }
        await signInWithEmailAndPassword(auth, loginEmail, password);
      }
      navigate('/dashboard');
    } catch (err: any) {
      let displayError = err.message;
      if (err.code === 'auth/operation-not-allowed') {
        displayError = 'Login failed: Email/Password login is not enabled.';
      } else if (err.code === 'auth/invalid-credential') {
        displayError = 'Access Denied: Invalid email or password.';
      } else if (err.code === 'auth/email-already-in-use') {
        displayError = 'An account with this email already exists.';
      } else if (err.code === 'auth/weak-password') {
        displayError = 'Password too weak. Use at least 6 characters.';
      }
      setError(displayError);
      
      // Determine more accurate path for error tracking
      let errorPath = 'auth';
      const user = auth.currentUser;
      if (err.message.includes('Username')) errorPath = 'usernames';
      else if (isRegistering && user) errorPath = `users/${user.uid}`;
      
      handleFirestoreError(err, isRegistering ? OperationType.WRITE : OperationType.GET, errorPath);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (platform: string) => {
    setIsLoading(true);
    setError(null);
    try {
      if (platform === 'Google' || platform === 'Apple') {
        const provider = platform === 'Google' ? googleProvider : appleProvider;
        const { user } = await signInWithPopup(auth, provider);
        // Check if profile exists
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (!userDoc.exists()) {
          const baseUsername = user.displayName?.replace(/\s+/g, '_').toLowerCase() || 'player_' + user.uid.slice(0, 5);
          const usernameRef = doc(db, 'usernames', baseUsername.toLowerCase());
          
          const batch = writeBatch(db);
          batch.set(doc(db, 'users', user.uid), {
            email: user.email,
            username: baseUsername,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
          });
          batch.set(usernameRef, {
            userId: user.uid
          });
          
          await batch.commit();
        }
        navigate('/dashboard');
      } else if (platform === 'Steam') {
        // Steam OpenID login - use high-level redirect to break out of iframes if possible
        const steamUrl = '/api/auth/steam';
        try {
          if (window.top && window.top !== window) {
            // We are in an iframe, try to use top location
            window.top.location.href = steamUrl;
          } else {
            window.location.href = steamUrl;
          }
        } catch (e) {
          // Cross-origin restriction might block access to window.top
          window.location.href = steamUrl;
        }
      } else {
        console.log(`Bridge to ${platform} not yet fully established.`);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center relative overflow-hidden px-6 py-12 text-on-surface">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-5">
        <div className="absolute top-10 left-10 text-[10px] font-mono vertical-text tracking-[1em]">SYSTEM ACTIVE REF 001</div>
        <div className="absolute bottom-10 right-10 text-[10px] font-mono vertical-text tracking-[1em]">SECURE CONNECTION</div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[400px] font-black uppercase tracking-tighter opacity-[0.05] leading-none select-none">
          {isRegistering ? 'JOIN' : 'HELLO'}
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
              {isForgotPassword ? 'Credential Recovery Handshake' : (isRegistering ? 'New Account Registration' : 'Secure Login')}
            </span>
          </div>
          <h1 className="text-[80px] md:text-[120px] font-black uppercase tracking-tighter leading-[0.8] text-center text-on-surface">
            {isForgotPassword ? 'RE/SET' : 'Quest/Gate'}<br/>
            <span className="text-3xl md:text-5xl tracking-widest opacity-40 block mt-4 text-on-surface uppercase">
              {isForgotPassword ? 'Vault Recovery' : 'Terminal 01'}
            </span>
          </h1>
        </div>


        {!isRegistering && !isForgotPassword && (
          <div className="grid grid-cols-3 gap-4 mb-8">
            <SocialButton icon={<Chrome className="w-5 h-5" />} label="Google" onClick={() => handleSocialLogin('Google')} />
            <SocialButton icon={<Apple className="w-5 h-5" />} label="Apple" onClick={() => handleSocialLogin('Apple')} />
            <SocialButton icon={<SteamIcon />} label="Steam" onClick={() => handleSocialLogin('Steam')} />
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
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

          {resetSent ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-primary/10 border border-primary/20 p-8 text-center space-y-6"
            >
               <Shield className="w-12 h-12 text-primary mx-auto opacity-50" />
               <p className="text-sm font-serif italic text-on-surface/80 leading-relaxed">
                 A recovery link has been dispatched to <span className="text-primary font-mono">{email}</span>. Please authorize the handshake via your email provider to reset your access credentials.
               </p>
               <button 
                 type="button"
                 onClick={() => {
                   setIsForgotPassword(false);
                   setResetSent(false);
                   setError(null);
                 }}
                 className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary hover:text-on-surface transition-colors"
               >
                 Return to Login Gate
               </button>
            </motion.div>
          ) : (
            <>
              <div className="relative group">
                <input 
                  required
                  type={isRegistering || isForgotPassword ? "email" : "text"} 
                  placeholder={isRegistering || isForgotPassword ? "EMAIL ADDRESS" : "EMAIL OR USERNAME"}
                  value={isRegistering || isForgotPassword ? email : ident}
                  onChange={(e) => (isRegistering || isForgotPassword) ? setEmail(e.target.value) : setIdent(e.target.value)}
                  className="w-full bg-transparent border border-outline p-6 text-sm font-mono uppercase tracking-widest focus:outline-none focus:border-primary transition-colors placeholder:text-on-surface/40 text-on-surface"
                />

                <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-20 group-focus-within:opacity-100 transition-opacity">
                  <Mail className="w-4 h-4 text-primary" />
                </div>
              </div>

              {!isForgotPassword && (
                <>
                  {isRegistering && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="relative group"
                    >
                      <input 
                        required
                        type="text" 
                        placeholder="USERNAME"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full bg-transparent border border-outline p-6 text-sm font-mono uppercase tracking-widest focus:outline-none focus:border-primary transition-colors placeholder:text-on-surface/40 text-on-surface"
                      />

                      <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-20 group-focus-within:opacity-100 transition-opacity">
                        <User className="w-4 h-4 text-primary rotate-[-90deg]" />
                      </div>
                    </motion.div>
                  )}

                  <div className="relative group">
                    <input 
                      required
                      type="password" 
                      placeholder="PASSWORD"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-transparent border border-outline p-6 text-sm font-mono uppercase tracking-widest focus:outline-none focus:border-primary transition-all placeholder:text-on-surface/40 text-on-surface"
                    />

                    <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-20 group-focus-within:opacity-100 transition-opacity">
                      <Lock className="w-4 h-4 text-primary" />
                    </div>
                  </div>

                  {!isRegistering && (
                    <div className="flex justify-end">
                      <button 
                        type="button"
                        onClick={() => {
                          setIsForgotPassword(true);
                          setError(null);
                          if (ident.includes('@')) setEmail(ident);
                        }}
                        className="text-[9px] font-bold uppercase tracking-widest text-on-surface/30 hover:text-primary transition-colors"
                      >
                        Forgot Access Signal?
                      </button>
                    </div>
                  )}

                  {isRegistering && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="relative group"
                    >
                      <input 
                        required
                        type="password" 
                        placeholder="CONFIRM PASSWORD"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full bg-transparent border border-outline p-6 text-sm font-mono uppercase tracking-widest focus:outline-none focus:border-primary transition-all placeholder:text-on-surface/40 text-on-surface"
                      />

                      <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-20 group-focus-within:opacity-100 transition-opacity">
                        <Shield className="w-4 h-4 text-primary" />
                      </div>
                    </motion.div>
                  )}
                </>
              )}

              <button 
                disabled={isLoading}
                className="w-full py-8 bg-on-surface text-background font-black uppercase tracking-[0.4em] hover:bg-primary hover:text-on-primary transition-all flex items-center justify-center gap-4 group relative overflow-hidden"
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
                    <span>{isForgotPassword ? 'Send Recovery Signal' : (isRegistering ? 'Confirm Registration' : 'Login')}</span>
                    <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform stroke-[3]" />
                  </>
                )}
              </button>
            </>
          )}
        </form>

        <div className="mt-8 flex flex-col items-center gap-4">
          <button 
            onClick={() => {
              if (isForgotPassword) {
                setIsForgotPassword(false);
              } else {
                setIsRegistering(!isRegistering);
              }
              setError(null);
              setResetSent(false);
            }}
            className="text-[10px] font-bold uppercase tracking-[0.3em] text-on-surface/60 hover:text-primary transition-all"
          >
            {isForgotPassword 
              ? 'Back to Login Gate' 
              : (isRegistering ? 'Back to Login' : 'Create New Account')}
          </button>
          
          <button 
            onClick={() => navigate('/admin/login')}
            className="text-[9px] font-mono text-on-surface/20 hover:text-red-500 uppercase tracking-[0.5em] transition-all mt-4 flex items-center gap-2"
          >
            <Shield className="w-3 h-3" />
            <span>Admin Login Portal</span>
          </button>
        </div>

        <div className="mt-12 flex flex-wrap justify-center gap-12 border-t border-outline/20 pt-12">
          <div className="flex flex-col items-center">
            <Shield className="w-5 h-5 text-on-surface/40 mb-2" />
            <span className="text-[9px] font-mono text-on-surface/40 uppercase tracking-widest italic font-serif">Encrypted Link</span>
          </div>
          <div className="flex flex-col items-center">
            <Zap className="w-5 h-5 text-on-surface/40 mb-2" />
            <span className="text-[9px] font-mono text-on-surface/40 uppercase tracking-widest italic font-serif">Fast Auth</span>
          </div>
        </div>
      </motion.div>

      {/* Bottom Footer Decor */}
      <div className="absolute bottom-10 w-full px-12 flex justify-between items-end text-[9px] font-mono text-on-surface/30 uppercase tracking-widest pointer-events-none">
        <div className="flex flex-col">
          <span>Local Node: 45.72 N / 122.41 W</span>
          <span className="mt-1">Handshake: Secure</span>
        </div>
        <span>© 2026 QUESTGATE ARCHIVE.</span>
      </div>

    </div>
  );
}

export function SocialButton({ icon, label, onClick }: { icon: ReactNode, label: string, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className="flex flex-col items-center justify-center p-4 border border-outline/30 hover:border-primary hover:bg-on-surface/5 transition-all gap-2 group"
    >
      <div className="text-on-surface/40 group-hover:text-primary transition-colors">
        {icon}
      </div>
      <span className="text-[8px] font-bold uppercase tracking-widest text-on-surface/20 group-hover:text-on-surface/60">{label}</span>
    </button>
  );
}


