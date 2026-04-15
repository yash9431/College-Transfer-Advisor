import { CheckCircle2, XCircle, AlertCircle, ChevronDown, ChevronUp, ExternalLink, Star } from "lucide-react";
import { useState } from "react";
import type { EligibilityResult } from "@/lib/eligibility";
import type { University } from "@/types";
import { Badge } from "@/components/ui/badge";

interface ResultCardProps {
  result: EligibilityResult;
  university: University;
}

const statusConfig = {
  "Eligible": {
    icon: CheckCircle2,
    badgeClass: "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800",
    iconClass: "text-green-600 dark:text-green-400",
    borderClass: "border-l-green-500",
  },
  "Conditionally Eligible": {
    icon: AlertCircle,
    badgeClass: "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800",
    iconClass: "text-yellow-600 dark:text-yellow-400",
    borderClass: "border-l-yellow-500",
  },
  "Not Eligible": {
    icon: XCircle,
    badgeClass: "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800",
    iconClass: "text-red-600 dark:text-red-400",
    borderClass: "border-l-red-500",
  },
};

export function ResultCard({ result, university }: ResultCardProps) {
  const [expanded, setExpanded] = useState(true);
  const config = statusConfig[result.status];
  const StatusIcon = config.icon;

  const allMissing = result.missingRequirements;
  const allConditional = result.conditionalReasons;
  const hasRecommended = result.recommendedCourseResults && result.recommendedCourseResults.length > 0;

  return (
    <div
      className={`bg-card border border-border rounded-xl shadow-sm border-l-4 ${config.borderClass} overflow-hidden`}
      data-testid={`card-result-${result.universityId}`}
    >
      {/* Header */}
      <div className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <StatusIcon className={`w-6 h-6 flex-shrink-0 ${config.iconClass}`} aria-hidden="true" />
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3
                className="font-semibold text-foreground text-base"
                data-testid={`text-university-name-${result.universityId}`}
              >
                {result.universityName}
              </h3>
              <span className="text-muted-foreground text-sm">&mdash; {result.major}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">{university.location}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 ml-4">
          <Badge
            className={`text-xs border font-medium px-2.5 py-0.5 ${config.badgeClass}`}
            data-testid={`badge-status-${result.universityId}`}
          >
            {result.status}
          </Badge>
          <button
            onClick={() => setExpanded((e) => !e)}
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-expanded={expanded}
            aria-label={expanded ? "Collapse details" : "Expand details"}
            data-testid={`button-toggle-${result.universityId}`}
          >
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Expandable Details */}
      {expanded && (
        <div className="px-6 pb-5 space-y-5 border-t border-border pt-4">
          {/* Explanation */}
          <p
            className="text-sm text-foreground/80 leading-relaxed"
            data-testid={`text-explanation-${result.universityId}`}
          >
            {result.explanation}
          </p>

          {/* Required Courses */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
              필수 이수 과목 (Required)
            </h4>
            {result.courseResults.length === 0 ? (
              <p className="text-sm text-muted-foreground italic">
                입학 심사는 홀리스틱 전형 — 지정된 필수 과목 없음 (No specific course prerequisites required for admission)
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {result.courseResults.map((course) => (
                  <div
                    key={course.courseId}
                    className="flex items-start gap-2 text-sm"
                    data-testid={`course-status-${result.universityId}-${course.courseId}`}
                  >
                    {course.met ? (
                      <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                    )}
                    <span>
                      <span className="font-medium text-foreground">{course.courseName}</span>
                      {course.isInProgress && (
                        <span className="ml-1 text-xs text-yellow-600 dark:text-yellow-400">(in progress)</span>
                      )}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recommended / Progression Courses */}
          {hasRecommended && (
            <div>
              {result.universityId.startsWith("uwmadison") ? (
                <>
                  <h4 className="text-xs font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400 mb-1">
                    이수 권장 — Progression Requirements
                  </h4>
                  <p className="text-xs text-muted-foreground mb-2">
                    입학 필수 요건은 아니지만, 전공 이수 자격(Progression)을 위해 전학 전 또는 첫 2학기 내 완료해야 합니다.
                  </p>
                </>
              ) : (
                <>
                  <h4 className="text-xs font-semibold uppercase tracking-wide text-purple-600 dark:text-purple-400 mb-1">
                    권장 이수 과목 (Recommended)
                  </h4>
                  <p className="text-xs text-muted-foreground mb-2">
                    지원 자격 요건은 아니지만, 경쟁력 있는 지원자는 이 과목들도 이수합니다.
                  </p>
                </>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {result.recommendedCourseResults.map((course) => (
                  <div
                    key={course.courseId}
                    className="flex items-start gap-2 text-sm"
                    data-testid={`rec-course-status-${result.universityId}-${course.courseId}`}
                  >
                    {course.met ? (
                      <Star className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0 fill-purple-500" />
                    ) : (
                      <Star className="w-4 h-4 text-purple-300 mt-0.5 flex-shrink-0" />
                    )}
                    <span>
                      <span className={`font-medium ${course.met ? "text-foreground" : "text-muted-foreground"}`}>
                        {course.courseName}
                      </span>
                      {course.isInProgress && (
                        <span className="ml-1 text-xs text-yellow-600 dark:text-yellow-400">(in progress)</span>
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Missing Requirements */}
          {allMissing.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wide text-red-600 dark:text-red-400 mb-2">
                Missing Requirements
              </h4>
              <ul className="space-y-1.5">
                {allMissing.map((item, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm text-foreground/80"
                    data-testid={`missing-req-${result.universityId}-${i}`}
                  >
                    <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Conditional Notes */}
          {allConditional.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wide text-yellow-600 dark:text-yellow-400 mb-2">
                Conditions to Resolve
              </h4>
              <ul className="space-y-1.5">
                {allConditional.map((item, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm text-foreground/80"
                    data-testid={`conditional-${result.universityId}-${i}`}
                  >
                    <AlertCircle className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* University Notes */}
          {university.notes && (
            <div className="bg-muted/50 rounded-lg p-3 text-xs text-muted-foreground">
              <span className="font-medium text-foreground">Note: </span>
              {university.notes}
            </div>
          )}

          {/* Link to university */}
          <a
            href={university.website}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline"
            data-testid={`link-university-${result.universityId}`}
          >
            Visit {result.universityName} Admissions
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      )}
    </div>
  );
}
