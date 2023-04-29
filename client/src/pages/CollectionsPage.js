import { Container, Grid, Button, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { GridOverlay, DataGrid } from '@mui/x-data-grid';
import { LinearProgress, Link } from '@mui/material';


const config = require('../config.json');

export default function CollectionsPage() {
    const [title, setTitle] = useState('');
    const [collectionName, setCollectionName] = useState('');
    const [collections, setCollections] = useState([]);
    const [pageSize, setPageSize] = useState(25);

    useEffect(() => {
        fetch(`http://${config.server_host}:${config.server_port}/search_collections/`)
            .then(res => res.json())
            .then(resJson => setCollections(resJson));
    }, [setCollections]);


    const search = () => {
        fetch(`http://${config.server_host}:${config.server_port}/search_collections?original_title=${title}` +
       `&collection=${collectionName}`)
          .then(res => res.json())
          .then(resJson => {setCollections(resJson)});
      }

    const columns = [
        { field: 'coll_id', headerName: 'Collection', width: 300, renderCell: (params) => (
            <Link href={`http://${config.client_host}:${config.client_port}/collections/${params.value}`}>{params.row.collection}</Link>
        )},
        { field: 'movies', headerName: 'Movies', width: 240},
        { field: 'genres', headerName: ' Genres', width: 200},
        { field: 'keywords', headerName: 'Keywords', width: 400}
    ]


    return (
        <Container>
            <h1>Find Your Favourite Movie Series!</h1>
            <Grid container spacing={6}>
                <Grid item xs={5}>
                    <TextField label='Movie Title' value={title} onChange={(e) => setTitle(e.target.value)} style={{ width: "100%" }}/>
                </Grid>
                <Grid item xs={5}>
                    <TextField label='Series Name' value={collectionName} onChange={(e) => setCollectionName(e.target.value)} style={{ width: "100%" }}/>
                </Grid>
                <Grid item xs={2}>
                    <Button onClick={() => search() } style={{ left: '50%', transform: 'translateX(-50%)' }} variant = "contained">
                        Search
                    </Button>
                </Grid>
            </Grid>
            <div style={{height: '3vh'}}></div>  
            <DataGrid
                components={{
                    LoadingOverlay: CustomLoadingOverlay,
                }}
                loading={collections.length === 0}
                rows={collections}
                columns={columns}
                pageSize={pageSize}
                rowsPerPageOptions={[10, 25, 50, 100]}
                onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                autoHeight
                paddingTop={2}
                getRowId={(row) => row.collection}
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