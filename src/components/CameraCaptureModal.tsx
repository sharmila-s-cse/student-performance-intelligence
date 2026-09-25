import React, { useRef, useState, useEffect } from 'react';
import { Camera, X, RefreshCw, Upload, Sparkles, AlertCircle } from 'lucide-react';
import { sound } from '../utils/audio';
import { SAMPLE_AVATARS } from '../data/sampleAvatars';

interface CameraCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPhotoCaptured: (imageDataUrl: string) => void;
}

export const CameraCaptureModal: React.FC<CameraCaptureModalProps> = ({
  isOpen,
  onClose,
  onPhotoCaptured,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [hasCamera, setHasCamera] = useState<boolean>(true);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isFlashing, setIsFlashing] = useState<boolean>(false);
  const [tab, setTab] = useState<'camera' | 'upload' | 'presets'>('camera');

  // Start webcam stream
  const startCamera = async (mode: 'user' | 'environment') => {
    try {
      setCameraError(null);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: mode,
          width: { ideal: 960 },
          height: { ideal: 1280 },
        },
        audio: false,
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setHasCamera(true);
    } catch (err: unknown) {
      console.warn('Webcam access error:', err);
      setHasCamera(false);
      setCameraError('Camera access unavailable or declined. You can upload a photo or choose a historical profile below.');
      setTab('upload');
    }
  };

  useEffect(() => {
    if (isOpen && tab === 'camera') {
      startCamera(facingMode);
    }
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    };
  }, [isOpen, facingMode, tab]);

  // Handle capture with 3-second countdown
  const triggerCapture = () => {
    if (countdown !== null) return;

    let count = 3;
    setCountdown(count);
    sound.playCountdown(false);

    const interval = setInterval(() => {
      count -= 1;
      if (count > 0) {
        setCountdown(count);
        sound.playCountdown(false);
      } else {
        clearInterval(interval);
        setCountdown(null);
        executeShutterCapture();
      }
    }, 900);
  };

  const executeShutterCapture = () => {
    if (!videoRef.current) return;

    sound.playShutter();
    setIsFlashing(true);
    setTimeout(() => setIsFlashing(false), 400);

    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 720;
    canvas.height = video.videoHeight || 960;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Flip horizontally if front-facing camera
    if (facingMode === 'user') {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.92);

    onPhotoCaptured(dataUrl);
    onClose();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        sound.playShutter();
        onPhotoCaptured(result);
        onClose();
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSelectPreset = (getDataUrl: () => string) => {
    const url = getDataUrl();
    sound.playShutter();
    onPhotoCaptured(url);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-[#181512] border border-[#3A332B] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#2C2620] bg-[#141210]">
          <div>
            <h2 className="text-lg font-display font-semibold text-[#F5E8D3]">
              Capture Traveler Portrait
            </h2>
            <p className="text-xs text-[#9E9382] font-serif">
              Align your face inside the vintage oval viewfinder
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#9E9382] hover:text-[#F5E8D3] hover:bg-[#26211C] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-[#2C2620] px-6 bg-[#161310] gap-4">
          <button
            onClick={() => setTab('camera')}
            className={`py-2.5 text-xs font-medium border-b-2 transition-colors flex items-center gap-1.5 ${
              tab === 'camera'
                ? 'border-[#D97706] text-[#F5E8D3]'
                : 'border-transparent text-[#9E9382] hover:text-[#C4B8A5]'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Live Camera</span>
          </button>
          <button
            onClick={() => setTab('upload')}
            className={`py-2.5 text-xs font-medium border-b-2 transition-colors flex items-center gap-1.5 ${
              tab === 'upload'
                ? 'border-[#D97706] text-[#F5E8D3]'
                : 'border-transparent text-[#9E9382] hover:text-[#C4B8A5]'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Photo</span>
          </button>
          <button
            onClick={() => setTab('presets')}
            className={`py-2.5 text-xs font-medium border-b-2 transition-colors flex items-center gap-1.5 ${
              tab === 'presets'
                ? 'border-[#D97706] text-[#F5E8D3]'
                : 'border-transparent text-[#9E9382] hover:text-[#C4B8A5]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#D97706]" />
            <span>Historical Profiles</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto">
          {tab === 'camera' && (
            <div className="flex flex-col items-center">
              {cameraError ? (
                <div className="w-full p-4 bg-[#2D1A16] border border-[#6B281B] rounded-xl text-center mb-4">
                  <AlertCircle className="w-6 h-6 text-[#EF4444] mx-auto mb-2" />
                  <p className="text-xs text-[#FECACA] mb-3">{cameraError}</p>
                  <button
                    onClick={() => setTab('presets')}
                    className="px-4 py-2 text-xs font-medium bg-[#B45309] text-white rounded-lg hover:bg-[#D97706]"
                  >
                    Select a Historical Profile
                  </button>
                </div>
              ) : (
                <div className="relative w-full aspect-[3/4] max-w-sm rounded-xl overflow-hidden bg-black border border-[#3A332B] shadow-inner flex items-center justify-center">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className={`w-full h-full object-cover ${
                      facingMode === 'user' ? 'scale-x-[-1]' : ''
                    }`}
                  />

                  {/* Shutter Flash Animation */}
                  {isFlashing && (
                    <div className="absolute inset-0 bg-white camera-flash pointer-events-none" />
                  )}

                  {/* Vintage Viewfinder Overlay */}
                  <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center">
                    {/* Face Oval Reticle */}
                    <div className="w-48 h-64 border-2 border-dashed border-[#F59E0B]/80 rounded-[50%] shadow-[0_0_15px_rgba(245,158,11,0.25)] relative flex items-center justify-center">
                      <div className="w-full border-t border-[#F59E0B]/40 absolute top-[40%]" />
                      <div className="h-full border-l border-[#F59E0B]/40 absolute" />
                    </div>
                    <span className="mt-3 text-[11px] font-sans font-medium text-[#FDE68A] bg-black/60 px-2.5 py-0.5 rounded backdrop-blur-sm">
                      Align face & eyes with guides
                    </span>
                  </div>

                  {/* Countdown Big Overlay */}
                  {countdown !== null && (
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center">
                      <span className="text-7xl font-display font-bold text-[#FDE68A] animate-ping">
                        {countdown}
                      </span>
                    </div>
                  )}

                  {/* Switch Camera Button */}
                  <button
                    onClick={() =>
                      setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'))
                    }
                    className="absolute top-3 right-3 p-2 bg-black/60 hover:bg-black/90 text-[#F5E8D3] rounded-full backdrop-blur-sm border border-white/20 transition-colors"
                    title="Flip camera"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Shutter Button */}
              {!cameraError && (
                <div className="mt-6 flex items-center gap-4">
                  <button
                    onClick={triggerCapture}
                    disabled={countdown !== null}
                    className="group relative flex items-center justify-center w-16 h-16 rounded-full bg-[#B45309] hover:bg-[#D97706] text-white shadow-lg active:scale-95 transition-transform"
                    title="Take Photo"
                  >
                    <div className="w-12 h-12 rounded-full border-2 border-white/80 group-hover:scale-105 transition-transform flex items-center justify-center">
                      <Camera className="w-6 h-6 text-white" />
                    </div>
                  </button>
                </div>
              )}
            </div>
          )}

          {tab === 'upload' && (
            <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-[#3A332B] rounded-xl bg-[#141210]/50 text-center">
              <Upload className="w-10 h-10 text-[#D97706] mb-3" />
              <h3 className="text-sm font-semibold text-[#F5E8D3] mb-1">
                Upload a Portrait or Selfie
              </h3>
              <p className="text-xs text-[#9E9382] max-w-xs mb-4">
                Choose a clear frontal photo from your device. Supported formats: JPG, PNG, WEBP.
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-5 py-2.5 text-xs font-semibold bg-[#D97706] hover:bg-[#F59E0B] text-[#1C1917] rounded-lg transition-colors"
              >
                Browse Photos
              </button>
            </div>
          )}

          {tab === 'presets' && (
            <div>
              <p className="text-xs text-[#C4B8A5] mb-4">
                Choose a pre-rendered subject profile to preview all historical eras immediately:
              </p>
              <div className="grid grid-cols-2 gap-3">
                {SAMPLE_AVATARS.map((avatar) => (
                  <button
                    key={avatar.id}
                    onClick={() => handleSelectPreset(avatar.getDataUrl)}
                    className="flex flex-col items-center text-center p-3 rounded-xl bg-[#211D19] border border-[#383129] hover:border-[#D97706] hover:bg-[#2A241F] transition-all group"
                  >
                    <div className="w-16 h-16 rounded-full overflow-hidden border border-[#574B3D] mb-2 group-hover:border-[#F59E0B] transition-colors">
                      <img
                        src={avatar.getDataUrl()}
                        alt={avatar.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-xs font-semibold text-[#F5E8D3] group-hover:text-[#F59E0B]">
                      {avatar.name}
                    </span>
                    <span className="text-[10px] text-[#9E9382] truncate max-w-[130px]">
                      {avatar.subtitle}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
