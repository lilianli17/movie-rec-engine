import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import MovieInfoPage from './pages/MovieInfoPage';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <MovieInfoPage />
  </React.StrictMode>
);
