import React, { useState, useMemo } from 'react';
import { ALL_MOCK_STUDENTS, filterStudents, computeKPISummary } from './data/mockStudents';
import { CohortFilters, StudentRecord } from './types/student';

import { Sidebar, NavTab } from './components/Sidebar';
import { TopNav } from './components/TopNav';
import { KPICard } from './components/KPICard';
import { FilterBar } from './components/FilterBar';
import { PerformanceTrendChart } from './components/PerformanceTrendChart';
import { SubjectPerformanceView } from './components/SubjectPerformanceView';
import { AttendanceIntelligenceView } from './components/AttendanceIntelligenceView';
import { TopPerformersLeaderboard } from './components/TopPerformersLeaderboard';
import { StudentsNeedingAttention } from './components/StudentsNeedingAttention';
import { StudentsDirectoryTable } from './components/StudentsDirectoryTable';
import { StudentDetailModal } from './components/StudentDetailModal';
import { InsightsView } from './components/InsightsView';

import {
  Users,
  TrendingUp,
  GraduationCap,
  CalendarCheck,
  Award,
  AlertTriangle,
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [glowMode, setGlowMode] = useState<'high' | 'subtle'>('high');

  // Global cohort slicers & filters state
  const [filters, setFilters] = useState<CohortFilters>({
    academicYear: 'All',
    classGroup: 'All',
    gender: 'All',
    subjectFocus: 'All',
    performanceLevel: 'All',
    passStatus: 'All',
    searchQuery: '',
    attendanceThreshold: 'All',
  });

  const [selectedStudent, setSelectedStudent] = useState<StudentRecord | null>(null);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState<boolean>(false);

  // Filtered dataset reactive computation
  const filteredStudents = useMemo(() => {
    return filterStudents(ALL_MOCK_STUDENTS, filters);
  }, [filters]);

  // Reactive KPI summary computation
  const kpi = useMemo(() => {
    return computeKPISummary(filteredStudents);
  }, [filteredStudents]);

  const handleResetFilters = () => {
    setFilters({
      academicYear: 'All',
      classGroup: 'All',
      gender: 'All',
      subjectFocus: 'All',
      performanceLevel: 'All',
      passStatus: 'All',
      searchQuery: '',
      attendanceThreshold: 'All',
    });
  };

  return (
    <div className="min-h-screen bg-[#060913] text-[#E2E8F0] font-sans selection:bg-[#00E5FF]/30 selection:text-[#00E5FF] relative overflow-x-hidden">
      {/* Ambient background glowing gradient blobs */}
      {glowMode === 'high' && (
        <div className="ambient-glow-bg">
          <div className="ambient-blob-1" />
          <div className="ambient-blob-2" />
          <div className="ambient-blob-3" />
        </div>
      )}

      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        totalStudentsCount={filteredStudents.length}
      />

      {/* Top Navigation */}
      <TopNav
        sidebarCollapsed={sidebarCollapsed}
        searchQuery={filters.searchQuery}
        onSearchChange={(q) => setFilters((prev) => ({ ...prev, searchQuery: q }))}
        selectedYear={filters.academicYear}
        onSelectYear={(yr) => setFilters((prev) => ({ ...prev, academicYear: yr }))}
        glowMode={glowMode}
        onToggleGlow={() => setGlowMode((g) => (g === 'high' ? 'subtle' : 'high'))}
        onOpenQuickFilter={() => setIsMobileFilterOpen(true)}
        totalFilteredCount={filteredStudents.length}
      />

      {/* Main Content Viewport */}
      <main
        className={`pt-20 pb-12 px-4 sm:px-6 lg:px-8 transition-all duration-300 relative z-10 ${
          sidebarCollapsed ? 'ml-[74px]' : 'ml-[74px] md:ml-[250px]'
        }`}
      >
        <div className="max-w-[1600px] mx-auto space-y-6">
          {/* Always Visible Cohort Slicers Bar */}
          <FilterBar
            filters={filters}
            onChangeFilters={setFilters}
            onResetFilters={handleResetFilters}
            totalMatched={filteredStudents.length}
            totalAll={ALL_MOCK_STUDENTS.length}
          />

          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              {/* 6 Animated KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                <KPICard
                  title="Total Students"
                  value={kpi.totalStudents}
                  icon={Users}
                  colorScheme="cyan"
                  delta={kpi.deltas.totalStudents}
                  sparklineData={[140, 155, 168, 172, 185, 192]}
                />
                <KPICard
                  title="Average Score"
                  value={kpi.averageScore}
                  suffix="%"
                  icon={TrendingUp}
                  colorScheme="purple"
                  delta={kpi.deltas.averageScore}
                  sparklineData={[72, 74, 73, 76, 78, 80]}
                />
                <KPICard
                  title="Pass Rate"
                  value={kpi.passRate}
                  suffix="%"
                  icon={GraduationCap}
                  colorScheme="green"
                  delta={kpi.deltas.passRate}
                  sparklineData={[82, 84, 85, 87, 88, 89]}
                />
                <KPICard
                  title="Average Attendance"
                  value={kpi.averageAttendance}
                  suffix="%"
                  icon={CalendarCheck}
                  colorScheme="cyan"
                  delta={kpi.deltas.attendance}
                  sparklineData={[80, 82, 81, 84, 85, 86]}
                />
                <KPICard
                  title="Top Subject"
                  value={kpi.topPerformingSubject.name}
                  secondaryText={`Avg Score: ${kpi.topPerformingSubject.average}%`}
                  icon={Award}
                  colorScheme="amber"
                  sparklineData={[85, 87, 88, 90, 92, 94]}
                />
                <KPICard
                  title="Needing Attention"
                  value={kpi.studentsNeedingAttention}
                  suffix=""
                  icon={AlertTriangle}
                  colorScheme="rose"
                  delta={-2.1}
                  deltaLabel="intervention active"
                  sparklineData={[32, 28, 25, 24, 21, 18]}
                />
              </div>

              {/* Performance Trend Chart */}
              <PerformanceTrendChart students={filteredStudents} />

              {/* Two Column Grid: Top Performers & Students Needing Attention */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <TopPerformersLeaderboard
                  students={filteredStudents}
                  onSelectStudent={setSelectedStudent}
                />
                <StudentsNeedingAttention
                  students={filteredStudents}
                  onSelectStudent={setSelectedStudent}
                />
              </div>

              {/* Attendance Matrix Preview */}
              <AttendanceIntelligenceView
                students={filteredStudents}
                onSelectStudent={setSelectedStudent}
              />
            </div>
          )}

          {/* TAB 2: PERFORMANCE */}
          {activeTab === 'performance' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <PerformanceTrendChart students={filteredStudents} />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <TopPerformersLeaderboard
                  students={filteredStudents}
                  onSelectStudent={setSelectedStudent}
                />
                <StudentsNeedingAttention
                  students={filteredStudents}
                  onSelectStudent={setSelectedStudent}
                />
              </div>
            </div>
          )}

          {/* TAB 3: SUBJECTS */}
          {activeTab === 'subjects' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <SubjectPerformanceView students={filteredStudents} />
            </div>
          )}

          {/* TAB 4: ATTENDANCE */}
          {activeTab === 'attendance' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <AttendanceIntelligenceView
                students={filteredStudents}
                onSelectStudent={setSelectedStudent}
              />
            </div>
          )}

          {/* TAB 5: STUDENTS DIRECTORY */}
          {activeTab === 'students' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <StudentsDirectoryTable
                students={filteredStudents}
                onSelectStudent={setSelectedStudent}
              />
            </div>
          )}

          {/* TAB 6: INSIGHTS & PREDICTIVE ANALYTICS */}
          {activeTab === 'insights' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <InsightsView students={filteredStudents} />
            </div>
          )}
        </div>
      </main>

      {/* Student Deep Dive Modal */}
      <StudentDetailModal
        student={selectedStudent}
        onClose={() => setSelectedStudent(null)}
      />

      {/* Mobile Slicer Drawer */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 lg:hidden p-4">
          <div className="w-full max-w-lg bg-[#090F20] border border-[#1E293B] rounded-2xl p-5 space-y-4">
            <div className="flex justify-between items-center border-b border-[#1E293B] pb-3">
              <h3 className="text-sm font-bold text-white">Cohort Filters</h3>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="text-xs text-[#00E5FF]"
              >
                Done
              </button>
            </div>
            <FilterBar
              filters={filters}
              onChangeFilters={setFilters}
              onResetFilters={handleResetFilters}
              totalMatched={filteredStudents.length}
              totalAll={ALL_MOCK_STUDENTS.length}
            />
          </div>
        </div>
      )}
    </div>
  );
}
