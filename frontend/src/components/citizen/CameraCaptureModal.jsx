import React, { useState, useRef, useEffect } from 'react';
import { Camera, X, Check, RefreshCw, Upload, Sparkles, AlertCircle } from 'lucide-react';

const SAMPLE_PRESETS = [
  {
    name: 'Overflowing Bin (Market)',
    url: 'https://images.unsplash.com/photo-1605600659873-d808a13e4d2a?w=800&auto=format&fit=crop&q=60',
    tags: ['Overflowing Bin', 'Organic Waste 75%', 'Urgent Pickup Required'],
    confidence: 96
  },
  {
    name: 'Illegal Plastic Dump',
    url: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=800&auto=format&fit=crop&q=60',
    tags: ['Single-Use Plastics', 'Roadside Hazard', 'Dry Recyclable'],
    confidence: 92
  },
  {
    name: 'Construction Debris',
    url: 'https://images.unsplash.com/photo-1595278069441-2cf29f8005a4?w=800&auto=format&fit=crop&q=60',
    tags: ['C&D Debris', 'Drainage Blockage', 'Heavy Machinery Needed'],
    confidence: 94
  },
  {
    name: 'Medical / Hazardous Waste',
    url: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800&auto=format&fit=crop&q=60',
    tags: ['Hazardous / Clinical', 'Biohazard Protocol', 'Priority 1'],
    confidence: 98
  }
];

export function CameraCaptureModal({ isOpen, onClose, onPhotoCaptured }) {
  const [capturedImage, setCapturedImage] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [detectedTags, setDetectedTags] = useState([]);
  const [aiConfidence, setAiConfidence] = useState(null);
  const [useLiveVideo, setUseLiveVideo] = useState(false);
  const videoRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!isOpen) {
      setCapturedImage(null);
      setIsScanning(false);
      setDetectedTags([]);
      setAiConfidence(null);
      stopVideoStream();
    }
  }, [isOpen]);

  const startVideoStream = async () => {
    try {
      setUseLiveVideo(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.warn('Camera stream not allowed or unavailable:', err);
      setUseLiveVideo(false);
    }
  };

  const stopVideoStream = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject;
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setUseLiveVideo(false);
  };

  const takeSnapshot = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth || 640;
      canvas.height = videoRef.current.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg');
      stopVideoStream();
      processImage(dataUrl, ['Camera Snapshot', 'Municipal Waste Identified'], 95);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        processImage(
          uploadEvent.target.result,
          ['User Photo Upload', 'Waste Debris Detected', 'GPS Exif Tagged'],
          93
        );
      };
      reader.readAsDataURL(file);
    }
  };

  const selectPreset = (preset) => {
    stopVideoStream();
    processImage(preset.url, preset.tags, preset.confidence);
  };

  const processImage = (url, tags, confidence) => {
    setCapturedImage(url);
    setIsScanning(true);
    // Simulate AI Vision scanning micro-delay
    setTimeout(() => {
      setIsScanning(false);
      setDetectedTags(tags);
      setAiConfidence(confidence);
    }, 600);
  };

  const handleConfirm = () => {
    if (capturedImage) {
      onPhotoCaptured({
        imageUrl: capturedImage,
        tags: detectedTags,
        confidence: aiConfidence
      });
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex justify-between items-center bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <Camera size={20} />
            </div>
            <div>
              <h3 className="font-heading font-bold text-lg text-white">Smart Camera & AI Vision</h3>
              <p className="text-xs text-slate-400">Capture or upload photo for instant verification</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-all cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Viewfinder / Preview Area */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4">
          <div className="relative aspect-video rounded-2xl bg-slate-950 border-2 border-dashed border-slate-700 overflow-hidden flex items-center justify-center">
            {useLiveVideo ? (
              <div className="relative w-full h-full">
                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                <div className="absolute inset-0 border-2 border-emerald-500/50 m-4 rounded-xl pointer-events-none flex flex-col justify-between p-2">
                  <div className="flex justify-between text-[10px] text-emerald-400 font-mono">
                    <span>[LIVE_FEED_01]</span>
                    <span>AI_SCANNER_READY</span>
                  </div>
                  <div className="text-center text-xs text-emerald-400/80 font-mono bg-slate-950/60 py-1 rounded">
                    Align waste inside frame
                  </div>
                </div>
                <button
                  onClick={takeSnapshot}
                  className="absolute bottom-4 left-1/2 -translate-x-1/2 px-6 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold shadow-lg shadow-emerald-500/30 flex items-center gap-2 transition-all cursor-pointer"
                >
                  <Camera size={18} />
                  <span>Snap Photo</span>
                </button>
              </div>
            ) : capturedImage ? (
              <div className="relative w-full h-full">
                <img
                  src={capturedImage}
                  alt="Captured Waste"
                  className="w-full h-full object-cover"
                />
                {isScanning && (
                  <div className="absolute inset-0 bg-slate-950/70 flex flex-col items-center justify-center gap-2">
                    <Sparkles className="animate-spin text-emerald-400" size={32} />
                    <span className="text-sm font-bold text-emerald-300 font-mono animate-pulse">
                      AI Scanning Waste Classification...
                    </span>
                  </div>
                )}
                {!isScanning && aiConfidence && (
                  <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-emerald-500/40 text-xs font-semibold text-emerald-400 flex items-center gap-1.5 shadow-lg">
                    <Sparkles size={14} />
                    <span>AI Verified ({aiConfidence}%)</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center p-6 space-y-3">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500">
                  <Camera size={28} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-300">No Photo Selected</p>
                  <p className="text-xs text-slate-500 mt-1">
                    Start live camera, upload an image, or click any preset below
                  </p>
                </div>
                <div className="flex justify-center gap-2 pt-2">
                  <button
                    onClick={startVideoStream}
                    className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Camera size={16} />
                    <span>Live Camera</span>
                  </button>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border border-slate-700"
                  >
                    <Upload size={16} />
                    <span>Upload File</span>
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>
              </div>
            )}
          </div>

          {/* AI Detected Tags */}
          {detectedTags.length > 0 && !isScanning && (
            <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <Sparkles size={14} />
                  AI Vision Analysis Result
                </span>
                <span className="font-mono text-slate-400">{aiConfidence}% Match</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {detectedTags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Demo Presets Selector */}
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
              Or Choose Hackathon Demo Sample Photo:
            </span>
            <div className="grid grid-cols-2 gap-2">
              {SAMPLE_PRESETS.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => selectPreset(preset)}
                  className="p-2.5 rounded-xl bg-slate-950/70 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/40 text-left transition-all flex items-center gap-2 cursor-pointer group"
                >
                  <img
                    src={preset.url}
                    alt={preset.name}
                    className="w-10 h-10 rounded-lg object-cover border border-slate-700 flex-shrink-0"
                  />
                  <div className="overflow-hidden">
                    <p className="text-xs font-semibold text-slate-300 group-hover:text-emerald-400 truncate">
                      {preset.name}
                    </p>
                    <p className="text-[10px] text-slate-500 truncate">{preset.tags[0]}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-950/80 flex justify-between items-center">
          <button
            onClick={() => {
              setCapturedImage(null);
              setDetectedTags([]);
              setAiConfidence(null);
            }}
            disabled={!capturedImage}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white disabled:opacity-40 transition-all cursor-pointer flex items-center gap-1.5"
          >
            <RefreshCw size={14} />
            <span>Retake</span>
          </button>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={!capturedImage || isScanning}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 disabled:opacity-50 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Check size={16} />
              <span>Use This Photo</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
