/* eslint-disable react/prop-types */
import { createContext, useState } from 'react';

// Default quiz data
const defaultQuiz = {
    title: "Marteking Quiz",
    questions: [
        {
            question: 'When was Nigerian independence',
            options: ['2025', '1960', '1996', '1967'],
        },
        {
            question: 'When was Nigerian civil war',
            options: ['2025', '2003', '1996', '1967'],
        }
    ]
};

// eslint-disable-next-line react-refresh/only-export-components
export const quizContext = createContext();

const QuizContextProvider = (props) => {
    // Initialize with defaultQuiz instead of []
    const [quiz] = useState(defaultQuiz);
    const [startQuiz, setStartQuiz] = useState(false);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [isCompleted, setIsCompleted] = useState(false);

    return (
        <quizContext.Provider value={{quiz, startQuiz, setStartQuiz, currentQuestionIndex, setCurrentQuestionIndex, isCompleted, setIsCompleted}}>
            {props.children}
        </quizContext.Provider>
    );
};

export default QuizContextProvider;