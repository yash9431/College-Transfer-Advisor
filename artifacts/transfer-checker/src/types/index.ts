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
  duolingoAccepted?: boolean;
  compositionWaiver: boolean;
  singleCompWaiver?: boolean;
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
  recommendedCourses?: RequiredCourse[];
  notes: string;
}

export interface GtMajor {
  id: string;
  name: string;
  requiredCourseIds: string[];
  recommendedCourseIds?: string[];
  note?: string;
}

export interface GtCollege {
  name: string;
  majors: GtMajor[];
}

export interface GtMajorsData {
  base: Omit<University, "major" | "requiredCourses" | "recommendedCourses">;
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
  base: Omit<University, "major" | "requiredCourses" | "recommendedCourses">;
  colleges: UiucCollege[];
}

export interface PurdueMajor {
  id: string;
  name: string;
  requiredCourseIds: string[];
  note?: string;
  sourceUrl?: string;
}

export interface PurdueCollege {
  name: string;
  majors: PurdueMajor[];
}

export interface PurdueMajorsData {
  base: Omit<University, "major" | "requiredCourses" | "recommendedCourses">;
  colleges: PurdueCollege[];
}

export interface UtAustinMajor {
  id: string;
  name: string;
  requiredCourseIds: string[];
  note?: string;
  sourceUrl?: string;
}

export interface UtAustinCollege {
  name: string;
  majors: UtAustinMajor[];
}

export interface UtAustinMajorsData {
  base: Omit<University, "major" | "requiredCourses" | "recommendedCourses">;
  colleges: UtAustinCollege[];
}

export interface UWMadisonMajor {
  id: string;
  name: string;
  requiredCourseIds: string[];
  note?: string;
  sourceUrl?: string;
}

export interface UWMadisonCollege {
  name: string;
  majors: UWMadisonMajor[];
}

export interface UWMadisonMajorsData {
  base: Omit<University, "major" | "requiredCourses" | "recommendedCourses">;
  colleges: UWMadisonCollege[];
}
