import React from 'react';
import { FaceTransform, EraConfig } from '../types';
import { Sliders, RotateCcw, Crosshair, Check, User, Sparkles } from 'lucide-react';

interface FaceAdjustmentPanelProps {
  transform: FaceTransform;
  onChangeTransform: (t: FaceTransform) => void;
  era: EraConfig;
  activeAccessories: Record<string, boolean>;
  onToggleAccessory: (id: string) => void;
  travelerName: string;
  onChangeTravelerName: (name: string) => void;
  showGuides: boolean;
  onToggleGuides: () => void;
  onReset: () => void;
}

export const FaceAdjustmentPanel: React.FC<FaceAdjustmentPanelProps> = ({
  transform,
  onChangeTransform,
  era,
  activeAccessories,
  onToggleAccessory,
  travelerName,
  onChangeTravelerName,
  showGuides,
  onToggleGuides,
  onReset,
}) => {
  const [activeTab, setActiveTab] = React.useState<'alignment' | 'color' | 'props'>('alignment');

  const updateField = (field: keyof FaceTransform, value: number) => {
    onChangeTransform({
      ...transform,
      [field]: value,
    });
  };

  return (
    <div className="w-full bg-[#181512] border border-[#2C2620] rounded-xl overflow-hidden flex flex-col">
      {/* Header with Traveler Name */}
      <div className="p-4 border-b border-[#2C2620] bg-[#141210]">
        <div className="flex items-center gap-2 mb-2">
          <User className="w-3.5 h-3.5 text-[#D97706]" />
          <label className="text-xs font-semibold text-[#EDE8DF]">
            Traveler Inscription Name
          </label>
        </div>
        <input
          type="text"
          value={travelerName}
          onChange={(e) => onChangeTravelerName(e.target.value)}
          placeholder="e.g. Lord Alexander Chronos"
          className="w-full px-3 py-1.5 bg-[#211D19] border border-[#383129] rounded-lg text-sm text-[#F5E8D3] placeholder-[#786F62] focus:outline-none focus:border-[#D97706] transition-colors"
        />
        <p className="text-[11px] text-[#9E9382] mt-1 font-serif">
          Appears engraved on the period brass curatorial plaque
        </p>
      </div>

      {/* Adjustment Tabs */}
      <div className="flex border-b border-[#2C2620] bg-[#161310] px-4 gap-4">
        <button
          onClick={() => setActiveTab('alignment')}
          className={`py-2 text-xs font-medium border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === 'alignment'
              ? 'border-[#D97706] text-[#F5E8D3]'
              : 'border-transparent text-[#9E9382] hover:text-[#C4B8A5]'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Face Fit & Size</span>
        </button>

        <button
          onClick={() => setActiveTab('color')}
          className={`py-2 text-xs font-medium border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === 'color'
              ? 'border-[#D97706] text-[#F5E8D3]'
              : 'border-transparent text-[#9E9382] hover:text-[#C4B8A5]'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Tonal Lighting</span>
        </button>

        <button
          onClick={() => setActiveTab('props')}
          className={`py-2 text-xs font-medium border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === 'props'
              ? 'border-[#D97706] text-[#F5E8D3]'
              : 'border-transparent text-[#9E9382] hover:text-[#C4B8A5]'
          }`}
        >
          <span>Period Props ({era.accessories.length})</span>
        </button>
      </div>

      {/* Tab Panels */}
      <div className="p-4 space-y-4">
        {activeTab === 'alignment' && (
          <div className="space-y-3.5">
            {/* Guide crosshairs button */}
            <div className="flex items-center justify-between pb-2 border-b border-[#241F1A]">
              <span className="text-xs text-[#C4B8A5]">Viewfinder Overlay</span>
              <button
                onClick={onToggleGuides}
                className={`flex items-center gap-1 px-2.5 py-1 text-xs rounded transition-colors ${
                  showGuides
                    ? 'bg-[#B45309]/30 text-[#FBBF24] border border-[#B45309]'
                    : 'bg-[#211D19] text-[#9E9382] border border-[#383129]'
                }`}
              >
                <Crosshair className="w-3.5 h-3.5" />
                <span>{showGuides ? 'Guides Active' : 'Show Reticle'}</span>
              </button>
            </div>

            {/* Scale / Zoom */}
            <div>
              <div className="flex justify-between text-xs text-[#C4B8A5] mb-1">
                <span>Scale / Zoom</span>
                <span className="font-mono text-[11px] tabular-nums">
                  {Math.round(transform.scale * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0.6"
                max="1.8"
                step="0.02"
                value={transform.scale}
                onChange={(e) => updateField('scale', parseFloat(e.target.value))}
                className="w-full accent-[#D97706] cursor-pointer"
              />
            </div>

            {/* Position X & Y */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="flex justify-between text-xs text-[#C4B8A5] mb-1">
                  <span>Pan X</span>
                  <span className="font-mono text-[11px] tabular-nums">{transform.x}px</span>
                </div>
                <input
                  type="range"
                  min="-80"
                  max="80"
                  step="1"
                  value={transform.x}
                  onChange={(e) => updateField('x', parseInt(e.target.value, 10))}
                  className="w-full accent-[#D97706] cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs text-[#C4B8A5] mb-1">
                  <span>Pan Y</span>
                  <span className="font-mono text-[11px] tabular-nums">{transform.y}px</span>
                </div>
                <input
                  type="range"
                  min="-80"
                  max="80"
                  step="1"
                  value={transform.y}
                  onChange={(e) => updateField('y', parseInt(e.target.value, 10))}
                  className="w-full accent-[#D97706] cursor-pointer"
                />
              </div>
            </div>

            {/* Rotation / Tilt */}
            <div>
              <div className="flex justify-between text-xs text-[#C4B8A5] mb-1">
                <span>Head Tilt</span>
                <span className="font-mono text-[11px] tabular-nums">{transform.rotate}°</span>
              </div>
              <input
                type="range"
                min="-30"
                max="30"
                step="1"
                value={transform.rotate}
                onChange={(e) => updateField('rotate', parseInt(e.target.value, 10))}
                className="w-full accent-[#D97706] cursor-pointer"
              />
            </div>

            {/* Oval Width / Chin ratio */}
            <div>
              <div className="flex justify-between text-xs text-[#C4B8A5] mb-1">
                <span>Face Oval Width</span>
                <span className="font-mono text-[11px] tabular-nums">
                  {Math.round(transform.widthRatio * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0.8"
                max="1.3"
                step="0.02"
                value={transform.widthRatio}
                onChange={(e) => updateField('widthRatio', parseFloat(e.target.value))}
                className="w-full accent-[#D97706] cursor-pointer"
              />
            </div>

            {/* Edge Feather */}
            <div>
              <div className="flex justify-between text-xs text-[#C4B8A5] mb-1">
                <span>Edge Feather / Soft Blend</span>
                <span className="font-mono text-[11px] tabular-nums">{transform.feather}px</span>
              </div>
              <input
                type="range"
                min="0"
                max="35"
                step="1"
                value={transform.feather}
                onChange={(e) => updateField('feather', parseInt(e.target.value, 10))}
                className="w-full accent-[#D97706] cursor-pointer"
              />
            </div>
          </div>
        )}

        {activeTab === 'color' && (
          <div className="space-y-3.5">
            {/* Brightness */}
            <div>
              <div className="flex justify-between text-xs text-[#C4B8A5] mb-1">
                <span>Subject Luminance (Brightness)</span>
                <span className="font-mono text-[11px] tabular-nums">
                  {Math.round(transform.brightness * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0.6"
                max="1.4"
                step="0.02"
                value={transform.brightness}
                onChange={(e) => updateField('brightness', parseFloat(e.target.value))}
                className="w-full accent-[#D97706] cursor-pointer"
              />
            </div>

            {/* Contrast */}
            <div>
              <div className="flex justify-between text-xs text-[#C4B8A5] mb-1">
                <span>Chiaroscuro Contrast</span>
                <span className="font-mono text-[11px] tabular-nums">
                  {Math.round(transform.contrast * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0.7"
                max="1.5"
                step="0.02"
                value={transform.contrast}
                onChange={(e) => updateField('contrast', parseFloat(e.target.value))}
                className="w-full accent-[#D97706] cursor-pointer"
              />
            </div>

            {/* Warmth */}
            <div>
              <div className="flex justify-between text-xs text-[#C4B8A5] mb-1">
                <span>Era Warmth / Amber Glaze</span>
                <span className="font-mono text-[11px] tabular-nums">
                  {transform.warmth > 0 ? `+${transform.warmth}` : transform.warmth}
                </span>
              </div>
              <input
                type="range"
                min="-40"
                max="40"
                step="1"
                value={transform.warmth}
                onChange={(e) => updateField('warmth', parseInt(e.target.value, 10))}
                className="w-full accent-[#D97706] cursor-pointer"
              />
            </div>

            {/* Saturation */}
            <div>
              <div className="flex justify-between text-xs text-[#C4B8A5] mb-1">
                <span>Chroma Saturation</span>
                <span className="font-mono text-[11px] tabular-nums">
                  {Math.round(transform.saturation * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="1.6"
                step="0.05"
                value={transform.saturation}
                onChange={(e) => updateField('saturation', parseFloat(e.target.value))}
                className="w-full accent-[#D97706] cursor-pointer"
              />
            </div>

            {/* Era Filter Intensity */}
            <div>
              <div className="flex justify-between text-xs text-[#C4B8A5] mb-1">
                <span>Historic Filter Depth</span>
                <span className="font-mono text-[11px] tabular-nums">
                  {Math.round(transform.eraFilterStrength * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={transform.eraFilterStrength}
                onChange={(e) => updateField('eraFilterStrength', parseFloat(e.target.value))}
                className="w-full accent-[#D97706] cursor-pointer"
              />
            </div>
          </div>
        )}

        {activeTab === 'props' && (
          <div className="space-y-2.5">
            <p className="text-xs text-[#9E9382] font-serif mb-2">
              Toggle era-authentic regalia, headdresses, and historical accessories:
            </p>
            {era.accessories.map((acc) => {
              const isChecked = activeAccessories[acc.id] !== false;
              return (
                <button
                  key={acc.id}
                  onClick={() => onToggleAccessory(acc.id)}
                  className={`w-full flex items-center justify-between p-2.5 rounded-lg border text-left text-xs transition-all ${
                    isChecked
                      ? 'bg-[#26211C] border-[#D97706] text-[#F5E8D3]'
                      : 'bg-[#1C1815] border-[#2C2620] text-[#786F62]'
                  }`}
                >
                  <span className="font-medium">{acc.name}</span>
                  <div
                    className={`w-4 h-4 rounded flex items-center justify-center border ${
                      isChecked
                        ? 'bg-[#D97706] border-[#F59E0B] text-black'
                        : 'border-[#4A3F33] bg-transparent'
                    }`}
                  >
                    {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer Reset Action */}
      <div className="p-3 border-t border-[#2C2620] bg-[#141210] flex items-center justify-between">
        <span className="text-[11px] text-[#786F62] italic font-serif">
          Canvas supports drag & scroll to position
        </span>
        <button
          onClick={onReset}
          className="flex items-center gap-1.5 text-xs text-[#9E9382] hover:text-[#F5E8D3] transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset Alignment</span>
        </button>
      </div>
    </div>
  );
};
