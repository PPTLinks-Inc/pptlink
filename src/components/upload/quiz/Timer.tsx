import { cn } from "@/lib/utils";
import { useQuizStore } from "@/store/quizStoreProvider";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { LoadingAssetBig } from "@/assets/assets";

export default function Timer() {
  const setRemainingTime = useQuizStore((state) => state.setRemainingTime);
  const remainingTime = useQuizStore((state) => state.remainingTime);
  const startQuiz = useQuizStore((state) => state.startQuiz);

  const isInstructor = useQuizStore((state) => state.isInstructor);

  const submitQuiz = useQuizStore((state) => state.submitQuiz);

  const submitQuizMutation = useMutation({
    mutationFn: submitQuiz
  });

  const [remainingTimeInMinutes, setRemainingTimeInMinutes] = useState(
    Math.floor(remainingTime / 60)
  );
  const [remainingTimeInSeconds, setRemainingTimeInSeconds] = useState(
    remainingTime % 60
  );

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(
    function () {
      if (isInstructor) {
        return;
      }

      if (startQuiz && !timerRef.current) {
        timerRef.current = setInterval(() => {
          setRemainingTime((prev) => {
            const minutes = Math.floor(prev / 60);
            const seconds = prev % 60;
            setRemainingTimeInMinutes(minutes);
            setRemainingTimeInSeconds(seconds);
            if (prev <= 0) {
              clearInterval(timerRef.current!);
              submitQuizMutation.mutate();
              return 0;
            }

            return prev - 1;
          });
        }, 1000);
      }

      return () => {
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
      };
    },
    [startQuiz]
  );

  return (
    <>
      <p
        className={cn(
          "text-gray-300 animate-pulse font-bold text-lg",
          remainingTimeInMinutes <= 1 && "text-[#dc2626]"
        )}
      >
        Time: {remainingTimeInMinutes.toString().padStart(2, "0")}:
        {remainingTimeInSeconds.toString().padStart(2, "0")}
      </p>
      <AlertDialog
        open={submitQuizMutation.isPending}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Time&apos;s Up!</AlertDialogTitle>
            <div className="flex flex-col justify-center items-center">
              <LoadingAssetBig />
              <p>
                Your time is up! The quiz is submitting automatically. Do not
                close the browser
              </p>
            </div>
          </AlertDialogHeader>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
