import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import gtMajorsData from "@/data/gt-majors.json";
import uiucMajorsData from "@/data/uiuc-majors.json";
import purdueMajorsData from "@/data/purdue-majors.json";
import utaustinMajorsData from "@/data/utaustin-majors.json";
import uwmadisonMajorsData from "@/data/uwmadison-majors.json";
import type { StudentProfile, CourseRecord, CourseStatus, EnglishTestType } from "@/lib/eligibility";
import type { GtMajorsData, UiucMajorsData, PurdueMajorsData, UtAustinMajorsData, UWMadisonMajorsData } from "@/types";

const gtData = gtMajorsData as unknown as GtMajorsData;
const uiucData = uiucMajorsData as unknown as UiucMajorsData;
const purdueData = purdueMajorsData as unknown as PurdueMajorsData;
const utaustinData = utaustinMajorsData as unknown as UtAustinMajorsData;
const uwmadisonData = uwmadisonMajorsData as unknown as UWMadisonMajorsData;

const COURSE_IDS = [
  "calc1", "calc2", "calc3", "diffEq", "linAlg", "discreteStructures",
  "physics1", "physics1Lab", "physics2", "physics2Lab",
  "chem1", "chem1Lab", "chem2", "chem2Lab", "orgChem",
  "bio1", "bio2", "molecularBio",
  "compSci1", "compSci2", "computing", "ece110", "ece120",
  "statics",
  "engrGraphics", "engrDesign",
  "labSciElective", "advancedScience", "englishComp",
] as const;

const COURSE_GROUPS: { label: string; ids: string[] }[] = [
  { label: "Mathematics", ids: ["calc1", "calc2", "calc3", "diffEq", "linAlg", "discreteStructures"] },
  { label: "Physics", ids: ["physics1", "physics1Lab", "physics2", "physics2Lab"] },
  { label: "Chemistry", ids: ["chem1", "chem1Lab", "chem2", "chem2Lab", "orgChem"] },
  { label: "Biology / Life Sciences", ids: ["bio1", "bio2", "molecularBio"] },
  { label: "Computing / Electronics", ids: ["compSci1", "compSci2", "computing", "ece110", "ece120"] },
  { label: "Engineering Fundamentals", ids: ["statics", "engrGraphics", "engrDesign"] },
  { label: "Other / Electives", ids: ["labSciElective", "advancedScience", "englishComp"] },
];

const COURSE_LABELS: Record<string, string> = {
  calc1: "Calculus I",
  calc2: "Calculus II",
  calc3: "Calculus III / Multivariable Calculus",
  diffEq: "Differential Equations",
  linAlg: "Linear Algebra",
  discreteStructures: "Discrete Structures",
  physics1: "Physics I Lecture (Calculus-based)",
  physics1Lab: "Physics I Lab (Calculus-based)",
  physics2: "Physics II Lecture (Calculus-based)",
  physics2Lab: "Physics II Lab (Calculus-based)",
  chem1: "General Chemistry I Lecture",
  chem1Lab: "General Chemistry I Lab",
  chem2: "General Chemistry II Lecture",
  chem2Lab: "General Chemistry II Lab",
  orgChem: "Organic Chemistry I",
  bio1: "Biology I + Lab",
  bio2: "Biology II + Lab",
  molecularBio: "Molecular & Cellular Biology",
  compSci1: "Computer Science I (Intro Programming)",
  compSci2: "Computer Science II",
  computing: "Computing / Programming",
  ece110: "Introduction to Electronics (ECE 110)",
  ece120: "Introduction to Computing for ECE (ECE 120)",
  statics: "Engineering Statics (Mechanics of Rigid Bodies)",
  engrGraphics: "Engineering Problem Solving (ENGR 13100)",
  engrDesign: "Engineering Projects & Design (ENGR 13200)",
  labSciElective: "Lab Science Elective",
  advancedScience: "Advanced Math / Science Elective",
  englishComp: "English Composition or Speech",
};

const COURSE_DESCRIPTIONS: Record<string, string> = {
  diffEq: "Required by most UIUC engineering majors. Equiv. MATH 2552 at GT / MATH 285 at UIUC.",
  linAlg: "Required by UIUC CS. Equiv. MATH 1554 at GT / MATH 257 at UIUC.",
  discreteStructures: "Required by UIUC CS, CS+Physics. Equiv. CS 173 at UIUC.",
  physics1: "Lecture component. GT also requires the separate lab (Physics I Lab). UIUC and UT Austin treat lecture+lab as one combined requirement.",
  physics1Lab: "Lab component — required separately by Georgia Tech (PHYS 2211L or equivalent). UIUC and UT Austin include the lab within the single Physics I requirement.",
  physics2: "Lecture component. GT does not require Physics II for admission (it is a recommended/competitive course). Required by UIUC and UT Austin engineering majors.",
  physics2Lab: "Lab component. Not required by GT for admission. Required alongside Physics II Lecture by UIUC and UT Austin.",
  chem1: "Lecture component. GT also requires the separate lab (Chemistry I Lab). UIUC and UT Austin treat lecture+lab as one combined requirement.",
  chem1Lab: "Lab component — required separately by Georgia Tech (CHEM 1211L or equivalent). UIUC and UT Austin include the lab within the single Chemistry I requirement.",
  chem2: "Lecture component. Required by GT ChBE, Biochemistry, Chemistry; UW-Madison BME, ChemE, MatSci; and several UIUC majors. GT also requires the separate lab.",
  chem2Lab: "Lab component — required separately by Georgia Tech for majors that need Chemistry II (ChBE, Biochemistry, Chemistry). Equiv. CHEM 1212L or equivalent.",
  bio1: "Required by GT BME, Biology, Biochemistry, Neuroscience. Lab is typically included in the same course.",
  bio2: "Required by GT Biology, Biochemistry, Neuroscience.",
  molecularBio: "Required by UIUC Bioengineering, CS+BioEng, Neural Eng. Equiv. MCB 150 at UIUC.",
  compSci1: "Required by GT CompE, CS, Computational Media, Discrete Math; UIUC CompE, CS. Equiv. CS 1301 at GT / CS 124 at UIUC.",
  compSci2: "Required by GT CompE, CS, Computational Media, Discrete Math; UIUC CS. Equiv. CS 128 at UIUC.",
  computing: "Required by UIUC ME, AE, CE, IE, Physics, SE&D, etc.; UT Austin ECE, ME, Computational Eng. Equiv. CS 101/124/SE 101/ME 170 at UIUC.",
  ece110: "Required by UIUC EE and Computer Engineering. Equiv. ECE 110 (Introduction to Electronics) at UIUC.",
  ece120: "Required by UIUC EE and Computer Engineering alongside ECE 110. Equiv. ECE 120 (Intro to Computing) at UIUC.",
  orgChem: "Required by UW-Madison Chemical Engineering. Equiv. CHEM 343 (Organic Chemistry I) at UW-Madison.",
  statics: "Required by UW-Madison Civil/Environmental, Mechanical, Engineering Mechanics, and Geological Engineering. Equiv. EMA 201 (Statics) at UW-Madison. Grade of C or better required.",
  engrGraphics: "Required by Purdue IDES only. Equiv. ENGR 13100 at Purdue.",
  engrDesign: "Required by Purdue IDES only. Equiv. ENGR 13200 at Purdue.",
  labSciElective: "Required by GT IE, CS, and most College of Design/Liberal Arts majors. Any one lab science course (biology, chemistry, calculus-based physics, earth & atmospheric science) with lecture and lab.",
  advancedScience: "Required by most Purdue engineering majors — one advanced course in math, chemistry, or physics beyond Calc II and Physics I.",
  englishComp: "Recommended by Purdue (to help reach 24-credit minimum). For UW-Madison: completing a college-level English composition course at a U.S. institution waives the English proficiency test requirement.",
};

const courseStatusEnum = z.enum(["completed", "in-progress", "not-taken"]);

const formSchema = z.object({
  completedCredits: z.coerce.number().min(0).max(300),
  inProgressCredits: z.coerce.number().min(0).max(200),
  englishTestType: z.enum(["TOEFL", "IELTS", "Duolingo", "None"]),
  englishTestScore: z.coerce.number().min(0).max(160),
  toeflDate: z.enum(["legacy", "new"]).optional(),
  completedEnglishComp1: z.enum(["yes", "no"]),
  completedEnglishComp2: z.enum(["yes", "no"]),
  gtMajorId: z.string().min(1, "Please select a Georgia Tech major"),
  uiucMajorId: z.string().min(1, "Please select a UIUC major"),
  purdueMajorId: z.string().min(1, "Please select a Purdue major"),
  utaustinMajorId: z.string().min(1, "Please select a UT Austin major"),
  uwmadisonMajorId: z.string().min(1, "Please select a UW-Madison major"),
  calc1: courseStatusEnum,
  calc2: courseStatusEnum,
  calc3: courseStatusEnum,
  diffEq: courseStatusEnum,
  linAlg: courseStatusEnum,
  discreteStructures: courseStatusEnum,
  physics1: courseStatusEnum,
  physics1Lab: courseStatusEnum,
  physics2: courseStatusEnum,
  physics2Lab: courseStatusEnum,
  chem1: courseStatusEnum,
  chem1Lab: courseStatusEnum,
  chem2: courseStatusEnum,
  chem2Lab: courseStatusEnum,
  orgChem: courseStatusEnum,
  bio1: courseStatusEnum,
  bio2: courseStatusEnum,
  molecularBio: courseStatusEnum,
  compSci1: courseStatusEnum,
  compSci2: courseStatusEnum,
  computing: courseStatusEnum,
  ece110: courseStatusEnum,
  ece120: courseStatusEnum,
  statics: courseStatusEnum,
  engrGraphics: courseStatusEnum,
  engrDesign: courseStatusEnum,
  labSciElective: courseStatusEnum,
  advancedScience: courseStatusEnum,
  englishComp: courseStatusEnum,
});

type FormValues = z.infer<typeof formSchema>;

interface TransferFormProps {
  onSubmit: (profile: StudentProfile & { gtMajorId: string; uiucMajorId: string; purdueMajorId: string; utaustinMajorId: string; uwmadisonMajorId: string }) => void;
  onReset: () => void;
  hasResults: boolean;
}

export function TransferForm({ onSubmit, onReset, hasResults }: TransferFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      completedCredits: 0,
      inProgressCredits: 0,
      englishTestType: "None",
      englishTestScore: 0,
      toeflDate: "new",
      completedEnglishComp1: "no",
      completedEnglishComp2: "no",
      gtMajorId: "mechanical-engineering",
      uiucMajorId: "mechanical-engineering",
      purdueMajorId: "mechanical-engineering",
      utaustinMajorId: "mechanical-engineering",
      uwmadisonMajorId: "mechanical-engineering",
      calc1: "not-taken",
      calc2: "not-taken",
      calc3: "not-taken",
      diffEq: "not-taken",
      linAlg: "not-taken",
      discreteStructures: "not-taken",
      physics1: "not-taken",
      physics1Lab: "not-taken",
      physics2: "not-taken",
      physics2Lab: "not-taken",
      chem1: "not-taken",
      chem1Lab: "not-taken",
      chem2: "not-taken",
      chem2Lab: "not-taken",
      bio1: "not-taken",
      bio2: "not-taken",
      molecularBio: "not-taken",
      compSci1: "not-taken",
      compSci2: "not-taken",
      computing: "not-taken",
      ece110: "not-taken",
      ece120: "not-taken",
      orgChem: "not-taken",
      statics: "not-taken",
      engrGraphics: "not-taken",
      engrDesign: "not-taken",
      labSciElective: "not-taken",
      advancedScience: "not-taken",
      englishComp: "not-taken",
    },
  });

  const testType = form.watch("englishTestType");
  const toeflDate = form.watch("toeflDate");

  function handleSubmit(values: FormValues) {
    const courses: CourseRecord[] = COURSE_IDS.map((id) => ({
      id,
      status: values[id] as CourseStatus,
    }));

    const profile = {
      completedCredits: values.completedCredits,
      inProgressCredits: values.inProgressCredits,
      englishTestType: values.englishTestType as EnglishTestType,
      englishTestScore: values.englishTestScore,
      toeflIsLegacy: values.toeflDate === "legacy",
      completedEnglishComp1: values.completedEnglishComp1 === "yes",
      completedEnglishComp2: values.completedEnglishComp2 === "yes",
      intendedMajor: values.gtMajorId,
      gtMajorId: values.gtMajorId,
      uiucMajorId: values.uiucMajorId,
      purdueMajorId: values.purdueMajorId,
      utaustinMajorId: values.utaustinMajorId,
      uwmadisonMajorId: values.uwmadisonMajorId,
      courses,
    };
    onSubmit(profile);
  }

  return (
    <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-foreground mb-1">Your Academic Profile</h2>
      <p className="text-sm text-muted-foreground mb-6">
        Fill in your information to check your transfer eligibility.
      </p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8" data-testid="form-transfer">

          {/* Georgia Tech Major */}
          <div>
            <h3 className="text-base font-medium text-foreground mb-4">Georgia Tech — Intended Major</h3>
            <FormField
              control={form.control}
              name="gtMajorId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Target Major at Georgia Tech</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger data-testid="select-gt-major">
                        <SelectValue placeholder="Select a major" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {gtData.colleges.map((college) => (
                        <SelectGroup key={college.name}>
                          <SelectLabel>{college.name}</SelectLabel>
                          {college.majors.map((major) => (
                            <SelectItem key={major.id} value={major.id}>
                              {major.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Separator />

          {/* UIUC Major */}
          <div>
            <h3 className="text-base font-medium text-foreground mb-4">UIUC — Intended Major</h3>
            <FormField
              control={form.control}
              name="uiucMajorId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Target Major at UIUC</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger data-testid="select-uiuc-major">
                        <SelectValue placeholder="Select a major" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {uiucData.colleges.map((college) => (
                        <SelectGroup key={college.name}>
                          <SelectLabel>{college.name}</SelectLabel>
                          {college.majors.map((major) => (
                            <SelectItem key={major.id} value={major.id}>
                              {major.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Separator />

          {/* Purdue Major */}
          <div>
            <h3 className="text-base font-medium text-foreground mb-4">Purdue University — Intended Major</h3>
            <FormField
              control={form.control}
              name="purdueMajorId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Target Major at Purdue</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger data-testid="select-purdue-major">
                        <SelectValue placeholder="Select a major" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {purdueData.colleges.map((college) => (
                        <SelectGroup key={college.name}>
                          <SelectLabel>{college.name}</SelectLabel>
                          {college.majors.map((major) => (
                            <SelectItem key={major.id} value={major.id}>
                              {major.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Separator />

          {/* UT Austin Major */}
          <div>
            <h3 className="text-base font-medium text-foreground mb-4">UT Austin — Intended Major</h3>
            <FormField
              control={form.control}
              name="utaustinMajorId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Target Major at UT Austin (Cockrell School of Engineering)</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger data-testid="select-utaustin-major">
                        <SelectValue placeholder="Select a major" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {utaustinData.colleges.map((college) => (
                        <SelectGroup key={college.name}>
                          <SelectLabel>{college.name}</SelectLabel>
                          {college.majors.map((major) => (
                            <SelectItem key={major.id} value={major.id}>
                              {major.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Separator />

          {/* UW-Madison Major */}
          <div>
            <h3 className="text-base font-medium text-foreground mb-4">UW-Madison — Intended Major</h3>
            <FormField
              control={form.control}
              name="uwmadisonMajorId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Target Major at UW-Madison (College of Engineering)</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger data-testid="select-uwmadison-major">
                        <SelectValue placeholder="Select a major" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {uwmadisonData.colleges.map((college) => (
                        <SelectGroup key={college.name}>
                          <SelectLabel>{college.name}</SelectLabel>
                          {college.majors.map((major) => (
                            <SelectItem key={major.id} value={major.id}>
                              {major.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Separator />

          {/* Credits Section */}
          <div>
            <h3 className="text-base font-medium text-foreground mb-4">Credit Hours</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="completedCredits"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Completed Credits</FormLabel>
                    <FormControl>
                      <Input type="number" min={0} placeholder="e.g. 45" data-testid="input-completed-credits" {...field} />
                    </FormControl>
                    <FormDescription>Credits you've already finished.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="inProgressCredits"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>In-Progress Credits</FormLabel>
                    <FormControl>
                      <Input type="number" min={0} placeholder="e.g. 15" data-testid="input-inprogress-credits" {...field} />
                    </FormControl>
                    <FormDescription>Credits you're currently taking.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <Separator />

          {/* English Section */}
          <div>
            <h3 className="text-base font-medium text-foreground mb-4">English Proficiency</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="englishTestType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>English Test Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-english-test-type">
                          <SelectValue placeholder="Select test" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="TOEFL">TOEFL</SelectItem>
                        <SelectItem value="IELTS">IELTS</SelectItem>
                        <SelectItem value="Duolingo">Duolingo</SelectItem>
                        <SelectItem value="None">None / N/A</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {testType !== "None" && (
                <FormField
                  control={form.control}
                  name="englishTestScore"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {testType === "TOEFL" && toeflDate === "legacy" && "TOEFL Score (0–120, old scale)"}
                        {testType === "TOEFL" && toeflDate !== "legacy" && "TOEFL Score (new scale, 0–12)"}
                        {testType === "IELTS" && "IELTS Score (0–9.0)"}
                        {testType === "Duolingo" && "Duolingo Score (0–160)"}
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step={testType === "IELTS" ? "0.5" : testType === "TOEFL" && toeflDate !== "legacy" ? "0.5" : "1"}
                          placeholder={
                            testType === "IELTS" ? "e.g. 7.5" :
                            testType === "TOEFL" && toeflDate === "legacy" ? "e.g. 100" :
                            testType === "TOEFL" ? "e.g. 5.0" : "e.g. 130"
                          }
                          data-testid="input-english-score"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            {testType === "TOEFL" && (
              <div className="mt-4">
                <FormField
                  control={form.control}
                  name="toeflDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>TOEFL Test Date</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-toefl-date">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="new">On or after January 21, 2026 (new scale)</SelectItem>
                          <SelectItem value="legacy">Before January 21, 2026 (old scale, 0–120)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        ETS changed the TOEFL scoring system on January 21, 2026.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <FormField
                control={form.control}
                name="completedEnglishComp1"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Completed English Composition 1?</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-comp1">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="completedEnglishComp2"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Completed English Composition 2?</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-comp2">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <Separator />

          {/* Courses Section — grouped by category */}
          <div>
            <h3 className="text-base font-medium text-foreground mb-1">Courses Completed</h3>
            <p className="text-sm text-muted-foreground mb-5">
              Mark each course as completed, in progress, or not yet taken. Different universities and majors require different courses.
            </p>
            <div className="space-y-6">
              {COURSE_GROUPS.map((group) => (
                <div key={group.label}>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">{group.label}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {group.ids.map((courseId) => (
                      <FormField
                        key={courseId}
                        control={form.control}
                        name={courseId as keyof FormValues}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{COURSE_LABELS[courseId]}</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value as string}>
                              <FormControl>
                                <SelectTrigger data-testid={`select-course-${courseId}`}>
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="completed">Completed</SelectItem>
                                <SelectItem value="in-progress">In Progress</SelectItem>
                                <SelectItem value="not-taken">Not Taken</SelectItem>
                              </SelectContent>
                            </Select>
                            {COURSE_DESCRIPTIONS[courseId] && (
                              <FormDescription className="text-xs">{COURSE_DESCRIPTIONS[courseId]}</FormDescription>
                            )}
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            <p className="font-semibold mb-1">이 앱은 참고용입니다</p>
            <p className="leading-relaxed">
              결과는 공개된 공식 요건을 기반으로 한 가이드입니다. 실제 지원 전에 반드시 각 학교의 공식 편입 홈페이지를 직접 방문해 최신 요건을 확인하고, 궁금한 점은 입학처에 문의하세요.
            </p>
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="submit" data-testid="button-check-eligibility" className="flex-1 sm:flex-none">
              Check My Eligibility
            </Button>
            {hasResults && (
              <Button type="button" variant="outline" onClick={onReset} data-testid="button-reset">
                Reset
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
}
