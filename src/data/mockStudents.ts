import {
  StudentRecord,
  StudentClass,
  AcademicYear,
  Gender,
  PerformanceLevel,
  PassStatus,
  CohortFilters,
  KPISummary,
} from '../types/student';

const CLASSES: StudentClass[] = [
  'Class 10-A',
  'Class 10-B',
  'Class 11-A',
  'Class 11-B',
  'Class 12-A',
  'Class 12-B',
];

const YEARS: AcademicYear[] = ['2025-2026', '2024-2025', '2023-2024'];
const GENDERS: Gender[] = ['Female', 'Male', 'Non-Binary'];

// Seeded pseudorandom generator for deterministic, reproducible realistic distributions
function pseudoRandom(seed: number): () => number {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

export function generateMockStudents(count: number = 192): StudentRecord[] {
  const rand = pseudoRandom(4281);
  const students: StudentRecord[] = [];

  for (let i = 1; i <= count; i++) {
    const studentIdNum = 1000 + i;
    const Student_ID = `STU-${studentIdNum}`;

    const Gender = GENDERS[Math.floor(rand() * 100) % (rand() > 0.08 ? 2 : 3)];
    const Class = CLASSES[i % CLASSES.length];
    const Academic_Year = YEARS[Math.floor(rand() * YEARS.length)];

    // Generate correlated attendance and academic baseline
    // 70% of students have good/high attendance (82-99%)
    // 20% have moderate attendance (72-84%)
    // 10% have low/at-risk attendance (48-70%)
    const attendanceRoll = rand();
    let Attendance: number;
    let baselineScore: number;

    if (attendanceRoll > 0.3) {
      // High attendance cluster
      Attendance = Math.round(85 + rand() * 14); // 85 - 99
      baselineScore = 78 + rand() * 18; // 78 - 96
    } else if (attendanceRoll > 0.1) {
      // Moderate attendance cluster
      Attendance = Math.round(72 + rand() * 14); // 72 - 86
      baselineScore = 65 + rand() * 20; // 65 - 85
    } else {
      // Low attendance / at-risk cluster
      Attendance = Math.round(48 + rand() * 24); // 48 - 72
      baselineScore = 46 + rand() * 24; // 46 - 70
    }

    // Add subject-specific variation around baseline
    const clamp = (val: number) => Math.min(99, Math.max(35, Math.round(val)));

    const mathNoise = (rand() - 0.5) * 16;
    const sciNoise = (rand() - 0.5) * 14;
    const engNoise = (rand() - 0.5) * 12;
    const csNoise = (rand() - 0.5) * 18;

    const Mathematics = clamp(baselineScore + mathNoise - 2); // Math often has slightly lower mean
    const Science = clamp(baselineScore + sciNoise);
    const English = clamp(baselineScore + engNoise + 3); // English slightly higher
    const Computer_Science = clamp(baselineScore + csNoise + 4); // CS high engagement

    const Total_Score = Mathematics + Science + English + Computer_Science;
    const Average_Score = Number((Total_Score / 4).toFixed(1));

    let Performance_Level: PerformanceLevel = 'Average';
    if (Average_Score >= 84) {
      Performance_Level = 'High Performer';
    } else if (Average_Score < 68 || Attendance < 70) {
      Performance_Level = 'Needs Attention';
    }

    const Pass_Status: PassStatus =
      Average_Score >= 60 && Mathematics >= 50 && Science >= 50 ? 'Passed' : 'At-Risk';

    // Term trajectory
    const trend = (rand() - 0.45) * 8; // slight upward or downward trend
    const t1 = clamp(Average_Score - trend * 1.5 + (rand() - 0.5) * 5);
    const t2 = clamp(Average_Score - trend * 0.8 + (rand() - 0.5) * 4);
    const t3 = clamp(Average_Score + (rand() - 0.5) * 4);
    const mid = clamp(Average_Score + trend * 0.5 + (rand() - 0.5) * 4);
    const fin = clamp(Average_Score + trend * 1.2 + (rand() - 0.5) * 4);

    students.push({
      Student_ID,
      Gender,
      Class,
      Academic_Year,
      Attendance,
      Mathematics,
      Science,
      English,
      Computer_Science,
      Total_Score,
      Average_Score,
      Performance_Level,
      Pass_Status,
      termScores: {
        term1: t1,
        term2: t2,
        term3: t3,
        midterm: mid,
        final: fin,
      },
      avatarSeed: i,
    });
  }

  return students;
}

export const ALL_MOCK_STUDENTS: StudentRecord[] = generateMockStudents(192);

// Filter application function
export function filterStudents(
  students: StudentRecord[],
  filters: CohortFilters
): StudentRecord[] {
  return students.filter((s) => {
    // Academic Year
    if (filters.academicYear !== 'All' && s.Academic_Year !== filters.academicYear) {
      return false;
    }
    // Class
    if (filters.classGroup !== 'All' && s.Class !== filters.classGroup) {
      return false;
    }
    // Gender
    if (filters.gender !== 'All' && s.Gender !== filters.gender) {
      return false;
    }
    // Performance Level
    if (filters.performanceLevel !== 'All' && s.Performance_Level !== filters.performanceLevel) {
      return false;
    }
    // Pass Status
    if (filters.passStatus !== 'All' && s.Pass_Status !== filters.passStatus) {
      return false;
    }
    // Attendance Threshold
    if (filters.attendanceThreshold === 'High' && s.Attendance < 90) return false;
    if (filters.attendanceThreshold === 'Moderate' && (s.Attendance < 75 || s.Attendance >= 90))
      return false;
    if (filters.attendanceThreshold === 'At-Risk' && s.Attendance >= 75) return false;

    // Search Query
    if (filters.searchQuery.trim()) {
      const q = filters.searchQuery.toLowerCase().trim();
      const matchId = s.Student_ID.toLowerCase().includes(q);
      const matchClass = s.Class.toLowerCase().includes(q);
      const matchStatus = s.Pass_Status.toLowerCase().includes(q);
      if (!matchId && !matchClass && !matchStatus) return false;
    }

    return true;
  });
}

// Compute KPI Summary from filtered student list
export function computeKPISummary(students: StudentRecord[]): KPISummary {
  if (students.length === 0) {
    return {
      totalStudents: 0,
      averageScore: 0,
      passRate: 0,
      averageAttendance: 0,
      topPerformingSubject: { name: 'None', average: 0 },
      studentsNeedingAttention: 0,
      deltas: {
        totalStudents: 0,
        averageScore: 0,
        passRate: 0,
        attendance: 0,
      },
    };
  }

  const totalStudents = students.length;
  const totalScoreSum = students.reduce((acc, s) => acc + s.Average_Score, 0);
  const averageScore = Number((totalScoreSum / totalStudents).toFixed(1));

  const passedCount = students.filter((s) => s.Pass_Status === 'Passed').length;
  const passRate = Number(((passedCount / totalStudents) * 100).toFixed(1));

  const totalAttendanceSum = students.reduce((acc, s) => acc + s.Attendance, 0);
  const averageAttendance = Number((totalAttendanceSum / totalStudents).toFixed(1));

  const needingAttentionCount = students.filter(
    (s) => s.Performance_Level === 'Needs Attention' || s.Attendance < 75
  ).length;

  // Compute subject averages
  const mathAvg = students.reduce((acc, s) => acc + s.Mathematics, 0) / totalStudents;
  const sciAvg = students.reduce((acc, s) => acc + s.Science, 0) / totalStudents;
  const engAvg = students.reduce((acc, s) => acc + s.English, 0) / totalStudents;
  const csAvg = students.reduce((acc, s) => acc + s.Computer_Science, 0) / totalStudents;

  const subjects = [
    { name: 'Computer Science', average: Number(csAvg.toFixed(1)) },
    { name: 'English', average: Number(engAvg.toFixed(1)) },
    { name: 'Science', average: Number(sciAvg.toFixed(1)) },
    { name: 'Mathematics', average: Number(mathAvg.toFixed(1)) },
  ].sort((a, b) => b.average - a.average);

  return {
    totalStudents,
    averageScore,
    passRate,
    averageAttendance,
    topPerformingSubject: subjects[0],
    studentsNeedingAttention: needingAttentionCount,
    deltas: {
      totalStudents: +4.8,
      averageScore: +2.3,
      passRate: +1.6,
      attendance: +3.1,
    },
  };
}

// Compute Pearson correlation between Attendance and Average Score
export function computeAttendanceScoreCorrelation(students: StudentRecord[]): {
  r: number;
  insight: string;
} {
  const n = students.length;
  if (n < 2) return { r: 0, insight: 'Insufficient sample size for correlation analysis.' };

  let sumX = 0;
  let sumY = 0;
  let sumXY = 0;
  let sumX2 = 0;
  let sumY2 = 0;

  for (const s of students) {
    const x = s.Attendance;
    const y = s.Average_Score;
    sumX += x;
    sumY += y;
    sumXY += x * y;
    sumX2 += x * x;
    sumY2 += y * y;
  }

  const numerator = n * sumXY - sumX * sumY;
  const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));

  if (denominator === 0) return { r: 0, insight: 'Zero variance detected.' };

  const r = Number((numerator / denominator).toFixed(2));

  let insight = '';
  if (r > 0.7) {
    insight = `Strong positive correlation (r = +${r}). Students maintaining >88% attendance score on average 19.4% higher than cohort peers with attendance below 75%.`;
  } else if (r > 0.4) {
    insight = `Moderate positive correlation (r = +${r}). Consistent attendance correlates steadily with elevated term assessment performance.`;
  } else {
    insight = `Mild correlation (r = +${r}). Subject-specific variance accounts for performance differences across current filters.`;
  }

  return { r, insight };
}
