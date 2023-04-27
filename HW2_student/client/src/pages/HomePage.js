import { useEffect, useState } from 'react';
import { Container, Divider, Link } from '@mui/material';
import { NavLink } from 'react-router-dom';

import LazyTable from '../components/LazyTable';
import MovieCard from '../components/MovieCard';
const config = require('../config.json');

export default function HomePage() {
  const [movieOfTheDay, setMovieOfTheDay] = useState({});
  const [selectedMovieId, setSelectedMovieId] = useState(null);
  const [popularMovies, setPopularMovies] = useState([]);



  // The useEffect hook by default runs the provided callback after every render
  // The second (optional) argument, [], is the dependency array which signals
  // to the hook to only run the provided callback if the value of the dependency array
  // changes from the previous render. In this case, an empty array means the callback
  // will only run on the very first render.
  useEffect(() => {
    // Fetch request to get the song of the day. Fetch runs asynchronously.
    // The .then() method is called when the fetch request is complete
    // and proceeds to convert the result to a JSON which is finally placed in state.
    fetch(`http://${config.server_host}:${config.server_port}/random`)
      .then(res => res.json())
      .then(resJson => setMovieOfTheDay(resJson));

    // TODO (TASK 14): add a fetch call to get the app author (name not pennkey) and store it in the state variable
    fetch(`http://${config.server_host}:${config.server_port}/movies/popular`)
    .then(res => res.json())
    .then(resJson => setPopularMovies(resJson));
  }, []);

  // Here, we define the columns of the "Top Songs" table. The songColumns variable is an array (in order)
  // of objects with each object representing a column. Each object has a "field" property representing
  // what data field to display from the raw data, "headerName" property representing the column label,
  // and an optional renderCell property which given a row returns a custom JSX element to display in the cell.
  const movieColumns = [
    {
    field: 'title',
    headerName: 'Movie Title',
    renderCell: (row) => <Link onClick={() => setSelectedMovieId(row.movie_id)}>{row.title}</Link>
    },
    {
    field: 'release_year',
    headerName: 'Release Year'
    },
    {
    field: 'avg_rating',
    headerName: 'Avg Rating'
    },
    ];

  // TODO (TASK 15): define the columns for the top albums (schema is Album Title, Plays), where Album Title is a link to the album page
  // Hint: this should be very similar to songColumns defined above, but has 2 columns instead of 3
  const popularColumns = [
    {
    field: 'title',
    headerName: 'Movie Title',
    renderCell: (row) => <Link onClick={() => setSelectedMovieId(row.movie_id)}>{row.title}</Link>
    },
    {
    field: 'release_year',
    headerName: 'Release Year'
    },
    {
    field: 'avg_rating',
    headerName: 'Avg Rating'
    },
    {
    field: 'num_ratings',
    headerName: 'Num Ratings'
    },
    ]

  return (
    <Container>
      {/* MovieCard is a custom component that we made. selectedSongId && <MovieCard .../> makes use of short-circuit logic to only render the MovieCard if a non-null song is selected */}
      {selectedMovieId && <MovieCard movieId={selectedMovieId} handleClose={() => setSelectedMovieId(null)} />}
      <h2>Check out your song of the day:&nbsp;
        <Link onClick={() => setSelectedMovieId(movieOfTheDay.movie_id)}>{movieOfTheDay.title}</Link>
      </h2>
      <Divider />
      <h2>Top Rated Movies</h2>
      <LazyTable route={`http://${config.server_host}:${config.server_port}/movies/top`} columns={songColumns} />
      <Divider />
      {/* TODO (TASK 16): add a h2 heading, LazyTable, and divider for top albums. Set the LazyTable's props for defaultPageSize to 5 and rowsPerPageOptions to [5, 10] */}
      <h2>Top Albums</h2>
      <LazyTable route={`http://${config.server_host}:${config.server_port}/top_albums`} columns={albumColumns} defaultPageSize={5} rowsPerPageOptions={[5, 10]} />
      <Divider />
      {/* TODO (TASK 17): add a paragraph (<p>text</p>) that displays the value of your author state variable from TASK 13 */}
      <p>{appAuthor}</p>
    </Container>
  );
};