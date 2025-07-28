import { Link, useParams } from "react-router-dom";
import { useWindowSize } from "@react-hook/window-size";
import Confetti from "react-confetti";
import { motion } from "framer-motion";
import logo_white from "/imgs/WHITE.png";
import { useQuizStore } from "../../../store/quizStoreProvider";
import { useMutation } from "@tanstack/react-query";
import Timer from "./Timer";
import { authFetch } from "@/lib/axios";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useState } from "react";

const QuizTaker = () => {
  const { courseId, quizId } = useParams() as {
    courseId: string;
    quizId: string;
  };

  const toast = useToast();

  const startQuiz = useQuizStore((state) => state.startQuiz);
  const setStartQuiz = useQuizStore((state) => state.setStartQuiz);
  const currentQuestionIndex = useQuizStore(
    (state) => state.currentQuestionIndex
  );
  const questions = useQuizStore((state) => state.quizData?.questions || []);
  const quizName = useQuizStore((state) => state.quizData?.name || "Quiz");
  const quizDescription = useQuizStore(
    (state) => state.quizData?.quiz.description || ""
  );

  const setQuestionOption = useQuizStore((state) => state.setQuestionOption);
  const setCurrentQuestionIndex = useQuizStore(
    (state) => state.setCurrentQuestionIndex
  );

  const submitQuiz = useQuizStore((state) => state.submitQuiz);

  const isInstructor = useQuizStore((state) => state.isInstructor);

  const submitQuizMutation = useMutation({
    mutationFn: submitQuiz
  });

  const startQuizMutation = useMutation({
    mutationFn: async () => {
      await authFetch.post<{
        message: string;
        startedAt: string;
      }>(`/api/v1/course/quiz/attempt/${courseId}/${quizId}`);
    },
    onSuccess: () => {
      setStartQuiz(true);
    },
    onError: () => {
      toast.toast({
        title: "Error",
        description: "An error occurred while starting the quiz.",
        variant: "destructive"
      });
    }
  });

  return (
    <div className="bg-primaryTwo w-full !h-[100svh] !text-white flex flex-col justify-between maxScreenMobile:justify-start items-center">
      <header className="w-full h-fit">
        <div className="container flex justify-between items-center gap-4">
          <Link to="/" className="block w-fit py-4">
            <span className=" text-2xl md:text-3xl font-semibold maxScreenMobile:hidden">
              PPTLinks
            </span>
            <img
              src={logo_white}
              alt={logo_white}
              className="hidden w-8 aspect-square maxScreenMobile:block"
            />
          </Link>
          <div
            className={cn(
              "py-4 pl-8 flex justify-between items-center w-[calc(80%-16px)] text-sm border-l-2 border-l-white maxScreenMobile:!w-fit maxScreenMobile:!border-none",
              !startQuiz && "border-l-0"
            )}
          >
            {startQuiz ? (
              <span className="block w-fit maxScreenMobile:hidden">
                question {currentQuestionIndex + 1} of {questions.length}
              </span>
            ) : (
              <span></span>
            )}
            <span className="flex justify-end items-center gap-8">
              <Timer />
              <Link
                to={`/course/preview/${courseId}`}
                className="text-[#FFA500]"
              >
                Exit
              </Link>
            </span>
          </div>
        </div>
      </header>

      <span className="hidden maxScreenMobile:block w-fit my-8 mx-auto">
        question {currentQuestionIndex + 1} of {questions.length}
      </span>

      <section className="w-1/2 mx-auto h-fit flex flex-col justify-between items-center gap-6 maxScreenMobile:!w-[90%] relative">
        {!startQuiz ? (
          <>
            <motion.h1
              initial={{ y: 10, opacity: 0 }}
              whileInView={{
                opacity: 1,
                y: 0,
                transition: {
                  duration: 0.5,
                  type: "spring", // Changed from "tween"
                  stiffness: 100,
                  damping: 10
                }
              }}
              viewport={{ once: true }}
              className="w-full text-2xl md:text-3xl font-bold text-center"
            >
              {quizName}
            </motion.h1>
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              whileInView={{
                opacity: 1,
                y: 0,
                transition: {
                  duration: 0.5,
                  type: "spring", // Changed from "tween"
                  stiffness: 150,
                  damping: 10
                }
              }}
              viewport={{ once: true }}
              className="w-full h-fit"
            >
              <p className="bg-primaryTwo text-white !text-sm block w-full py-4 text-center italic">
                {quizDescription}
              </p>

              <p className="text-center mt-6">
                <span className="text-rose-500">*</span> Note: Your answers will not be saved if you leave this page.
              </p>
            </motion.div>
          </>
        ) : (
          <>
            <div className="w-full overflow-x-auto_ overflow-y-auto max-h-[400px]">
              <h3 className="text-xl font-semibold leading-relaxed py-4 !border-b-2 border-gray-700">
                {questions[currentQuestionIndex].question}
              </h3>
              <div className="w-full h-fit flex flex-col justify-between align-middle gap-2 mt-4">
                {questions[currentQuestionIndex].options.map(
                  (option, index) =>
                    (option || "").trim() && (
                      <label
                        key={index.toString()}
                        htmlFor={`quetion-label-${index.toString()}`}
                        className={`flex items-center justify-between py-4 w-full cursor-pointer transition !border-b-[0.1rem] border-gray-700`}
                      >
                        <span className="text-sm line-clamp-3 text-orange-400">
                          {String.fromCharCode(index + 65)}
                        </span>
                        <span
                          className={`ml-3 mr-auto max-w-[90%] truncate_ ${
                            questions[currentQuestionIndex].pickedOption ===
                            index
                              ? "text-orange-400"
                              : "text-white"
                          }`}
                        >
                          {option}
                        </span>
                        <input
                          type="radio"
                          name="quiz-option"
                          id={`quetion-label-${index.toString()}`}
                          checked={
                            questions[currentQuestionIndex].pickedOption ===
                            index
                          }
                          disabled={isInstructor}
                          onChange={() =>
                            setQuestionOption(
                              questions[currentQuestionIndex].id,
                              index
                            )
                          }
                          className={`w-5 h-5 bg-orange-400`}
                        />
                      </label>
                    )
                )}
              </div>
            </div>
          </>
        )}
      </section>

      <footer className="w-full h-fit pb-8 pt-3 maxScreenMobile:mt-auto maxScreenMobile:mb-0 maxScreenMobile:justify-self-end">
        <div className="container flex justify-between items-center">
          {startQuiz && currentQuestionIndex !== 0 && (
            <button
              className="py-2 px-8 bg-primaryTwo border-[1px] border-white rounded-md"
              onClick={() => {
                setCurrentQuestionIndex(currentQuestionIndex - 1);
              }}
            >
              Previous
            </button>
          )}
          {!startQuiz ? (
            <button
              className="block py-2 px-8 bg-primaryTwo border-[1px] border-white rounded-md ml-auto disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => {
                isInstructor ? setStartQuiz(true) : startQuizMutation.mutate();
              }}
              disabled={startQuizMutation.isPending}
            >
              {isInstructor
                ? "See Questions"
                : startQuizMutation.isPending
                  ? "Starting Quiz..."
                  : "Start Quiz"}
            </button>
          ) : (
            <button
              className="block py-2 px-8 bg-primaryTwo border-[1px] border-white rounded-md ml-auto disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => {
                if (currentQuestionIndex + 1 === questions.length) {
                  submitQuizMutation.mutate();
                } else {
                  setCurrentQuestionIndex(currentQuestionIndex + 1);
                }
              }}
              disabled={
                (currentQuestionIndex + 1 === questions.length &&
                  isInstructor) ||
                submitQuizMutation.isPending
              }
            >
              {currentQuestionIndex + 1 === questions.length
                ? submitQuizMutation.isPending ? "Submitting..." : "Submit"
                : "Next"}
            </button>
          )}
        </div>
      </footer>
    </div>
  );
};

const Results = () => {
  // const currentQuiz = quizData[0];
  // const total = currentQuiz.questions.length;
  // const score = Number(currentQuiz.rightAnswers || 0);
  // const percentage = Math.round((score / total) * 100);

  // const getRemark = () => {
  //   if (percentage >= 70)
  //     return { text: 'Excellent 🏆', color: 'text-green-500' };
  //   if (percentage >= 60) return { text: 'Good 👍', color: 'text-blue-400' };
  //   if (percentage >= 50)
  //     return { text: 'Average 😐', color: 'text-yellow-400' };
  //   return { text: 'Poor 😞', color: 'text-red-500' };
  // };

  // const { text: remarkText, color: remarkColor } = getRemark();
  const [width, height] = useWindowSize();

  const attempt = useQuizStore((state) => state.attempt!);
  const passingMark = useQuizStore((state) => state.quizData?.quiz.passingMark ?? 0);
  const quizName = useQuizStore((state) => state.quizData?.name || "Quiz");

  const totalQuestions = useQuizStore(state => state.quizData?.questions.length || 0);
  const passedQuestion = attempt.score / (100 / totalQuestions);

  const [remarkMessage] = useState(
    attempt.score >= passingMark ? "You did well, congratulations🎉" : "You did not pass, better luck next time!"
  );

  return (
    <div className="min-h-screen overflow-y-auto bg-primaryTwo text-white flex flex-col items-center justify-center gap-4 maxScreenMobile:py-16 py-10 relative">
      <Link to="/" className="block w-fit absolute top-3 left-4">
        <span className="text-2xl md:text-3xl font-semibold hidden">
          PPTLINKS
        </span>
        <img
          src={logo_white}
          alt={logo_white}
          className="w-8 aspect-square block"
        />
      </Link>
      {/* {percentage >= 70 && <Confetti width={width} height={height} />} */}
      {attempt.score >= passingMark && (
        <Confetti width={width} height={height} />
      )}
      <h1 className="text-3xl font-bold">{quizName}</h1>
      {/* <h1 className='text-3xl font-bold mb-8'>{currentQuiz.Name}</h1> */}

      <div className="flex justify-center items-center p-6 bg-primaryTwo rounded-full shadow-2xl w-60 h-60 sm:w-72 sm:h-72 md:w-80 md:h-80 mb-6">
        <span className="text-5xl sm:text-6xl md:text-7xl font-bold text-orange-500">
          {/* {percentage}%/ */}
          {attempt.score}%
        </span>
      </div>

      {/* <p className={`text-xl sm:text-2xl font-semibold mb-4 ${remarkColor}`}> */}
      <p className={`text-xl sm:text-2xl font-semibold text-blue-40`}>
        {/* {remarkText} */}
        {remarkMessage}
      </p>

      <p className="text-gray-300 mb-10">
        {/* You answered {score} out of {total} questions correctly. */}
        You answered {passedQuestion} out of {totalQuestions} questions correctly.
      </p>
    </div>
  );
};

const Quiz = () => {
  const completedAt = useQuizStore((state) => state.attempt?.completedAt);

  return completedAt ? <Results /> : <QuizTaker />;
};

export default Quiz;
