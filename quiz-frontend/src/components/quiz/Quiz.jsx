// src/components/Quiz.jsx
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
    return <div>Please select a category to start the quiz.</div>;
  }

  if (questions.length === 0) {
    return <div>Loading questions...</div>;
  }

  if (isQuizCompleted) {
    return (
      <div>
        <h2>Quiz Completed!</h2>
        <p>Your Score: {score}/{questions.length}</p>
        <Button type="primary" onClick={() => onQuizComplete(null)}>
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
    <div>
      <Card title={`Question ${currentQuestionIndex + 1} / ${questions.length}`}>
        <h3 dangerouslySetInnerHTML={{ __html: currentQuestion.question }} />
        <Radio.Group onChange={handleAnswerChange} value={selectedAnswer}>
          {answers.map((answer, index) => (
            <Radio key={index} value={answer}>
              <span dangerouslySetInnerHTML={{ __html: answer }} />
            </Radio>
          ))}
        </Radio.Group>
        <Button
          type="primary"
          onClick={handleNextQuestion}
          disabled={!selectedAnswer}
          style={{ marginTop: '20px' }}
        >
          {currentQuestionIndex === questions.length - 1
            ? 'Finish Quiz'
            : 'Next Question'}
        </Button>
      </Card>
    </div>
  );
};

export default Quiz;
