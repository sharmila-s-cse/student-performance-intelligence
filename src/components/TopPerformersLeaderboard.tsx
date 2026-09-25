import React from 'react';
import { StudentRecord } from '../types/student';
import { Trophy, Medal, Award, ArrowUpRight } from 'lucide-react';

interface TopPerformersLeaderboardProps {
  students: StudentRecord[];
  onSelectStudent: (s: StudentRecord) => void;
}

export const TopPerformersLeaderboard: React.FC<TopPerformersLeaderboardProps> = ({
  students,
  onSelectStudent,
}) => {
  // Sort descending by Average Score, then Attendance
  const topStudents = [...students]
    .sort((a, b) => b.Average_Score - a.Average_Score || b.Attendance - a.Attendance)
    .slice(0, 8);

  const getRankBadge = (rank: number) => {
    if (rank === 1) {
      return (
        <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-[#F59E0B] to-[#FEF08A] text-black font-mono font-bold flex items-center justify-center text-xs shadow-[0_0_12px_rgba(245,158,11,0.5)]">
          <Trophy className="w-4 h-4 text-black" />
        </div>
      );
    }
    if (rank === 2) {
      return (
        <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-[#94A3B8] to-[#E2E8F0] text-black font-mono font-bold flex items-center justify-center text-xs shadow-[0_0_10px_rgba(226,232,240,0.4)]">
          <Medal className="w-4 h-4 text-black" />
        </div>
      );
    }
    if (rank === 3) {
      return (
        <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-[#B45309] to-[#FBBF24] text-black font-mono font-bold flex items-center justify-center text-xs shadow-[0_0_10px_rgba(180,83,9,0.4)]">
          <Award className="w-4 h-4 text-black" />
        </div>
      );
    }
    return (
      <div className="w-7 h-7 rounded-xl bg-[#1E293B] text-[#94A3B8] font-mono font-semibold flex items-center justify-center text-xs">
        {rank}
      </div>
    );
  };

  return (
    <div className="glass-card p-5 rounded-2xl border border-[#1E293B] space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#1E293B]/70">
        <div className="flex items-center gap-2">
          <Trophy className="w-4 h-4 text-[#F59E0B]" />
          <h3 className="text-sm font-bold text-white font-sans">
            Top Performers Cohort Leaderboard
          </h3>
        </div>
        <span className="text-[11px] font-mono text-[#F59E0B] bg-[#F59E0B]/10 px-2 py-0.5 rounded-full border border-[#F59E0B]/30">
          Academic Honor Roll
        </span>
      </div>

      {/* Leaderboard List */}
      <div className="space-y-2.5">
        {topStudents.length === 0 ? (
          <p className="text-xs text-[#64748B] text-center py-6">
            No students match the selected filter parameters.
          </p>
        ) : (
          topStudents.map((s, index) => {
            const rank = index + 1;
            return (
              <div
                key={s.Student_ID}
                onClick={() => onSelectStudent(s)}
                className="group p-3 rounded-xl bg-[#090F20]/70 border border-[#1E293B] hover:border-[#00E5FF]/40 hover:bg-[#0E162B] transition-all cursor-pointer flex items-center justify-between gap-3"
              >
                {/* Left: Rank & Student ID */}
                <div className="flex items-center gap-3">
                  {getRankBadge(rank)}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs text-white group-hover:text-[#00E5FF] transition-colors">
                        {s.Student_ID}
                      </span>
                      <span className="text-[10px] text-[#64748B] font-mono bg-[#1E293B] px-1.5 py-0.5 rounded">
                        {s.Class}
                      </span>
                    </div>
                    <div className="text-[10px] text-[#94A3B8] font-mono mt-0.5 flex items-center gap-2">
                      <span>M: {s.Mathematics}%</span>
                      <span>·</span>
                      <span>S: {s.Science}%</span>
                      <span>·</span>
                      <span>CS: {s.Computer_Science}%</span>
                    </div>
                  </div>
                </div>

                {/* Right: Scores & Attendance */}
                <div className="flex items-center gap-4 text-right">
                  <div className="hidden sm:block">
                    <span className="text-[10px] text-[#64748B] block font-mono uppercase">
                      Attendance
                    </span>
                    <span className="text-xs font-mono font-semibold text-[#10B981]">
                      {s.Attendance}%
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-[#64748B] block font-mono uppercase">
                      Average
                    </span>
                    <span className="text-sm font-bold font-mono text-[#00E5FF] tabular-nums">
                      {s.Average_Score}%
                    </span>
                  </div>

                  <ArrowUpRight className="w-4 h-4 text-[#64748B] group-hover:text-[#00E5FF] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
