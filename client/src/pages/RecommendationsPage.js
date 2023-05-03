import { Container, Grid, Button, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { GridOverlay, DataGrid } from '@mui/x-data-grid';
import { LinearProgress, Link } from '@mui/material';
import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';


const config = require('../config.json');

export default function RecommendationsPage() {
    const [title, setTitle] = useState('');
    const [movies, setMovies] = useState([]);
    const [moviesML, setMoviesML] = useState([]);
    const [searchMode, setSearchMode] = useState(0);
    const [pageSize, setPageSize] = useState(25);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const [anchorEl2, setAnchorEl2] = React.useState(null);
    const open2 = Boolean(anchorEl2);
    const [compMode, setCompMode] = React.useState(0);

    const route_options = [
        'get_similar',
        'get_similar_genres',
        'get_similar_cast',
        'get_similar_crew'
    ]

    const options = [
        'Everyting',
        'Genres',
        'Cast',
        'Crew'
    ]


    const options2 = [
        'SQL',
        'ML'
    ]

    const handleClickListItem = (event) => {
        setAnchorEl(event.currentTarget);
      };

      const handleClickListItem2 = (event) => {
        setAnchorEl2(event.currentTarget);
      };

    const handleMenuItemClick = (event,index,) => {
        setSearchMode(index);
        setAnchorEl(null);
      };

      const handleMenuItemClick2 = (event,index,) => {
        setCompMode(index);
        setAnchorEl2(null);
      };
    
      const handleClose = () => {
        setAnchorEl(null);
      };

      const handleClose2 = () => {
        setAnchorEl2(null);
      };

    const search = () => {
        if (compMode === 0) {
            fetch(`http://${config.server_host}:${config.server_port}/${route_options[searchMode]}/${title}`)
          .then(res => res.json())
          .then(resJson => {setMovies(resJson)})
          .then(console.log(movies));
        } else {
            fetch(`http://${config.server_host}:${config.server_port}/get_ml/${title}`)
          .then(res => res.json())
          .then(resJson => {setMoviesML(resJson)})
          .then(console.log(moviesML));
        }
      }

    const columns = [[
        { field: 'id', headerName: 'Title', width: 300, renderCell: (params) => (
            <Link href={`http://${config.client_host}:${config.client_port}/movie/${params.value}`}>{params.row.original_title}</Link>
        )},
        { field: 'similarity_score', headerName: 'Similarity Score', width: 300}
    ],
    [{ field: 'id', headerName: 'id', width: 300},
    { field: 'original_title', headerName: 'Title', width: 300},
    { field: 'similarity_score', headerName: 'Similarity Score', width: 300}]]

    return (
        <Container>
            <h1>Enter a Movie and Get Some Recommendations!</h1>
            <Grid container spacing={6}>
                <Grid item xs={4}>
                    <TextField label='Movie Title' value={title} onChange={(e) => setTitle(e.target.value)} style={{ width: "100%" }}/>
                </Grid>
                <Grid item xs={4}>
      <List
        component="nav"
        aria-label="Device settings"
        sx={{ bgcolor: 'background.paper' }}
      >
        <ListItem
          button
          id="lock-button"
          aria-haspopup="listbox"
          aria-controls="lock-menu"
          aria-label="select search attributes"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClickListItem}
        >
          <ListItemText
            primary="Select Search Attributes"
            secondary={options[searchMode]}
          />
        </ListItem>
      </List>
      <Menu
        id="lock-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'lock-button',
          role: 'listbox',
        }}
      >
        {options.map((option, index) => (
          <MenuItem
            key={option}
            selected={index === searchMode}
            onClick={(event) => handleMenuItemClick(event, index)}
          >
            {option}
          </MenuItem>
        ))}
      </Menu>
      </Grid>
      <Grid item xs={4}>
      <List
        component="nav"
        aria-label="Device settings"
        sx={{ bgcolor: 'background.paper' }}
      >
        <ListItem
          button
          id="lock-button2"
          aria-haspopup="listbox"
          aria-controls="lock-menu"
          aria-label="select comparison algorithm"
          aria-expanded={open2 ? 'true' : undefined}
          onClick={handleClickListItem2}
        >
          <ListItemText
            primary="Select Comparison Algorithm"
            secondary={options2[compMode]}
          />
        </ListItem>
      </List>
      <Menu
        id="lock-menu2"
        anchorEl={anchorEl2}
        open={open2}
        onClose={handleClose2}
        MenuListProps={{
          'aria-labelledby': 'lock-button',
          role: 'listbox',
        }}
      >
        {options2.map((option, index) => (
          <MenuItem
            key={option}
            selected={index === compMode}
            onClick={(event) => handleMenuItemClick2(event, index)}
          >
            {option}
          </MenuItem>
        ))}
      </Menu>
                </Grid>
                <Grid item xs={12}>
                    <Button onClick={() => search() } style={{ left: '50%', transform: 'translateX(-50%)' }} variant = "contained">
                        Search
                    </Button>
                </Grid>
            </Grid>
            <div style={{height: '3vh'}}></div> 
            {compMode === 0?
            <DataGrid
                components={{
                    LoadingOverlay: CustomLoadingOverlay,
                }}
                rows={movies}
                columns={columns[compMode]}
                pageSize={pageSize}
                rowsPerPageOptions={[10, 25, 50, 100]}
                onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                autoHeight
                paddingTop={2}
                getRowId={(row) => row.id}
            />
            :
            <DataGrid
                components={{
                    LoadingOverlay: CustomLoadingOverlay,
                }}
                rows={moviesML}
                columns={columns[compMode]}
                pageSize={pageSize}
                rowsPerPageOptions={[10, 25, 50, 100]}
                onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                autoHeight
                paddingTop={2}
                getRowId={(row) => row.id + row.similarity_score}
            />}
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