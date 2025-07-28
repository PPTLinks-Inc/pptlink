export interface QuizData {
    quizData?: {
        questions: {
            id: string;
            question: string;
            options: string[];
            pickedOption?: number;
        }[];
        id: string;
        name: string;
        quiz: {
            description: string | null;
            duration: number;
            quizStartTime: Date;
            quizEndTime: Date;
            passingMark: number;
        };
    },
    attempt: {
        id: string;
        score: number;
        startedAt: Date;
        completedAt?: Date;
    } | null,
    isInstructor: boolean;
}

export interface QuizStore extends QuizData {
    startQuiz: boolean;
    setStartQuiz: (start: boolean) => void;

    currentQuestionIndex: number;
    setCurrentQuestionIndex: (index: number) => void;

    setQuestionOption: (questionId: string, optionIndex: number) => void;

    remainingTime: number; // in seconds
    setRemainingTime: (time: number | ((prev: number) => number)) => void;

    submitQuiz: () => Promise<void>;
}