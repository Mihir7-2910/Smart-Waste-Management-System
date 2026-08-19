import React, { useState } from 'react';
import { X, Check, Copy, Share2, Sparkles, MessageSquare, CheckCheck, Phone, ShieldCheck, MapPin, ExternalLink } from 'lucide-react';

export function WhatsAppTicketModal({ complaint, isOpen, onClose }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !complaint) return null;

  const messages = complaint.whatsappMessages || [];

  const handleCopyAll = () => {
    const fullText = messages.map((m) => m.text).join('\n\n---\n\n');
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      {/* Smartphone Frame */}
      <div className="bg-[#0b141a] border-2 border-slate-700 rounded-[36px] max-w-md w-full overflow-hidden shadow-2xl flex flex-col max-h-[92vh] text-slate-100 font-sans">
        {/* WhatsApp Header */}
        <div className="bg-[#1f2c34] px-4 py-3 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-[#00a884] text-slate-950 flex items-center justify-center font-bold text-base shadow-md">
                🏛️
              </div>
              <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#1f2c34]"></span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="font-bold text-sm text-white">CleanCity AI Bot</h4>
                <span className="text-[10px] bg-[#00a884]/20 text-[#00a884] px-1.5 py-0.2 rounded font-bold">
                  VERIFIED
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Municipal Grievance Redressal</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyAll}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all text-xs font-bold flex items-center gap-1 cursor-pointer"
              title="Copy WhatsApp Text"
            >
              {copied ? <Check size={15} className="text-emerald-400" /> : <Copy size={15} />}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-all cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* WhatsApp Chat Background Wallpaper */}
        <div className="p-4 overflow-y-auto space-y-3 bg-[#0b141a] flex-1 bg-[radial-gradient(#1f2c34_1px,transparent_1px)] [background-size:16px_16px]">
          {/* Encryption notice */}
          <div className="bg-[#182229] border border-amber-500/20 text-amber-300/80 text-[10px] p-2.5 rounded-xl text-center shadow-sm">
            🔒 Official CleanCity AI WhatsApp Ticket Gateway. End-to-end synced with Municipal Sanitation Command Tower.
          </div>

          {/* WhatsApp Messages Stream */}
          {messages.map((msg, idx) => {
            const isInitial = msg.type === 'INITIAL_TICKET';
            return (
              <div key={idx} className="flex flex-col items-start space-y-1">
                <div
                  className={`p-3.5 rounded-2xl max-w-[95%] shadow-md border ${
                    isInitial
                      ? 'bg-[#202c33] border-slate-700 text-slate-200'
                      : 'bg-[#005c4b] border-[#007f66] text-white'
                  }`}
                >
                  {isInitial && complaint.beforeImageUrl && (
                    <div className="mb-3 rounded-xl overflow-hidden border border-slate-700">
                      <img
                        src={complaint.beforeImageUrl}
                        alt="Submitted Evidence"
                        className="w-full h-36 object-cover"
                      />
                      <div className="p-2 bg-[#182229] text-[10px] text-emerald-400 font-mono flex justify-between items-center">
                        <span>📸 Photo Geotagged</span>
                        <span>AI Verified (96%)</span>
                      </div>
                    </div>
                  )}

                  <pre className="font-mono text-[11px] whitespace-pre-wrap leading-relaxed select-text font-medium">
                    {msg.text}
                  </pre>

                  <div className="flex justify-end items-center gap-1 text-[9px] text-slate-400 mt-2 font-mono">
                    <span>{msg.time}</span>
                    <CheckCheck size={13} className="text-[#53bdeb]" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Smartphone Bottom Bar */}
        <div className="bg-[#1f2c34] p-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Ticket: <strong className="text-white font-mono">{complaint.id}</strong></span>
          <span className="text-emerald-400 font-bold flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            Automated Updates Active
          </span>
        </div>
      </div>
    </div>
  );
}
