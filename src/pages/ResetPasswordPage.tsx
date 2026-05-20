import { useState, useEffect, FormEvent } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { auth } from '../lib/firebase';
import { verifyPasswordResetCode, confirmPasswordReset } from 'firebase/auth';
import { motion } from 'motion/react';
import { Shield, Lock, Key, ArrowRight, Zap, AlertCircle, CheckCircle2 } from 'lucide-react';

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const oobCode = searchParams.get('oobCode');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!oobCode) {
      setError('Invalid or missing recovery signal. Handshake aborted.');
      setIsVerifying(false);
      return;
    }

    // Verify the reset code exists and is valid
    verifyPasswordResetCode(auth, oobCode)
      .then(() => setIsVerifying(false))
      .catch((err) => {
        setError('The recovery code has expired or has already been used.');
        setIsVerifying(false);
      });
  }, [oobCode]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!oobCode) return;

    if (newPassword !== confirmPassword) {
      setError('Credential mismatch. New password and verification must match.');
      return;
    }

    if (newPassword.length < 6) {
      setError('Security violation: Password must be at least 6 characters.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await confirmPasswordReset(auth, oobCode, newPassword);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isVerifying) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
        >
          <Zap className="w-12 h-12 text-primary" />
        </motion.div>
        <p className="mt-8 text-[10px] font-bold uppercase tracking-[0.4em] text-on-surface/40">Verifying Handshake Signal...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 selection:bg-primary selection:text-background">
      <div className="w-full max-w-[480px]">
        {/* Header */}
        <div className="flex flex-col items-center mb-12">
          <div className="flex items-center gap-2 mb-6">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">
              Credential Vault Handshake
            </span>
          </div>
          <h1 className="text-[80px] md:text-[100px] font-black uppercase tracking-tighter leading-[0.8] text-center text-on-surface">
            NEW<br/>
            <span className="text-primary italic">VAULT</span>
          </h1>
          <p className="mt-4 text-[10px] font-mono uppercase tracking-[0.2em] text-on-surface/40">Secure Key Generation Protocol</p>
        </div>

        <div className="bg-surface border border-outline relative p-1">
          {/* Scancode Lines Decor */}
          <div className="absolute top-0 left-0 w-8 h-[1px] bg-primary/40 -translate-x-full" />
          <div className="absolute bottom-0 right-0 w-8 h-[1px] bg-primary/40 translate-x-full" />
          
          <div className="p-8 md:p-12 space-y-12 bg-background border border-outline/20">
            {success ? (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center space-y-8"
              >
                <div className="flex justify-center">
                  <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-10 h-10 text-primary" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold uppercase tracking-tighter text-on-surface mb-2">Vault Secured</h3>
                  <p className="text-sm font-serif italic text-on-surface/60">Your access credentials have been successfully updated. Redirecting to login terminal...</p>
                </div>
              </motion.div>
            ) : error ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center space-y-8"
              >
                <div className="flex justify-center">
                  <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center">
                    <AlertCircle className="w-10 h-10 text-red-500" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold uppercase tracking-tighter text-on-surface mb-2">Handshake Failed</h3>
                  <p className="text-sm font-serif italic text-on-surface/60">{error}</p>
                </div>
                <button 
                  onClick={() => navigate('/login')}
                  className="w-full py-6 border border-outline text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-on-surface hover:text-background transition-all"
                >
                  Return to Main Terminal
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-10">
                <div className="space-y-8">
                  <div className="relative group">
                    <label className="text-[9px] font-bold uppercase tracking-widest text-on-surface/30 block mb-2">Primary Key</label>
                    <input 
                      required
                      type="password" 
                      placeholder="NEW PASSWORD"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full bg-transparent border-b border-outline p-4 text-sm font-mono uppercase tracking-widest focus:outline-none focus:border-primary transition-colors placeholder:text-on-surface/20 text-on-surface"
                    />
                    <Lock className="absolute right-4 bottom-4 w-3 h-3 text-primary/20 group-focus-within:text-primary transition-colors" />
                  </div>

                  <div className="relative group">
                    <label className="text-[9px] font-bold uppercase tracking-widest text-on-surface/30 block mb-2">Verify Signature</label>
                    <input 
                      required
                      type="password" 
                      placeholder="CONFIRM NEW PASSWORD"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full bg-transparent border-b border-outline p-4 text-sm font-mono uppercase tracking-widest focus:outline-none focus:border-primary transition-colors placeholder:text-on-surface/20 text-on-surface"
                    />
                    <Shield className="absolute right-4 bottom-4 w-3 h-3 text-primary/20 group-focus-within:text-primary transition-colors" />
                  </div>
                </div>

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
                      <span>Secure New Vault</span>
                      <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform stroke-[3]" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Footer Meta */}
        <div className="mt-12 flex justify-between items-center opacity-20">
          <div className="flex items-center gap-4">
            <Key className="w-4 h-4" />
            <span className="text-[8px] font-mono uppercase tracking-[0.4em]">Auth: AES-256 Verified</span>
          </div>
          <span className="text-[8px] font-mono font-bold">NODE: {oobCode?.substring(0, 8)}...</span>
        </div>
      </div>
    </div>
  );
} 
