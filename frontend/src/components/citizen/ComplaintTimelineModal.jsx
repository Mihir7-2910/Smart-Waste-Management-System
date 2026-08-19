import React from 'react';
import { X, Clock, MapPin, CheckCircle2, User, Phone, Truck, Sparkles, ShieldCheck, ArrowRight } from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';

export function ComplaintTimelineModal({ complaint, isOpen, onClose, onResolveDemo }) {
  if (!isOpen || !complaint) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex justify-between items-center bg-slate-950/70">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                {complaint.id}
              </span>
              <StatusBadge status={complaint.status} />
              <StatusBadge status={complaint.channel} />
            </div>
            <h3 className="font-heading font-bold text-lg text-white">{complaint.categoryLabel}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-all cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-6">
          {/* Photos Comparison / Inspection */}
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
              Visual Evidence & AI Inspection:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Before Photo */}
              <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 group">
                <img
                  src={complaint.beforeImageUrl}
                  alt="Before Cleanup"
                  className="w-full h-44 object-cover"
                />
                <div className="absolute top-2 left-2 px-2.5 py-1 rounded-lg bg-slate-950/80 backdrop-blur-md text-[11px] font-bold text-amber-400 border border-amber-500/30">
                  Before Cleanup
                </div>
                {complaint.aiConfidence && (
                  <div className="absolute bottom-2 left-2 right-2 bg-slate-950/85 backdrop-blur-md p-2 rounded-xl border border-slate-700/80 text-[11px] text-slate-300">
                    <div className="flex items-center gap-1 text-emerald-400 font-semibold mb-0.5">
                      <Sparkles size={13} />
                      <span>AI Verified ({Math.round(complaint.aiConfidence * 100)}%)</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {complaint.aiTags?.map((tag, idx) => (
                        <span key={idx} className="text-[10px] bg-slate-800 px-1.5 py-0.2 rounded text-slate-300">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* After Photo */}
              <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 flex items-center justify-center min-h-[176px]">
                {complaint.afterImageUrl ? (
                  <>
                    <img
                      src={complaint.afterImageUrl}
                      alt="After Cleanup"
                      className="w-full h-44 object-cover"
                    />
                    <div className="absolute top-2 left-2 px-2.5 py-1 rounded-lg bg-emerald-950/90 backdrop-blur-md text-[11px] font-bold text-emerald-400 border border-emerald-500/40 flex items-center gap-1">
                      <CheckCircle2 size={13} />
                      <span>AI Cleaned & Verified</span>
                    </div>
                  </>
                ) : (
                  <div className="text-center p-4 space-y-2">
                    <div className="w-10 h-10 mx-auto rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500">
                      <Clock size={18} />
                    </div>
                    <p className="text-xs font-semibold text-slate-400">After-Photo Pending</p>
                    <p className="text-[10px] text-slate-500">
                      Driver will upload photo upon completing municipal collection
                    </p>
                    {onResolveDemo && complaint.status !== 'RESOLVED' && (
                      <button
                        onClick={() => onResolveDemo(complaint.id)}
                        className="text-xs px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/40 font-bold transition-all cursor-pointer"
                      >
                        ⚡ Simulate Driver Cleanup Upload
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Location & Details Card */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2.5">
            <div className="flex items-start gap-2.5">
              <MapPin size={18} className="text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-white">{complaint.address}</p>
                <p className="text-[11px] text-slate-400">
                  {complaint.ward} • Coordinates: {complaint.latitude?.toFixed(4)}, {complaint.longitude?.toFixed(4)}
                </p>
              </div>
            </div>
            <p className="text-xs text-slate-300 bg-slate-900/80 p-3 rounded-xl border border-slate-800">
              "{complaint.description}"
            </p>
          </div>

          {/* Assigned Driver Card */}
          {complaint.assignedWorker && (
            <div className="p-4 rounded-2xl bg-blue-950/20 border border-blue-500/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400 font-bold">
                  <User size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-bold text-white">{complaint.assignedWorker.name}</p>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-300 font-mono">
                      {complaint.assignedWorker.vehicleId}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                    <Phone size={12} />
                    {complaint.assignedWorker.phone}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">SLA Target</span>
                <span className="text-xs font-bold text-amber-400 font-mono">4-Hour Max</span>
              </div>
            </div>
          )}

          {/* Visual Timeline Steps */}
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-3">
              Grievance Progress Track:
            </span>
            <div className="space-y-4 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-800">
              {complaint.timeline?.map((step, idx) => (
                <div key={idx} className="relative flex items-start gap-4">
                  <div className="w-7 h-7 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center text-emerald-400 flex-shrink-0 z-10 shadow-md">
                    <CheckCircle2 size={15} />
                  </div>
                  <div className="flex-1 bg-slate-950/70 p-3 rounded-xl border border-slate-800/80">
                    <div className="flex justify-between items-baseline mb-0.5">
                      <p className="text-xs font-bold text-slate-200">{step.title}</p>
                      <span className="text-[10px] text-slate-500 font-mono">{step.time}</span>
                    </div>
                    <p className="text-[11px] text-slate-400">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-all cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
