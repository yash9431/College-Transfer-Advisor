import type { EligibilityResult } from "@/lib/eligibility";
import type { University } from "@/types";
import { ResultCard } from "@/components/ResultCard";

interface ResultsPanelProps {
  results: EligibilityResult[];
  universities: University[];
}

const OFFICIAL_LINKS: Record<string, { label: string; admissionsUrl: string }> = {
  gatech: {
    label: "Georgia Tech — Transfer Admissions",
    admissionsUrl: "https://admission.gatech.edu/transfer",
  },
  uiuc: {
    label: "UIUC — Transfer Admissions",
    admissionsUrl: "https://admissions.illinois.edu/Apply/Transfer",
  },
  purdue: {
    label: "Purdue — Engineering Transfer",
    admissionsUrl: "https://admissions.purdue.edu/become-student/transfer/engineering-transfer-criteria/",
  },
  utaustin: {
    label: "UT Austin — Cockrell External Transfer",
    admissionsUrl: "https://cockrell.utexas.edu/admissions/undergraduate/external-transfer/",
  },
  uwmadison: {
    label: "UW-Madison — Engineering Transfer",
    admissionsUrl: "https://engineering.wisc.edu/admissions/undergraduate/transfer-from-off-campus/",
  },
};

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

      {/* Official links callout */}
      <div className="mt-8 rounded-lg border border-blue-200 bg-blue-50 px-5 py-4" data-testid="official-links-callout">
        <p className="text-sm font-semibold text-blue-900 mb-1">다음 단계: 공식 홈페이지에서 직접 확인하고 지원하세요</p>
        <p className="text-sm text-blue-800 mb-4 leading-relaxed">
          이 결과는 참고용입니다. 요건은 매년 바뀔 수 있으므로, 지원 전 반드시 각 학교 공식 편입 페이지에서 최신 정보를 확인하고 궁금한 점은 입학처에 직접 문의하세요.
        </p>
        <ul className="space-y-2">
          {Object.entries(OFFICIAL_LINKS).map(([key, info]) => (
            <li key={key}>
              <a
                href={info.admissionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                data-testid={`official-link-${key}`}
                className="inline-flex items-center gap-1.5 text-sm text-blue-700 underline underline-offset-2 hover:text-blue-900 font-medium"
              >
                {info.label}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5 shrink-0">
                  <path fillRule="evenodd" d="M4.22 11.78a.75.75 0 0 1 0-1.06L9.44 5.5H5.75a.75.75 0 0 1 0-1.5h5.5a.75.75 0 0 1 .75.75v5.5a.75.75 0 0 1-1.5 0V6.56l-5.22 5.22a.75.75 0 0 1-1.06 0Z" clipRule="evenodd" />
                </svg>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
