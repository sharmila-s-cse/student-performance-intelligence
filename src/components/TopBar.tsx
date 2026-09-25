import React from 'react';
import { Volume2, VolumeX, Camera, Film, Archive } from 'lucide-react';
import { sound } from '../utils/audio';

interface TopBarProps {
  onOpenCamera: () => void;
  onOpenPhotoStrip: () => void;
  onOpenGallery: () => void;
  savedCount: number;
  activeTab: 'studio' | 'eras' | 'passport';
  setActiveTab: (tab: 'studio' | 'eras' | 'passport') => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  onOpenCamera,
  onOpenPhotoStrip,
  onOpenGallery,
  savedCount,
  activeTab,
  setActiveTab,
}) => {
  const [muted, setMuted] = React.useState(sound.getMuted());

  const handleToggleSound = () => {
    const newMuted = sound.toggleMute();
    setMuted(newMuted);
  };

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-[#2C2620] bg-[#141210]/90 backdrop-blur-md sticky top-0 z-40">
      {/* Zone 1: Single text element wordmark */}
      <div className="flex items-center gap-3">
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            setActiveTab('studio');
          }}
          className="text-xl md:text-2xl font-display font-bold tracking-wider text-[#F5E8D3] hover:text-[#FBBF24] transition-colors"
        >
          CHRONOS
        </a>
        <span className="hidden sm:inline-block text-xs font-serif italic text-[#A89F91]">
          Historical Portrait Studio
        </span>
      </div>

      {/* Zone 2: Clean text navigation links */}
      <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-[#C4B8A5]">
        <button
          onClick={() => setActiveTab('studio')}
          className={`hover:text-[#F5E8D3] transition-colors pb-0.5 border-b-2 ${
            activeTab === 'studio'
              ? 'border-[#D97706] text-[#F5E8D3]'
              : 'border-transparent text-[#9E9382]'
          }`}
        >
          Studio Canvas
        </button>

        <button
          onClick={() => setActiveTab('eras')}
          className={`hover:text-[#F5E8D3] transition-colors pb-0.5 border-b-2 ${
            activeTab === 'eras'
              ? 'border-[#D97706] text-[#F5E8D3]'
              : 'border-transparent text-[#9E9382]'
          }`}
        >
          Historical Eras
        </button>

        <button
          onClick={() => setActiveTab('passport')}
          className={`hover:text-[#F5E8D3] transition-colors pb-0.5 border-b-2 ${
            activeTab === 'passport'
              ? 'border-[#D97706] text-[#F5E8D3]'
              : 'border-transparent text-[#9E9382]'
          }`}
        >
          Traveler Dossier
        </button>

        <button
          onClick={onOpenPhotoStrip}
          className="flex items-center gap-1.5 hover:text-[#F5E8D3] transition-colors text-[#9E9382]"
        >
          <Film className="w-4 h-4 text-[#D97706]" />
          <span>Vintage Photo Strip</span>
        </button>
      </nav>

      {/* Zone 3: 1-2 primary actions */}
      <div className="flex items-center gap-3">
        {/* Sound Toggle */}
        <button
          onClick={handleToggleSound}
          title={muted ? 'Unmute camera sounds' : 'Mute camera sounds'}
          className="p-2 rounded-lg bg-[#211D19] border border-[#383129] text-[#C4B8A5] hover:text-[#F5E8D3] hover:border-[#574B3D] transition-colors"
          aria-label={muted ? 'Unmute sounds' : 'Mute sounds'}
        >
          {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-[#D97706]" />}
        </button>

        {/* Gallery / Archive */}
        <button
          onClick={onOpenGallery}
          className="relative p-2 rounded-lg bg-[#211D19] border border-[#383129] text-[#C4B8A5] hover:text-[#F5E8D3] hover:border-[#574B3D] transition-colors"
          title="Open Archival Gallery"
        >
          <Archive className="w-4 h-4" />
          {savedCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#B45309] text-white text-[10px] font-bold rounded-full flex items-center justify-center tabular-nums">
              {savedCount}
            </span>
          )}
        </button>

        {/* Take Photo CTA */}
        <button
          onClick={onOpenCamera}
          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-[#1C1917] bg-[#F59E0B] hover:bg-[#D97706] rounded-lg transition-colors shadow-sm whitespace-nowrap"
        >
          <Camera className="w-3.5 h-3.5 text-[#1C1917]" />
          <span>Take Portrait</span>
        </button>
      </div>
    </header>
  );
};
