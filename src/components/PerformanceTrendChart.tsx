import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import { StudentRecord } from '../types/student';
import { TrendingUp, Award, Layers } from 'lucide-react';

interface PerformanceTrendChartProps {
  students: StudentRecord[];
}

export const PerformanceTrendChart: React.FC<PerformanceTrendChartProps> = ({ students }) => {
  const chartCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstanceRef = useRef<Chart | null>(null);
  const [metricView, setMetricView] = useState<'overall' | 'math' | 'science' | 'cs'>('overall');

  // Compute term averages based on active students
  const termLabels = ['Term 1 (Sept)', 'Term 2 (Nov)', 'Term 3 (Jan)', 'Midterm (Mar)', 'Final Exam (June)'];

  const n = Math.max(1, students.length);

  const avgTerm1 = students.reduce((acc, s) => acc + s.termScores.term1, 0) / n;
  const avgTerm2 = students.reduce((acc, s) => acc + s.termScores.term2, 0) / n;
  const avgTerm3 = students.reduce((acc, s) => acc + s.termScores.term3, 0) / n;
  const avgMid = students.reduce((acc, s) => acc + s.termScores.midterm, 0) / n;
  const avgFin = students.reduce((acc, s) => acc + s.termScores.final, 0) / n;

  // Upper quartile / 90th percentile top line
  const sortedOverall = [...students].sort((a, b) => b.Average_Score - a.Average_Score);
  const top10Index = Math.floor(n * 0.1);
  const topPerformer = sortedOverall[top10Index] || sortedOverall[0];

  const topTerm1 = topPerformer ? topPerformer.termScores.term1 : 92;
  const topTerm2 = topPerformer ? topPerformer.termScores.term2 : 94;
  const topTerm3 = topPerformer ? topPerformer.termScores.term3 : 95;
  const topMid = topPerformer ? topPerformer.termScores.midterm : 96;
  const topFin = topPerformer ? topPerformer.termScores.final : 98;

  useEffect(() => {
    const canvas = chartCanvasRef.current;
    if (!canvas) return;

    const existingChart = Chart.getChart(canvas);
    if (existingChart) {
      existingChart.destroy();
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Glowing gradient fill for cohort average
    const gradient = ctx.createLinearGradient(0, 0, 0, 320);
    gradient.addColorStop(0, 'rgba(0, 229, 255, 0.35)');
    gradient.addColorStop(0.5, 'rgba(0, 229, 255, 0.08)');
    gradient.addColorStop(1, 'rgba(0, 229, 255, 0.0)');

    // Top benchmark gradient
    const topGrad = ctx.createLinearGradient(0, 0, 0, 320);
    topGrad.addColorStop(0, 'rgba(168, 85, 247, 0.25)');
    topGrad.addColorStop(1, 'rgba(168, 85, 247, 0.0)');

    chartInstanceRef.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: termLabels,
        datasets: [
          {
            label: 'Top Decile Benchmark',
            data: [
              Number(topTerm1.toFixed(1)),
              Number(topTerm2.toFixed(1)),
              Number(topTerm3.toFixed(1)),
              Number(topMid.toFixed(1)),
              Number(topFin.toFixed(1)),
            ],
            borderColor: '#A855F7',
            backgroundColor: topGrad,
            borderWidth: 2,
            borderDash: [5, 5],
            tension: 0.38,
            fill: false,
            pointBackgroundColor: '#A855F7',
            pointBorderColor: '#070C1A',
            pointBorderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 7,
            pointHoverBackgroundColor: '#C084FC',
          },
          {
            label: 'Cohort Average Score',
            data: [
              Number(avgTerm1.toFixed(1)),
              Number(avgTerm2.toFixed(1)),
              Number(avgTerm3.toFixed(1)),
              Number(avgMid.toFixed(1)),
              Number(avgFin.toFixed(1)),
            ],
            borderColor: '#00E5FF',
            backgroundColor: gradient,
            borderWidth: 3.5,
            tension: 0.4,
            fill: true,
            pointBackgroundColor: '#00E5FF',
            pointBorderColor: '#070C1A',
            pointBorderWidth: 2.5,
            pointRadius: 5,
            pointHoverRadius: 9,
            pointHoverBackgroundColor: '#FFFFFF',
            pointHoverBorderColor: '#00E5FF',
            pointHoverBorderWidth: 3,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false,
        },
        animation: {
          duration: 900,
          easing: 'easeOutQuart',
        },
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            backgroundColor: 'rgba(9, 15, 32, 0.95)',
            titleColor: '#E2E8F0',
            bodyColor: '#38BDF8',
            borderColor: 'rgba(56, 189, 248, 0.3)',
            borderWidth: 1,
            padding: 12,
            cornerRadius: 12,
            titleFont: { family: 'Plus Jakarta Sans', size: 12, weight: 'bold' },
            bodyFont: { family: 'JetBrains Mono', size: 12 },
            displayColors: true,
            boxPadding: 4,
            callbacks: {
              label: (context) => {
                return ` ${context.dataset.label}: ${context.parsed.y}%`;
              },
            },
          },
        },
        scales: {
          x: {
            grid: {
              color: 'rgba(30, 41, 59, 0.4)',
            },
            ticks: {
              color: '#64748B',
              font: { family: 'JetBrains Mono', size: 11 },
            },
          },
          y: {
            min: 50,
            max: 100,
            grid: {
              color: 'rgba(30, 41, 59, 0.4)',
            },
            ticks: {
              color: '#64748B',
              font: { family: 'JetBrains Mono', size: 11 },
              callback: (val) => `${val}%`,
            },
          },
        },
      },
    });

    return () => {
      const existing = Chart.getChart(canvas);
      if (existing) {
        existing.destroy();
      }
      chartInstanceRef.current = null;
    };
  }, [students, metricView]);

  const deltaTotal = Number((avgFin - avgTerm1).toFixed(1));

  return (
    <div className="glass-card p-5 rounded-2xl border border-[#1E293B] space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#00E5FF]" />
            <h3 className="text-sm font-bold text-white font-sans">
              Performance Trajectory & Term Progress
            </h3>
          </div>
          <p className="text-xs text-[#94A3B8] font-sans">
            Tracking longitudinal progress from Term 1 baseline through Final Assessment
          </p>
        </div>

        {/* Legend / Status badges */}
        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-1 bg-[#00E5FF] rounded-full shadow-[0_0_6px_#00E5FF]" />
            <span className="text-[#E2E8F0]">Cohort Average ({Number(avgFin.toFixed(1))}%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-1 border-t-2 border-dashed border-[#A855F7]" />
            <span className="text-[#C084FC]">Top Decile ({Number(topFin.toFixed(1))}%)</span>
          </div>
          <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/30">
            <span>Progress: {deltaTotal >= 0 ? `+${deltaTotal}%` : `${deltaTotal}%`}</span>
          </div>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="relative w-full h-[280px] sm:h-[320px]">
        <canvas ref={chartCanvasRef} />
      </div>

      {/* Metric Breakdown Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-3 border-t border-[#1E293B]/70 text-center">
        {termLabels.map((lbl, idx) => {
          const val = [avgTerm1, avgTerm2, avgTerm3, avgMid, avgFin][idx];
          return (
            <div key={lbl} className="p-2 rounded-xl bg-[#090F20]/60 border border-[#1E293B]">
              <span className="text-[10px] text-[#64748B] block truncate font-mono">
                {lbl.split(' ')[0]}
              </span>
              <span className="text-sm font-bold font-mono text-white tabular-nums">
                {Number(val.toFixed(1))}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
