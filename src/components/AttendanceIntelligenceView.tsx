import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import { StudentRecord } from '../types/student';
import { computeAttendanceScoreCorrelation } from '../data/mockStudents';
import { CalendarCheck, PieChart, TrendingUp, AlertCircle, CheckCircle2 } from 'lucide-react';

interface AttendanceIntelligenceViewProps {
  students: StudentRecord[];
  onSelectStudent?: (student: StudentRecord) => void;
}

export const AttendanceIntelligenceView: React.FC<AttendanceIntelligenceViewProps> = ({
  students,
  onSelectStudent,
}) => {
  const scatterCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const scatterChartRef = useRef<Chart | null>(null);

  const doughnutCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const doughnutChartRef = useRef<Chart | null>(null);

  const n = Math.max(1, students.length);
  const correlation = computeAttendanceScoreCorrelation(students);

  // Distribution buckets
  const bucketHigh = students.filter((s) => s.Attendance >= 90).length; // 90-100
  const bucketMod = students.filter((s) => s.Attendance >= 80 && s.Attendance < 90).length; // 80-89
  const bucketFair = students.filter((s) => s.Attendance >= 70 && s.Attendance < 80).length; // 70-79
  const bucketLow = students.filter((s) => s.Attendance < 70).length; // <70

  useEffect(() => {
    // 1. Scatter Chart: Attendance (X) vs Average Score (Y)
    if (scatterCanvasRef.current) {
      const existingScatter = Chart.getChart(scatterCanvasRef.current);
      if (existingScatter) existingScatter.destroy();

      const ctx = scatterCanvasRef.current.getContext('2d');
      if (ctx) {
        // Partition data points into High, Average, Needs Attention
        const highPoints = students
          .filter((s) => s.Performance_Level === 'High Performer')
          .map((s) => ({ x: s.Attendance, y: s.Average_Score, student: s }));

        const avgPoints = students
          .filter((s) => s.Performance_Level === 'Average')
          .map((s) => ({ x: s.Attendance, y: s.Average_Score, student: s }));

        const attentionPoints = students
          .filter((s) => s.Performance_Level === 'Needs Attention')
          .map((s) => ({ x: s.Attendance, y: s.Average_Score, student: s }));

        scatterChartRef.current = new Chart(ctx, {
          type: 'scatter',
          data: {
            datasets: [
              {
                label: 'High Performers',
                data: highPoints,
                backgroundColor: 'rgba(16, 185, 129, 0.75)',
                borderColor: '#10B981',
                borderWidth: 1.5,
                pointRadius: 5,
                pointHoverRadius: 8,
              },
              {
                label: 'Average Performers',
                data: avgPoints,
                backgroundColor: 'rgba(56, 189, 248, 0.75)',
                borderColor: '#00E5FF',
                borderWidth: 1.5,
                pointRadius: 5,
                pointHoverRadius: 8,
              },
              {
                label: 'Needs Attention',
                data: attentionPoints,
                backgroundColor: 'rgba(244, 63, 94, 0.8)',
                borderColor: '#F43F5E',
                borderWidth: 1.5,
                pointRadius: 5.5,
                pointHoverRadius: 9,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: { duration: 750, easing: 'easeOutQuart' },
            onClick: (_event, elements) => {
              if (elements.length > 0 && onSelectStudent) {
                const element = elements[0];
                const datasetIndex = element.datasetIndex;
                const index = element.index;
                const dataset = scatterChartRef.current?.data.datasets[datasetIndex];
                const point = dataset?.data[index] as { student?: StudentRecord };
                if (point && point.student) {
                  onSelectStudent(point.student);
                }
              }
            },
            plugins: {
              legend: {
                position: 'top',
                labels: {
                  color: '#94A3B8',
                  font: { family: 'Plus Jakarta Sans', size: 11 },
                  usePointStyle: true,
                  boxWidth: 8,
                },
              },
              tooltip: {
                backgroundColor: 'rgba(9, 15, 32, 0.95)',
                titleColor: '#E2E8F0',
                bodyColor: '#38BDF8',
                borderColor: 'rgba(56, 189, 248, 0.3)',
                borderWidth: 1,
                padding: 12,
                cornerRadius: 12,
                callbacks: {
                  title: (items) => {
                    const raw = items[0].raw as { student?: StudentRecord };
                    return raw.student ? `${raw.student.Student_ID} (${raw.student.Class})` : 'Student';
                  },
                  label: (context) => {
                    const parsed = context.parsed;
                    return `Attendance: ${parsed.x}%  ·  Average Score: ${parsed.y}%`;
                  },
                },
              },
            },
            scales: {
              x: {
                min: 40,
                max: 100,
                title: {
                  display: true,
                  text: 'Attendance Rate (%)',
                  color: '#64748B',
                  font: { family: 'JetBrains Mono', size: 11 },
                },
                grid: { color: 'rgba(30, 41, 59, 0.4)' },
                ticks: { color: '#64748B', font: { family: 'JetBrains Mono', size: 11 } },
              },
              y: {
                min: 40,
                max: 100,
                title: {
                  display: true,
                  text: 'Academic Average Score (%)',
                  color: '#64748B',
                  font: { family: 'JetBrains Mono', size: 11 },
                },
                grid: { color: 'rgba(30, 41, 59, 0.4)' },
                ticks: { color: '#64748B', font: { family: 'JetBrains Mono', size: 11 } },
              },
            },
          },
        });
      }
    }

    // 2. Doughnut Chart: Attendance Distribution
    if (doughnutCanvasRef.current) {
      const existingDoughnut = Chart.getChart(doughnutCanvasRef.current);
      if (existingDoughnut) existingDoughnut.destroy();

      const ctx = doughnutCanvasRef.current.getContext('2d');
      if (ctx) {
        doughnutChartRef.current = new Chart(ctx, {
          type: 'doughnut',
          data: {
            labels: ['Optimal (≥90%)', 'Nominal (80-89%)', 'Fair (70-79%)', 'Chronic (<70%)'],
            datasets: [
              {
                data: [bucketHigh, bucketMod, bucketFair, bucketLow],
                backgroundColor: [
                  '#10B981',
                  '#00E5FF',
                  '#F59E0B',
                  '#F43F5E',
                ],
                borderWidth: 0,
                hoverOffset: 6,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '72%',
            plugins: {
              legend: {
                position: 'bottom',
                labels: {
                  color: '#94A3B8',
                  font: { family: 'Plus Jakarta Sans', size: 11 },
                  usePointStyle: true,
                  boxWidth: 8,
                },
              },
              tooltip: {
                backgroundColor: 'rgba(9, 15, 32, 0.95)',
                titleColor: '#E2E8F0',
                bodyColor: '#00E5FF',
                borderColor: 'rgba(0, 229, 255, 0.4)',
                borderWidth: 1,
              },
            },
          },
        });
      }
    }

    return () => {
      if (scatterCanvasRef.current) {
        const s = Chart.getChart(scatterCanvasRef.current);
        if (s) s.destroy();
      }
      if (doughnutCanvasRef.current) {
        const d = Chart.getChart(doughnutCanvasRef.current);
        if (d) d.destroy();
      }
      scatterChartRef.current = null;
      doughnutChartRef.current = null;
    };
  }, [students]);

  const avgAttendance = Number(
    (students.reduce((acc, s) => acc + s.Attendance, 0) / n).toFixed(1)
  );

  return (
    <div className="space-y-6">
      {/* Correlation Intelligence Banner */}
      <div className="glass-card p-5 rounded-2xl border border-[#00E5FF]/30 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/20 flex-shrink-0">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white font-sans">
                Attendance-to-Score Bivariate Correlation
              </h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30">
                r = {correlation.r > 0 ? `+${correlation.r}` : correlation.r}
              </span>
            </div>
            <p className="text-xs text-[#94A3B8] font-sans leading-relaxed max-w-3xl">
              {correlation.insight}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="text-right">
            <span className="text-[10px] font-mono text-[#64748B] block uppercase tracking-wider">
              Cohort Mean
            </span>
            <span className="text-lg font-bold font-mono text-white tabular-nums">
              {avgAttendance}%
            </span>
          </div>
          <div className="w-10 h-10 rounded-full border-2 border-[#10B981] flex items-center justify-center font-mono text-xs font-bold text-[#10B981]">
            ✓
          </div>
        </div>
      </div>

      {/* Grid: Scatter Plot + Doughnut Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Scatter Plot */}
        <div className="lg:col-span-8 glass-card p-5 rounded-2xl border border-[#1E293B] space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white font-sans flex items-center gap-2">
                <CalendarCheck className="w-4 h-4 text-[#00E5FF]" />
                <span>Attendance vs Academic Score Scatter Matrix</span>
              </h3>
              <p className="text-xs text-[#94A3B8] font-sans">
                Individual student coordinate mapping · Click any dot to inspect record
              </p>
            </div>
          </div>

          <div className="relative w-full h-[320px]">
            <canvas ref={scatterCanvasRef} />
          </div>
        </div>

        {/* Doughnut Distribution */}
        <div className="lg:col-span-4 glass-card p-5 rounded-2xl border border-[#1E293B] space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white font-sans flex items-center gap-2">
              <PieChart className="w-4 h-4 text-[#38BDF8]" />
              <span>Attendance Tier Distribution</span>
            </h3>
            <p className="text-xs text-[#94A3B8] font-sans">
              Cohort volume by attendance bracket
            </p>
          </div>

          <div className="relative w-full h-[220px] flex items-center justify-center">
            <canvas ref={doughnutCanvasRef} />
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-8">
              <span className="text-2xl font-bold font-mono text-white">{n}</span>
              <span className="text-[10px] text-[#64748B] font-mono">STUDENTS</span>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-[#1E293B]/60 text-xs">
            <div className="flex justify-between text-[#94A3B8]">
              <span className="flex items-center gap-1.5 text-white">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
                Optimal (&gt;90%)
              </span>
              <span className="font-mono text-white">{bucketHigh} ({Math.round((bucketHigh / n) * 100)}%)</span>
            </div>
            <div className="flex justify-between text-[#94A3B8]">
              <span className="flex items-center gap-1.5 text-white">
                <AlertCircle className="w-3.5 h-3.5 text-[#F43F5E]" />
                Chronic &lt;70%
              </span>
              <span className="font-mono text-[#F43F5E]">{bucketLow} ({Math.round((bucketLow / n) * 100)}%)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
