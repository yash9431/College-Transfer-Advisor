import type { University } from "@/types";
import type { ScoringInput } from "@/lib/scoreCalculator";
import { calculateAllScores } from "@/lib/scoreCalculator";
import { ScoreCard } from "@/components/ScoreCard";

interface ScorePanelProps {
  universities: University[];
  input: ScoringInput;
}

export function ScorePanel({ universities, input }: ScorePanelProps) {
  const results = calculateAllScores(universities, input);

  const sorted = [...results].sort((a, b) => b.totalScore - a.totalScore);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">지원 가능성 점수</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            입력값 변경 시 점수가 실시간으로 업데이트됩니다.
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
            지원 가능 (75+)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-orange-400 inline-block" />
            조건부 가능 (50–74)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-red-400 inline-block" />
            현재 어려움 (~49)
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {sorted.map((result) => (
          <ScoreCard key={result.universityId} result={result} />
        ))}
      </div>

      <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
        <p className="font-semibold mb-1">참고용 추정치입니다</p>
        <p className="text-xs leading-relaxed">
          이 점수는 공개된 공식 편입 요건을 기반으로 한 참고용 추정치이며, '합격률'이나 '합격 보장'을 의미하지 않습니다.
          실제 합격 여부는 GPA 트렌드, 에세이, 추천서, 전공별 경쟁률 등 더 많은 요소에 의해 결정됩니다.
          반드시 각 학교 공식 홈페이지와 입학처를 통해 최신 요건을 확인하세요.
        </p>
      </div>
    </div>
  );
}
