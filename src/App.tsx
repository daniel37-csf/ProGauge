/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { Header, BottomNav } from './components/Navigation';
import { EventsPage } from './pages/EventsPage';
import { LibraryPage } from './pages/LibraryPage';
import { ProgressPage } from './pages/ProgressPage';
import { AlertsPage } from './pages/AlertsPage';
import { AdminPage } from './pages/AdminPage';
import { LoginPage } from './pages/LoginPage';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { AnimatePresence, motion } from 'motion/react';
import { auth, db } from './lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

type Tab = 'events' | 'progress' | 'library' | 'alerts' | 'admin';
type ViewState = 'login' | 'admin-login' | 'app';

export default function App() {
  const [view, setView] = useState<ViewState>('login');
  const [activeTab, setActiveTab] = useState<Tab>('events');
  const [isInitializing, setIsInitializing] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const currentView = useRef<ViewState>(view);
  
  useEffect(() => {
    currentView.current = view;
  }, [view]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Check if admin
        const adminDoc = await getDoc(doc(db, 'admins', user.uid));
        const isUserAdmin = adminDoc.exists() || user.email?.toLowerCase() === 'drd3773@gmail.com';
        
        if (isUserAdmin) {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }

        // If we were on the admin login page, and we successfully authenticated as admin
        // automatically switch to the admin tab.
        if (currentView.current === 'admin-login' && isUserAdmin) {
          setActiveTab('admin');
          setView('app');
          setIsInitializing(false);
          return;
        }
        
        setView('app');
      } else {
        setView('login');
        setIsAdmin(false);
      }
      setIsInitializing(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    setView('login');
    setActiveTab('events');
  };

  const renderPage = () => {
    switch (activeTab) {
      case 'events': return <EventsPage />;
      case 'library': return <LibraryPage />;
      case 'progress': return <ProgressPage />;
      case 'alerts': return <AlertsPage />;
      case 'admin': return isAdmin ? <AdminPage /> : <EventsPage />;
      default: return <EventsPage />;
    }
  };

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

  if (view === 'login') {
    return (
      <LoginPage 
        onLogin={() => setView('app')} 
        onAdminAccess={() => setView('admin-login')} 
      />
    );
  }

  if (view === 'admin-login') {
    return (
      <AdminLoginPage 
        onLogin={() => {
          setView('app');
          setActiveTab('admin');
        }} 
        onBack={() => setView('login')} 
      />
    );
  }

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

