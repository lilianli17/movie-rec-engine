import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import MovieInfoPage from './pages/MovieInfoPage';
import HomePage from './pages/HomePage';
import AlbumsPage from './pages/AlbumsPage';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <HomePage/>
  </React.StrictMode>
);
