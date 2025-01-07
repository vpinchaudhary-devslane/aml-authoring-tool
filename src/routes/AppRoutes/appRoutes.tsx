import QuestionsPage from '@/views/QuestionsPage';
import QuestionSetsPage from '@/views/QuestionSetsPage';
import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import QuestionSetDetailPage from '@/views/login/QuestionSetDetailPage';

export enum AppSubRoutes {
  QUESTIONS = 'questions',
  QUESTION_SETS = 'question-sets',
  QUESTION_SET = 'question-sets/:id',
}

const AppRoutes: React.FC = () => (
  <Routes>
    <Route
      path='/'
      element={<Navigate to={AppSubRoutes.QUESTIONS} replace />}
    />
    <Route path={AppSubRoutes.QUESTIONS} element={<QuestionsPage />} />
    <Route path={AppSubRoutes.QUESTION_SETS} element={<QuestionSetsPage />} />
    <Route
      path={AppSubRoutes.QUESTION_SET}
      element={<QuestionSetDetailPage />}
    />
  </Routes>
);

export default AppRoutes;
