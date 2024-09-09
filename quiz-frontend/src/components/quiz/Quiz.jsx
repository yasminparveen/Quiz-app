import React, { useState, useEffect } from 'react';
import { Button, Radio, Card, Spin, message, Avatar, Typography } from 'antd';
import { UserOutlined } from '@ant-design/icons';

const { Text } = Typography;

const Quiz = ({ quizUrl, onQuizComplete }) => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [loading, setLoading] = useState(true); // Spinner state for quiz loading

  // Retrieve user profile details from localStorage
  const username = localStorage.getItem('username');
  const email = localStorage.getItem('email');

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
    return <div className="text-dark text-center py-8">Please select a category to start the quiz.</div>;
  }

  if (loading) {
    return <div className="text-dark text-center py-8"><Spin size="large" /> Loading questions...</div>;
  }

  if (questions.length === 0) {
    return <div className="text-dark text-center py-8">No questions found.</div>;
  }

  if (isQuizCompleted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-emerald-300 relative">
        <h2 className="text-white text-3xl font-bold mb-4">Quiz Completed!</h2>
        <p className="text-white text-xl mb-6">
          Your Score: {score}/{questions.length}
        </p>
        <Button
          type="primary"
          size="large"
          className="bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-500"
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-emerald-300 relative">
      {/* User Profile Display */}
      <div className="absolute top-5 right-5 flex items-center">
        <Avatar icon={<UserOutlined />} size="large" />
        <div style={{ marginLeft: '10px', color: '#fff' }}>
          <Text strong>{username}</Text>
        </div>
      </div>

      <Card className="w-full max-w-2xl bg-emerald-100 border-none text-emerald-900">
        <div className="text-xl font-semibold mb-6 text-center">
          Question {currentQuestionIndex + 1} / {questions.length}
        </div>

        <div className="text-lg font-semibold text-center mb-4">
          Time Left: {formatTime(timeLeft)}
        </div>

        <h3 className="text-2xl font-bold mb-8 text-emerald-800" dangerouslySetInnerHTML={{ __html: currentQuestion.question }} />

        <Radio.Group
          onChange={handleAnswerChange}
          value={selectedAnswer}
          className="flex flex-col space-y-4 text-lg"
        >
          {answers.map((answer, index) => (
            <Radio
              key={index}
              value={answer}
              className={`bg-white p-4 rounded-lg cursor-pointer text-lg text-emerald-900 hover:bg-emerald-200 ${
                selectedAnswer === answer ? 'bg-emerald-500 text-white' : ''
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
            className="bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-500"
          >
            {currentQuestionIndex === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Quiz;
