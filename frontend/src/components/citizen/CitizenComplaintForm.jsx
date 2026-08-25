import React, { useState } from 'react';
import {
  Camera,
  MapPin,
  Send,
  Sparkles,
  CheckCircle2,
  Trash2,
  AlertTriangle,
  Clock,
  ArrowRight,
  ShieldCheck,
  Search,
  MessageSquare,
  Phone,
  Landmark
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { StatusBadge } from '../common/StatusBadge';
import { CameraCaptureModal } from './CameraCaptureModal';
import { LocationPickerModal } from './LocationPickerModal';
import { ComplaintTimelineModal } from './ComplaintTimelineModal';
import { WhatsAppTicketModal } from './WhatsAppTicketModal';
import { useLanguage } from '../../i18n';

const CATEGORIES = [
  { id: 'OVERFLOWING_BIN', label: 'Overflowing Smart Bin', icon: '🗑️', desc: 'Municipal bin is full and spilling' },
  { id: 'ILLEGAL_DUMPING', label: 'Illegal Roadside Dumping', icon: '🚫', desc: 'Garbage dumped on open plot/street' },
  { id: 'CONSTRUCTION_DEBRIS', label: 'Construction Debris (C&D)', icon: '🧱', desc: 'Cement, broken brick, rubble' },
  { id: 'HAZARDOUS_WASTE', label: 'Hazardous / Medical Waste', icon: '☣️', desc: 'Syringes, chemicals, biohazard' },
  { id: 'DEAD_ANIMAL', label: 'Dead Animal Removal', icon: '🐾', desc: 'Requires immediate sanitation team' },
  { id: 'OTHER_WASTE', label: 'Other Waste Issue', icon: '🧹', desc: 'Public litter, clogged open drain' }
];

export function CitizenComplaintForm({ complaints, onCreateComplaint, onResolveDemo, onBackToLanding }) {
  const { translate } = useLanguage();
  const [category, setCategory] = useState('OVERFLOWING_BIN');
  const [description, setDescription] = useState('');
  const [whatsappPhone, setWhatsappPhone] = useState('+91 98765 43210');
  const [landmark, setLandmark] = useState('Main Market Gate #2');
  const [photoData, setPhotoData] = useState(null);
  const [locationData, setLocationData] = useState({
    latitude: 23.0375,
    longitude: 72.5625,
    address: 'Near Navrangpura Vegetable Market, Ward 4, Ahmedabad',
    ward: 'Ward 4 (Navrangpura)'
  });

  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [selectedTimelineComplaint, setSelectedTimelineComplaint] = useState(null);
  const [selectedWhatsAppComplaint, setSelectedWhatsAppComplaint] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(null);
  const [duplicateMatch, setDuplicateMatch] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description.trim()) {
      alert(translate('Please enter a brief description of the waste problem.'));
      return;
    }

    setIsSubmitting(true);
    const categoryItem = CATEGORIES.find((c) => c.id === category);

    const newComplaint = await onCreateComplaint({
      channel: 'APP',
      citizenPhone: whatsappPhone || '+91 98765 43210',
      category,
      categoryLabel: categoryItem?.label || translate('Waste Grievance'),
      description,
      landmark: landmark || 'Nearby Landmark',
      priority: category === 'HAZARDOUS_WASTE' ? 'CRITICAL' : 'HIGH',
      address: locationData.address,
      ward: locationData.ward,
      latitude: locationData.latitude,
      longitude: locationData.longitude,
      beforeImageUrl:
        photoData?.imageUrl ||
        'https://images.unsplash.com/photo-1605600659873-d808a13e4d2a?w=800&auto=format&fit=crop&q=60',
      imageFingerprint: photoData?.imageUrl || null,
      aiConfidence: (photoData?.confidence || 96) / 100,
      aiTags: photoData?.tags || ['Citizen App Verified', 'Municipal Waste']
    });

    setIsSubmitting(false);
    if (newComplaint.isDuplicate) {
      setDuplicateMatch(newComplaint);
      setIsSubmitting(false);
      return;
    }

    setSubmittedSuccess(newComplaint);

    // Confetti celebration
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    // Reset Form
    setDescription('');
    setPhotoData(null);
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Top Welcome / Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900/90 backdrop-blur-xl border border-slate-800 p-6 rounded-3xl shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              CITIZEN CIVIC PORTAL
            </span>
            <span className="text-xs text-slate-400 font-medium">• {translate('Automated 4-Hr Dispatch')}</span>
          </div>
          <h2 className="font-heading font-black text-2xl text-white">{translate('Log Waste Grievance')}</h2>
        </div>

        {onBackToLanding && (
          <button
            onClick={onBackToLanding}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all cursor-pointer"
          >
            ← {translate('Back to CleanCity Home')}
          </button>
        )}
      </div>

      {/* Main Grid: Report Form (7 cols) & My Complaints (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form Column */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xl space-y-6">
            {submittedSuccess && (
              <div className="p-5 rounded-2xl bg-emerald-950/70 border-2 border-emerald-500/50 space-y-3 animate-fadeIn shadow-2xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                    <CheckCircle2 size={20} />
                    <span>{translate('Grievance Registered & Auto-Dispatched!')}</span>
                  </div>
                  <span className="font-mono text-xs font-bold text-emerald-300 bg-emerald-900/90 px-2.5 py-1 rounded-lg border border-emerald-500/40">
                    {submittedSuccess.id}
                  </span>
                </div>

                <p className="text-xs text-slate-300">
                  AI Computer Vision verified. SLA countdown started (4-Hour Resolution Target). A full digital ticket has been sent to your WhatsApp ({submittedSuccess.citizenPhone}).
                </p>

                <div className="flex flex-wrap gap-2 pt-1">
                  <button
                    onClick={() => setSelectedWhatsAppComplaint(submittedSuccess)}
                    className="px-4 py-2 rounded-xl bg-[#00a884] hover:bg-[#00a884]/90 text-slate-950 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <MessageSquare size={14} />
                    <span>{translate('View Digital WhatsApp Ticket Receipt')}</span>
                  </button>

                  <button
                    onClick={() => setSelectedTimelineComplaint(submittedSuccess)}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <span>{translate('Track Live Status')}</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            )}

            {duplicateMatch && (
              <div className="fixed inset-0 z-[1100] flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
                <div className="w-full max-w-md rounded-3xl border border-amber-400/40 bg-slate-900 p-5 shadow-2xl shadow-amber-950/30">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="mb-1 flex items-center gap-2 text-amber-300">
                        <AlertTriangle size={20} />
                        <h3 className="text-lg font-black">Duplicate report found</h3>
                      </div>
                      <p className="text-sm text-slate-300">This image was already submitted. Both reports were merged into one ticket.</p>
                    </div>
                    <button onClick={() => setDuplicateMatch(null)} aria-label="Close duplicate report" className="rounded-xl p-2 text-slate-400 hover:bg-slate-800 hover:text-white">
                      ×
                    </button>
                  </div>

                  <div className="mt-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-3">
                    <span className="font-mono text-sm font-black text-emerald-300">{duplicateMatch.id}</span>
                    <p className="mt-1 text-xs text-slate-300">{duplicateMatch.duplicateCount || 2} submissions merged</p>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-2">
                    {(duplicateMatch.duplicateImages || [duplicateMatch.beforeImageUrl]).map((image, index) => (
                      <img key={`${image}-${index}`} src={image} alt={`Merged report ${index + 1}`} className="h-28 w-full rounded-xl border border-slate-700 object-cover" />
                    ))}
                  </div>

                  <div className="mt-5 flex gap-2">
                    <button onClick={() => { setSelectedTimelineComplaint(duplicateMatch); setDuplicateMatch(null); }} className="flex-1 rounded-xl bg-emerald-500 px-3 py-2.5 text-xs font-black text-slate-950 hover:bg-emerald-400">
                      Track Existing Report
                    </button>
                    <button onClick={() => setDuplicateMatch(null)} className="rounded-xl border border-slate-700 px-3 py-2.5 text-xs font-bold text-slate-300 hover:bg-slate-800">
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Category Selector */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2.5">
                  {translate('1. Waste Grievance Category:')}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {CATEGORIES.map((cat) => {
                    const isSelected = category === cat.id;
                    return (
                      <button
                        type="button"
                        key={cat.id}
                        onClick={() => setCategory(cat.id)}
                        className={`p-3 rounded-2xl border text-left transition-all flex items-start gap-2.5 cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-950/50 border-emerald-500 ring-2 ring-emerald-500/20 text-white'
                            : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <span className="text-xl">{cat.icon}</span>
                        <div>
                          <p className="text-xs font-bold">{translate(cat.label)}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Photo Capture & Location Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Photo Trigger */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                    {translate('2. Photo Evidence:')}
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsCameraOpen(true)}
                    className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                      photoData
                        ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300'
                        : 'bg-slate-950/60 border-slate-800 hover:border-emerald-500/40 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 flex-shrink-0">
                        <Camera size={18} />
                      </div>
                      <div className="truncate">
                        <p className="text-xs font-bold text-white truncate">
                          {photoData ? translate('Photo Attached & AI Verified') : translate('Camera / Upload Photo')}
                        </p>
                      </div>
                    </div>
                    {photoData && (
                      <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full">
                        {photoData.confidence || 96}%
                      </span>
                    )}
                  </button>
                </div>

                {/* Location Trigger */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                    {translate('3. Geo Location & Pin:')}
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsLocationOpen(true)}
                    className="w-full p-3.5 rounded-2xl border border-slate-800 bg-slate-950/60 hover:border-emerald-500/40 text-left flex items-center justify-between transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 flex-shrink-0">
                        <MapPin size={18} />
                      </div>
                      <div className="truncate">
                        <p className="text-xs font-bold text-white truncate">{locationData.address}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full whitespace-nowrap">
                      {translate('Edit Pin')}
                    </span>
                  </button>
                </div>
              </div>

              {/* Landmark & WhatsApp Phone Number Inputs (Requirement 4) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                    {translate('4. Prominent Landmark:')}
                  </label>
                  <div className="relative">
                    <Landmark size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={landmark}
                      onChange={(e) => setLandmark(e.target.value)}
                      placeholder="e.g. Opposite Gate #2, Near Tea Stall"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                    {translate('5. Citizen WhatsApp Number (For Digital Receipt):')}
                  </label>
                  <div className="relative">
                    <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-green-400" />
                    <input
                      type="text"
                      value={whatsappPhone}
                      onChange={(e) => setWhatsappPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono transition-all"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Description Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                  {translate('6. Problem Description:')}
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the waste problem (e.g. Bin has been overflowing since 2 days, foul odor spilling over footpath)..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-3.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-all resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-slate-950 font-heading font-black text-sm shadow-xl shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Send size={18} />
                <span>{translate(isSubmitting ? 'Verifying & Submitting...' : 'Submit & Trigger Automated Dispatch')}</span>
              </button>
            </form>
          </div>
        </div>

        {/* Right: Recent Reported Grievances Tracker */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-heading font-bold text-base text-white">{translate('My Active Grievances')}</h3>
              </div>
              <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded font-bold">
                {complaints.length} Total
              </span>
            </div>

            <div className="space-y-3 max-h-[580px] overflow-y-auto pr-1">
              {complaints.map((c) => (
                <div
                  key={c.id}
                  className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 hover:border-emerald-500/40 hover:bg-slate-950 transition-all space-y-2.5 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                      {c.id}
                    </span>
                    <div className="flex gap-1">
                      <StatusBadge status={c.channel} />
                      <StatusBadge status={c.status} />
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="grid w-20 flex-shrink-0 grid-cols-2 gap-1">
                      <div className="relative">
                        <img src={c.beforeImageUrl} alt={`${c.categoryLabel} before cleaning`} className="h-16 w-full rounded-lg object-cover border border-amber-500/30" />
                        <span className="absolute bottom-0.5 left-0.5 rounded bg-slate-950/80 px-1 text-[8px] font-bold text-amber-300">Before</span>
                      </div>
                      <div className="relative flex h-16 items-center justify-center overflow-hidden rounded-lg border border-emerald-500/30 bg-slate-900">
                        {c.afterImageUrl ? <img src={c.afterImageUrl} alt={`${c.categoryLabel} after cleaning`} className="h-full w-full object-cover" /> : <span className="text-center text-[8px] font-bold text-slate-500">After<br />Pending</span>}
                        {c.afterImageUrl && <span className="absolute bottom-0.5 left-0.5 rounded bg-slate-950/80 px-1 text-[8px] font-bold text-emerald-300">After</span>}
                      </div>
                    </div>
                    <div className="overflow-hidden space-y-1">
                      <p className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors truncate">
                        {c.categoryLabel}
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                    <button
                      onClick={() => setSelectedWhatsAppComplaint(c)}
                      className="text-[11px] text-green-400 hover:text-green-300 font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <MessageSquare size={13} />
                      <span>{translate('WhatsApp Receipt')}</span>
                    </button>

                    <button
                      onClick={() => setSelectedTimelineComplaint(c)}
                      className="text-[11px] text-slate-300 hover:text-white font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <span>{translate('Timeline')}</span>
                      <ArrowRight size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <CameraCaptureModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onPhotoCaptured={(data) => setPhotoData(data)}
      />

      <LocationPickerModal
        isOpen={isLocationOpen}
        onClose={() => setIsLocationOpen(false)}
        onLocationSelected={(loc) => setLocationData(loc)}
        initialLat={locationData.latitude}
        initialLng={locationData.longitude}
        initialAddress={locationData.address}
      />

      <ComplaintTimelineModal
        complaint={selectedTimelineComplaint}
        isOpen={!!selectedTimelineComplaint}
        onClose={() => setSelectedTimelineComplaint(null)}
        onResolveDemo={onResolveDemo}
      />

      <WhatsAppTicketModal
        complaint={selectedWhatsAppComplaint}
        isOpen={!!selectedWhatsAppComplaint}
        onClose={() => setSelectedWhatsAppComplaint(null)}
      />
    </div>
  );
}
