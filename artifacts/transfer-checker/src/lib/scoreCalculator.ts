import type { University } from "@/types";
import type { CourseRecord, EnglishTestType } from "@/lib/eligibility";
import type { Lang } from "@/lib/i18n";

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

const S = {
  catCourses: { ko: "필수 과목", en: "Required Courses" },
  catGpa: { ko: "GPA", en: "GPA" },
  catRecommended: { ko: "권장 과목", en: "Recommended" },
  catEnglish: { ko: "영어 성적", en: "English" },
  catCredits: { ko: "취득 학점", en: "Credits" },
  verdictApply: { ko: "지원 가능", en: "Likely" },
  verdictConditional: { ko: "조건부 가능", en: "Possible" },
  verdictDifficult: { ko: "현재 어려움", en: "Difficult" },
};

function s(key: keyof typeof S, lang: Lang): string {
  return S[key][lang];
}

function scoreCourses(university: University, courses: CourseRecord[], lang: Lang): CategoryScore {
  const required = university.requiredCourses;
  if (required.length === 0) {
    return {
      label: s("catCourses", lang),
      score: 45,
      max: 45,
      details: [lang === "ko" ? "필수 과목 없음 (만점)" : "No required courses (full score)"],
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
        missing.push(
          lang === "ko"
            ? `${req.name} (진행 중 — 완료 필요)`
            : `${req.name} (in progress — must be completed)`
        );
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

  if (lang === "ko") {
    details.push(`${completed}/${required.length}개 완료`);
    if (inProgress > 0) details.push(`${inProgress}개 수강 중`);
    if (missing.length > 0) details.push(`${missing.length}개 미이수`);
  } else {
    details.push(`${completed}/${required.length} completed`);
    if (inProgress > 0) details.push(`${inProgress} in progress`);
    if (missing.length > 0) details.push(`${missing.length} not taken`);
  }

  return {
    label: s("catCourses", lang),
    score,
    max: 45,
    details,
    shortfall: missing.length > 0 ? missing.join(", ") : undefined,
  };
}

function scoreGPA(university: University, rawGpa: number, lang: Lang): CategoryScore {
  const gpa = Number(rawGpa) || 0;
  const min = university.minGPA;
  const diff = gpa - min;

  let score: number;
  let detail: string;

  if (gpa === 0) {
    score = 0;
    detail = lang === "ko" ? "GPA 미입력" : "GPA not entered";
  } else if (diff >= 0.5) {
    score = 30;
    detail =
      lang === "ko"
        ? `GPA ${gpa.toFixed(2)} — 기준 초과 +${diff.toFixed(2)} (최고 구간)`
        : `GPA ${gpa.toFixed(2)} — exceeds minimum by +${diff.toFixed(2)} (top tier)`;
  } else if (diff >= 0.2) {
    score = 25;
    detail =
      lang === "ko"
        ? `GPA ${gpa.toFixed(2)} — 기준 초과 +${diff.toFixed(2)}`
        : `GPA ${gpa.toFixed(2)} — exceeds minimum by +${diff.toFixed(2)}`;
  } else if (diff >= 0) {
    score = 18;
    detail =
      lang === "ko"
        ? `GPA ${gpa.toFixed(2)} — 기준(${min}) 충족`
        : `GPA ${gpa.toFixed(2)} — meets minimum (${min})`;
  } else if (diff >= -0.2) {
    score = 8;
    detail =
      lang === "ko"
        ? `GPA ${gpa.toFixed(2)} — 기준(${min})보다 ${Math.abs(diff).toFixed(2)} 낮음`
        : `GPA ${gpa.toFixed(2)} — ${Math.abs(diff).toFixed(2)} below minimum (${min})`;
  } else {
    score = 0;
    detail =
      lang === "ko"
        ? `GPA ${gpa.toFixed(2)} — 기준(${min})보다 ${Math.abs(diff).toFixed(2)} 낮음 (미충족)`
        : `GPA ${gpa.toFixed(2)} — ${Math.abs(diff).toFixed(2)} below minimum (${min}) — not met`;
  }

  const shortfall =
    diff < 0 && gpa > 0
      ? lang === "ko"
        ? `GPA를 최소 ${Math.abs(diff).toFixed(2)} 올려야 기준(${min}) 충족`
        : `Raise GPA by at least ${Math.abs(diff).toFixed(2)} to meet minimum (${min})`
      : undefined;

  return { label: s("catGpa", lang), score, max: 30, details: [detail], shortfall };
}

function scoreRecommended(university: University, courses: CourseRecord[], lang: Lang): CategoryScore {
  const recommended = university.recommendedCourses ?? [];

  if (recommended.length === 0) {
    return {
      label: s("catRecommended", lang),
      score: 10,
      max: 10,
      details: [lang === "ko" ? "권장 과목 없음 (만점)" : "No recommended courses (full score)"],
    };
  }

  const completed = recommended.filter((r) => {
    const rec = courses.find((c) => c.id === r.id);
    return rec?.status === "completed";
  }).length;

  const score = Math.round((completed / recommended.length) * 10);

  return {
    label: s("catRecommended", lang),
    score,
    max: 10,
    details: [
      lang === "ko"
        ? `${completed}/${recommended.length}개 이수`
        : `${completed}/${recommended.length} completed`,
    ],
    shortfall:
      completed < recommended.length
        ? lang === "ko"
          ? `권장 과목 ${recommended.length - completed}개 추가 이수 시 점수 상승`
          : `Complete ${recommended.length - completed} more recommended course(s) to raise score`
        : undefined,
  };
}

function scoreEnglish(
  university: University,
  testType: EnglishTestType,
  testScore: number,
  toeflIsLegacy: boolean,
  comp1: boolean,
  comp2: boolean,
  lang: Lang
): CategoryScore {
  const label = s("catEnglish", lang);

  if (university.noEnglishRequirement) {
    return {
      label,
      score: 10,
      max: 10,
      details: [lang === "ko" ? "영어 시험 불필요 (만점)" : "No English test required (full score)"],
    };
  }

  const req = university.englishRequirement;

  if (req.singleCompWaiver && comp1) {
    return { label, score: 10, max: 10, details: [lang === "ko" ? "영작문 I 이수로 면제 (만점)" : "Waived by Composition I (full score)"] };
  }
  if (req.compositionWaiver && comp1 && comp2) {
    return { label, score: 10, max: 10, details: [lang === "ko" ? "영작문 I·II 이수로 면제 (만점)" : "Waived by Composition I & II (full score)"] };
  }
  if (req.compositionWaiver && comp1 && !comp2) {
    return {
      label,
      score: 6,
      max: 10,
      details: [lang === "ko" ? "영작문 II 미이수 — 조건부 면제" : "Missing Composition II — partial waiver"],
      shortfall: lang === "ko" ? "영작문 II 이수 시 만점" : "Complete Composition II for full score",
    };
  }

  if (testType === "Duolingo" && req.duolingoAccepted === false) {
    return {
      label,
      score: 0,
      max: 10,
      details: [lang === "ko" ? "Duolingo 미인정" : "Duolingo not accepted"],
      shortfall: lang === "ko" ? "TOEFL 또는 IELTS 필요" : "TOEFL or IELTS required",
    };
  }

  if (testType === "TOEFL") {
    if (toeflIsLegacy && req.toeflLegacy) {
      if (testScore >= req.toeflLegacy.min) {
        return { label, score: 10, max: 10, details: [`TOEFL ${testScore} (${lang === "ko" ? "구기준" : "old scale"} ${req.toeflLegacy.min}+ ✓)`] };
      }
      return {
        label,
        score: 0,
        max: 10,
        details: [`TOEFL ${testScore} — ${lang === "ko" ? "구기준" : "old scale"} ${req.toeflLegacy.min} ${lang === "ko" ? "미충족" : "not met"}`],
        shortfall: `TOEFL ${req.toeflLegacy.min}+ ${lang === "ko" ? "필요 (구기준)" : "required (old scale)"}`,
      };
    }
    if (testScore >= req.toefl.min) {
      return { label, score: 10, max: 10, details: [`TOEFL ${testScore} (${lang === "ko" ? "신기준" : "new scale"} ${req.toefl.min}+ ✓)`] };
    }
    return {
      label,
      score: 0,
      max: 10,
      details: [`TOEFL ${testScore} — ${req.toefl.min} ${lang === "ko" ? "미충족" : "not met"}`],
      shortfall: `TOEFL ${req.toefl.min}+ ${lang === "ko" ? "필요" : "required"}`,
    };
  }

  if (testType === "IELTS") {
    if (testScore >= req.ielts.min) {
      return { label, score: 10, max: 10, details: [`IELTS ${testScore} (${req.ielts.min}+ ✓)`] };
    }
    return {
      label,
      score: 0,
      max: 10,
      details: [`IELTS ${testScore} — ${req.ielts.min} ${lang === "ko" ? "미충족" : "not met"}`],
      shortfall: `IELTS ${req.ielts.min}+ ${lang === "ko" ? "필요" : "required"}`,
    };
  }

  if (testType === "Duolingo") {
    if (testScore >= req.duolingo.min) {
      return { label, score: 10, max: 10, details: [`Duolingo ${testScore} (${req.duolingo.min}+ ✓)`] };
    }
    return {
      label,
      score: 0,
      max: 10,
      details: [`Duolingo ${testScore} — ${req.duolingo.min} ${lang === "ko" ? "미충족" : "not met"}`],
      shortfall: `Duolingo ${req.duolingo.min}+ ${lang === "ko" ? "필요" : "required"}`,
    };
  }

  return {
    label,
    score: 0,
    max: 10,
    details: [lang === "ko" ? "영어 성적 미입력" : "No English score entered"],
    shortfall: req.note ?? (lang === "ko" ? "영어 시험 성적 제출 필요" : "English proficiency test required"),
  };
}

function scoreCredits(university: University, completedCredits: number, inProgressCredits: number, lang: Lang): CategoryScore {
  const label = s("catCredits", lang);
  const effectiveWithInProgress = completedCredits + inProgressCredits;
  const min = university.minCompletedCredits;

  if (completedCredits >= min) {
    return {
      label,
      score: 5,
      max: 5,
      details: [
        lang === "ko"
          ? `${completedCredits}학점 이수 (기준 ${min}학점 충족)`
          : `${completedCredits} credits completed (minimum ${min} met)`,
      ],
    };
  }
  if (university.acceptInProgress && effectiveWithInProgress >= min) {
    return {
      label,
      score: 3,
      max: 5,
      details: [
        lang === "ko"
          ? `${completedCredits}학점 완료 + ${inProgressCredits}학점 진행 중 = ${effectiveWithInProgress}학점`
          : `${completedCredits} done + ${inProgressCredits} in-progress = ${effectiveWithInProgress} credits`,
      ],
      shortfall:
        lang === "ko"
          ? `완료 학점 ${min - completedCredits}학점 부족 (진행 중 포함 시 충족)`
          : `${min - completedCredits} more credits needed (met if in-progress counts)`,
    };
  }
  const shortage = min - (university.acceptInProgress ? effectiveWithInProgress : completedCredits);
  return {
    label,
    score: 0,
    max: 5,
    details: [
      lang === "ko"
        ? `${completedCredits}학점 이수 — 기준 ${min}학점 미달`
        : `${completedCredits} credits — below minimum ${min}`,
    ],
    shortfall:
      lang === "ko"
        ? `${shortage}학점 추가 필요`
        : `${shortage} more credits needed`,
  };
}

function getVerdict(score: number, lang: Lang): { verdict: Verdict; label: string; color: "green" | "orange" | "red" } {
  if (score >= 75) return { verdict: "apply", label: s("verdictApply", lang), color: "green" };
  if (score >= 50) return { verdict: "conditional", label: s("verdictConditional", lang), color: "orange" };
  return { verdict: "difficult", label: s("verdictDifficult", lang), color: "red" };
}

function buildSuggestions(
  categories: ScoreResult["categories"],
  gpa: number,
  minGPA: number,
  lang: Lang
): string[] {
  const suggestions: string[] = [];

  if (categories.courses.shortfall) {
    suggestions.push(
      lang === "ko"
        ? `필수 과목 이수 완료: ${categories.courses.shortfall}`
        : `Complete required courses: ${categories.courses.shortfall}`
    );
  }
  if (categories.gpa.score < 25 && gpa > 0) {
    const needed = minGPA - gpa;
    if (needed > 0) {
      suggestions.push(
        lang === "ko"
          ? `GPA를 최소 ${minGPA}까지 올리면 GPA 점수 향상`
          : `Raise GPA to at least ${minGPA} to improve GPA score`
      );
    } else {
      suggestions.push(
        lang === "ko"
          ? `GPA를 0.3 이상 높이면 추가 점수 획득 가능`
          : `Raising GPA by 0.3+ can earn additional points`
      );
    }
  }
  if (categories.gpa.score === 0 && gpa === 0) {
    suggestions.push(
      lang === "ko"
        ? "GPA를 입력하면 더 정확한 점수를 계산할 수 있어요"
        : "Enter your GPA for a more accurate score"
    );
  }
  if (categories.recommended.shortfall) {
    suggestions.push(categories.recommended.shortfall);
  }
  if (categories.english.shortfall) {
    suggestions.push(
      lang === "ko"
        ? `영어 성적: ${categories.english.shortfall}`
        : `English: ${categories.english.shortfall}`
    );
  }
  if (categories.credits.shortfall) {
    suggestions.push(
      lang === "ko"
        ? `학점: ${categories.credits.shortfall}`
        : `Credits: ${categories.credits.shortfall}`
    );
  }

  return suggestions.slice(0, 4);
}

export function calculateScore(university: University, input: ScoringInput, lang: Lang = "ko"): ScoreResult {
  const courses = scoreCourses(university, input.courses, lang);
  const gpa = scoreGPA(university, input.gpa, lang);
  const recommended = scoreRecommended(university, input.courses, lang);
  const english = scoreEnglish(
    university,
    input.englishTestType,
    input.englishTestScore,
    input.toeflIsLegacy,
    input.completedEnglishComp1,
    input.completedEnglishComp2,
    lang
  );
  const credits = scoreCredits(university, input.completedCredits, input.inProgressCredits, lang);

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
      missingRequired.push(
        lang === "ko"
          ? `${req.name} (완료 후 지원 가능)`
          : `${req.name} (must be completed before applying)`
      );
    }
  }

  const suggestions = buildSuggestions(categories, input.gpa, university.minGPA, lang);
  const { verdict, label: verdictLabel, color: verdictColor } = getVerdict(totalScore, lang);

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

export function calculateAllScores(universities: University[], input: ScoringInput, lang: Lang = "ko"): ScoreResult[] {
  return universities.map((u) => calculateScore(u, input, lang));
}
