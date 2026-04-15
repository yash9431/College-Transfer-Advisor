import { CheckCircle2, XCircle, AlertCircle, ChevronDown, ChevronUp, ExternalLink, Star } from "lucide-react";
import { useState } from "react";
import type { EligibilityResult } from "@/lib/eligibility";
import type { University } from "@/types";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";

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

const STATUS_LABELS = {
  "Eligible": { ko: "자격 충족", en: "Eligible" },
  "Conditionally Eligible": { ko: "조건부 자격 충족", en: "Conditionally Eligible" },
  "Not Eligible": { ko: "자격 미달", en: "Not Eligible" },
};

export function ResultCard({ result, university }: ResultCardProps) {
  const [expanded, setExpanded] = useState(true);
  const { lang, t } = useLanguage();
  const config = statusConfig[result.status];
  const StatusIcon = config.icon;

  const allMissing = result.missingRequirements;
  const allConditional = result.conditionalReasons;
  const hasRecommended = result.recommendedCourseResults && result.recommendedCourseResults.length > 0;

  const statusLabel = STATUS_LABELS[result.status][lang];

  return (
    <div
      className={`bg-card border border-border rounded-xl shadow-sm border-l-4 ${config.borderClass} overflow-hidden`}
      data-testid={`card-result-${result.universityId}`}
    >
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
            {statusLabel}
          </Badge>
          <button
            onClick={() => setExpanded((e) => !e)}
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-expanded={expanded}
            aria-label={expanded ? t("collapseDetails") : t("expandDetails")}
            data-testid={`button-toggle-${result.universityId}`}
          >
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="px-6 pb-5 space-y-5 border-t border-border pt-4">
          <p
            className="text-sm text-foreground/80 leading-relaxed"
            data-testid={`text-explanation-${result.universityId}`}
          >
            {result.explanation}
          </p>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
              {t("requiredCourses")}
            </h4>
            {result.courseResults.length === 0 ? (
              <p className="text-sm text-muted-foreground italic">
                {t("noCoursePrereqs")}
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
                        <span className="ml-1 text-xs text-yellow-600 dark:text-yellow-400">({t("inProgressBadge")})</span>
                      )}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {hasRecommended && (
            <div>
              {result.universityId.startsWith("uwmadison") ? (
                <>
                  <h4 className="text-xs font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400 mb-1">
                    {t("progressionReqTitle")}
                  </h4>
                  <p className="text-xs text-muted-foreground mb-2">
                    {t("progressionReqDesc")}
                  </p>
                </>
              ) : (
                <>
                  <h4 className="text-xs font-semibold uppercase tracking-wide text-purple-600 dark:text-purple-400 mb-1">
                    {t("recommendedTitle")}
                  </h4>
                  <p className="text-xs text-muted-foreground mb-2">
                    {t("recommendedDesc")}
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
                        <span className="ml-1 text-xs text-yellow-600 dark:text-yellow-400">({t("inProgressBadge")})</span>
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {allMissing.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wide text-red-600 dark:text-red-400 mb-2">
                {t("missingReqs")}
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

          {allConditional.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wide text-yellow-600 dark:text-yellow-400 mb-2">
                {t("conditionsTitle")}
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

          {university.notes && (
            <div className="bg-muted/50 rounded-lg p-3 text-xs text-muted-foreground">
              <span className="font-medium text-foreground">{t("noteLabel")}</span>
              {university.notes}
            </div>
          )}

          <a
            href={university.website}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline"
            data-testid={`link-university-${result.universityId}`}
          >
            {t("visitAdmissions")} — {result.universityName}
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      )}
    </div>
  );
}
