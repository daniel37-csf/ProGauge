import {
  Shield,
  Lock,
  ArrowRight,
  Zap,
  Chrome,
  Apple,
  AlertCircle,
  Mail,
  User,
} from "lucide-react";
import { useState, FormEvent, ReactNode, useEffect } from "react";
import { motion } from "motion/react";
import { supabase } from "../lib/supabase";

import { useNavigate } from "react-router-dom";

const SteamIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M12 .004c-5.23 0-9.691 3.391-11.233 8.093l4.8 1.986c.38-.301.861-.482 1.385-.482.164 0 .323.018.476.052l2.36-3.407a2.122 2.122 0 0 1 3.037-2.613l1.373-1.996a1.26 1.26 0 0 1-.044-.241c0-.698.566-1.263 1.264-1.263.698 0 1.264.565 1.264 1.263 0 .698-.566 1.264-1.264 1.264a1.26 1.26 0 0 1-.166-.011l-1.996 1.373a2.123 2.123 0 0 1-2.613 3.037l-3.407 2.361c.034.153.053.312.053.475 0 1.242-1.007 2.249-2.25 2.249-.524 0-1.005-.181-1.385-.482L.767 15.908c1.542 4.704 6.004 8.094 11.233 8.094 6.627 0 12-5.373 12-12s-5.373-12-12-12z" />
  </svg>
);

export function LoginPage() {
  const navigate = useNavigate();
  const [isRegistering, setIsRegistering] = useState(false);
  const [ident, setIdent] = useState(""); // Email or Username
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Only run on mount or when URL params change
    const params = new URLSearchParams(window.location.search);

    // 1. Check if this is a popup returning from OAuth
    if (params.get("popupClose") === "true") {
      // We are the popup. We just authenticated.
      console.log("Popup detected auth completion");
      
      const timer = setTimeout(() => {
        if (window.opener) {
          try {
            console.log("Notifying opener and closing popup...");
            window.opener.postMessage("oauth_success", window.location.origin);
            window.close();
          } catch (e) {
            console.error("Error communicating with opener:", e);
            navigate("/dashboard");
          }
        } else {
          navigate("/dashboard");
        }
      }, 800);
      return () => clearTimeout(timer);
    }

    // 2. Main Page Logic: Set up listeners to detect login from popup or other tabs
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      if (event.data === "oauth_success") {
        console.log("Main page received auth success signal");
        supabase.auth.getSession().then(({ data: { session } }) => {
          if (session?.user) navigate("/dashboard");
        });
      }
    };

    const handleStorageChange = (e: StorageEvent) => {
      // Supabase default storage key is 'sb-<project-id>-auth-token'
      if (e.key && e.key.includes("auth-token")) {
        supabase.auth.getSession().then(({ data: { session } }) => {
          if (session?.user) navigate("/dashboard");
        });
      }
    };

    window.addEventListener("message", handleMessage);
    window.addEventListener("storage", handleStorageChange);

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state change:", event);
      if (session?.user) {
        navigate("/dashboard");
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        navigate("/dashboard");
      }
    });

    const errorParam = params.get("error");
    if (errorParam) {
      setError(decodeURIComponent(errorParam).replace(/_/g, " "));
    }

    return () => {
      subscription.unsubscribe();
      window.removeEventListener("message", handleMessage);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [navigate]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (isRegistering) {
        const cleanEmail = email.trim().toLowerCase();
        const cleanUsername = username.trim();

        if (password.length < 6) {
          throw new Error("Password must be at least 6 characters");
        }
        if (password !== confirmPassword) {
          throw new Error("Passwords do not match");
        }
        if (cleanUsername.length < 3) {
          throw new Error("Username must be at least 3 characters");
        }
        if (!/^[a-zA-Z0-9_]+$/.test(cleanUsername)) {
          throw new Error(
            "Username can only contain letters, numbers, and underscores",
          );
        }

        // SignUp with Supabase
        const { data: signUpData, error: signUpError } =
          await supabase.auth.signUp({
            email: cleanEmail,
            password: password,
            options: {
              data: {
                username: cleanUsername,
              },
            },
          });

        if (signUpError) throw signUpError;
        if (!signUpData.user) throw new Error("Registration failed");

        // Create profile in Supabase table
        const { error: profileError } = await supabase.from("profiles").insert({
          id: signUpData.user.id,
          username: cleanUsername,
          avatar_url: "",
          updated_at: new Date().toISOString(),
        });

        if (profileError) {
          console.error("Error creating profile:", profileError);
          // Don't throw if auth succeeded, but log it
        }
      } else {
        if (!ident) throw new Error("Email or username required");
        let loginEmail = ident;

        if (!ident.includes("@")) {
          // Attempt username lookup in Supabase
          const { data: profile, error: profileError } = await supabase
            .from("profiles")
            .select("email")
            .eq("username", ident.toLowerCase())
            .single();

          if (!profileError && profile?.email) {
            loginEmail = profile.email;
          } else {
            // Fallback for metadata-based username if exists
            throw new Error("Username not found or invalid email");
          }
        }

        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: loginEmail,
          password: password,
        });

        if (signInError) throw signInError;
      }
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message || "Authentication failed");
    } finally {
      setIsLoading(false);
    }
  };

  const [showSteamModal, setShowSteamModal] = useState(false);
  const [manualSteamId, setManualSteamId] = useState("");

  const handleSocialLogin = async (platform: string) => {
    setIsLoading(true);
    setError(null);

    const isIframe = window.self !== window.top;

    try {
      if (platform === "Google" || platform === "Apple") {
        if (!isIframe) {
          // If not in iframe, we can use standard direct redirect which is more reliable
          const { error: authError } = await supabase.auth.signInWithOAuth({
            provider: platform.toLowerCase() as any,
            options: {
              redirectTo: window.location.origin + "/dashboard",
            },
          });
          if (authError) throw authError;
          return;
        }

        // Inside Iframe: Must use Popup
        const popupWidth = 600;
        const popupHeight = 700;
        const left = window.screenX + (window.innerWidth - popupWidth) / 2;
        const top = window.screenY + (window.innerHeight - popupHeight) / 2;

        const popup = window.open(
          "about:blank",
          "oauth_popup",
          `width=${popupWidth},height=${popupHeight},left=${left},top=${top}`,
        );

        if (!popup) {
          throw new Error(
            "Popup blocked. Please allow popups or open this app in a new tab.",
          );
        }

        const { data, error: authError } = await supabase.auth.signInWithOAuth({
          provider: platform.toLowerCase() as any,
          options: {
            redirectTo: window.location.origin + "/login?popupClose=true",
            skipBrowserRedirect: true,
          },
        });

        if (authError) {
          popup.close();
          throw authError;
        }

        if (data?.url) {
          popup.location.href = data.url;

          // Polling fallback
          const pollTimer = setInterval(() => {
            if (popup.closed) {
              clearInterval(pollTimer);
              supabase.auth.getSession().then(({ data: { session } }) => {
                if (session?.user) navigate("/dashboard");
              });
            }

            // check session periodically
            supabase.auth.getSession().then(({ data: { session } }) => {
              if (session?.user) {
                clearInterval(pollTimer);
                if (!popup.closed) popup.close();
                navigate("/dashboard");
              }
            });
          }, 1500);
        }
      } else if (platform === "Steam") {
        setShowSteamModal(true);
      } else {
        setError(`${platform} login not implemented yet.`);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const submitManualSteam = () => {
    if (manualSteamId) {
      window.location.href = `/login?steamId=${manualSteamId}&loginSuccess=true`;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center relative overflow-hidden px-6 py-12">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-5">
        <div className="absolute top-10 left-10 text-[10px] font-mono vertical-text tracking-[1em]">
          SYSTEM ACTIVE REF 001
        </div>
        <div className="absolute bottom-10 right-10 text-[10px] font-mono vertical-text tracking-[1em]">
          SECURE CONNECTION
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[400px] font-black uppercase tracking-tighter opacity-20 leading-none select-none">
          {isRegistering ? "JOIN" : "HELLO"}
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
              {isRegistering ? "New Account Registration" : "Secure Login"}
            </span>
          </div>
          <h1 className="text-[80px] md:text-[120px] font-black uppercase tracking-tighter leading-[0.8] text-center">
            Pro<span className="text-primary italic">/</span>Gauge
            <br />
            <span className="text-3xl md:text-5xl tracking-widest opacity-40 block mt-4">
              Terminal 01
            </span>
          </h1>
        </div>

        {!isRegistering && (
          <div className="grid grid-cols-3 gap-4 mb-8">
            <SocialButton
              icon={<Chrome className="w-5 h-5" />}
              label="Google"
              onClick={() => handleSocialLogin("Google")}
            />
            <SocialButton
              icon={<Apple className="w-5 h-5" />}
              label="Apple"
              onClick={() => handleSocialLogin("Apple")}
            />
            <SocialButton
              icon={<SteamIcon />}
              label="Steam"
              onClick={() => handleSocialLogin("Steam")}
            />
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="bg-red-500/10 border border-red-500/20 p-4 flex items-center gap-3 text-red-500 text-[10px] font-mono uppercase tracking-widest"
            >
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}
          <div className="relative group">
            <input
              required
              type="text"
              placeholder={
                isRegistering ? "EMAIL ADDRESS" : "EMAIL OR USERNAME"
              }
              value={isRegistering ? email : ident}
              onChange={(e) =>
                isRegistering
                  ? setEmail(e.target.value)
                  : setIdent(e.target.value)
              }
              className="w-full bg-transparent border border-outline p-6 text-sm font-mono uppercase tracking-widest focus:outline-none focus:border-primary transition-colors placeholder:text-on-surface/40"
            />
            <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-20 group-focus-within:opacity-100 transition-opacity">
              <Mail className="w-4 h-4 text-primary" />
            </div>
          </div>

          {isRegistering && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="relative group"
            >
              <input
                required
                type="text"
                placeholder="USERNAME"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-transparent border border-outline p-6 text-sm font-mono uppercase tracking-widest focus:outline-none focus:border-primary transition-colors placeholder:text-on-surface/40"
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
              className="w-full bg-transparent border border-outline p-6 text-sm font-mono uppercase tracking-widest focus:outline-none focus:border-primary transition-all placeholder:text-on-surface/40"
            />
            <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-20 group-focus-within:opacity-100 transition-opacity">
              <Lock className="w-4 h-4 text-primary" />
            </div>
          </div>

          {isRegistering && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="relative group"
            >
              <input
                required
                type="password"
                placeholder="CONFIRM PASSWORD"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-transparent border border-outline p-6 text-sm font-mono uppercase tracking-widest focus:outline-none focus:border-primary transition-all placeholder:text-on-surface/40"
              />
              <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-20 group-focus-within:opacity-100 transition-opacity">
                <Shield className="w-4 h-4 text-primary" />
              </div>
            </motion.div>
          )}

          <button
            disabled={isLoading}
            className="w-full py-8 bg-on-surface text-background font-black uppercase tracking-[0.4em] hover:bg-primary transition-all flex items-center justify-center gap-4 group relative overflow-hidden"
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
                <span>{isRegistering ? "Confirm Registration" : "Login"}</span>
                <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform stroke-[3]" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 flex flex-col items-center gap-4">
          <button
            onClick={() => setIsRegistering(!isRegistering)}
            className="text-[10px] font-bold uppercase tracking-[0.3em] text-on-surface/60 hover:text-primary transition-all"
          >
            {isRegistering ? "Back to Login" : "Create New Account"}
          </button>

          <button
            onClick={() => navigate("/admin/login")}
            className="text-[9px] font-mono text-on-surface/40 hover:text-red-500 uppercase tracking-[0.5em] transition-all mt-4 flex items-center gap-2"
          >
            <Shield className="w-3 h-3" />
            <span>Admin Login Portal</span>
          </button>
        </div>

        <div className="mt-12 flex flex-wrap justify-center gap-12 border-t border-outline pt-12">
          <div className="flex flex-col items-center">
            <Shield className="w-5 h-5 text-on-surface/40 mb-2" />
            <span className="text-[9px] font-mono text-on-surface/40 uppercase tracking-widest italic font-serif">
              Encrypted Link
            </span>
          </div>
          <div className="flex flex-col items-center">
            <Zap className="w-5 h-5 text-on-surface/40 mb-2" />
            <span className="text-[9px] font-mono text-on-surface/40 uppercase tracking-widest italic font-serif">
              Fast Auth
            </span>
          </div>
        </div>
      </motion.div>

      {showSteamModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-6">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-surface-dim border border-outline w-full max-w-md p-8"
          >
            <h3 className="text-xl font-black uppercase tracking-widest text-primary mb-4">
              Steam Login
            </h3>
            <p className="text-sm font-mono text-on-surface/60 mb-6">
              For security, the best way to log in is via official Steam OpenID.
              Note: If you are in a preview iframe, Steam may block the login
              page. In that case, use the manual override or open the app in a
              new tab.
            </p>

            <button
              onClick={() => (window.location.href = "/api/auth/steam")}
              className="w-full py-4 bg-[#171a21] border border-[#66c0f4] text-white font-black uppercase mb-6 hover:bg-[#66c0f4] hover:text-black transition-colors"
            >
              Sign In Through Steam (OpenID)
            </button>

            <div className="relative flex py-2 items-center mb-6">
              <div className="flex-grow border-t border-outline"></div>
              <span className="flex-shrink-0 mx-4 text-on-surface/40 text-[10px] font-mono">
                OR MANUAL OVERRIDE
              </span>
              <div className="flex-grow border-t border-outline"></div>
            </div>

            <input
              type="text"
              placeholder="17-DIGIT STEAM ID"
              value={manualSteamId}
              onChange={(e) => setManualSteamId(e.target.value)}
              className="w-full bg-background border border-outline p-4 mb-6 text-on-surface font-mono"
            />

            <div className="flex gap-4">
              <button
                onClick={() => setShowSteamModal(false)}
                className="flex-[2] py-4 border border-outline text-on-surface/60 font-black uppercase hover:bg-surface-bright"
              >
                Cancel
              </button>
              <button
                onClick={submitManualSteam}
                className="flex-[3] py-4 bg-primary text-background font-black uppercase hover:bg-white"
              >
                Submit ID
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Bottom Footer Decor */}
      <div className="absolute bottom-10 w-full px-12 flex justify-between items-end text-[9px] font-mono text-on-surface/40 uppercase tracking-widest pointer-events-none">
        <div className="flex flex-col">
          <span>Local Node: 45.72 N / 122.41 W</span>
          <span className="mt-1">Handshake: Secure</span>
        </div>
        <span>© 2026 PRO-GAUGE INTNL.</span>
      </div>
    </div>
  );
}

function SocialButton({
  icon,
  label,
  onClick,
}: {
  icon: ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center justify-center p-4 border border-outline hover:border-primary hover:bg-surface-bright transition-all gap-2 group"
    >
      <div className="text-on-surface/40 group-hover:text-primary transition-colors">
        {icon}
      </div>
      <span className="text-[8px] font-bold uppercase tracking-widest text-on-surface/40 group-hover:text-on-surface/60">
        {label}
      </span>
    </button>
  );
}
