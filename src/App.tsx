/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { Header, BottomNav } from "./components/Navigation";
import { EventsPage } from "./pages/EventsPage";
import { LibraryPage } from "./pages/LibraryPage";
import { ProgressPage } from "./pages/ProgressPage";
import { AlertsPage } from "./pages/AlertsPage";
import { ProfilePage } from "./pages/ProfilePage";
import { AdminPage } from "./pages/AdminPage";
import { ArchivePage } from "./pages/ArchivePage";
import { LoginPage } from "./pages/LoginPage";
import { AdminLoginPage } from "./pages/AdminLoginPage";
import { LandingPage } from "./pages/LandingPage";
import { AnimatePresence, motion } from "motion/react";
import { supabase } from "./lib/supabase";

import { Tab } from "./types";

function MainLayout({
  isAdmin,
  activeTab,
  setActiveTab,
  avatarUrl,
  onAvatarUpdate,
  onLogout,
}: {
  isAdmin: boolean;
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
  avatarUrl: string;
  onAvatarUpdate: (url: string) => void;
  onLogout: () => void;
}) {
  const location = useLocation();
  const navigatedRef = useRef(false);

  useEffect(() => {
    if (location.state?.fromAdminLogin && !navigatedRef.current) {
      setActiveTab("admin");
      navigatedRef.current = true;
    }
  }, [location.state, setActiveTab]);

  const renderPage = () => {
    switch (activeTab) {
      case "events":
        return <EventsPage />;
      case "library":
        return <LibraryPage />;
      case "progress":
        return (
          <ProgressPage onNavigateToArchive={() => setActiveTab("archive")} />
        );
      case "archive":
        return <ArchivePage onBack={() => setActiveTab("progress")} />;
      case "alerts":
        return <AlertsPage />;
      case "profile":
        return (
          <ProfilePage onAvatarUpdate={onAvatarUpdate} onLogout={onLogout} />
        );
      case "admin":
        return isAdmin ? <AdminPage /> : <EventsPage />;
      default:
        return <EventsPage />;
    }
  };

  return (
    <div className="min-h-screen bg-background text-on-surface select-none font-sans overflow-x-hidden">
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onLogout={onLogout}
        isAdmin={isAdmin}
        avatarUrl={avatarUrl}
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

      <footer className="fixed bottom-0 w-full bg-background border-t border-outline py-4 px-12 flex justify-between items-center z-40 hidden md:flex">
        <div className="flex gap-12">
          <div className="flex flex-col">
            <span className="text-[8px] font-mono text-on-surface/40 uppercase tracking-widest">
              Latency
            </span>
            <span className="text-[10px] font-bold text-primary">0.02ms</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[8px] font-mono text-on-surface/40 uppercase tracking-widest">
              Encryption
            </span>
            <span className="text-[10px] font-bold">Secure</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          <span className="text-[9px] font-bold uppercase tracking-widest opacity-40">
            System Operational
          </span>
        </div>
      </footer>

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}

function SteamAuthHandler() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const steamId = params.get("steamId");
    const loginSuccess = params.get("loginSuccess");

    if (steamId && loginSuccess === "true" && !isProcessing) {
      const handleSteamLogin = async () => {
        setIsProcessing(true);
        try {
          const {
            data: { user },
          } = await supabase.auth.getUser();

          if (user) {
            await supabase.from("profiles").upsert(
              {
                id: user.id,
                steam_id: steamId,
                updated_at: new Date().toISOString(),
              },
              { onConflict: "id" },
            );
          }

          await new Promise((resolve) => setTimeout(resolve, 500));
          navigate("/dashboard", { replace: true });
        } catch (err: any) {
          console.error("Error handling Steam login:", err);
          navigate(
            `/login?error=${encodeURIComponent(err.message || "auth_failed")}`,
            { replace: true },
          );
        } finally {
          setIsProcessing(false);
        }
      };

      handleSteamLogin();
    }
  }, [location, navigate, isProcessing]);

  if (isProcessing) {
    return (
      <div className="fixed inset-0 bg-background/90 z-[100] flex items-center justify-center">
        <motion.div
          animate={{ opacity: [0.2, 1, 0.2] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-primary font-mono text-xs uppercase tracking-[1em]"
        >
          Synchronizing Protocol...
        </motion.div>
      </div>
    );
  }

  return null;
}

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>("events");
  const [avatarUrl, setAvatarUrl] = useState<string>("");

  useEffect(() => {
    // Initial fetch of current session
    supabase.auth
      .getSession()
      .then(({ data: { session } }) => {
        const authUser = session?.user || null;
        setUser(authUser);
        if (authUser) {
          setAvatarUrl(authUser.user_metadata?.avatar_url || "");
          // Admin check is now derived from database
          setIsAdmin(false);
        }
        setIsInitializing(false);
      })
      .catch((err) => {
        console.error("Error fetching session on init:", err);
        setIsInitializing(false);
      });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      const authUser = session?.user || null;
      setUser(authUser);

      if (authUser) {
        setAvatarUrl(authUser.user_metadata?.avatar_url || "");

        try {
          const { data, error } = await supabase
            .from("profiles")
            .select("avatar_url, is_admin")
            .eq("id", authUser.id)
            .single();

          if (!error && data) {
            if (data.avatar_url) setAvatarUrl(data.avatar_url);
            if (data.is_admin) setIsAdmin(true);
          } else if (error && error.code === "PGRST116") {
            // Found no profile, create one
            await supabase.from("profiles").insert({
              id: authUser.id,
              email: authUser.email,
              username:
                authUser.user_metadata?.full_name ||
                authUser.email?.split("@")[0] ||
                "User",
              avatar_url: authUser.user_metadata?.avatar_url || "",
              updated_at: new Date().toISOString(),
            });
          }

          // Removed fallback admin check
        } catch (err) {
          console.error("Error fetching additional profile data:", err);
        }
      } else {
        setIsAdmin(false);
        setAvatarUrl("");
      }
      setIsInitializing(false);
    });

    return () => subscription.unsubscribe();
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
    <BrowserRouter>
      <SteamAuthHandler />
      <Routes>
        <Route path="/" element={<LoginPage />} />

        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/admin/login"
          element={
            user && isAdmin ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <AdminLoginPage />
            )
          }
        />

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
                onLogout={async () => {
                  try {
                    await supabase.auth.signOut();
                  } catch (e) {
                    console.error("Logout error", e);
                  } finally {
                    setUser(null);
                  }
                }}
              />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
