import React, { useState, FormEvent, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { auth, db, handleFirestoreError, OperationType } from '../lib/firebase';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { User, Shield, Key, Camera, Info, Save, ChevronRight, Binary, Globe, Clock, Activity, Lock, Mail, Monitor, X, Loader2, Gamepad2, Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import axios from 'axios';
import { useTheme, THEMES } from '../ThemeContext';

interface ToggleRowProps {
  label: string;
  enabled: boolean;
  onToggle: () => void;
}

function ToggleRow({ label, enabled, onToggle }: ToggleRowProps) {
  return (
    <div className="flex justify-between items-center py-5 border-b border-outline/5 hover:bg-on-surface/5 px-4 transition-colors group cursor-pointer rounded-sm" onClick={onToggle}>
      <span className={`text-[10px] font-bold uppercase tracking-[0.2em] transition-colors ${enabled ? 'text-on-surface' : 'text-on-surface/30 group-hover:text-on-surface/60'}`}>{label}</span>
      <button 
        type="button"
        className={`w-12 h-6 border transition-all duration-300 flex items-center px-1 ${enabled ? 'bg-primary border-primary' : 'bg-transparent border-outline/20'}`}
      >
        <motion.div 
          animate={{ x: enabled ? 22 : 0 }}
          className={`w-4 h-4 ${enabled ? 'bg-background' : 'bg-on-surface/20'}`}
        />
      </button>
    </div>
  );
}

interface SettingFieldProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  type?: string;
  placeholder?: string;
  icon?: any;
}

function SettingField({ label, value, onChange, type = 'text', placeholder, icon: Icon }: SettingFieldProps) {
  return (
    <div className="space-y-4 group">
      <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface/30 italic group-focus-within:text-primary transition-colors flex items-center gap-2">
        {Icon && <Icon className="w-3 h-3" />}
        {label}
      </label>
      <input 
        type={type}
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent border-b border-outline py-4 text-lg font-black uppercase tracking-tighter text-on-surface placeholder:text-on-surface/5 focus:outline-none focus:border-primary transition-all focus:pl-4"
      />
    </div>
  );
}


interface ProfilePageProps {
  onAvatarUpdate?: (url: string) => void;
  steamId: string | null;
  onSteamSync?: () => void;
}

export function ProfilePage({ onAvatarUpdate, steamId, onSteamSync }: ProfilePageProps) {
  const { theme, setTheme } = useTheme();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [region, setRegion] = useState('Asia');
  const [notifSettings, setNotifSettings] = useState({
    tournamentStarts: true,
    matchInvites: true,
    patchNotes: false,
    rankChange: true,
    weeklySummary: true,
    goalMilestones: false
  });
  const [avatar, setAvatar] = useState('https://lh3.googleusercontent.com/aida-public/AB6AXuBlyoNV8_PVYDDruJJedgEnmdArjXVrU4qn62bh9a-asl-VzcRO0jgggZ-p6IePJ32zC57V2imV19GyNZSwhC02eaGGEZks_ryxvLd4n6O25L_pImGnuDGEXnjQZ5MYh89U_UGDwFEPfwbBIroqzOZaEy6i-5wqe0co3EsreXpsmmlE9-is_91-oGiTqC-K-cLQhNBF8GVenOPqw-nUgDyAo3RapzjH16TyEpWtgQTqq95a3I5Czs9hDbwBWPAVMPUIYjEd6nWwbXs');
  const [steamProfile, setSteamProfile] = useState<any>(null);
  const [isLoadingSteam, setIsLoadingSteam] = useState(false);

  const getPersonaStateLabel = (state: number) => {
    switch (state) {
      case 1: return { label: 'Online', color: 'text-green-400' };
      case 2: return { label: 'Busy', color: 'text-red-400' };
      case 3: return { label: 'Away', color: 'text-yellow-400' };
      case 4: return { label: 'Snooze', color: 'text-blue-400' };
      default: return { label: 'Offline', color: 'text-white/20' };
    }
  };

  const handleUnlinkSteam = async () => {
    const user = auth.currentUser;
    if (!user || !window.confirm('Are you sure you want to unlink your Steam account?')) return;

    try {
      // Remove from Firestore
      await setDoc(doc(db, 'users', user.uid), {
        steamId: null,
        updatedAt: serverTimestamp()
      }, { merge: true });

      // Remove from Supabase
      await supabase
        .from('profiles')
        .update({ steam_id: null, updated_at: new Date().toISOString() })
        .eq('id', user.uid);

      if (onSteamSync) onSteamSync();
    } catch (err) {
      console.error('Failed to unlink Steam:', err);
      alert('Failed to unlink account.');
    }
  };
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showVault, setShowVault] = useState(false);
  const [vaultStep, setVaultStep] = useState<'verify' | 'update'>('verify');
  const [otpCode, setOtpCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorVisible, setErrorVisible] = useState<string | null>(null);
  const [syncSuccessVisible, setSyncSuccessVisible] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if ((location.state as any)?.syncSuccess) {
      setSyncSuccessVisible(true);
      const timer = setTimeout(() => setSyncSuccessVisible(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [location.state]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch Steam profile when id changes
  useEffect(() => {
    const fetchSteamData = async () => {
      if (!steamId) {
        setSteamProfile(null);
        return;
      }

      setIsLoadingSteam(true);
      try {
        const sRes = await fetch(`/api/steam/profile?steamId=${steamId}`);
        if (sRes.ok) {
          const sData = await sRes.json();
          setSteamProfile(sData);
        }
      } catch (sErr) {
        console.error('Steam profile fetch failed:', sErr);
      } finally {
        setIsLoadingSteam(false);
      }
    };

    fetchSteamData();
  }, [steamId]);

  // Load user data
  useEffect(() => {
    const loadProfile = async () => {
      const user = auth.currentUser;
      if (!user) return;

      setEmail(user.email || '');

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.uid)
          .single();

        if (error) {
          if (error.code === 'PGRST116') {
            // No profile found, this is fine
            return;
          }
          if ((error.message?.toLowerCase().includes('profiles') && 
               (error.message?.toLowerCase().includes('schema cache') || error.message?.toLowerCase().includes('does not exist'))) ||
              error.code === '22P02') {
            setErrorVisible('SCHEMA_RECOVERY: TABLE_MISSING');
            return;
          }
          throw error;
        }

          if (data) {
          setUsername(data.username || user.displayName || '');
          setBio(data.bio || '');
          const currentAvatar = data.avatar_url || user.photoURL || avatar;
          setAvatar(currentAvatar);
          if (onAvatarUpdate) onAvatarUpdate(currentAvatar);
        }
      } catch (error) {
        console.error('Failed to load profile from Supabase:', error);
      }

      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          if (!username && userData.username) setUsername(userData.username);
          if (!bio && userData.bio) setBio(userData.bio);
        }
      } catch (error) {
        console.error('Failed to load profile from Firestore:', error);
      }
    };

    loadProfile();
  }, []);

  const handleAvatarClick = () => {
    if (isUploading) return;
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const user = auth.currentUser;
    
    if (!file) return;
    if (!user) {
      setErrorVisible('AUTHENTICATION_REQUIRED');
      return;
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      setErrorVisible('SIGNAL_ERROR: IMAGE_REQUIRED');
      return;
    }

    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setErrorVisible('PAYLOAD_ERROR: FILE_TOO_LARGE');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setErrorVisible(null);

    try {
      const fileExt = (file.name.split('.').pop() || 'png').replace(/[^a-z0-9]/gi, '').toLowerCase();
      // Use the standard folder-based path: {uid}/{timestamp}.{ext}
      // Most Supabase RLS policies for storage depend on the first folder being the user's UID.
      const filePath = `${user.uid}/${Date.now()}.${fileExt}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          upsert: true,
          cacheControl: '3600',
          contentType: file.type
        });

      if (uploadError) {
        console.error('Supabase Storage Error Details:', uploadError);
        // Provide a more helpful message for RLS errors
        if (uploadError.message?.includes('row-level security')) {
          throw new Error('Permission denied. Please ensure your Supabase Storage RLS policies allow authenticated uploads to the "avatars" bucket.');
        }
        if (uploadError.message?.toLowerCase().includes('profiles') && 
            (uploadError.message?.toLowerCase().includes('schema cache') || uploadError.message?.toLowerCase().includes('does not exist') || uploadError.message?.toLowerCase().includes('uuid'))) {
          throw new Error('Database table "profiles" schema mismatch (likely UUID vs TEXT). See setup instructions below.');
        }
        throw uploadError;
      }

      // Get Public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      setAvatar(publicUrl);
      if (onAvatarUpdate) onAvatarUpdate(publicUrl);
      
      // Update profile immediately
      const { error: updateError } = await supabase
        .from('profiles')
        .upsert({
          id: user.uid,
          avatar_url: publicUrl,
          updated_at: new Date().toISOString()
        }, { onConflict: 'id' });

      if (updateError) throw updateError;
      
      setIsUploading(false);
      setUploadProgress(100);
    } catch (error: any) {
      console.error('Supabase Upload Failed:', error);
      setErrorVisible(`UPLINK_FAILURE: ${error.message || 'UNKNOWN_ERROR'}`);
      setIsUploading(false);
    }
  };

  // Password States
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleUpdateProfile = async (e: FormEvent) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user) return;

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.uid,
          username,
          bio,
          updated_at: new Date().toISOString()
        }, { onConflict: 'id' });

      if (error) throw error;

      setIsSaving(false);
      alert('Profile updated successfully');
    } catch (error: any) {
      console.error('Database Sync Failed:', error);
      setErrorVisible(`SYNC_FAILURE: ${error.message || 'UNKNOWN_ERROR'}`);
      setIsSaving(false);
    }
  };

  const handleUpdatePassword = async (e: FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    
    setIsSaving(true);
    // Simulate API call
    await new Promise(r => setTimeout(r, 1500));
    setIsSaving(false);
    
    alert('Password updated successfully');
    setShowVault(false);
    setVaultStep('verify');
    setOtpCode('');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleSendOtp = async () => {
    if (!auth.currentUser?.email) {
      alert('No registered email found for this account.');
      return;
    }
    
    setIsVerifying(true);
    try {
      const response = await axios.post('/api/auth/otp/send', { email: auth.currentUser.email });
      if (response.data.success) {
        if (response.data.debugCode) {
          alert(`SECURE SIGNAL DISPATCHED: In this preview environment, please use the system override code: ${response.data.debugCode}`);
        } else {
          alert(`Verification signal dispatched to ${auth.currentUser.email}. If you don't see it, check your Spam folder. Note: Resend's free tier only delivers to your registered account email.`);
        }
      }
    } catch (error: any) {
      alert(`Signal Dispatch Failure: ${error.response?.data?.error || error.message}`);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser?.email) return;

    setIsVerifying(true);
    try {
      const response = await axios.post('/api/auth/otp/verify', { 
        email: auth.currentUser.email,
        code: otpCode 
      });
      if (response.data.success) {
        setVaultStep('update');
      }
    } catch (error: any) {
      alert(`Invalid access signal: ${error.response?.data?.error || 'Handshake failed.'}`);
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="space-y-xl animate-in fade-in duration-700">
      <AnimatePresence>
        {syncSuccessVisible && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-primary border border-outline p-6 flex items-center justify-between gap-4 shadow-[0_0_50px_rgba(var(--primary-rgb),0.3)]"
          >
            <div className="flex items-center gap-4 text-background">
              <Gamepad2 className="w-5 h-5" />
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-[0.2em]">Synchronicity Optimized</p>
                <p className="text-xs font-bold italic">Steam Account Linked Successfully: {steamProfile?.personaname || steamId}</p>
              </div>
            </div>
            <button onClick={() => setSyncSuccessVisible(false)} className="text-background/40 hover:text-background transition-colors p-2">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>


      {!isSupabaseConfigured && (
        <div className="bg-yellow-500/20 border border-yellow-500/50 p-6 flex items-center gap-4 animate-in slide-in-from-top duration-500">
          <Info className="w-5 h-5 text-yellow-500" />
          <div className="space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-widest text-yellow-500">Setup Required</p>
            <p className="text-xs text-yellow-500/80">Supabase is not configured. Please add <code className="bg-yellow-500/10 px-1">VITE_SUPABASE_URL</code> and <code className="bg-yellow-500/10 px-1">VITE_SUPABASE_ANON_KEY</code> to your secrets.</p>
          </div>
        </div>
      )}

      {errorVisible === 'SCHEMA_RECOVERY: TABLE_MISSING' && (
        <div className="bg-red-500/10 border border-red-500/50 p-8 space-y-6 animate-in slide-in-from-top duration-500">
          <div className="flex items-center gap-4 text-red-500">
            <Binary className="w-6 h-6" />
            <h3 className="text-sm font-black uppercase tracking-[0.2em]">Database Error</h3>
          </div>
          <div className="space-y-4">
            <p className="text-xs text-on-surface/60 leading-relaxed">
              The <code className="text-red-400">profiles</code> table does not exist in your Supabase database. 
              Please run the following SQL in your <span className="text-on-surface">Supabase SQL Editor</span> to initialize the schema:
            </p>
            <pre className="bg-surface p-6 text-[10px] font-mono text-primary/80 overflow-x-auto border border-outline">
{`-- Create profiles table
drop table if exists public.profiles;

create table public.profiles (
  id text primary key, -- Supports Firebase UIDs
  username text,
  avatar_url text,
  bio text,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Enable RLS
alter table public.profiles enable row level security;

-- Policies for public profile access
create policy "Public profiles are viewable by everyone." on profiles for select using (true);
create policy "Anyone can insert/update profile." on profiles for insert with check (true);
create policy "Anyone can update profile." on profiles for update using (true);`}
            </pre>
          </div>
        </div>
      )}

      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 border-b border-outline pb-12">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <User className="w-5 h-5 text-primary" />
            <span className="text-xs font-mono text-primary tracking-[0.5em] uppercase">User Settings</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none italic text-on-surface">
            Profile <span className="text-primary italic">Info</span>
          </h1>
        </div>

        <div className="flex gap-12">
          <div className="flex flex-col">
            <span className="text-[8px] font-mono text-on-surface/20 uppercase tracking-widest leading-none mb-2">Status</span>
            <span className="text-xl font-bold tracking-tighter text-primary italic">ONLINE</span>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-px bg-outline/10 border border-outline">
        {/* Left Column: Avatar & Quick Actions */}
        <section className="lg:col-span-4 bg-background p-12 space-y-12 border-b lg:border-b-0 lg:border-r border-outline">
           <div className="space-y-8">
              <div className="relative group mx-auto w-48 h-48 lg:w-full lg:h-64">
                 <input 
                   type="file" 
                   ref={fileInputRef} 
                   onChange={handleFileChange} 
                   className="hidden" 
                   accept="image/*"
                 />
                 <div className="absolute inset-0 border border-primary/20 scale-105 opacity-0 group-hover:opacity-100 transition-all duration-500" />
                 <img 
                   src={avatar} 
                   alt="Profile" 
                   className={`w-full h-full object-cover transition-all duration-700 ${isUploading ? 'opacity-20 grayscale-0' : 'grayscale brightness-75 group-hover:grayscale-0 group-hover:brightness-100'}`}
                 />
                 <div 
                   onClick={handleAvatarClick}
                   className={`absolute inset-0 bg-background/40 flex items-center justify-center cursor-pointer transition-opacity ${isUploading ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                 >
                    <div className="flex flex-col items-center gap-2">
                       {isUploading ? (
                         <>
                           <Loader2 className="w-8 h-8 text-primary animate-spin" />
                           <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">{uploadProgress}%</span>
                         </>
                       ) : (
                         <>
                           <Camera className="w-8 h-8 text-on-surface" />
                           <span className="text-[10px] font-black uppercase tracking-[0.3em] text-on-surface">Update Photo</span>
                         </>
                       )}
                    </div>
                 </div>
                 {isUploading && (
                   <div className="absolute bottom-0 left-0 right-0 h-1 bg-on-surface/10 overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${uploadProgress}%` }}
                        className="h-full bg-primary"
                      />
                   </div>
                 )}
                 {errorVisible && !isUploading && (
                   <div className="absolute top-0 left-0 right-0 bg-red-500/80 p-2 text-[8px] font-black uppercase tracking-tighter text-center text-white">
                     {errorVisible}
                   </div>
                 )}
              </div>
              
              <div className="space-y-2 text-center lg:text-left">
                 <div className="flex items-center justify-center lg:justify-start gap-3">
                   <h2 className="text-3xl font-black uppercase tracking-tighter italic text-on-surface">{username}</h2>
                   {steamId && (
                     <div className="px-2 py-0.5 bg-primary/20 border border-primary/30 rounded-sm">
                       <span className="text-[8px] font-black text-primary uppercase tracking-widest italic">Steam Linked</span>
                     </div>
                   )}
                 </div>
                 {steamId && steamProfile?.personaname && (
                   <div className="text-[10px] font-bold text-on-surface/40 uppercase tracking-widest mt-1 flex items-center gap-2 justify-center lg:justify-start">
                     <Gamepad2 className="w-2.5 h-2.5 text-primary" />
                     <span>{steamProfile.personaname}</span>
                   </div>
                 )}
                 <p className="text-[10px] font-mono text-on-surface/30 uppercase tracking-[0.2em]">User ID: #3773</p>
              </div>
           </div>

           <div className="space-y-6 pt-12 border-t border-outline/5">
              <div className="p-6 bg-on-surface/[0.02] border border-outline/5 space-y-4">
                  <div className="flex items-center gap-2">
                    <Gamepad2 className="w-3 h-3 text-primary" />
                    <span className="text-[8px] font-black uppercase tracking-widest text-on-surface/40 italic">Steam Synchronicity</span>
                  </div>
                  {steamId ? (
                    <div className="space-y-4">
                      {isLoadingSteam ? (
                        <div className="flex items-center gap-4 p-4 bg-on-surface/5 border border-outline/5 animate-pulse">
                          <div className="w-10 h-10 bg-on-surface/10" />
                          <div className="space-y-2 flex-1">
                            <div className="h-2 bg-on-surface/10 w-1/2" />
                            <div className="h-2 bg-on-surface/10 w-1/3" />
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-4 p-4 bg-on-surface/5 border border-outline/5 relative group/steam">
                          {steamProfile?.avatarfull && (
                            <img src={steamProfile.avatarfull} alt="Steam Avatar" className="w-10 h-10 border border-outline/10" />
                          )}
                          <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-black uppercase text-on-surface tracking-widest leading-none">
                                {steamProfile?.personaname || 'Connected User'}
                              </span>
                              {steamProfile?.personastate !== undefined && (
                                <div className={`w-1 h-1 rounded-full ${getPersonaStateLabel(steamProfile.personastate).color.replace('text-', 'bg-')}`} />
                              )}
                            </div>
                            <span className="text-[8px] font-mono text-on-surface/20 uppercase tracking-widest mt-1">
                              {steamProfile?.personastate !== undefined ? getPersonaStateLabel(steamProfile.personastate).label : 'Secure Link'}
                            </span>
                          </div>
                          
                          <button 
                            onClick={handleUnlinkSteam}
                            className="absolute top-2 right-2 p-1 text-on-surface/10 hover:text-red-500 opacity-0 group-hover/steam:opacity-100 transition-all font-black"
                            title="Unlink Account"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                      
                      <div className="flex justify-between items-center px-1">
                        <div className="flex flex-col">
                          <span className="text-[10px] font-bold text-primary italic uppercase tracking-widest">ID: {steamId.slice(0, 4)}...{steamId.slice(-4)}</span>
                        </div>
                        <button 
                          type="button"
                          onClick={() => window.location.href = '/api/auth/steam'}
                          className="text-[8px] font-bold text-on-surface/40 hover:text-on-surface uppercase tracking-widest underline underline-offset-4 font-black"
                        >
                          Refresh
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button 
                      type="button"
                      onClick={() => window.location.href = '/api/auth/steam'}
                      className="w-full py-4 bg-primary text-background font-black uppercase tracking-widest text-[9px] hover:bg-on-surface transition-all flex items-center justify-center gap-2"
                    >
                      <Gamepad2 className="w-3 h-3" />
                      LINK STEAM ACCOUNT
                    </button>
                  )}
              </div>

              <button 
                onClick={() => setShowVault(true)}
                className="w-full py-5 border border-outline text-on-surface/40 font-black uppercase tracking-[0.4em] text-[10px] hover:border-primary hover:text-primary transition-all flex items-center justify-center gap-3 group"
              >
                 <Lock className="w-4 h-4" />
                 <span>Change Password</span>
                 <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </button>
              
              <div className="p-6 bg-on-surface/[0.02] border border-outline/5 space-y-4">
                 <div className="flex items-center gap-2">
                    <Activity className="w-3 h-3 text-primary" />
                    <span className="text-[8px] font-black uppercase tracking-widest text-on-surface/40 italic">Account Activity</span>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                       <span className="text-[10px] font-bold text-on-surface">128H</span>
                       <p className="text-[8px] font-mono text-on-surface/20 uppercase">Total Time</p>
                    </div>
                    <div className="space-y-1">
                       <span className="text-[10px] font-bold text-on-surface">42</span>
                       <p className="text-[8px] font-mono text-on-surface/20 uppercase">Connected Devices</p>
                    </div>
                 </div>
              </div>
           </div>
        </section>

        {/* Right Column: Profile Form */}
        <form onSubmit={handleUpdateProfile} className="lg:col-span-8 bg-on-surface/2 p-12 lg:p-16 space-y-16">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
              <SettingField 
                label="Username"
                value={username}
                onChange={setUsername}
                icon={User}
                placeholder="Enter Username"
              />
              <SettingField 
                label="Email Address"
                value={email}
                onChange={setEmail}
                icon={Mail}
                type="email"
                placeholder="email@example.com"
              />
           </div>

           <div className="space-y-4 group">
              <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface/30 italic group-focus-within:text-primary transition-colors flex items-center gap-2">
                <Binary className="w-3 h-3" />
                Biography
              </label>
              <textarea 
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full bg-transparent border-b border-outline py-4 text-sm font-mono text-on-surface/80 placeholder:text-on-surface/5 focus:outline-none focus:border-primary transition-all min-h-[100px] resize-none"
              />
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-16 pt-8 border-t border-outline/5">
              <div className="space-y-6">
                 <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface/30 italic flex items-center gap-2">
                    <Globe className="w-3 h-3" />
                    Region
                 </label>
                 <select 
                   value={region}
                   onChange={(e) => setRegion(e.target.value)}
                   className="w-full bg-transparent border-b border-outline py-4 text-sm font-mono text-on-surface/80 appearance-none focus:outline-none focus:border-primary transition-colors cursor-pointer"
                 >
                    <option value="Asia" className="bg-surface text-on-surface">Asia</option>
                    <option value="North America" className="bg-surface text-on-surface">North America</option>
                    <option value="Europe" className="bg-surface text-on-surface">Europe</option>
                 </select>
              </div>

              <div className="space-y-6">
                 <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface/30 italic flex items-center gap-2">
                    <Monitor className="w-3 h-3" />
                    Appearance / Aesthetics
                 </label>
                 <div className="grid grid-cols-2 gap-4">
                    {THEMES.map((t) => (
                      <button 
                        key={t.id}
                        type="button" 
                        onClick={() => setTheme(t.id)}
                        className={`py-4 border text-[9px] font-black uppercase tracking-widest transition-all text-center flex items-center justify-center gap-2
                          ${theme === t.id 
                            ? 'bg-on-surface text-background border-on-surface' 
                            : 'border-outline text-on-surface/40 hover:border-on-surface hover:text-on-surface'
                          }`}
                      >
                         <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: t.id === 'dark' ? 'var(--primary)' : t.color }} />
                         {t.label}
                      </button>
                    ))}
                 </div>
              </div>
           </div>

           <div className="pt-16 border-t border-outline/5 space-y-12">
              <div className="flex items-center gap-4">
                 <Bell className="w-4 h-4 text-primary" />
                 <h3 className="text-sm font-black uppercase tracking-[0.2em] text-on-surface">Signal Preferences</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-outline/10 border border-outline/10">
                <div className="bg-background/20 p-6 space-y-2">
                   <ToggleRow 
                     label="Tournament Starts" 
                     enabled={notifSettings.tournamentStarts} 
                     onToggle={() => setNotifSettings(prev => ({ ...prev, tournamentStarts: !prev.tournamentStarts }))} 
                   />
                   <ToggleRow 
                     label="Match Invites" 
                     enabled={notifSettings.matchInvites} 
                     onToggle={() => setNotifSettings(prev => ({ ...prev, matchInvites: !prev.matchInvites }))} 
                   />
                </div>
                <div className="bg-background/20 p-6 space-y-2 lg:border-l border-outline/10">
                   <ToggleRow 
                     label="Rank Changes" 
                     enabled={notifSettings.rankChange} 
                     onToggle={() => setNotifSettings(prev => ({ ...prev, rankChange: !prev.rankChange }))} 
                   />
                   <ToggleRow 
                     label="Weekly Summary" 
                     enabled={notifSettings.weeklySummary} 
                     onToggle={() => setNotifSettings(prev => ({ ...prev, weeklySummary: !prev.weeklySummary }))} 
                   />
                </div>
              </div>
           </div>

           <div className="pt-12 flex justify-end">
              <button 
                type="submit"
                disabled={isSaving}
                className={`px-12 py-6 bg-primary text-background font-black uppercase tracking-[0.5em] text-xs hover:bg-on-surface hover:text-background transition-all shadow-xl shadow-primary/20 flex items-center gap-4 ${isSaving ? 'opacity-50 cursor-wait' : ''}`}
              >
                 {isSaving ? (
                    <>
                      <Activity className="w-4 h-4 animate-pulse" />
                      <span>Syncing...</span>
                    </>
                 ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Save Changes</span>
                    </>
                 )}
              </button>
           </div>
        </form>
      </div>


      {/* Vault Overlay (Password Change) */}
      <AnimatePresence>
        {showVault && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-xl flex items-center justify-center p-8"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="w-full max-w-xl bg-surface border border-outline overflow-hidden"
            >
              <div className="p-8 border-b border-outline flex justify-between items-center bg-on-surface/[0.02]">
                 <div className="flex items-center gap-4 text-primary">
                    <Shield className="w-5 h-5" />
                    <h3 className="text-[10px] font-bold uppercase tracking-[0.3em]">
                      {vaultStep === 'verify' ? 'Security Handshake' : 'Credential Vault'}
                    </h3>
                 </div>
                 <button onClick={() => { setShowVault(false); setVaultStep('verify'); setOtpCode(''); }} className="text-on-surface/20 hover:text-on-surface transition-colors">
                    <X className="w-5 h-5" />
                 </button>
              </div>

              {vaultStep === 'verify' ? (
                <form onSubmit={handleVerifyOtp} className="p-12 space-y-12">
                   <div className="space-y-6">
                      <p className="text-xs text-on-surface/60 font-serif italic leading-relaxed">
                        To access the credential vault, you must verify your identity. We've dispatched a 6-digit verification code to your registered email.
                      </p>
                      
                      <div className="space-y-4">
                         <div className="flex justify-between items-center">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface/30 italic">Handshake Signal</label>
                         </div>
                         <input 
                            required
                            maxLength={6}
                            value={otpCode}
                            onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                            placeholder="000000"
                            className="w-full bg-transparent border-b border-outline py-4 text-4xl font-mono text-primary tracking-[0.5em] focus:outline-none focus:border-primary transition-colors text-center"
                         />
                      </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                      <button 
                        type="button"
                        onClick={handleSendOtp}
                        disabled={isVerifying}
                        className="py-5 border border-outline text-on-surface/40 font-black uppercase tracking-[0.4em] text-[10px] hover:text-on-surface hover:border-on-surface transition-all flex items-center justify-center gap-2"
                      >
                         {isVerifying ? 'Sending...' : 'Resend Code'}
                      </button>
                      <button 
                        type="submit"
                        disabled={isVerifying || otpCode.length !== 6}
                        className="py-5 bg-primary text-background font-black uppercase tracking-[0.4em] text-[10px] hover:bg-on-surface hover:text-background transition-all disabled:opacity-50"
                      >
                         {isVerifying ? 'Verifying...' : 'Authenticate'}
                      </button>
                   </div>
                </form>
              ) : (
                <form onSubmit={handleUpdatePassword} className="p-12 space-y-12">
                   <div className="space-y-10">
                      <SettingField 
                        label="Current Password"
                        type="password"
                        value={currentPassword}
                        onChange={setCurrentPassword}
                        icon={Lock}
                        placeholder="********"
                      />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <SettingField 
                          label="New Password"
                          type="password"
                          value={newPassword}
                          onChange={setNewPassword}
                          icon={Key}
                          placeholder="********"
                        />
                        <SettingField 
                          label="Verify Password"
                          type="password"
                          value={confirmPassword}
                          onChange={setConfirmPassword}
                          icon={Shield}
                          placeholder="********"
                        />
                      </div>
                   </div>

                   <div className="grid grid-cols-2 gap-6 pt-12">
                      <button 
                        type="button"
                        onClick={() => { setShowVault(false); setVaultStep('verify'); setOtpCode(''); }}
                        className="py-5 border border-outline text-on-surface/40 font-black uppercase tracking-[0.4em] text-[10px] hover:text-on-surface hover:border-on-surface transition-all"
                      >
                         Cancel
                      </button>
                      <button 
                        type="submit"
                        disabled={isSaving}
                        className="py-5 bg-on-surface text-background font-black uppercase tracking-[0.4em] text-[10px] hover:bg-primary hover:text-background transition-all"
                      >
                         {isSaving ? 'Updating...' : 'Update Password'}
                      </button>
                   </div>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="pt-20 border-t border-outline/5 flex flex-col items-center gap-6">
         <div className="flex items-center gap-4 text-[10px] font-mono text-on-surface/20 uppercase tracking-[0.2em]">
            <span>System Status: Online</span>
            <div className="w-[1px] h-4 bg-on-surface/10" />
            <span>Verified</span>
            <div className="w-[1px] h-4 bg-on-surface/10" />
            <span>Secure Connection</span>
         </div>
      </footer>

    </div>
  );
}
