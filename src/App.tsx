/**
 * App.tsx — Root application with React Router setup
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Import i18n first so it's initialized before any component renders
import './i18n';

import { HomePage } from './pages/HomePage';
import { LessonsPage } from './pages/LessonsPage';
import { PlayPage } from './pages/PlayPage';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/lessons" element={<LessonsPage />} />
        <Route path="/play/:id" element={<PlayPage />} />
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
