import React, { useState } from 'react';
import { Search, X, MapPin, Clock, CheckCircle2, AlertCircle, MessageSquare, ArrowRight, ShieldCheck } from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';

export function TrackComplaintModal({ isOpen, onClose, complaints, onOpenWhatsAppModal }) {
  const [ticketInput, setTicketInput] = useState('');
  const [searchedComplaint, setSearchedComplaint] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSearch = (e) => {
    e?.preventDefault();
    setErrorMsg('');
    const query = ticketInput.trim().toUpperCase();
    if (!query) {
      setErrorMsg('Please enter a valid Complaint Ticket ID (e.g., SWM-2026-8951)');
      return;
    }

    const match = complaints.find(
      (c) =>
        c.id.toUpperCase() === query ||
        c.id.toUpperCase().replace('SWM-', '') === query ||
        c.citizenPhone.includes(query)
    );

    if (match) {
      setSearchedComplaint(match);
    } else {
      setSearchedComplaint(null);
      setErrorMsg(`No complaint found with ID "${query}". Please check the ticket number.`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex justify-between items-center bg-slate-950/70">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <Search size={20} />
            </div>
            <div>
              <h3 className="font-heading font-bold text-lg text-white">Track Your Complaint</h3>
              <p className="text-xs text-slate-400">Enter your Ticket ID to check live municipal redressal</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-all cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-5 border-b border-slate-800 bg-slate-950/40 space-y-3">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Enter Ticket ID (e.g. SWM-2026-8951)..."
                value={ticketInput}
                onChange={(e) => setTicketInput(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono transition-all uppercase"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all cursor-pointer shadow-md shadow-emerald-600/30"
            >
              Search
            </button>
          </form>

          {/* Quick Demo Tickets Picker */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar text-[11px] text-slate-400">
            <span>Recent Tickets:</span>
            {complaints.slice(0, 3).map((c) => (
              <button
                key={c.id}
                onClick={() => {
                  setTicketInput(c.id);
                  setSearchedComplaint(c);
                  setErrorMsg('');
                }}
                className="font-mono px-2 py-0.5 rounded bg-slate-800 hover:bg-emerald-600 hover:text-white text-slate-300 transition-all cursor-pointer"
              >
                {c.id}
              </button>
            ))}
          </div>

          {errorMsg && (
            <p className="text-xs text-rose-400 flex items-center gap-1 bg-rose-950/40 p-2 rounded-xl border border-rose-500/30">
              <AlertCircle size={14} />
              <span>{errorMsg}</span>
            </p>
          )}
        </div>

        {/* Search Result Card */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {searchedComplaint ? (
            <div className="space-y-4 animate-fadeIn">
              {/* Top Status & ID */}
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                      {searchedComplaint.id}
                    </span>
                    <h4 className="font-heading font-bold text-base text-white mt-1">
                      {searchedComplaint.categoryLabel}
                    </h4>
                  </div>
                  <StatusBadge status={searchedComplaint.status} />
                </div>

                <p className="text-xs text-slate-300">"{searchedComplaint.description}"</p>

                <p className="text-[11px] text-slate-400 flex items-center gap-1 pt-1 border-t border-slate-800/80">
                  <MapPin size={13} className="text-emerald-400 flex-shrink-0" />
                  <span>{searchedComplaint.address}</span>
                </p>
              </div>

              {/* Photo Evidence */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
                  <img
                    src={searchedComplaint.beforeImageUrl}
                    alt="Reported Photo"
                    className="w-full h-28 object-cover"
                  />
                  <div className="p-1.5 bg-slate-900 text-[10px] text-slate-400 text-center font-bold">
                    Before Cleanup
                  </div>
                </div>

                <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-950 flex flex-col items-center justify-center min-h-[112px]">
                  {searchedComplaint.afterImageUrl ? (
                    <>
                      <img
                        src={searchedComplaint.afterImageUrl}
                        alt="Cleaned Photo"
                        className="w-full h-28 object-cover"
                      />
                      <div className="p-1.5 bg-emerald-950 text-[10px] text-emerald-400 text-center font-bold w-full">
                        Cleaned & AI Verified
                      </div>
                    </>
                  ) : (
                    <div className="text-center p-2">
                      <Clock size={16} className="mx-auto text-slate-500 mb-1" />
                      <span className="text-[10px] text-slate-400 font-semibold block">Cleanup In Progress</span>
                      <span className="text-[9px] text-slate-500">After-photo pending</span>
                    </div>
                  )}
                </div>
              </div>

              {/* WhatsApp Digital Receipt Button */}
              <button
                onClick={() => onOpenWhatsAppModal(searchedComplaint)}
                className="w-full py-3 rounded-2xl bg-[#00a884]/20 hover:bg-[#00a884]/30 border border-[#00a884]/40 text-[#00a884] font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg"
              >
                <MessageSquare size={16} />
                <span>View Complete WhatsApp Digital Ticket & Updates</span>
              </button>

              {/* Redressal Progress Timeline */}
              <div className="space-y-3 pt-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                  Redressal Timeline:
                </span>
                <div className="space-y-3 relative before:absolute before:inset-0 before:left-3 before:w-0.5 before:bg-slate-800">
                  {searchedComplaint.timeline?.map((step, idx) => (
                    <div key={idx} className="relative flex items-start gap-3 pl-1">
                      <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500 text-emerald-400 flex items-center justify-center flex-shrink-0 z-10">
                        <CheckCircle2 size={12} />
                      </div>
                      <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 flex-1">
                        <div className="flex justify-between items-baseline">
                          <p className="text-xs font-bold text-white">{step.title}</p>
                          <span className="text-[10px] text-slate-500 font-mono">{step.time}</span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-10 space-y-2">
              <Search size={32} className="mx-auto text-slate-600" />
              <p className="text-sm font-bold text-slate-300">Enter a Ticket ID to View Live Status</p>
              <p className="text-xs text-slate-500">
                You will only see the status and photo verification of your own complaint.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-all cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
