import { useState } from "react";
import gtMajorsData from "@/data/gt-majors.json";
import uiucMajorsData from "@/data/uiuc-majors.json";
import purdueMajorsData from "@/data/purdue-majors.json";
import utaustinMajorsData from "@/data/utaustin-majors.json";
import type { University, GtMajorsData, UiucMajorsData, PurdueMajorsData, UtAustinMajorsData } from "@/types";
import { TransferForm } from "@/components/TransferForm";
import { ResultsPanel } from "@/components/ResultsPanel";
import { evaluateAll } from "@/lib/eligibility";
import type { StudentProfile, EligibilityResult } from "@/lib/eligibility";

const gtData = gtMajorsData as unknown as GtMajorsData;
const uiucData = uiucMajorsData as unknown as UiucMajorsData;
const purdueData = purdueMajorsData as unknown as PurdueMajorsData;
const utaustinData = utaustinMajorsData as unknown as UtAustinMajorsData;

const COURSE_NAMES: Record<string, string> = {
  calc1: "Calculus I",
  calc2: "Calculus II",
  calc3: "Calculus III",
  diffEq: "Differential Equations",
  linAlg: "Linear Algebra",
  discreteStructures: "Discrete Structures",
  physics1: "Physics 1 (Calculus-based)",
  physics2: "Physics 2 (Calculus-based)",
  chem1: "General Chemistry I",
  chem2: "General Chemistry II + Lab",
  bio1: "Biology I + Lab",
  bio2: "Biology II + Lab",
  molecularBio: "Molecular & Cellular Biology",
  compSci1: "Computer Science I",
  compSci2: "Computer Science II",
  computing: "Computing / Programming",
  ece110: "Introduction to Electronics (ECE 110)",
  ece120: "Introduction to Computing for ECE (ECE 120)",
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
  physics1: "Equivalent to PHYS 2211 at Georgia Tech. Must include lecture and lab.",
  physics2: "Equivalent to PHYS 2212 at Georgia Tech. Must include lecture and lab.",
  chem1: "Equivalent to CHEM 1211 at Georgia Tech. Lecture only.",
  chem2: "Equivalent to CHEM 1212K at Georgia Tech. Must include lecture and lab.",
  bio1: "Equivalent to BIOL 1510 at Georgia Tech.",
  bio2: "Equivalent to BIOL 1520 at Georgia Tech.",
  compSci1: "Equivalent to CS 1301 at Georgia Tech.",
  compSci2: "Equivalent to CS 1331 at Georgia Tech.",
  labSciElective: "Any one lab science course (biology, chemistry, calculus-based physics, earth & atmospheric, or environmental sciences). Must include lecture and lab.",
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
  calc1: "Required for all Purdue engineering majors. Equivalent to MA 16100 or MA 16500 at Purdue.",
  calc2: "Equivalent to MA 16200 or MA 16600 at Purdue.",
  calc3: "Equivalent to MA 26100 at Purdue. Note: Linear Algebra (MA 26500) may substitute for Calc III.",
  chem1: "Equivalent to CHM 11500 at Purdue.",
  chem2: "Equivalent to CHM 11610/11620/11630 at Purdue. Required specifically as the science selective for Environmental & Ecological Engineering.",
  physics1: "Equivalent to PHYS 17200 at Purdue.",
  physics2: "Equivalent to PHYS 27200 at Purdue.",
  computing: "Equivalent to CS 15900 (computer programming) at Purdue.",
  engrGraphics: "Equivalent to ENGR 13100 at Purdue — Introduction to Engineering and Problem Solving. Required for all Purdue engineering majors.",
  engrDesign: "Equivalent to ENGR 13200 at Purdue — Engineering Projects and Design. Required for all Purdue engineering majors.",
  advancedScience: "One advanced course in math (Calc III/above), chemistry (beyond Chem I), or physics (beyond Physics I). Must be a full course, not a lab section only.",
};

const COURSE_DESCRIPTIONS_UTAUSTIN: Record<string, string> = {
  calc1: "Required for all UT Austin Cockrell majors. Equivalent to M 408C or M 408K at UT Austin.",
  calc2: "Equivalent to M 408D, M 408L, or M 408M (TCCN: MATH 2415) at UT Austin.",
  physics1: "Equivalent to PHY 303K + lab (103M or 105M) at UT Austin. Must include both lecture and lab.",
  chem1: "Equivalent to CH 301 at UT Austin (TCCN: CHEM 1411).",
  chem2: "Equivalent to CH 302 + lab (102M) at UT Austin. Required for Materials Science Engineering.",
  bio1: "Equivalent to BIO 311C at UT Austin (TCCN: BIOL 1406). Required for Biomedical Engineering.",
  computing: "Equivalent to CS 303E or CS 312 at UT Austin. Required for ECE, ME, and Computational Engineering.",
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

  return {
    ...base,
    id: `gatech-${major.id}`,
    major: major.name,
    requiredCourses,
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

  const allCourseIds = ["calc1", ...major.requiredCourseIds];
  const requiredCourses = allCourseIds.map((id) => ({
    id,
    name: COURSE_NAMES[id] ?? id,
    description: COURSE_DESCRIPTIONS_PURDUE[id] ?? "",
  }));

  return {
    ...base,
    id: `purdue-${major.id}`,
    major: major.name,
    requiredCourses,
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

export default function Home() {
  const [results, setResults] = useState<EligibilityResult[] | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [gtMajorId, setGtMajorId] = useState("mechanical-engineering");
  const [uiucMajorId, setUiucMajorId] = useState("mechanical-engineering");
  const [purdueMajorId, setPurdueMajorId] = useState("mechanical-engineering");
  const [utaustinMajorId, setUtAustinMajorId] = useState("mechanical-engineering");

  function handleSubmit(profile: StudentProfile & { gtMajorId: string; uiucMajorId: string; purdueMajorId: string; utaustinMajorId: string }) {
    setGtMajorId(profile.gtMajorId);
    setUiucMajorId(profile.uiucMajorId);
    setPurdueMajorId(profile.purdueMajorId);
    setUtAustinMajorId(profile.utaustinMajorId);

    const gtUniversity = buildGtUniversity(profile.gtMajorId);
    const uiucUniversity = buildUiucUniversity(profile.uiucMajorId);
    const purdueUniversity = buildPurdueUniversity(profile.purdueMajorId);
    const utaustinUniversity = buildUtAustinUniversity(profile.utaustinMajorId);
    const allUniversities = [gtUniversity, uiucUniversity, purdueUniversity, utaustinUniversity];
    const evaluated = evaluateAll(profile, allUniversities);
    setResults(evaluated);
    setSubmitted(true);
    setTimeout(() => {
      document.getElementById("results")?.scrollIntoView({ behavior: "smooth" });
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
  ];

  return (
    <main className="min-h-screen bg-background">
      <header className="bg-primary text-primary-foreground py-10 px-4 shadow-md">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold tracking-tight" data-testid="text-app-title">
            US College Transfer Eligibility Checker
          </h1>
          <p className="mt-2 text-primary-foreground/80 text-base">
            Check eligibility for Georgia Tech, UIUC, Purdue, and UT Austin — any major, based on official university requirements.
          </p>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-10">
        <section aria-label="Transfer Application Form">
          <TransferForm onSubmit={handleSubmit} onReset={handleReset} hasResults={submitted} />
        </section>

        {results && (
          <section id="results" className="mt-10" aria-label="Eligibility Results">
            <ResultsPanel results={results} universities={allUniversitiesForDisplay} />
          </section>
        )}
      </div>

      <footer className="border-t border-border mt-16 py-6 text-center text-sm text-muted-foreground px-4">
        <p>
          Requirements are based on officially published information and may change. Always verify directly with each university's admissions office.
        </p>
        <p className="mt-1 flex flex-wrap justify-center gap-x-2 gap-y-1">
          <a href="https://admission.gatech.edu/transfer/course-requirements-major" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">GT source (Sept 2025)</a>
          <span>·</span>
          <a href="https://transferhandbook.illinois.edu/eng/" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">UIUC source</a>
          <span>·</span>
          <a href="https://admissions.purdue.edu/become-student/transfer/engineering-transfer-criteria/" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">Purdue source</a>
          <span>·</span>
          <a href="https://cockrell.utexas.edu/admissions/undergraduate/external-transfer/" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">UT Austin source</a>
        </p>
      </footer>
    </main>
  );
}
