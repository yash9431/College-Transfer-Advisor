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
