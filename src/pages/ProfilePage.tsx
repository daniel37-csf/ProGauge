import React, { useState, FormEvent, useRef, useEffect } from 'react';
import { auth, handleFirestoreError, OperationType } from '../lib/firebase';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { User, Shield, Key, Camera, Info, Save, ChevronRight, Binary, Globe, Clock, Activity, Lock, Mail, Monitor, X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

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
      <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 italic group-focus-within:text-primary transition-colors flex items-center gap-2">
        {Icon && <Icon className="w-3 h-3" />}
        {label}
      </label>
      <input 
        type={type}
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent border-b border-white/10 py-4 text-lg font-black uppercase tracking-tighter text-white placeholder:text-white/5 focus:outline-none focus:border-primary transition-all focus:pl-4"
      />
    </div>
  );
}

interface ProfilePageProps {
  onAvatarUpdate?: (url: string) => void;
}

export function ProfilePage({ onAvatarUpdate }: ProfilePageProps) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState('https://lh3.googleusercontent.com/aida-public/AB6AXuBlyoNV8_PVYDDruJJedgEnmdArjXVrU4qn62bh9a-asl-VzcRO0jgggZ-p6IePJ32zC57V2imV19GyNZSwhC02eaGGEZks_ryxvLd4n6O25L_pImGnuDGEXnjQZ5MYh89U_UGDwFEPfwbBIroqzOZaEy6i-5wqe0co3EsreXpsmmlE9-is_91-oGiTqC-K-cLQhNBF8GVenOPqw-nUgDyAo3RapzjH16TyEpWtgQTqq95a3I5Czs9hDbwBWPAVMPUIYjEd6nWwbXs');
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showVault, setShowVault] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorVisible, setErrorVisible] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleUpdatePassword = (e: FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    // Simulate API call
    alert('Password updated successfully');
    setShowVault(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="space-y-xl animate-in fade-in duration-700">
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
            <p className="text-xs text-white/60 leading-relaxed">
              The <code className="text-red-400">profiles</code> table does not exist in your Supabase database. 
              Please run the following SQL in your <span className="text-white">Supabase SQL Editor</span> to initialize the schema:
            </p>
            <pre className="bg-black/50 p-6 text-[10px] font-mono text-primary/80 overflow-x-auto border border-white/5">
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

      {isSupabaseConfigured && !errorVisible && (
        <div className="bg-primary/10 border border-primary/50 p-6 flex items-center gap-4 animate-in slide-in-from-top duration-500">
          <Info className="w-5 h-5 text-primary" />
          <div className="space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-widest text-primary">System Active</p>
            <p className="text-xs text-primary/80">Your profile is active. All information will be synced across your devices.</p>
          </div>
        </div>
      )}

      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 border-b border-white/10 pb-12">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <User className="w-5 h-5 text-primary" />
            <span className="text-xs font-mono text-primary tracking-[0.5em] uppercase">User Settings</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none italic">
            Profile <span className="text-primary italic">Info</span>
          </h1>
        </div>

        <div className="flex gap-12">
          <div className="flex flex-col">
            <span className="text-[8px] font-mono text-white/20 uppercase tracking-widest leading-none mb-2">Account Type</span>
            <span className="text-xl font-bold tracking-tighter italic">ADMIN</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[8px] font-mono text-white/20 uppercase tracking-widest leading-none mb-2">Status</span>
            <span className="text-xl font-bold tracking-tighter text-primary italic">ONLINE</span>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-px bg-white/10 border border-white/10">
        {/* Left Column: Avatar & Quick Actions */}
        <section className="lg:col-span-4 bg-background p-12 space-y-12 border-b lg:border-b-0 lg:border-r border-white/10">
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
                   className={`absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer transition-opacity ${isUploading ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                 >
                    <div className="flex flex-col items-center gap-2">
                       {isUploading ? (
                         <>
                           <Loader2 className="w-8 h-8 text-primary animate-spin" />
                           <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">{uploadProgress}%</span>
                         </>
                       ) : (
                         <>
                           <Camera className="w-8 h-8 text-white" />
                           <span className="text-[10px] font-black uppercase tracking-[0.3em]">Update Photo</span>
                         </>
                       )}
                    </div>
                 </div>
                 {isUploading && (
                   <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${uploadProgress}%` }}
                        className="h-full bg-primary"
                      />
                   </div>
                 )}
                 {errorVisible && !isUploading && (
                   <div className="absolute top-0 left-0 right-0 bg-red-500/80 p-2 text-[8px] font-black uppercase tracking-tighter text-center">
                     {errorVisible}
                   </div>
                 )}
              </div>
              
              <div className="space-y-2 text-center lg:text-left">
                 <h2 className="text-3xl font-black uppercase tracking-tighter italic">{username}</h2>
                 <p className="text-[10px] font-mono text-white/30 uppercase tracking-[0.2em]">User ID: #3773</p>
              </div>
           </div>

           <div className="space-y-6 pt-12 border-t border-white/5">
              <button 
                onClick={() => setShowVault(true)}
                className="w-full py-5 border border-white/10 text-white/40 font-black uppercase tracking-[0.4em] text-[10px] hover:border-primary hover:text-primary transition-all flex items-center justify-center gap-3 group"
              >
                 <Lock className="w-4 h-4" />
                 <span>Change Password</span>
                 <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </button>
              
              <div className="p-6 bg-white/[0.02] border border-white/5 space-y-4">
                 <div className="flex items-center gap-2">
                    <Activity className="w-3 h-3 text-primary" />
                    <span className="text-[8px] font-black uppercase tracking-widest text-white/40 italic">Account Activity</span>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                       <span className="text-[10px] font-bold">128H</span>
                       <p className="text-[8px] font-mono text-white/20 uppercase">Total Time</p>
                    </div>
                    <div className="space-y-1">
                       <span className="text-[10px] font-bold">42</span>
                       <p className="text-[8px] font-mono text-white/20 uppercase">Connected Devices</p>
                    </div>
                 </div>
              </div>
           </div>
        </section>

        {/* Right Column: Profile Form */}
        <form onSubmit={handleUpdateProfile} className="lg:col-span-8 bg-black/20 p-12 lg:p-16 space-y-16">
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
              <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 italic group-focus-within:text-primary transition-colors flex items-center gap-2">
                <Binary className="w-3 h-3" />
                Biography
              </label>
              <textarea 
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full bg-transparent border-b border-white/10 py-4 text-sm font-mono text-white/80 placeholder:text-white/5 focus:outline-none focus:border-primary transition-all min-h-[100px] resize-none"
              />
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-16 pt-8 border-t border-white/5">
              <div className="space-y-6">
                 <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 italic flex items-center gap-2">
                    <Globe className="w-3 h-3" />
                    Region
                 </label>
                 <select className="w-full bg-transparent border-b border-white/10 py-4 text-sm font-mono text-white/80 appearance-none focus:outline-none focus:border-white transition-colors cursor-pointer">
                    <option className="bg-neutral-900">Asia</option>
                    <option className="bg-neutral-900">North America</option>
                    <option className="bg-neutral-900">Europe</option>
                 </select>
              </div>

              <div className="space-y-6">
                 <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 italic flex items-center gap-2">
                    <Monitor className="w-3 h-3" />
                    Appearance
                 </label>
                 <div className="flex gap-4">
                    <button type="button" className="flex-1 py-4 bg-white text-black text-[10px] font-black uppercase tracking-widest">Dark Mode</button>
                    <button type="button" className="flex-1 py-4 border border-white/10 text-white/40 text-[10px] font-black uppercase tracking-widest hover:border-white hover:text-white transition-all">Light Mode</button>
                 </div>
              </div>
           </div>

           <div className="pt-12 flex justify-end">
              <button 
                type="submit"
                disabled={isSaving}
                className={`px-12 py-6 bg-primary text-black font-black uppercase tracking-[0.5em] text-xs hover:bg-white transition-all shadow-xl shadow-primary/20 flex items-center gap-4 ${isSaving ? 'opacity-50 cursor-wait' : ''}`}
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
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-8"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="w-full max-w-xl bg-neutral-900 border border-white/10 overflow-hidden"
            >
              <div className="p-8 border-b border-white/10 flex justify-between items-center bg-white/[0.02]">
                 <div className="flex items-center gap-4 text-primary">
                    <Shield className="w-5 h-5" />
                    <h3 className="text-[10px] font-bold uppercase tracking-[0.3em]">Security Settings</h3>
                 </div>
                 <button onClick={() => setShowVault(false)} className="text-white/20 hover:text-white transition-colors">
                    <X className="w-5 h-5" />
                 </button>
              </div>

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
                      onClick={() => setShowVault(false)}
                      className="py-5 border border-white/10 text-white/40 font-black uppercase tracking-[0.4em] text-[10px] hover:text-white hover:border-white transition-all"
                    >
                       Cancel
                    </button>
                    <button 
                      type="submit"
                      className="py-5 bg-white text-black font-black uppercase tracking-[0.4em] text-[10px] hover:bg-primary transition-all"
                    >
                       Update Password
                    </button>
                 </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="pt-20 border-t border-white/5 flex flex-col items-center gap-6">
         <div className="flex items-center gap-4 text-[10px] font-mono text-white/20 uppercase tracking-[0.2em]">
            <span>System Status: Online</span>
            <div className="w-[1px] h-4 bg-white/10" />
            <span>Verified</span>
            <div className="w-[1px] h-4 bg-white/10" />
            <span>Secure Connection</span>
         </div>
      </footer>
    </div>
  );
}
