import React from 'react';
import { EraConfig } from '../types';
import { HISTORICAL_ERAS } from '../data/historicalEras';
import { sound } from '../utils/audio';

interface EraSelectorProps {
  currentEra: EraConfig;
  onSelectEra: (era: EraConfig) => void;
}

export const EraSelector: React.FC<EraSelectorProps> = ({ currentEra, onSelectEra }) => {
  const handleSelect = (era: EraConfig) => {
    if (era.id !== currentEra.id) {
      sound.playTimeWarp();
      onSelectEra(era);
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3 px-1">
        <div>
          <h3 className="text-xs uppercase tracking-widest text-[#A89F91] font-sans font-semibold">
            Chronological Continuum
          </h3>
          <p className="text-sm font-serif italic text-[#E5DDD0]">
            Select your destination epoch in human history
          </p>
        </div>
        <span className="text-xs text-[#9E9382] font-mono tabular-nums">
          8 Historic Epochs Available
        </span>
      </div>

      {/* Horizontal Scrollable Era Rail */}
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
        {HISTORICAL_ERAS.map((era) => {
          const isSelected = era.id === currentEra.id;
          return (
            <button
              key={era.id}
              onClick={() => handleSelect(era)}
              className={`flex-shrink-0 w-52 p-3.5 rounded-xl border text-left transition-all duration-200 relative overflow-hidden group ${
                isSelected
                  ? 'bg-[#26211C] border-[#D97706] shadow-[0_0_20px_rgba(217,119,6,0.18)] scale-[1.02]'
                  : 'bg-[#181512] border-[#2C2620] hover:border-[#4A3F33] hover:bg-[#1E1A16]'
              }`}
            >
              {/* Subtle top color strip indicator */}
              <div
                className="absolute top-0 left-0 right-0 h-1 transition-opacity"
                style={{
                  backgroundColor: era.accentColor,
                  opacity: isSelected ? 1 : 0.4,
                }}
              />

              {/* Epoch timestamp */}
              <div className="text-[11px] font-mono text-[#D97706] mb-1 font-medium truncate">
                {era.epoch}
              </div>

              {/* Era Title */}
              <h4 className="text-sm font-display font-bold text-[#F5E8D3] mb-1 group-hover:text-white transition-colors truncate">
                {era.name}
              </h4>

              {/* Location */}
              <p className="text-xs text-[#9E9382] mb-2 truncate font-serif">
                {era.location}
              </p>

              {/* Era Badge / Style */}
              <div className="text-[10px] text-[#A89F91] border-t border-[#2C2620] pt-1.5 flex items-center justify-between">
                <span>{era.badgeText}</span>
                {isSelected && (
                  <span className="text-[#F59E0B] font-semibold text-[10px]">Active</span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
