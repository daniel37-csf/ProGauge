import { Terminal, Shield, Activity, Users, Lock, Save, AlertTriangle, Cpu } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'motion/react';

export function AdminPage() {
  const [systemOnline, setSystemOnline] = useState(true);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [broadcastMessage, setBroadcastMessage] = useState('LIVE_PHASE_01_ACTIVE');
  const [activeNodes, setActiveNodes] = useState(42);

  return (
    <div className="space-y-xl animate-in fade-in duration-700 max-w-6xl mx-auto pb-24">
      {/* Admin Header */}
      <div className="border-b border-white/10 pb-12 flex flex-col md:flex-row justify-between items-end gap-12">
        <div className="max-w-xl">
          <div className="flex items-center gap-4 mb-4">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-red-500 bg-red-500/10 px-3 py-1 border border-red-500/20">Elevated Privileges</span>
            <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Root_Access_Granted</span>
          </div>
          <h2 className="text-[80px] md:text-[100px] lg:text-[140px] leading-[0.7] font-black uppercase tracking-tighter transition-all">
            Admi<span className="text-primary italic">n</span><br/>Consol<span className="text-primary">e</span>
          </h2>
        </div>
        <div className="hidden lg:flex flex-col items-end gap-4 text-right">
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
          <section className="border border-white/10 p-12 bg-white/[0.02]">
            <div className="flex items-center gap-4 mb-12">
              <Terminal className="w-5 h-5 text-primary" />
              <h3 className="text-xl font-black uppercase tracking-widest">Global Directives</h3>
            </div>
            
            <div className="space-y-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="flex flex-col gap-4">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Broadcast_ID</label>
                  <input 
                    type="text" 
                    value={broadcastMessage}
                    onChange={(e) => setBroadcastMessage(e.target.value)}
                    className="bg-transparent border border-white/20 p-4 text-sm font-mono uppercase tracking-widest focus:outline-none focus:border-primary transition-colors text-white"
                  />
                </div>
                <div className="flex flex-col gap-4">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Node_Capacity</label>
                  <div className="flex items-center gap-6">
                    <input 
                      type="range" 
                      min="1" 
                      max="100" 
                      value={activeNodes}
                      onChange={(e) => setActiveNodes(parseInt(e.target.value))}
                      className="flex-grow accent-primary h-1 bg-white/10 appearance-none"
                    />
                    <span className="text-2xl font-mono italic text-primary">{activeNodes}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-12 pt-12 border-t border-white/10">
                <div className="flex-grow">
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-4 italic">Maintenance_State</h4>
                  <div className="flex items-center gap-12">
                    <button 
                      onClick={() => setMaintenanceMode(!maintenanceMode)}
                      className={`px-8 py-4 border font-black uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-4 ${maintenanceMode ? 'bg-red-500 border-red-500 text-white' : 'border-white/20 text-white/40 hover:border-white/60 hover:text-white'}`}
                    >
                      {maintenanceMode ? <AlertTriangle className="w-5 h-5" /> : null}
                      <span>{maintenanceMode ? 'Maintenance_Active' : 'Initialize_Maintenance'}</span>
                    </button>
                    <button 
                      onClick={() => setSystemOnline(!systemOnline)}
                      className={`px-8 py-4 border font-black uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-4 ${systemOnline ? 'bg-primary border-primary text-black' : 'border-red-500 bg-red-500/10 text-red-500'}`}
                    >
                      <Activity className="w-5 h-5" />
                      <span>{systemOnline ? 'System_Online' : 'System_Offline'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
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
              <LogEntry time="02:44:12" user="Vanguard_01" action="NODE_SYNC_SUCCESS" ip="192.168.1.102" />
              <LogEntry time="02:43:55" user="Ghost_Shell" action="HANDSHAKE_INITIATED" ip="45.1.22.84" />
              <LogEntry time="02:38:01" user="SYSTEM" action="ENCRYPTION_REKEY" status="SECURE" />
              <LogEntry time="02:12:44" user="Specter_09" action="ACCESS_DENIED" status="FAILED" color="text-red-500" />
              <LogEntry time="01:55:20" user="Root_Admin" action="CONFIG_OVERRIDE" status="ELEVATED" color="text-primary" />
            </div>
          </section>
        </div>

        {/* Sidebar Stats */}
        <div className="md:col-span-4 space-y-12">
          <div className="p-8 border border-white/10 bg-white text-black flex flex-col justify-between h-80">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">Resource Load</span>
              <h4 className="text-4xl font-black uppercase tracking-tighter mt-4">Cluster_8</h4>
            </div>
            <div className="space-y-6">
              <StatBar label="CPU Load" value={84} />
              <StatBar label="Memory" value={62} />
              <StatBar label="Network" value={91} />
            </div>
          </div>

          <div className="p-8 border border-white/10 flex flex-col justify-between h-80 relative overflow-hidden group">
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

function LogEntry({ time, user, action, ip, status, color = "text-white/60" }: { time: string, user: string, action: string, ip?: string, status?: string, color?: string }) {
  return (
    <div className="p-6 flex justify-between items-center bg-background hover:bg-white/[0.03] transition-colors group">
      <div className="flex gap-8 items-center">
        <span className="text-white/20">{time}</span>
        <span className="font-bold text-white/80 w-32">{user}</span>
        <span className={color}>{action}</span>
      </div>
      <span className="text-white/20 group-hover:text-white/40 transition-colors">{ip || status}</span>
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
