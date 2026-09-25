import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import { StudentRecord } from '../types/student';
import { X, Calendar, GraduationCap, CheckCircle2, AlertTriangle, User } from 'lucide-react';

interface StudentDetailModalProps {
  student: StudentRecord | null;
  onClose: () => void;
}

export const StudentDetailModal: React.FC<StudentDetailModalProps> = ({ student, onClose }) => {
  const radarRef = useRef<HTMLCanvasElement | null>(null);
  const radarChartRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!student || !radarRef.current) return;

    const existing = Chart.getChart(radarRef.current);
    if (existing) existing.destroy();

    const ctx = radarRef.current.getContext('2d');
    if (ctx) {
      radarChartRef.current = new Chart(ctx, {
        type: 'radar',
        data: {
          labels: ['Mathematics', 'Science', 'English', 'Computer Science'],
          datasets: [
            {
              label: student.Student_ID,
              data: [
                student.Mathematics,
                student.Science,
                student.English,
                student.Computer_Science,
              ],
              backgroundColor: 'rgba(0, 229, 255, 0.25)',
              borderColor: '#00E5FF',
              borderWidth: 2,
              pointBackgroundColor: '#00E5FF',
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
          },
          scales: {
            r: {
              min: 30,
              max: 100,
              angleLines: { color: 'rgba(30, 41, 59, 0.8)' },
              grid: { color: 'rgba(30, 41, 59, 0.8)' },
              pointLabels: {
                color: '#E2E8F0',
                font: { family: 'Plus Jakarta Sans', size: 10, weight: 'bold' },
              },
              ticks: { display: false },
            },
          },
        },
      });
    }

    return () => {
      if (radarRef.current) {
        const existingChart = Chart.getChart(radarRef.current);
        if (existingChart) existingChart.destroy();
      }
      radarChartRef.current = null;
    };
  }, [student]);

  if (!student) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#090F20] border border-[#1E293B] rounded-2xl shadow-2xl p-6 overflow-hidden max-h-[90vh] flex flex-col space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#1E293B]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#00E5FF] to-[#8B5CF6] p-[1.5px]">
              <div className="w-full h-full bg-[#090E1D] rounded-[10px] flex items-center justify-center">
                <User className="w-5 h-5 text-[#00E5FF]" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white font-mono">{student.Student_ID}</h3>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                    student.Performance_Level === 'High Performer'
                      ? 'bg-[#10B981]/20 text-[#10B981]'
                      : student.Performance_Level === 'Average'
                      ? 'bg-[#38BDF8]/20 text-[#38BDF8]'
                      : 'bg-[#F43F5E]/20 text-[#F43F5E]'
                  }`}
                >
                  {student.Performance_Level}
                </span>
              </div>
              <p className="text-xs text-[#94A3B8] font-mono">
                {student.Class} · {student.Gender} · {student.Academic_Year}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#64748B] hover:text-white hover:bg-[#1E293B]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto space-y-5">
          {/* Top Score & Attendance Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-[#0E162B] border border-[#1E293B] text-center">
              <span className="text-[10px] text-[#64748B] font-mono uppercase block">
                Overall Average
              </span>
              <span className="text-xl font-bold font-mono text-[#00E5FF] tabular-nums">
                {student.Average_Score}%
              </span>
            </div>

            <div className="p-3 rounded-xl bg-[#0E162B] border border-[#1E293B] text-center">
              <span className="text-[10px] text-[#64748B] font-mono uppercase block">
                Attendance
              </span>
              <span
                className={`text-xl font-bold font-mono tabular-nums ${
                  student.Attendance >= 80 ? 'text-[#10B981]' : 'text-[#F43F5E]'
                }`}
              >
                {student.Attendance}%
              </span>
            </div>

            <div className="p-3 rounded-xl bg-[#0E162B] border border-[#1E293B] text-center">
              <span className="text-[10px] text-[#64748B] font-mono uppercase block">
                Total Score
              </span>
              <span className="text-xl font-bold font-mono text-white tabular-nums">
                {student.Total_Score}/400
              </span>
            </div>

            <div className="p-3 rounded-xl bg-[#0E162B] border border-[#1E293B] text-center">
              <span className="text-[10px] text-[#64748B] font-mono uppercase block">
                Pass Status
              </span>
              <span
                className={`text-sm font-bold font-mono mt-1 block ${
                  student.Pass_Status === 'Passed' ? 'text-[#10B981]' : 'text-[#F43F5E]'
                }`}
              >
                {student.Pass_Status === 'Passed' ? 'Passed' : 'At-Risk'}
              </span>
            </div>
          </div>

          {/* Subject Breakdown & Radar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            {/* Subject Bars */}
            <div className="space-y-3 p-4 rounded-xl bg-[#0E162B] border border-[#1E293B]">
              <span className="text-xs font-bold text-white uppercase tracking-wider font-mono block mb-2">
                Subject Proficiencies
              </span>

              <div>
                <div className="flex justify-between text-xs text-[#94A3B8] mb-1">
                  <span>Mathematics</span>
                  <span className="font-mono text-white">{student.Mathematics}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-[#1E293B] overflow-hidden">
                  <div
                    className="h-full bg-[#38BDF8] rounded-full"
                    style={{ width: `${student.Mathematics}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs text-[#94A3B8] mb-1">
                  <span>Science</span>
                  <span className="font-mono text-white">{student.Science}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-[#1E293B] overflow-hidden">
                  <div
                    className="h-full bg-[#10B981] rounded-full"
                    style={{ width: `${student.Science}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs text-[#94A3B8] mb-1">
                  <span>English</span>
                  <span className="font-mono text-white">{student.English}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-[#1E293B] overflow-hidden">
                  <div
                    className="h-full bg-[#F59E0B] rounded-full"
                    style={{ width: `${student.English}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs text-[#94A3B8] mb-1">
                  <span>Computer Science</span>
                  <span className="font-mono text-white">{student.Computer_Science}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-[#1E293B] overflow-hidden">
                  <div
                    className="h-full bg-[#A855F7] rounded-full"
                    style={{ width: `${student.Computer_Science}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Radar View */}
            <div className="h-[200px] flex items-center justify-center p-2 rounded-xl bg-[#0E162B] border border-[#1E293B]">
              <canvas ref={radarRef} />
            </div>
          </div>

          {/* Term Trajectory */}
          <div className="p-4 rounded-xl bg-[#0E162B] border border-[#1E293B] space-y-2">
            <span className="text-xs font-bold text-white uppercase tracking-wider font-mono block">
              Term-by-Term Trajectory
            </span>
            <div className="grid grid-cols-5 gap-2 text-center text-xs">
              <div className="p-2 rounded bg-[#090F20]">
                <span className="text-[10px] text-[#64748B] block font-mono">Term 1</span>
                <span className="font-mono font-bold text-white">{student.termScores.term1}%</span>
              </div>
              <div className="p-2 rounded bg-[#090F20]">
                <span className="text-[10px] text-[#64748B] block font-mono">Term 2</span>
                <span className="font-mono font-bold text-white">{student.termScores.term2}%</span>
              </div>
              <div className="p-2 rounded bg-[#090F20]">
                <span className="text-[10px] text-[#64748B] block font-mono">Term 3</span>
                <span className="font-mono font-bold text-white">{student.termScores.term3}%</span>
              </div>
              <div className="p-2 rounded bg-[#090F20]">
                <span className="text-[10px] text-[#64748B] block font-mono">Midterm</span>
                <span className="font-mono font-bold text-white">{student.termScores.midterm}%</span>
              </div>
              <div className="p-2 rounded bg-[#090F20]">
                <span className="text-[10px] text-[#64748B] block font-mono">Final</span>
                <span className="font-mono font-bold text-white">{student.termScores.final}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-[#1E293B] flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#1E293B] hover:bg-[#334155] text-white text-xs font-semibold rounded-xl transition-colors"
          >
            Close Dossier
          </button>
        </div>
      </div>
    </div>
  );
};
