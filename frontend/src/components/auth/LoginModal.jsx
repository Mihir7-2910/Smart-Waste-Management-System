import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  Truck,
  Lock,
  User,
  KeyRound,
  ArrowRight,
  Sparkles,
  AlertCircle,
  Check
} from 'lucide-react';
import { INITIAL_DRIVERS } from '../../data/mockData';

export function LoginModal({ isOpen, onClose, onLoginSuccess }) {
  const [roleTab, setRoleTab] = useState('ADMIN'); // ADMIN, DRIVER
  const [adminEmail, setAdminEmail] = useState('admin@cleancity.gov.in');
  const [adminPassword, setAdminPassword] = useState('admin123');
  const [selectedDriverId, setSelectedDriverId] = useState('DRV-01');
  const [driverPin, setDriverPin] = useState('1234');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleAdminSubmit = (e) => {
    e.preventDefault();
    if (adminEmail && adminPassword) {
      onLoginSuccess({
        role: 'ADMIN',
        name: 'Municipal Commissioner / Admin',
        email: adminEmail,
        token: 'jwt_admin_token_sih2026'
      });
      onClose();
    } else {
      setError('Please enter valid admin credentials.');
    }
  };

  const handleDriverSubmit = (e) => {
    e.preventDefault();
    const drv = INITIAL_DRIVERS.find((d) => d.id === selectedDriverId) || INITIAL_DRIVERS[0];
    onLoginSuccess({
      role: 'DRIVER',
      driverId: drv.id,
      name: drv.name,
      vehicleId: drv.vehicleId,
      vehicleReg: drv.vehicleReg,
      vehicleType: drv.vehicleType,
      phone: drv.phone,
      token: `jwt_driver_${drv.id}_token`
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl max-w-md w-full overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex justify-between items-center bg-slate-950/70">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
              <Lock size={20} />
            </div>
            <div>
              <h3 className="font-heading font-bold text-lg text-white">Municipal Staff Login</h3>
              <p className="text-xs text-slate-400">Restricted access for City Admin & Sanitation Drivers</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-all cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Role Switcher Tabs */}
        <div className="p-4 bg-slate-950/40 border-b border-slate-800">
          <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1 rounded-2xl border border-slate-800">
            <button
              onClick={() => {
                setRoleTab('ADMIN');
                setError('');
              }}
              className={`py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                roleTab === 'ADMIN'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ShieldCheck size={15} />
              <span>Admin Control Tower</span>
            </button>

            <button
              onClick={() => {
                setRoleTab('DRIVER');
                setError('');
              }}
              className={`py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                roleTab === 'DRIVER'
                  ? 'bg-blue-500 text-slate-950 shadow-md font-extrabold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Truck size={15} />
              <span>Driver Terminal</span>
            </button>
          </div>
        </div>

        {/* Login Forms */}
        <div className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-rose-950/40 border border-rose-500/30 rounded-xl text-xs text-rose-300 flex items-center gap-2">
              <AlertCircle size={15} />
              <span>{error}</span>
            </div>
          )}

          {/* ADMIN FORM */}
          {roleTab === 'ADMIN' && (
            <form onSubmit={handleAdminSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                  Municipal Admin Email:
                </label>
                <div className="relative">
                  <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 font-mono transition-all"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                  Admin Security Password:
                </label>
                <div className="relative">
                  <KeyRound size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 font-mono transition-all"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-heading font-black text-xs shadow-xl shadow-amber-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                <ShieldCheck size={16} />
                <span>Sign In to Admin Control Tower</span>
              </button>

              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-[11px] text-slate-400 text-center">
                Demo Credentials: <code className="text-amber-400 font-mono">admin@cleancity.gov.in</code> / <code className="text-amber-400 font-mono">admin123</code>
              </div>
            </form>
          )}

          {/* DRIVER FORM */}
          {roleTab === 'DRIVER' && (
            <form onSubmit={handleDriverSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                  Select Sanitation Driver Profile:
                </label>
                <select
                  value={selectedDriverId}
                  onChange={(e) => setSelectedDriverId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500 font-medium"
                >
                  {INITIAL_DRIVERS.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.vehicleReg} • {d.vehicleType})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                  Driver Terminal 4-Digit PIN:
                </label>
                <div className="relative">
                  <KeyRound size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="password"
                    maxLength={4}
                    value={driverPin}
                    onChange={(e) => setDriverPin(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono tracking-widest transition-all"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-400 hover:to-indigo-400 text-slate-950 font-heading font-black text-xs shadow-xl shadow-blue-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                <Truck size={16} />
                <span>Launch Driver Field Terminal</span>
              </button>

              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-[11px] text-slate-400 text-center">
                Demo Quick PIN: <code className="text-blue-400 font-mono">1234</code>
              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-all cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
