const express = require('express');
const cors = require('cors');
const config = require('./config');
const routes = require('./routes');

const app = express();
app.use(cors({
  origin: '*',
}));

// We use express to define our various API endpoints and
// provide their handlers that we implemented in routes.js
//app.get('/author/:type', routes.author);
app.get('/random', routes.random);
app.get('/movie/:movie_id', routes.movie);
//app.get('/crew/:title', routes.crew);
//app.get('/cast/:title', routes.cast);
//app.get('/album/:album_id', routes.album);
//app.get('/albums', routes.albums);
//app.get('/album_songs/:album_id', routes.album_songs);
app.get('/get_similar/:id', routes.get_similar);
app.get('/get_similar_genres/:id', routes.get_similar_genres);
app.get('/get_similar_cast/:id', routes.get_similar_cast);
app.get('/get_similar_crew/:id', routes.get_similar_crew);
//app.get('/top_albums', routes.top_albums);
app.get('/search_collections', routes.search_collections);
app.get('/search_movies', routes.search_movies);

app.listen(config.server_port, () => {
  console.log(`Server running at http://${config.server_host}:${config.server_port}/`)
});

module.exports = app;
