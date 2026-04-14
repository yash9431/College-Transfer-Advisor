export interface EnglishTestThreshold {
  min: number;
}

export interface EnglishRequirement {
  toefl: EnglishTestThreshold;
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
  minCompletedCredits: number;
  acceptInProgress: boolean;
  minGPA: number;
  englishRequirement: EnglishRequirement;
  requiredCourses: RequiredCourse[];
  notes: string;
}
