import { useState } from "react";
import universitiesData from "@/data/universities.json";
import gtMajorsData from "@/data/gt-majors.json";
import type { University, GtMajorsData } from "@/types";
import { TransferForm } from "@/components/TransferForm";
import { ResultsPanel } from "@/components/ResultsPanel";
import { evaluateAll } from "@/lib/eligibility";
import type { StudentProfile, EligibilityResult } from "@/lib/eligibility";

const universities = universitiesData as University[];
const gtData = gtMajorsData as unknown as GtMajorsData;

const COURSE_NAMES: Record<string, string> = {
  calc1: "Calculus I",
  calc2: "Calculus II",
  calc3: "Calculus III",
  diffEq: "Differential Equations",
  linAlg: "Linear Algebra",
  physics1: "Physics 1 (Calculus-based)",
  physics2: "Physics 2 (Calculus-based)",
  chem1: "General Chemistry I",
  chem2: "General Chemistry II + Lab",
  bio1: "Biology I + Lab",
  bio2: "Biology II + Lab",
  compSci1: "Computer Science I",
  compSci2: "Computer Science II",
  labSciElective: "Lab Science Elective",
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

export default function Home() {
  const [results, setResults] = useState<EligibilityResult[] | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [gtMajorId, setGtMajorId] = useState("mechanical-engineering");

  function handleSubmit(profile: StudentProfile & { gtMajorId: string }) {
    const selectedId = profile.gtMajorId;
    setGtMajorId(selectedId);

    const gtUniversity = buildGtUniversity(selectedId);
    const allUniversities = [gtUniversity, ...universities];
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

  const gtUniversityForDisplay = buildGtUniversity(gtMajorId);
  const allUniversitiesForDisplay = [gtUniversityForDisplay, ...universities];

  return (
    <main className="min-h-screen bg-background">
      <header className="bg-primary text-primary-foreground py-10 px-4 shadow-md">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold tracking-tight" data-testid="text-app-title">
            US College Transfer Eligibility Checker
          </h1>
          <p className="mt-2 text-primary-foreground/80 text-base">
            Check eligibility for Georgia Tech (any major), UIUC ME, and Purdue ME.
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
        <p className="mt-1 space-x-2">
          <a href="https://admission.gatech.edu/transfer/course-requirements-major" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">GT source (Sept 2025)</a>
          <span>·</span>
          <a href="https://transferhandbook.illinois.edu/eng/mechanical-engineering/" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">UIUC source</a>
          <span>·</span>
          <a href="https://admissions.purdue.edu/become-student/transfer/" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">Purdue source</a>
        </p>
      </footer>
    </main>
  );
}
