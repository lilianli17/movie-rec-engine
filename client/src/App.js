import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CssBaseline, ThemeProvider } from '@mui/material'
import { cyan, teal, red, lime } from '@mui/material/colors'
import { createTheme } from "@mui/material/styles";

import NavBar from './components/NavBar';
import MovieInfoPage from './pages/MovieInfoPage';
import GenresPage from "./pages/GenresPage";
import CollectionInfoPage from "./pages/CollectionInfoPage";
import CollectionsPage from "./pages/CollectionsPage";
import MoviesPage from "./pages/MoviesPage";
import HomePage from "./pages/HomePage";
import RecommendationsPage from "./pages/RecommendationsPage";

// import HomePage from './pages/HomePage';
// import AlbumsPage from './pages/AlbumsPage';
// import SongsPage from './pages/SongsPage';
// import AlbumInfoPage from './pages/AlbumInfoPage'

// createTheme enables you to customize the look and feel of your app past the default
// in this case, we only change the color scheme
export const theme = createTheme({
  palette: {
    primary: {
      main: teal[600],
    },
    secondary: {
      main: lime[500],
    },
  },
});

// App is the root component of our application and as children contain all our pages
// We use React Router's BrowserRouter and Routes components to define the pages for
// our application, with each Route component representing a page and the common
// NavBar component allowing us to navigate between pages (with hyperlinks)
export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/movie/:movie_id" element={<MovieInfoPage />} />
          <Route path="/genres" element={<GenresPage />} />
          <Route path="/collections/:coll_id" element={<CollectionInfoPage />} />
          <Route path="/collections/" element={<CollectionsPage />} />
          <Route path="/movies" element={<MoviesPage />} />
          <Route path="/rec" element={<RecommendationsPage />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}