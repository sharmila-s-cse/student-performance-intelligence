import React from 'react';
import { StudentRecord } from '../types/student';
import { AlertTriangle, Clock, BookX, ArrowRight, ShieldAlert } from 'lucide-react';

interface StudentsNeedingAttentionProps {
  students: StudentRecord[];
  onSelectStudent: (s: StudentRecord) => void;
}

export const StudentsNeedingAttention: React.FC<StudentsNeedingAttentionProps> = ({
  students,
  onSelectStudent,
}) => {
  // Filter students who have low attendance (<75%) OR low score (<68%)
  const attentionList = students
    .filter((s) => s.Performance_Level === 'Needs Attention' || s.Attendance < 75 || s.Pass_Status === 'At-Risk')
    .sort((a, b) => a.Average_Score - b.Average_Score || a.Attendance - b.Attendance)
    .slice(0, 8);

  const getRiskDiagnosis = (s: StudentRecord) => {
    const reasons: string[] = [];
    if (s.Attendance < 70) reasons.push('Chronic Absenteeism');
    else if (s.Attendance < 78) reasons.push('Low Attendance');

    if (s.Average_Score < 60) reasons.push('Severe Score Deficit');
    else if (s.Average_Score < 68) reasons.push('Sub-par Average');

    if (s.Mathematics < 55) reasons.push('Math Remediation');
    if (s.Science < 55) reasons.push('Science Remediation');

    return reasons.length > 0 ? reasons : ['General Monitoring'];
  };

  return (
    <div className="glass-card p-5 rounded-2xl border border-[#F43F5E]/20 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#1E293B]/70">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-[#F43F5E]" />
          <h3 className="text-sm font-bold text-white font-sans">
            Students Requiring Academic Intervention
          </h3>
        </div>
        <span className="text-[11px] font-mono text-[#F43F5E] bg-[#F43F5E]/10 px-2 py-0.5 rounded-full border border-[#F43F5E]/30">
          {attentionList.length} Flagged in Cohort
        </span>
      </div>

      {/* List */}
      <div className="space-y-2.5">
        {attentionList.length === 0 ? (
          <div className="p-6 text-center rounded-xl bg-[#090F20]/50 border border-[#1E293B]">
            <p className="text-xs text-[#10B981] font-semibold">
              ✓ All students in this filtered cohort meet nominal performance and attendance thresholds!
            </p>
          </div>
        ) : (
          attentionList.map((s) => {
            const isSevere = s.Average_Score < 60 || s.Attendance < 65;
            const flags = getRiskDiagnosis(s);

            return (
              <div
                key={s.Student_ID}
                onClick={() => onSelectStudent(s)}
                className="group p-3 rounded-xl bg-[#090F20]/80 border border-[#1E293B] hover:border-[#F43F5E]/50 hover:bg-[#150F1A] transition-all cursor-pointer flex flex-wrap items-center justify-between gap-3"
              >
                {/* Left: ID & Class */}
                <div className="flex items-center gap-3">
                  <div
                    className={`w-2.5 h-10 rounded-full flex-shrink-0 ${
                      isSevere ? 'bg-[#F43F5E] shadow-[0_0_8px_#F43F5E]' : 'bg-[#F59E0B]'
                    }`}
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs text-white group-hover:text-[#F43F5E] transition-colors">
                        {s.Student_ID}
                      </span>
                      <span className="text-[10px] text-[#64748B] font-mono bg-[#1E293B] px-1.5 py-0.5 rounded">
                        {s.Class}
                      </span>
                      {isSevere && (
                        <span className="text-[9px] uppercase font-mono font-bold text-[#F43F5E] bg-[#F43F5E]/15 px-1.5 py-0.5 rounded border border-[#F43F5E]/30">
                          Critical
                        </span>
                      )}
                    </div>

                    {/* Flags */}
                    <div className="flex flex-wrap gap-1 mt-1">
                      {flags.map((flg) => (
                        <span
                          key={flg}
                          className="text-[10px] font-mono text-[#F87171] bg-[#2D1219] px-1.5 py-0.2 rounded"
                        >
                          {flg}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right: Scores */}
                <div className="flex items-center gap-4 text-right">
                  <div>
                    <span className="text-[10px] text-[#64748B] block font-mono uppercase">
                      Attendance
                    </span>
                    <span
                      className={`text-xs font-mono font-semibold ${
                        s.Attendance < 75 ? 'text-[#F43F5E]' : 'text-[#F59E0B]'
                      }`}
                    >
                      {s.Attendance}%
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-[#64748B] block font-mono uppercase">
                      Average
                    </span>
                    <span className="text-sm font-bold font-mono text-[#F43F5E] tabular-nums">
                      {s.Average_Score}%
                    </span>
                  </div>

                  <ArrowRight className="w-4 h-4 text-[#64748B] group-hover:text-[#F43F5E] group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
