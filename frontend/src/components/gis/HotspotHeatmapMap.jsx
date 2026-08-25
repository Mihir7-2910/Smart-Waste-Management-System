import React, { useState, useEffect, useRef } from 'react';
import {
  Flame,
  Sparkles,
  Calendar,
  Truck,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  MapPin,
  Layers,
  Zap,
  Info
} from 'lucide-react';
import L from 'leaflet';
import { SMART_BINS, AI_PREDICTIONS } from '../../data/mockData';

export function HotspotHeatmapMap({ predictions = AI_PREDICTIONS }) {
  const [selectedPrediction, setSelectedPrediction] = useState(predictions[0]);
  const [dispatchedEvents, setDispatchedEvents] = useState({});
  const [activeLayer, setActiveLayer] = useState('ALL'); // ALL, HEATMAP, BINS

  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);

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
  }, [activeLayer]);

  const initMap = () => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
    }

    const map = L.map(mapContainerRef.current, {
      zoomControl: true,
      attributionControl: false
    }).setView([23.0375, 72.5550], 13);

    // Dark base tiles
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      maxZoom: 19
    }).addTo(map);

    // Simulated Waste Hotspot Circles (High Density Clusters)
    const HOTSPOTS = [
      { lat: 23.0375, lng: 72.5625, radius: 450, intensity: 'High (Market Spike)', color: '#f43f5e' },
      { lat: 23.0392, lng: 72.5310, radius: 550, intensity: 'Severe (Weekend Crowd)', color: '#ef4444' },
      { lat: 23.0238, lng: 72.5568, radius: 400, intensity: 'Medium (Food Street)', color: '#f59e0b' },
      { lat: 23.0315, lng: 72.5590, radius: 350, intensity: 'Moderate (Commercial)', color: '#eab308' },
    ];

    if (activeLayer === 'ALL' || activeLayer === 'HEATMAP') {
      HOTSPOTS.forEach((spot) => {
        L.circle([spot.lat, spot.lng], {
          color: spot.color,
          fillColor: spot.color,
          fillOpacity: 0.35,
          radius: spot.radius
        })
          .addTo(map)
          .bindPopup(`
            <div style="font-size:12px">
              <strong style="color:${spot.color}">🔥 Waste Hotspot Zone</strong><br/>
              <span>Density: <b>${spot.intensity}</b></span><br/>
              <span>Predicted Spillage Radius: ${spot.radius}m</span>
            </div>
          `);
      });
    }

    // Smart IoT Bins
    if (activeLayer === 'ALL' || activeLayer === 'BINS') {
      SMART_BINS.forEach((bin) => {
        const isOverflow = bin.status === 'OVERFLOW';
        const binIcon = L.divIcon({
          className: 'custom-bin-icon',
          html: `
            <div class="w-8 h-8 rounded-xl ${
              isOverflow ? 'bg-rose-500 ring-4 ring-rose-500/30' : 'bg-emerald-600'
            } text-white flex items-center justify-center text-xs font-bold shadow-xl border-2 border-white">
              🗑️
            </div>
          `,
          iconSize: [32, 32],
          iconAnchor: [16, 16]
        });

        L.marker([bin.lat, bin.lng], { icon: binIcon })
          .addTo(map)
          .bindPopup(`
            <div style="font-size:12px; line-height:1.4">
              <strong>${bin.name}</strong><br/>
              <span>Code: <code>${bin.id}</code></span><br/>
              <span>Fill Level: <b style="color:${isOverflow ? '#ef4444' : '#10b981'}">${bin.currentFill}%</b></span><br/>
              <span>Battery: ${bin.battery}%</span>
            </div>
          `);
      });
    }

    mapInstanceRef.current = map;
  };

  const handlePreAllocate = (predId) => {
    setDispatchedEvents((prev) => ({
      ...prev,
      [predId]: true
    }));
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900/90 backdrop-blur-xl border border-slate-800 p-5 rounded-3xl shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/30 shadow-lg shadow-purple-500/10">
            <Flame size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-heading font-bold text-xl text-white">AI Waste Hotspot & Event Predictor</h2>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40 font-mono">
                ML MODEL v2.4
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Predicts festival/event waste surges 48 hours in advance to pre-allocate compactor fleets
            </p>
          </div>
        </div>

        {/* Layer Switcher */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-2xl border border-slate-800">
          <button
            onClick={() => setActiveLayer('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeLayer === 'ALL' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            All Layers
          </button>
          <button
            onClick={() => setActiveLayer('HEATMAP')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeLayer === 'HEATMAP' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Hotspots
          </button>
          <button
            onClick={() => setActiveLayer('BINS')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeLayer === 'BINS' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Smart Bins
          </button>
        </div>
      </div>

      {/* Main Content Grid: GIS Map (7 cols) + AI Predictive Event Cards (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Map Column */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative rounded-3xl overflow-hidden border border-slate-800 bg-slate-950 h-[540px] shadow-2xl">
            <div ref={mapContainerRef} className="w-full h-full" />

            {/* Map Legend */}
            <div className="absolute bottom-4 left-4 z-[400] bg-slate-950/90 backdrop-blur-xl p-3.5 rounded-2xl border border-slate-800 text-xs shadow-2xl space-y-2">
              <span className="font-bold text-white uppercase text-[10px] tracking-wider block">
                GIS Density Legend:
              </span>
              <div className="flex items-center gap-2 text-slate-300 text-[11px]">
                <span className="w-3 h-3 rounded-full bg-rose-500"></span>
                <span>Severe Overflow Hotspot (&gt;85% Risk)</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300 text-[11px]">
                <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                <span>Moderate Hotspot (50-80% Risk)</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300 text-[11px]">
                <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                <span>Healthy Smart Bin (&lt;50% Fill)</span>
              </div>
            </div>
          </div>
        </div>

        {/* AI Event Spike Prediction Cards Column */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-heading font-bold text-base text-white">AI Surge Forecasts</h3>
              </div>
              <span className="text-xs font-mono text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded font-bold">
                {predictions.length} Active Alerts
              </span>
            </div>

            <div className="space-y-3.5 max-h-[440px] overflow-y-auto pr-1">
              {predictions.map((pred) => {
                const isDispatched = dispatchedEvents[pred.id];
                return (
                  <div
                    key={pred.id}
                    className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-purple-500/40 transition-all space-y-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded">
                          {pred.ward}
                        </span>
                        <h4 className="font-heading font-bold text-sm text-white mt-1">
                          {pred.eventTitle}
                        </h4>
                      </div>
                      <span className="font-mono text-xs font-extrabold text-rose-400 bg-rose-500/15 px-2 py-1 rounded-xl border border-rose-500/30 whitespace-nowrap">
                        {pred.predictedSpike}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-900/80 p-2.5 rounded-xl border border-slate-800/80">
                      <div>
                        <span className="text-slate-500 block">Timeframe:</span>
                        <span className="text-slate-200 font-semibold">{pred.timeframe}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Estimated Tonnage:</span>
                        <span className="text-amber-400 font-mono font-bold">{pred.estimatedTonnage}</span>
                      </div>
                    </div>

                    <div className="text-[11px] text-slate-300 bg-purple-950/20 p-2.5 rounded-xl border border-purple-500/20">
                      <strong className="text-purple-300 block mb-0.5">Recommended Municipal Action:</strong>
                      <span>{pred.recommendedAction}</span>
                    </div>

                    <div className="pt-1 flex items-center justify-between">
                      <span className="text-[10px] text-slate-500 font-mono">
                        Model Confidence: {pred.confidence}
                      </span>
                      <button
                        onClick={() => handlePreAllocate(pred.id)}
                        disabled={isDispatched}
                        className={`text-xs px-3.5 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                          isDispatched
                            ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-600/30'
                        }`}
                      >
                        {isDispatched ? <CheckCircle2 size={13} /> : <Zap size={13} />}
                        <span>{isDispatched ? 'Pre-Allocation Dispatched' : 'Pre-Allocate Extra Trucks'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
