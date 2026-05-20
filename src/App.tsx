/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Header, BottomNav } from './components/Navigation';
import { EventsPage } from './pages/EventsPage';
import { LibraryPage } from './pages/LibraryPage';
import { ProgressPage } from './pages/ProgressPage';
import { AlertsPage } from './pages/AlertsPage';
import { ProfilePage } from './pages/ProfilePage';
import { AdminPage } from './pages/AdminPage';
import { ArchivePage } from './pages/ArchivePage';
import { LoginPage } from './pages/LoginPage';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';
import { LandingPage } from './pages/LandingPage';
import { NewsPage } from './pages/NewsPage';
import { AnimatePresence, motion } from 'motion/react';
import { auth, db } from './lib/firebase';
import { supabase } from './lib/supabase';
import { onAuthStateChanged, signOut, signInAnonymously } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp, writeBatch } from 'firebase/firestore';

import { Tab } from './types';
import { ThemeProvider } from './ThemeContext';


function MainLayout({ 
  isAdmin, 
  activeTab, 
  setActiveTab, 
  avatarUrl, 
  onAvatarUpdate,
  steamId,
  onSteamIdChange
}: { 
  isAdmin: boolean, 
  activeTab: Tab, 
  setActiveTab: (tab: Tab) => void,
  avatarUrl: string,
  onAvatarUpdate: (url: string) => void,
  steamId: string | null,
  onSteamIdChange: (id: string | null) => void
}) {
  const location = useLocation();
  const navigatedRef = useRef(false);

  useEffect(() => {
    if ((location.state?.fromAdminLogin || location.state?.activeTab === 'profile') && !navigatedRef.current) {
      setActiveTab(location.state?.activeTab || 'admin');
      navigatedRef.current = true;
    }
  }, [location.state, setActiveTab]);

  const handleLogout = async () => {
    await signOut(auth);
  };

  const renderPage = () => {
    switch (activeTab) {
      case 'events': return <EventsPage />;
      case 'library': return <LibraryPage />;
      case 'progress': return <ProgressPage onNavigateToArchive={() => setActiveTab('archive')} steamId={steamId} />;
      case 'archive': return <ArchivePage onBack={() => setActiveTab('progress')} steamId={steamId} />;
      case 'news': return <NewsPage />;
      case 'alerts': return <AlertsPage />;
      case 'profile': return <ProfilePage onAvatarUpdate={onAvatarUpdate} steamId={steamId} onSteamSync={() => {
        // Force refresh of steamId if needed
        const fetchSteam = async () => {
          const user = auth.currentUser;
          if (user) {
            const userDoc = await getDoc(doc(db, 'users', user.uid));
            if (userDoc.exists()) {
              onSteamIdChange(userDoc.data().steamId);
            }
          }
        }
        fetchSteam();
      }} />;
      case 'admin': return isAdmin ? <AdminPage /> : <EventsPage />;
      default: return <EventsPage />;
    }
  };

  return (
    <div className="min-h-screen bg-background text-on-surface select-none font-sans overflow-x-hidden">
      <Header 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        onLogout={handleLogout} 
        isAdmin={isAdmin}
        avatarUrl={avatarUrl}
        steamId={steamId}
      />
      
      <main className="max-w-[1600px] mx-auto px-6 md:px-12 pt-32 pb-40 md:pt-48 md:pb-32">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="fixed bottom-0 w-full bg-background border-t border-outline/5 py-4 px-12 flex justify-between items-center z-40 hidden md:flex">
        <div className="flex gap-12">
          <div className="flex flex-col">
            <span className="text-[8px] font-mono text-on-surface/20 uppercase tracking-widest">Latency</span>
            <span className="text-[10px] font-bold text-primary">0.02ms</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[8px] font-mono text-on-surface/20 uppercase tracking-widest">Encryption</span>
            <span className="text-[10px] font-bold text-on-surface">Secure</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          <span className="text-[9px] font-bold uppercase tracking-widest opacity-40 text-on-surface">System Operational</span>
        </div>
      </footer>
      
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}

function SteamAuthHandler({ onSyncComplete }: { onSyncComplete: (id: string) => void }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    console.log('SteamAuthHandler mounted at:', location.pathname, 'with search:', location.search);
    const params = new URLSearchParams(location.search);
    const steamId = params.get('steamId');
    const loginSuccess = params.get('loginSuccess');

    if (steamId && loginSuccess === 'true' && status === 'idle') {
      console.log('SteamAuthHandler: Syncing Steam ID', steamId);
      const handleSteamLogin = async () => {
        setStatus('processing');
        try {
          setStatus('processing');
          // If already logged in, we link it. If not, we sign in anonymously for the demo.
          let currentUser = auth.currentUser;
          console.log('SteamAuthHandler: checking auth. Auth present:', !!currentUser, currentUser?.uid);
          
          if (!currentUser) {
            console.log('SteamAuthHandler: No user, attempting anonymous sign-in...');
            try {
              const result = await signInAnonymously(auth);
              currentUser = result.user;
              console.log('SteamAuthHandler: Anonymous sign-in success:', currentUser.uid);
            } catch (authErr) {
              console.error('SteamAuthHandler: Anonymous sign-in FAILED:', authErr);
              throw new Error(`Authentication failure: ${authErr instanceof Error ? authErr.message : String(authErr)}`);
            }
          }

          if (currentUser) {
            const userRef = doc(db, 'users', currentUser.uid);
            console.log('SteamAuthHandler: Attempting getDoc on users/', currentUser.uid);
            let userSnap;
            try {
              userSnap = await getDoc(userRef);
              console.log('SteamAuthHandler: getDoc success. Exists:', userSnap.exists());
            } catch (firestoreGetErr) {
              console.error('SteamAuthHandler: getDoc FAILED:', firestoreGetErr);
              throw new Error(`Firestore Read Failure: ${firestoreGetErr instanceof Error ? firestoreGetErr.message : String(firestoreGetErr)}`);
            }
            
            if (!userSnap.exists()) {
              console.log('SteamAuthHandler: Creating new record for', currentUser.uid);
              const username = `steam_${steamId.slice(-6)}`;
              const batch = writeBatch(db);
              
              batch.set(userRef, {
                steamId: steamId,
                username: username,
                email: currentUser.email || '',
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
              });
              
              batch.set(doc(db, 'usernames', username.toLowerCase()), { userId: currentUser.uid });
              
              try {
                await batch.commit();
                console.log('SteamAuthHandler: batch.commit (create) success');
              } catch (batchErr) {
                console.error('SteamAuthHandler: batch.commit (create) FAILED:', batchErr);
                throw new Error(`Firestore Write Failure (Create): ${batchErr instanceof Error ? batchErr.message : String(batchErr)}`);
              }
            } else {
              console.log('SteamAuthHandler: Updating record for', currentUser.uid);
              const existingData = userSnap.data();
              const updateData: any = {
                steamId: steamId,
                updatedAt: serverTimestamp()
              };

              if (!existingData.username) {
                const username = `steam_${steamId.slice(-6)}`;
                updateData.username = username;
                const usernameRef = doc(db, 'usernames', username.toLowerCase());
                const batch = writeBatch(db);
                batch.update(userRef, updateData);
                batch.set(usernameRef, { userId: currentUser.uid });
                try {
                  await batch.commit();
                  console.log('SteamAuthHandler: batch.commit (update+username) success');
                } catch (batchErr) {
                  console.error('SteamAuthHandler: batch.commit (update+username) FAILED:', batchErr);
                  throw new Error(`Firestore Write Failure (Update): ${batchErr instanceof Error ? batchErr.message : String(batchErr)}`);
                }
              } else {
                try {
                  await setDoc(userRef, updateData, { merge: true });
                  console.log('SteamAuthHandler: setDoc (merge) success');
                } catch (updateErr) {
                  console.error('SteamAuthHandler: setDoc (merge) FAILED:', updateErr);
                  throw new Error(`Firestore Write Failure (Merge): ${updateErr instanceof Error ? updateErr.message : String(updateErr)}`);
                }
              }
            }

            // Sync with Supabase if configured
            try {
              console.log('Attempting Supabase sync...');
              await supabase
                .from('profiles')
                .upsert({
                  id: currentUser.uid,
                  steam_id: steamId, 
                  updated_at: new Date().toISOString()
                }, { onConflict: 'id' });
              console.log('Supabase sync complete.');
            } catch (supabaseErr) {
              console.warn('Optional Supabase sync skipped:', supabaseErr);
            }

            // Update app state
            console.log('SteamAuthHandler: Sync Complete, updating app state');
            onSyncComplete(steamId);
            setStatus('success');
            
            // Redirect to profile specifically to show the link
            setTimeout(() => {
              console.log('Navigating to dashboard/profile...');
              navigate('/dashboard', { 
                replace: true, 
                state: { activeTab: 'profile', syncSuccess: true } 
              });
            }, 2000);
          }
        } catch (err: any) {
          console.error('Error handling Steam login:', err);
          setStatus('error');
          setErrorMessage(err.message || 'Sync failed');
        }
      };

      handleSteamLogin();
    } else if (status === 'idle') {
      console.warn('SteamAuthHandler: Missing parameters or invalid state', { steamId, loginSuccess });
    }
  }, [location, navigate, status, onSyncComplete]);

  return (
    <div className="fixed inset-0 bg-background z-[100] flex items-center justify-center p-6 text-on-surface">
      <div className="max-w-md w-full border border-outline/5 bg-on-surface/[0.02] p-8 text-center space-y-6">
        <div className="flex justify-center">
          <div className={`w-2 h-2 rounded-full ${status === 'error' ? 'bg-red-500' : 'bg-primary'} animate-pulse`} />
        </div>
        
        <div className="space-y-2">
          <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-on-surface/40">
            {status === 'processing' && 'Synchronizing Protocol'}
            {status === 'success' && 'Connection Established'}
            {status === 'error' && 'Handshake Failed'}
          </h2>
          
          <p className="font-mono text-[11px] text-on-surface uppercase tracking-widest leading-relaxed">
            {status === 'processing' && 'Interfacing with Steam Gateway...'}
            {status === 'success' && 'Steam ID successfully linked to profile.'}
            {status === 'error' && `ERROR: ${errorMessage}`}
          </p>
        </div>

        {status === 'processing' && (
          <div className="w-full h-[1px] bg-on-surface/5 overflow-hidden">
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
              className="w-1/2 h-full bg-primary"
            />
          </div>
        )}
      </div>
    </div>
  );
}


export default function App() {
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [steamId, setSteamId] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('events');
  const [avatarUrl, setAvatarUrl] = useState<string>('');
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        setUser(authUser);
        setAvatarUrl(authUser.photoURL || '');
        
        // Fetch additional profile data from Firestore
        const fetchUserProfile = async () => {
          try {
            const userDoc = await getDoc(doc(db, 'users', authUser.uid));
            if (userDoc.exists()) {
              const userData = userDoc.data();
              if (userData.steamId) {
                setSteamId(userData.steamId);
              }
            }
          } catch (err) {
            console.error('Error fetching profile from Firestore:', err);
          }
        };

        fetchUserProfile();

        // Fetch additional profile data from Supabase
        try {
          const { data } = await supabase
            .from('profiles')
            .select('avatar_url, steam_id')
            .eq('id', authUser.uid)
            .single();
          
          if (data?.avatar_url) {
            setAvatarUrl(data.avatar_url);
          }
          if (data?.steam_id && !steamId) {
            setSteamId(data.steam_id);
          }
        } catch (err) {
          console.error('Error fetching profile from Supabase:', err);
        }

        const adminDoc = await getDoc(doc(db, 'admins', authUser.uid));
        const isUserAdmin = adminDoc.exists() || authUser.email?.toLowerCase() === 'drd3773@gmail.com';
        setIsAdmin(isUserAdmin);
      } else {
        setUser(null);
        setIsAdmin(false);
        setAvatarUrl('');
      }
      setIsInitializing(false);
    });

    return () => unsubscribe();
  }, []);

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div 
          animate={{ opacity: [0.2, 1, 0.2] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-primary font-mono text-xs uppercase tracking-[1em]"
        >
          Initializing...
        </motion.div>
      </div>
    );
  }

  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route 
            path="/" 
            element={
              user ? <Navigate to="/dashboard" replace /> : 
              <LoginPage />
            } 
          />

        <Route path="/auth/callback/steam" element={<SteamAuthHandler onSyncComplete={setSteamId} />} />
        
        <Route 
          path="/login" 
          element={
            user ? <Navigate to="/dashboard" replace /> : 
            <LoginPage />
          } 
        />
        
        <Route 
          path="/admin/login" 
          element={
            (user && isAdmin) ? <Navigate to="/dashboard" replace /> : 
            <AdminLoginPage />
          } 
        />

        <Route path="/reset-password" element={<ResetPasswordPage />} />

        <Route 
          path="/dashboard" 
          element={
            user ? (
              <MainLayout 
                isAdmin={isAdmin} 
                activeTab={activeTab} 
                setActiveTab={setActiveTab} 
                avatarUrl={avatarUrl}
                onAvatarUpdate={setAvatarUrl}
                steamId={steamId}
                onSteamIdChange={setSteamId}
              />
            ) : 
            <Navigate to="/login" replace />
          } 
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </ThemeProvider>
  );
}


