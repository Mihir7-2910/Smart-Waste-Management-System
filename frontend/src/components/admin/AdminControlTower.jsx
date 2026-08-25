import React, { useState, useEffect, useRef } from 'react';
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
  AlertTriangle,
  Sparkles,
  ArrowRight,
  Flame,
  X,
  MessageSquare,
  Layers,
  ShieldCheck,
  AlertCircle,
  Eye,
  RefreshCw,
  BarChart3,
  Building2,
  Radio
} from 'lucide-react';
import L from 'leaflet';
import { StatusBadge } from '../common/StatusBadge';
import { MetricCard } from '../common/MetricCard';
import { SMART_BINS, AI_PREDICTIONS } from '../../data/mockData';
import { findNearestVehicle, calculateDistanceKm, formatDistance } from '../../utils/distance';

export function AdminControlTower({
  complaints,
  drivers,
  onManualDispatch,
  onOpenWhatsAppModal,
  onInspectTimeline,
  onOpenHotspots,
  onOpenSociety,
  onOpenAnalytics
}) {
  const [selectedFilterStatus, setSelectedFilterStatus] = useState('ALL'); // ALL, PENDING, SEARCHING_DRIVER, ASSIGNED, IN_PROGRESS, RESOLVED, CRITICAL
  const [wardFilter, setWardFilter] = useState('ALL');
  const [channelFilter, setChannelFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('OPERATIONS'); // OPERATIONS, LIVE_MAP
  const [selectedInterventionComplaint, setSelectedInterventionComplaint] = useState(null);

  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);

  // Compute live KPI metrics
  const totalCount = complaints.length;
  const pendingCount = complaints.filter((c) => c.status === 'REPORTED').length;
  const searchingCount = complaints.filter((c) => c.status === 'SEARCHING_DRIVER').length;
  const assignedCount = complaints.filter((c) => c.status === 'ASSIGNED' || c.status === 'ON_THE_WAY').length;
  const inProgressCount = complaints.filter((c) => c.status === 'IN_PROGRESS').length;
  const resolvedCount = complaints.filter((c) => c.status === 'RESOLVED').length;
  const criticalCount = complaints.filter((c) => c.priority === 'CRITICAL' && c.status !== 'RESOLVED').length;

  // Filter complaints list
  const filteredComplaints = complaints.filter((c) => {
    if (selectedFilterStatus === 'CRITICAL') {
      if (c.priority !== 'CRITICAL' || c.status === 'RESOLVED') return false;
    } else if (selectedFilterStatus === 'PENDING') {
      if (c.status !== 'REPORTED') return false;
    } else if (selectedFilterStatus === 'ASSIGNED') {
      if (c.status !== 'ASSIGNED' && c.status !== 'ON_THE_WAY') return false;
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

  // Admin Live Operations Map Init
  useEffect(() => {
    if (viewMode === 'LIVE_MAP') {
      setTimeout(() => {
        initControlTowerMap();
      }, 150);
    }
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [viewMode, complaints, drivers]);

  const initControlTowerMap = () => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
    }

    const map = L.map(mapContainerRef.current, {
      zoomControl: true,
      attributionControl: false
    }).setView([23.0375, 72.5550], 13);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      maxZoom: 19
    }).addTo(map);

    // 1. Render Drivers (Truck Icons)
    drivers.forEach((driver) => {
      const truckIcon = L.divIcon({
        className: 'admin-driver-pin',
        html: `
          <div class="w-10 h-10 rounded-2xl bg-emerald-500 text-slate-950 flex items-center justify-center font-bold text-xs shadow-xl border-2 border-white">
            🚛
          </div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 20]
      });

      L.marker([driver.currentLat, driver.currentLng], { icon: truckIcon })
        .addTo(map)
        .bindPopup(`
          <div style="font-size:12px; line-height:1.4">
            <strong style="color:#10b981">Driver: ${driver.name}</strong><br/>
            <span>Vehicle: <code>${driver.vehicleReg}</code> (${driver.vehicleType})</span><br/>
            <span>Capacity: <b>${driver.fillPercentage}% Full</b></span><br/>
            <span>Status: <b>${driver.status}</b></span>
          </div>
        `);
    });

    // 2. Render Active Complaints (Color-coded pins)
    complaints.forEach((c) => {
      const isResolved = c.status === 'RESOLVED';
      const isCritical = c.priority === 'CRITICAL';

      const pinColor = isResolved ? 'bg-emerald-600' : isCritical ? 'bg-rose-500 ring-4 ring-rose-500/40 animate-pulse' : 'bg-amber-500';

      const complaintIcon = L.divIcon({
        className: 'complaint-pin',
        html: `
          <div class="w-7 h-7 rounded-full ${pinColor} text-white flex items-center justify-center text-[10px] font-black border-2 border-slate-950 shadow-lg">
            📍
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14]
      });

      L.marker([c.latitude, c.longitude], { icon: complaintIcon })
        .addTo(map)
        .bindPopup(`
          <div style="font-size:12px; line-height:1.4">
            <strong style="color:#f59e0b">Ticket: ${c.id}</strong><br/>
            <span><b>${c.categoryLabel}</b></span><br/>
            <span>Status: <b>${c.status}</b></span><br/>
            <span>Address: ${c.address}</span>
          </div>
        `);
    });

    // 3. Render Smart Bins
    SMART_BINS.forEach((bin) => {
      const isOverflow = bin.status === 'OVERFLOW';
      const binIcon = L.divIcon({
        className: 'bin-pin',
        html: `
          <div class="w-6 h-6 rounded-lg ${isOverflow ? 'bg-rose-600' : 'bg-slate-700'} text-white flex items-center justify-center text-[10px] shadow-md border border-white">
            🗑️
          </div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });

      L.marker([bin.lat, bin.lng], { icon: binIcon })
        .addTo(map)
        .bindPopup(`<b>${bin.name}</b><br/>Fill Level: ${bin.currentFill}%`);
    });

    mapInstanceRef.current = map;
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Top Banner */}
      <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 p-5 rounded-3xl shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/30 shadow-lg shadow-amber-500/10">
            <Radio size={24} className="animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-heading font-bold text-xl text-white">
                Municipal Operations Control Tower
              </h2>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono">
                AUTOMATED DISPATCH LIVE
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Real-time monitoring, automated driver dispatching, SLA tracking, and manual intervention controls
            </p>
          </div>
        </div>

        {/* View Switcher (Live Grid vs Live Map) */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-2xl border border-slate-800">
          <button
            onClick={() => setViewMode('OPERATIONS')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'OPERATIONS' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            📋 Operations Grid
          </button>
          <button
            onClick={() => setViewMode('LIVE_MAP')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'LIVE_MAP' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            🗺️ Control Tower Map
          </button>
        </div>
      </div>

      {/* 1-Click Quick Filter Cards (Requirement 13) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
        <MetricCard
          title="Total Reports"
          value={totalCount}
          subtitle="All Municipal Reports"
          color="blue"
          active={selectedFilterStatus === 'ALL'}
          onClick={() => setSelectedFilterStatus('ALL')}
        />
        <MetricCard
          title="Reported"
          value={pendingCount}
          subtitle="Fresh Ingestion"
          color="amber"
          active={selectedFilterStatus === 'PENDING'}
          onClick={() => setSelectedFilterStatus('PENDING')}
        />
        <MetricCard
          title="Auto-Searching"
          value={searchingCount}
          subtitle="Matching Driver"
          color="cyan"
          active={selectedFilterStatus === 'SEARCHING_DRIVER'}
          onClick={() => setSelectedFilterStatus('SEARCHING_DRIVER')}
          trend="AI Engine"
        />
        <MetricCard
          title="Assigned / En Route"
          value={assignedCount}
          subtitle="Driver Dispatched"
          color="purple"
          active={selectedFilterStatus === 'ASSIGNED'}
          onClick={() => setSelectedFilterStatus('ASSIGNED')}
        />
        <MetricCard
          title="In Progress"
          value={inProgressCount}
          subtitle="On-Site Cleanup"
          color="blue"
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
        <div className="relative w-full md:w-80">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search Ticket ID, citizen, landmark..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-all"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <select
            value={wardFilter}
            onChange={(e) => setWardFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-xs text-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:border-amber-500"
          >
            <option value="ALL">All City Wards</option>
            <option value="Ward 3">Ward 3 (Ellisbridge)</option>
            <option value="Ward 4">Ward 4 (Navrangpura)</option>
            <option value="Ward 7">Ward 7 (Vastrapur)</option>
            <option value="Ward 8">Ward 8 (Bodakdev)</option>
          </select>

          <select
            value={channelFilter}
            onChange={(e) => setChannelFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-xs text-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:border-amber-500"
          >
            <option value="ALL">All Intake Channels</option>
            <option value="APP">Citizen Web App</option>
            <option value="WHATSAPP">WhatsApp Bot</option>
            <option value="SMS">SMS Gateway</option>
          </select>

          {(selectedFilterStatus !== 'ALL' || wardFilter !== 'ALL' || channelFilter !== 'ALL' || searchQuery) && (
            <button
              onClick={() => {
                setSelectedFilterStatus('ALL');
                setWardFilter('ALL');
                setChannelFilter('ALL');
                setSearchQuery('');
              }}
              className="text-xs text-amber-400 hover:underline px-2 cursor-pointer font-bold"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* VIEW 1: OPERATIONS GRID */}
      {viewMode === 'OPERATIONS' && (
        <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <h3 className="font-heading font-bold text-base text-white">
              {selectedFilterStatus === 'ALL' ? 'Live Municipal Grievance Redressal Feed' : `${selectedFilterStatus} Queue`}
            </h3>
            <span className="text-xs font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded font-bold">
              {filteredComplaints.length} Active Records
            </span>
          </div>

          <div className="space-y-3">
            {filteredComplaints.map((c) => (
              <div
                key={c.id}
                className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 hover:border-slate-700 transition-all flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4"
              >
                {/* Photo & Complaint Details */}
                <div className="flex items-start gap-3.5 overflow-hidden">
                  <div className="grid w-24 flex-shrink-0 grid-cols-2 gap-1">
                    <div className="relative">
                      <img src={c.beforeImageUrl} alt={`${c.categoryLabel} before cleaning`} className="h-20 w-full rounded-xl object-cover border border-amber-500/30" />
                      <span className="absolute bottom-1 left-1 rounded bg-slate-950/80 px-1 text-[8px] font-bold text-amber-300">Before</span>
                    </div>
                    <div className="relative flex h-20 items-center justify-center overflow-hidden rounded-xl border border-emerald-500/30 bg-slate-900">
                      {c.afterImageUrl ? <img src={c.afterImageUrl} alt={`${c.categoryLabel} after cleaning`} className="h-full w-full object-cover" /> : <span className="text-center text-[9px] font-bold text-slate-500">After<br />Pending</span>}
                      {c.afterImageUrl && <span className="absolute bottom-1 left-1 rounded bg-slate-950/80 px-1 text-[8px] font-bold text-emerald-300">After</span>}
                    </div>
                  </div>
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
                    <p className="text-[11px] text-slate-400 flex items-center gap-1">
                      <MapPin size={12} className="text-emerald-400 flex-shrink-0" />
                      <span>{c.address} ({c.ward})</span>
                    </p>
                  </div>
                </div>

                {/* Right: Driver Status & Control Action */}
                <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between w-full lg:w-auto gap-3 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-800">
                  <div className="text-left lg:text-right">
                    {c.assignedDriver ? (
                      <div>
                        <span className="text-xs text-blue-400 font-bold flex items-center gap-1">
                          <Truck size={13} />
                          <span>{c.assignedDriver.name} ({c.assignedDriver.vehicleReg})</span>
                        </span>
                      </div>
                    ) : c.status === 'SEARCHING_DRIVER' ? (
                      <span className="text-xs text-amber-400 font-bold font-mono animate-pulse flex items-center gap-1">
                        <Sparkles size={12} />
                        <span>AI Auto-Dispatching...</span>
                      </span>
                    ) : (
                      <span className="text-xs text-rose-400 font-bold font-mono">
                        Awaiting Driver Accept
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onOpenWhatsAppModal(c)}
                      className="px-3 py-1.5 rounded-xl bg-[#00a884]/20 hover:bg-[#00a884]/30 border border-[#00a884]/40 text-[#00a884] text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                      title="Inspect WhatsApp Thread"
                    >
                      <MessageSquare size={13} />
                      <span>WhatsApp Thread</span>
                    </button>

                    <button
                      onClick={() => onInspectTimeline(c)}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all cursor-pointer"
                    >
                      Timeline
                    </button>

                    {/* Admin Override Dispatch */}
                    {c.status !== 'RESOLVED' && (
                      <button
                        onClick={() => setSelectedInterventionComplaint(c)}
                        className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                      >
                        <Zap size={13} />
                        <span>Override Dispatch</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 2: CONTROL TOWER LIVE GIS MAP */}
      {viewMode === 'LIVE_MAP' && (
        <div className="rounded-3xl overflow-hidden border border-slate-800 bg-slate-950 h-[560px] shadow-2xl relative">
          <div ref={mapContainerRef} className="w-full h-full" />

          {/* Map Layer Legend */}
          <div className="absolute bottom-4 left-4 z-[400] bg-slate-950/90 backdrop-blur-xl p-3.5 rounded-2xl border border-slate-800 text-xs shadow-2xl space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Control Tower Map Legend:
            </span>
            <div className="flex items-center gap-2 text-emerald-400 text-[11px] font-semibold">
              <span>🚛</span>
              <span>Sanitation Compactor Vehicles</span>
            </div>
            <div className="flex items-center gap-2 text-amber-400 text-[11px] font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              <span>Active Citizen Grievances</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300 text-[11px]">
              <span>🗑️</span>
              <span>IoT Smart Bins</span>
            </div>
          </div>
        </div>
      )}

      {/* Admin Manual Override Dispatch Modal */}
      {selectedInterventionComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700/80 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl flex flex-col p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
                  <Zap size={18} />
                </div>
                <h4 className="font-heading font-bold text-base text-white">
                  Admin Manual Driver Override
                </h4>
              </div>
              <button
                onClick={() => setSelectedInterventionComplaint(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-2xl text-xs space-y-1">
              <span className="font-mono text-emerald-400 font-bold">{selectedInterventionComplaint.id}</span>
              <p className="font-bold text-white">{selectedInterventionComplaint.categoryLabel}</p>
              <p className="text-slate-400">{selectedInterventionComplaint.address}</p>
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Select Municipal Sanitation Driver to Force Dispatch:
              </span>
              <div className="space-y-2">
                {drivers.map((drv) => {
                  const dist = calculateDistanceKm(
                    selectedInterventionComplaint.latitude,
                    selectedInterventionComplaint.longitude,
                    drv.currentLat,
                    drv.currentLng
                  );
                  return (
                    <div
                      key={drv.id}
                      className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between text-xs hover:border-amber-500/40 transition-all"
                    >
                      <div>
                        <p className="font-bold text-white">{drv.name} ({drv.vehicleReg})</p>
                        <p className="text-[10px] text-slate-400">
                          {drv.vehicleType} • {formatDistance(dist)} away
                        </p>
                      </div>
                      <button
                        onClick={async () => {
                          await onManualDispatch(selectedInterventionComplaint.id, drv.id);
                          setSelectedInterventionComplaint(null);
                        }}
                        className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition-all cursor-pointer shadow-md"
                      >
                        Force Dispatch
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedInterventionComplaint(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs cursor-pointer"
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
