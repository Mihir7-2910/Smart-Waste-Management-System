import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Navigation, Search, Check, X, Loader2, Sparkles } from 'lucide-react';
import L from 'leaflet';
import { SMART_BINS } from '../../data/mockData';
import { calculateDistanceKm, formatDistance } from '../../utils/distance';

const POPULAR_AREAS = [
  { name: 'Saraspur, Ahmedabad', lat: 23.0305, lng: 72.6074, ward: 'Ward 5 (Saraspur)' },
  { name: 'Navrangpura Vegetable Market', lat: 23.0375, lng: 72.5625, ward: 'Ward 4 (Navrangpura)' },
  { name: 'Vastrapur Lake Gate #3', lat: 23.0392, lng: 72.5310, ward: 'Ward 7 (Vastrapur)' },
  { name: 'Law Garden Food Street', lat: 23.0238, lng: 72.5568, ward: 'Ward 3 (Ellisbridge)' },
  { name: 'CG Road Crossroad 6', lat: 23.0315, lng: 72.5590, ward: 'Ward 4 (Navrangpura)' },
  { name: 'Maninagar Station Road', lat: 22.9978, lng: 72.6042, ward: 'Ward 9 (Maninagar)' },
  { name: 'Bodakdev Residential Sector', lat: 23.0450, lng: 72.5180, ward: 'Ward 8 (Bodakdev)' }
];

export function LocationPickerModal({ isOpen, onClose, onLocationSelected, initialLat, initialLng, initialAddress }) {
  const [lat, setLat] = useState(initialLat || 23.0375);
  const [lng, setLng] = useState(initialLng || 72.5625);
  const [address, setAddress] = useState(initialAddress || 'Near Navrangpura Vegetable Market, Ahmedabad');
  const [ward, setWard] = useState('Ward 4 (Navrangpura)');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isGpsLoading, setIsGpsLoading] = useState(false);
  const [nearestBin, setNearestBin] = useState(null);

  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const searchTimeoutRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        initMap();
      }, 150);
    } else {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    }
  }, [isOpen]);

  useEffect(() => {
    if (lat && lng) {
      let closest = null;
      let minDist = Infinity;
      SMART_BINS.forEach((bin) => {
        const d = calculateDistanceKm(lat, lng, bin.lat, bin.lng);
        if (d < minDist) {
          minDist = d;
          closest = { ...bin, distanceKm: d, formattedDist: formatDistance(d) };
        }
      });
      setNearestBin(closest);
    }
  }, [lat, lng]);

  // Live Address Search with OpenStreetMap Nominatim API
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setSearchResults([]);
      return;
    }

    clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            searchQuery + ', Gujarat, India'
          )}&limit=5&addressdetails=1`
        );
        const data = await res.json();
        if (data && data.length > 0) {
          setSearchResults(data);
        } else {
          // Fallback search without region suffix
          const fallbackRes = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
              searchQuery
            )}&limit=5`
          );
          const fallbackData = await fallbackRes.json();
          setSearchResults(fallbackData || []);
        }
      } catch (err) {
        console.warn('Geocoding search error:', err);
      } finally {
        setIsSearching(false);
      }
    }, 400);

    return () => clearTimeout(searchTimeoutRef.current);
  }, [searchQuery]);

  // Reverse Geocoding when pin is moved
  const reverseGeocode = async (latitude, longitude) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
      );
      const data = await res.json();
      if (data && data.display_name) {
        const road = data.address?.road || data.address?.suburb || data.address?.neighbourhood || '';
        const city = data.address?.city || data.address?.town || 'Ahmedabad';
        const formatted = road ? `${road}, ${city}` : data.display_name.split(',').slice(0, 3).join(',');
        setAddress(formatted);
      }
    } catch {
      // ignore
    }
  };

  const initMap = () => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
    }

    const map = L.map(mapContainerRef.current, {
      zoomControl: true,
      attributionControl: false
    }).setView([lat, lng], 15);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      maxZoom: 19
    }).addTo(map);

    // Draggable Pin Icon
    const pinIcon = L.divIcon({
      className: 'custom-pin',
      html: `
        <div class="relative flex items-center justify-center">
          <div class="w-10 h-10 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center shadow-2xl border-2 border-white animate-bounce cursor-grab">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
          </div>
        </div>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 40]
    });

    const marker = L.marker([lat, lng], {
      icon: pinIcon,
      draggable: true
    }).addTo(map);

    marker.on('dragend', (e) => {
      const pos = e.target.getLatLng();
      updateLocation(pos.lat, pos.lng, `Pinned Location (${pos.lat.toFixed(4)}, ${pos.lng.toFixed(4)})`);
      reverseGeocode(pos.lat, pos.lng);
    });

    map.on('click', (e) => {
      marker.setLatLng(e.latlng);
      updateLocation(e.latlng.lat, e.latlng.lng, `Map Point (${e.latlng.lat.toFixed(4)}, ${e.latlng.lng.toFixed(4)})`);
      reverseGeocode(e.latlng.lat, e.latlng.lng);
    });

    // Add smart bins
    SMART_BINS.forEach((bin) => {
      const binIcon = L.divIcon({
        className: 'bin-marker',
        html: `
          <div class="w-6 h-6 rounded-full ${
            bin.status === 'OVERFLOW' ? 'bg-rose-500' : 'bg-emerald-600'
          } border-2 border-white flex items-center justify-center text-white text-[10px] font-bold shadow-md">
            🗑️
          </div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });

      L.marker([bin.lat, bin.lng], { icon: binIcon })
        .addTo(map)
        .bindPopup(`<b>${bin.name}</b><br/>Capacity: ${bin.currentFill}% filled`);
    });

    mapInstanceRef.current = map;
    markerRef.current = marker;
  };

  const updateLocation = (newLat, newLng, newAddr, newWard) => {
    setLat(newLat);
    setLng(newLng);
    if (newAddr) setAddress(newAddr);
    if (newWard) setWard(newWard);
    if (markerRef.current) {
      markerRef.current.setLatLng([newLat, newLng]);
    }
    if (mapInstanceRef.current) {
      mapInstanceRef.current.panTo([newLat, newLng]);
    }
  };

  // Robust Live GPS with Browser Geolocation & IP Fallback
  const useCurrentGPS = () => {
    setIsGpsLoading(true);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setIsGpsLoading(false);
          const currentLatitude = pos.coords.latitude;
          const currentLongitude = pos.coords.longitude;
          updateLocation(
            currentLatitude,
            currentLongitude,
            `Live GPS Position (${currentLatitude.toFixed(4)}, ${currentLongitude.toFixed(4)})`,
            'Current Ward Location'
          );
          reverseGeocode(currentLatitude, currentLongitude);
        },
        async (err) => {
          console.warn('Browser GPS permission error, trying IP-based network location fallback...', err);
          // IP-Based Geolocation Fallback so it never fails!
          try {
            const ipRes = await fetch('https://ipapi.co/json/');
            const ipData = await ipRes.json();
            if (ipData && ipData.latitude && ipData.longitude) {
              setIsGpsLoading(false);
              const ipLat = parseFloat(ipData.latitude);
              const ipLng = parseFloat(ipData.longitude);
              updateLocation(
                ipLat,
                ipLng,
                `${ipData.city || 'Ahmedabad'}, ${ipData.region || 'Gujarat'} (Network Location)`,
                `Ward Area (${ipData.city || 'Central'})`
              );
              reverseGeocode(ipLat, ipLng);
              return;
            }
          } catch {
            // fallback to central
          }
          setIsGpsLoading(false);
          updateLocation(23.0375, 72.5625, 'Navrangpura Market, Ward 4, Ahmedabad', 'Ward 4 (Navrangpura)');
        },
        {
          enableHighAccuracy: true,
          timeout: 7000,
          maximumAge: 0
        }
      );
    } else {
      setIsGpsLoading(false);
    }
  };

  const handleSelectSearchResult = (result) => {
    const rLat = parseFloat(result.lat);
    const rLng = parseFloat(result.lon);
    const shortName = result.display_name.split(',').slice(0, 3).join(',');
    updateLocation(rLat, rLng, shortName, 'Selected Search Ward');
    setSearchResults([]);
    setSearchQuery('');
  };

  const handleSelectPreset = (preset) => {
    updateLocation(preset.lat, preset.lng, preset.name, preset.ward);
    setSearchQuery('');
    setSearchResults([]);
  };

  const handleConfirm = () => {
    onLocationSelected({
      latitude: lat,
      longitude: lng,
      address,
      ward,
      nearestBin: nearestBin?.id || null
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex justify-between items-center bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <MapPin size={20} />
            </div>
            <div>
              <h3 className="font-heading font-bold text-lg text-white">Select Complaint Location</h3>
              <p className="text-xs text-slate-400">Search any area (e.g. Saraspur), drag pin, or use Live GPS</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-all cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Search & GPS Bar */}
        <div className="p-4 bg-slate-950/40 border-b border-slate-800 space-y-3 relative">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search area (e.g. Saraspur, Maninagar, Navrangpura)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-8 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-all"
              />
              {isSearching && (
                <Loader2 size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-400 animate-spin" />
              )}
            </div>
            <button
              onClick={useCurrentGPS}
              disabled={isGpsLoading}
              className="px-4 py-2.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/40 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap shadow-md"
            >
              {isGpsLoading ? (
                <Loader2 size={14} className="animate-spin text-emerald-400" />
              ) : (
                <Navigation size={14} className="text-emerald-400" />
              )}
              <span>{isGpsLoading ? 'Detecting...' : 'Live GPS'}</span>
            </button>
          </div>

          {/* Live Search Autocomplete Dropdown */}
          {searchResults.length > 0 && (
            <div className="absolute top-14 left-4 right-4 z-[500] bg-slate-900/95 backdrop-blur-xl border border-emerald-500/40 rounded-2xl p-2 shadow-2xl space-y-1 max-h-48 overflow-y-auto">
              {searchResults.map((result, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectSearchResult(result)}
                  className="w-full text-left p-2.5 rounded-xl hover:bg-slate-800 text-xs text-slate-200 hover:text-white transition-all flex items-start gap-2 cursor-pointer border-b border-slate-800/40 last:border-0"
                >
                  <MapPin size={14} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span className="truncate">{result.display_name}</span>
                </button>
              ))}
            </div>
          )}

          {/* Quick Area Tags */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            <span className="text-[11px] font-semibold text-slate-500 whitespace-nowrap">Quick:</span>
            {POPULAR_AREAS.map((item, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectPreset(item)}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-emerald-600 hover:text-white text-slate-300 border border-slate-700 whitespace-nowrap transition-all cursor-pointer"
              >
                {item.name}
              </button>
            ))}
          </div>
        </div>

        {/* Map View */}
        <div className="relative flex-1 min-h-[300px] bg-slate-950">
          <div ref={mapContainerRef} className="w-full h-full" />
          
          {/* Coordinates HUD Overlay */}
          <div className="absolute bottom-3 left-3 z-[400] bg-slate-950/90 backdrop-blur-md px-3.5 py-2.5 rounded-xl border border-slate-700/80 text-xs text-slate-200 shadow-xl space-y-1">
            <div className="flex items-center gap-1.5 text-emerald-400 font-bold font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>{lat.toFixed(5)}° N, {lng.toFixed(5)}° E</span>
            </div>
            <p className="text-[11px] text-slate-300 truncate max-w-[280px] font-medium">{address}</p>
          </div>

          {/* Nearest Bin HUD */}
          {nearestBin && (
            <div className="absolute top-3 right-3 z-[400] bg-slate-950/90 backdrop-blur-md px-3 py-2 rounded-xl border border-emerald-500/30 text-xs text-slate-300 shadow-xl">
              <span className="text-[10px] text-slate-400 block uppercase font-semibold">Nearest Smart Bin:</span>
              <span className="font-bold text-emerald-400">{nearestBin.name}</span>
              <span className="text-slate-400 text-[11px] block">({nearestBin.formattedDist} away)</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-950/80 flex justify-between items-center">
          <div className="overflow-hidden pr-2">
            <p className="text-xs font-bold text-white truncate max-w-xs">{address}</p>
            <p className="text-[11px] text-slate-400">{ward}</p>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Check size={16} />
              <span>Confirm Location</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
