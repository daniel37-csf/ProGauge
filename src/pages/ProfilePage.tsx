import React, { useState, FormEvent, useRef, useEffect } from 'react';
import { auth, db, storage, handleFirestoreError, OperationType } from '../lib/firebase';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
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

export function ProfilePage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState('https://lh3.googleusercontent.com/aida-public/AB6AXuBlyoNV8_PVYDDruJJedgEnmdArjXVrU4qn62bh9a-asl-VzcRO0jgggZ-p6IePJ32zC57V2imV19GyNZSwhC02eaGGEZks_ryxvLd4n6O25L_pImGnuDGEXnjQZ5MYh89U_UGDwFEPfwbBIroqzOZaEy6i-5wqe0co3EsreXpsmmlE9-is_91-oGiTqC-K-cLQhNBF8GVenOPqw-nUgDyAo3RapzjH16TyEpWtgQTqq95a3I5Czs9hDbwBWPAVMPUIYjEd6nWwbXs');
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showVault, setShowVault] = useState(false);
  const [errorVisible, setErrorVisible] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load user data
  useEffect(() => {
    const loadProfile = async () => {
      const user = auth.currentUser;
      if (!user) return;

      setEmail(user.email || '');

      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setUsername(data.username || user.displayName || '');
          setBio(data.bio || '');
          setAvatar(data.avatar || user.photoURL || avatar);
        }
      } catch (error) {
        console.error('Failed to load profile:', error);
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

    // Check file size (e.g., 5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setErrorVisible('PAYLOAD_ERROR: FILE_TOO_LARGE');
      return;
    }

    setIsUploading(true);
    setErrorVisible(null);

    try {
      const storageRef = ref(storage, `avatars/${user.uid}`);
      
      // Using uploadBytes for direct promise-based upload
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      
      setAvatar(downloadURL);
      
      // Update user doc immediately
      await updateDoc(doc(db, 'users', user.uid), {
        avatar: downloadURL,
        updatedAt: serverTimestamp()
      });
      
      setIsUploading(false);
    } catch (error: any) {
      console.error('Upload Failed:', error);
      setErrorVisible(`UPLINK_FAILURE: ${error.code || 'UNKNOWN_ERROR'}`);
      setIsUploading(false);
      handleFirestoreError(error, OperationType.UPDATE, `users/${user.uid}`);
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
      await updateDoc(doc(db, 'users', user.uid), {
        username,
        bio,
        updatedAt: serverTimestamp()
      });
      setIsSaving(false);
      alert('IDENTITY_SYNC_COMPLETE');
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${user.uid}`);
      setIsSaving(false);
    }
  };

  const handleUpdatePassword = (e: FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert('PARITY_ERROR: PASSWORDS_DO_NOT_MATCH');
      return;
    }
    // Simulate API call
    alert('VAULT_KEY_ROTATED');
    setShowVault(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="space-y-xl animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 border-b border-white/10 pb-12">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <User className="w-5 h-5 text-primary" />
            <span className="text-xs font-mono text-primary tracking-[0.5em] uppercase">Identity_Terminal</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none italic">
            Profile_<span className="text-primary">Sync</span>
          </h1>
        </div>

        <div className="flex gap-12">
          <div className="flex flex-col">
            <span className="text-[8px] font-mono text-white/20 uppercase tracking-widest leading-none mb-2">Auth Level</span>
            <span className="text-xl font-bold tracking-tighter italic">ADMIN_SYSTEM</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[8px] font-mono text-white/20 uppercase tracking-widest leading-none mb-2">Sync Status</span>
            <span className="text-xl font-bold tracking-tighter text-primary italic">OPTIMIZED</span>
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
                   alt="Identity Signature" 
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
                           <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Syncing...</span>
                         </>
                       ) : (
                         <>
                           <Camera className="w-8 h-8 text-white" />
                           <span className="text-[10px] font-black uppercase tracking-[0.3em]">Update_Signature</span>
                         </>
                       )}
                    </div>
                 </div>
                 {isUploading && (
                   <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="h-full bg-primary"
                      />
                   </div>
                 )}
              </div>
              
              <div className="space-y-2 text-center lg:text-left">
                 <h2 className="text-3xl font-black uppercase tracking-tighter italic">{username}</h2>
                 <p className="text-[10px] font-mono text-white/30 uppercase tracking-[0.2em]">Node_Index: #3773-ALPHA</p>
              </div>
           </div>

           <div className="space-y-6 pt-12 border-t border-white/5">
              <button 
                onClick={() => setShowVault(true)}
                className="w-full py-5 border border-white/10 text-white/40 font-black uppercase tracking-[0.4em] text-[10px] hover:border-primary hover:text-primary transition-all flex items-center justify-center gap-3 group"
              >
                 <Lock className="w-4 h-4" />
                 <span>Access_Vault</span>
                 <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </button>
              
              <div className="p-6 bg-white/[0.02] border border-white/5 space-y-4">
                 <div className="flex items-center gap-2">
                    <Activity className="w-3 h-3 text-primary" />
                    <span className="text-[8px] font-black uppercase tracking-widest text-white/40 italic">Activity_Digest</span>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                       <span className="text-[10px] font-bold">128H</span>
                       <p className="text-[8px] font-mono text-white/20 uppercase">Total_Uptime</p>
                    </div>
                    <div className="space-y-1">
                       <span className="text-[10px] font-bold">42</span>
                       <p className="text-[8px] font-mono text-white/20 uppercase">Sync_Nodes</p>
                    </div>
                 </div>
              </div>
           </div>
        </section>

        {/* Right Column: Profile Form */}
        <form onSubmit={handleUpdateProfile} className="lg:col-span-8 bg-black/20 p-12 lg:p-16 space-y-16">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
              <SettingField 
                label="Identity_Handle"
                value={username}
                onChange={setUsername}
                icon={User}
                placeholder="PRO_GAUGE_NODE"
              />
              <SettingField 
                label="Node_Email"
                value={email}
                onChange={setEmail}
                icon={Mail}
                type="email"
                placeholder="NODE@SYSTEM.NET"
              />
           </div>

           <div className="space-y-4 group">
              <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 italic group-focus-within:text-primary transition-colors flex items-center gap-2">
                <Binary className="w-3 h-3" />
                Tactical_Bio
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
                    Regional_Sync
                 </label>
                 <select className="w-full bg-transparent border-b border-white/10 py-4 text-sm font-mono text-white/80 appearance-none focus:outline-none focus:border-white transition-colors cursor-pointer">
                    <option className="bg-neutral-900">ASIA-SOUTHEAST-1</option>
                    <option className="bg-neutral-900">US-EAST-2</option>
                    <option className="bg-neutral-900">EU-WEST-4</option>
                 </select>
              </div>

              <div className="space-y-6">
                 <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 italic flex items-center gap-2">
                    <Monitor className="w-3 h-3" />
                    Display_Mode
                 </label>
                 <div className="flex gap-4">
                    <button type="button" className="flex-1 py-4 bg-white text-black text-[10px] font-black uppercase tracking-widest">Dark_Mode</button>
                    <button type="button" className="flex-1 py-4 border border-white/10 text-white/40 text-[10px] font-black uppercase tracking-widest hover:border-white hover:text-white transition-all">Light_Node</button>
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
                      <span>Commit_Sync</span>
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
                    <h3 className="text-[10px] font-bold uppercase tracking-[0.3em]">Security_Vault_Access</h3>
                 </div>
                 <button onClick={() => setShowVault(false)} className="text-white/20 hover:text-white transition-colors">
                    <X className="w-5 h-5" />
                 </button>
              </div>

              <form onSubmit={handleUpdatePassword} className="p-12 space-y-12">
                 <div className="space-y-10">
                    <SettingField 
                      label="Current_Access_Key"
                      type="password"
                      value={currentPassword}
                      onChange={setCurrentPassword}
                      icon={Lock}
                      placeholder="********"
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                      <SettingField 
                        label="New_Access_Key"
                        type="password"
                        value={newPassword}
                        onChange={setNewPassword}
                        icon={Key}
                        placeholder="********"
                      />
                      <SettingField 
                        label="Verify_Key"
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
                       Abort_Session
                    </button>
                    <button 
                      type="submit"
                      className="py-5 bg-white text-black font-black uppercase tracking-[0.4em] text-[10px] hover:bg-primary transition-all"
                    >
                       Rotate_Key
                    </button>
                 </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="pt-20 border-t border-white/5 flex flex-col items-center gap-6">
         <div className="flex items-center gap-4 text-[10px] font-mono text-white/20 uppercase tracking-[0.2em]">
            <span>System_Uptime: 99.9%</span>
            <div className="w-[1px] h-4 bg-white/10" />
            <span>Identity_Verified</span>
            <div className="w-[1px] h-4 bg-white/10" />
            <span>AES_256_ENCRYPTED</span>
         </div>
      </footer>
    </div>
  );
}
