import { Container, Grid, Button } from '@mui/material';
import { useEffect, useState } from 'react';
import { GridOverlay, DataGrid } from '@mui/x-data-grid';
import { LinearProgress, Link } from '@mui/material';


const config = require('../config.json');

export default function GenresPage() {
    const [generes, setGenres] = useState([]);
    const [movies, setMovies] = useState([]);
    const [pageSize, setPageSize] = useState(25);
    const [selectedGenre, setSelectedGenre] = useState("");
    const currentGenre = selectedGenre.replace(/"/g, "");

    useEffect(() => {
        fetch(`http://${config.server_host}:${config.server_port}/genre`)
            .then(res => res.json())
            .then(resJson => setGenres(resJson));

        fetch(`http://${config.server_host}:${config.server_port}/movie_genre/${selectedGenre}`)
            .then(res => res.json())
            .then(resJson => setMovies(resJson));
    }, [setMovies, selectedGenre]);

    const genre_list = [];
    for (let i = 0; i < generes.length; i++) {
        genre_list.push(String(generes[i].genre));
    }

    

    const columns = [
        { field: 'id', headerName: 'Title', width: 300, renderCell: (params) => (
            <Link href={`http://${config.client_host}:${config.client_port}/movie/${params.value}`}>{params.row.title}</Link>
        )},
        { field: 'language', headerName: 'Language', width: 100},
        { field: 'tagline', headerName: 'Tagline', width: 380},
        { field: 'popularity', headerName: 'Popularity', width: 100},
        { field: 'release_date', headerName: 'Release Date', width: 135, renderCell: (params) => (
            <div>{String(params.value).substring(0, 10)}</div>
        )},
        { field: 'runtime', headerName: 'Runtime (min)', width: 140},
    ]

    const handleClickGenre = (genre) => {
        const genre_update= "\"" + genre + "\"";
        setSelectedGenre(genre_update);
    }


    return (
        <Container>
            <h2>Exploring your favorite genres!</h2>
            <Grid 
            container 
            spacing={6} 
            paddingTop={2}
            paddingBottom={2}
            >
                {genre_list.map((genre) => (
                    <Grid item xs={2.4} key={genre}>
                        {genre === currentGenre &&
                            <Button
                            variant="contained"
                            color="primary"
                            fullWidth
                            onClick={() => handleClickGenre(genre)}
                            >{genre}</Button>
                        }
                        {genre !== currentGenre &&
                            <Button
                            variant="outlined"
                            color="primary"
                            fullWidth
                            onClick={() => handleClickGenre(genre)}
                            >{genre}</Button>
                        }
                    </Grid>
                ))}
            </Grid>
            <h2>Here are some movies you might like!</h2>
            <DataGrid
                components={{
                    LoadingOverlay: CustomLoadingOverlay,
                }}
                loading={movies.length === 0}
                rows={movies}
                columns={columns}
                pageSize={pageSize}
                rowsPerPageOptions={[10, 25, 50, 100]}
                onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                autoHeight
                paddingTop={2}
                getRowId={(row) => row.title + row.release_date} 
            />
        </Container>
    )

    


}

function CustomLoadingOverlay() {
    return (
        <GridOverlay>
        <div style={{ position: 'absolute', top: 0, width: '100%' }}>
            <LinearProgress />
        </div>
        </GridOverlay>
    );
}