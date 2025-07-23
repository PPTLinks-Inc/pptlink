import { authFetch } from "@/lib/axios";
import { useCourseStore } from "@/store/courseStoreProvider";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";

const questionSchema = z
  .object({
    id: z.string(),
    question: z
      .string()
      .min(1, "Question is required")
      .transform((val) => val.trim())
      .refine((val) => val.length > 0, {
        message: "Question cannot be just spaces"
      }),
    options: z
      .array(z.string())
      .length(4, "Must have exactly 4 options")
      .refine(
        (options) => {
          const nonEmptyOptions = options.filter(
            (option) => option.trim().length > 0
          );
          return nonEmptyOptions.length >= 2;
        },
        {
          message: "At least 2 options must be filled out"
        }
      ),
    correct: z
      .number({
        required_error: "Please select a correct answer",
        invalid_type_error: "Please select a correct answer"
      })
      .refine((val) => [0, 1, 2, 3].includes(val), {
        message: "Correct answer must be between 0 and 3"
      })
      .optional()
  })
  .refine(
    (data) => {
      if (data.correct === undefined) return false;
      const correctIndex = data.correct;
      const correctOption = data.options[correctIndex];
      return correctOption?.trim().length > 0;
    },
    {
      message: "The selected correct answer must have text",
      path: ["correct"]
    }
  );

export const formSchema = z.object({
  questions: z.array(questionSchema).min(1, "At least one question is required")
});

export type Question = z.infer<typeof questionSchema>;

type QuizData = {
    id: string;
    name: string;
    status: string;
    quiz: {
        description: string;
        duration: number;
        quizStartTime: string;
        quizEndTime: string;
        passingMark: number;
    };
    questions: Question[];
};

export default function useQuizData(quizId?: string) {
    const courseId = useCourseStore(state => state.courseId);

    const query = useQuery({
        queryKey: ["manageQuiz", quizId],
        queryFn: async () => {
            const { data } = await authFetch<QuizData>(
                `/api/v1/course/quiz/${courseId}/${quizId}`
            );
            console.log("Fetched quiz data:", data);
            return data;
        },
        enabled: !!quizId, // Only run the query if content.id is available
        refetchOnWindowFocus: false
    });

    return {
        data: query.data,
        isLoading: query.isLoading,
        isError: query.isError,
        isSuccess: query.isSuccess,
        refetch: query.refetch
    }
}