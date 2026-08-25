import React, { useState, useEffect } from 'react';
import {
  ArrowRight,
  Award,
  BellRing,
  Camera,
  CheckCircle2,
  CircleDashed,
  MapPinned,
  MessageSquare,
  RefreshCw,
  Search,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Truck,
  Users
} from 'lucide-react';
import {
  AWARENESS_POSTERS,
  CLEAN_CITY_TIPS,
  COMMUNITY_IMPACT
} from '../../data/mockData';
import cleanCityImage from '../../assets/clean-city.jpg';
import { useLanguage } from '../../i18n';

export function CitizenLandingPage({ onRaiseComplaint, onTrackComplaint, onOpenKarma, activeComplaintsCount }) {
  const { t } = useLanguage();
  const copy = t;
    const [quoteIndex, setQuoteIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % copy.quotes.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [copy.quotes.length]);

  const currentQuote = { quote: copy.quotes[quoteIndex][0], author: copy.quotes[quoteIndex][1] };

  const features = [
    { icon: <MapPinned className="h-5 w-5 text-emerald-300" />, title: copy.features[0][0], description: copy.features[0][1] },
    { icon: <Truck className="h-5 w-5 text-cyan-300" />, title: copy.features[1][0], description: copy.features[1][1] },
    { icon: <BellRing className="h-5 w-5 text-amber-300" />, title: copy.features[2][0], description: copy.features[2][1] }
  ];

  const steps = [
    { number: '01', title: copy.steps[0][0], description: copy.steps[0][1] },
    { number: '02', title: copy.steps[1][0], description: copy.steps[1][1] },
    { number: '03', title: copy.steps[2][0], description: copy.steps[2][1] }
  ];

  const posters = AWARENESS_POSTERS.map((poster, index) => ({ ...poster, tag: copy.posters[index][0], title: copy.posters[index][1], desc: copy.posters[index][2] }));
  const tips = CLEAN_CITY_TIPS.map((tip, index) => ({ ...tip, title: copy.tips[index][0], desc: copy.tips[index][1] }));

  return (
    <div
      className="landing-page space-y-8 animate-fadeIn pb-12"
      style={{
        '--landing-wallpaper': `url('${cleanCityImage}')`,
        backgroundImage:
          `linear-gradient(rgba(2, 6, 23, 0.72), rgba(2, 6, 23, 0.82)), url('${cleanCityImage}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <section
        className="landing-hero relative overflow-hidden rounded-[28px] border border-emerald-500/25 p-6 shadow-[0_30px_90px_rgba(16,185,129,0.16)] sm:p-8 lg:p-10"
        style={{
          backgroundImage:
            `linear-gradient(135deg, rgba(2, 6, 23, 0.84), rgba(8, 47, 73, 0.7), rgba(2, 44, 34, 0.82)), url('${cleanCityImage}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(16,185,129,0.24),_transparent_35%),radial-gradient(circle_at_bottom_left,_rgba(34,211,238,0.18),_transparent_32%)]" />
        <div className="absolute -right-12 top-10 h-40 w-40 rounded-full bg-emerald-400/10 blur-3xl" />
        <div className="absolute -left-12 bottom-12 h-40 w-40 rounded-full bg-cyan-400/10 blur-3xl" />

        <div className="relative z-10 grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-emerald-300">
              <Sparkles size={14} className="animate-pulse" />
              {t.smartWasteResponse}
            </div>

            <div className="space-y-4">
              <h1 className="landing-hero-title text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
                {t.cleanerStreets}
                <span className="block bg-gradient-to-r from-emerald-300 via-teal-200 to-cyan-300 bg-clip-text text-transparent">
                  {t.fasterAction}
                </span>
              </h1>
              <p className="landing-hero-copy max-w-xl text-base text-slate-300 sm:text-lg">
                {t.reportIntro}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onRaiseComplaint}
                className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-400 px-6 py-3.5 text-sm font-extrabold text-slate-950 shadow-lg shadow-emerald-500/25 transition hover:-translate-y-0.5 hover:shadow-emerald-400/35"
              >
                <Camera size={18} />
                {t.raiseComplaint}
              </button>

              <button
                onClick={onTrackComplaint}
                className="inline-flex items-center gap-2 rounded-2xl border border-slate-700 bg-slate-900/80 px-5 py-3.5 text-sm font-bold text-slate-100 transition hover:border-emerald-500/40 hover:bg-slate-800"
              >
                <Search size={18} className="text-emerald-300" />
                {t.trackComplaint}
              </button>
            </div>

            <div className="flex flex-wrap gap-4 border-t border-slate-800/80 pt-4 text-xs text-slate-400">
              <span className="inline-flex items-center gap-2 text-emerald-300">
                <ShieldCheck size={15} />
                {t.sla}
              </span>
              <span className="inline-flex items-center gap-2 text-slate-300">
                <MessageSquare size={15} className="text-green-400" />
                {t.whatsapp}
              </span>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-[24px] border border-slate-700/80 bg-slate-950/75 p-4 shadow-2xl backdrop-blur-xl">
              <div className="mb-4 flex items-center justify-between rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-3 py-2">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-emerald-300">{t.liveStatus}</p>
                  <p className="mt-1 text-lg font-bold text-white">{t.cityOnline}</p>
                </div>
                <span className="flex h-3 w-3 rounded-full bg-emerald-400 shadow-[0_0_18px_rgba(52,211,153,0.9)]" />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">{t.openComplaints}</p>
                  <p className="mt-2 text-3xl font-black text-white">{activeComplaintsCount ?? 128}</p>
                  <p className="mt-1 text-xs text-emerald-300">{copy.wards}</p>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">{copy.avgResponse}</p>
                  <p className="mt-2 text-3xl font-black text-cyan-300">2.8h</p>
                  <p className="mt-1 text-xs text-cyan-300">{copy.targetSla}</p>
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.15em] text-slate-400">{t.priorityQueue}</p>
                    <p className="mt-1 text-sm font-semibold text-white">{copy.priorityIssue}</p>
                  </div>
                  <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-1 text-[10px] font-bold text-amber-300">
                    {t.high}
                  </span>
                </div>
                <div className="mt-4 h-2 rounded-full bg-slate-800">
                  <div className="h-2 w-3/4 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-[26px] border border-slate-800 bg-slate-900/75 p-5 shadow-xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-amber-500/30 bg-amber-500/10 text-xl font-black text-amber-300">“</div>
            <div>
              <p className="text-sm font-medium italic text-slate-100">"{currentQuote.quote}"</p>
              <span className="mt-1 block text-xs text-slate-400">— {currentQuote.author}</span>
            </div>
          </div>

          <button
            onClick={() => setQuoteIndex((prev) => (prev + 1) % copy.quotes.length)}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-950/80 px-3 py-2 text-xs font-bold text-slate-200 transition hover:border-emerald-500/40 hover:text-white"
          >
            <RefreshCw size={14} />
            {t.nextTip}
          </button>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-300">{copy.betterOperations}</p>
            <h2 className="mt-1 text-2xl font-black text-white">{t.howItWorks}</h2>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {steps.map((step) => (
            <div key={step.number} className="workflow-card rounded-[22px] border border-slate-800 bg-slate-900/70 p-5 shadow-lg transition hover:-translate-y-1 hover:border-emerald-500/35">
              <div className="mb-4 inline-flex items-center justify-center rounded-xl border border-emerald-500/35 bg-emerald-500/10 px-2.5 py-1.5 text-xs font-black text-emerald-300">
                {step.number}
              </div>
              <h3 className="text-xl font-black text-white">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        {features.map((feature) => (
          <div key={feature.title} className="feature-card rounded-[24px] border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-5 shadow-xl">
            <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-700 bg-slate-900">{feature.icon}</div>
            <h3 className="text-lg font-black text-white">{feature.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">{feature.description}</p>
          </div>
        ))}
      </section>

      <section className="space-y-4">
        <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-300">{copy.publicAwareness}</p>
            <h2 className="mt-1 text-2xl font-black text-white">{copy.awarenessTitle}</h2>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {posters.map((poster) => (
            <div key={poster.id} className={`awareness-card rounded-[24px] border p-5 ${poster.borderColor} bg-gradient-to-br ${poster.bgGradient} shadow-lg`}>
              <div className="flex items-start justify-between gap-3">
                <span className="text-3xl">{poster.icon}</span>
                <span className={`rounded-full border border-slate-800 bg-slate-950/80 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.12em] ${poster.textColor}`}>
                  {poster.tag}
                </span>
              </div>
              <h3 className="mt-4 text-xl font-black text-white">{poster.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-300">{poster.desc}</p>

              {poster.id === 'post-5' && (
                <button
                  onClick={onRaiseComplaint}
                  className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-amber-400 px-3 py-2.5 text-sm font-black text-slate-950 transition hover:bg-amber-300"
                >
                  <Camera size={15} />
                  {copy.reportNow}
                </button>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-300">{copy.everydayHabits}</p>
          <h2 className="mt-1 text-2xl font-black text-white">{copy.habitsTitle}</h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {tips.map((tip, idx) => (
            <div key={idx} className="habit-card flex gap-3 rounded-[22px] border border-slate-800 bg-slate-900/70 p-4">
              <span className="text-2xl">{tip.icon}</span>
              <div>
                <h4 className="text-sm font-bold text-white">{tip.title}</h4>
                <p className="mt-1 text-xs leading-relaxed text-slate-400">{tip.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[28px] border border-slate-800 bg-slate-900/80 p-6 shadow-2xl">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-300">{copy.communityImpact}</p>
            <h3 className="mt-1 text-2xl font-black text-white">{copy.cityMetrics}</h3>
          </div>
          <button
            onClick={onOpenKarma}
            className="inline-flex items-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs font-bold text-amber-300 transition hover:bg-amber-500/15"
          >
            <Award size={15} />
            {copy.viewLeaderboard}
          </button>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
            <p className="text-[10px] uppercase tracking-[0.18em] text-slate-400">{copy.grievancesLogged}</p>
            <p className="mt-2 text-3xl font-black text-white">{COMMUNITY_IMPACT.issuesReported}</p>
            <p className="mt-1 text-xs text-slate-500">{copy.wards}</p>
          </div>

          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4">
            <p className="text-[10px] uppercase tracking-[0.18em] text-emerald-300">{copy.cleaned}</p>
            <p className="mt-2 text-3xl font-black text-emerald-300">{COMMUNITY_IMPACT.issuesResolved}</p>
            <p className="mt-1 text-xs text-emerald-200">{COMMUNITY_IMPACT.resolutionRate} {copy.resolutionRate}</p>
          </div>

          <div className="rounded-2xl border border-cyan-500/30 bg-cyan-500/10 p-4">
            <p className="text-[10px] uppercase tracking-[0.18em] text-cyan-300">{copy.turnaround}</p>
            <p className="mt-2 text-3xl font-black text-cyan-300">{COMMUNITY_IMPACT.avgResponseHours}</p>
            <p className="mt-1 text-xs text-cyan-200">{copy.withinSla}</p>
          </div>

          <div className="rounded-2xl border border-violet-500/30 bg-violet-500/10 p-4">
            <p className="text-[10px] uppercase tracking-[0.18em] text-violet-300">{copy.fleetActive}</p>
            <p className="mt-2 text-3xl font-black text-violet-300">{COMMUNITY_IMPACT.activeSanitationFleet}</p>
            <p className="mt-1 text-xs text-violet-200">{copy.gpsVehicles}</p>
          </div>
        </div>
      </section>

      <section className="rounded-[28px] bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 p-8 text-slate-950 shadow-[0_25px_80px_rgba(16,185,129,0.35)]">
        <div className="flex flex-col items-center justify-center gap-4 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-900/10 bg-slate-950/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em]">
            <TrendingUp size={14} />
            {copy.actNow}
          </div>
          <h3 className="text-3xl font-black text-slate-950">{copy.spotLitter}</h3>
          <p className="max-w-xl text-sm text-slate-900/80">
            {copy.reportIntro}
          </p>
          <button
            onClick={onRaiseComplaint}
            className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-6 py-3.5 text-sm font-black text-white transition hover:bg-slate-900"
          >
            {t.reportWasteNow}
            <ArrowRight size={16} />
          </button>
        </div>
      </section>
    </div>
  );
}
