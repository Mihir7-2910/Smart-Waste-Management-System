import React from 'react';

export function StatusBadge({ status }) {
  const map = {
    PENDING: { bg: 'bg-amber-500/15 text-amber-400 border-amber-500/30', label: 'Pending' },
    ASSIGNED: { bg: 'bg-blue-500/15 text-blue-400 border-blue-500/30', label: 'Assigned' },
    IN_PROGRESS: { bg: 'bg-purple-500/15 text-purple-400 border-purple-500/30', label: 'In Progress' },
    RESOLVED: { bg: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30', label: 'Resolved' },
    REJECTED: { bg: 'bg-rose-500/15 text-rose-400 border-rose-500/30', label: 'Rejected' },
    CRITICAL: { bg: 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse', label: 'Critical' },
    HIGH: { bg: 'bg-orange-500/15 text-orange-400 border-orange-500/30', label: 'High Priority' },
    MEDIUM: { bg: 'bg-amber-500/15 text-amber-300 border-amber-500/30', label: 'Medium' },
    LOW: { bg: 'bg-slate-500/15 text-slate-300 border-slate-500/30', label: 'Low' },
    APP: { bg: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30', label: 'Citizen App' },
    WHATSAPP: { bg: 'bg-green-600/20 text-green-300 border-green-500/40', label: 'WhatsApp Bot' },
    SMS: { bg: 'bg-sky-500/15 text-sky-300 border-sky-500/30', label: 'SMS Gateway' },
  };

  const item = map[status] || { bg: 'bg-slate-800 text-slate-300 border-slate-700', label: status };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${item.bg}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
      {item.label}
    </span>
  );
}
