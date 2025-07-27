import { createContext, useContext, useRef } from "react";
import { createStore, StoreApi, useStore } from "zustand";
import { QuizData, QuizStore } from "./quizStore";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { authFetch } from "@/lib/axios";

// eslint-disable-next-line react-refresh/only-export-components
export const QuizContext = createContext<StoreApi<QuizStore> | undefined>(
  undefined
);

interface QuizStoreProviderProps extends React.PropsWithChildren {}

export default function QuizStoreProvider({
  children
}: QuizStoreProviderProps) {
  const quizRef = useRef<StoreApi<QuizStore>>();
  const { courseId, quizId } = useParams<{
    courseId: string;
    quizId: string;
  }>();

  const quizQuery = useSuspenseQuery({
    queryKey: ["quiz", courseId, quizId],
    queryFn: async function () {
      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const { data } = await authFetch.get<QuizData>(
        `/api/v1/course/quiz-data/${courseId}/${quizId}`,
        {
          params: { timeZone }
        }
      );

      return data;
    }
  });

  if (!quizRef.current) {
    quizRef.current = createStore<QuizStore>((set, get) => ({
      quizData: quizQuery.data.quizData,
      attempt: quizQuery.data.attempt
        ? {
            ...quizQuery.data.attempt,
            startedAt: new Date(quizQuery.data.attempt?.startedAt || ""),
            completedAt: quizQuery.data.attempt?.completedAt
              ? new Date(quizQuery.data.attempt.completedAt || "")
              : undefined
          }
        : null,
      passingMark: quizQuery.data.quizData?.quiz.passingMark,
      isInstructor: quizQuery.data.isInstructor,
      startQuiz:
        quizQuery.data?.attempt && !quizQuery.data?.attempt.completedAt
          ? true
          : false,
      setStartQuiz: (start) => set({ startQuiz: start }),
      currentQuestionIndex: 0,
      setCurrentQuestionIndex: (index) => set({ currentQuestionIndex: index }),
      setQuestionOption: (questionId, optionIndex) => {
        set((state) => {
          if (!state.quizData?.questions) return state;

          const updatedQuestions = state.quizData.questions.map((question) => {
            if (question.id === questionId) {
              return { ...question, pickedOption: optionIndex };
            }
            return question;
          });
          return {
            quizData: { ...state.quizData, questions: updatedQuestions }
          };
        });
      },
      remainingTime: quizQuery.data.quizData
        ? quizQuery.data?.attempt && !quizQuery.data?.attempt.completedAt
          ? quizQuery.data.quizData.quiz.duration * 60 -
            Math.floor(
              (Date.now() -
                new Date(quizQuery.data.attempt.startedAt).getTime()) /
                1000
            )
          : quizQuery.data.quizData.quiz.duration * 60
        : 0, // convert minutes to seconds
      setRemainingTime: (time) => {
        set((state) => ({
          remainingTime:
            typeof time === "function" ? time(state.remainingTime) : time
        }));
      },
      submitQuiz: async function () {
        const questions = get().quizData?.questions || [];
        const pickedOptions = questions.map((question) => ({
          id: question.id,
          pickedOption:
            question.pickedOption !== undefined ? question.pickedOption : null
        }));

        const { data } = await authFetch.post(
          `/api/v1/course/quiz/submit/${courseId}/${quizId}`,
          {
            answers: pickedOptions
          }
        );

        const currentQuizData = get().quizData;

        set({
          attempt: {
            id: data.attemptedQuizId,
            score: data.score,
            completedAt: new Date(data.completedAt),
            startedAt: new Date(data.startedAt)
          },
          quizData: currentQuizData
            ? {
                ...currentQuizData,
                quiz: {
                  ...currentQuizData.quiz,
                  passingMark: data.passingMark as number
                }
              }
            : undefined
        });
      }
    }));
  }

  return (
    <QuizContext.Provider value={quizRef.current}>
      {children}
    </QuizContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useQuizStore<T>(selector: (store: QuizStore) => T) {
  const context = useContext(QuizContext);

  if (!context) {
    throw new Error("useQuizStore must be used within a QuizStoreProvider");
  }

  return useStore(context, selector);
}
