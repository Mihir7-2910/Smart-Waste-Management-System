import React, { useState } from 'react';
import {
  Building2,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Sparkles,
  Award,
  Bell,
  Trash2,
  Send
} from 'lucide-react';
import { SOCIETY_INTELLIGENCE } from '../../data/mockData';

export function SocietyIntelView({ societies = SOCIETY_INTELLIGENCE }) {
  const [notifiedSocieties, setNotifiedSocieties] = useState({});

  const handleSendNotification = (id) => {
    setNotifiedSocieties((prev) => ({
      ...prev,
      [id]: true
    }));
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900/90 backdrop-blur-xl border border-slate-800 p-5 rounded-3xl shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shadow-lg shadow-cyan-500/10">
            <Building2 size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-heading font-bold text-xl text-white">Society & Apartment Waste Intelligence</h2>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-mono">
                MICRO-INTELLIGENCE
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Gated community waste audits, segregation scores, peak generation days, and municipal incentives
            </p>
          </div>
        </div>
      </div>

      {/* Society Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {societies.map((soc) => {
          const isNotified = notifiedSocieties[soc.id];
          return (
            <div
              key={soc.id}
              className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 hover:border-cyan-500/40 rounded-3xl p-6 shadow-xl space-y-4 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Title and Ward */}
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded">
                      {soc.ward}
                    </span>
                    <h3 className="font-heading font-bold text-lg text-white mt-1">
                      {soc.name}
                    </h3>
                    <p className="text-xs text-slate-400">{soc.units} Residential Units • {soc.binCount} Smart Bins</p>
                  </div>
                  <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-xl border border-emerald-500/30">
                    {soc.segregationScore}% Segregated
                  </span>
                </div>

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-2 gap-2.5 bg-slate-950/70 p-3.5 rounded-2xl border border-slate-800/80 text-xs">
                  <div>
                    <span className="text-slate-500 block text-[10px]">Predicted Weekly Waste:</span>
                    <span className="text-white font-mono font-bold text-sm">
                      {soc.predictedWasteWeekKg} kg
                    </span>
                    <span className={`text-[10px] ml-1 font-bold ${soc.trendPercent.startsWith('+') ? 'text-amber-400' : 'text-emerald-400'}`}>
                      {soc.trendPercent}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-500 block text-[10px]">Peak Disposal Time:</span>
                    <span className="text-cyan-300 font-semibold text-[11px] block truncate">
                      {soc.peakDay}
                    </span>
                  </div>
                </div>

                {/* Current Issue */}
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Active Audit Status:</span>
                  <p className="text-white font-semibold flex items-center gap-1.5">
                    {soc.currentIssue.includes('Overflow') || soc.currentIssue.includes('Mixed') ? (
                      <AlertTriangle size={14} className="text-amber-400 flex-shrink-0" />
                    ) : (
                      <CheckCircle2 size={14} className="text-emerald-400 flex-shrink-0" />
                    )}
                    <span>{soc.currentIssue}</span>
                  </p>
                </div>

                {/* Recommended Municipal Action */}
                <div className="p-3 rounded-xl bg-cyan-950/20 border border-cyan-500/20 text-xs text-slate-300 space-y-1">
                  <strong className="text-cyan-300 flex items-center gap-1">
                    <Sparkles size={13} />
                    <span>Recommended Municipal Action:</span>
                  </strong>
                  <p className="text-[11px]">{soc.recommendedAction}</p>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2 border-t border-slate-800 flex justify-between items-center">
                <span className="text-[10px] text-slate-500">
                  Organic: {soc.organicRatio} | Recyclable: {soc.recyclableRatio}
                </span>
                <button
                  onClick={() => handleSendNotification(soc.id)}
                  disabled={isNotified}
                  className={`text-xs px-3.5 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    isNotified
                      ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-cyan-600 hover:bg-cyan-500 text-slate-950 shadow-md shadow-cyan-600/20'
                  }`}
                >
                  {isNotified ? <CheckCircle2 size={13} /> : <Send size={13} />}
                  <span>{isNotified ? 'Advisory Sent' : 'Send Society Advisory'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
