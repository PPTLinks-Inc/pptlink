import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
// import { ArrowRight, ArrowLeft } from '@mui/icons-material';
// created a context to handle the quiz data. This context acts like
//  how the database should behave
import { quizContext } from '../../../contexts/quizContext';

// a visual representation of the quizContext Array
// const quizContext = [
//   {
//     id: quizId, 
//     Name: 'My first Quiz',
//     timed: true,
//     createdBy: userId,
//     rightAns: 3,
//     questions: [
//       {
//         question: 'When was Nigerian independence',
//         options: [
//           { optionsA: '2025', correct: false },
//           { optionsB: '1960', correct: true },
//           { optionsA: '1996', correct: false },
//           { optionsA: '1967', correct: false },
//         ],
//       },

//       {
//         question: 'When was Nigerian civil war',
//         options: [
//           { optionsA: '2025', correct: false },
//           { optionsB: '1960', correct: false },
//           { optionsA: '1996', correct: false },
//           { optionsA: '1967', correct: true },
//         ],
//       },
//     ],
//   },
// ];

const buttonBase =
  'w-48 py-2 px-4 bg-gray-700 hover:bg-green-600 rounded-lg text-white font-medium transition';

// in pptlinks, the user MUST be signed in hence i created account
// selection to simulate a user being signed in
const AccountSelection = ({ onSelect }) => (
  <div className='flex flex-col items-center space-y-6 p-10 bg-gray-800 rounded-2xl shadow-xl'>
    <h1 className='text-2xl font-semibold'>Choose an account</h1>
    <button className={buttonBase} onClick={() => onSelect('123')}>
      Account 1
    </button>
    <button className={buttonBase} onClick={() => onSelect('112')}>
      Account 2
    </button>
  </div>
);

// this is the modal where the user will input the quiz questions
const CreateQuizModal = ({ onClose, onSubmit, userId, selectedAccount }) => {
  const { quiz, setQuiz } = useContext(quizContext);
  const [quizName, setQuizName] = useState('');
  const [isTimed, setIsTimed] = useState(true);
  const [error, setError] = useState('');
  const [modal2, setModal2] = useState(false);
  const [textArea, setTextArea] = useState('');
  const [optionA, setOptionA] = useState({ option: '', checked: false });
  const [optionB, setOptionB] = useState({ option: '', checked: false });
  const [optionC, setOptionC] = useState({ option: '', checked: false });
  const [optionD, setOptionD] = useState({ option: '', checked: false });

  const [createQuiz, setCreateQuiz] = useState([]);
  const [quizNum, setQuizNum] = useState(0);
  const position = checkPosition();

  // this resets all the question options to empty and false. This works when a user
  //  presses the delete button
  const resetOptions = () => {
    setOptionA({ option: '', checked: false });
    setOptionB({ option: '', checked: false });
    setOptionC({ option: '', checked: false });
    setOptionD({ option: '', checked: false });
  };

  // this code will be useless when you use radio buttons
  const unCheck = () => {
    setOptionA((prev) => ({ ...prev, checked: false }));
    setOptionB((prev) => ({ ...prev, checked: false }));
    setOptionC((prev) => ({ ...prev, checked: false }));
    setOptionD((prev) => ({ ...prev, checked: false }));
  };

  // this code allows a user to go back and see he's previous questions
  // when a user is on a previous question, the question and options are added to the
  // input areas and hence can be edited if the user makes any changes
  const prevClick = () => {
    const newIndex = quizNum - 1;
    if (newIndex >= 0 && newIndex < createQuiz.length) {
      setQuizNum(newIndex);

      // sets the input values to the question values
      const { question, options } = createQuiz[newIndex];
      setTextArea(question);
      setOptionA(options[0]);
      setOptionB(options[1]);
      setOptionC(options[2]);
      setOptionD(options[3]);
    }
  };

  // this code allows a user to go next and see he's ahead questions
  // when a user is on a next question, the question and options are added to the
  // input areas and hence can be edited if the user makes any changes
  const nextClick = () => {
    // edits the field which shows which question the user is currently on... E.G
    // Question 11/30
    const newIndex = quizNum + 1;

    if (newIndex >= createQuiz.length) {
      setQuizNum(newIndex);
      setTextArea('');
      resetOptions();
    } else {
      // sets the input values to the question values

      setQuizNum(newIndex);
      const { question, options } = createQuiz[newIndex];
      setTextArea(question);
      setOptionA(options[0]);
      setOptionB(options[1]);
      setOptionC(options[2]);
      setOptionD(options[3]);
    }
  };

  // Delete a question and updates the quiz number
  // if the user is on 1/1 and he has made inputs but not added to the Array,
  // it will remove all inputs the user has made
  const Del = () => {
    if (quizNum >= createQuiz.length) {
      if (createQuiz.length === 0) return;

      setQuizNum(quizNum - 1);
      const { question, options } = createQuiz[quizNum - 1];
      setTextArea(question);
      setOptionA(options[0]);
      setOptionB(options[1]);
      setOptionC(options[2]);
      setOptionD(options[3]);
      return;
    }

    // if the first question is the first one, remove it from the array
    // and set the inputs to the next quiz
    if (quizNum === 0) {
      const updated = [...createQuiz];
      updated.splice(0, 1);
      setCreateQuiz(updated);

      if (updated.length > 0) {
        const { question, options } = updated[0];
        setTextArea(question);
        setOptionA(options[0]);
        setOptionB(options[1]);
        setOptionC(options[2]);
        setOptionD(options[3]);
      } else {
        setTextArea('');
        resetOptions();
      }
      return;
    }

    // if it is not the first or last question, it removes the question from the
    //  array and moves one step forward

    if (quizNum > 0 && quizNum < createQuiz.length) {
      const updated = [...createQuiz];
      updated.splice(quizNum, 1);
      const newIndex = quizNum - 1;
      setCreateQuiz(updated);
      setQuizNum(newIndex);

      const { question, options } = updated[newIndex];
      setTextArea(question);
      setOptionA(options[0]);
      setOptionB(options[1]);
      setOptionC(options[2]);
      setOptionD(options[3]);
    }
  };

  const handleSubmit = () => {
    if (!modal2) {
      if (quizName.trim().length < 4) {
        setError('Quiz name must be at least 4 characters long.');
        return;
      }
      setError('');
      setModal2(true);
      onSubmit({ quizName: quizName.trim(), isTimed });
    } else {
      setTextArea('');
      setOptionA({ option: '', checked: false });
      setOptionB({ option: '', checked: false });
      setOptionC({ option: '', checked: false });
      setOptionD({ option: '', checked: false });
    }
  };

  const validateQuestion = (question, options) => {
    const errors = {};

    if (question.trim().length <= 4) {
      errors.question = 'Enter a question of more than 4 letters.';
    }

    const filledOptions = options.filter((opt) => opt.option.trim() !== '');
    if (filledOptions.length < 2) {
      errors.options = 'Questions must have at least two options.';
    }

    const hasCorrect = options.some((opt) => opt.checked === true);
    if (!hasCorrect) {
      errors.correct = 'At least one option must be marked as correct.';
    }

    const checkedEmpty = options.find(
      (opt) => opt.checked && opt.option.trim() === ''
    );
    if (checkedEmpty) {
      errors.checked = 'Marked correct option must have text.';
    }

    return errors;
  };

  const addNewQuestion = () => {
    const options = [optionA, optionB, optionC, optionD];
    const newErrors = validateQuestion(textArea, options);

    if (Object.keys(newErrors).length > 0) {
      setError(newErrors);
      return;
    }

    setCreateQuiz((prev) => [...prev, { question: textArea, options }]);
    setQuizNum(quizNum + 1);

    setError({});
    setTextArea('');
    resetOptions();
  };

  function checkPosition() {
    if (quizNum === 0 && createQuiz.length === 0)
      return { front: false, back: false };
    if (quizNum === 0) return { front: true, back: false };
    if (quizNum >= createQuiz.length) return { front: false, back: true };
    return { front: true, back: true };
  }

  const finishQuiz = () => {
    const options = [optionA, optionB, optionC, optionD];
    const newErrors = validateQuestion(textArea, options);

    let finalQuestions = [...createQuiz];

    // If the current inputs are valid, add the last question too
    if (Object.keys(newErrors).length === 0 && textArea.trim()) {
      finalQuestions.push({ question: textArea, options });
    } else if (createQuiz.length === 0) {
      setError(newErrors);
      return;
    }

    setQuiz((prev) => [
      ...prev,
      {
        Name: quizName,
        questions: finalQuestions,
        createdBy: userId, // creator ID
        timed: isTimed,
        rightAns: 0,
      },
    ]);

    setError({});
    onClose();
  };

  return (
    <div
      className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'
      onClick={onClose}
    >
      <div
        className='bg-gray-800 text-white p-4 rounded-xl shadow-lg w-[90%] max-w-md space-y-2 relative'
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className='absolute top-3 right-4 text-xl text-gray-300 hover:text-white'
          onClick={onClose}
        >
          ×
        </button>

        {!modal2 ? (
          <>
            <h2 className='text-xl font-semibold mb-2'>Create New Quiz</h2>
            <div>
              <label className='block mb-1 font-medium'>Quiz Name</label>
              <input
                type='text'
                value={quizName}
                onChange={(e) => setQuizName(e.target.value)}
                className='w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-green-500'
                placeholder='Enter quiz name'
              />
              {error && <p className='text-red-400 mt-1 text-sm'>{error}</p>}
            </div>

            <div className='flex items-start space-x-3 mt-4'>
              <input
                type='checkbox'
                checked={isTimed}
                onChange={() => setIsTimed(!isTimed)}
                className='mt-1'
              />
              <p className='text-sm text-gray-300'>
                Enable timer (1 minutes per question).
              </p>
            </div>

            <button
              className={`${buttonBase} w-full mt-4`}
              onClick={handleSubmit}
            >
              Submit Quiz
            </button>
          </>
        ) : (
          <div className='scale-[0.9]'>
            <h2 className='text-xl font-semibold mb-2'>Set Question</h2>
            <div>
              <label className='block mb-1 font-medium'>
                Question {quizNum + 1}
              </label>
              <textarea
                className='w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-green-500'
                placeholder='Enter question'
                onChange={(e) => setTextArea(e.target.value)}
                value={textArea}
              />
            </div>

            <div className='flex flex-col'>
              <label className='block mb-1 font-medium'>Add Option</label>
              {[
                ['A', optionA, setOptionA],
                ['B', optionB, setOptionB],
                ['C', optionC, setOptionC],
                ['D', optionD, setOptionD],
              ].map(([label, opt, setOpt], idx) => (
                <div className='flex items-start mt-4' key={label}>
                  <h3 className='h-full'>{label}. </h3>
                  <input
                    type='text'
                    value={opt.option}
                    onChange={(e) => setOpt({ ...opt, option: e.target.value })}
                    className='w-[90%] p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-green-500'
                    placeholder='Enter option'
                  />
                  <input
                    type='checkbox'
                    checked={opt.checked}
                    onChange={() => {
                      unCheck();
                      setOpt({ ...opt, checked: !opt.checked });
                    }}
                    className='m-auto'
                  />
                </div>
              ))}
            </div>

            <button className={`${buttonBase} hover:bg-red mt-4`} onClick={Del}>
              Delete
            </button>

            {error && Object.values(error).length > 0 && (
              <div className='mt-2 space-y-1'>
                {Object.values(error).map((err, idx) => (
                  <p
                    key={idx}
                    className='text-sm text-red-500 bg-red-50 border border-red-200 rounded px-3 py-1'
                  >
                    {err}
                  </p>
                ))}
              </div>
            )}

            <div className='mt-2 flex items-center'>
              <div className='flex justify-between w-[70px] pr-1'>
                <div
                  onClick={prevClick}
                  className={`w-[30px] h-[30px] flex items-center cursor-pointer justify-center rounded-[4px] border ${
                    !position.back ? 'invisible' : ''
                  }`}
                >
                  {/* <ArrowLeft /> */}
                  LT
                </div>

                <div
                  onClick={nextClick}
                  className={`w-[30px] h-[30px] cursor-pointer flex items-center justify-center rounded-[4px] border ${
                    !position.front ? 'invisible' : ''
                  }`}
                >
                  {/* <ArrowRight /> */}
                  RT
                </div>
              </div>

              <button className={`${buttonBase} grow`} onClick={addNewQuestion}>
                Add New Question
              </button>
            </div>

            <div className='w-full border mt-4'></div>
            <button
              onClick={() => finishQuiz()}
              className={`${buttonBase}  w-full mt-4`}
            >
              Finish
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const UserDashboard = ({ userId, quizName, setQuizName, onLogout }) => {
  const { quiz, setQuiz } = useContext(quizContext);
  const [showModal, setShowModal] = useState(false);

  const handleSubmitQuiz = (data) => {};

  const navigate = useNavigate();

  return (
    <div className='flex flex-col items-center space-y-6 p-10 bg-gray-800 rounded-2xl shadow-xl w-[90%] max-w-2xl'>
      <h1 className='text-2xl font-semibold'>Welcome, User {userId}</h1>

      <button className={buttonBase} onClick={() => setShowModal(true)}>
        Create New Quiz
      </button>

      <div className='w-full mt-6 space-y-4'>
        <h2 className='text-lg font-medium mb-2'>Available Quizzes</h2>
        {quiz.map((quiz, index) => (
          <div
            key={index}
            className='bg-gray-700 p-4 rounded-lg hover:bg-gray-600 cursor-pointer transition'
            onClick={() => navigate('/quiz')}
          >
            <p className='font-semibold'>{quiz.Name}</p>
            <p className='text-sm text-gray-300'>Created by {quiz.name}</p>
          </div>
        ))}
      </div>

      <button className={`${buttonBase} mt-6`} onClick={onLogout}>
        Logout
      </button>

      {showModal && (
        <CreateQuizModal
          onClose={() => setShowModal(false)}
          onSubmit={handleSubmitQuiz}
          userId={userId}
          setQuizName={setQuizName}
        />
      )}
    </div>
  );
};

const App = () => {
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [quizName, setQuizName] = useState('');

  const handleSelect = (id) => setSelectedAccount(id);
  const handleLogout = () => setSelectedAccount(null);

  return (
    <div className='min-h-screen bg-gray-900 text-white flex items-center justify-center'>
      {!selectedAccount ? (
        <AccountSelection onSelect={(id) => handleSelect(id)} />
      ) : (
        <UserDashboard
          userId={selectedAccount}
          quizName={quizName}
          setQuizName={setQuizName}
          onLogout={handleLogout}
        />
      )}
    </div>
  );
};

export default App;
