import React, { useRef, useState, useEffect } from 'react';
import { EraConfig, FaceTransform, EraId } from '../types';
import { HISTORICAL_ERAS } from '../data/historicalEras';
import { renderHistoricalPortrait } from '../utils/canvasRenderer';
import { X, Download, Film } from 'lucide-react';
import { sound } from '../utils/audio';

interface PhotoStripModalProps {
  isOpen: boolean;
  onClose: () => void;
  userImage: HTMLImageElement | null;
  transform: FaceTransform;
  travelerName: string;
}

export const PhotoStripModal: React.FC<PhotoStripModalProps> = ({
  isOpen,
  onClose,
  userImage,
  transform,
  travelerName,
}) => {
  const stripCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Default 3 eras for the photo strip
  const [selectedEraIds, setSelectedEraIds] = useState<[EraId, EraId, EraId]>([
    'ancient_egypt',
    'high_renaissance',
    'apollo_lunar',
  ]);

  const [isRendering, setIsRendering] = useState<boolean>(false);

  const setSlotEra = (slotIndex: 0 | 1 | 2, eraId: EraId) => {
    setSelectedEraIds((prev) => {
      const next = [...prev] as [EraId, EraId, EraId];
      next[slotIndex] = eraId;
      return next;
    });
  };

  useEffect(() => {
    if (!isOpen) return;

    renderStrip();
  }, [isOpen, selectedEraIds, userImage, transform, travelerName]);

  const renderStrip = async () => {
    setIsRendering(true);
    const canvas = stripCanvasRef.current;
    if (!canvas) return;

    // Classic 3-shot photo booth strip dimensions: 480 x 1400
    canvas.width = 480;
    canvas.height = 1400;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 1. Vintage Warm Photo Strip Paper Background
    const paperGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    paperGrad.addColorStop(0, '#F5EDE0');
    paperGrad.addColorStop(0.5, '#EFE5D5');
    paperGrad.addColorStop(1, '#E6DAC7');
    ctx.fillStyle = paperGrad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 2. Vintage Header
    ctx.textAlign = 'center';
    ctx.fillStyle = '#1C1917';
    ctx.font = 'bold 16px "Cinzel", serif';
    ctx.fillText('CHRONOS TIME-TRAVEL BOOTH', canvas.width / 2, 42);

    ctx.fillStyle = '#78350F';
    ctx.font = 'italic 12px "Cormorant Garamond", serif';
    ctx.fillText('Archival Multi-Epoch Photographic Strip', canvas.width / 2, 60);

    // Subtle header line
    ctx.strokeStyle = '#B45309';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(40, 72);
    ctx.lineTo(canvas.width - 40, 72);
    ctx.stroke();

    // 3. Render each of the 3 eras onto offscreen canvases then stamp onto strip
    const frameW = 400;
    const frameH = 380;
    const startY = 88;
    const gap = 34;

    for (let i = 0; i < 3; i++) {
      const eraId = selectedEraIds[i];
      const era = HISTORICAL_ERAS.find((e) => e.id === eraId) || HISTORICAL_ERAS[0];

      // Temporary offscreen canvas for era portrait
      const offCanvas = document.createElement('canvas');
      offCanvas.width = 1000;
      offCanvas.height = 1250;

      // Default active accessories
      const accMap: Record<string, boolean> = {};
      era.accessories.forEach((a) => {
        accMap[a.id] = a.defaultEnabled;
      });

      renderHistoricalPortrait({
        canvas: offCanvas,
        era,
        userImage,
        transform,
        activeAccessories: accMap,
        travelerName,
        showGuides: false,
      });

      const frameY = startY + i * (frameH + gap);

      // White photo card border with subtle shadow
      ctx.fillStyle = '#FFFFFF';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.15)';
      ctx.shadowBlur = 8;
      ctx.fillRect(40, frameY, frameW, frameH);
      ctx.shadowBlur = 0;

      // Inner image
      ctx.drawImage(offCanvas, 46, frameY + 6, frameW - 12, frameH - 36);

      // Frame caption beneath photo
      ctx.fillStyle = '#1C1917';
      ctx.font = 'bold 10px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(era.name.toUpperCase(), canvas.width / 2, frameY + frameH - 16);

      ctx.fillStyle = '#78350F';
      ctx.font = 'italic 9px "Cormorant Garamond", serif';
      ctx.fillText(era.epoch, canvas.width / 2, frameY + frameH - 5);
    }

    // 4. Vintage Footer & Stamps
    const footY = canvas.height - 35;
    ctx.fillStyle = '#451A03';
    ctx.font = '10px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(`SUBJECT: ${travelerName.toUpperCase() || 'TIME TRAVELER'}`, canvas.width / 2, footY);

    ctx.fillStyle = '#78716C';
    ctx.font = '9px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('AUTHENTICATED BY TEMPORAL BUREAU · ALL RIGHTS PRESERVED', canvas.width / 2, footY + 14);

    setIsRendering(false);
  };

  const handleDownload = () => {
    const canvas = stripCanvasRef.current;
    if (!canvas) return;

    sound.playShutter();
    const link = document.createElement('a');
    link.download = `chronos_photostrip_${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-[#181512] border border-[#3A332B] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#2C2620] bg-[#141210]">
          <div className="flex items-center gap-2.5">
            <Film className="w-5 h-5 text-[#D97706]" />
            <div>
              <h2 className="text-lg font-display font-semibold text-[#F5E8D3]">
                Vintage 3-Era Photo Strip
              </h2>
              <p className="text-xs text-[#9E9382] font-serif">
                Select your three time jumps for an authentic photo booth print
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

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Controls & Era Selectors */}
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-xs uppercase tracking-widest text-[#A89F91] font-sans font-semibold">
                Configure Strip Frames
              </h3>

              {([0, 1, 2] as const).map((slotIndex) => (
                <div
                  key={slotIndex}
                  className="p-3.5 rounded-xl bg-[#211D19] border border-[#383129]"
                >
                  <label className="block text-xs font-semibold text-[#EDE8DF] mb-1.5">
                    Frame {slotIndex + 1} Historical Destination
                  </label>
                  <select
                    value={selectedEraIds[slotIndex]}
                    onChange={(e) => setSlotEra(slotIndex, e.target.value as EraId)}
                    className="w-full px-3 py-2 bg-[#161310] border border-[#3A332B] rounded-lg text-xs text-[#F5E8D3] focus:outline-none focus:border-[#D97706]"
                  >
                    {HISTORICAL_ERAS.map((era) => (
                      <option key={era.id} value={era.id}>
                        {era.name} ({era.epoch})
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-xl bg-[#161310] border border-[#2C2620]">
              <h4 className="text-xs font-semibold text-[#EDE8DF] mb-1">
                Authentic Photobooth Cardstock
              </h4>
              <p className="text-xs text-[#9E9382] font-serif leading-relaxed mb-4">
                Rendered with simulated warm silver halide tone, curatorial typography, and historical era alignment. Download high-resolution PNG ready for printing.
              </p>
              <button
                onClick={handleDownload}
                disabled={isRendering}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[#D97706] hover:bg-[#F59E0B] text-[#1C1917] font-semibold text-xs rounded-lg transition-colors shadow-md"
              >
                <Download className="w-4 h-4" />
                <span>Download Photo Strip (PNG)</span>
              </button>
            </div>
          </div>

          {/* Strip Canvas Preview */}
          <div className="flex flex-col items-center justify-center">
            <div className="relative max-h-[600px] overflow-y-auto p-3 bg-[#0F0D0B] rounded-xl border border-[#332A22] shadow-inner">
              <canvas
                ref={stripCanvasRef}
                className="w-[240px] h-auto shadow-2xl rounded"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
