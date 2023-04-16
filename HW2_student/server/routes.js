const mysql = require('mysql')
const config = require('./config.json')

// Creates MySQL connection using database credential provided in config.json
// Do not edit. If the connection fails, make sure to check that config.json is filled out correctly
const connection = mysql.createConnection({
  host: config.rds_host,
  user: config.rds_user,
  password: config.rds_password,
  port: config.rds_port,
  database: config.rds_db
});
connection.connect((err) => err && console.log(err));

/******************
 * WARM UP ROUTES *
 ******************/

// Route 1: GET /author/:type
const author = async function(req, res) {
  // TODO (TASK 1): replace the values of name and pennKey with your own
  const name = 'Lilian Li';
  const pennKey = 'jieli17';

  // checks the value of type the request parameters
  // note that parameters are required and are specified in server.js in the endpoint by a colon (e.g. /author/:type)
  if (req.params.type === 'name') {
    // res.send returns data back to the requester via an HTTP response
    res.send(`Created by ${name}`);

  } else if (req.params.type === 'pennkey') {
    // TODO (TASK 2): edit the else if condition to check if the request parameter 
    // is 'pennkey' and if so, send back response 'Created by [pennkey]'
    res.send(`Created by ${pennKey}`);
  
  } else {
    // we can also send back an HTTP status code to indicate an improper request
    res.status(400).send(`'${req.params.type}' is not a valid author type. Valid types are 'name' and 'pennkey'.`);
  }
}

// Route 2: GET /random
const random = async function(req, res) {
  // you can use a ternary operator to check the value of request query values
  // which can be particularly useful for setting the default value of queries
  // note if users do not provide a value for the query it will be undefined, which is falsey

  // Here is a complete example of how to query the database in JavaScript.
  // Only a small change (unrelated to querying) is required for TASK 3 in this route.
  connection.query(`
    SELECT *
    FROM Movies
    ORDER BY RAND()
    LIMIT 1
  `, (err, data) => {
    if (err || data.length === 0) {
      // if there is an error for some reason, or if the query is empty (this should not be possible)
      // print the error message and return an empty object instead
      console.log(err);
      res.json({});
    } else {
      // Here, we return results of the query as an object, keeping only relevant data
      // being song_id and title which you will add. In this case, there is only one song
      // so we just directly access the first element of the query results array (data)
      // TODO (TASK 3): also return the song title in the response
      res.json(
        data[0]
        //song_id: data[0].song_id,
        //title: data[0].title
        );
    }
  });
}

/********************************
 * BASIC SONG/ALBUM INFO ROUTES *
 ********************************/

// Route 3: GET /movie/:id
const movie = async function(req, res) {
  connection.query(`
    SELECT *
    FROM Movies
    WHERE id = '${req.params.id}'
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data[0]);
    }
  });
}

// Route 4: List the collections and the number of movies in each collection, 
// ordered by the number of movies in descending order.
// const album = async function(req, res) {
//   // TODO (TASK 5): implement a route that lists the collections and 
//   //the number of movies in each collection, 
//   // ordered by the number of movies in descending order.
//   connection.query(`
//   SELECT collection, COUNT(*) AS num_movies
//   FROM Collections
//   JOIN Movies m ON Collections.id = m.id
//   GROUP BY collection
//   ORDER BY num_movies DESC;
//   `, (err, data) => {
//     if (err || data.length === 0) {
//       console.log(err);
//       res.json({});
//     } else {
//       res.json(data[0]);
//     }
//   });

// }

// Route 5: GET top ten most similar movies to the given movie
const top_movies = async function(req, res) {
  // TODO (TASK 6): implement a route that returns all albums ordered by release date (descending)
  // Note that in this case you will need to return multiple albums, so you will need to return an array of objects
  connection.query(`
  SELECT m2.original_title, COUNT(*) AS similarity_score
  FROM Movies m1
  JOIN Genres g1 ON m1.id = g1.id
  JOIN Movies m2 ON m2.id <> m1.id
  JOIN Genres g2 ON m2.id = g2.id AND g1.genre = g2.genre
  WHERE m1.original_title = 'Groundhog Day' AND m2.original_title != 'Groundhog Day'
  GROUP BY m2.original_title
  ORDER BY similarity_score DESC
  LIMIT 10;
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json([]);
    } else {
      res.json(data);
    }
  });

}

// Route 6: GET /top_movies/ top 10
const search_collections = async function(req, res) {
  // TODO (TASK 7): implement a route that given an album_id, returns all songs on that album ordered by track number (ascending)
  const original_title = req.query.original_title ?? '';
  const collection = req.query.collection ?? '';
  const keywords = req.query.keywords ?? [];
  const genres = req.query.genres ?? ['Crime', 'Drama', 'Comedy', 'Action', 'Thriller', 'Adventure',
  'Science Fiction', 'Animation', 'Family', 'Romance', 'Mystery', 'Music', 'Horror', 'Fantasy',
  'Documentary', 'War', 'Western', 'History', 'Foreign', 'TV Movie'];
  connection.query(`
    SELECT DISTINCT Collection
    FROM Collections C LEFT JOIN Genres G ON C.id = G.id
    WHERE original_title LIKE '%${original_title}%'
    AND collection LIKE '%${collection}%'
    AND G.genre IN '${genres}'
    LIMIT 10;
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json([]);
    } else {
      res.json(data);
    }
  });
}

/************************
 * ADVANCED INFO ROUTES *
 ************************/

// Route 7: GET /top_songs
// const top_songs = async function(req, res) {
//   const page = req.query.page;
//   // TODO (TASK 8): use the ternary (or nullish) operator to set the pageSize based on the query or default to 10
//   const pageSize = req.query.page_size ? req.query.page_size : 10;

//   if (!page) {
//     // TODO (TASK 9)): query the database and return all songs ordered by number of plays (descending)
//     // Hint: you will need to use a JOIN to get the album title as well
//     connection.query(`
//       SELECT s.song_id AS song_id, s.title AS title, s.album_id AS album_id, Albums.title AS album, s.plays AS plays
//       FROM Songs AS s
//       JOIN Albums
//       ON s.album_id = Albums.album_id
//       ORDER BY s.plays DESC
//     `, (err, data) => {
//       if (err || data.length === 0) {
//         console.log(err);
//         res.json([]);
//       }
//       else {
//         res.json(data);
//       }
//     });
//   } else {
//     const offset = (page - 1) * pageSize;
//     // TODO (TASK 10): reimplement TASK 9 with pagination
//     // Hint: use LIMIT and OFFSET (see https://www.w3schools.com/php/php_mysql_select_limit.asp)
//     connection.query(`
//       SELECT s.song_id AS song_id, s.title AS title, s.album_id AS album_id, Albums.title AS album, s.plays AS plays
//       FROM Songs s
//       JOIN Albums
//       ON s.album_id = Albums.album_id
//       ORDER BY s.plays DESC
//       LIMIT ${pageSize}
//       OFFSET ${offset}
      
//     `, (err, data) => {
//       if (err || data.length === 0) {
//         console.log(err);
//         res.json([]);
//       }
//       else {
//         res.json(data);
//       }
//     }
//     );
//   }
// }

// // Route 8: GET /top_albums
// const top_albums = async function(req, res) {
//   // TODO (TASK 11): return the top albums ordered by aggregate number of plays of all songs on the album (descending), with optional pagination (as in route 7)
//   // Hint: you will need to use a JOIN and aggregation to get the total plays of songs in an album
//   const page = req.query.page;
//   const pageSize = req.query.page_size ? req.query.page_size : 10;
  

//   if (!page) {
//     connection.query(`
//       SELECT a.album_id AS album_id, a.title AS title, SUM(s.plays) AS plays
//       FROM Albums AS a
//       JOIN Songs AS s
//       ON a.album_id = s.album_id
//       GROUP BY album_id
//       ORDER BY plays DESC
//     `, (err, data) => {
//       if (err || data.length === 0) {
//         console.log(err);
//         res.json([]);
//       }
//       else {
//         res.json(data);
//       }
//     });
//   } else {
//     const offset = (page - 1) * pageSize;
//     connection.query(`
//       SELECT a.album_id AS album_id, a.title AS title, SUM(s.plays) AS plays
//       FROM Albums AS a
//       JOIN Songs AS s
//       ON a.album_id = s.album_id
//       GROUP BY album_id
//       ORDER BY plays DESC
//       LIMIT ${pageSize} 
//       OFFSET ${offset}
//     `, (err, data) => {
//       if (err || data.length === 0) {
//         console.log(err);
//         res.json([]);
//       }
//       else {
//         res.json(data);
//       }
//     });
//   }

// }

// Route 6: GET /search_movies
// const search_movies = async function(req, res) {
//   // search based on title (string), genre (drop down), popularity, release_year
//   const title = req.query.title ?? '';
//   const g_Crime = req.query.Crime ?? '';
//   const popularity = req.query.popularity ?? 0.5;
//   const release_date = req.query.release_date ?? STR_TO_DATE('2000-01-01 00:00:00', '%Y-%m-%d %H:%i:%s');

//   if (!title) {
//     if (explicit == 0) {
//       connection.query(`
//         SELECT *
//         FROM Songs
//         WHERE duration BETWEEN ${durationLow} AND ${durationHigh}
//         AND plays BETWEEN ${playsLow} AND ${playsHigh}
//         AND danceability BETWEEN ${danceabilityLow} AND ${danceabilityHigh}
//         AND energy BETWEEN ${energyLow} AND ${energyHigh}
//         AND valence BETWEEN ${valenceLow} AND ${valenceHigh}
//         AND explicit = 0
//         ORDER BY title ASC
//       `, (err, data) => {
//         if (err || data.length === 0) {
//           console.log(err);
//           res.json([]);
//         }
//         else {
//           res.json(data);
//         }
//       }
//       );
//     } else {
//       connection.query(`
//         SELECT *
//         FROM Songs
//         WHERE duration BETWEEN ${durationLow} AND ${durationHigh}
//         AND plays BETWEEN ${playsLow} AND ${playsHigh}
//         AND danceability BETWEEN ${danceabilityLow} AND ${danceabilityHigh}
//         AND energy BETWEEN ${energyLow} AND ${energyHigh}
//         AND valence BETWEEN ${valenceLow} AND ${valenceHigh}
//         ORDER BY title ASC
//       `, (err, data) => {
//         if (err || data.length === 0) {
//           console.log(err);
//           res.json([]);
//         }
//         else {
//           res.json(data);
//         }
//       }
//       );
//     }

//   } else {
//     if (explicit == 0) {
//       connection.query(`
//         SELECT *
//         FROM Songs
//         WHERE title LIKE '%${title}%'
//         AND duration BETWEEN ${durationLow} AND ${durationHigh}
//         AND plays BETWEEN ${playsLow} AND ${playsHigh}
//         AND danceability BETWEEN ${danceabilityLow} AND ${danceabilityHigh}
//         AND energy BETWEEN ${energyLow} AND ${energyHigh}
//         AND valence BETWEEN ${valenceLow} AND ${valenceHigh}
//         AND explicit = 0
//         ORDER BY title ASC
//       `, (err, data) => {
//         if (err || data.length === 0) {
//           console.log(err);
//           res.json([]);
//         }
//         else {
//           res.json(data);
//         }
//       }
//       );
//     }
//     else {
//       connection.query(`
//         SELECT *
//         FROM Songs
//         WHERE title LIKE '%${title}%'
//         AND duration BETWEEN ${durationLow} AND ${durationHigh}
//         AND plays BETWEEN ${playsLow} AND ${playsHigh}
//         AND danceability BETWEEN ${danceabilityLow} AND ${danceabilityHigh}
//         AND energy BETWEEN ${energyLow} AND ${energyHigh}
//         AND valence BETWEEN ${valenceLow} AND ${valenceHigh}
//         ORDER BY title ASC
//       `, (err, data) => {
//         if (err || data.length === 0) {
//           console.log(err);
//           res.json([]);
//         }
//         else {
//           res.json(data);
//         }
//       }
//       );
//     }
//   }

// }

module.exports = {
  author,
  random,
  movie,
  top_movies,
  search_collections
}
