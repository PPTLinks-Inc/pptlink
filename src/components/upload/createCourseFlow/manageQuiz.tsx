import { LoadingAssetBig } from "@/assets/assets";
import { Button } from "@/components/ui/button";
import { authFetch } from "@/lib/axios";
import { ContentItem } from "@/store/courseStore";
import { useCourseStore } from "@/store/courseStoreProvider";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import useQuizData, { formSchema, Question } from "@/hooks/useQuizData";

type Props = {
  content: ContentItem;
  setOpenQuizUpdateModal: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function ManageQuiz({ content, setOpenQuizUpdateModal }: Props) {
  const toast = useToast();
  const courseId = useCourseStore((state) => state.courseId);

  const scrollArea = useRef<HTMLDivElement>(null);

  const { data, isError, isSuccess, isLoading, refetch } = useQuizData(content.id);

  const {
    register,
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors }
  } = useForm<{
    questions: Question[];
  }>({
    defaultValues: {
      questions: data?.questions ?? []
    },
    resolver: zodResolver(formSchema)
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "questions"
  });

  useEffect(() => {
    if (data?.questions) {
      reset({
        questions: data.questions
      });
    }
  }, [data?.questions, reset]);

  useEffect(
    function () {
      if (scrollArea.current) {
        scrollArea.current.scrollIntoView({
          behavior: "smooth",
          block: "end"
        });
      }
    },
    [fields.length]
  );

  const saveMutation = useMutation({
    mutationFn: async (data: { questions: Question[] }) => {
      const response = await authFetch.post(
        `/api/v1/course/quiz/${courseId}/${content.id}/save-questions`,
        {
          questions: data.questions
        }
      );
      return response.data;
    },
    onSuccess: () => {
      toast.toast({
        title: "Questions saved successfully!"
      });
    },
    onError: () => {
      toast.toast({
        title: "Failed to create questions",
        description: "Please try again later.",
        variant: "destructive"
      });
    }
  });

  function addQuestion() {
    const newQuestion = {
      id: Date.now().toString(),
      question: "",
      options: ["", "", "", ""]
    };

    append(newQuestion);
  }

  return (
    <div>
      {isLoading && (
        <div className="flex flex-col items-center justify-center h-full">
          <LoadingAssetBig />
          <p>Loading quiz data...</p>
        </div>
      )}
      {isError && (
        <div>
          <p className="text-rose-500">Error loading quiz data</p>
          <Button onClick={() => refetch()}>Try again</Button>
        </div>
      )}
      {isSuccess && (
        <div>
          <Button onClick={addQuestion}>Add Question</Button>
          <div className="h-[400px] overflow-y-auto" id="scroll-area">
            {fields.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full">
                <p className="mt-4">No questions available</p>
                <Button
                  variant="outline"
                  type="button"
                  className="mt-2 border-primaryTwo"
                  onClick={addQuestion}
                >
                  Add First Question
                </Button>
              </div>
            ) : (
              fields.map((question, index) => (
                <Accordion
                  type="single"
                  collapsible
                  className="w-full pr-6"
                  defaultValue="item-1"
                  key={question.id}
                >
                  <AccordionItem
                    value={`item-${index}`}
                    className="border-b mt-4"
                  >
                    <AccordionTrigger className="py-4">
                      # Question {index + 1}
                    </AccordionTrigger>
                    <AccordionContent className="flex flex-col gap-4 text-balance">
                      <div>
                        <Label
                          htmlFor={`questions.${index}.question`}
                          className="block mb-2"
                        >
                          Question
                        </Label>
                        <Textarea
                          {...register(`questions.${index}.question`)}
                          id={`questions.${index}.question`}
                        ></Textarea>
                        {errors.questions?.[index]?.question && (
                          <p className="text-rose-500 text-sm">
                            {errors.questions[index]?.question?.message}
                          </p>
                        )}
                      </div>
                      {/* Options */}
                      <div>
                        <Label>Options</Label>
                        {[0, 1, 2, 3].map((optionIndex) => (
                          <div
                            key={optionIndex}
                            className={`flex flex-col gap-1 mb-3 p-2 rounded-md border ${
                              watch(`questions.${index}.correct`) ===
                              optionIndex
                                ? "bg-blue-50 border-blue-300"
                                : "border-gray-200"
                            }`}
                          >
                            <div className="flex items-center gap-4">
                              <Input
                                {...register(
                                  `questions.${index}.options.${optionIndex}`
                                )}
                                placeholder={`Option ${optionIndex + 1}`}
                                className="w-full"
                              />
                              <div className="flex items-center gap-2">
                                <Controller
                                  name={`questions.${index}.correct`}
                                  control={control}
                                  render={({ field }) => (
                                    <Input
                                      type="radio"
                                      value={optionIndex}
                                      checked={field.value === optionIndex}
                                      onChange={() =>
                                        field.onChange(optionIndex)
                                      }
                                      className="accent-blue-600 h-4 w-4 cursor-pointer"
                                      id={`correct-${index}-${optionIndex}`}
                                    />
                                  )}
                                />
                                <Label
                                  htmlFor={`correct-${index}-${optionIndex}`}
                                  className="text-sm cursor-pointer"
                                >
                                  Correct
                                </Label>
                              </div>
                            </div>
                          </div>
                        ))}

                        {/* Display errors for the options array */}
                        {errors.questions?.[index]?.options && (
                          <p className="text-rose-500 text-sm mt-2">
                            {errors.questions[index]?.options?.message}
                          </p>
                        )}

                        {/* Display errors for the correct field */}
                        {errors.questions?.[index]?.correct && (
                          <p className="text-rose-500 text-sm mt-2">
                            {errors.questions[index]?.correct?.message}
                          </p>
                        )}

                        {/* Display root-level validation errors for this question */}
                        {errors.questions?.[index]?.root && (
                          <p className="text-rose-500 text-sm mt-2">
                            {errors.questions[index]?.root?.message}
                          </p>
                        )}
                      </div>
                      {/* Delete */}
                      <Button
                        variant="destructive"
                        type="button"
                        className="w-fit"
                        onClick={() => remove(index)}
                      >
                        Delete Question
                      </Button>
                    </AccordionContent>
                  </AccordionItem>
                  <div ref={scrollArea}></div>
                </Accordion>
              ))
            )}
          </div>
        </div>
      )}
      <DialogFooter>
        <DialogClose asChild>
          <Button
            className={"border-primaryTwo"}
            variant="outline"
            onClick={() => {
              const body = document.querySelector("body");
              if (body) {
                // remove event none from the body
                body.style.pointerEvents = "auto";
              }
              setOpenQuizUpdateModal(true);
            }}
          >
            Manage Quiz
          </Button>
        </DialogClose>
        <Button
          disabled={saveMutation.isPending}
          type="button"
          onClick={handleSubmit((data) => saveMutation.mutate(data))}
        >
          {saveMutation.isPending ? "Saving..." : "Save Quiz"}
        </Button>
      </DialogFooter>
    </div>
  );
}
