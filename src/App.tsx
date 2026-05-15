/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Header, BottomNav } from './components/Navigation';
import { EventsPage } from './pages/EventsPage';
import { LibraryPage } from './pages/LibraryPage';
import { ProgressPage } from './pages/ProgressPage';
import { AlertsPage } from './pages/AlertsPage';
import { AdminPage } from './pages/AdminPage';
import { LoginPage } from './pages/LoginPage';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { AnimatePresence, motion } from 'motion/react';

type Tab = 'events' | 'progress' | 'library' | 'alerts' | 'admin';
type ViewState = 'login' | 'admin-login' | 'app';

export default function App() {
  const [view, setView] = useState<ViewState>('login');
  const [activeTab, setActiveTab] = useState<Tab>('events');

  const handleLogout = () => {
    setView('login');
    setActiveTab('events');
  };

  const renderPage = () => {
    switch (activeTab) {
      case 'events': return <EventsPage />;
      case 'library': return <LibraryPage />;
      case 'progress': return <ProgressPage />;
      case 'alerts': return <AlertsPage />;
      case 'admin': return <AdminPage />;
      default: return <EventsPage />;
    }
  };

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
      <Header activeTab={activeTab} onTabChange={setActiveTab} onLogout={handleLogout} />
      
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

