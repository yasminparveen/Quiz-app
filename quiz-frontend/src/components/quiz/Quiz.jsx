import React, { useState, useEffect } from 'react';
import { Button, Radio, Card } from 'antd';

const Quiz = ({ quizUrl, onQuizComplete }) => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);

  // Fetch the questions from the API
  useEffect(() => {
    if (quizUrl) {
      fetch(quizUrl)
        .then((response) => response.json())
        .then((data) => setQuestions(data.results))
        .catch((error) => console.error('Error fetching the quiz data:', error));
    }
  }, [quizUrl]);

  const handleAnswerChange = (e) => {
    setSelectedAnswer(e.target.value);
  };

  const handleNextQuestion = () => {
    const correctAnswer = questions[currentQuestionIndex].correct_answer;
    if (selectedAnswer === correctAnswer) {
      setScore(score + 1);
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
    } else {
      setIsQuizCompleted(true);
      onQuizComplete(score + (selectedAnswer === correctAnswer ? 1 : 0));
    }
  };

  if (!quizUrl) {
    return <div className="text-white text-center py-8">Please select a category to start the quiz.</div>;
  }

  if (questions.length === 0) {
    return <div className="text-white text-center py-8">Loading questions...</div>;
  }

  if (isQuizCompleted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
        <h2 className="text-white text-3xl font-bold mb-4">Quiz Completed!</h2>
        <p className="text-white text-xl mb-6">
          Your Score: {score}/{questions.length}
        </p>
        <Button
          type="primary"
          size="large"
          className="bg-blue-600 text-white border-blue-600 hover:bg-blue-500"
          onClick={() => onQuizComplete(null)}
        >
          Play Again
        </Button>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const answers = [
    ...currentQuestion.incorrect_answers,
    currentQuestion.correct_answer,
  ].sort(); // Shuffle the answers

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
      <Card className="w-full max-w-2xl bg-gray-800 border-none text-white">
        <div className="text-xl font-semibold mb-6 text-center">
          Question {currentQuestionIndex + 1} / {questions.length}
        </div>
        <h3 className="text-2xl font-bold mb-8" dangerouslySetInnerHTML={{ __html: currentQuestion.question }} />

        <Radio.Group
          onChange={handleAnswerChange}
          value={selectedAnswer}
          className="flex flex-col space-y-4 text-lg"
        >
          {answers.map((answer, index) => (
            <Radio
              key={index}
              value={answer}
              className={`bg-gray-700 p-4 rounded-lg cursor-pointer text-lg text-white hover:bg-gray-600 ${
                selectedAnswer === answer ? 'bg-blue-500' : ''
              }`}
            >
              <span dangerouslySetInnerHTML={{ __html: answer }} />
            </Radio>
          ))}
        </Radio.Group>

        <div className="flex justify-center mt-8">
          <Button
            type="primary"
            size="large"
            onClick={handleNextQuestion}
            disabled={!selectedAnswer}
            className="bg-blue-600 text-white border-blue-600 hover:bg-blue-500"
          >
            {currentQuestionIndex === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Quiz;
