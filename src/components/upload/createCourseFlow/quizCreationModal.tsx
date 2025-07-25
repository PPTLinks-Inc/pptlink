import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { authFetch } from "@/lib/axios";
import formatDate from "@/lib/formatDate";
import { cn } from "@/lib/utils";
import { ContentItem } from "@/store/courseStore";
import { useCourseStore } from "@/store/courseStoreProvider";
import { useState } from "react";
import { SlCalender } from "react-icons/sl";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import useQuizData from "@/hooks/useQuizData";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const schema = z
  .object({
    quizName: z.string().min(1, "Quiz name is required"),
    quizDescription: z
      .string()
      .min(3, "Quiz description should be atleast 3 characters")
      .optional(),
    quizDuration: z.number().min(1, "Quiz duration must be at least 1 minute"),
    quizStartDate: z.date({ message: "Quiz start date is required" }),
    quizEndDate: z.date({ message: "Quiz end date is required" }),
    passingMark: z.number().min(0, "Passing mark must be a positive number")
  })
  .refine(
    (data) => {
      const startDate = data.quizStartDate;
      startDate.setHours(0, 0, 0, 0);
      const endDate = data.quizEndDate;
      endDate.setHours(23, 59, 59, 999);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      return startDate >= today && endDate > startDate;
    },
    {
      message:
        "Quiz end date must be after the start date and both must be today or in the future",
      path: ["quizEndDate", "quizStartDate"]
    }
  );
type FormData = z.infer<typeof schema>;

export default function QuizCreationModal({
  setOpenQuizCreationModal,
  quizId
}: {
  setOpenQuizCreationModal: React.Dispatch<React.SetStateAction<boolean>>;
  quizId?: string;
}) {
  const toast = useToast();
  const queryClient = useQueryClient();

  const { data } = useQuizData(quizId);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      quizName: data ? data.name : "",
      quizDescription: data ? data.quiz.description : "",
      quizDuration: data ? data.quiz.duration : 30,
      quizStartDate: data ? new Date(data.quiz.quizStartTime) : undefined,
      quizEndDate: data ? new Date(data.quiz.quizEndTime) : undefined,
      passingMark: data ? data.quiz.passingMark : 50
    }
  });

  const sections = useCourseStore((state) => state.sections);
  const selectedSectionIndex = useCourseStore(
    (state) => state.selectedSectionIndex
  );
  const setContentItems = useCourseStore((state) => state.setContentItems);

  const sectionId = sections[selectedSectionIndex].id;
  const courseId = useCourseStore((state) => state.courseId);
  const setOpenQuizQuestionModal = useCourseStore(
    (state) => state.setOpenQuizQuestionModal
  );

  const updateContentItem = useCourseStore((state) => state.updateContentItem);
  const coursePublished = useCourseStore((state) => state.published);

  const [quizStartDate, setQuizStartDate] = useState<Date | undefined>(
    data ? new Date(data.quiz.quizStartTime) : undefined
  );
  const [quizEndDate, setQuizEndDate] = useState<Date | undefined>(
    data ? new Date(data.quiz.quizEndTime) : undefined
  );

  const handleQuizActivation = useMutation({
    mutationFn: async () => {
      if (data?.status === "active") {
        await authFetch.post("/api/v1/course/quiz/stop", {
          courseId,
          quizId: quizId
        });
      } else if (
        data?.status === "not_active" ||
        data?.status === "completed"
      ) {
        await authFetch.post("/api/v1/course/quiz/start", {
          courseId,
          quizId: quizId
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["manageQuiz", quizId] });
      updateContentItem(quizId!, selectedSectionIndex, {
        status:
          data?.status === "not_active" || data?.status === "completed"
            ? "active"
            : "not_active"
      });
      toast.toast({
        title: "Quiz status updated successfully!"
      });
    },
    onError: () => {
      toast.toast({
        title: "Failed to update quiz status",
        description: "Please try again later.",
        variant: "destructive"
      });
    }
  });

  async function handleCreateQuiz(values: FormData) {
    const startyyyy = values.quizStartDate.getFullYear();
    const startmm = String(values.quizStartDate.getMonth() + 1).padStart(
      2,
      "0"
    );
    const startdd = String(values.quizStartDate.getDate()).padStart(2, "0");

    const endyyyy = values.quizEndDate.getFullYear();
    const endmm = String(values.quizEndDate.getMonth() + 1).padStart(2, "0");
    const enddd = String(values.quizEndDate.getDate()).padStart(2, "0");

    const startDate = `${startyyyy}-${startmm}-${startdd}T00:00:00.000Z`;
    const endDate = `${endyyyy}-${endmm}-${enddd}T23:59:59.999Z`;

    if (quizId) {
      try {
        await authFetch.patch("/api/v1/course/quiz", {
          courseId,
          sectionId,
          quizId,
          title: values.quizName,
          description: values.quizDescription,
          passingMark: values.passingMark,
          duration: values.quizDuration,
          quizStartDate: startDate,
          quizEndDate: endDate,
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
        });

        updateContentItem(quizId, selectedSectionIndex, {
          name: values.quizName,
        });

        toast.toast({
          title: "Quiz updated successfully!"
        });
      } catch (error) {
        toast.toast({
          title: "Failed to update quiz",
          description: "Please try again later.",
          variant: "destructive"
        });
      }

      return;
    }

    try {
      const { data } = await authFetch.post<{
        quizId: string;
        message: string;
      }>("/api/v1/course/quiz", {
        courseId,
        sectionId,
        title: values.quizName,
        description: values.quizDescription,
        passingMark: values.passingMark,
        duration: values.quizDuration,
        quizStartDate: startDate,
        quizEndDate: endDate,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
      });

      const newContentItem: ContentItem = {
        type: "QUIZ",
        name: values.quizName,
        status: "not_active",
        id: data.quizId
      };
      setOpenQuizQuestionModal(data.quizId);
      reset();
      setQuizStartDate(undefined);
      setQuizEndDate(undefined);
      setContentItems((prevContent) => [newContentItem, ...prevContent]);
      toast.toast({
        title: "Quiz created successfully!"
      });

      setOpenQuizCreationModal(false);
    } catch (error) {
      toast.toast({
        title: "Failed to create quiz",
        description: "Please try again later.",
        variant: "destructive"
      });
      setOpenQuizCreationModal(false);
    }
  }

  return (
    <DialogContent className="sm:max-w-2xl">
      <div className="h-[500px] w-full overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {quizId ? "Update Quiz" : "Create Quiz"}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 pr-5">
          <div>
            <Label htmlFor="quizName">Quiz Name</Label>
            <Input
              id="quizName"
              className="border-primaryTwo"
              {...register("quizName")}
            />
            {errors.quizName && (
              <p className="text-rose-500">{errors.quizName.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="quizDescription" className="mt-4">
              Quiz Description
            </Label>
            <Textarea
              id="quizDescription"
              className="border-primaryTwo"
              {...register("quizDescription")}
            />
            {errors.quizDescription && (
              <p className="text-rose-500">{errors.quizDescription.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="quizDuration" className="mt-4">
              Quiz Duration (in minutes)
            </Label>
            <Input
              id="quizDuration"
              inputMode="numeric"
              className="border-primaryTwo"
              {...register("quizDuration", { valueAsNumber: true })}
            />
            {errors.quizDuration && (
              <p className="text-rose-500">{errors.quizDuration.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="quizStartDate" className="mt-4">
              Quiz Start Date
            </Label>
            <Controller
              name="quizStartDate"
              control={control}
              render={({ field }) => (
                <Popover modal={true}>
                  <PopoverTrigger asChild>
                    <Button
                      disabled={data?.status === "active"}
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal bg-transparent border-[0.5px] border-black"
                      )}
                    >
                      {quizStartDate ? (
                        formatDate(quizStartDate)
                      ) : (
                        <span>Pick a quiz start date</span>
                      )}
                      <SlCalender className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      captionLayout="dropdown"
                      selected={field.value}
                      onSelect={(date) => {
                        field.onChange(date);
                        setQuizStartDate(date);
                      }}
                      disabled={(date) => {
                        if (data?.status === "active") {
                          return true; // Disable date selection if quiz is active
                        }

                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        return date < today;
                      }}
                    />
                  </PopoverContent>
                </Popover>
              )}
            />
            {errors.quizStartDate && (
              <p className="text-rose-500">{errors.quizStartDate.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="quizEndDate" className="mt-4">
              Quiz End Date
            </Label>
            <Controller
              name="quizEndDate"
              control={control}
              render={({ field }) => (
                <Popover modal={true}>
                  <PopoverTrigger asChild>
                    <Button
                      disabled={data?.status === "active"}
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal bg-transparent border-[0.5px] border-black"
                      )}
                    >
                      {quizEndDate ? (
                        formatDate(quizEndDate)
                      ) : (
                        <span>Pick a quiz end date</span>
                      )}
                      <SlCalender className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      captionLayout="dropdown"
                      selected={field.value}
                      onSelect={(date) => {
                        field.onChange(date);
                        setQuizEndDate(date);
                      }}
                      disabled={(date) => {
                        if (data?.status === "active") {
                          return true; // Disable date selection if quiz is active
                        }
                        return (
                          date < (quizStartDate ? quizStartDate : new Date())
                        );
                      }}
                    />
                  </PopoverContent>
                </Popover>
              )}
            />
            {errors.quizEndDate && (
              <p className="text-rose-500">{errors.quizEndDate.message}</p>
            )}
          </div>

          <div className="mb-20">
            <Label htmlFor="passingMark" className="mt-4">
              Passing mark
            </Label>
            <Input
              id="passingMark"
              inputMode="numeric"
              className="border-primaryTwo"
              placeholder="Enter passing mark (e.g., 50)"
              {...register("passingMark", { valueAsNumber: true })}
            />
            {errors.passingMark && (
              <p className="text-rose-500">{errors.passingMark.message}</p>
            )}
          </div>
        </div>

        <DialogFooter className="mt-4 fixed bottom-0 left-0 right-0 bg-white p-4 pr-10 rounded-b-full">
          <DialogClose>Cancel</DialogClose>

          <Button
            onClick={handleSubmit(handleCreateQuiz)}
            className="bg-primaryTwo text-white"
            disabled={isSubmitting}
          >
            {!quizId && (isSubmitting ? "Creating Quiz..." : "Create Quiz")}
            {quizId && (isSubmitting ? "Updating Quiz..." : "Update Quiz")}
          </Button>

          {quizId && (
            <Button
              variant="outline"
              disabled={
                handleQuizActivation.isPending ||
                !(data && data.questions.length > 0) || !coursePublished
              }
              className={cn(
                data?.status === "not_active" || data?.status === "completed"
                  ? "border-primaryTwo"
                  : "border-rose-500 text-rose-500 hover:bg-rose-800 hover:border-rose-800"
              )}
              onClick={() => handleQuizActivation.mutate()}
            >
              {handleQuizActivation.isPending
                ? "Loading..."
                : data?.status === "not_active" || data?.status === "completed"
                  ? "Start Quiz"
                  : "End Quiz"}
            </Button>
          )}
        </DialogFooter>
      </div>
    </DialogContent>
  );
}
