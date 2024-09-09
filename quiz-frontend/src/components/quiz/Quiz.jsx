import React, { useState, useEffect } from 'react';
import { Button, Radio, Card, Spin, message } from 'antd';

const Quiz = ({ quizUrl, onQuizComplete }) => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [loading, setLoading] = useState(true); // Spinner state for quiz loading

  // Fetch the quiz data
  useEffect(() => {
    if (quizUrl) {
      setLoading(true);  // Show spinner while loading
      fetch(quizUrl)
        .then((response) => response.json())
        .then((data) => {
          setQuestions(data.results);
          setLoading(false);  // Hide spinner when data is loaded
        })
        .catch((error) => {
          console.error('Error fetching the quiz data:', error);
          message.error('Failed to load quiz data');  // Display error message
          setLoading(false);
        });
    }
  }, [quizUrl]);

  // Timer countdown logic for each question
  useEffect(() => {
    if (timeLeft > 0 && !isQuizCompleted) {
      const timerId = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);

      return () => clearInterval(timerId); // Cleanup on unmount
    } else if (timeLeft === 0 && !isQuizCompleted) {
      handleNextQuestion(); // Automatically move to the next question when time runs out
    }
  }, [timeLeft, isQuizCompleted]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const handleAnswerChange = (e) => {
    setSelectedAnswer(e.target.value);
  };

  const handleQuizComplete = (finalScore) => {
    const userId = localStorage.getItem('userId'); 

    fetch(`${import.meta.env.VITE_API_URL}/saveScore`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: userId,
        category: 'Your Category',
        score: finalScore,
        totalQuestions: questions.length,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Score saved:', data);
        message.success('Score saved successfully');  // Show success message
      })
      .catch((error) => {
        console.error('Error saving score:', error);
        message.error('Failed to save score');  // Show error message
      });

    // Pass the final score to the parent component
    onQuizComplete(finalScore);
  };

  const handleNextQuestion = () => {
    const correctAnswer = questions[currentQuestionIndex].correct_answer;
    const newScore = selectedAnswer === correctAnswer ? score + 1 : score;

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setTimeLeft(30); // Reset the timer for the next question
    } else {
      setIsQuizCompleted(true);
      handleQuizComplete(newScore); // Call handleQuizComplete to save the score and complete the quiz
    }

    setScore(newScore); // Update the score in state
  };

  if (!quizUrl) {
    return <div className="text-white text-center py-8">Please select a category to start the quiz.</div>;
  }

  if (loading) {
    return <div className="text-white text-center py-8"><Spin size="large" /> Loading questions...</div>;
  }

  if (questions.length === 0) {
    return <div className="text-white text-center py-8">No questions found.</div>;
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

        <div className="text-lg font-semibold text-center mb-4">
          Time Left: {formatTime(timeLeft)}
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
