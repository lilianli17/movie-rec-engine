import { useEffect, useState } from "react";
import React from "react";
import config from "../config.json";
import { Container, Stack, Link, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tab, Box, Paper, Tabs, Grid, Chip, IconButton } from "@mui/material";
import TabContext from '@mui/lab/TabContext';
import TabPanel from '@mui/lab/TabPanel';
import { useParams } from "react-router-dom";
import LinkIcon from '@mui/icons-material/Link';

export default function MovieInfoPage() {
    const movie_id = useParams().movie_id;
    const [movieInfo, setMovieInfo] = useState([{}]);
    const [movieCast, setMovieCast] = useState([]);
    const [movieCrew, setMovieCrew] = useState([]);
    const [tabChange, setTabChange] = React.useState('1');
    const [genres, setGenres] = useState([]);

    useEffect(() => {
        fetch(`http://${config.server_host}:${config.server_port}/movie/${movie_id}`)
            .then(res => res.json())
            .then(resJson => setMovieInfo(resJson));
        fetch(`http://${config.server_host}:${config.server_port}/cast/${movie_id}`)
            .then(res => res.json())
            .then(resJson => setMovieCast(resJson));
        fetch(`http://${config.server_host}:${config.server_port}/crew/${movie_id}`)
            .then(res => res.json())
            .then(resJson => setMovieCrew(resJson));
        fetch(`http://${config.server_host}:${config.server_port}/genre/${movie_id}`)
            .then(res => res.json())
            .then(resJson => setGenres(resJson));
    }, []);

    const handleTabChange = (event, newValue) => {
        setTabChange(newValue);
    };

    let date_update = "N/A";
    if (movieInfo.release_date !== undefined) {
        date_update = String(movieInfo.release_date).substring(0, 10);
    }

    const genre_list = [];
    for (let i = 0; i < genres.length; i++) {
        genre_list.push(String(genres[i].genre));
    }
    
    let imbd_id_update = String(movieInfo.imdb_id);
    if (imbd_id_update.length < 7) {
        let num_zeros = 7 - imbd_id_update.length;
        for (let i = 0; i < num_zeros; i++) {
            imbd_id_update = "0" + imbd_id_update;
        }

    }
    const imdb_link = "https://www.imdb.com/title/tt" + imbd_id_update + "/";
    const runtime_update = String(movieInfo.runtime) + " minutes";
    console.log(movieInfo);
 

    return (
        <Container >
            <Stack direction='column'>
                <Grid
                    container
                    direction="row"
                    alignItems="center"
                    spacing={1}
                >
                    <h1>{movieInfo.original_title} &nbsp;</h1>
                    {movieInfo.original_title !== movieInfo.title &&
                        <h2>({movieInfo.title})</h2>
                    }
                    <a href={imdb_link}>
                        <IconButton>
                            <LinkIcon />
                        </IconButton>
                    </a>
                </Grid>
                <div>
                    <Grid
                    container
                    direction="row"
                    alignItems="center"
                    spacing={1}
                    > 
                        {genre_list.map((g) => (
                            <Grid item key={g}>
                                <Chip 
                                label={g} 
                                color="primary"
                                />
                            </Grid>
                        ))}
                        <Grid item>
                            <Chip 
                            label={date_update} variant="outlined" 
                            color="primary"
                            />
                        </Grid>
                        <Grid item>
                            <Chip 
                            label={runtime_update}
                            variant="outlined" 
                            color="primary"
                            />
                        </Grid>
                    </Grid>
                </div>
                <p>
                    {movieInfo.tagline !== null && 
                    <div>
                        <i>{movieInfo.tagline}</i>
                        <br />
                        <br />
                    </div>
                    }
                    {movieInfo.overview}
                </p>
            </Stack>
            <TabContext value={tabChange}>
                <Box sx={{ width: '100%' }}>
                <Tabs
                    value={tabChange}
                    onChange={handleTabChange}
                    centered
                    variant="fullWidth"
                    textColor="primary"
                    indicatorColor="primary"
                >
                    <Tab value="1" label="Cast List" />
                    <Tab value="2" label="Crew List" />
                </Tabs>
                </Box>
                <TabPanel value="1">
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell key='Actor' align="left">Actor</TableCell>
                                    <TableCell key='Character' align="left">Character</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {movieCast.map((cast) => (
                                    <TableRow>
                                        <TableCell key='Actor'>{cast.name}</TableCell>
                                        <TableCell key='Character'>{cast.character}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </TabPanel>
                <TabPanel value="2">
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell key='Name' align="left">Crew</TableCell>
                                    <TableCell key='Job' align="left">Job</TableCell>
                                    <TableCell key='Department' align="left">Department</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {movieCrew.map((crew) => (
                                    <TableRow>
                                        <TableCell key='Name'>{crew.name}</TableCell>
                                        <TableCell key='Job'>{crew.job}</TableCell>
                                        <TableCell key='Department'>{crew.department}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </TabPanel>

            </TabContext>
            
            
        </Container>
    );


}