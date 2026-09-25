import React, { useEffect, useState } from 'react';
import { LucideIcon, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: number | string;
  suffix?: string;
  prefix?: string;
  icon: LucideIcon;
  colorScheme: 'cyan' | 'purple' | 'green' | 'amber' | 'rose';
  delta?: number;
  deltaLabel?: string;
  secondaryText?: string;
  sparklineData?: number[];
}

export const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  suffix = '',
  prefix = '',
  icon: Icon,
  colorScheme,
  delta,
  deltaLabel = 'vs past cohort',
  secondaryText,
  sparklineData = [65, 68, 72, 70, 75, 80, 84],
}) => {
  // Animated count-up for numeric values
  const [displayValue, setDisplayValue] = useState<number | string>(
    typeof value === 'number' ? 0 : value
  );

  useEffect(() => {
    if (typeof value !== 'number') {
      setDisplayValue(value);
      return;
    }

    let start = 0;
    const end = value;
    const duration = 900; // ms
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutExpo
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = start + (end - start) * ease;

      setDisplayValue(end % 1 === 0 ? Math.round(current) : Number(current.toFixed(1)));

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setDisplayValue(end);
      }
    };

    requestAnimationFrame(animate);
  }, [value]);

  const schemeStyles = {
    cyan: {
      border: 'border-[#00E5FF]/20 hover:border-[#00E5FF]/50',
      glow: 'hover:shadow-[0_0_25px_rgba(0,229,255,0.15)]',
      iconBg: 'bg-[#00E5FF]/10 text-[#00E5FF]',
      accent: '#00E5FF',
      text: 'text-[#00E5FF]',
    },
    purple: {
      border: 'border-[#A855F7]/20 hover:border-[#A855F7]/50',
      glow: 'hover:shadow-[0_0_25px_rgba(168,85,247,0.15)]',
      iconBg: 'bg-[#A855F7]/10 text-[#A855F7]',
      accent: '#A855F7',
      text: 'text-[#C084FC]',
    },
    green: {
      border: 'border-[#10B981]/20 hover:border-[#10B981]/50',
      glow: 'hover:shadow-[0_0_25px_rgba(16,185,129,0.15)]',
      iconBg: 'bg-[#10B981]/10 text-[#10B981]',
      accent: '#10B981',
      text: 'text-[#34D399]',
    },
    amber: {
      border: 'border-[#F59E0B]/20 hover:border-[#F59E0B]/50',
      glow: 'hover:shadow-[0_0_25px_rgba(245,158,11,0.15)]',
      iconBg: 'bg-[#F59E0B]/10 text-[#F59E0B]',
      accent: '#F59E0B',
      text: 'text-[#FBBF24]',
    },
    rose: {
      border: 'border-[#F43F5E]/20 hover:border-[#F43F5E]/50',
      glow: 'hover:shadow-[0_0_25px_rgba(244,63,94,0.15)]',
      iconBg: 'bg-[#F43F5E]/10 text-[#F43F5E]',
      accent: '#F43F5E',
      text: 'text-[#FB7185]',
    },
  }[colorScheme];

  // Generate SVG path for sparkline
  const minVal = Math.min(...sparklineData);
  const maxVal = Math.max(...sparklineData);
  const range = maxVal - minVal || 1;
  const w = 110;
  const h = 32;

  const points = sparklineData
    .map((v, i) => {
      const x = (i / (sparklineData.length - 1)) * w;
      const y = h - ((v - minVal) / range) * (h - 8) - 4;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <div
      className={`glass-card glass-card-hover p-4 sm:p-5 rounded-2xl flex flex-col justify-between relative overflow-hidden transition-all duration-300 ${schemeStyles.border} ${schemeStyles.glow}`}
    >
      {/* Subtle top accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px] opacity-75"
        style={{
          background: `linear-gradient(90deg, transparent, ${schemeStyles.accent}, transparent)`,
        }}
      />

      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8] font-sans">
          {title}
        </span>
        <div className={`p-2 rounded-xl ${schemeStyles.iconBg}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>

      {/* Primary Value & Sparkline */}
      <div className="flex items-end justify-between my-1">
        <div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-white tracking-tight tabular-nums flex items-baseline">
            {prefix && <span className="text-lg mr-0.5 text-[#94A3B8]">{prefix}</span>}
            <span>{displayValue}</span>
            {suffix && <span className={`text-base ml-0.5 font-sans ${schemeStyles.text}`}>{suffix}</span>}
          </div>
          {secondaryText && (
            <p className="text-[11px] text-[#64748B] font-mono mt-0.5">{secondaryText}</p>
          )}
        </div>

        {/* Mini SVG Sparkline */}
        <div className="hidden sm:block">
          <svg width={w} height={h} className="overflow-visible">
            <polyline
              fill="none"
              stroke={schemeStyles.accent}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={points}
              opacity="0.85"
            />
            {/* Last glowing dot */}
            {sparklineData.length > 0 && (
              <circle
                cx={w}
                cy={h - ((sparklineData[sparklineData.length - 1] - minVal) / range) * (h - 8) - 4}
                r="3"
                fill={schemeStyles.accent}
                className="animate-ping opacity-75"
              />
            )}
          </svg>
        </div>
      </div>

      {/* Delta Footer */}
      {delta !== undefined && (
        <div className="flex items-center gap-1.5 pt-3 mt-2 border-t border-[#1E293B]/60 text-xs">
          <span
            className={`flex items-center font-mono font-semibold text-[11px] tabular-nums ${
              delta >= 0 ? 'text-[#10B981]' : 'text-[#F43F5E]'
            }`}
          >
            {delta >= 0 ? (
              <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
            ) : (
              <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />
            )}
            {delta >= 0 ? `+${delta}%` : `${delta}%`}
          </span>
          <span className="text-[11px] text-[#64748B] truncate">{deltaLabel}</span>
        </div>
      )}
    </div>
  );
};
