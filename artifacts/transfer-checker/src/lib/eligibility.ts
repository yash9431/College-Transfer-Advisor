import type { University } from "@/types";

export type EnglishTestType = "TOEFL" | "IELTS" | "Duolingo" | "None";

export type CourseStatus = "completed" | "in-progress" | "not-taken";

export interface CourseRecord {
  id: string;
  status: CourseStatus;
}

export interface StudentProfile {
  completedCredits: number;
  inProgressCredits: number;
  englishTestType: EnglishTestType;
  englishTestScore: number;
  toeflIsLegacy: boolean;
  completedEnglishComp1: boolean;
  completedEnglishComp2: boolean;
  courses: CourseRecord[];
  intendedMajor: string;
}

export type EligibilityStatus = "Eligible" | "Conditionally Eligible" | "Not Eligible";

export interface CourseEligibilityResult {
  courseId: string;
  courseName: string;
  met: boolean;
  isInProgress: boolean;
  note?: string;
}

export interface EligibilityResult {
  universityId: string;
  universityName: string;
  major: string;
  status: EligibilityStatus;
  creditsMet: boolean;
  englishMet: boolean;
  courseResults: CourseEligibilityResult[];
  missingRequirements: string[];
  conditionalReasons: string[];
  explanation: string;
}

function checkEnglish(
  university: University,
  testType: EnglishTestType,
  score: number,
  toeflIsLegacy: boolean,
  comp1: boolean,
  comp2: boolean
): { met: boolean; isConditional: boolean; reason: string } {
  if (university.noEnglishRequirement) {
    return { met: true, isConditional: false, reason: "No English proficiency test required for transfer applicants." };
  }

  const req = university.englishRequirement;

  if (req.compositionWaiver && comp1 && comp2) {
    return { met: true, isConditional: false, reason: "English Composition 1 & 2 completed — English test waived." };
  }

  if (testType === "Duolingo" && req.duolingoAccepted === false) {
    return {
      met: false,
      isConditional: false,
      reason: `Duolingo is not accepted by ${university.name}. Only TOEFL iBT and IELTS Academic are accepted.`,
    };
  }

  if (testType === "TOEFL") {
    if (toeflIsLegacy && req.toeflLegacy) {
      const legacy = req.toeflLegacy;
      if (score >= legacy.min) {
        return {
          met: true,
          isConditional: false,
          reason: `TOEFL score of ${score} meets the legacy minimum of ${legacy.min} (exams before Jan 21, 2026). Note: all section scores must also be ${legacy.subscoreMin}+.`,
        };
      }
      return {
        met: false,
        isConditional: false,
        reason: `TOEFL score of ${score} does not meet the legacy minimum of ${legacy.min} (for exams before Jan 21, 2026). All section scores must also be ${legacy.subscoreMin}+.`,
      };
    }
    if (score >= req.toefl.min) {
      return {
        met: true,
        isConditional: false,
        reason: `TOEFL score of ${score} meets the minimum of ${req.toefl.min} (new scale, exams on/after Jan 21, 2026).`,
      };
    }
    return {
      met: false,
      isConditional: false,
      reason: `TOEFL score of ${score} does not meet the minimum of ${req.toefl.min} (new scale, exams on/after Jan 21, 2026).`,
    };
  }

  if (testType === "IELTS" && score >= req.ielts.min) {
    return { met: true, isConditional: false, reason: `IELTS score of ${score} meets the minimum of ${req.ielts.min}.` };
  }
  if (testType === "Duolingo" && score >= req.duolingo.min) {
    return { met: true, isConditional: false, reason: `Duolingo score of ${score} meets the minimum of ${req.duolingo.min}.` };
  }

  if (testType === "None" && req.compositionWaiver && comp1 && !comp2) {
    return {
      met: false,
      isConditional: true,
      reason: "English Composition 2 is still needed to waive the English test requirement.",
    };
  }

  if (testType === "None") {
    const toeflNote = req.toeflLegacy
      ? `TOEFL 5.0+ (new scale) or ${req.toeflLegacy.min}+ (old scale, all sections ${req.toeflLegacy.subscoreMin}+)`
      : `TOEFL ${req.toefl.min}+`;
    const duolingoNote = req.duolingoAccepted === false ? "" : `, or Duolingo ${req.duolingo.min}+`;
    const compNote = req.compositionWaiver ? " or completing English Composition 1 & 2" : "";
    return {
      met: false,
      isConditional: false,
      reason: `No English test provided. Required: ${toeflNote}, IELTS ${req.ielts.min}+${duolingoNote}${compNote}.`,
    };
  }

  const minScores: Record<string, number> = {
    IELTS: req.ielts.min,
    Duolingo: req.duolingo.min,
  };
  const min = minScores[testType];
  return {
    met: false,
    isConditional: false,
    reason: `${testType} score of ${score} does not meet the minimum of ${min}.`,
  };
}

function checkCourse(
  courseId: string,
  courseName: string,
  studentCourses: CourseRecord[],
  acceptInProgress: boolean
): CourseEligibilityResult {
  const record = studentCourses.find((c) => c.id === courseId);

  if (!record || record.status === "not-taken") {
    return {
      courseId,
      courseName,
      met: false,
      isInProgress: false,
      note: "Not completed or in progress.",
    };
  }

  if (record.status === "completed") {
    return {
      courseId,
      courseName,
      met: true,
      isInProgress: false,
      note: "Completed.",
    };
  }

  if (record.status === "in-progress") {
    if (acceptInProgress) {
      return {
        courseId,
        courseName,
        met: true,
        isInProgress: true,
        note: "Currently in progress — accepted conditionally.",
      };
    } else {
      return {
        courseId,
        courseName,
        met: false,
        isInProgress: true,
        note: "Currently in progress, but this university requires completion before applying.",
      };
    }
  }

  return { courseId, courseName, met: false, isInProgress: false };
}

export function evaluateEligibility(
  student: StudentProfile,
  university: University
): EligibilityResult {
  const missingRequirements: string[] = [];
  const conditionalReasons: string[] = [];

  const effectiveCredits = university.acceptInProgress
    ? student.completedCredits + student.inProgressCredits
    : student.completedCredits;
  const creditsMet = effectiveCredits >= university.minCompletedCredits;
  if (!creditsMet) {
    const creditsNote = university.acceptInProgress
      ? `${effectiveCredits} completed + in-progress`
      : `${student.completedCredits} completed`;
    missingRequirements.push(
      `Minimum ${university.minCompletedCredits} credits required (you have ${creditsNote}).`
    );
  }

  const englishCheck = checkEnglish(
    university,
    student.englishTestType,
    student.englishTestScore,
    student.toeflIsLegacy,
    student.completedEnglishComp1,
    student.completedEnglishComp2
  );
  if (!englishCheck.met) {
    if (englishCheck.isConditional) {
      conditionalReasons.push(englishCheck.reason);
    } else {
      missingRequirements.push(englishCheck.reason);
    }
  }

  const courseResults: CourseEligibilityResult[] = university.requiredCourses.map((course) => {
    return checkCourse(course.id, course.name, student.courses, university.acceptInProgress);
  });

  for (const result of courseResults) {
    if (!result.met) {
      missingRequirements.push(`${result.courseName}: ${result.note}`);
    } else if (result.isInProgress) {
      conditionalReasons.push(`${result.courseName} is in progress — must be completed before enrollment.`);
    }
  }

  let status: EligibilityStatus;
  let explanation: string;

  if (missingRequirements.length === 0 && conditionalReasons.length === 0) {
    status = "Eligible";
    explanation = `You meet all the transfer requirements for ${university.name}'s ${university.major} program. You may apply with confidence.`;
  } else if (missingRequirements.length === 0 && conditionalReasons.length > 0) {
    status = "Conditionally Eligible";
    explanation = `You meet the core requirements but have ${conditionalReasons.length} condition(s) that must be resolved before final admission. You may apply, but ensure conditions are met by the enrollment deadline.`;
  } else {
    status = "Not Eligible";
    explanation = `You do not yet meet all the requirements for ${university.name}'s ${university.major} program. You have ${missingRequirements.length} unmet requirement(s). Review the missing items and consider applying in a future semester.`;
  }

  return {
    universityId: university.id,
    universityName: university.name,
    major: university.major,
    status,
    creditsMet,
    englishMet: englishCheck.met,
    courseResults,
    missingRequirements,
    conditionalReasons,
    explanation,
  };
}

export function evaluateAll(student: StudentProfile, universities: University[]): EligibilityResult[] {
  return universities.map((u) => evaluateEligibility(student, u));
}
