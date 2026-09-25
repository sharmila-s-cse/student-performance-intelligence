export type Gender = 'Female' | 'Male' | 'Non-Binary';

export type StudentClass =
  | 'Class 10-A'
  | 'Class 10-B'
  | 'Class 11-A'
  | 'Class 11-B'
  | 'Class 12-A'
  | 'Class 12-B';

export type AcademicYear = '2025-2026' | '2024-2025' | '2023-2024';

export type PerformanceLevel = 'High Performer' | 'Average' | 'Needs Attention';

export type PassStatus = 'Passed' | 'At-Risk';

export type SubjectName = 'Mathematics' | 'Science' | 'English' | 'Computer_Science';

export interface TermScores {
  term1: number;
  term2: number;
  term3: number;
  midterm: number;
  final: number;
}

export interface StudentRecord {
  Student_ID: string;
  Gender: Gender;
  Class: StudentClass;
  Academic_Year: AcademicYear;
  Attendance: number; // 0 - 100 percentage
  Mathematics: number; // 0 - 100
  Science: number; // 0 - 100
  English: number; // 0 - 100
  Computer_Science: number; // 0 - 100
  Total_Score: number; // sum of 4 subjects (0 - 400)
  Average_Score: number; // 0 - 100
  Performance_Level: PerformanceLevel;
  Pass_Status: PassStatus;
  termScores: TermScores;
  avatarSeed: number;
}

export interface CohortFilters {
  academicYear: string; // 'All' or specific year
  classGroup: string; // 'All' or specific class
  gender: string; // 'All' or specific gender
  subjectFocus: string; // 'All' or specific subject
  performanceLevel: string; // 'All' or specific level
  passStatus: string; // 'All' or specific status
  searchQuery: string;
  attendanceThreshold: string; // 'All' | 'High' | 'Moderate' | 'At-Risk'
}

export interface KPISummary {
  totalStudents: number;
  averageScore: number;
  passRate: number;
  averageAttendance: number;
  topPerformingSubject: {
    name: string;
    average: number;
  };
  studentsNeedingAttention: number;
  deltas: {
    totalStudents: number;
    averageScore: number;
    passRate: number;
    attendance: number;
  };
}
