import { useEffect, useState } from 'react';
import { Button, Checkbox, Box, InputLabel, MenuItem, Select, Container, FormControl, Grid, Link, Slider, TextField } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

const config = require('../config.json');

export default function SongsPage() {
  const [pageSize, setPageSize] = useState(10);
  const [data, setData] = useState([]);
  const [title, setTitle] = useState('');
  const [runtime, setRuntime] = useState([0, 1256]);
  const [popularity, setPopularity] = useState(0);
  const [release_date_From, setRelease_date_From] = useState('');
  const [release_date_To, setRelease_date_To] = useState('');

  useEffect(() => {
     fetch(`http://${config.server_host}:${config.server_port}/search_movies`)
       .then(res => res.json())
       .then(resJson => {setData(resJson);});
  }, []);

  const search = () => {
    fetch(`http://${config.server_host}:${config.server_port}/search_movies?title=${title}` +
   `&runtime_Low=${runtime[0]}&runtime_High=${runtime[1]}` +
   `&release_date_From=${release_date_From}&release_date_To=${release_date_To}` + 
   `&popularity=${popularity}`)
      .then(res => res.json())
      .then(resJson => {setData(resJson)});
  }

  const columns = [
    { field: 'title', headerName: 'Title', width: 300, renderCell: (params) => (
        <Link href={`http://${config.client_host}:${config.client_port}/movie/${params.row.id}`}>{params.value}</Link>
    )},
    { field: 'runtime', headerName: 'Runtime', width: 300},
    { field: 'popularity', headerName: 'Popularity', width: 300},
    { field: 'release_date', headerName: 'Release Date' , width: 300, renderCell: (params) => (
        <div>{String(params.value).substring(0, 10)}</div>
    )},
  ]

  return (
    <Container>
      <h1>Search your favorite movie!</h1>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <TextField label='Title' value={title} onChange={(e) => setTitle(e.target.value)} style={{ width: "100%" }}/>
        </Grid>
        <Grid item xs={6}>
        <TextField label='Release Date (From) YYYY-MM-DD' value={release_date_From} onChange={(e) => setRelease_date_From(e.target.value)} style={{ width: "100%" }}/>
        </Grid>
        <Grid item xs={6}>
        <TextField label='Release Date (To) YYYY-MM-DD' value={release_date_To} onChange={(e) => setRelease_date_To(e.target.value)} style={{ width: "100%" }}/>
        </Grid>
        <Grid item xs={6}>
          <p>Runtime (minutes)</p>
          <Slider
            value={runtime}
            min={0}
            max={1256}
            step={10}
            onChange={(e, newValue) => setRuntime(newValue)}
            valueLabelDisplay='auto'
            valueLabelFormat={value => <div>{value}</div>}
          />
        </Grid>
        <Grid item xs={6}>
          <p>Minimum Popularity</p>
          <Slider
            value={popularity}
            min={0}
            max={20}
            step={0.1}
            onChange={(e, newValue) => setPopularity(newValue)}
            valueLabelDisplay='auto'
            valueLabelFormat={value => <div>{value}</div>}
          />
        </Grid>
           
      </Grid>
      <Button onClick={() => search() } style={{ left: '50%', transform: 'translateX(-50%)' }}>
        Search
      </Button>
      <h2>Results</h2>
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