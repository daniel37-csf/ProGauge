/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Header, BottomNav } from './components/Navigation';
import { EventsPage } from './pages/EventsPage';
import { LibraryPage } from './pages/LibraryPage';
import { ProgressPage } from './pages/ProgressPage';
import { AlertsPage } from './pages/AlertsPage';
import { ProfilePage } from './pages/ProfilePage';
import { AdminPage } from './pages/AdminPage';
import { LoginPage } from './pages/LoginPage';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { LandingPage } from './pages/LandingPage';
import { AnimatePresence, motion } from 'motion/react';
import { auth, db } from './lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

type Tab = 'events' | 'progress' | 'library' | 'alerts' | 'profile' | 'admin';

function MainLayout({ isAdmin, activeTab, setActiveTab }: { isAdmin: boolean, activeTab: Tab, setActiveTab: (tab: Tab) => void }) {
  const location = useLocation();
  const navigatedRef = useRef(false);

  useEffect(() => {
    if (location.state?.fromAdminLogin && !navigatedRef.current) {
      setActiveTab('admin');
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
      case 'progress': return <ProgressPage />;
      case 'alerts': return <AlertsPage />;
      case 'profile': return <ProfilePage />;
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

      <footer className="fixed bottom-0 w-full bg-background border-t border-white/5 py-4 px-12 flex justify-between items-center z-40 hidden md:flex">
        <div className="flex gap-12">
          <div className="flex flex-col">
            <span className="text-[8px] font-mono text-white/20 uppercase tracking-widest">Latency</span>
            <span className="text-[10px] font-bold text-primary">0.02ms</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[8px] font-mono text-white/20 uppercase tracking-widest">Encryption</span>
            <span className="text-[10px] font-bold">RSA_4096</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          <span className="text-[9px] font-bold uppercase tracking-widest opacity-40">System Operational</span>
        </div>
      </footer>
      
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('events');
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        setUser(authUser);
        const adminDoc = await getDoc(doc(db, 'admins', authUser.uid));
        const isUserAdmin = adminDoc.exists() || authUser.email?.toLowerCase() === 'drd3773@gmail.com';
        setIsAdmin(isUserAdmin);
      } else {
        setUser(null);
        setIsAdmin(false);
      }
      setIsInitializing(false);
    });

    return () => unsubscribe();
  }, []);

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <motion.div 
          animate={{ opacity: [0.2, 1, 0.2] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-primary font-mono text-xs uppercase tracking-[1em]"
        >
          Initializing_Node_Sync...
        </motion.div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        
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

        <Route 
          path="/dashboard" 
          element={
            user ? <MainLayout isAdmin={isAdmin} activeTab={activeTab} setActiveTab={setActiveTab} /> : 
            <Navigate to="/login" replace />
          } 
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

