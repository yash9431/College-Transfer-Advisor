export type Lang = "ko" | "en";

const T = {
  appTitle: {
    ko: "미국 대학 편입 자격 확인기",
    en: "US College Transfer Eligibility Checker",
  },
  appSubtitle: {
    ko: "Georgia Tech, UIUC, Purdue, UT Austin, UW-Madison — 전공별 공식 편입 요건 기반",
    en: "Georgia Tech, UIUC, Purdue, UT Austin, UW-Madison — based on official transfer requirements by major",
  },

  tabScore: { ko: "📊 지원 가능성 계산기", en: "📊 Score Calculator" },
  tabEligibility: { ko: "✅ 편입 자격 상세 확인", en: "✅ Detailed Eligibility Check" },

  emptyTitle: { ko: "아직 자격 확인 결과가 없습니다.", en: "No eligibility results yet." },
  emptyBody: {
    ko: '위 폼을 작성한 뒤 "편입 자격 확인하기" 버튼을 누르면 상세 결과가 여기에 표시됩니다.',
    en: 'Fill in the form above and click "Check My Eligibility" to see detailed results here.',
  },

  formTitle: { ko: "나의 학업 프로필", en: "Your Academic Profile" },
  formSubtitle: {
    ko: "편입 자격 확인을 위해 정보를 입력하세요.",
    en: "Fill in your information to check your transfer eligibility.",
  },

  sectionGtMajor: { ko: "Georgia Tech — 지망 전공", en: "Georgia Tech — Intended Major" },
  labelGtMajor: { ko: "Georgia Tech 지망 전공", en: "Target Major at Georgia Tech" },
  sectionUiucMajor: { ko: "UIUC — 지망 전공", en: "UIUC — Intended Major" },
  labelUiucMajor: { ko: "UIUC 지망 전공", en: "Target Major at UIUC" },
  sectionPurdueMajor: { ko: "Purdue University — 지망 전공", en: "Purdue University — Intended Major" },
  labelPurdueMajor: { ko: "Purdue 지망 전공", en: "Target Major at Purdue" },
  sectionUtaustinMajor: { ko: "UT Austin — 지망 전공", en: "UT Austin — Intended Major" },
  labelUtaustinMajor: {
    ko: "UT Austin 지망 전공 (Cockrell 공과대학)",
    en: "Target Major at UT Austin (Cockrell School of Engineering)",
  },
  sectionUwmadisonMajor: { ko: "UW-Madison — 지망 전공", en: "UW-Madison — Intended Major" },
  labelUwmadisonMajor: {
    ko: "UW-Madison 지망 전공 (공과대학)",
    en: "Target Major at UW-Madison (College of Engineering)",
  },

  sectionCreditsGpa: { ko: "학점 및 GPA", en: "Credits & GPA" },
  labelCompletedCredits: { ko: "취득 학점", en: "Completed Credits" },
  descCompletedCredits: { ko: "지금까지 이수 완료한 학점 수", en: "Credits you've already finished." },
  labelInProgressCredits: { ko: "수강 중 학점", en: "In-Progress Credits" },
  descInProgressCredits: { ko: "현재 수강 중인 과목의 학점 수", en: "Credits currently in progress." },
  labelGpa: { ko: "누적 GPA (0.0 – 4.0)", en: "Cumulative GPA (0.0 – 4.0)" },
  descGpa: { ko: "지원 가능성 점수에 반영됩니다.", en: "Used to calculate your application possibility score." },

  sectionEnglish: { ko: "영어 능력 시험", en: "English Proficiency Test" },
  labelTestType: { ko: "영어 시험 종류", en: "English Test Type" },
  optNone: { ko: "없음 / 해당 없음", en: "None / N/A" },
  labelTestScore: { ko: "시험 점수", en: "Test Score" },
  labelToeflScale: { ko: "TOEFL 시험 응시 시기", en: "TOEFL Test Date" },
  optToeflNew: {
    ko: "2026년 1월 21일 이후 (신기준, 0–12점)",
    en: "On or after January 21, 2026 (new scale, 0–12)",
  },
  optToeflLegacy: {
    ko: "2026년 1월 21일 이전 (구기준, 0–120점)",
    en: "Before January 21, 2026 (old scale, 0–120)",
  },
  toeflScaleNote: {
    ko: "ETS는 2026년 1월 21일 TOEFL 채점 방식을 변경했습니다.",
    en: "ETS changed the TOEFL scoring system on January 21, 2026.",
  },
  labelComp1: {
    ko: "영작문 I (English Composition I) 이수 여부",
    en: "Completed English Composition I?",
  },
  labelComp2: {
    ko: "영작문 II (English Composition II) 이수 여부",
    en: "Completed English Composition II?",
  },
  optYes: { ko: "예 (이수 완료)", en: "Yes (completed)" },
  optNo: { ko: "아니오", en: "No" },

  sectionCourses: { ko: "이수 과목 현황", en: "Courses Completed" },
  descCourses: {
    ko: "각 과목의 이수 상태를 선택하세요. 전공마다 요구하는 과목이 다릅니다.",
    en: "Mark each course as completed, in progress, or not yet taken. Different universities and majors require different courses.",
  },
  statusCompleted: { ko: "이수 완료", en: "Completed" },
  statusInProgress: { ko: "수강 중", en: "In Progress" },
  statusNotTaken: { ko: "미이수", en: "Not Taken" },

  groupMath: { ko: "수학", en: "Mathematics" },
  groupPhysics: { ko: "물리학", en: "Physics" },
  groupChem: { ko: "화학", en: "Chemistry" },
  groupBio: { ko: "생물학 / 생명과학", en: "Biology / Life Sciences" },
  groupComputing: { ko: "컴퓨팅 / 전자공학", en: "Computing / Electronics" },
  groupEngrFund: { ko: "공학 기초", en: "Engineering Fundamentals" },
  groupOther: { ko: "기타 / 선택 과목", en: "Other / Electives" },

  formDisclaimer: { ko: "이 앱은 참고용입니다", en: "For Reference Only" },
  formDisclaimerBody: {
    ko: "결과는 공개된 공식 요건을 기반으로 한 가이드입니다. 실제 지원 전에 반드시 각 학교의 공식 편입 홈페이지를 직접 방문해 최신 요건을 확인하고, 궁금한 점은 입학처에 문의하세요.",
    en: "Results are a guide based on publicly available official requirements. Before applying, always check the latest requirements on each school's official transfer website and contact the admissions office with any questions.",
  },

  btnCheck: { ko: "편입 자격 확인하기", en: "Check My Eligibility" },
  btnReset: { ko: "초기화", en: "Reset" },

  scorePanelTitle: { ko: "지원 가능성 점수", en: "Application Possibility Score" },
  scorePanelSubtitle: {
    ko: "입력값 변경 시 점수가 실시간으로 업데이트됩니다.",
    en: "Scores update in real-time as you fill in the form.",
  },
  legendGreen: { ko: "지원 가능 (75+)", en: "Likely (75+)" },
  legendOrange: { ko: "조건부 가능 (50–74)", en: "Possible (50–74)" },
  legendRed: { ko: "현재 어려움 (~49)", en: "Difficult (~49)" },
  disclaimerTitle: { ko: "참고용 추정치입니다", en: "For Reference Only" },
  disclaimerBody: {
    ko: "이 점수는 공개된 공식 편입 요건을 기반으로 한 참고용 추정치이며, '합격률'이나 '합격 보장'을 의미하지 않습니다. 실제 합격 여부는 GPA 트렌드, 에세이, 추천서, 전공별 경쟁률 등 더 많은 요소에 의해 결정됩니다. 반드시 각 학교 공식 홈페이지와 입학처를 통해 최신 요건을 확인하세요.",
    en: "This score is a reference estimate based on publicly available official transfer requirements. It does not represent an admission rate or guarantee of admission. Actual outcomes depend on many additional factors including GPA trends, essays, recommendations, and major competitiveness. Always verify current requirements directly with each university's admissions office.",
  },

  scoreBreakdown: { ko: "점수 항목", en: "Score Breakdown" },
  missingRequired: { ko: "미충족 필수 과목", en: "Missing Required Courses" },
  suggestions: { ko: "개선 제안", en: "Suggestions" },
  allMet: {
    ko: "모든 주요 요건 충족 — 지원 검토 가능",
    en: "All major requirements met — eligible to apply",
  },
  scorePts: { ko: "점", en: "pts" },

  verdictApply: { ko: "지원 가능", en: "Likely" },
  verdictConditional: { ko: "조건부 가능", en: "Possible" },
  verdictDifficult: { ko: "현재 어려움", en: "Difficult" },

  catCourses: { ko: "필수 과목", en: "Required Courses" },
  catGpa: { ko: "GPA", en: "GPA" },
  catRecommended: { ko: "권장 과목", en: "Recommended" },
  catEnglish: { ko: "영어 성적", en: "English" },
  catCredits: { ko: "취득 학점", en: "Credits" },

  resultsTitle: { ko: "편입 자격 결과", en: "Eligibility Results" },
  resultsSubtitle: {
    ko: "입력하신 정보를 기반으로 한 결과입니다. 요건은 참고용이며 각 학교에 직접 확인하세요.",
    en: "Results based on the information you provided. Requirements are approximations — confirm with each school.",
  },
  nextStepsTitle: {
    ko: "다음 단계: 공식 홈페이지에서 직접 확인하고 지원하세요",
    en: "Next Steps: Verify and Apply on Official Websites",
  },
  nextStepsBody: {
    ko: "이 결과는 참고용입니다. 요건은 매년 바뀔 수 있으므로, 지원 전 반드시 각 학교 공식 편입 페이지에서 최신 정보를 확인하고 궁금한 점은 입학처에 직접 문의하세요.",
    en: "These results are for reference only. Requirements may change each year. Before applying, verify the latest information on each school's official transfer page and contact the admissions office with any questions.",
  },

  requiredCourses: { ko: "필수 이수 과목", en: "Required Courses" },
  noCoursePrereqs: {
    ko: "입학 심사는 홀리스틱 전형 — 지정된 필수 과목 없음",
    en: "Holistic review — no specific course prerequisites required for admission",
  },
  progressionReqTitle: { ko: "전공 이수 요건 (Progression Requirements)", en: "Progression Requirements" },
  progressionReqDesc: {
    ko: "입학 필수 요건은 아니지만, 전공 이수 자격(Progression)을 위해 전학 전 또는 첫 2학기 내 완료해야 합니다.",
    en: "Not required for admission, but must be completed before transfer or within the first two semesters for major progression.",
  },
  recommendedTitle: { ko: "권장 이수 과목 (Recommended)", en: "Recommended Courses" },
  recommendedDesc: {
    ko: "지원 자격 요건은 아니지만, 경쟁력 있는 지원자는 이 과목들도 이수합니다.",
    en: "Not required for admission, but competitive applicants typically complete these courses.",
  },
  missingReqs: { ko: "미충족 요건", en: "Missing Requirements" },
  conditionsTitle: { ko: "조건부 사항", en: "Conditions to Resolve" },
  inProgressBadge: { ko: "수강 중", en: "in progress" },
  noteLabel: { ko: "참고: ", en: "Note: " },
  visitAdmissions: { ko: "공식 입학 안내 페이지 방문", en: "Visit Admissions" },
  collapseDetails: { ko: "상세 접기", en: "Collapse details" },
  expandDetails: { ko: "상세 펼치기", en: "Expand details" },

  footerNote: {
    ko: "요건은 공식 발표 정보를 기반으로 하며 변경될 수 있습니다. 항상 각 대학 입학처에서 직접 확인하세요.",
    en: "Requirements are based on officially published information and may change. Always verify directly with each university's admissions office.",
  },
  footerGt: { ko: "GT 공식 출처 (2025년 10월)", en: "GT source (Oct 2025)" },
  footerUiuc: { ko: "UIUC 공식 출처", en: "UIUC source" },
  footerPurdue: { ko: "Purdue 공식 출처", en: "Purdue source" },
  footerUtaustin: { ko: "UT Austin 공식 출처", en: "UT Austin source" },
  footerUwmadison: { ko: "UW-Madison 공식 출처", en: "UW-Madison source" },
} as const;

export type TranslationKey = keyof typeof T;

export function t(key: TranslationKey, lang: Lang): string {
  return T[key][lang];
}

export default T;
