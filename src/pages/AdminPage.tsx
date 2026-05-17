import { Terminal, Shield, Activity, Users, Lock, Save, AlertTriangle, Cpu, User, Plus, Trash2 } from 'lucide-react';
import { useState, useEffect, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { db } from '../lib/firebase';
import { collection, onSnapshot, query, orderBy, limit, setDoc, doc, deleteDoc, serverTimestamp } from 'firebase/firestore';

export function AdminPage() {
  const [systemOnline, setSystemOnline] = useState(true);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [broadcastMessage, setBroadcastMessage] = useState('LIVE_PHASE_01_ACTIVE');
  const [activeNodes, setActiveNodes] = useState(42);
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'), limit(5));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const usersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUsers(usersData);
      setIsLoading(false);
    }, (error) => {
      console.error("Admin user sync failed:", error);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="space-y-xl animate-in fade-in duration-700 max-w-6xl mx-auto pb-24">
      {/* Admin Header */}
      <div className="border-b border-white/10 pb-8 md:pb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-8 md:gap-12">
        <div className="max-w-xl w-full">
          <div className="flex flex-wrap items-center gap-3 md:gap-4 mb-4">
            <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.3em] text-red-500 bg-red-500/10 px-2 md:px-3 py-1 border border-red-500/20">Elevated Privileges</span>
            <span className="text-[9px] md:text-[10px] font-mono text-white/40 uppercase tracking-widest">Root_Access_Granted</span>
          </div>
          <h2 className="text-[60px] sm:text-[80px] md:text-[100px] lg:text-[140px] leading-[0.8] md:leading-[0.7] font-black uppercase tracking-tighter transition-all break-words">
            Admi<span className="text-primary italic">n</span><br/>Consol<span className="text-primary">e</span>
          </h2>
        </div>
        <div className="flex md:hidden lg:flex flex-row md:flex-col items-center md:items-end gap-6 md:gap-4 text-right w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 border-white/5 pt-6 md:pt-0">
          <div className="flex flex-col items-end">
            <span className="text-[9px] font-mono text-white/40 uppercase tracking-widest">Core Temperature</span>
            <span className="text-2xl font-mono font-light italic text-primary">32°C</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[9px] font-mono text-white/40 uppercase tracking-widest">Auth_Token_TTL</span>
            <span className="text-2xl font-mono font-light italic text-white/60">02:59:59</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
        {/* System Controls */}
        <div className="md:col-span-8 space-y-12">
          <section className="border border-white/10 p-6 md:p-12 bg-white/[0.02]">
            <div className="flex items-center gap-4 mb-8 md:mb-12">
              <Terminal className="w-5 h-5 text-primary" />
              <h3 className="text-lg md:text-xl font-black uppercase tracking-widest">Global Directives</h3>
            </div>
            
            <div className="space-y-8 md:space-y-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                <div className="flex flex-col gap-4">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Broadcast_ID</label>
                  <input 
                    type="text" 
                    value={broadcastMessage}
                    onChange={(e) => setBroadcastMessage(e.target.value)}
                    className="bg-transparent border border-white/20 p-3 md:p-4 text-sm font-mono uppercase tracking-widest focus:outline-none focus:border-primary transition-colors text-white w-full"
                  />
                </div>
                <div className="flex flex-col gap-4">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Node_Capacity</label>
                  <div className="flex items-center gap-4 md:gap-6">
                    <input 
                      type="range" 
                      min="1" 
                      max="100" 
                      value={activeNodes}
                      onChange={(e) => setActiveNodes(parseInt(e.target.value))}
                      className="flex-grow accent-primary h-1 bg-white/10 appearance-none"
                    />
                    <span className="text-xl md:text-2xl font-mono italic text-primary min-w-[3ch] text-right">{activeNodes}</span>
                  </div>
                </div>
              </div>

              <div className="pt-8 md:pt-12 border-t border-white/10">
                <div className="w-full">
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-6 italic text-center md:text-left">Maintenance_State</h4>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 md:gap-12">
                    <button 
                      onClick={() => setMaintenanceMode(!maintenanceMode)}
                      className={`px-6 md:px-8 py-3 md:py-4 border font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-[10px] md:text-xs transition-all flex items-center justify-center gap-4 flex-1 ${maintenanceMode ? 'bg-red-500 border-red-500 text-white' : 'border-white/20 text-white/40 hover:border-white/60 hover:text-white'}`}
                    >
                      {maintenanceMode ? <AlertTriangle className="w-4 md:w-5 h-4 md:h-5" /> : null}
                      <span>{maintenanceMode ? 'Maintenance_Active' : 'Initialize_Maintenance'}</span>
                    </button>
                    <button 
                      onClick={() => setSystemOnline(!systemOnline)}
                      className={`px-6 md:px-8 py-3 md:py-4 border font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-[10px] md:text-xs transition-all flex items-center justify-center gap-4 flex-1 ${systemOnline ? 'bg-primary border-primary text-black' : 'border-red-500 bg-red-500/10 text-red-500'}`}
                    >
                      <Activity className="w-4 md:w-5 h-4 md:h-5" />
                      <span>{systemOnline ? 'System_Online' : 'System_Offline'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Admin Management */}
          <section className="border border-white/10 p-6 md:p-12 bg-white/[0.02]">
            <div className="flex items-center gap-4 mb-8 md:mb-12">
              <Shield className="w-5 h-5 text-primary" />
              <h3 className="text-lg md:text-xl font-black uppercase tracking-widest">Privilege Escalation</h3>
            </div>
            
            <AdminManager />
          </section>

          {/* Access Logs */}
          <section className="border border-white/10 overflow-hidden">
            <div className="p-8 bg-white/[0.02] border-b border-white/10 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <Activity className="w-4 h-4 text-white/40" />
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-white/60">Real-Time Access Logs</h3>
              </div>
              <span className="text-[8px] font-mono text-white/20">REF_ID: 99.102.8B</span>
            </div>
            <div className="divide-y divide-white/5 font-mono text-[10px] uppercase tracking-widest">
              {isLoading ? (
                <div className="p-12 text-center text-white/20 animate-pulse">Syncing_Records...</div>
              ) : users.map((u, i) => (
                <div key={u.id}>
                  <LogEntry 
                    time={u.createdAt?.toDate ? u.createdAt.toDate().toLocaleTimeString() : '00:00:00'} 
                    user={u.username} 
                    action="NODE_REGISTRATION" 
                    ip={u.email} 
                    uid={u.id}
                    status={i === 0 ? "NEW" : "SYNCED"}
                    color="text-primary"
                  />
                </div>
              ))}
              {!isLoading && users.length === 0 && (
                <div className="p-12 text-center text-white/20">No_Nodes_Registered</div>
              )}
            </div>
          </section>
        </div>

        {/* Sidebar Stats */}
        <div className="md:col-span-4 space-y-12">
          <div className="p-8 border border-white/10 bg-white text-black flex flex-col justify-between h-64 sm:h-80">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">Resource Load</span>
              <h4 className="text-3xl sm:text-4xl font-black uppercase tracking-tighter mt-4">Cluster_8</h4>
            </div>
            <div className="space-y-6">
              <StatBar label="CPU Load" value={84} />
              <StatBar label="Memory" value={62} />
              <StatBar label="Network" value={91} />
            </div>
          </div>

          <div className="p-8 border border-white/10 flex flex-col justify-between h-64 sm:h-80 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Cpu className="w-24 h-24 rotate-12 group-hover:rotate-0 transition-transform duration-1000" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Privilege Matrix</span>
              <p className="text-xs text-white/60 font-serif italic mt-6 leading-relaxed">
                Control the distribution of tactical resources across the global network architecture.
              </p>
            </div>
            <button className="w-full py-4 border border-white/20 hover:border-primary hover:text-primary transition-all font-black uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-4">
              <Save className="w-4 h-4" />
              <span>Commit Changes</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

interface LogEntryProps {
  time: string;
  user: string;
  action: string;
  ip?: string;
  uid?: string;
  status?: string;
  color?: string;
}

function AdminManager() {
  const [admins, setAdmins] = useState<any[]>([]);
  const [newUid, setNewUid] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<'root' | 'moderator'>('moderator');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [msg, setMsg] = useState<{ text: string, error?: boolean } | null>(null);

  useEffect(() => {
    const q = query(collection(db, 'admins'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setAdmins(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  const handleAddAdmin = async (e: FormEvent) => {
    e.preventDefault();
    if (!newUid || !newEmail) return;
    setIsSubmitting(true);
    setMsg(null);
    try {
      await setDoc(doc(db, 'admins', newUid), {
        userId: newUid,
        email: newEmail.toLowerCase().trim(),
        role: newRole,
        createdAt: serverTimestamp()
      });
      setNewUid('');
      setNewEmail('');
      setMsg({ text: 'PRVLILEGE_GRANTED: NODE_AUTHORIZED' });
    } catch (err: any) {
      setMsg({ text: err.message, error: true });
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeAdmin = async (uid: string) => {
    if (!confirm('CONFIRM_DE-AUTHORIZATION?')) return;
    try {
      await deleteDoc(doc(db, 'admins', uid));
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-8">
      <form onSubmit={handleAddAdmin} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">User_UID</label>
          <input 
            type="text" 
            placeholder="UID"
            value={newUid}
            onChange={(e) => setNewUid(e.target.value)}
            className="bg-transparent border border-white/20 p-3 text-xs font-mono uppercase focus:outline-none focus:border-primary transition-colors text-white w-full"
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Auth_Email</label>
          <input 
            type="email" 
            placeholder="EMAIL@DOMAIN.COM"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            className="bg-transparent border border-white/20 p-3 text-xs font-mono uppercase focus:outline-none focus:border-primary transition-colors text-white w-full"
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Privilege_Level</label>
          <select 
            value={newRole}
            onChange={(e) => setNewRole(e.target.value as any)}
            className="bg-black border border-white/20 p-3 text-xs font-mono uppercase focus:outline-none focus:border-primary transition-colors text-white w-full h-[42px]"
          >
            <option value="moderator">MODERATOR</option>
            <option value="root">ROOT</option>
          </select>
        </div>
        <button 
          disabled={isSubmitting}
          className="bg-primary text-black font-black uppercase tracking-widest p-3 text-xs hover:bg-white transition-all flex items-center justify-center gap-2 h-[42px] mt-2 sm:mt-0"
        >
          {isSubmitting ? 'WORKING...' : <><Plus className="w-4 h-4" /> <span>Elevate</span></>}
        </button>
      </form>

      {msg && (
        <div className={`text-[10px] font-mono uppercase tracking-[0.2em] px-4 py-2 border ${msg.error ? 'text-red-500 border-red-500/20 bg-red-500/5' : 'text-primary border-primary/20 bg-primary/5'}`}>
          {msg.text}
        </div>
      )}

      <div className="border border-white/10 overflow-hidden">
        <div className="divide-y divide-white/5 font-mono text-[9px] uppercase tracking-[0.2em]">
          {admins.map((admin) => (
            <div key={admin.id} className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center hover:bg-white/[0.03] gap-4">
              <div className="flex flex-wrap gap-4 md:gap-8 items-center w-full sm:w-auto">
                <span className={`px-2 py-0.5 border shrink-0 ${admin.role === 'root' ? 'border-red-500 text-red-500' : 'border-primary text-primary'}`}>
                  {admin.role}
                </span>
                <span className="text-white/60 truncate max-w-[200px] md:max-w-none">{admin.email}</span>
                <span className="text-white/20 hidden xl:block select-all cursor-crosshair">UID: {admin.userId}</span>
              </div>
              <button 
                onClick={() => removeAdmin(admin.userId)}
                className="text-white/20 hover:text-red-500 transition-colors p-2 self-end sm:self-auto"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function LogEntry({ time, user, action, ip, uid, status, color = "text-white/60", data }: LogEntryProps & { data?: any }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="flex flex-col bg-background border-b border-white/5 last:border-b-0">
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className="p-4 md:p-6 flex flex-col md:flex-row justify-between items-start md:items-center hover:bg-white/[0.03] transition-colors group gap-4 md:gap-6 min-h-[80px] cursor-pointer"
      >
        <div className="flex flex-wrap md:flex-nowrap gap-4 md:gap-8 items-center w-full md:w-auto">
          <span className="text-white/20 font-mono text-[8px] md:text-[10px] shrink-0 italic">[{time}]</span>
          <div className="flex flex-col min-w-[120px]">
            <span className="font-bold text-white/80 text-[10px] md:text-xs truncate uppercase tracking-widest">{user}</span>
            {uid && <span className="text-[7px] md:text-[8px] font-mono text-white/10 select-all cursor-pointer hover:text-primary transition-colors truncate max-w-[150px]">UID_{uid.slice(0, 8)}...</span>}
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-1 h-1 rounded-full ${isExpanded ? 'bg-primary' : 'bg-white/20'}`} />
            <span className={`${color} text-[10px] font-black tracking-[0.2em]`}>{action}</span>
          </div>
        </div>
        <div className="flex justify-between items-center w-full md:w-auto gap-4 md:gap-8 border-t md:border-t-0 border-white/5 pt-3 md:pt-0">
          <span className={`text-[8px] md:text-[10px] font-mono tracking-widest ${status === 'NEW' ? 'text-primary animate-pulse' : 'text-white/20'}`}>{status}</span>
          <span className="text-white/20 group-hover:text-white/40 transition-colors font-mono text-[8px] md:text-[10px] truncate max-w-[120px] md:max-w-none text-right italic">{ip}</span>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden bg-black/40 border-t border-white/5"
          >
            <div className="p-8 md:p-12 space-y-8">
              <div className="flex items-center justify-between">
                 <div className="flex items-center gap-3 text-primary/60">
                    <Terminal className="w-3 h-3" />
                    <span className="text-[9px] font-bold uppercase tracking-[0.3em]">Payload_Inspection</span>
                 </div>
                 <span className="text-[8px] font-mono text-white/10">FORMAT: JSON_STRICT</span>
              </div>
              <div className="bg-black/60 p-6 md:p-8 border border-white/5 font-mono text-[9px] md:text-xs leading-relaxed overflow-x-auto scrollbar-hide">
                 <pre className="text-primary/80">
{JSON.stringify({
  meta: {
    id: uid,
    username: user,
    sync_status: status,
    trace_time: time
  },
  capabilities: ["MFA_ACTIVE", "GEO_VERIFIED"],
  entry_point: "BEO_SERVER_NORTH_1",
  security_hash: "0x" + Math.random().toString(16).slice(2, 10).toUpperCase()
}, null, 2)}
                 </pre>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                 <button className="flex-1 py-3 border border-white/10 text-[9px] font-black uppercase tracking-[0.4em] text-white/40 hover:text-white hover:border-white transition-all">
                    Reset_Credentials
                 </button>
                 <button className="flex-1 py-3 border border-white/10 text-[9px] font-black uppercase tracking-[0.4em] text-white/40 hover:text-red-500 hover:border-red-500 transition-all">
                    Terminate_Session
                 </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function StatBar({ label, value }: { label: string, value: number }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-end text-[9px] font-bold uppercase tracking-widest">
        <span className="opacity-40">{label}</span>
        <span>{value}%</span>
      </div>
      <div className="h-1 w-full bg-black/10">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="h-full bg-black"
        />
      </div>
    </div>
  );
}
