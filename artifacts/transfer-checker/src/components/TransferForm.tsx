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
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { StudentProfile, CourseRecord, CourseStatus, EnglishTestType } from "@/lib/eligibility";

const COURSE_IDS = ["calc1", "calc2", "calc3", "physics1", "physics2", "chem1", "computing", "advancedScience", "englishComp"] as const;
const COURSE_LABELS: Record<string, string> = {
  calc1: "Calculus I",
  calc2: "Calculus II",
  calc3: "Calculus III",
  physics1: "Physics 1 (Calculus-based)",
  physics2: "Physics 2 (Calculus-based)",
  chem1: "Chemistry I + Lab",
  computing: "Computing / Programming",
  advancedScience: "Advanced Math / Science Elective",
  englishComp: "English Composition or Speech",
};
const COURSE_DESCRIPTIONS: Record<string, string> = {
  calc3: "Required by UIUC (MATH 241)",
  computing: "Required by UIUC — CS 101, CS 124, SE 101, or ME 170",
  advancedScience: "Required by Purdue — advanced math, chem, or physics course",
  englishComp: "Required by Purdue as pre-transfer coursework",
};

const courseStatusEnum = z.enum(["completed", "in-progress", "not-taken"]);

const formSchema = z.object({
  completedCredits: z.coerce.number().min(0, "Must be 0 or more").max(300, "Enter a realistic number"),
  inProgressCredits: z.coerce.number().min(0, "Must be 0 or more").max(100, "Enter a realistic number"),
  englishTestType: z.enum(["TOEFL", "IELTS", "Duolingo", "None"]),
  englishTestScore: z.coerce.number().min(0).max(160),
  toeflDate: z.enum(["legacy", "new"]).optional(),
  completedEnglishComp1: z.enum(["yes", "no"]),
  completedEnglishComp2: z.enum(["yes", "no"]),
  intendedMajor: z.string().min(1, "Please select a major"),
  calc1: courseStatusEnum,
  calc2: courseStatusEnum,
  calc3: courseStatusEnum,
  physics1: courseStatusEnum,
  physics2: courseStatusEnum,
  chem1: courseStatusEnum,
  computing: courseStatusEnum,
  advancedScience: courseStatusEnum,
  englishComp: courseStatusEnum,
});

type FormValues = z.infer<typeof formSchema>;

interface TransferFormProps {
  onSubmit: (profile: StudentProfile) => void;
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
      intendedMajor: "Mechanical Engineering",
      calc1: "not-taken",
      calc2: "not-taken",
      calc3: "not-taken",
      physics1: "not-taken",
      physics2: "not-taken",
      chem1: "not-taken",
      computing: "not-taken",
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

    const profile: StudentProfile = {
      completedCredits: values.completedCredits,
      inProgressCredits: values.inProgressCredits,
      englishTestType: values.englishTestType as EnglishTestType,
      englishTestScore: values.englishTestScore,
      toeflIsLegacy: values.toeflDate === "legacy",
      completedEnglishComp1: values.completedEnglishComp1 === "yes",
      completedEnglishComp2: values.completedEnglishComp2 === "yes",
      intendedMajor: values.intendedMajor,
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
                      <Input
                        type="number"
                        min={0}
                        placeholder="e.g. 45"
                        data-testid="input-completed-credits"
                        {...field}
                      />
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
                      <Input
                        type="number"
                        min={0}
                        placeholder="e.g. 15"
                        data-testid="input-inprogress-credits"
                        {...field}
                      />
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
                        ETS changed the TOEFL scoring system on January 21, 2026. Select which scale your score is on.
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

          {/* Intended Major */}
          <FormField
            control={form.control}
            name="intendedMajor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Intended Major</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger data-testid="select-major">
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Mechanical Engineering">Mechanical Engineering</SelectItem>
                    <SelectItem value="Electrical Engineering">Electrical Engineering</SelectItem>
                    <SelectItem value="Computer Science">Computer Science</SelectItem>
                    <SelectItem value="Civil Engineering">Civil Engineering</SelectItem>
                    <SelectItem value="Chemical Engineering">Chemical Engineering</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Note: Requirements shown are specifically for Mechanical Engineering programs at these universities.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Separator />

          {/* Courses Section */}
          <div>
            <h3 className="text-base font-medium text-foreground mb-1">Required Courses</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Mark each course as completed, in progress, or not yet taken. Different universities require different courses — mark all that apply to your situation.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {COURSE_IDS.map((courseId) => (
                <FormField
                  key={courseId}
                  control={form.control}
                  name={courseId}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{COURSE_LABELS[courseId]}</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
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

          <div className="flex gap-3 pt-2">
            <Button type="submit" data-testid="button-check-eligibility" className="flex-1 sm:flex-none">
              Check Eligibility
            </Button>
            {hasResults && (
              <Button
                type="button"
                variant="outline"
                onClick={onReset}
                data-testid="button-reset"
              >
                Reset
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
}
