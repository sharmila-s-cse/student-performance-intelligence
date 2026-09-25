import React from 'react';
import { SavedPortrait } from '../types';
import { X, Download, Trash2, Calendar, MapPin, Archive } from 'lucide-react';
import { sound } from '../utils/audio';

interface GalleryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  savedPortraits: SavedPortrait[];
  onDeletePortrait: (id: string) => void;
}

export const GalleryDrawer: React.FC<GalleryDrawerProps> = ({
  isOpen,
  onClose,
  savedPortraits,
  onDeletePortrait,
}) => {
  const [selectedPortrait, setSelectedPortrait] = React.useState<SavedPortrait | null>(null);

  if (!isOpen) return null;

  const handleDownload = (portrait: SavedPortrait) => {
    sound.playShutter();
    const link = document.createElement('a');
    link.download = `chronos_${portrait.eraId}_${portrait.timestamp}.png`;
    link.href = portrait.dataUrl;
    link.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-xl h-full bg-[#181512] border-l border-[#332A22] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#2C2620] bg-[#141210]">
          <div className="flex items-center gap-2.5">
            <Archive className="w-5 h-5 text-[#D97706]" />
            <div>
              <h2 className="text-base font-display font-semibold text-[#F5E8D3]">
                Temporal Archive & Exhibition
              </h2>
              <p className="text-xs text-[#9E9382] font-serif">
                {savedPortraits.length} historical portraits cataloged
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#9E9382] hover:text-[#F5E8D3] hover:bg-[#26211C] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List of Portraits */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {savedPortraits.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <Archive className="w-12 h-12 text-[#4A3F33] mb-3" />
              <h3 className="text-sm font-semibold text-[#C4B8A5] mb-1">
                No Portraits Preserved Yet
              </h3>
              <p className="text-xs text-[#786F62] font-serif max-w-xs">
                Take a portrait and click “Preserve in Archive” in the studio canvas to save your historical journeys.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {savedPortraits.map((item) => (
                <div
                  key={item.id}
                  className="group relative rounded-xl overflow-hidden bg-[#211D19] border border-[#383129] hover:border-[#D97706] transition-all flex flex-col"
                >
                  {/* Thumbnail */}
                  <div
                    onClick={() => setSelectedPortrait(item)}
                    className="w-full aspect-[4/5] overflow-hidden bg-black cursor-pointer relative"
                  >
                    <img
                      src={item.dataUrl}
                      alt={item.eraName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2.5">
                      <span className="text-[11px] text-[#FDE68A] font-medium">Click to inspect</span>
                    </div>
                  </div>

                  {/* Metadata & Actions */}
                  <div className="p-3 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-display font-bold text-[#F5E8D3] truncate">
                        {item.eraName}
                      </h4>
                      <p className="text-[11px] text-[#D97706] font-mono truncate">
                        {item.epoch}
                      </p>
                      <p className="text-[10px] text-[#9E9382] truncate mt-0.5 font-serif italic">
                        {item.travelerName || 'The Time Traveler'}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2.5 mt-2 border-t border-[#2C2620]">
                      <button
                        onClick={() => handleDownload(item)}
                        className="flex items-center gap-1 text-[11px] font-semibold text-[#D97706] hover:text-[#F59E0B]"
                      >
                        <Download className="w-3 h-3" />
                        <span>Export</span>
                      </button>

                      <button
                        onClick={() => onDeletePortrait(item.id)}
                        className="text-[#786F62] hover:text-[#EF4444] transition-colors p-1"
                        title="Delete from archive"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal for Inspecting Single Portrait */}
        {selectedPortrait && (
          <div className="fixed inset-0 z-60 bg-black/90 flex items-center justify-center p-4">
            <div className="relative max-w-xl w-full bg-[#181512] border border-[#44382D] rounded-2xl overflow-hidden p-6 flex flex-col items-center">
              <button
                onClick={() => setSelectedPortrait(null)}
                className="absolute top-4 right-4 p-1.5 rounded-lg text-[#9E9382] hover:text-[#F5E8D3] hover:bg-[#26211C]"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-full max-h-[60vh] flex justify-center mb-4">
                <img
                  src={selectedPortrait.dataUrl}
                  alt={selectedPortrait.eraName}
                  className="max-h-[58vh] w-auto rounded-lg shadow-2xl border border-[#3A332B]"
                />
              </div>

              <div className="text-center mb-4">
                <h3 className="text-lg font-display font-bold text-[#F5E8D3]">
                  {selectedPortrait.eraName}
                </h3>
                <div className="flex items-center justify-center gap-3 text-xs text-[#9E9382] mt-1 font-serif">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-[#D97706]" />
                    {selectedPortrait.epoch}
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#D97706]" />
                    {selectedPortrait.location}
                  </span>
                </div>
              </div>

              <button
                onClick={() => handleDownload(selectedPortrait)}
                className="px-6 py-2.5 bg-[#D97706] hover:bg-[#F59E0B] text-[#1C1917] font-semibold text-xs rounded-lg flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Download High-Resolution PNG</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
