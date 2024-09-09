import React from 'react';
import { Button } from 'antd';
import { TrophyOutlined, ReloadOutlined } from '@ant-design/icons';

const Result = ({ score, totalQuestions, onRetry, onReturnToCategories }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
      <div className="bg-gray-800 p-10 rounded-lg shadow-lg text-center">
        <TrophyOutlined className="text-yellow-400 text-6xl mb-4" />
        <h2 className="text-white text-4xl font-bold mb-4">Quiz Completed!</h2>
        <p className="text-white text-2xl mb-8">
          You scored {score} out of {totalQuestions}
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button
            type="primary"
            size="large"
            onClick={onReturnToCategories}
            icon={<ReloadOutlined />}
            className="bg-blue-600 text-white border-blue-600 hover:bg-blue-500 w-full sm:w-auto"
          >
            Try Again
          </Button>
          <Button
            size="large"
            onClick={onReturnToCategories}
            className="bg-green-600 text-white border-green-600 hover:bg-green-500 w-full sm:w-auto"
          >
            Select Another Category
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Result;
