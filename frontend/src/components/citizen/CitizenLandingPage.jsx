import React, { useState, useEffect } from 'react';
import {
  Camera,
  Search,
  Sparkles,
  Award,
  CheckCircle2,
  TrendingUp,
  ShieldCheck,
  MapPin,
  ArrowRight,
  RefreshCw,
  Heart,
  Users,
  Flame,
  Truck,
  Building2,
  ChevronRight,
  MessageSquare
} from 'lucide-react';
import {
  CLEANLINESS_QUOTES,
  AWARENESS_POSTERS,
  CLEAN_CITY_TIPS,
  COMMUNITY_IMPACT
} from '../../data/mockData';

export function CitizenLandingPage({ onRaiseComplaint, onTrackComplaint, onOpenKarma, activeComplaintsCount }) {
  const [quoteIndex, setQuoteIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % CLEANLINESS_QUOTES.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const currentQuote = CLEANLINESS_QUOTES[quoteIndex];

  return (
    <div className="space-y-12 animate-fadeIn pb-12">
      {/* Hero Section */}
      <section className="relative rounded-3xl bg-gradient-to-br from-emerald-950/80 via-slate-900 to-teal-950/80 border border-emerald-500/30 p-8 sm:p-12 overflow-hidden shadow-2xl">
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20"></div>

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs font-bold text-emerald-400">
            <Sparkles size={14} className="animate-spin" style={{ animationDuration: '6s' }} />
            <span>SIH 2026 Smart Waste Response Platform</span>
          </div>

          <h1 className="font-heading font-black text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight leading-tight">
            Together, We Keep <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-300">
              Our City Clean & Green.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 font-medium">
            “See waste. Report it. Help us resolve it.” <br className="hidden sm:inline" />
            CleanCity AI automatically connects your report with the nearest municipal sanitation vehicle within seconds.
          </p>

          {/* Primary & Secondary CTAs */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={onRaiseComplaint}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-heading font-extrabold text-base shadow-xl shadow-emerald-500/30 transition-all transform hover:-translate-y-0.5 flex items-center gap-2.5 cursor-pointer"
            >
              <Camera size={20} />
              <span>Raise a Complaint</span>
            </button>

            <button
              onClick={onTrackComplaint}
              className="px-6 py-4 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-white font-heading font-bold text-sm border border-slate-700 hover:border-slate-600 transition-all flex items-center gap-2 cursor-pointer shadow-lg"
            >
              <Search size={18} className="text-emerald-400" />
              <span>Track My Complaint</span>
            </button>
          </div>

          {/* SLA Badge */}
          <div className="flex items-center gap-4 pt-4 text-xs text-slate-400 font-medium border-t border-slate-800/80">
            <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <ShieldCheck size={16} />
              <span>4-Hour Municipal SLA Guarantee</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1.5 text-slate-300">
              <MessageSquare size={14} className="text-green-400" />
              <span>Instant Digital WhatsApp Receipt</span>
            </div>
          </div>
        </div>
      </section>

      {/* Rotating Cleanliness Quote of the Day */}
      <section className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center justify-center flex-shrink-0 text-xl font-serif font-black">
            “
          </div>
          <div>
            <p className="text-sm font-semibold text-white italic">
              "{currentQuote.quote}"
            </p>
            <span className="text-xs text-slate-400 block mt-0.5 font-medium">
              — {currentQuote.author}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => setQuoteIndex((prev) => (prev + 1) % CLEANLINESS_QUOTES.length)}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all text-xs font-bold flex items-center gap-1 cursor-pointer"
            title="Next Quote"
          >
            <RefreshCw size={14} />
            <span>Next Tip</span>
          </button>
        </div>
      </section>

      {/* Cleanliness Awareness Posters (Digital Cards) */}
      <section className="space-y-4">
        <div className="flex justify-between items-end">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 block mb-1">
              Public Cleanliness Campaign
            </span>
            <h2 className="font-heading font-extrabold text-2xl text-white">
              Civic Cleanliness Awareness
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {AWARENESS_POSTERS.map((poster) => (
            <div
              key={poster.id}
              className={`rounded-3xl p-6 border ${poster.borderColor} bg-gradient-to-br ${poster.bgGradient} shadow-xl hover:shadow-2xl transition-all space-y-4 flex flex-col justify-between group`}
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <span className="text-3xl">{poster.icon}</span>
                  <span className={`text-[10px] uppercase font-mono font-bold px-2.5 py-0.5 rounded-full bg-slate-950/80 border border-slate-800 ${poster.textColor}`}>
                    {poster.tag}
                  </span>
                </div>
                <h3 className="font-heading font-black text-lg text-white group-hover:text-emerald-300 transition-colors">
                  {poster.title}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {poster.desc}
                </p>
              </div>

              {poster.id === 'post-5' && (
                <button
                  onClick={onRaiseComplaint}
                  className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-heading font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer mt-2"
                >
                  <Camera size={14} />
                  <span>Report Now & Earn Karma</span>
                </button>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Clean City Tips (Compact Cards) */}
      <section className="space-y-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-teal-400 block mb-1">
            Everyday Habits
          </span>
          <h2 className="font-heading font-extrabold text-2xl text-white">
            Clean City Best Practices
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {CLEAN_CITY_TIPS.map((tip, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800/80 hover:border-slate-700 transition-all flex items-start gap-3.5"
            >
              <span className="text-2xl flex-shrink-0 mt-0.5">{tip.icon}</span>
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-white">{tip.title}</h4>
                <p className="text-[11px] text-slate-400 leading-normal">{tip.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Community Impact Statistics */}
      <section className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-800 pb-4">
          <div>
            <h3 className="font-heading font-extrabold text-xl text-white">
              Civic Community Impact
            </h3>
            <p className="text-xs text-slate-400">Real-time municipal grievance resolution metrics for SIH 2026</p>
          </div>
          <button
            onClick={onOpenKarma}
            className="text-xs font-bold text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 px-3 py-1.5 rounded-xl border border-amber-500/30 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Award size={15} />
            <span>View Citizen Leaderboard</span>
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400">Total Grievances Logged</span>
            <p className="text-2xl font-black text-white font-heading">{COMMUNITY_IMPACT.issuesReported}</p>
            <span className="text-[10px] text-slate-500">Across 12 City Wards</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/70 border border-emerald-500/30 space-y-1">
            <span className="text-[10px] uppercase font-bold text-emerald-400">Successfully Cleaned</span>
            <p className="text-2xl font-black text-emerald-400 font-heading">{COMMUNITY_IMPACT.issuesResolved}</p>
            <span className="text-[10px] text-emerald-400 font-bold">{COMMUNITY_IMPACT.resolutionRate} Resolution Rate</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400">Average Turnaround</span>
            <p className="text-2xl font-black text-cyan-400 font-heading">{COMMUNITY_IMPACT.avgResponseHours}</p>
            <span className="text-[10px] text-cyan-400 font-semibold">Well within 4.0 hr SLA</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400">Active Compactors / Tippers</span>
            <p className="text-2xl font-black text-purple-400 font-heading">{COMMUNITY_IMPACT.activeSanitationFleet}</p>
            <span className="text-[10px] text-slate-500">GPS Automated Fleet</span>
          </div>
        </div>
      </section>

      {/* Bottom Floating CTA Banner */}
      <section className="rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 p-8 shadow-2xl text-center space-y-4 text-slate-950">
        <h3 className="font-heading font-black text-2xl sm:text-3xl text-slate-950">
          Spot Garbage in Your Neighbourhood?
        </h3>
        <p className="text-xs sm:text-sm font-medium text-slate-900 max-w-xl mx-auto">
          Capture photo, drop a pin, and our automated dispatch algorithm assigns the nearest compactor vehicle instantly.
        </p>
        <div className="pt-2">
          <button
            onClick={onRaiseComplaint}
            className="px-8 py-3.5 rounded-2xl bg-slate-950 hover:bg-slate-900 text-white font-heading font-black text-sm shadow-xl transition-all inline-flex items-center gap-2 cursor-pointer"
          >
            <Camera size={18} className="text-emerald-400" />
            <span>Report Waste Problem Now</span>
          </button>
        </div>
      </section>
    </div>
  );
}
