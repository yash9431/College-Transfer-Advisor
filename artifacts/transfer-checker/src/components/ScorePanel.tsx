import type { University } from "@/types";
import type { ScoringInput } from "@/lib/scoreCalculator";
import { calculateAllScores } from "@/lib/scoreCalculator";
import { ScoreCard } from "@/components/ScoreCard";
import { useLanguage } from "@/contexts/LanguageContext";

interface ScorePanelProps {
  universities: University[];
  input: ScoringInput;
}

export function ScorePanel({ universities, input }: ScorePanelProps) {
  const { lang, t } = useLanguage();
  const results = calculateAllScores(universities, input, lang);
  const sorted = [...results].sort((a, b) => b.totalScore - a.totalScore);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-lg font-semibold text-foreground">{t("scorePanelTitle")}</h2>
          <p className="text-sm text-muted-foreground mt-0.5">{t("scorePanelSubtitle")}</p>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
            {t("legendGreen")}
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-orange-400 inline-block" />
            {t("legendOrange")}
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-red-400 inline-block" />
            {t("legendRed")}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {sorted.map((result) => (
          <ScoreCard key={result.universityId} result={result} />
        ))}
      </div>

      <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
        <p className="font-semibold mb-1">{t("disclaimerTitle")}</p>
        <p className="text-xs leading-relaxed">{t("disclaimerBody")}</p>
      </div>
    </div>
  );
}
