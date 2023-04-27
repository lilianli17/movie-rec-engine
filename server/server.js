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
app.get('/crew/:movie_id', routes.search_crew);
app.get('/cast/:movie_id', routes.search_cast);
app.get('/genre/:movie_id', routes.get_genres);
app.get('/genre', routes.get_all_genres);
app.get('/movie_genre/:genre?', routes.get_movies_by_genres);
app.get('/top_popular', routes.top_popular);
app.get('/top_popular_genre/:genre', routes.top_popular_genre);
app.get('/get_similar/:id', routes.get_similar);
app.get('/get_similar_genres/:id', routes.get_similar_genres);
app.get('/get_similar_cast/:id', routes.get_similar_cast);
app.get('/get_similar_crew/:id', routes.get_similar_crew);
app.get('/search_collections', routes.search_collections);
app.get('/get_movies_collection/:collection', routes.get_movies_collection);
app.get('/search_movies', routes.search_movies);

app.listen(config.server_port, () => {
  console.log(`Server running at http://${config.server_host}:${config.server_port}/`)
});

module.exports = app;