import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Link, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

const config = require('../config.json');

export default function CollectionInfoPage() {
  // change to useParams
  const {coll_id} = useParams();

  const [movieData, setMovieData] = useState([{}]); // default should actually just be [], but empty object element added to avoid error in template code
  const [collectionData, setCollectionData] = useState([]);

  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/get_collection/${coll_id}`)
      .then(res => res.json())
      .then(resJson => setCollectionData(resJson))
      .then(resJson => console.log(resJson));

    fetch(`http://${config.server_host}:${config.server_port}/get_movies_collection/${coll_id}`)
       .then(res => res.json())
       .then(resJson => setMovieData(resJson));
  }, []);

  return (
    <Container>
      <Stack direction='row' justify='center'>
        {/* <img
          key={collectionData.collection}
          src={albumData.thumbnail_url}
          alt={`${albumData.title} album art`}
          style={{
            marginTop: '40px',
            marginRight: '40px',
            marginBottom: '40px'
          }}
        /> */}
        <Stack>
          <h1 style={{ fontSize: 64 }}>{collectionData.collection}</h1>
          {/* <h2>Released: {formatReleaseDate(albumData.release_date)}</h2> */}
        </Stack>
      </Stack>
      { <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell key='Title'>Title</TableCell>
              <TableCell key='Overview'>Overview</TableCell>
              <TableCell key='Popularity'>Popularity</TableCell>
              <TableCell key='Runtime'>Runtime</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
          {movieData.map((movie, idx) => 
            <TableRow key={idx}>
                <TableCell key='Title'>
                  <Link href={`http://${config.client_host}:${config.client_port}/movie/${movie.id}`}>{movie.original_title}</Link>
                </TableCell>
                <TableCell key='Overview'>{movie.overview}</TableCell>
                <TableCell key='Popularity'>{movie.popularity}</TableCell>
                <TableCell key='Runtime'>{movie.runtime}</TableCell>
              </TableRow>)
            }
          </TableBody>
        </Table>
      </TableContainer>}
    </Container>
  );
}