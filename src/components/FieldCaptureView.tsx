import React, { useRef, useState } from 'react';
import {
  Camera,
  Compass,
  Cpu,
  MapPin,
  Timer,
  Upload,
  Wifi,
  WifiOff,
} from 'lucide-react';
import {
  FIELD_PRESETS,
  FieldPreset,
  OPEN_WEIGHT_MODELS,
} from '../lib/ai/analyzer';
import {
  ObservationCategory,
  OpenWeightModelId,
} from '../types/traceback';

const CATEGORIES: ObservationCategory[] = [
  'Plant',
  'Bird',
  'Animal',
  'Landmark',
  'Object',
  'Sign / Notice',
  'Other',
];

interface FieldCaptureViewProps {
  isOnline: boolean;
  simulatedOffline: boolean;
  onToggleSimulatedOffline: () => void;
  selectedModel: OpenWeightModelId;
  onChangeModel: (model: OpenWeightModelId) => void;
  onRunCaptureAndAnalyze: (payload: {
    observationText: string;
    category: ObservationCategory;
    location: string;
    imageUrl: string;
    screenFreeMinutes: number;
  }) => void;
  onRunInstantDemo: () => void;
}

export const FieldCaptureView: React.FC<FieldCaptureViewProps> = ({
  isOnline,
  simulatedOffline,
  onToggleSimulatedOffline,
  selectedModel,
  onChangeModel,
  onRunCaptureAndAnalyze,
  onRunInstantDemo,
}) => {
  const [category, setCategory] = useState<ObservationCategory>('Bird');
  const [observationText, setObservationText] = useState<string>(
    'I saw this bird near a lake. It had a stout beak, bright blue wings, and an orange-brown chest.'
  );
  const [location, setLocation] = useState<string>('Lake observation · Ranganathittu Trail');
  const [imageUrl, setImageUrl] = useState<string>(
    '/assets/images/indian_roller_bird_1791465231205.jpg'
  );
  const [imageError, setImageError] = useState<string | null>(null);
  const [screenFreeMinutes, setScreenFreeMinutes] = useState<number>(38);
  const [isLocating, setIsLocating] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [showCameraModal, setShowCameraModal] = useState<boolean>(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);

  const handleSelectPreset = (preset: FieldPreset) => {
    setCategory(preset.category);
    setObservationText(preset.observationText);
    setLocation(preset.location);
    setImageUrl(preset.imageUrl);
    setScreenFreeMinutes(preset.screenFreeMinutes);
    setImageError(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setImageError('Invalid image format. Please choose a JPEG, PNG, or WebP field photo.');
      return;
    }

    setImageError(null);
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setImageUrl(reader.result);
      }
    };
    reader.onerror = () => {
      setImageError('Could not read the selected photo file. Please try another image.');
    };
    reader.readAsDataURL(file);
  };

  const handleStartCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });
      setCameraStream(stream);
      setShowCameraModal(true);
      setImageError(null);

      // Set video source after a small delay to ensure the video ref is available
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }, 100);
    } catch (err) {
      console.error('Camera access error:', err);
      setImageError('Could not access camera. Please check permissions or use Upload Photo instead.');
    }
  };

  const handleCapturePhoto = () => {
    if (!videoRef.current) return;

    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0);
      const dataUrl = canvas.toDataURL('image/jpeg');
      setImageUrl(dataUrl);
    }
    handleCloseCamera();
  };

  const handleCloseCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setShowCameraModal(false);
  };

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      setLocation('Trailhead Sector 4 · 12.421° N, 76.653° E');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude.toFixed(3);
        const lng = pos.coords.longitude.toFixed(3);
        setLocation(`Field Coordinates · ${lat}° N, ${lng}° E`);
        setIsLocating(false);
      },
      () => {
        setLocation('Woodland Lake Perimeter · 12.424° N, 76.656° E');
        setIsLocating(false);
      },
      { timeout: 4000 }
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!observationText.trim()) return;
    onRunCaptureAndAnalyze({
      observationText: observationText.trim(),
      category,
      location: location.trim() || 'Outdoor Field Site',
      imageUrl,
      screenFreeMinutes,
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-8 py-8 space-y-8">
      <div className="bg-white rounded-2xl border border-[#E2DDD2] p-4 sm:px-6">
        <div className="grid grid-cols-4 gap-2 sm:gap-4">
          {[
            { step: 1, title: 'Capture', subtitle: 'Real-world field note', active: true },
            { step: 2, title: 'Analyze', subtitle: 'Local open-weight AI', active: false },
            { step: 3, title: 'Trace', subtitle: 'SerpApi web evidence', active: false },
            { step: 4, title: 'Discover', subtitle: 'Timeline & journal', active: false },
          ].map((item) => (
            <div
              key={item.step}
              className={`flex items-center gap-2.5 p-2 rounded-xl transition-colors ${
                item.active ? 'bg-[#1E4620]/8 text-[#1E4620]' : 'text-[#6B746C]'
              }`}
            >
              <span
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono-tabular font-semibold shrink-0 ${
                  item.active
                    ? 'bg-[#1E4620] text-white'
                    : 'bg-[#EBE6DC] text-[#545E56]'
                }`}
              >
                {item.step}
              </span>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-semibold truncate">{item.title}</p>
                <p className="hidden sm:block text-xs text-[#6B746C] truncate">{item.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl bg-[#1E4620] text-[#F7F5F0] p-6 sm:p-7 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <p className="text-xs font-mono-tabular text-[#A7C4A0]">
            HACKTOBERFEST 2026 · TOUCH GRASS PROTOCOL
          </p>
          <h2 className="text-xl sm:text-2xl font-serif-display font-normal tracking-tight text-white">
            “Your screen should be off now. Go observe the real world.”
          </h2>
          <p className="text-xs sm:text-sm text-[#D8E6D5] leading-relaxed">
            Walk the trail, listen, and observe with your own eyes first. Take one quick photo and jot a field note—TraceBack handles the local analysis and evidence trail when you return.
          </p>
        </div>

        <div className="w-full md:w-auto bg-white/10 rounded-xl p-4 border border-white/15 shrink-0 space-y-2.5">
          <div className="flex items-center justify-between gap-4">
            <span className="text-xs text-[#D8E6D5] flex items-center gap-1.5">
              <Timer className="w-3.5 h-3.5 text-[#E8B86D]" />
              <span>Screen-Free Time Outside</span>
            </span>
            <span className="text-sm font-mono-tabular font-semibold text-[#E8B86D]">
              {screenFreeMinutes} mins
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            {[20, 38, 42, 65].map((mins) => (
              <button
                key={mins}
                type="button"
                onClick={() => setScreenFreeMinutes(mins)}
                className={`px-2.5 py-1 rounded-md text-xs font-mono-tabular transition-colors cursor-pointer ${
                  screenFreeMinutes === mins
                    ? 'bg-[#E8B86D] text-[#1C241E] font-semibold'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                {mins}m
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 bg-white rounded-2xl border border-[#E2DDD2] px-5 py-3.5 text-xs">
        <div className="flex flex-wrap items-center gap-4 text-[#2C362E]">
          <span>🟢 AI analysis available offline</span>
          <span aria-hidden="true" className="text-[#C8C2B4]">·</span>
          <span>🟡 Evidence tracing requires internet</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onToggleSimulatedOffline}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              !isOnline
                ? 'bg-[#B45309] text-white'
                : 'bg-[#F7F5F0] text-[#2C362E] hover:bg-[#EBE6DC]'
            }`}
          >
            {!isOnline ? (
              <>
                <WifiOff className="w-3.5 h-3.5" />
                <span>Offline Field Mode Active (Click to Reconnect)</span>
              </>
            ) : (
              <>
                <Wifi className="w-3.5 h-3.5 text-[#1E4620]" />
                <span>Online (Test Offline Mode)</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium text-[#545E56]">
            Load an outdoor field specimen preset or upload your own photo below
          </p>
          <button
            type="button"
            onClick={onRunInstantDemo}
            className="text-xs font-semibold text-[#1E4620] hover:underline cursor-pointer"
          >
            Run Full Indian Roller Demo →
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {FIELD_PRESETS.map((preset) => {
            const isSelected = imageUrl === preset.imageUrl;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleSelectPreset(preset)}
                className={`text-left p-3 rounded-xl border transition-all cursor-pointer flex items-center gap-3 ${
                  isSelected
                    ? 'bg-white border-[#1E4620] shadow-xs'
                    : 'bg-white/60 border-[#E2DDD2] hover:bg-white'
                }`}
              >
                <div className="w-12 h-12 rounded-lg overflow-hidden bg-[#EBE6DC] shrink-0">
                  <img
                    src={preset.imageUrl}
                    alt={preset.label}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-[#1C241E] truncate">
                    {preset.label}
                  </p>
                  <p className="text-[11px] text-[#6B746C] truncate">
                    {preset.category} · {preset.screenFreeMinutes}m outside
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-white rounded-3xl border border-[#E2DDD2] p-6 sm:p-8"
      >
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-[#1C241E]">
              Field Photograph
            </label>
            <span className="text-xs text-[#6B746C]">Processed locally in browser</span>
          </div>

          <div className="relative aspect-4/3 w-full rounded-2xl overflow-hidden bg-[#EBE6DC] border border-[#E2DDD2]">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt="Field observation capture"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-[#6B746C]">
                <Camera className="w-8 h-8 mb-2 text-[#1E4620]" />
                <p className="text-xs font-medium">No field photo selected</p>
              </div>
            )}
          </div>

          {imageError && (
            <p className="text-xs text-[#991B1B] bg-[#FEF2F2] border border-[#FECACA] rounded-lg px-3 py-2">
              {imageError}
            </p>
          )}

          {/* Gallery / file upload — no capture attribute so it opens the file picker */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-[#D5CFC2] bg-[#F7F5F0] text-xs font-semibold text-[#1C241E] hover:bg-[#EBE6DC] transition-colors cursor-pointer whitespace-nowrap"
            >
              <Upload className="w-3.5 h-3.5 text-[#1E4620]" />
              <span>Upload Photo</span>
            </button>
            <button
              type="button"
              onClick={handleStartCamera}
              className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-[#D5CFC2] bg-[#F7F5F0] text-xs font-semibold text-[#1C241E] hover:bg-[#EBE6DC] transition-colors cursor-pointer whitespace-nowrap"
            >
              <Camera className="w-3.5 h-3.5 text-[#1E4620]" />
              <span>Take Field Photo</span>
            </button>
          </div>

          <div className="pt-4 border-t border-[#EBE6DC] space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-[#1C241E] flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-[#1E4620]" />
                <span>Open-Weight Local AI Model</span>
              </label>
              <span className="text-[11px] text-[#545E56] font-mono-tabular">Swappable Layer</span>
            </div>
            <div className="space-y-2">
              {OPEN_WEIGHT_MODELS.map((model) => (
                <button
                  key={model.id}
                  type="button"
                  onClick={() => onChangeModel(model.id)}
                  className={`w-full text-left p-2.5 rounded-xl border transition-colors cursor-pointer flex items-center justify-between ${
                    selectedModel === model.id
                      ? 'bg-[#1E4620]/6 border-[#1E4620] text-[#1C241E]'
                      : 'bg-[#F7F5F0]/60 border-[#E2DDD2] text-[#545E56] hover:bg-[#F7F5F0]'
                  }`}
                >
                  <div className="min-w-0 pr-2">
                    <p className="text-xs font-semibold truncate">{model.name}</p>
                    <p className="text-[11px] text-[#6B746C] truncate">{model.description}</p>
                  </div>
                  <span className="text-[11px] font-mono-tabular text-[#1E4620] shrink-0">
                    {model.params}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
          <div className="space-y-6">
            <div className="space-y-2.5">
              <label className="text-sm font-semibold text-[#1C241E] block">
                1. Select Observation Type
              </label>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                      category === cat
                        ? 'bg-[#1E4620] text-white font-semibold shadow-xs'
                        : 'bg-[#F7F5F0] text-[#2C362E] border border-[#E2DDD2] hover:bg-[#EBE6DC]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="observation-notes"
                  className="text-sm font-semibold text-[#1C241E]"
                >
                  2. Field Observation Notes
                </label>
                <span className="text-xs text-[#6B746C]">
                  Describe shape, colors, behavior, or markings
                </span>
              </div>
              <textarea
                id="observation-notes"
                rows={4}
                value={observationText}
                onChange={(e) => setObservationText(e.target.value)}
                placeholder="Example: I saw this bird near a lake. It had a long beak and white wings..."
                className="w-full rounded-2xl border border-[#D5CFC2] bg-[#F7F5F0]/60 p-4 text-sm text-[#1C241E] placeholder-[#8A928B] focus:outline-none focus:border-[#1E4620] focus:bg-white transition-colors leading-relaxed"
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="field-location" className="text-sm font-semibold text-[#1C241E]">
                  3. Location / Habitat Context <span className="text-xs font-normal text-[#6B746C]">(Optional)</span>
                </label>
                <button
                  type="button"
                  onClick={handleDetectLocation}
                  className="inline-flex items-center gap-1 text-xs font-medium text-[#1E4620] hover:underline cursor-pointer"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{isLocating ? 'Acquiring GPS…' : 'Use GPS Coordinates'}</span>
                </button>
              </div>
              <input
                id="field-location"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g., Near Ranganathittu Lake, Wetland Margin, or Oak Ridge Trail"
                className="w-full rounded-xl border border-[#D5CFC2] bg-[#F7F5F0]/60 px-4 py-2.5 text-sm text-[#1C241E] placeholder-[#8A928B] focus:outline-none focus:border-[#1E4620] focus:bg-white transition-colors"
              />
            </div>
          </div>

          <div className="pt-6 border-t border-[#EBE6DC] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="text-xs text-[#545E56] space-y-0.5">
              <p className="font-medium text-[#1C241E]">
                {isOnline
                  ? 'Ready for Local Analysis + SerpApi Evidence Trace'
                  : 'Offline Mode: Will run Local AI Analysis & save to sync queue'}
              </p>
              <p>Photos stay on your device during open-weight analysis.</p>
            </div>

            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#1E4620] text-white text-sm font-semibold hover:bg-[#163518] transition-colors cursor-pointer whitespace-nowrap shadow-sm"
            >
              <Compass className="w-4 h-4" />
              <span>
                {isOnline ? 'Analyze Locally & Trace Evidence' : 'Analyze Locally (Offline)'}
              </span>
            </button>
          </div>
        </div>
      </form>

      {/* Camera Modal */}
      {showCameraModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-4 max-w-2xl w-full space-y-4">
            <div className="relative aspect-video bg-black rounded-xl overflow-hidden">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={handleCapturePhoto}
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#1E4620] text-white text-sm font-semibold hover:bg-[#163518] transition-colors cursor-pointer"
              >
                <Camera className="w-4 h-4" />
                <span>Capture Photo</span>
              </button>
              <button
                type="button"
                onClick={handleCloseCamera}
                className="px-6 py-3 rounded-xl bg-[#F7F5F0] text-[#1C241E] text-sm font-semibold hover:bg-[#EBE6DC] transition-colors cursor-pointer border border-[#D5CFC2]"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
