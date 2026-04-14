export interface EnglishTestThreshold {
  min: number;
  note?: string;
}

export interface ToeflLegacyThreshold {
  min: number;
  subscoreMin: number;
  note?: string;
}

export interface EnglishRequirement {
  toefl: EnglishTestThreshold;
  toeflLegacy?: ToeflLegacyThreshold;
  ielts: EnglishTestThreshold;
  duolingo: EnglishTestThreshold;
  compositionWaiver: boolean;
  note: string;
}

export interface RequiredCourse {
  id: string;
  name: string;
  description: string;
}

export interface University {
  id: string;
  name: string;
  major: string;
  location: string;
  website: string;
  sourceUrl?: string;
  minCompletedCredits: number;
  acceptInProgress: boolean;
  minGPA: number;
  noEnglishRequirement: boolean;
  englishRequirement: EnglishRequirement;
  requiredCourses: RequiredCourse[];
  notes: string;
}

export interface GtMajor {
  id: string;
  name: string;
  requiredCourseIds: string[];
  note?: string;
}

export interface GtCollege {
  name: string;
  majors: GtMajor[];
}

export interface GtMajorsData {
  base: Omit<University, "major" | "requiredCourses">;
  colleges: GtCollege[];
}

export interface UiucMajor {
  id: string;
  name: string;
  requiredCourseIds: string[];
  sourceUrl?: string;
}

export interface UiucCollege {
  name: string;
  majors: UiucMajor[];
}

export interface UiucMajorsData {
  base: Omit<University, "major" | "requiredCourses">;
  colleges: UiucCollege[];
}
