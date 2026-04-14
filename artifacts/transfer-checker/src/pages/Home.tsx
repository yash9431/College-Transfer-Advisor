import { useState } from "react";
import universitiesData from "@/data/universities.json";
import type { University } from "@/types";
import { TransferForm } from "@/components/TransferForm";
import { ResultsPanel } from "@/components/ResultsPanel";
import { evaluateAll } from "@/lib/eligibility";
import type { StudentProfile, EligibilityResult } from "@/lib/eligibility";

const universities = universitiesData as University[];

export default function Home() {
  const [results, setResults] = useState<EligibilityResult[] | null>(null);
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(profile: StudentProfile) {
    const evaluated = evaluateAll(profile, universities);
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

  return (
    <main className="min-h-screen bg-background">
      <header className="bg-primary text-primary-foreground py-10 px-4 shadow-md">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold tracking-tight" data-testid="text-app-title">
            US College Transfer Eligibility Checker
          </h1>
          <p className="mt-2 text-primary-foreground/80 text-base">
            Find out if you qualify to transfer into top Mechanical Engineering programs.
          </p>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-10">
        <section aria-label="Transfer Application Form">
          <TransferForm onSubmit={handleSubmit} onReset={handleReset} hasResults={submitted} />
        </section>

        {results && (
          <section id="results" className="mt-10" aria-label="Eligibility Results">
            <ResultsPanel results={results} universities={universities} />
          </section>
        )}
      </div>

      <footer className="border-t border-border mt-16 py-6 text-center text-sm text-muted-foreground px-4">
        <p>
          Requirements are based on publicly available information and may change. Always verify directly with each university's admissions office.
        </p>
      </footer>
    </main>
  );
}
