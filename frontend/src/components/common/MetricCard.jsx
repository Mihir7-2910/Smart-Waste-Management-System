import React from 'react';

export function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  color = 'emerald', // emerald, amber, blue, purple, rose, cyan
  active = false,
  onClick,
  trend,
}) {
  const colorStyles = {
    emerald: {
      bg: 'from-emerald-950/40 to-slate-900/60 border-emerald-500/20 text-emerald-400',
      active: 'border-emerald-500 ring-2 ring-emerald-500/30 bg-emerald-950/60',
      iconBg: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30',
    },
    amber: {
      bg: 'from-amber-950/40 to-slate-900/60 border-amber-500/20 text-amber-400',
      active: 'border-amber-500 ring-2 ring-amber-500/30 bg-amber-950/60',
      iconBg: 'bg-amber-500/10 text-amber-400 border border-amber-500/30',
    },
    blue: {
      bg: 'from-blue-950/40 to-slate-900/60 border-blue-500/20 text-blue-400',
      active: 'border-blue-500 ring-2 ring-blue-500/30 bg-blue-950/60',
      iconBg: 'bg-blue-500/10 text-blue-400 border border-blue-500/30',
    },
    purple: {
      bg: 'from-purple-950/40 to-slate-900/60 border-purple-500/20 text-purple-400',
      active: 'border-purple-500 ring-2 ring-purple-500/30 bg-purple-950/60',
      iconBg: 'bg-purple-500/10 text-purple-400 border border-purple-500/30',
    },
    rose: {
      bg: 'from-rose-950/40 to-slate-900/60 border-rose-500/20 text-rose-400',
      active: 'border-rose-500 ring-2 ring-rose-500/30 bg-rose-950/60',
      iconBg: 'bg-rose-500/10 text-rose-400 border border-rose-500/30',
    },
    cyan: {
      bg: 'from-cyan-950/40 to-slate-900/60 border-cyan-500/20 text-cyan-400',
      active: 'border-cyan-500 ring-2 ring-cyan-500/30 bg-cyan-950/60',
      iconBg: 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30',
    },
  };

  const style = colorStyles[color] || colorStyles.emerald;

  return (
    <button
      onClick={onClick}
      className={`text-left p-4 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between w-full bg-gradient-to-br ${style.bg} ${
        active ? style.active : 'hover:border-slate-600 hover:shadow-lg'
      }`}
    >
      <div className="flex items-center justify-between w-full mb-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          {title}
        </span>
        {Icon && (
          <div className={`p-2 rounded-xl ${style.iconBg}`}>
            <Icon size={18} />
          </div>
        )}
      </div>

      <div className="flex items-baseline justify-between w-full mt-1">
        <span className="text-2xl lg:text-3xl font-extrabold tracking-tight text-white font-heading">
          {value}
        </span>
        {trend && (
          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-800/80 text-slate-300 border border-slate-700">
            {trend}
          </span>
        )}
      </div>

      {subtitle && (
        <p className="text-xs text-slate-400 mt-2 font-medium truncate w-full">
          {subtitle}
        </p>
      )}
    </button>
  );
}
