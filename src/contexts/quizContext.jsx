/* eslint-disable react/prop-types */
import { createContext, useState, useEffect } from 'react';
// Global timer
const globalTimer = 6;
// Default quiz data
const defaultQuiz = {
    title: "Marketing Quiz",
    questions: [
        {
            question: 'When was Nigerian independence',
            options: ['2025', '1960', '1996', '1967'],
            pickedAnswer: null
        },
        {
            question: 'When was Nigerian civil war',
            options: ['2025', '2003', '1996', '1967'],
            pickedAnswer: null
        },
        {
            question: 'When was Nigerian president, Goodluck elected',
            options: ['2025', '2003', '2000', '2006'],
            pickedAnswer: null
        }
    ]
};

// eslint-disable-next-line react-refresh/only-export-components
export const quizContext = createContext();

const QuizContextProvider = (props) => {
    const [quiz, setQuiz] = useState(defaultQuiz);
    const [startQuiz, setStartQuiz] = useState(false);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [isCompleted, setIsCompleted] = useState(false);
    const [timer, setTimer] = useState(globalTimer);
    const [isTimerEnabled, setIsTimerEnabled] = useState(true);
    const [selectedOption, setSelectedOption] = useState(null);

    useEffect(() => {
        if (!startQuiz || isCompleted) return;
        setTimer(globalTimer);
        let localTimer = globalTimer;
        const interval = setInterval(() => {
            localTimer -= 1;
            setTimer(localTimer);
            if (localTimer === 0) {
                clearInterval(interval);
                setCurrentQuestionIndex(prev => prev + 1);
            }
            if ((currentQuestionIndex + 1) === quiz.questions.length && localTimer === 0) {
                clearInterval(interval);
                setIsCompleted(true);
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [startQuiz, isCompleted, currentQuestionIndex, setCurrentQuestionIndex]);

    useEffect(() => {
        const picked = quiz.questions[currentQuestionIndex].pickedAnswer;
        setSelectedOption(
            picked !== null ? quiz.questions[currentQuestionIndex].options.indexOf(picked) : null
        );
    }, [currentQuestionIndex, startQuiz, quiz]);

    const handleOptionChange = (index) => {
        setSelectedOption(index);
        const updatedQuiz = { ...quiz };
        updatedQuiz.questions[currentQuestionIndex].pickedAnswer = updatedQuiz.questions[currentQuestionIndex].options[index];
        setQuiz(updatedQuiz);
    };

    return (
        <quizContext.Provider value={{ quiz, setQuiz, startQuiz, timer, setStartQuiz, currentQuestionIndex, setCurrentQuestionIndex, isCompleted, setIsCompleted, isTimerEnabled, setIsTimerEnabled, selectedOption, handleOptionChange }}>
            {props.children}
        </quizContext.Provider>
    );
};

export default QuizContextProvider;