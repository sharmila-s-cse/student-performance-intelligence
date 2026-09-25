import React from 'react';
import {
  LayoutDashboard,
  TrendingUp,
  GraduationCap,
  CalendarCheck,
  Users,
  BrainCircuit,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

export type NavTab = 'overview' | 'performance' | 'subjects' | 'attendance' | 'students' | 'insights';

interface SidebarProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  totalStudentsCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  isCollapsed,
  onToggleCollapse,
  totalStudentsCount,
}) => {
  const navItems: Array<{
    id: NavTab;
    label: string;
    icon: React.ElementType;
    badge?: string;
  }> = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'performance', label: 'Performance', icon: TrendingUp },
    { id: 'subjects', label: 'Subjects', icon: GraduationCap },
    { id: 'attendance', label: 'Attendance', icon: CalendarCheck },
    { id: 'students', label: 'Students', icon: Users, badge: `${totalStudentsCount}` },
    { id: 'insights', label: 'Insights', icon: BrainCircuit, badge: 'AI' },
  ];

  return (
    <aside
      className={`fixed top-0 left-0 bottom-0 z-30 flex flex-col bg-[#070C1A]/95 border-r border-[#1E293B]/70 backdrop-blur-2xl transition-all duration-300 ${
        isCollapsed ? 'w-[74px]' : 'w-[250px]'
      }`}
    >
      {/* Brand Lockup */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-[#1E293B]/60">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="relative flex-shrink-0 w-9 h-9 rounded-xl bg-gradient-to-br from-[#00E5FF] via-[#38BDF8] to-[#8B5CF6] p-[1.5px] shadow-[0_0_15px_rgba(0,229,255,0.4)]">
            <div className="w-full h-full bg-[#090E1D] rounded-[10px] flex items-center justify-center">
              <BrainCircuit className="w-5 h-5 text-[#00E5FF]" />
            </div>
          </div>
          {!isCollapsed && (
            <div className="flex flex-col truncate">
              <span className="text-xs font-bold tracking-wider text-white uppercase font-sans truncate">
                SPI Analytics
              </span>
              <span className="text-[10px] text-[#38BDF8] tracking-widest font-mono uppercase">
                Intelligence v4.2
              </span>
            </div>
          )}
        </div>

        {/* Toggle Collapse */}
        <button
          onClick={onToggleCollapse}
          className="p-1.5 rounded-lg text-[#64748B] hover:text-[#E2E8F0] hover:bg-[#131E36] transition-colors"
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 py-5 px-3 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all group relative ${
                isActive
                  ? 'bg-gradient-to-r from-[#00E5FF]/15 to-[#8B5CF6]/10 text-white border border-[#00E5FF]/40 shadow-[0_0_20px_rgba(0,229,255,0.15)]'
                  : 'text-[#94A3B8] hover:text-[#E2E8F0] hover:bg-[#0F172A]/70 border border-transparent'
              }`}
              title={isCollapsed ? item.label : undefined}
            >
              {/* Glowing active indicator bar */}
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-[#00E5FF] rounded-r-full shadow-[0_0_8px_#00E5FF]" />
              )}

              <Icon
                className={`w-4 h-4 flex-shrink-0 transition-transform group-hover:scale-110 ${
                  isActive ? 'text-[#00E5FF]' : 'text-[#64748B] group-hover:text-[#38BDF8]'
                }`}
              />

              {!isCollapsed && (
                <span className="flex-1 text-left font-sans truncate">{item.label}</span>
              )}

              {!isCollapsed && item.badge && (
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded-md tabular-nums ${
                    isActive
                      ? 'bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF]/30'
                      : 'bg-[#1E293B] text-[#94A3B8]'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Cohort System Status footer */}
      {!isCollapsed && (
        <div className="p-3.5 m-3 rounded-xl bg-gradient-to-b from-[#0F172A] to-[#0A1020] border border-[#1E293B] text-xs space-y-2">
          <div className="flex items-center gap-2 text-[#10B981]">
            <ShieldCheck className="w-4 h-4 text-[#10B981]" />
            <span className="text-[11px] font-semibold text-[#E2E8F0]">Live Cohort Stream</span>
          </div>
          <p className="text-[11px] text-[#64748B] font-sans leading-relaxed">
            Data refreshed in memory. Full cross-subject correlation active.
          </p>
          <div className="flex items-center justify-between text-[10px] font-mono text-[#38BDF8] pt-1 border-t border-[#1E293B]/70">
            <span>Latency</span>
            <span className="text-[#10B981]">0.8 ms</span>
          </div>
        </div>
      )}
    </aside>
  );
};
