import type { ScoreResult, CategoryScore } from "@/lib/scoreCalculator";

interface ScoreCardProps {
  result: ScoreResult;
}

function getVerdictStyles(color: "green" | "orange" | "red") {
  if (color === "green") return { badge: "bg-green-100 text-green-800 border-green-200", bar: "bg-green-500", border: "border-green-200" };
  if (color === "orange") return { badge: "bg-orange-100 text-orange-800 border-orange-200", bar: "bg-orange-400", border: "border-orange-200" };
  return { badge: "bg-red-100 text-red-800 border-red-200", bar: "bg-red-400", border: "border-red-200" };
}

function getScoreColor(ratio: number) {
  if (ratio >= 0.75) return "bg-green-500";
  if (ratio >= 0.5) return "bg-orange-400";
  return "bg-red-400";
}

interface CategoryRowProps {
  cat: CategoryScore;
}

function CategoryRow({ cat }: CategoryRowProps) {
  const ratio = cat.max > 0 ? cat.score / cat.max : 0;
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground font-medium">{cat.label}</span>
        <span className="font-semibold text-foreground tabular-nums">
          {cat.score}<span className="text-muted-foreground font-normal">/{cat.max}</span>
        </span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${getScoreColor(ratio)}`}
          style={{ width: `${Math.round(ratio * 100)}%` }}
        />
      </div>
      <p className="text-[11px] text-muted-foreground leading-tight">{cat.details.join(" · ")}</p>
    </div>
  );
}

export function ScoreCard({ result }: ScoreCardProps) {
  const styles = getVerdictStyles(result.verdictColor);
  const totalRatio = result.totalScore / 100;

  const UNIVERSITY_EMOJI: Record<string, string> = {
    gatech: "🐝",
    uiuc: "🌽",
    purdue: "🚂",
    utaustin: "🤘",
    uwmadison: "🦡",
  };

  const uniKey = result.universityId.split("-")[0];
  const emoji = UNIVERSITY_EMOJI[uniKey] ?? "🏫";

  return (
    <div className={`rounded-xl border bg-card shadow-sm overflow-hidden ${styles.border}`}>
      {/* Header */}
      <div className="px-4 pt-4 pb-3 border-b border-border">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              {emoji} {result.universityName}
            </p>
            <p className="text-sm font-semibold text-foreground leading-snug mt-0.5 truncate" title={result.majorName}>
              {result.majorName}
            </p>
          </div>
          <span className={`shrink-0 text-xs font-semibold px-2 py-0.5 rounded-full border ${styles.badge}`}>
            {result.verdictLabel}
          </span>
        </div>

        {/* Total Score */}
        <div className="mt-3 flex items-end gap-2">
          <span className="text-3xl font-bold tabular-nums text-foreground leading-none">
            {result.totalScore}
          </span>
          <span className="text-sm text-muted-foreground mb-0.5">/ 100점</span>
        </div>
        <div className="mt-2 h-2 w-full rounded-full bg-muted overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${styles.bar}`}
            style={{ width: `${Math.round(totalRatio * 100)}%` }}
          />
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="px-4 py-3 space-y-3 border-b border-border">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">점수 항목</p>
        <CategoryRow cat={result.categories.courses} />
        <CategoryRow cat={result.categories.gpa} />
        <CategoryRow cat={result.categories.recommended} />
        <CategoryRow cat={result.categories.english} />
        <CategoryRow cat={result.categories.credits} />
      </div>

      {/* Missing Required */}
      {result.missingRequired.length > 0 && (
        <div className="px-4 py-3 border-b border-border bg-red-50">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-red-600 mb-1.5">미충족 필수 과목</p>
          <ul className="space-y-0.5">
            {result.missingRequired.map((item) => (
              <li key={item} className="flex items-start gap-1.5 text-xs text-red-700">
                <span className="mt-px shrink-0">✗</span>
                <span className="leading-snug">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Suggestions */}
      {result.suggestions.length > 0 && (
        <div className="px-4 py-3 bg-blue-50">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-blue-600 mb-1.5">개선 제안</p>
          <ul className="space-y-0.5">
            {result.suggestions.map((s) => (
              <li key={s} className="flex items-start gap-1.5 text-xs text-blue-700">
                <span className="mt-px shrink-0">→</span>
                <span className="leading-snug">{s}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {result.missingRequired.length === 0 && result.suggestions.length === 0 && (
        <div className="px-4 py-3 bg-green-50">
          <p className="text-xs text-green-700 font-medium">모든 주요 요건 충족 — 지원 검토 가능</p>
        </div>
      )}
    </div>
  );
}
