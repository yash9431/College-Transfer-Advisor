import { useState, useCallback } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import gtMajorsData from "@/data/gt-majors.json";
import uiucMajorsData from "@/data/uiuc-majors.json";
import purdueMajorsData from "@/data/purdue-majors.json";
import utaustinMajorsData from "@/data/utaustin-majors.json";
import uwmadisonMajorsData from "@/data/uwmadison-majors.json";
import type { University, GtMajorsData, UiucMajorsData, PurdueMajorsData, UtAustinMajorsData, UWMadisonMajorsData } from "@/types";
import { TransferForm } from "@/components/TransferForm";
import type { FormValues } from "@/components/TransferForm";
import { ResultsPanel } from "@/components/ResultsPanel";
import { ScorePanel } from "@/components/ScorePanel";
import { evaluateAll } from "@/lib/eligibility";
import type { StudentProfile, EligibilityResult, CourseRecord } from "@/lib/eligibility";
import type { ScoringInput } from "@/lib/scoreCalculator";

const gtData = gtMajorsData as unknown as GtMajorsData;
const uiucData = uiucMajorsData as unknown as UiucMajorsData;
const purdueData = purdueMajorsData as unknown as PurdueMajorsData;
const utaustinData = utaustinMajorsData as unknown as UtAustinMajorsData;
const uwmadisonData = uwmadisonMajorsData as unknown as UWMadisonMajorsData;

const COURSE_NAMES: Record<string, string> = {
  calc1: "Calculus I",
  calc2: "Calculus II",
  calc3: "Calculus III / Multivariable Calculus",
  diffEq: "Differential Equations",
  linAlg: "Linear Algebra",
  discreteStructures: "Discrete Structures",
  physics1: "Physics I Lecture (Calculus-based)",
  physics1Lab: "Physics I Lab (Calculus-based)",
  physics2: "Physics II Lecture (Calculus-based)",
  physics2Lab: "Physics II Lab (Calculus-based)",
  chem1: "General Chemistry I Lecture",
  chem1Lab: "General Chemistry I Lab",
  chem2: "General Chemistry II Lecture",
  chem2Lab: "General Chemistry II Lab",
  orgChem: "Organic Chemistry I",
  bio1: "Biology I + Lab",
  bio2: "Biology II + Lab",
  molecularBio: "Molecular & Cellular Biology",
  compSci1: "Computer Science I (Intro Programming)",
  compSci2: "Computer Science II",
  computing: "Computing / Programming",
  ece110: "Introduction to Electronics (ECE 110)",
  ece120: "Introduction to Computing for ECE (ECE 120)",
  statics: "Engineering Statics (Mechanics of Rigid Bodies)",
  engrGraphics: "Engineering Problem Solving (ENGR 13100)",
  engrDesign: "Engineering Projects & Design (ENGR 13200)",
  labSciElective: "Lab Science Elective",
  advancedScience: "Advanced Math / Science Elective",
  englishComp: "English Composition or Speech",
};

const COURSE_DESCRIPTIONS_GT: Record<string, string> = {
  calc1: "Required for all GT majors. Equivalent to MATH 1551 at Georgia Tech.",
  calc2: "Equivalent to MATH 1552 at Georgia Tech.",
  calc3: "Equivalent to MATH 2551 at Georgia Tech.",
  diffEq: "Equivalent to MATH 2552 at Georgia Tech.",
  linAlg: "Equivalent to MATH 1554 at Georgia Tech.",
  physics1: "Lecture component. Equivalent to PHYS 2211 at Georgia Tech.",
  physics1Lab: "Lab component — required separately by GT. Equivalent to PHYS 2211L (or lab section of PHYS 2211) at Georgia Tech.",
  physics2: "Equivalent to PHYS 2212 at Georgia Tech. Must include lecture and lab.",
  chem1: "Lecture component. Equivalent to CHEM 1211 at Georgia Tech.",
  chem1Lab: "Lab component — required separately by GT. Equivalent to CHEM 1211L (or lab section of CHEM 1211K) at Georgia Tech.",
  chem2: "Lecture component. Equivalent to CHEM 1212 at Georgia Tech.",
  chem2Lab: "Lab component — required separately by GT for ChBE, Biochemistry, and Chemistry majors. Equivalent to CHEM 1212L at Georgia Tech.",
  bio1: "Equivalent to BIOL 1510 at Georgia Tech.",
  bio2: "Equivalent to BIOL 1520 at Georgia Tech.",
  compSci1: "Equivalent to CS 1301 at Georgia Tech.",
  compSci2: "Equivalent to CS 1331 at Georgia Tech.",
  labSciElective: "Any one lab science course (biology, chemistry, calculus-based physics, earth & atmospheric, or environmental sciences). Must include lecture and lab.",
};

const COURSE_DESCRIPTIONS_GT_REC: Record<string, string> = {
  calc3: "[Recommended] Equivalent to MATH 2551 (Multivariable Calculus) at Georgia Tech. Competitive engineering applicants typically complete Calc III.",
  linAlg: "[Recommended] Equivalent to MATH 1554 (Linear Algebra) at Georgia Tech. Competitive engineering applicants typically complete Linear Algebra.",
  diffEq: "[Recommended] Equivalent to MATH 2552 (Differential Equations) at Georgia Tech. Competitive engineering applicants typically complete Differential Equations.",
  physics2: "[Recommended] Equivalent to PHYS 2212 at Georgia Tech. Strongly recommended for competitive applicants in most engineering programs.",
  compSci1: "[Recommended] Equivalent to CS 1301 (Computing for Engineers) at Georgia Tech. Not required but strongly recommended for competitive engineering applicants.",
};

const COURSE_DESCRIPTIONS_UIUC: Record<string, string> = {
  calc1: "Required for all UIUC majors. Equivalent to MATH 220 at UIUC.",
  calc2: "Equivalent to MATH 231 at UIUC.",
  calc3: "Equivalent to MATH 241 at UIUC.",
  diffEq: "Equivalent to MATH 285 at UIUC.",
  linAlg: "Equivalent to MATH 257 (Linear Algebra with Computational Applications) at UIUC.",
  discreteStructures: "Equivalent to CS 173 (Discrete Structures) at UIUC.",
  physics1: "Equivalent to PHYS 211 at UIUC.",
  physics2: "Equivalent to PHYS 212 at UIUC.",
  chem1: "Equivalent to CHEM 102 + CHEM 103 at UIUC.",
  chem2: "Equivalent to CHEM 104 + CHEM 105 at UIUC.",
  molecularBio: "Equivalent to MCB 150 (Molecular & Cellular Basis of Life) at UIUC.",
  compSci1: "Equivalent to CS 124 at UIUC.",
  compSci2: "Equivalent to CS 128 at UIUC.",
  computing: "Equivalent to CS 101, CS 124, SE 101, or ME 170 at UIUC.",
  ece110: "Equivalent to ECE 110 (Introduction to Electronics) at UIUC.",
  ece120: "Equivalent to ECE 120 (Introduction to Computing) at UIUC.",
};

const COURSE_DESCRIPTIONS_PURDUE: Record<string, string> = {
  calc1: "Required for all Purdue engineering majors. Must be completed (not in-progress) at time of application. Equivalent to MA 16100 or MA 16500 at Purdue.",
  calc2: "Required for all Purdue engineering majors. Must be completed (not in-progress) at time of application. Equivalent to MA 16200 or MA 16600 at Purdue.",
  chem1: "Calculus-based Chemistry I. Must be completed (not in-progress) at time of application. Equivalent to CHM 11510/11520/11530 at Purdue. Not required for Computer or Electrical Engineering (another math/physics course may substitute).",
  chem2: "Chemistry II required as the Advanced Science course for Chemical Engineering and Environmental & Ecological Engineering. Equivalent to CHM 11610/11620/11630 at Purdue.",
  physics1: "Calculus-based Physics I. Must be completed (not in-progress) at time of application. Equivalent to PHYS 17200 at Purdue.",
  engrGraphics: "Required ONLY for Interdisciplinary Engineering (IDES). Equivalent to ENGR 13100 (Transforming Ideas to Innovations I) at Purdue. All other majors: recommended but not required.",
  engrDesign: "Required ONLY for Interdisciplinary Engineering (IDES). Equivalent to ENGR 13200 (Transforming Ideas to Innovations II) at Purdue. All other majors: recommended but not required.",
  advancedScience: "One advanced course in math (Calc III or higher), chemistry (beyond Chem I), or physics (beyond Physics I). Must be completed (not in-progress) at time of application. Some programs require a specific course — see major notes.",
};

const COURSE_DESCRIPTIONS_UTAUSTIN: Record<string, string> = {
  calc1: "Required for all UT Austin Cockrell majors. Equivalent to M 408C or M 408K at UT Austin.",
  calc2: "Equivalent to M 408L or M 408S at UT Austin.",
  calc3: "Equivalent to M 408M or M 408D at UT Austin (TCCN: MATH 2415). Required for all Cockrell majors.",
  physics1: "Equivalent to PHY 303K + lab (103M or 105M) at UT Austin. Must include both lecture and lab.",
  physics2: "Equivalent to PHY 303L + lab (103N or 105N) at UT Austin. Required for all Cockrell majors.",
  chem1: "Equivalent to CH 301 at UT Austin (TCCN: CHEM 1411).",
  chem2: "Equivalent to CH 302 + lab (102M) at UT Austin. Required for Materials Science Engineering.",
  bio1: "Equivalent to BIO 311C at UT Austin (TCCN: BIOL 1406). Required for Biomedical Engineering.",
  computing: "Equivalent to CS 303E or CS 312 at UT Austin. Required for ECE, ME, and Computational Engineering.",
};

const COURSE_DESCRIPTIONS_UWMADISON: Record<string, string> = {
  calc2: "[Progression] Equivalent to MATH 222 at UW-Madison. Minimum grade C required. Needed to progress in your major after transfer.",
  calc3: "[Progression] Equivalent to MATH 234 (Multivariable Calculus) at UW-Madison. Needed to progress in your major after transfer.",
  physics1: "[Progression] Equivalent to PHYSICS 201 or 207 at UW-Madison. Minimum grade C required. Needed for most CoE programs.",
  physics2: "[Progression] Equivalent to PHYSICS 202 or 208 at UW-Madison. Needed for AMEP, BME, MatSci, and Nuclear Engineering.",
  chem1: "[Progression] Equivalent to CHEM 103 or CHEM 109 at UW-Madison. Minimum grade C required. Needed for most CoE programs.",
  chem2: "[Progression] Equivalent to CHEM 104 at UW-Madison. Needed for BME, Chemical Engineering, and Materials Science.",
  orgChem: "[Progression] Equivalent to CHEM 343 (Organic Chemistry I) at UW-Madison. Needed for Chemical Engineering only.",
  compSci1: "[Progression] Equivalent to COMP SCI 200 or 300 at UW-Madison. Needed for Computer Engineering, EE, and Industrial & Systems Engineering.",
  statics: "[Progression] Equivalent to EMA 201 (Engineering Statics) at UW-Madison. Minimum grade C required. Needed for Civil/Env, Mechanical, Engineering Mechanics, and Geological Engineering.",
};

function buildGtUniversity(majorId: string): University {
  const allMajors = gtData.colleges.flatMap((c) => c.majors);
  const major = allMajors.find((m) => m.id === majorId) ?? allMajors[0];
  const base = gtData.base;
  const allCourseIds = ["calc1", ...major.requiredCourseIds];
  const requiredCourses = allCourseIds.map((id) => ({
    id,
    name: COURSE_NAMES[id] ?? id,
    description: COURSE_DESCRIPTIONS_GT[id] ?? "",
  }));
  const recommendedCourses = (major.recommendedCourseIds ?? []).map((id) => ({
    id,
    name: COURSE_NAMES[id] ?? id,
    description: COURSE_DESCRIPTIONS_GT_REC[id] ?? COURSE_DESCRIPTIONS_GT[id] ?? "",
  }));
  return {
    ...base,
    id: `gatech-${major.id}`,
    major: major.name,
    requiredCourses,
    recommendedCourses,
    notes: base.notes + (major.note ? ` Note: ${major.note}` : ""),
  } as University;
}

function buildUiucUniversity(majorId: string): University {
  const allMajors = uiucData.colleges.flatMap((c) => c.majors);
  const major = allMajors.find((m) => m.id === majorId) ?? allMajors[0];
  const base = uiucData.base;
  const allCourseIds = ["calc1", ...major.requiredCourseIds];
  const requiredCourses = allCourseIds.map((id) => ({
    id,
    name: COURSE_NAMES[id] ?? id,
    description: COURSE_DESCRIPTIONS_UIUC[id] ?? "",
  }));
  return {
    ...base,
    id: `uiuc-${major.id}`,
    major: major.name,
    requiredCourses,
    sourceUrl: major.sourceUrl ?? base.sourceUrl ?? "https://transferhandbook.illinois.edu/",
    notes: base.notes,
  } as University;
}

function buildPurdueUniversity(majorId: string): University {
  const allMajors = purdueData.colleges.flatMap((c) => c.majors);
  const major = allMajors.find((m) => m.id === majorId) ?? allMajors[0];
  const base = purdueData.base;
  const requiredCourses = major.requiredCourseIds.map((id) => ({
    id,
    name: COURSE_NAMES[id] ?? id,
    description: COURSE_DESCRIPTIONS_PURDUE[id] ?? "",
  }));
  return {
    ...base,
    id: `purdue-${major.id}`,
    major: major.name,
    requiredCourses,
    recommendedCourses: [],
    sourceUrl: major.sourceUrl ?? base.sourceUrl,
    notes: base.notes + (major.note ? ` Note: ${major.note}` : ""),
  } as University;
}

function buildUtAustinUniversity(majorId: string): University {
  const allMajors = utaustinData.colleges.flatMap((c) => c.majors);
  const major = allMajors.find((m) => m.id === majorId) ?? allMajors[0];
  const base = utaustinData.base;
  const allCourseIds = ["calc1", ...major.requiredCourseIds];
  const requiredCourses = allCourseIds.map((id) => ({
    id,
    name: COURSE_NAMES[id] ?? id,
    description: COURSE_DESCRIPTIONS_UTAUSTIN[id] ?? "",
  }));
  return {
    ...base,
    id: `utaustin-${major.id}`,
    major: major.name,
    requiredCourses,
    sourceUrl: major.sourceUrl ?? base.sourceUrl,
    notes: base.notes + (major.note ? ` Note: ${major.note}` : ""),
  } as University;
}

function buildUWMadisonUniversity(majorId: string): University {
  const allMajors = uwmadisonData.colleges.flatMap((c) => c.majors);
  const major = allMajors.find((m) => m.id === majorId) ?? allMajors[0];
  const base = uwmadisonData.base;
  const requiredCourses = major.requiredCourseIds.map((id) => ({
    id,
    name: COURSE_NAMES[id] ?? id,
    description: COURSE_DESCRIPTIONS_UWMADISON[id] ?? "",
  }));
  const progressionIds: string[] = (major as { progressionCourseIds?: string[] }).progressionCourseIds ?? [];
  const recommendedCourses = progressionIds.map((id) => ({
    id,
    name: COURSE_NAMES[id] ?? id,
    description: COURSE_DESCRIPTIONS_UWMADISON[id] ?? "",
  }));
  return {
    ...base,
    id: `uwmadison-${major.id}`,
    major: major.name,
    requiredCourses,
    recommendedCourses,
    sourceUrl: major.sourceUrl ?? base.sourceUrl,
    notes: base.notes + (major.note ? ` Note: ${major.note}` : ""),
  } as University;
}

function formValuesToScoringInput(values: FormValues): ScoringInput {
  const courseIds = [
    "calc1", "calc2", "calc3", "diffEq", "linAlg", "discreteStructures",
    "physics1", "physics1Lab", "physics2", "physics2Lab",
    "chem1", "chem1Lab", "chem2", "chem2Lab", "orgChem",
    "bio1", "bio2", "molecularBio",
    "compSci1", "compSci2", "computing", "ece110", "ece120",
    "statics", "engrGraphics", "engrDesign",
    "labSciElective", "advancedScience", "englishComp",
  ] as const;

  const courses: CourseRecord[] = courseIds.map((id) => ({
    id,
    status: ((values[id] as string) ?? "not-taken") as CourseRecord["status"],
  }));

  return {
    gpa: Number(values.gpa) || 0,
    completedCredits: Number(values.completedCredits) || 0,
    inProgressCredits: Number(values.inProgressCredits) || 0,
    courses,
    englishTestType: values.englishTestType as ScoringInput["englishTestType"],
    englishTestScore: Number(values.englishTestScore) || 0,
    toeflIsLegacy: values.toeflDate === "legacy",
    completedEnglishComp1: values.completedEnglishComp1 === "yes",
    completedEnglishComp2: values.completedEnglishComp2 === "yes",
  };
}

export default function Home() {
  const { lang, setLang, t } = useLanguage();
  const [results, setResults] = useState<EligibilityResult[] | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [activeTab, setActiveTab] = useState<"eligibility" | "score">("score");
  const [gtMajorId, setGtMajorId] = useState("mechanical-engineering");
  const [uiucMajorId, setUiucMajorId] = useState("mechanical-engineering");
  const [purdueMajorId, setPurdueMajorId] = useState("mechanical-engineering");
  const [utaustinMajorId, setUtAustinMajorId] = useState("mechanical-engineering");
  const [uwmadisonMajorId, setUWMadisonMajorId] = useState("mechanical-engineering");
  const [liveValues, setLiveValues] = useState<FormValues | null>(null);

  const handleValuesChange = useCallback((values: FormValues) => {
    setLiveValues(values);
    setGtMajorId(values.gtMajorId || "mechanical-engineering");
    setUiucMajorId(values.uiucMajorId || "mechanical-engineering");
    setPurdueMajorId(values.purdueMajorId || "mechanical-engineering");
    setUtAustinMajorId(values.utaustinMajorId || "mechanical-engineering");
    setUWMadisonMajorId(values.uwmadisonMajorId || "mechanical-engineering");
  }, []);

  function handleSubmit(
    profile: StudentProfile & {
      gtMajorId: string;
      uiucMajorId: string;
      purdueMajorId: string;
      utaustinMajorId: string;
      uwmadisonMajorId: string;
    }
  ) {
    const allUniversities = [
      buildGtUniversity(profile.gtMajorId),
      buildUiucUniversity(profile.uiucMajorId),
      buildPurdueUniversity(profile.purdueMajorId),
      buildUtAustinUniversity(profile.utaustinMajorId),
      buildUWMadisonUniversity(profile.uwmadisonMajorId),
    ];
    const evaluated = evaluateAll(profile, allUniversities);
    setResults(evaluated);
    setSubmitted(true);
    setActiveTab("eligibility");
    setTimeout(() => {
      document.getElementById("results-section")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }

  function handleReset() {
    setResults(null);
    setSubmitted(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const allUniversitiesForDisplay = [
    buildGtUniversity(gtMajorId),
    buildUiucUniversity(uiucMajorId),
    buildPurdueUniversity(purdueMajorId),
    buildUtAustinUniversity(utaustinMajorId),
    buildUWMadisonUniversity(uwmadisonMajorId),
  ];

  const scoringInput = liveValues ? formValuesToScoringInput(liveValues) : null;

  return (
    <main className="min-h-screen bg-background">
      <header className="bg-primary text-primary-foreground py-8 px-4 shadow-md">
        <div className="max-w-3xl mx-auto flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight" data-testid="text-app-title">
              {t("appTitle")}
            </h1>
            <p className="mt-2 text-primary-foreground/80 text-sm">
              {t("appSubtitle")}
            </p>
          </div>
          {/* Language Toggle */}
          <div className="shrink-0 flex items-center mt-1 bg-primary-foreground/10 rounded-lg p-0.5 gap-0.5">
            <button
              onClick={() => setLang("ko")}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                lang === "ko"
                  ? "bg-primary-foreground text-primary"
                  : "text-primary-foreground/70 hover:text-primary-foreground"
              }`}
              aria-label="한국어로 변경"
            >
              한국어
            </button>
            <button
              onClick={() => setLang("en")}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                lang === "en"
                  ? "bg-primary-foreground text-primary"
                  : "text-primary-foreground/70 hover:text-primary-foreground"
              }`}
              aria-label="Switch to English"
            >
              English
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-10">
        <section aria-label="Transfer Application Form">
          <TransferForm
            onSubmit={handleSubmit}
            onReset={handleReset}
            hasResults={submitted}
            onValuesChange={handleValuesChange}
          />
        </section>
      </div>

      {/* Results Section */}
      <div id="results-section" className="border-t border-border bg-muted/30">
        <div className="max-w-6xl mx-auto px-4 py-10">

          {/* Tab Bar */}
          <div className="flex gap-1 mb-8 border-b border-border">
            <button
              onClick={() => setActiveTab("score")}
              data-testid="tab-score"
              className={`px-5 py-2.5 text-sm font-medium rounded-t-lg border border-b-0 transition-colors -mb-px ${
                activeTab === "score"
                  ? "bg-background border-border text-foreground"
                  : "bg-transparent border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              📊 {t("tabScore")}
            </button>
            <button
              onClick={() => setActiveTab("eligibility")}
              data-testid="tab-eligibility"
              className={`px-5 py-2.5 text-sm font-medium rounded-t-lg border border-b-0 transition-colors -mb-px ${
                activeTab === "eligibility"
                  ? "bg-background border-border text-foreground"
                  : "bg-transparent border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              ✅ {t("tabEligibility")}
              {submitted && (
                <span className="ml-1.5 inline-flex items-center justify-center w-4 h-4 text-[10px] font-bold bg-primary text-primary-foreground rounded-full">
                  {results?.length ?? 0}
                </span>
              )}
            </button>
          </div>

          {/* Score Tab */}
          {activeTab === "score" && scoringInput && (
            <section aria-label="지원 가능성 계산기">
              <ScorePanel universities={allUniversitiesForDisplay} input={scoringInput} />
            </section>
          )}

          {/* Eligibility Tab */}
          {activeTab === "eligibility" && (
            <section aria-label="편입 자격 상세 결과">
              {submitted && results ? (
                <ResultsPanel results={results} universities={allUniversitiesForDisplay} />
              ) : (
                <div className="text-center py-20 text-muted-foreground">
                  <p className="text-4xl mb-4">📋</p>
                  <p className="text-base font-medium">{t("emptyResultTitle")}</p>
                  <p className="text-sm mt-1">{t("emptyResultDesc")}</p>
                </div>
              )}
            </section>
          )}
        </div>
      </div>

      <footer className="border-t border-border py-6 text-center text-sm text-muted-foreground px-4">
        <p>{t("footerDisclaimer")}</p>
        <p className="mt-1 flex flex-wrap justify-center gap-x-2 gap-y-1">
          <a href="https://admission.gatech.edu/transfer/course-requirements-major" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">GT source (Oct 2025)</a>
          <span>·</span>
          <a href="https://transferhandbook.illinois.edu/eng/" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">UIUC source</a>
          <span>·</span>
          <a href="https://admissions.purdue.edu/become-student/transfer/engineering-transfer-criteria/" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">Purdue source</a>
          <span>·</span>
          <a href="https://cockrell.utexas.edu/admissions/undergraduate/external-transfer/" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">UT Austin source</a>
          <span>·</span>
          <a href="https://engineering.wisc.edu/admissions/undergraduate/transfer-from-off-campus/" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">UW-Madison source</a>
        </p>
      </footer>
    </main>
  );
}
