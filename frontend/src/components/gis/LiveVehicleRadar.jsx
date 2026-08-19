import React, { useState, useEffect, useRef } from 'react';
import {
  Truck,
  MapPin,
  Navigation,
  Clock,
  Battery,
  Fuel,
  Gauge,
  User,
  Phone,
  ShieldCheck,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  ChevronRight
} from 'lucide-react';
import L from 'leaflet';
import { StatusBadge } from '../common/StatusBadge';

export function LiveVehicleRadar({ vehicles }) {
  const [selectedVehicleId, setSelectedVehicleId] = useState(vehicles[0]?.id || 'TRK-01');
  const [isSimulating, setIsSimulating] = useState(true);
  const [simStep, setSimStep] = useState(0);

  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const vehicleMarkerRef = useRef(null);
  const polylineRef = useRef(null);
  const waypointMarkersRef = useRef([]);

  const activeVehicle = vehicles.find((v) => v.id === selectedVehicleId) || vehicles[0];

  // Route animation loop
  useEffect(() => {
    let interval;
    if (isSimulating && activeVehicle?.waypoints?.length > 1) {
      interval = setInterval(() => {
        setSimStep((prev) => (prev + 1) % 100);
      }, 400);
    }
    return () => clearInterval(interval);
  }, [isSimulating, activeVehicle]);

  useEffect(() => {
    setTimeout(() => {
      initMap();
    }, 150);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [selectedVehicleId]);

  // Update animated vehicle marker position along waypoints
  useEffect(() => {
    if (!mapInstanceRef.current || !activeVehicle || !activeVehicle.waypoints?.length) return;

    const wps = activeVehicle.waypoints;
    const currentWP = wps.find((w) => w.status === 'CURRENT') || wps[1] || wps[0];
    const nextWP = wps.find((w) => w.status === 'PENDING') || wps[wps.length - 1];

    if (currentWP && nextWP) {
      const progress = (simStep % 100) / 100;
      const interpLat = currentWP.lat + (nextWP.lat - currentWP.lat) * progress;
      const interpLng = currentWP.lng + (nextWP.lng - currentWP.lng) * progress;

      if (vehicleMarkerRef.current) {
        vehicleMarkerRef.current.setLatLng([interpLat, interpLng]);
      }
    }
  }, [simStep, activeVehicle]);

  const initMap = () => {
    if (!mapContainerRef.current || !activeVehicle) return;
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
    }

    const map = L.map(mapContainerRef.current, {
      zoomControl: true,
      attributionControl: false
    }).setView([activeVehicle.currentLat, activeVehicle.currentLng], 14);

    // Dark sleek map tiles
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      maxZoom: 19
    }).addTo(map);

    // Render Route Polylines
    if (activeVehicle.waypoints?.length > 0) {
      const coords = activeVehicle.waypoints.map((w) => [w.lat, w.lng]);
      polylineRef.current = L.polyline(coords, {
        color: '#10b981',
        weight: 4,
        opacity: 0.8,
        dashArray: '8, 8',
        lineCap: 'round'
      }).addTo(map);

      // Render Waypoints
      waypointMarkersRef.current = activeVehicle.waypoints.map((wp, idx) => {
        const isCompleted = wp.status === 'COMPLETED';
        const isCurrent = wp.status === 'CURRENT';

        const wpIcon = L.divIcon({
          className: 'custom-wp-icon',
          html: `
            <div class="w-7 h-7 rounded-full ${
              isCompleted
                ? 'bg-slate-700 text-slate-400'
                : isCurrent
                ? 'bg-amber-500 text-slate-950 ring-4 ring-amber-500/30'
                : 'bg-emerald-600 text-white'
            } border-2 border-slate-950 flex items-center justify-center text-[11px] font-black shadow-lg">
              ${idx + 1}
            </div>
          `,
          iconSize: [28, 28],
          iconAnchor: [14, 14]
        });

        const m = L.marker([wp.lat, wp.lng], { icon: wpIcon }).addTo(map);
        m.bindPopup(`
          <div style="font-size:12px; line-height:1.4">
            <strong style="color:#10b981">Waypoint ${idx + 1}: ${wp.name}</strong><br/>
            <span>Status: <b>${wp.status}</b></span><br/>
            <span>Scheduled: ${wp.time}</span>
          </div>
        `);
        return m;
      });
    }

    // Vehicle Animated Marker (Truck Pin)
    const truckIcon = L.divIcon({
      className: 'custom-truck-icon',
      html: `
        <div class="relative flex items-center justify-center">
          <div class="w-12 h-12 rounded-2xl bg-emerald-500 text-slate-950 flex items-center justify-center shadow-2xl border-2 border-white animate-pulse">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/></svg>
          </div>
          <div class="absolute -bottom-6 bg-slate-950/90 text-white font-mono text-[10px] px-2 py-0.5 rounded border border-emerald-500/40 font-bold whitespace-nowrap">
            ${activeVehicle.id} • ${activeVehicle.speedKmH} km/h
          </div>
        </div>
      `,
      iconSize: [48, 48],
      iconAnchor: [24, 24]
    });

    vehicleMarkerRef.current = L.marker([activeVehicle.currentLat, activeVehicle.currentLng], {
      icon: truckIcon,
      zIndexOffset: 1000
    }).addTo(map);

    mapInstanceRef.current = map;
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900/90 backdrop-blur-xl border border-slate-800 p-5 rounded-3xl shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-lg shadow-emerald-500/10">
            <Truck size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-heading font-bold text-xl text-white">Rapido/Uber-Style Fleet Radar</h2>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-mono">
                LIVE GPS
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Live tracking of municipal waste collection compactors, tippers, and routes
            </p>
          </div>
        </div>

        {/* Simulation Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsSimulating(!isSimulating)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              isSimulating
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30'
            }`}
          >
            {isSimulating ? <Pause size={14} /> : <Play size={14} />}
            <span>{isSimulating ? 'Pause Route Simulation' : 'Resume Live Route'}</span>
          </button>
        </div>
      </div>

      {/* Main Map + Driver Telemetry Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive Live Map (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="relative rounded-3xl overflow-hidden border border-slate-800 bg-slate-950 h-[520px] shadow-2xl">
            <div ref={mapContainerRef} className="w-full h-full" />

            {/* Live Telemetry Floating HUD */}
            <div className="absolute top-4 left-4 z-[400] bg-slate-950/90 backdrop-blur-xl p-4 rounded-2xl border border-slate-800 text-xs shadow-2xl space-y-2.5 max-w-xs">
              <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                  {activeVehicle.regNumber}
                </span>
                <span className="font-mono text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded">
                  {activeVehicle.id}
                </span>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-slate-400 text-[11px]">
                  <span>Active Route:</span>
                  <span className="text-slate-200 font-semibold truncate max-w-[150px]">{activeVehicle.activeRouteName}</span>
                </div>
                <div className="flex justify-between text-slate-400 text-[11px]">
                  <span>Speed:</span>
                  <span className="text-emerald-400 font-mono font-bold">{activeVehicle.speedKmH} km/h</span>
                </div>
                <div className="flex justify-between text-slate-400 text-[11px]">
                  <span>Truck Fill Level:</span>
                  <span className="text-amber-400 font-mono font-bold">{activeVehicle.fillPercentage}% Full</span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    activeVehicle.fillPercentage > 80 ? 'bg-rose-500' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${activeVehicle.fillPercentage}%` }}
                ></div>
              </div>
            </div>

            {/* Next Collection ETA Banner */}
            {activeVehicle.currentWaypoint && (
              <div className="absolute bottom-4 left-4 right-4 z-[400] bg-slate-950/95 backdrop-blur-xl p-3.5 rounded-2xl border border-emerald-500/30 shadow-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/30">
                    <Navigation size={18} />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                      Current Target Pickup:
                    </span>
                    <p className="text-xs font-bold text-white">{activeVehicle.currentWaypoint.name}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Estimated Arrival</span>
                    <p className="text-sm font-black text-emerald-400 font-mono">
                      ~ {activeVehicle.etaMinutes} Mins ETA
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Fleet Selector & Route Waypoints List (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Vehicle Selector Tabs */}
          <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
            <h3 className="font-heading font-bold text-base text-white">Active Municipal Fleet</h3>

            <div className="space-y-2.5">
              {vehicles.map((veh) => {
                const isSelected = veh.id === selectedVehicleId;
                return (
                  <button
                    key={veh.id}
                    onClick={() => setSelectedVehicleId(veh.id)}
                    className={`w-full p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-emerald-950/60 border-emerald-500 ring-2 ring-emerald-500/20 text-white'
                        : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div
                        className={`p-2.5 rounded-xl ${
                          isSelected
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        <Truck size={18} />
                      </div>
                      <div className="overflow-hidden">
                        <div className="flex items-center gap-1.5">
                          <p className="text-xs font-bold text-white truncate">{veh.driverName}</p>
                          <span className="text-[9px] font-mono px-1 rounded bg-slate-800 text-slate-300">
                            {veh.id}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 truncate">{veh.vehicleType}</p>
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <span className="text-xs font-mono font-bold text-emerald-400 block">
                        {veh.fillPercentage}% Full
                      </span>
                      <span className="text-[10px] text-slate-500">{veh.status}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Waypoints Sequence List */}
          <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-5 shadow-xl space-y-3">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2.5">
              <h4 className="font-heading font-bold text-sm text-white">Route Stops Sequence</h4>
              <span className="text-xs text-slate-400 font-mono">
                {activeVehicle.waypoints?.filter((w) => w.status === 'COMPLETED').length} /{' '}
                {activeVehicle.waypoints?.length || 0} Cleared
              </span>
            </div>

            <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
              {activeVehicle.waypoints?.map((wp, idx) => (
                <div
                  key={wp.id}
                  className={`p-2.5 rounded-xl flex items-center justify-between text-xs border ${
                    wp.status === 'COMPLETED'
                      ? 'bg-slate-950/40 border-slate-800 text-slate-500'
                      : wp.status === 'CURRENT'
                      ? 'bg-amber-500/10 border-amber-500/40 text-amber-300 font-bold'
                      : 'bg-slate-950/70 border-slate-800 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
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
      </div>
    </div>
  );
}
