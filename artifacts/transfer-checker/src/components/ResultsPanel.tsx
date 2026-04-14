import type { EligibilityResult } from "@/lib/eligibility";
import type { University } from "@/types";
import { ResultCard } from "@/components/ResultCard";

interface ResultsPanelProps {
  results: EligibilityResult[];
  universities: University[];
}

export function ResultsPanel({ results, universities }: ResultsPanelProps) {
  return (
    <div>
      <h2 className="text-xl font-semibold text-foreground mb-1" data-testid="text-results-heading">
        Eligibility Results
      </h2>
      <p className="text-sm text-muted-foreground mb-6">
        Results are based on the information you provided. Requirements are approximations — confirm with each school.
      </p>
      <div className="space-y-5">
        {results.map((result) => {
          const university = universities.find((u) => u.id === result.universityId);
          return (
            <ResultCard
              key={result.universityId}
              result={result}
              university={university!}
            />
          );
        })}
      </div>
    </div>
  );
}
