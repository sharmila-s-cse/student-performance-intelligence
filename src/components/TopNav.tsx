import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Bell,
  Sparkles,
  SlidersHorizontal,
  X,
  CheckCircle2,
  AlertTriangle,
  Info,
} from 'lucide-react';
import { AcademicYear } from '../types/student';

interface TopNavProps {
  sidebarCollapsed: boolean;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedYear: string;
  onSelectYear: (year: string) => void;
  glowMode: 'high' | 'subtle';
  onToggleGlow: () => void;
  onOpenQuickFilter: () => void;
  totalFilteredCount: number;
}

export const TopNav: React.FC<TopNavProps> = ({
  sidebarCollapsed,
  searchQuery,
  onSearchChange,
  selectedYear,
  onSelectYear,
  glowMode,
  onToggleGlow,
  onOpenQuickFilter,
  totalFilteredCount,
}) => {
  const [showNotifications, setShowNotifications] = useState<boolean>(false);
  const [isSearchFocused, setIsSearchFocused] = useState<boolean>(false);
  const notifRef = useRef<HTMLDivElement | null>(null);

  const notifications = [
    {
      id: 1,
      type: 'warning',
      title: 'Attendance Alert',
      message: 'Class 10-B registered a 4.2% dip in Thursday attendance.',
      time: '12m ago',
    },
    {
      id: 2,
      type: 'success',
      title: 'Top Score Milestone',
      message: 'STU-1042 reached 99.2% overall score in Computer Science.',
      time: '1h ago',
    },
    {
      id: 3,
      type: 'info',
      title: 'Model Recalibrated',
      message: 'Student performance correlation coefficient recalculated (r = +0.78).',
      time: '3h ago',
    },
  ];

  // Close notifications on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header
      className={`h-16 fixed top-0 right-0 z-20 flex items-center justify-between px-6 bg-[#070C1A]/85 border-b border-[#1E293B]/70 backdrop-blur-xl transition-all duration-300 ${
        sidebarCollapsed ? 'left-[74px]' : 'left-[250px]'
      }`}
    >
      {/* Left: Title & Quick Metrics */}
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-sm md:text-base font-bold text-white tracking-tight flex items-center gap-2 font-sans">
            <span>Student Performance Intelligence</span>
            <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono bg-[#00E5FF]/15 text-[#00E5FF] border border-[#00E5FF]/30">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF] animate-ping" />
              LIVE
            </span>
          </h1>
          <p className="text-[11px] text-[#64748B] font-mono hidden md:block">
            Autonomous Academic Analytics · {totalFilteredCount} students matched
          </p>
        </div>
      </div>

      {/* Middle: Search Bar with animated focus glow */}
      <div className="relative max-w-md w-full mx-4 hidden lg:block">
        <div
          className={`relative rounded-xl transition-all duration-300 ${
            isSearchFocused
              ? 'ring-2 ring-[#00E5FF]/50 shadow-[0_0_20px_rgba(0,229,255,0.25)]'
              : 'hover:border-[#38BDF8]/40'
          }`}
        >
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            placeholder="Search Student ID (e.g. STU-1024), Class..."
            className="w-full pl-10 pr-9 py-2 bg-[#0B132B]/80 border border-[#1E293B] rounded-xl text-xs text-[#E2E8F0] placeholder-[#64748B] focus:outline-none transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Mobile filter button */}
        <button
          onClick={onOpenQuickFilter}
          className="lg:hidden p-2 rounded-xl bg-[#0F172A] border border-[#1E293B] text-[#94A3B8] hover:text-[#E2E8F0]"
          title="Filter cohort"
        >
          <SlidersHorizontal className="w-4 h-4" />
        </button>

        {/* Academic Year Selector */}
        <div className="flex items-center gap-1.5 bg-[#0F172A] border border-[#1E293B] rounded-xl px-2.5 py-1.5">
          <span className="text-[10px] uppercase font-mono tracking-wider text-[#64748B] hidden sm:inline">
            Cohort
          </span>
          <select
            value={selectedYear}
            onChange={(e) => onSelectYear(e.target.value)}
            className="bg-transparent text-xs text-[#E2E8F0] font-mono focus:outline-none cursor-pointer pr-1"
          >
            <option value="All" className="bg-[#0B132B] text-white">
              All Academic Years
            </option>
            <option value="2025-2026" className="bg-[#0B132B] text-white">
              2025-2026 (Active)
            </option>
            <option value="2024-2025" className="bg-[#0B132B] text-white">
              2024-2025
            </option>
            <option value="2023-2024" className="bg-[#0B132B] text-white">
              2023-2024
            </option>
          </select>
        </div>

        {/* Glow Mode Toggle */}
        <button
          onClick={onToggleGlow}
          className={`p-2 rounded-xl border transition-all ${
            glowMode === 'high'
              ? 'bg-[#00E5FF]/15 border-[#00E5FF]/50 text-[#00E5FF] shadow-[0_0_12px_rgba(0,229,255,0.3)]'
              : 'bg-[#0F172A] border-[#1E293B] text-[#94A3B8] hover:text-[#E2E8F0]'
          }`}
          title={`Glow Intensity: ${glowMode === 'high' ? 'High Neon' : 'Subtle'}`}
        >
          <Sparkles className="w-4 h-4" />
        </button>

        {/* Notification Bell with animated pulse badge */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-xl bg-[#0F172A] border border-[#1E293B] text-[#94A3B8] hover:text-[#E2E8F0] hover:border-[#38BDF8]/40 transition-colors"
            title="System notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00E5FF] opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#00E5FF]" />
            </span>
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 rounded-2xl bg-[#090F20] border border-[#1E293B] shadow-2xl p-4 space-y-3 z-50 animate-in fade-in duration-200 backdrop-blur-2xl">
              <div className="flex items-center justify-between border-b border-[#1E293B] pb-2">
                <span className="text-xs font-semibold text-white font-sans">
                  Intelligence Feed
                </span>
                <span className="text-[10px] font-mono text-[#00E5FF]">3 Alerts</span>
              </div>

              <div className="space-y-2.5">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className="p-2.5 rounded-xl bg-[#0E162B] border border-[#1E293B] text-xs space-y-1 hover:border-[#38BDF8]/30 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-white flex items-center gap-1.5">
                        {n.type === 'warning' && (
                          <AlertTriangle className="w-3.5 h-3.5 text-[#F59E0B]" />
                        )}
                        {n.type === 'success' && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
                        )}
                        {n.type === 'info' && <Info className="w-3.5 h-3.5 text-[#38BDF8]" />}
                        {n.title}
                      </span>
                      <span className="text-[10px] text-[#64748B] font-mono">{n.time}</span>
                    </div>
                    <p className="text-[11px] text-[#94A3B8] leading-relaxed">{n.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Profile Avatar Placeholder */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-[#1E293B]">
          <div className="relative w-8 h-8 rounded-xl bg-gradient-to-tr from-[#38BDF8] to-[#8B5CF6] p-[1.5px] cursor-pointer">
            <div className="w-full h-full bg-[#090E1D] rounded-[10px] flex items-center justify-center text-[11px] font-bold text-[#38BDF8] font-mono">
              AD
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#10B981] border-2 border-[#070C1A]" />
          </div>
        </div>
      </div>
    </header>
  );
};
