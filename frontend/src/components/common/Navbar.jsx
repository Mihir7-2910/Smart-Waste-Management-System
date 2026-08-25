import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  MapPin,
  Truck,
  Flame,
  Building2,
  BarChart3,
  ShieldCheck,
  Award,
  Zap,
  Home,
  Camera,
  Search,
  Lock,
  LogOut,
  UserCheck,
  Sun,
  Moon
} from 'lucide-react';
import { useLanguage } from '../../i18n';

export function Navbar({
  currentUser,
  activeTab,
  setActiveTab,
  onOpenLoginModal,
  onLogout,
  onOpenKarma,
  onOpenTrackModal,
  pendingCount,
  searchingCount,
  theme,
  onToggleTheme
}) {
  const { language, setLanguage, t } = useLanguage();
  const [time, setTime] = useState(new Date().toLocaleTimeString('en-US', { hour12: true }));

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString('en-US', { hour12: true }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const isCitizen = !currentUser || currentUser.role === 'CITIZEN';
  const isAdmin = currentUser?.role === 'ADMIN';
  const isDriver = currentUser?.role === 'DRIVER';

  return (
    <header className="sticky top-0 z-50 bg-slate-950/85 backdrop-blur-xl border-b border-slate-800/80">
      {/* Top Banner / SIH Badging */}
      <div className="bg-gradient-to-r from-emerald-950/80 via-slate-950 to-purple-950/80 px-4 py-1 text-xs flex justify-between items-center text-slate-300 border-b border-slate-800/40">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 font-bold text-emerald-400">
            <Sparkles size={13} className="text-emerald-400 animate-spin" style={{ animationDuration: '6s' }} />
            SIH 2026 Prototype
          </span>
          <span className="hidden sm:inline text-slate-600">•</span>
          <span className="hidden sm:inline text-slate-400">
            {isCitizen ? 'CleanCity AI — Civic Waste Reporting Platform' : isAdmin ? 'Municipal Operations Control Tower' : 'Sanitation Driver Mobile Terminal'}
          </span>
        </div>
        <div className="flex items-center gap-3 font-mono text-[11px] text-slate-400">
          {isAdmin && (
            <span className="flex items-center gap-1.5 text-amber-400 font-bold">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
              Admin Control Mode
            </span>
          )}
          {isDriver && (
            <span className="flex items-center gap-1.5 text-blue-400 font-bold">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping"></span>
              Driver On Duty
            </span>
          )}
          {isCitizen && (
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              Civic Portal Active
            </span>
          )}
          <span>{time}</span>
        </div>
      </div>

      {/* Main Nav Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div
            onClick={() => {
              if (isCitizen) setActiveTab('citizen-home');
              else if (isAdmin) setActiveTab('admin');
              else if (isDriver) setActiveTab('driver');
            }}
            className="flex items-center gap-3 cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 border border-emerald-400/40">
              <Sparkles size={22} className="text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-heading font-black text-xl tracking-tight text-white">CleanCity</span>
                <span className="text-xs px-1.5 py-0.5 rounded-md font-extrabold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">AI</span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium tracking-wide">
                {isAdmin ? 'ADMIN CONSOLE' : isDriver ? 'DRIVER TERMINAL' : 'SMART WASTE PLATFORM'}
              </p>
            </div>
          </div>

          {/* 1. CITIZEN ONLY NAVIGATION TABS */}
          {isCitizen && (
            <nav className="hidden md:flex items-center gap-1 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800">
              <button
                onClick={() => setActiveTab('citizen-home')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'citizen-home'
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-600/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Home size={15} />
                <span>{t.home}</span>
              </button>

              <button
                onClick={() => setActiveTab('citizen-report')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'citizen-report'
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-600/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Camera size={15} />
                <span>{t.raiseComplaint}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  Quick
                </span>
              </button>

              <button
                onClick={onOpenTrackModal}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition-all cursor-pointer"
              >
                <Search size={15} className="text-emerald-400" />
                <span>{t.trackTicket}</span>
              </button>
            </nav>
          )}

          {/* 2. ADMIN ONLY NAVIGATION TABS */}
          {isAdmin && (
            <nav className="hidden lg:flex items-center gap-1 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800">
              <button
                onClick={() => setActiveTab('admin')}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'admin'
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Zap size={15} />
                <span>Control Tower</span>
                {searchingCount > 0 && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full font-bold bg-cyan-500 text-slate-950">
                    {searchingCount} Auto
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('hotspots')}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'hotspots'
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Flame size={15} />
                <span>AI Hotspots</span>
              </button>

              <button
                onClick={() => setActiveTab('society')}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'society'
                    ? 'bg-cyan-600 text-slate-950 font-bold shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Building2 size={15} />
                <span>Society Intel</span>
              </button>

              <button
                onClick={() => setActiveTab('analytics')}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'analytics'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <BarChart3 size={15} />
                <span>Analytics BI</span>
              </button>
            </nav>
          )}

          {/* 3. DRIVER ONLY NAVIGATION TABS */}
          {isDriver && (
            <nav className="hidden sm:flex items-center gap-1 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800">
              <span className="text-xs font-bold text-blue-400 px-3 py-1.5 flex items-center gap-1.5 bg-blue-500/10 rounded-xl border border-blue-500/30">
                <Truck size={15} />
                <span>{currentUser.name} ({currentUser.vehicleReg})</span>
              </span>
            </nav>
          )}

          {/* Right Action Controls */}
          <div className="flex items-center gap-2.5">
            <label className="flex items-center rounded-xl border border-slate-700 bg-slate-900 px-2.5 py-2 text-xs text-slate-300">
              <span className="sr-only">{t.language}</span>
              <select
                value={language}
                onChange={(event) => setLanguage(event.target.value)}
                aria-label={t.language}
                className="max-w-[92px] cursor-pointer bg-transparent font-semibold text-slate-200 outline-none"
              >
                <option value="en">English</option>
                <option value="hi">हिन्दी</option>
                <option value="gu">ગુજરાતી</option>
              </select>
            </label>
            <button
              onClick={onToggleTheme}
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              className="theme-toggle rounded-xl border border-slate-700 bg-slate-900 px-2.5 py-2 text-slate-300 transition-all hover:border-emerald-500/50 hover:text-emerald-400 cursor-pointer"
            >
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            {/* Karma button (citizen mode) */}
            {isCitizen && (
              <button
                onClick={onOpenKarma}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-bold transition-all cursor-pointer"
              >
                <Award size={16} className="text-amber-400" />
                <span className="hidden sm:inline">Karma</span>
                <span className="bg-amber-500 text-slate-950 px-1.5 py-0.2 rounded-full text-[10px] font-black">840 XP</span>
              </button>
            )}

            {/* If Citizen -> Show "Staff / Municipal Login" Button */}
            {isCitizen && (
              <button
                onClick={onOpenLoginModal}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 hover:border-amber-500/50 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <Lock size={14} className="text-amber-400" />
                <span>{t.staffLogin}</span>
              </button>
            )}

            {/* If Admin or Driver -> Show "Log Out" Button */}
            {!isCitizen && (
              <button
                onClick={onLogout}
                className="px-3.5 py-2 rounded-xl bg-rose-950/40 hover:bg-rose-950/70 text-rose-300 border border-rose-500/40 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <LogOut size={14} />
                <span>{t.logout}</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Citizen Navigation Bar */}
        {isCitizen && (
          <div className="flex md:hidden overflow-x-auto py-2 gap-1.5 border-t border-slate-800/60 no-scrollbar">
            <button
              onClick={() => setActiveTab('citizen-home')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap cursor-pointer ${
                activeTab === 'citizen-home'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-900 text-slate-400 border border-slate-800'
              }`}
            >
              <Home size={14} />
              <span>{t.home}</span>
            </button>
            <button
              onClick={() => setActiveTab('citizen-report')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap cursor-pointer ${
                activeTab === 'citizen-report'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-900 text-slate-400 border border-slate-800'
              }`}
            >
              <Camera size={14} />
              <span>{t.raiseComplaint}</span>
            </button>
            <button
              onClick={onOpenTrackModal}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap bg-slate-900 text-slate-400 border border-slate-800 cursor-pointer"
            >
              <Search size={14} className="text-emerald-400" />
              <span>{t.trackTicket}</span>
            </button>
          </div>
        )}

        {/* Mobile Admin Navigation Bar */}
        {isAdmin && (
          <div className="flex lg:hidden overflow-x-auto py-2 gap-1.5 border-t border-slate-800/60 no-scrollbar">
            <button
              onClick={() => setActiveTab('admin')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap cursor-pointer ${
                activeTab === 'admin' ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-900 text-slate-400 border border-slate-800'
              }`}
            >
              <Zap size={14} />
              <span>Control Tower</span>
            </button>
            <button
              onClick={() => setActiveTab('hotspots')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap cursor-pointer ${
                activeTab === 'hotspots' ? 'bg-purple-600 text-white' : 'bg-slate-900 text-slate-400 border border-slate-800'
              }`}
            >
              <Flame size={14} />
              <span>AI Hotspots</span>
            </button>
            <button
              onClick={() => setActiveTab('society')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap cursor-pointer ${
                activeTab === 'society' ? 'bg-cyan-600 text-slate-950' : 'bg-slate-900 text-slate-400 border border-slate-800'
              }`}
            >
              <Building2 size={14} />
              <span>Society Intel</span>
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap cursor-pointer ${
                activeTab === 'analytics' ? 'bg-emerald-600 text-white' : 'bg-slate-900 text-slate-400 border border-slate-800'
              }`}
            >
              <BarChart3 size={14} />
              <span>Analytics BI</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
