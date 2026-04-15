import type { University } from "@/types";
import type { CourseRecord, EnglishTestType } from "@/lib/eligibility";

export interface ScoringInput {
  gpa: number;
  completedCredits: number;
  inProgressCredits: number;
  courses: CourseRecord[];
  englishTestType: EnglishTestType;
  englishTestScore: number;
  toeflIsLegacy: boolean;
  completedEnglishComp1: boolean;
  completedEnglishComp2: boolean;
}

export interface CategoryScore {
  label: string;
  score: number;
  max: number;
  details: string[];
  shortfall?: string;
}

export type Verdict = "apply" | "conditional" | "difficult";

export interface ScoreResult {
  universityId: string;
  universityName: string;
  majorName: string;
  totalScore: number;
  verdict: Verdict;
  verdictLabel: string;
  verdictColor: "green" | "orange" | "red";
  categories: {
    courses: CategoryScore;
    gpa: CategoryScore;
    recommended: CategoryScore;
    english: CategoryScore;
    credits: CategoryScore;
  };
  missingRequired: string[];
  suggestions: string[];
}

function scoreCourses(university: University, courses: CourseRecord[]): CategoryScore {
  const required = university.requiredCourses;
  if (required.length === 0) {
    return {
      label: "필수 과목",
      score: 45,
      max: 45,
      details: ["필수 과목 없음 (만점)"],
    };
  }

  const missing: string[] = [];
  let totalWeight = 0;

  for (const req of required) {
    const record = courses.find((c) => c.id === req.id);
    if (!record || record.status === "not-taken") {
      missing.push(req.name);
      totalWeight += 0;
    } else if (record.status === "completed") {
      totalWeight += 1.0;
    } else if (record.status === "in-progress") {
      if (university.acceptInProgress) {
        totalWeight += 0.6;
      } else {
        missing.push(`${req.name} (진행 중 — 완료 필요)`);
        totalWeight += 0;
      }
    }
  }

  const ratio = totalWeight / required.length;
  const score = Math.round(45 * ratio);

  const details: string[] = [];
  const completed = required.filter((r) => {
    const rec = courses.find((c) => c.id === r.id);
    return rec?.status === "completed";
  }).length;
  const inProgress = required.filter((r) => {
    const rec = courses.find((c) => c.id === r.id);
    return rec?.status === "in-progress";
  }).length;

  details.push(`${completed}/${required.length}개 완료`);
  if (inProgress > 0) details.push(`${inProgress}개 수강 중`);
  if (missing.length > 0) details.push(`${missing.length}개 미이수`);

  return {
    label: "필수 과목",
    score,
    max: 45,
    details,
    shortfall: missing.length > 0 ? missing.join(", ") : undefined,
  };
}

function scoreGPA(university: University, rawGpa: number): CategoryScore {
  const gpa = Number(rawGpa) || 0;
  const min = university.minGPA;
  const diff = gpa - min;

  let score: number;
  let detail: string;

  if (gpa === 0) {
    score = 0;
    detail = "GPA 미입력";
  } else if (diff >= 0.5) {
    score = 30;
    detail = `GPA ${gpa.toFixed(2)} — 기준 초과 +${diff.toFixed(2)} (최고 구간)`;
  } else if (diff >= 0.2) {
    score = 25;
    detail = `GPA ${gpa.toFixed(2)} — 기준 초과 +${diff.toFixed(2)}`;
  } else if (diff >= 0) {
    score = 18;
    detail = `GPA ${gpa.toFixed(2)} — 기준(${min}) 충족`;
  } else if (diff >= -0.2) {
    score = 8;
    detail = `GPA ${gpa.toFixed(2)} — 기준(${min})보다 ${Math.abs(diff).toFixed(2)} 낮음`;
  } else {
    score = 0;
    detail = `GPA ${gpa.toFixed(2)} — 기준(${min})보다 ${Math.abs(diff).toFixed(2)} 낮음 (미충족)`;
  }

  const shortfall =
    diff < 0 && gpa > 0
      ? `GPA를 최소 ${Math.abs(diff).toFixed(2)} 올려야 기준(${min}) 충족`
      : undefined;

  return { label: "GPA", score, max: 30, details: [detail], shortfall };
}

function scoreRecommended(university: University, courses: CourseRecord[]): CategoryScore {
  const recommended = university.recommendedCourses ?? [];

  if (recommended.length === 0) {
    return {
      label: "권장 과목",
      score: 10,
      max: 10,
      details: ["권장 과목 없음 (만점)"],
    };
  }

  const completed = recommended.filter((r) => {
    const rec = courses.find((c) => c.id === r.id);
    return rec?.status === "completed";
  }).length;

  const score = Math.round((completed / recommended.length) * 10);

  return {
    label: "권장 과목",
    score,
    max: 10,
    details: [`${completed}/${recommended.length}개 이수`],
    shortfall:
      completed < recommended.length
        ? `권장 과목 ${recommended.length - completed}개 추가 이수 시 점수 상승`
        : undefined,
  };
}

function scoreEnglish(
  university: University,
  testType: EnglishTestType,
  testScore: number,
  toeflIsLegacy: boolean,
  comp1: boolean,
  comp2: boolean
): CategoryScore {
  if (university.noEnglishRequirement) {
    return {
      label: "영어 성적",
      score: 10,
      max: 10,
      details: ["영어 시험 불필요 (만점)"],
    };
  }

  const req = university.englishRequirement;

  if (req.singleCompWaiver && comp1) {
    return { label: "영어 성적", score: 10, max: 10, details: ["영작문 I 이수로 면제 (만점)"] };
  }
  if (req.compositionWaiver && comp1 && comp2) {
    return { label: "영어 성적", score: 10, max: 10, details: ["영작문 I·II 이수로 면제 (만점)"] };
  }
  if (req.compositionWaiver && comp1 && !comp2) {
    return { label: "영어 성적", score: 6, max: 10, details: ["영작문 II 미이수 — 조건부 면제"], shortfall: "영작문 II 이수 시 만점" };
  }

  if (testType === "Duolingo" && req.duolingoAccepted === false) {
    return { label: "영어 성적", score: 0, max: 10, details: ["Duolingo 미인정"], shortfall: "TOEFL 또는 IELTS 필요" };
  }

  if (testType === "TOEFL") {
    if (toeflIsLegacy && req.toeflLegacy) {
      if (testScore >= req.toeflLegacy.min) {
        return { label: "영어 성적", score: 10, max: 10, details: [`TOEFL ${testScore} (구기준 ${req.toeflLegacy.min}+ 충족)`] };
      }
      return {
        label: "영어 성적",
        score: 0,
        max: 10,
        details: [`TOEFL ${testScore} — 구기준 ${req.toeflLegacy.min} 미충족`],
        shortfall: `TOEFL ${req.toeflLegacy.min}+ 필요 (구기준)`,
      };
    }
    if (testScore >= req.toefl.min) {
      return { label: "영어 성적", score: 10, max: 10, details: [`TOEFL ${testScore} (신기준 ${req.toefl.min}+ 충족)`] };
    }
    return {
      label: "영어 성적",
      score: 0,
      max: 10,
      details: [`TOEFL ${testScore} — ${req.toefl.min} 미충족`],
      shortfall: `TOEFL ${req.toefl.min}+ 필요`,
    };
  }

  if (testType === "IELTS") {
    if (testScore >= req.ielts.min) {
      return { label: "영어 성적", score: 10, max: 10, details: [`IELTS ${testScore} (${req.ielts.min}+ 충족)`] };
    }
    return {
      label: "영어 성적",
      score: 0,
      max: 10,
      details: [`IELTS ${testScore} — ${req.ielts.min} 미충족`],
      shortfall: `IELTS ${req.ielts.min}+ 필요`,
    };
  }

  if (testType === "Duolingo") {
    if (testScore >= req.duolingo.min) {
      return { label: "영어 성적", score: 10, max: 10, details: [`Duolingo ${testScore} (${req.duolingo.min}+ 충족)`] };
    }
    return {
      label: "영어 성적",
      score: 0,
      max: 10,
      details: [`Duolingo ${testScore} — ${req.duolingo.min} 미충족`],
      shortfall: `Duolingo ${req.duolingo.min}+ 필요`,
    };
  }

  return {
    label: "영어 성적",
    score: 0,
    max: 10,
    details: ["영어 성적 미입력"],
    shortfall: req.note ?? "영어 시험 성적 제출 필요",
  };
}

function scoreCredits(university: University, completedCredits: number, inProgressCredits: number): CategoryScore {
  const effectiveWithInProgress = completedCredits + inProgressCredits;
  const min = university.minCompletedCredits;

  if (completedCredits >= min) {
    return { label: "취득 학점", score: 5, max: 5, details: [`${completedCredits}학점 이수 (기준 ${min}학점 충족)`] };
  }
  if (university.acceptInProgress && effectiveWithInProgress >= min) {
    return {
      label: "취득 학점",
      score: 3,
      max: 5,
      details: [`${completedCredits}학점 완료 + ${inProgressCredits}학점 진행 중 = ${effectiveWithInProgress}학점`],
      shortfall: `완료 학점 ${min - completedCredits}학점 부족 (진행 중 포함 시 충족)`,
    };
  }
  const shortage = min - (university.acceptInProgress ? effectiveWithInProgress : completedCredits);
  return {
    label: "취득 학점",
    score: 0,
    max: 5,
    details: [`${completedCredits}학점 이수 — 기준 ${min}학점 미달`],
    shortfall: `${shortage}학점 추가 필요`,
  };
}

function getVerdict(score: number): { verdict: Verdict; label: string; color: "green" | "orange" | "red" } {
  if (score >= 75) return { verdict: "apply", label: "지원 가능", color: "green" };
  if (score >= 50) return { verdict: "conditional", label: "조건부 가능", color: "orange" };
  return { verdict: "difficult", label: "현재 어려움", color: "red" };
}

function buildSuggestions(
  categories: ScoreResult["categories"],
  gpa: number,
  minGPA: number
): string[] {
  const suggestions: string[] = [];

  if (categories.courses.shortfall) {
    suggestions.push(`필수 과목 이수 완료: ${categories.courses.shortfall}`);
  }
  if (categories.gpa.score < 25 && gpa > 0) {
    const needed = minGPA - gpa;
    if (needed > 0) {
      suggestions.push(`GPA를 최소 ${minGPA}까지 올리면 GPA 점수 +10점`);
    } else {
      suggestions.push(`GPA를 0.3 이상 높이면 추가 점수 획득 가능`);
    }
  }
  if (categories.gpa.score === 0 && gpa === 0) {
    suggestions.push("GPA를 입력하면 더 정확한 점수를 계산할 수 있어요");
  }
  if (categories.recommended.shortfall) {
    suggestions.push(categories.recommended.shortfall);
  }
  if (categories.english.shortfall) {
    suggestions.push(`영어 성적: ${categories.english.shortfall}`);
  }
  if (categories.credits.shortfall) {
    suggestions.push(`학점: ${categories.credits.shortfall}`);
  }

  return suggestions.slice(0, 4);
}

export function calculateScore(university: University, input: ScoringInput): ScoreResult {
  const courses = scoreCourses(university, input.courses);
  const gpa = scoreGPA(university, input.gpa);
  const recommended = scoreRecommended(university, input.courses);
  const english = scoreEnglish(
    university,
    input.englishTestType,
    input.englishTestScore,
    input.toeflIsLegacy,
    input.completedEnglishComp1,
    input.completedEnglishComp2
  );
  const credits = scoreCredits(university, input.completedCredits, input.inProgressCredits);

  const categories = { courses, gpa, recommended, english, credits };

  const totalScore = Math.min(
    100,
    courses.score + gpa.score + recommended.score + english.score + credits.score
  );

  const missingRequired: string[] = [];
  for (const req of university.requiredCourses) {
    const record = input.courses.find((c) => c.id === req.id);
    if (!record || record.status === "not-taken") {
      missingRequired.push(req.name);
    } else if (record.status === "in-progress" && !university.acceptInProgress) {
      missingRequired.push(`${req.name} (완료 후 지원 가능)`);
    }
  }

  const suggestions = buildSuggestions(categories, input.gpa, university.minGPA);

  const { verdict, label: verdictLabel, color: verdictColor } = getVerdict(totalScore);

  return {
    universityId: university.id,
    universityName: university.name,
    majorName: university.major,
    totalScore,
    verdict,
    verdictLabel,
    verdictColor,
    categories,
    missingRequired,
    suggestions,
  };
}

export function calculateAllScores(universities: University[], input: ScoringInput): ScoreResult[] {
  return universities.map((u) => calculateScore(u, input));
}
