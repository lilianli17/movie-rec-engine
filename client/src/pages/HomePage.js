import { useEffect, useState } from 'react';
import { Container, Divider, Link, colors } from '@mui/material';
import { NavLink } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';


const config = require('../config.json');

export default function HomePage() {
  // We use the setState hook to persist information across renders (such as the result of our API calls)
  const [pageSize, setPageSize] = useState(10);
  const [movieOfTheDay, setMovieOfTheDay] = useState({});
  const [popularMovies, setPopularMovies] = useState({});

  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/random`)
      .then(res => res.json())
      .then(resJson => setMovieOfTheDay(resJson));
    fetch(`http://${config.server_host}:${config.server_port}/top_popular`)
      .then(res => res.json())
      .then(resJson => setPopularMovies(resJson));
  }, []);

  const randomColumn = [
    { field: 'id', headerName: 'Title', width: 300, renderCell: (params) => (
        <Link href={`http://${config.client_host}:${config.client_port}/random`}>{params.row.title}</Link>
    )},
    { field: 'tagline', headerName: 'Tagline', width: 380},
    { field: 'popularity', headerName: 'Popularity', width: 100},
    { field: 'release_date', headerName: 'Release Date', width: 135, renderCell: (params) => (
        <div>{String(params.value).substring(0, 10)}</div>
    )},
    { field: 'runtime', headerName: 'Runtime (min)', width: 140},
  ]
   
  const popColumns = [
    { field: 'id', headerName: 'Title', width: 300, renderCell: (params) => (
        <Link href={`http://${config.client_host}:${config.client_port}/top_popular`}>{params.row.title}</Link>
    )},
    { field: 'tagline', headerName: 'Tagline', width: 380},
    { field: 'popularity', headerName: 'Popularity', width: 100},
    { field: 'release_date', headerName: 'Release Date', width: 135, renderCell: (params) => (
        <div>{String(params.value).substring(0, 10)}</div>
    )},
    { field: 'runtime', headerName: 'Runtime (min)', width: 140},
  ]
  
  return (
    <Container>

      <h2>Movie of the Day:&nbsp;
        <Link href={`http://${config.client_host}:${config.client_port}/movie/${movieOfTheDay.id}`}>{movieOfTheDay.title}</Link>
      </h2>
      <Divider/>
      <h2>The 10 most popular movies of all time:</h2>
      <DataGrid
        rows={popularMovies}
        columns={popColumns}
        pageSize={pageSize}
        rowsPerPageOptions={[5, 10, 25]}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        autoHeight
      />
    </Container>
  );
};