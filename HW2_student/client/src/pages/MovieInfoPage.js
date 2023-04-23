import { useEffect, useState } from "react";
import React from "react";
import config from "../config.json";
import { Container, Link, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableFooter, TablePagination, Tab, Box, Paper, Tabs } from "@mui/material";
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';


export default function MovieInfoPage() {
    // **change it later
    const movie_id = 11;
    const [movieInfo, setMovieInfo] = useState([{}]); // default should actually just be [], but empty object element added to avoid error in template code
    const [movieCast, setMovieCast] = useState([]);
    const [movieCrew, setMovieCrew] = useState([]);
    const [tabChange, setTabChange] = React.useState('1');

    // need two more routes to get genre and collection
    // conditional rendering for genre and collection

    // fetch movie, cast, and crew info
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
    }, []);

    const handleTabChange = (event, newValue) => {
        setTabChange(newValue);
    };

    return (
        <Container >
            <Stack direction='column'>
                <h1>{movieInfo.original_title}</h1>
                <h3>Release Date: {movieInfo.release_date}</h3>
                <h3>Runtime: {movieInfo.runtime} min</h3>
                <h3>Tagline</h3>
                <h3>Overview: {movieInfo.overview}</h3>
                <h3>Genres</h3>
                <h3>Collection</h3>
            </Stack>

            <TabContext value={tabChange}>
                <Box sx={{ borderBottom: 0, borderColor: 'divider' }}>
                    <Tabs 
                    onChange={handleTabChange} centered
                    variant="fullWidth"
                    textColor="secondary"
                    indicatorColor="secondary"
                    >
                        <Tab label="Cast List" value="1" />
                        <Tab label="Crew List" value="2" />
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