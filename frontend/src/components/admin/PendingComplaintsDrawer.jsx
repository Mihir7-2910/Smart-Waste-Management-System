import React, { useState } from 'react';
import {
  Zap,
  Filter,
  Search,
  MapPin,
  Clock,
  User,
  Phone,
  Truck,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  Flame,
  X,
  MessageSquare,
  Smartphone
} from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';
import { MetricCard } from '../common/MetricCard';
import { findNearestVehicle } from '../../utils/distance';

export function PendingComplaintsDrawer({
  complaints,
  vehicles,
  onAssignDriver,
  onResolveComplaint,
  onViewTimeline
}) {
  const [selectedFilterStatus, setSelectedFilterStatus] = useState('PENDING'); // PENDING, ALL, ASSIGNED, IN_PROGRESS, RESOLVED, CRITICAL
  const [wardFilter, setWardFilter] = useState('ALL');
  const [channelFilter, setChannelFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Driver Assignment Modal State
  const [assigningComplaint, setAssigningComplaint] = useState(null);
  const [suggestedDriver, setSuggestedDriver] = useState(null);

  // Compute live KPI metrics
  const totalCount = complaints.length;
  const pendingCount = complaints.filter((c) => c.status === 'PENDING').length;
  const assignedCount = complaints.filter((c) => c.status === 'ASSIGNED').length;
  const inProgressCount = complaints.filter((c) => c.status === 'IN_PROGRESS').length;
  const resolvedCount = complaints.filter((c) => c.status === 'RESOLVED').length;
  const criticalCount = complaints.filter((c) => c.priority === 'CRITICAL' && c.status !== 'RESOLVED').length;

  // Filter complaints list
  const filteredComplaints = complaints.filter((c) => {
    if (selectedFilterStatus === 'CRITICAL') {
      if (c.priority !== 'CRITICAL' || c.status === 'RESOLVED') return false;
    } else if (selectedFilterStatus !== 'ALL') {
      if (c.status !== selectedFilterStatus) return false;
    }

    if (wardFilter !== 'ALL' && !c.ward.includes(wardFilter)) return false;
    if (channelFilter !== 'ALL' && c.channel !== channelFilter) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        c.id.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.address.toLowerCase().includes(q) ||
        c.citizenName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleOpenAssignModal = (complaint) => {
    setAssigningComplaint(complaint);
    const nearest = findNearestVehicle(complaint.latitude, complaint.longitude, vehicles);
    setSuggestedDriver(nearest);
  };

  const handleConfirmAssignment = async (vehicleId) => {
    if (assigningComplaint) {
      await onAssignDriver(assigningComplaint.id, vehicleId);
      setAssigningComplaint(null);
      setSuggestedDriver(null);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Welcome Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900/90 backdrop-blur-xl border border-slate-800 p-5 rounded-3xl shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/30 shadow-lg shadow-amber-500/10">
            <Zap size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-heading font-bold text-xl text-white">Admin Command Center</h2>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono">
                1-CLICK DISPATCH
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Instant grievance triage, nearest-driver Haversine suggestion, and SLA enforcement
            </p>
          </div>
        </div>
      </div>

      {/* 1-Click Quick Filter Cards (Requirement 4) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <MetricCard
          title="Total Reports"
          value={totalCount}
          subtitle="All Municipal Grievances"
          color="blue"
          active={selectedFilterStatus === 'ALL'}
          onClick={() => setSelectedFilterStatus('ALL')}
        />
        <MetricCard
          title="Pending"
          value={pendingCount}
          subtitle="Click to View Unassigned"
          color="amber"
          active={selectedFilterStatus === 'PENDING'}
          onClick={() => setSelectedFilterStatus('PENDING')}
          trend={`${pendingCount} Action Req.`}
        />
        <MetricCard
          title="Assigned"
          value={assignedCount}
          subtitle="Driver Dispatched"
          color="cyan"
          active={selectedFilterStatus === 'ASSIGNED'}
          onClick={() => setSelectedFilterStatus('ASSIGNED')}
        />
        <MetricCard
          title="In Progress"
          value={inProgressCount}
          subtitle="On-Site Cleanup"
          color="purple"
          active={selectedFilterStatus === 'IN_PROGRESS'}
          onClick={() => setSelectedFilterStatus('IN_PROGRESS')}
        />
        <MetricCard
          title="Resolved"
          value={resolvedCount}
          subtitle="AI Verified Cleaned"
          color="emerald"
          active={selectedFilterStatus === 'RESOLVED'}
          onClick={() => setSelectedFilterStatus('RESOLVED')}
        />
        <MetricCard
          title="Critical SLA"
          value={criticalCount}
          subtitle="Urgent Hazard Alert"
          color="rose"
          active={selectedFilterStatus === 'CRITICAL'}
          onClick={() => setSelectedFilterStatus('CRITICAL')}
          trend="Immediate"
        />
      </div>

      {/* Multi-Dimensional Filter Toolbar */}
      <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 p-4 rounded-2xl shadow-lg flex flex-col md:flex-row gap-3 items-center justify-between">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by ID, Address, Citizen, Category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-all"
          />
        </div>

        {/* Dropdowns */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Ward filter */}
          <select
            value={wardFilter}
            onChange={(e) => setWardFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-xs text-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:border-amber-500"
          >
            <option value="ALL">All Wards</option>
            <option value="Ward 3">Ward 3 (Ellisbridge)</option>
            <option value="Ward 4">Ward 4 (Navrangpura)</option>
            <option value="Ward 7">Ward 7 (Vastrapur)</option>
            <option value="Ward 8">Ward 8 (Bodakdev)</option>
          </select>

          {/* Channel filter (App, WhatsApp, SMS) */}
          <select
            value={channelFilter}
            onChange={(e) => setChannelFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-xs text-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:border-amber-500"
          >
            <option value="ALL">All Channels (App/WA/SMS)</option>
            <option value="APP">Citizen Web App</option>
            <option value="WHATSAPP">WhatsApp Bot</option>
            <option value="SMS">SMS Gateway</option>
          </select>

          {/* Reset */}
          {(selectedFilterStatus !== 'ALL' || wardFilter !== 'ALL' || channelFilter !== 'ALL' || searchQuery) && (
            <button
              onClick={() => {
                setSelectedFilterStatus('ALL');
                setWardFilter('ALL');
                setChannelFilter('ALL');
                setSearchQuery('');
              }}
              className="text-xs text-amber-400 hover:underline px-2 cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Complaints Data Grid */}
      <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
        <div className="flex justify-between items-center border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <h3 className="font-heading font-bold text-base text-white">
              {selectedFilterStatus === 'ALL' ? 'All Grievances' : `${selectedFilterStatus} Queue`}
            </h3>
            <span className="text-xs font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded font-bold">
              {filteredComplaints.length} Records
            </span>
          </div>
        </div>

        {filteredComplaints.length === 0 ? (
          <div className="text-center py-12 space-y-2">
            <CheckCircle2 size={36} className="mx-auto text-emerald-400" />
            <p className="text-sm font-bold text-white">No Grievances Found in this Filter</p>
            <p className="text-xs text-slate-500">All complaints in this category have been processed</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredComplaints.map((c) => (
              <div
                key={c.id}
                className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 hover:border-slate-700 transition-all flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4"
              >
                {/* Left Photo & Details */}
                <div className="flex items-start gap-3.5 overflow-hidden">
                  <img
                    src={c.beforeImageUrl}
                    alt={c.categoryLabel}
                    className="w-20 h-20 rounded-2xl object-cover border border-slate-800 flex-shrink-0"
                  />
                  <div className="space-y-1 overflow-hidden">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                        {c.id}
                      </span>
                      <StatusBadge status={c.channel} />
                      <StatusBadge status={c.priority} />
                      <StatusBadge status={c.status} />
                    </div>

                    <h4 className="text-sm font-bold text-white truncate">{c.categoryLabel}</h4>
                    <p className="text-xs text-slate-300 line-clamp-1">{c.description}</p>
                    <p className="text-[11px] text-slate-400 flex items-center gap-1">
                      <MapPin size={12} className="text-emerald-400 flex-shrink-0" />
                      <span>{c.address} ({c.ward})</span>
                    </p>
                  </div>
                </div>

                {/* Right Action & SLA */}
                <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between w-full lg:w-auto gap-3 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-800">
                  <div className="text-left lg:text-right">
                    <span className="text-[10px] text-slate-400 block uppercase font-semibold">
                      Citizen: {c.citizenName}
                    </span>
                    {c.assignedWorker ? (
                      <span className="text-xs text-blue-400 font-semibold flex items-center gap-1">
                        <Truck size={13} />
                        <span>Driver: {c.assignedWorker.name} ({c.assignedWorker.vehicleId})</span>
                      </span>
                    ) : (
                      <span className="text-xs text-amber-400 font-semibold font-mono">
                        Awaiting Dispatch
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onViewTimeline(c)}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all cursor-pointer"
                    >
                      Inspect Timeline
                    </button>

                    {c.status === 'PENDING' && (
                      <button
                        onClick={() => handleOpenAssignModal(c)}
                        className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 text-xs font-bold shadow-lg shadow-amber-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <Zap size={14} />
                        <span>Auto-Assign Nearest Driver</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Auto Driver Assignment Modal */}
      {assigningComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700/80 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl flex flex-col">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-800 flex justify-between items-center bg-slate-950/70">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
                  <Truck size={20} />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-lg text-white">Haversine Nearest-Driver Dispatch</h3>
                  <p className="text-xs text-slate-400">Calculates optimal municipal vehicle by geographical distance</p>
                </div>
              </div>
              <button
                onClick={() => setAssigningComplaint(null)}
                className="p-2 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-all cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4">
              {/* Complaint summary */}
              <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 text-xs space-y-1">
                <div className="flex justify-between font-mono text-slate-400">
                  <span>{assigningComplaint.id}</span>
                  <span className="text-amber-400 font-bold">{assigningComplaint.ward}</span>
                </div>
                <p className="font-bold text-white">{assigningComplaint.categoryLabel}</p>
                <p className="text-slate-400 truncate">{assigningComplaint.address}</p>
              </div>

              {/* Haversine Nearest Suggestion Box */}
              {suggestedDriver ? (
                <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-950/50 via-slate-900 to-slate-950 border-2 border-emerald-500/50 space-y-3 shadow-xl">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30 flex items-center gap-1">
                      <Sparkles size={12} />
                      <span>Best Matched Driver (Haversine Optimized)</span>
                    </span>
                    <span className="text-xs font-mono font-bold text-emerald-400">
                      {suggestedDriver.distanceText} away
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center font-bold">
                      <User size={24} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-heading font-bold text-white text-base">
                          {suggestedDriver.driverName}
                        </h4>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">
                          {suggestedDriver.id}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">{suggestedDriver.vehicleType}</p>
                      <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                        <Phone size={12} />
                        {suggestedDriver.driverPhone}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                    <div>
                      <span className="text-slate-500 block text-[10px]">Estimated ETA:</span>
                      <span className="font-bold text-white font-mono">~ {suggestedDriver.estimatedMinutes} Mins</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Truck Fill:</span>
                      <span className="font-bold text-amber-400 font-mono">{suggestedDriver.fillPercentage}% Full</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleConfirmAssignment(suggestedDriver.id)}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <CheckCircle2 size={16} />
                    <span>Confirm & Dispatch Driver (Start 4-Hr SLA)</span>
                  </button>
                </div>
              ) : (
                <p className="text-xs text-slate-400 text-center py-4">No active drivers in range.</p>
              )}

              {/* Other Active Drivers in Fleet */}
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                  Or Assign Another Municipal Driver:
                </span>
                <div className="space-y-2">
                  {vehicles
                    .filter((v) => v.id !== suggestedDriver?.id)
                    .map((veh) => (
                      <div
                        key={veh.id}
                        className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between text-xs"
                      >
                        <div>
                          <p className="font-bold text-white">{veh.driverName} ({veh.id})</p>
                          <p className="text-[10px] text-slate-400">{veh.vehicleType}</p>
                        </div>
                        <button
                          onClick={() => handleConfirmAssignment(veh.id)}
                          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold transition-all cursor-pointer"
                        >
                          Select
                        </button>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex justify-end">
              <button
                onClick={() => setAssigningComplaint(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-all cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
