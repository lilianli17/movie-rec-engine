import { useEffect, useState } from 'react';
import { Button, Checkbox, Container, FormControlLabel, Grid, Link, Slider, TextField } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import dayjs from 'dayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';

import SongCard from '../components/SongCard';
const config = require('../config.json');

export default function SongsPage() {
  const [pageSize, setPageSize] = useState(10);
  const [data, setData] = useState([]);
  const [selectedSongId, setSelectedSongId] = useState(null);

  const [original_title, setOriginal_title] = useState('');
  const [runtime, setRuntime] = useState([0, 1256]);
  const [popularity, setPopularity] = useState([0]);
  const [genre, setGenre] = useState(['']);
  const [release_date, setRelease_Date] = useState(['1800-01-01 00:00:00','2023-01-01 00:00:00']);
  //const [explicit, setExplicit] = useState(false);

  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/search_movies`)
      .then(res => res.json())
      .then(resJson => {
        const movieWithId = resJson.map((movie) => ({ id: movie.id, ...movie }));
        setData(movieWithId);
      });
  }, []);
  // useEffect(() => {
  //   fetch(`http://${config.server_host}:${config.server_port}/search_movies`)
  //     .then(res => res.json())
  //     .then(resJson => {
  //       const songsWithId = resJson.map((song) => ({ id: song.song_id, ...song }));
  //       setData(songsWithId);
  //     });
  // }, []);

  const search = () => {
    fetch(`http://${config.server_host}:${config.server_port}/search_movies?original_title=${original_title}` +
      `&popularity_Low=${popularity[0]}}` +
      `&runtime_low=${runtime[0]}&runtime_high=${runtime[1]}` +
      `&release_date_From=${release_date[0]}&release_date_To=${release_date[1]}` +
      `&genre=${genre[0]}`
    )
      .then(res => res.json())
      .then(resJson => {
        // DataGrid expects an array of objects with a unique id.
        // To accomplish this, we use a map with spread syntax (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax)
        const movieWithId = resJson.map((movie) => ({ id: movie.id, ...movie }));
        setData(movieWithId);
      });
  }

  // This defines the columns of the table of songs used by the DataGrid component.
  // The format of the columns array and the DataGrid component itself is very similar to our
  // LazyTable component. The big difference is we provide all data to the DataGrid component
  // instead of loading only the data we need (which is necessary in order to be able to sort by column)
  const columns = [
    { field: 'original_title', headerName: 'Title', width: 300, renderCell: (params) => (
        <Link onClick={() => setSelectedMovieId(params.row.id)}>{params.value}</Link>
    ) },
    { field: 'runtime', headerName: 'Runtime' },
    { field: 'popularity', headerName: 'Popularity' },
    { field: 'release_date', headerName: 'Release Date' },
    { field: 'genre', headerName: 'Genre' },
  ]

  // This component makes uses of the Grid component from MUI (https://mui.com/material-ui/react-grid/).
  // The Grid component is super simple way to create a page layout. Simply make a <Grid container> tag
  // (optionally has spacing prop that specifies the distance between grid items). Then, enclose whatever
  // component you want in a <Grid item xs={}> tag where xs is a number between 1 and 12. Each row of the
  // grid is 12 units wide and the xs attribute specifies how many units the grid item is. So if you want
  // two grid items of the same size on the same row, define two grid items with xs={6}. The Grid container
  // will automatically lay out all the grid items into rows based on their xs values.
  return (
    <Container>
      {selectedMovieId && <SongCard songId={selectedMovieId} handleClose={() => setSelectedMovieId(null)} />}
      <h2>Search Movies</h2>
      <Grid container spacing={6}>
        <Grid item xs={8}>
          <TextField label='Title' value={original_title} onChange={(e) => setTitle(e.target.value)} style={{ width: "100%" }}/>
        </Grid>
        <Grid item xs={4}>
          <FormControlLabel
            label='Explicit'
            control={<Checkbox checked={explicit} onChange={(e) => setExplicit(e.target.checked)} />}
          />
        </Grid>
        <Grid item xs={6}>
          <p>Runtime (minutes)</p>
          <Slider
            value={runtime}
            min={0}
            max={1256}
            step={10}
            onChange={(e, newValue) => setDuration(newValue)}
            valueLabelDisplay='auto'
            valueLabelFormat={value => <div>{value}</div>}
          />
        </Grid>
        <Grid item xs={6}>
          <p>Popularity</p>
          <Slider
            value={popularity}
            min={0}
            max={20}
            step={0.1}
            onChange={(e, newValue) => setPlays(newValue)}
            valueLabelDisplay='auto'
            valueLabelFormat={value => <div>{value}</div>}
          />
        </Grid>
        {/* TODO (TASK 24): add sliders for danceability, energy, and valence (they should be all in the same row of the Grid) */}
        {/* Hint: consider what value xs should be to make them fit on the same row. Set max, min, and a reasonable step. Is valueLabelFormat is necessary? */}
        <Grid item xs={6}>
          <p>Release Date : From</p>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={['DateCalendar', 'DateCalendar']}>
                <DemoItem label="Controlled calendar">
                  <DateCalendar value={value} onChange={(newValue) => setValue(newValue)} />
                </DemoItem>
            </DemoContainer>
            </LocalizationProvider>
        </Grid>
        <Grid item xs={6}>
          <p>Release Date : To</p>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={['DateCalendar', 'DateCalendar']}>
                <DemoItem label="Controlled calendar">
                  <DateCalendar value={value} onChange={(newValue) => setValue(newValue)} />
                </DemoItem>
            </DemoContainer>
            </LocalizationProvider>
        </Grid>
           
      </Grid>
      <Button onClick={() => search() } style={{ left: '50%', transform: 'translateX(-50%)' }}>
        Search
      </Button>
      <h2>Results</h2>
      {/* Notice how similar the DataGrid component is to our LazyTable! What are the differences? */}
      <DataGrid
        rows={data}
        columns={columns}
        pageSize={pageSize}
        rowsPerPageOptions={[5, 10, 25]}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        autoHeight
      />
    </Container>
  );
}