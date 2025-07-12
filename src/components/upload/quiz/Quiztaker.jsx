import { useContext } from 'react';
import { Link } from "react-router-dom";
import { useWindowSize } from '@react-hook/window-size';
import { quizContext } from '../../../contexts/quizContext';
import Confetti from 'react-confetti';
import { motion } from "framer-motion";
import logo_white from "/imgs/WHITE.png";

const QuizTaker = () => {
  const { isCompleted, currentQuestionIndex, startQuiz, timer, setStartQuiz, setIsCompleted, quiz, setCurrentQuestionIndex, isTimerEnabled, selectedOption, handleOptionChange } = useContext(quizContext);


  return (
    <div className="bg-primaryTwo w-full !h-[100svh] !text-white flex flex-col justify-between maxScreenMobile:justify-start items-center">
      <header className="w-full h-fit">
        <div className="container flex justify-between items-center gap-4">
          <Link to="/" className="block w-fit py-4">
            <span className=" text-2xl md:text-3xl font-semibold maxScreenMobile:hidden">
              PPTLINKS
            </span>
            <img
              src={logo_white}
              alt={logo_white}
              className="hidden w-8 aspect-square maxScreenMobile:block"
            />
          </Link>
          {startQuiz && <div className="py-4 pl-8 flex justify-between items-center w-[calc(80%-16px)] text-sm border-l-2 border-l-white maxScreenMobile:!w-fit maxScreenMobile:!border-none">
            <span className="block w-fit maxScreenMobile:hidden">
              question {currentQuestionIndex + 1} of {quiz.questions.length}
            </span>
            <span className='flex justify-end items-center gap-8'>
              {/* {quetionsCount.attempt ? ( */}
              <p
                className={`${timer <= 20
                  ? 'text-[#dc2626] animate-pulse font-bold'
                  : 'text-gray-300'
                  } ${isTimerEnabled ? "" : "hidden"}`}
              >
                Time: {timer}
              </p>
              {/* ) : ""} */}
              <Link to="/" className="text-[#FFA500]">
                Exit
              </Link>
            </span>
          </div>}
        </div>
      </header>

      <span className="hidden maxScreenMobile:block w-fit my-8 mx-auto">
        question {currentQuestionIndex + 1} of {quiz.questions.length}
      </span>

      <section
        className={`${!isCompleted ? "w-3/6" : "w-4/6"} mx-auto h-fit flex flex-col justify-between items-center gap-6 maxScreenMobile:!w-[90%] relative`}
      >
        {!startQuiz ? (<>
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
            {quiz.title}
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
            <p
              className={`bg-primaryTwo text-white !text-sm block w-full py-4`}
            >
              Note: this quiz will take 4 minutes as each quetions is a minutes. click next to begin quiz or exit to come back later!
            </p>
          </motion.div>
        </>) : (<>
          <div className='w-full overflow-x-auto_ overflow-y-auto max-h-[400px]'>
            <h3 className='text-xl font-semibold leading-relaxed py-4 !border-b-2 border-gray-700'>
              {quiz.questions[currentQuestionIndex].question}
            </h3>
            <div className='w-full h-fit flex flex-col justify-between align-middle gap-2 mt-4'>
              {quiz.questions[currentQuestionIndex].options.map((option, index) => (
                <label
                  key={index.toString()} 
                  htmlFor={`quetion-label-${index.toString()}`}
                  className={`flex items-center justify-between py-4 w-full cursor-pointer transition !border-b-[0.1rem] border-gray-700`}
                >
                  <span className='text-sm line-clamp-3 text-orange-400'>
                    {String.fromCharCode(index + 65)}
                  </span>
                  <span
                    className={`ml-3 mr-auto max-w-[90%] truncate_ ${selectedOption === index
                      ? 'text-orange-400'
                      : 'text-white'
                      }`}
                  >
                    {option}
                  </span>
                  <input
                    type='radio'
                    name='quiz-option'
                    id={`quetion-label-${index.toString()}`}
                    checked={selectedOption === index}
                    onChange={() => handleOptionChange(index)}
                    className={`w-5 h-5 bg-orange-400`}
                  />
                </label>
              ))}
            </div>
          </div>
        </>)}
      </section>

      <footer className="w-full h-fit pb-8 pt-3 maxScreenMobile:mt-auto maxScreenMobile:mb-0 maxScreenMobile:justify-self-end">
        <div className="container flex justify-between items-center">
          {startQuiz && currentQuestionIndex !== 0 && <button
            className={`${isTimerEnabled ? "hidden" : ""} py-2 px-8 bg-primaryTwo border-[1px] border-white rounded-md`}
            onClick={() => {
              setCurrentQuestionIndex(prev => prev - 1)
            }}
          >
            Previous
          </button>}
          {!startQuiz ? (<button
            className="block py-2 px-8 bg-primaryTwo border-[1px] border-white rounded-md ml-auto"
            onClick={() => {
              setStartQuiz(true)
            }}
          >
            Start Quiz
          </button>) : (<button
            className="block py-2 px-8 bg-primaryTwo border-[1px] border-white rounded-md ml-auto"
            onClick={() => {
              if ((currentQuestionIndex + 1) === quiz.questions.length) {
                setIsCompleted(true);
              } else {
                setCurrentQuestionIndex(prev => prev + 1);
              }
            }}
          >
            Next
          </button>)}
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

  return (
    <div className='min-h-screen overflow-y-auto bg-primaryTwo text-white flex flex-col items-center justify-center gap-4 maxScreenMobile:py-16 py-10 relative'>
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
      {<Confetti width={width} height={height} />}
      <h1 className='text-3xl font-bold'>AltSchool Africa Quiz</h1>
      {/* <h1 className='text-3xl font-bold mb-8'>{currentQuiz.Name}</h1> */}

      <div className='flex justify-center items-center p-6 bg-primaryTwo rounded-full shadow-2xl w-60 h-60 sm:w-72 sm:h-72 md:w-80 md:h-80 mb-6'>
        <span className='text-5xl sm:text-6xl md:text-7xl font-bold text-orange-500'>
          {/* {percentage}%/ */}
          {90}%
        </span>
      </div>

      {/* <p className={`text-xl sm:text-2xl font-semibold mb-4 ${remarkColor}`}> */}
      <p className={`text-xl sm:text-2xl font-semibold text-blue-40`}>
        {/* {remarkText} */}
        You did well, congratulations🎉
      </p>

      <p className='text-gray-300 mb-10'>
        {/* You answered {score} out of {total} questions correctly. */}
        You answered {100} out of {100} questions correctly.
      </p>
    </div>
  );
};

const Quiz = () => {
  const { isCompleted } = useContext(quizContext);


  return isCompleted ? (
    <Results />
  ) : (
    <QuizTaker />
  );
};

export default Quiz;
