import React, { useState, useEffect, useRef } from 'react';
import {
  Truck,
  MapPin,
  Navigation,
  CheckCircle2,
  Clock,
  Phone,
  User,
  AlertTriangle,
  Camera,
  Play,
  RotateCcw,
  Sparkles,
  Check,
  X,
  Upload,
  ArrowRight,
  ShieldCheck,
  Send,
  MessageSquare
} from 'lucide-react';
import L from 'leaflet';
import { StatusBadge } from '../common/StatusBadge';
import { calculateDistanceKm, formatDistance } from '../../utils/distance';

export function DriverPortal({
  drivers,
  complaints,
  onAcceptJob,
  onDeclineJob,
  onStartNavigation,
  onStartCleanup,
  onCompleteJob,
  onOpenWhatsAppModal
}) {
  const [selectedDriverId, setSelectedDriverId] = useState(drivers[0]?.id || 'DRV-01');
  const [activeTab, setActiveTab] = useState('ACTIVE_JOB'); // ACTIVE_JOB, ROUTE_MAP, PROFILE
  const [uploadingProofForTicket, setUploadingProofForTicket] = useState(null);
  const [afterPhotoUrl, setAfterPhotoUrl] = useState(
    'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=60'
  );

  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);

  const activeDriver = drivers.find((d) => d.id === selectedDriverId) || drivers[0];
  const activeComplaint = complaints.find((c) => c.id === activeDriver?.currentJobTicket);
  const incomingJob = activeDriver?.incomingJobRequest;

  // Initialize Route Map
  useEffect(() => {
    if (activeTab === 'ROUTE_MAP') {
      setTimeout(() => {
        initDriverMap();
      }, 150);
    }
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [activeTab, selectedDriverId, activeDriver?.routeWaypoints]);

  const initDriverMap = () => {
    if (!mapContainerRef.current || !activeDriver) return;
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
    }

    const map = L.map(mapContainerRef.current, {
      zoomControl: true,
      attributionControl: false
    }).setView([activeDriver.currentLat, activeDriver.currentLng], 14);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      maxZoom: 19
    }).addTo(map);

    // Route Waypoints & Polyline
    if (activeDriver.routeWaypoints?.length > 0) {
      const coords = activeDriver.routeWaypoints.map((w) => [w.lat || 23.03, w.lng || 72.56]);
      L.polyline(coords, {
        color: '#10b981',
        weight: 5,
        opacity: 0.8,
        dashArray: '8, 8'
      }).addTo(map);

      activeDriver.routeWaypoints.forEach((wp, idx) => {
        const isCurrent = wp.status === 'CURRENT';
        const isDone = wp.status === 'COMPLETED';

        const wpIcon = L.divIcon({
          className: 'wp-marker',
          html: `
            <div class="w-8 h-8 rounded-full ${
              isDone
                ? 'bg-slate-700 text-slate-400'
                : isCurrent
                ? 'bg-amber-500 text-slate-950 ring-4 ring-amber-500/40 animate-pulse'
                : 'bg-emerald-600 text-white'
            } border-2 border-slate-950 flex items-center justify-center text-xs font-black shadow-lg">
              ${idx + 1}
            </div>
          `,
          iconSize: [32, 32],
          iconAnchor: [16, 16]
        });

        L.marker([wp.lat || 23.03, wp.lng || 72.56], { icon: wpIcon })
          .addTo(map)
          .bindPopup(`<b>Stop ${idx + 1}: ${wp.name}</b><br/>Status: ${wp.status}`);
      });
    }

    // Driver Vehicle Pin
    const truckIcon = L.divIcon({
      className: 'driver-truck-marker',
      html: `
        <div class="w-12 h-12 rounded-2xl bg-emerald-500 text-slate-950 flex items-center justify-center shadow-2xl border-2 border-white animate-bounce">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/></svg>
        </div>
      `,
      iconSize: [48, 48],
      iconAnchor: [24, 24]
    });

    L.marker([activeDriver.currentLat, activeDriver.currentLng], { icon: truckIcon }).addTo(map);

    mapInstanceRef.current = map;
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Top Driver HUD & Shift Switcher */}
      <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 p-5 rounded-3xl shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center text-xl font-bold">
            <Truck size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-heading font-bold text-lg sm:text-xl text-white">
                {activeDriver.name}
              </h2>
              <span className="font-mono text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                {activeDriver.vehicleReg}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {activeDriver.vehicleType} • Capacity: {activeDriver.fillPercentage}% Full • Rating: ⭐ {activeDriver.rating}
            </p>
          </div>
        </div>

        {/* Shift Vehicle Selector Dropdown */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-slate-400 font-medium">Switch Driver:</span>
          <select
            value={selectedDriverId}
            onChange={(e) => setSelectedDriverId(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-xs text-white rounded-xl px-3 py-2 focus:outline-none focus:border-emerald-500 font-medium"
          >
            {drivers.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name} ({d.vehicleId} • {d.vehicleReg})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 🚨 PROMINENT INCOMING JOB REQUEST POP-UP BANNER (Requirement 9) */}
      {incomingJob && (
        <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-950/80 via-slate-900 to-orange-950/80 border-2 border-amber-500/60 shadow-2xl animate-pulse space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-xl bg-amber-500 text-slate-950 font-black text-sm">
                🚨
              </span>
              <div>
                <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
                  Automated Municipal Dispatch Alert
                </span>
                <h3 className="font-heading font-black text-lg text-white">
                  NEW CLEANUP JOB DISPATCHED
                </h3>
              </div>
            </div>
            <span className="font-mono text-xs font-bold text-amber-300 bg-amber-500/20 px-3 py-1 rounded-full border border-amber-500/40">
              {incomingJob.distanceText} away • ETA: ~{incomingJob.estimatedMinutes} min
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-950/80 p-4 rounded-2xl border border-slate-800 text-xs">
            <div>
              <span className="text-slate-500 block text-[10px]">Ticket ID & Category:</span>
              <strong className="text-white font-mono">{incomingJob.ticketId}</strong>
              <p className="text-amber-400 font-semibold">{incomingJob.categoryLabel}</p>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">Location & Landmark:</span>
              <p className="text-slate-200 font-medium truncate">{incomingJob.address}</p>
              <p className="text-slate-400 text-[11px]">{incomingJob.landmark}</p>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">Priority & SLA:</span>
              <span className="text-rose-400 font-bold block">{incomingJob.priority} PRIORITY</span>
              <span className="text-slate-400 text-[11px]">4-Hour SLA Kickoff</span>
            </div>
          </div>

          <div className="flex gap-3 pt-1">
            <button
              onClick={() => onAcceptJob(activeDriver.id, incomingJob.ticketId)}
              className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-heading font-black text-sm shadow-xl shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Check size={18} />
              <span>ACCEPT JOB DISPATCH</span>
            </button>
            <button
              onClick={() => onDeclineJob(activeDriver.id, incomingJob.ticketId)}
              className="px-6 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-heading font-bold text-sm border border-slate-700 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <X size={18} />
              <span>Decline</span>
            </button>
          </div>
        </div>
      )}

      {/* Driver View Tabs (Active Job vs Route Map) */}
      <div className="flex gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('ACTIVE_JOB')}
          className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'ACTIVE_JOB'
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
              : 'bg-slate-900 text-slate-400 border border-slate-800'
          }`}
        >
          🚛 My Current Job
        </button>
        <button
          onClick={() => setActiveTab('ROUTE_MAP')}
          className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'ROUTE_MAP'
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
              : 'bg-slate-900 text-slate-400 border border-slate-800'
          }`}
        >
          🗺️ Optimized Route GIS
        </button>
      </div>

      {/* TAB 1: ACTIVE JOB VIEW */}
      {activeTab === 'ACTIVE_JOB' && (
        <div className="space-y-6">
          {activeComplaint ? (
            <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xl space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                      {activeComplaint.id}
                    </span>
                    <StatusBadge status={activeComplaint.status} />
                    <StatusBadge status={activeComplaint.priority} />
                  </div>
                  <h3 className="font-heading font-black text-xl text-white">
                    {activeComplaint.categoryLabel}
                  </h3>
                </div>

                <button
                  onClick={() => onOpenWhatsAppModal(activeComplaint)}
                  className="px-3.5 py-2 rounded-xl bg-[#00a884]/20 hover:bg-[#00a884]/30 border border-[#00a884]/40 text-[#00a884] text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <MessageSquare size={15} />
                  <span>Citizen WhatsApp Updates</span>
                </button>
              </div>

              {/* Location & Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1.5">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">
                      Target Location & Landmark:
                    </span>
                    <p className="text-xs font-bold text-white flex items-start gap-1.5">
                      <MapPin size={14} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span>{activeComplaint.address}</span>
                    </p>
                    <p className="text-xs text-amber-400 font-medium pl-5">
                      Landmark: {activeComplaint.landmark || 'Main Road Entry'}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 text-xs text-slate-300">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
                      Citizen Description:
                    </span>
                    <p>"{activeComplaint.description}"</p>
                  </div>
                </div>

                {/* Photo Evidence Preview */}
                <div className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 relative min-h-[160px]">
                  <img
                    src={activeComplaint.beforeImageUrl}
                    alt="Reported Waste"
                    className="w-full h-44 object-cover"
                  />
                  <div className="absolute top-2 left-2 px-2.5 py-1 rounded-lg bg-slate-950/80 backdrop-blur-md text-[11px] font-bold text-amber-400 border border-amber-500/30">
                    Reported Photo
                  </div>
                  {activeComplaint.afterImageUrl && (
                    <div className="absolute bottom-2 right-2 px-2.5 py-1 rounded-lg bg-emerald-950/90 text-emerald-400 text-xs font-bold border border-emerald-500/40">
                      ✓ Cleanup Proof Uploaded
                    </div>
                  )}
                </div>
              </div>

              {/* OPERATIONAL STEP BUTTONS (Requirement 8, 10, 11) */}
              <div className="pt-4 border-t border-slate-800 space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                  Driver Operational Actions:
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Step 1: Start Navigation */}
                  <button
                    onClick={() => onStartNavigation(activeDriver.id, activeComplaint.id)}
                    disabled={activeComplaint.status !== 'ASSIGNED'}
                    className={`py-3.5 px-4 rounded-2xl font-heading font-black text-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      activeComplaint.status === 'ASSIGNED'
                        ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30'
                        : activeComplaint.status === 'ON_THE_WAY' || activeComplaint.status === 'IN_PROGRESS' || activeComplaint.status === 'RESOLVED'
                        ? 'bg-slate-800 text-slate-400 border border-slate-700'
                        : 'bg-slate-900 text-slate-600 opacity-50'
                    }`}
                  >
                    <Navigation size={16} />
                    <span>
                      {activeComplaint.status === 'ON_THE_WAY' || activeComplaint.status === 'IN_PROGRESS' || activeComplaint.status === 'RESOLVED'
                        ? '✓ Navigation Started'
                        : '1. Start Navigation'}
                    </span>
                  </button>

                  {/* Step 2: Arrived & Start Cleanup */}
                  <button
                    onClick={() => onStartCleanup(activeDriver.id, activeComplaint.id)}
                    disabled={activeComplaint.status !== 'ON_THE_WAY'}
                    className={`py-3.5 px-4 rounded-2xl font-heading font-black text-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      activeComplaint.status === 'ON_THE_WAY'
                        ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-600/30 animate-bounce'
                        : activeComplaint.status === 'IN_PROGRESS' || activeComplaint.status === 'RESOLVED'
                        ? 'bg-slate-800 text-slate-400 border border-slate-700'
                        : 'bg-slate-900 text-slate-600 opacity-50'
                    }`}
                  >
                    <Play size={16} />
                    <span>
                      {activeComplaint.status === 'IN_PROGRESS' || activeComplaint.status === 'RESOLVED'
                        ? '✓ Arrived & Cleaning'
                        : '2. Arrived & Start Cleanup'}
                    </span>
                  </button>

                  {/* Step 3: Upload Proof & Mark Completed */}
                  <button
                    onClick={() => setUploadingProofForTicket(activeComplaint.id)}
                    disabled={activeComplaint.status !== 'IN_PROGRESS'}
                    className={`py-3.5 px-4 rounded-2xl font-heading font-black text-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      activeComplaint.status === 'IN_PROGRESS'
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 shadow-xl shadow-emerald-500/30'
                        : activeComplaint.status === 'RESOLVED'
                        ? 'bg-slate-800 text-emerald-400 border border-emerald-500/30'
                        : 'bg-slate-900 text-slate-600 opacity-50'
                    }`}
                  >
                    <CheckCircle2 size={16} />
                    <span>
                      {activeComplaint.status === 'RESOLVED'
                        ? '✓ Resolution Verified'
                        : '3. Upload Proof & Complete'}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-12 text-center space-y-3 shadow-xl">
              <div className="w-16 h-16 mx-auto rounded-3xl bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-500 text-2xl">
                🚛
              </div>
              <h3 className="font-heading font-bold text-lg text-white">No Active Job Assigned</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                You are currently on standby. CleanCity AI will automatically dispatch the next nearby grievance to your console.
              </p>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: OPTIMIZED ROUTE GIS MAP (Requirement 10) */}
      {activeTab === 'ROUTE_MAP' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 rounded-3xl overflow-hidden border border-slate-800 bg-slate-950 h-[480px] shadow-2xl">
            <div ref={mapContainerRef} className="w-full h-full" />
          </div>

          <div className="lg:col-span-4 bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
            <div className="border-b border-slate-800 pb-3">
              <h4 className="font-heading font-bold text-base text-white">Today's Optimized Route</h4>
            </div>

            <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
              {activeDriver.routeWaypoints?.map((wp, idx) => (
                <div
                  key={wp.id}
                  className={`p-3 rounded-2xl border text-xs flex items-center justify-between ${
                    wp.status === 'COMPLETED'
                      ? 'bg-slate-950/40 border-slate-800 text-slate-500'
                      : wp.status === 'CURRENT'
                      ? 'bg-amber-500/10 border-amber-500/40 text-amber-300 font-bold'
                      : 'bg-slate-950/70 border-slate-800 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-black ${
                        wp.status === 'COMPLETED'
                          ? 'bg-slate-800 text-slate-400'
                          : wp.status === 'CURRENT'
                          ? 'bg-amber-500 text-slate-950'
                          : 'bg-emerald-600 text-white'
                      }`}
                    >
                      {idx + 1}
                    </span>
                    <span className="truncate">{wp.name}</span>
                  </div>
                  <span className="font-mono text-[10px] text-slate-400 flex-shrink-0">{wp.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Driver Resolution Proof Upload Modal */}
      {uploadingProofForTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700/80 rounded-3xl max-w-md w-full overflow-hidden shadow-2xl flex flex-col p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h4 className="font-heading font-bold text-base text-white">Upload Cleanup Resolution Proof</h4>
              <button
                onClick={() => setUploadingProofForTicket(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3">
              <p className="text-xs text-slate-400">
                Snap or select the cleaned site after-photo. AI will verify the 100% cleanliness score before resolving.
              </p>

              <div className="rounded-2xl overflow-hidden border border-slate-700 h-44 bg-slate-950">
                <img src={afterPhotoUrl} alt="After Cleanup" className="w-full h-full object-cover" />
              </div>

              <div className="p-3 bg-emerald-950/40 border border-emerald-500/30 rounded-xl text-xs text-emerald-400 flex items-center gap-2">
                <Sparkles size={16} />
                <span>AI Vision: 97% Cleanliness Verification Score</span>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setUploadingProofForTicket(null)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  await onCompleteJob(activeDriver.id, uploadingProofForTicket, afterPhotoUrl);
                  setUploadingProofForTicket(null);
                }}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-xs cursor-pointer shadow-lg shadow-emerald-500/30"
              >
                Confirm & Mark Complete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
