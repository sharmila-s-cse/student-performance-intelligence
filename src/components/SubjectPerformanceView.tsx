import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import { StudentRecord } from '../types/student';
import { GraduationCap, BookOpen, Code, FlaskConical, Languages, Calculator } from 'lucide-react';

interface SubjectPerformanceViewProps {
  students: StudentRecord[];
}

export const SubjectPerformanceView: React.FC<SubjectPerformanceViewProps> = ({ students }) => {
  const barCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const barChartRef = useRef<Chart | null>(null);

  const radarCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const radarChartRef = useRef<Chart | null>(null);

  const n = Math.max(1, students.length);

  // Compute stats for 4 subjects
  const subjects = [
    {
      id: 'Mathematics',
      name: 'Mathematics',
      icon: Calculator,
      color: '#38BDF8',
      avg: Number((students.reduce((acc, s) => acc + s.Mathematics, 0) / n).toFixed(1)),
      passed: students.filter((s) => s.Mathematics >= 50).length,
      gradeA: students.filter((s) => s.Mathematics >= 85).length,
      gradeB: students.filter((s) => s.Mathematics >= 70 && s.Mathematics < 85).length,
      gradeC: students.filter((s) => s.Mathematics >= 55 && s.Mathematics < 70).length,
      gradeD: students.filter((s) => s.Mathematics < 55).length,
    },
    {
      id: 'Science',
      name: 'Science',
      icon: FlaskConical,
      color: '#10B981',
      avg: Number((students.reduce((acc, s) => acc + s.Science, 0) / n).toFixed(1)),
      passed: students.filter((s) => s.Science >= 50).length,
      gradeA: students.filter((s) => s.Science >= 85).length,
      gradeB: students.filter((s) => s.Science >= 70 && s.Science < 85).length,
      gradeC: students.filter((s) => s.Science >= 55 && s.Science < 70).length,
      gradeD: students.filter((s) => s.Science < 55).length,
    },
    {
      id: 'English',
      name: 'English',
      icon: Languages,
      color: '#F59E0B',
      avg: Number((students.reduce((acc, s) => acc + s.English, 0) / n).toFixed(1)),
      passed: students.filter((s) => s.English >= 50).length,
      gradeA: students.filter((s) => s.English >= 85).length,
      gradeB: students.filter((s) => s.English >= 70 && s.English < 85).length,
      gradeC: students.filter((s) => s.English >= 55 && s.English < 70).length,
      gradeD: students.filter((s) => s.English < 55).length,
    },
    {
      id: 'Computer_Science',
      name: 'Computer Science',
      icon: Code,
      color: '#A855F7',
      avg: Number((students.reduce((acc, s) => acc + s.Computer_Science, 0) / n).toFixed(1)),
      passed: students.filter((s) => s.Computer_Science >= 50).length,
      gradeA: students.filter((s) => s.Computer_Science >= 85).length,
      gradeB: students.filter((s) => s.Computer_Science >= 70 && s.Computer_Science < 85).length,
      gradeC: students.filter((s) => s.Computer_Science >= 55 && s.Computer_Science < 70).length,
      gradeD: students.filter((s) => s.Computer_Science < 55).length,
    },
  ];

  // Render Bar & Radar Charts
  useEffect(() => {
    // 1. Stacked Grade Distribution Chart
    if (barCanvasRef.current) {
      const existingBar = Chart.getChart(barCanvasRef.current);
      if (existingBar) existingBar.destroy();

      const ctx = barCanvasRef.current.getContext('2d');
      if (ctx) {
        barChartRef.current = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: subjects.map((s) => s.name),
            datasets: [
              {
                label: 'High (≥85%)',
                data: subjects.map((s) => s.gradeA),
                backgroundColor: 'rgba(16, 185, 129, 0.75)',
                borderColor: '#10B981',
                borderWidth: 1,
                borderRadius: 4,
              },
              {
                label: 'Proficient (70-84%)',
                data: subjects.map((s) => s.gradeB),
                backgroundColor: 'rgba(56, 189, 248, 0.75)',
                borderColor: '#38BDF8',
                borderWidth: 1,
                borderRadius: 4,
              },
              {
                label: 'Developing (55-69%)',
                data: subjects.map((s) => s.gradeC),
                backgroundColor: 'rgba(245, 158, 11, 0.75)',
                borderColor: '#F59E0B',
                borderWidth: 1,
                borderRadius: 4,
              },
              {
                label: 'At-Risk (<55%)',
                data: subjects.map((s) => s.gradeD),
                backgroundColor: 'rgba(244, 63, 94, 0.75)',
                borderColor: '#F43F5E',
                borderWidth: 1,
                borderRadius: 4,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: { duration: 800, easing: 'easeOutQuart' },
            plugins: {
              legend: {
                position: 'top',
                labels: {
                  color: '#94A3B8',
                  font: { family: 'Plus Jakarta Sans', size: 11 },
                  boxWidth: 12,
                },
              },
              tooltip: {
                backgroundColor: 'rgba(9, 15, 32, 0.95)',
                titleColor: '#E2E8F0',
                bodyColor: '#38BDF8',
                borderColor: 'rgba(56, 189, 248, 0.3)',
                borderWidth: 1,
                padding: 10,
                cornerRadius: 10,
              },
            },
            scales: {
              x: {
                stacked: true,
                grid: { color: 'rgba(30, 41, 59, 0.4)' },
                ticks: { color: '#E2E8F0', font: { family: 'Plus Jakarta Sans', size: 11, weight: 'bold' } },
              },
              y: {
                stacked: true,
                grid: { color: 'rgba(30, 41, 59, 0.4)' },
                ticks: { color: '#64748B', font: { family: 'JetBrains Mono', size: 11 } },
              },
            },
          },
        });
      }
    }

    // 2. Subject Radar Chart
    if (radarCanvasRef.current) {
      const existingRadar = Chart.getChart(radarCanvasRef.current);
      if (existingRadar) existingRadar.destroy();

      const ctx = radarCanvasRef.current.getContext('2d');
      if (ctx) {
        radarChartRef.current = new Chart(ctx, {
          type: 'radar',
          data: {
            labels: ['Mathematics', 'Science', 'English', 'Computer Science'],
            datasets: [
              {
                label: 'Cohort Average Score',
                data: subjects.map((s) => s.avg),
                backgroundColor: 'rgba(0, 229, 255, 0.25)',
                borderColor: '#00E5FF',
                borderWidth: 2.5,
                pointBackgroundColor: '#00E5FF',
                pointBorderColor: '#FFFFFF',
                pointHoverRadius: 6,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: { duration: 900, easing: 'easeOutBack' },
            plugins: {
              legend: { display: false },
              tooltip: {
                backgroundColor: 'rgba(9, 15, 32, 0.95)',
                titleColor: '#E2E8F0',
                bodyColor: '#00E5FF',
                borderColor: 'rgba(0, 229, 255, 0.4)',
                borderWidth: 1,
              },
            },
            scales: {
              r: {
                min: 40,
                max: 100,
                angleLines: { color: 'rgba(56, 189, 248, 0.2)' },
                grid: { color: 'rgba(30, 41, 59, 0.6)' },
                pointLabels: {
                  color: '#E2E8F0',
                  font: { family: 'Plus Jakarta Sans', size: 11, weight: 'bold' },
                },
                ticks: {
                  display: false,
                  stepSize: 20,
                },
              },
            },
          },
        });
      }
    }

    return () => {
      if (barCanvasRef.current) {
        const b = Chart.getChart(barCanvasRef.current);
        if (b) b.destroy();
      }
      if (radarCanvasRef.current) {
        const r = Chart.getChart(radarCanvasRef.current);
        if (r) r.destroy();
      }
      barChartRef.current = null;
      radarChartRef.current = null;
    };
  }, [students]);

  return (
    <div className="space-y-6">
      {/* 4 Subject Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {subjects.map((sub) => {
          const Icon = sub.icon;
          const passRate = Number(((sub.passed / n) * 100).toFixed(1));

          return (
            <div
              key={sub.id}
              className="glass-card glass-card-hover p-4 rounded-2xl border border-[#1E293B] relative overflow-hidden"
            >
              <div
                className="absolute top-0 left-0 right-0 h-[2px]"
                style={{ backgroundColor: sub.color }}
              />

              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-[#94A3B8]">{sub.name}</span>
                <div
                  className="p-1.5 rounded-lg"
                  style={{ backgroundColor: `${sub.color}20`, color: sub.color }}
                >
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <div className="flex items-baseline justify-between my-2">
                <span className="text-2xl font-bold font-mono text-white tabular-nums">
                  {sub.avg}%
                </span>
                <span className="text-xs font-mono text-[#10B981]">
                  {passRate}% Pass
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2 rounded-full bg-[#0F172A] overflow-hidden mt-3">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${sub.avg}%`,
                    backgroundColor: sub.color,
                    boxShadow: `0 0 10px ${sub.color}`,
                  }}
                />
              </div>

              <div className="flex justify-between text-[10px] font-mono text-[#64748B] mt-2">
                <span>Pass Status: {sub.passed} / {n}</span>
                <span>Cohort Mean</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Two Column Layout: Grade Distribution Bar Chart + Radar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Stacked Grade Distribution Chart */}
        <div className="lg:col-span-8 glass-card p-5 rounded-2xl border border-[#1E293B] space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white font-sans flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#38BDF8]" />
                <span>Subject Grade Distribution Tiers</span>
              </h3>
              <p className="text-xs text-[#94A3B8] font-sans">
                Stratified breakdown of cohort mastery across subject disciplines
              </p>
            </div>
          </div>

          <div className="relative w-full h-[280px]">
            <canvas ref={barCanvasRef} />
          </div>
        </div>

        {/* Radar Strength Profile */}
        <div className="lg:col-span-4 glass-card p-5 rounded-2xl border border-[#1E293B] space-y-3 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white font-sans flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-[#00E5FF]" />
              <span>Competency Radar</span>
            </h3>
            <p className="text-xs text-[#94A3B8] font-sans">
              Inter-subject balance polygon
            </p>
          </div>

          <div className="relative w-full h-[230px] flex items-center justify-center">
            <canvas ref={radarCanvasRef} />
          </div>

          <div className="p-3 rounded-xl bg-[#090F20] border border-[#1E293B] text-[11px] text-[#94A3B8] leading-relaxed">
            <span className="text-[#00E5FF] font-semibold">Diagnosis: </span>
            Computer Science & English exhibit the highest cohort mastery, while Mathematics warrants foundational reinforcement in Term 2.
          </div>
        </div>
      </div>
    </div>
  );
};
