import React from 'react';
import { CohortFilters } from '../types/student';
import { Filter, RotateCcw, X } from 'lucide-react';

interface FilterBarProps {
  filters: CohortFilters;
  onChangeFilters: (f: CohortFilters) => void;
  onResetFilters: () => void;
  totalMatched: number;
  totalAll: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onChangeFilters,
  onResetFilters,
  totalMatched,
  totalAll,
}) => {
  const updateField = (key: keyof CohortFilters, val: string) => {
    onChangeFilters({
      ...filters,
      [key]: val,
    });
  };

  const isAnyFilterActive =
    filters.classGroup !== 'All' ||
    filters.gender !== 'All' ||
    filters.subjectFocus !== 'All' ||
    filters.performanceLevel !== 'All' ||
    filters.passStatus !== 'All' ||
    filters.attendanceThreshold !== 'All' ||
    filters.searchQuery.trim().length > 0;

  return (
    <div className="glass-card p-4 rounded-2xl border border-[#1E293B] space-y-3">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-[#1E293B]/70">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#00E5FF]" />
          <span className="text-xs font-bold uppercase tracking-wider text-white font-sans">
            Cohort Slicers & Filters
          </span>
          <span className="text-[11px] font-mono text-[#00E5FF] bg-[#00E5FF]/10 px-2 py-0.5 rounded-full border border-[#00E5FF]/20">
            {totalMatched} of {totalAll} active
          </span>
        </div>

        {isAnyFilterActive && (
          <button
            onClick={onResetFilters}
            className="flex items-center gap-1.5 text-xs text-[#94A3B8] hover:text-[#00E5FF] transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All Filters</span>
          </button>
        )}
      </div>

      {/* Selectors Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {/* Class Filter */}
        <div className="space-y-1">
          <label className="text-[10px] uppercase font-mono tracking-wider text-[#64748B] block">
            Class
          </label>
          <select
            value={filters.classGroup}
            onChange={(e) => updateField('classGroup', e.target.value)}
            className="w-full px-2.5 py-1.5 bg-[#0B132B] border border-[#1E293B] rounded-xl text-xs text-[#E2E8F0] focus:border-[#00E5FF] focus:outline-none transition-colors"
          >
            <option value="All">All Classes</option>
            <option value="Class 10-A">Class 10-A</option>
            <option value="Class 10-B">Class 10-B</option>
            <option value="Class 11-A">Class 11-A</option>
            <option value="Class 11-B">Class 11-B</option>
            <option value="Class 12-A">Class 12-A</option>
            <option value="Class 12-B">Class 12-B</option>
          </select>
        </div>

        {/* Gender Filter */}
        <div className="space-y-1">
          <label className="text-[10px] uppercase font-mono tracking-wider text-[#64748B] block">
            Gender
          </label>
          <select
            value={filters.gender}
            onChange={(e) => updateField('gender', e.target.value)}
            className="w-full px-2.5 py-1.5 bg-[#0B132B] border border-[#1E293B] rounded-xl text-xs text-[#E2E8F0] focus:border-[#00E5FF] focus:outline-none transition-colors"
          >
            <option value="All">All Genders</option>
            <option value="Female">Female</option>
            <option value="Male">Male</option>
            <option value="Non-Binary">Non-Binary</option>
          </select>
        </div>

        {/* Performance Level */}
        <div className="space-y-1">
          <label className="text-[10px] uppercase font-mono tracking-wider text-[#64748B] block">
            Performance
          </label>
          <select
            value={filters.performanceLevel}
            onChange={(e) => updateField('performanceLevel', e.target.value)}
            className="w-full px-2.5 py-1.5 bg-[#0B132B] border border-[#1E293B] rounded-xl text-xs text-[#E2E8F0] focus:border-[#00E5FF] focus:outline-none transition-colors"
          >
            <option value="All">All Levels</option>
            <option value="High Performer">High Performer (≥84)</option>
            <option value="Average">Average (68-83)</option>
            <option value="Needs Attention">Needs Attention (&lt;68)</option>
          </select>
        </div>

        {/* Pass Status */}
        <div className="space-y-1">
          <label className="text-[10px] uppercase font-mono tracking-wider text-[#64748B] block">
            Status
          </label>
          <select
            value={filters.passStatus}
            onChange={(e) => updateField('passStatus', e.target.value)}
            className="w-full px-2.5 py-1.5 bg-[#0B132B] border border-[#1E293B] rounded-xl text-xs text-[#E2E8F0] focus:border-[#00E5FF] focus:outline-none transition-colors"
          >
            <option value="All">All Statuses</option>
            <option value="Passed">Passed (Nominal)</option>
            <option value="At-Risk">At-Risk (Warning)</option>
          </select>
        </div>

        {/* Attendance Range */}
        <div className="space-y-1">
          <label className="text-[10px] uppercase font-mono tracking-wider text-[#64748B] block">
            Attendance
          </label>
          <select
            value={filters.attendanceThreshold}
            onChange={(e) => updateField('attendanceThreshold', e.target.value)}
            className="w-full px-2.5 py-1.5 bg-[#0B132B] border border-[#1E293B] rounded-xl text-xs text-[#E2E8F0] focus:border-[#00E5FF] focus:outline-none transition-colors"
          >
            <option value="All">All Attendance</option>
            <option value="High">High (≥90%)</option>
            <option value="Moderate">Moderate (75-89%)</option>
            <option value="At-Risk">At-Risk (&lt;75%)</option>
          </select>
        </div>

        {/* Subject Focus */}
        <div className="space-y-1">
          <label className="text-[10px] uppercase font-mono tracking-wider text-[#64748B] block">
            Subject View
          </label>
          <select
            value={filters.subjectFocus}
            onChange={(e) => updateField('subjectFocus', e.target.value)}
            className="w-full px-2.5 py-1.5 bg-[#0B132B] border border-[#1E293B] rounded-xl text-xs text-[#E2E8F0] focus:border-[#00E5FF] focus:outline-none transition-colors"
          >
            <option value="All">All Subjects</option>
            <option value="Mathematics">Mathematics</option>
            <option value="Science">Science</option>
            <option value="English">English</option>
            <option value="Computer_Science">Computer Science</option>
          </select>
        </div>
      </div>

      {/* Active Filter Chips */}
      {isAnyFilterActive && (
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-[11px] text-[#64748B]">Active Slicers:</span>
          {filters.classGroup !== 'All' && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono bg-[#1E293B] text-[#E2E8F0] border border-[#334155]">
              Class: {filters.classGroup}
              <X
                className="w-3 h-3 cursor-pointer hover:text-[#00E5FF]"
                onClick={() => updateField('classGroup', 'All')}
              />
            </span>
          )}
          {filters.gender !== 'All' && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono bg-[#1E293B] text-[#E2E8F0] border border-[#334155]">
              Gender: {filters.gender}
              <X
                className="w-3 h-3 cursor-pointer hover:text-[#00E5FF]"
                onClick={() => updateField('gender', 'All')}
              />
            </span>
          )}
          {filters.performanceLevel !== 'All' && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono bg-[#1E293B] text-[#E2E8F0] border border-[#334155]">
              {filters.performanceLevel}
              <X
                className="w-3 h-3 cursor-pointer hover:text-[#00E5FF]"
                onClick={() => updateField('performanceLevel', 'All')}
              />
            </span>
          )}
          {filters.attendanceThreshold !== 'All' && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono bg-[#1E293B] text-[#E2E8F0] border border-[#334155]">
              Attendance: {filters.attendanceThreshold}
              <X
                className="w-3 h-3 cursor-pointer hover:text-[#00E5FF]"
                onClick={() => updateField('attendanceThreshold', 'All')}
              />
            </span>
          )}
          {filters.searchQuery && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/30">
              Query: “{filters.searchQuery}”
              <X
                className="w-3 h-3 cursor-pointer hover:text-white"
                onClick={() => updateField('searchQuery', '')}
              />
            </span>
          )}
        </div>
      )}
    </div>
  );
};
