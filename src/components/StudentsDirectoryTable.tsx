import React, { useState } from 'react';
import { StudentRecord } from '../types/student';
import { Download, ChevronLeft, ChevronRight, ArrowUpDown } from 'lucide-react';

interface StudentsDirectoryTableProps {
  students: StudentRecord[];
  onSelectStudent: (s: StudentRecord) => void;
}

export const StudentsDirectoryTable: React.FC<StudentsDirectoryTableProps> = ({
  students,
  onSelectStudent,
}) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize] = useState<number>(12);
  const [sortField, setSortField] = useState<keyof StudentRecord>('Average_Score');
  const [sortAsc, setSortAsc] = useState<boolean>(false);

  const handleSort = (field: keyof StudentRecord) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  const sortedStudents = [...students].sort((a, b) => {
    const valA = a[sortField];
    const valB = b[sortField];
    if (typeof valA === 'number' && typeof valB === 'number') {
      return sortAsc ? valA - valB : valB - valA;
    }
    return sortAsc
      ? String(valA).localeCompare(String(valB))
      : String(valB).localeCompare(String(valA));
  });

  const totalPages = Math.max(1, Math.ceil(sortedStudents.length / pageSize));
  const paginatedStudents = sortedStudents.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleExportCSV = () => {
    const headers = [
      'Student_ID',
      'Gender',
      'Class',
      'Academic_Year',
      'Attendance_%',
      'Mathematics',
      'Science',
      'English',
      'Computer_Science',
      'Total_Score',
      'Average_Score',
      'Performance_Level',
      'Pass_Status',
    ];

    const rows = sortedStudents.map((s) => [
      s.Student_ID,
      s.Gender,
      s.Class,
      s.Academic_Year,
      s.Attendance,
      s.Mathematics,
      s.Science,
      s.English,
      s.Computer_Science,
      s.Total_Score,
      s.Average_Score,
      s.Performance_Level,
      s.Pass_Status,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `student_performance_dataset_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="glass-card p-5 rounded-2xl border border-[#1E293B] space-y-4">
      {/* Table Header Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-white font-sans">
            Student Cohort Master Directory
          </h3>
          <p className="text-xs text-[#94A3B8] font-sans">
            Showing {sortedStudents.length} records · Click any row to inspect deep dive telemetry
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-[#0F172A] hover:bg-[#1E293B] border border-[#334155] text-[#38BDF8] rounded-xl transition-colors shadow-sm"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export CSV Dataset</span>
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-[#1E293B]/70">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-[#090F20] border-b border-[#1E293B] text-[#64748B] font-mono text-[10px] uppercase tracking-wider">
              <th
                onClick={() => handleSort('Student_ID')}
                className="py-3 px-3.5 cursor-pointer hover:text-white"
              >
                <div className="flex items-center gap-1">
                  <span>Student ID</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-3 px-3">Class</th>
              <th className="py-3 px-3">Gender</th>
              <th
                onClick={() => handleSort('Attendance')}
                className="py-3 px-3 cursor-pointer hover:text-white"
              >
                <div className="flex items-center gap-1">
                  <span>Attendance</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-3 px-3">Math</th>
              <th className="py-3 px-3">Sci</th>
              <th className="py-3 px-3">Eng</th>
              <th className="py-3 px-3">CS</th>
              <th
                onClick={() => handleSort('Average_Score')}
                className="py-3 px-3 cursor-pointer hover:text-white"
              >
                <div className="flex items-center gap-1">
                  <span>Average</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-3 px-3">Performance Tier</th>
              <th className="py-3 px-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1E293B]/50 font-mono">
            {paginatedStudents.length === 0 ? (
              <tr>
                <td colSpan={11} className="py-8 text-center text-[#64748B]">
                  No matching student records found.
                </td>
              </tr>
            ) : (
              paginatedStudents.map((s) => (
                <tr
                  key={s.Student_ID}
                  onClick={() => onSelectStudent(s)}
                  className="hover:bg-[#00E5FF]/5 transition-colors cursor-pointer group"
                >
                  <td className="py-2.5 px-3.5 font-bold text-white group-hover:text-[#00E5FF]">
                    {s.Student_ID}
                  </td>
                  <td className="py-2.5 px-3 text-[#94A3B8]">{s.Class}</td>
                  <td className="py-2.5 px-3 text-[#64748B]">{s.Gender}</td>
                  <td className="py-2.5 px-3">
                    <span
                      className={`font-semibold tabular-nums ${
                        s.Attendance >= 85
                          ? 'text-[#10B981]'
                          : s.Attendance >= 75
                          ? 'text-[#F59E0B]'
                          : 'text-[#F43F5E]'
                      }`}
                    >
                      {s.Attendance}%
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-[#CBD5E1] tabular-nums">{s.Mathematics}</td>
                  <td className="py-2.5 px-3 text-[#CBD5E1] tabular-nums">{s.Science}</td>
                  <td className="py-2.5 px-3 text-[#CBD5E1] tabular-nums">{s.English}</td>
                  <td className="py-2.5 px-3 text-[#CBD5E1] tabular-nums">{s.Computer_Science}</td>
                  <td className="py-2.5 px-3 font-bold text-white tabular-nums">
                    {s.Average_Score}%
                  </td>
                  <td className="py-2.5 px-3">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-sans font-semibold ${
                        s.Performance_Level === 'High Performer'
                          ? 'bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30'
                          : s.Performance_Level === 'Average'
                          ? 'bg-[#38BDF8]/15 text-[#38BDF8] border border-[#38BDF8]/30'
                          : 'bg-[#F43F5E]/15 text-[#F43F5E] border border-[#F43F5E]/30'
                      }`}
                    >
                      {s.Performance_Level}
                    </span>
                  </td>
                  <td className="py-2.5 px-3">
                    <span
                      className={`text-[10px] font-mono ${
                        s.Pass_Status === 'Passed' ? 'text-[#10B981]' : 'text-[#F43F5E]'
                      }`}
                    >
                      {s.Pass_Status === 'Passed' ? '✓ Passed' : '⚠ At-Risk'}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex items-center justify-between pt-2 text-xs">
        <span className="text-[#64748B] font-mono">
          Page {currentPage} of {totalPages} ({sortedStudents.length} total records)
        </span>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-1.5 rounded-lg bg-[#0F172A] border border-[#1E293B] text-[#94A3B8] hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-1.5 rounded-lg bg-[#0F172A] border border-[#1E293B] text-[#94A3B8] hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
