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
        data
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

const top_popular = async function(req, res) {
    connection.query(`
      SELECT *
      FROM Movies
      ORDER BY popularity DESC
      LIMIT 10
    `, (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json([]);
      } else {
        res.json(data);
      }
    });
  }

  const top_popular_genre = async function(req, res) {
    connection.query(`
      SELECT *
      FROM Movies M INNER JOIN Genres G ON M.id = G.id
      WHERE G.genre = '${req.params.genre}'
      ORDER BY popularity DESC
      LIMIT 10
    `, (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json([]);
      } else {
        res.json(data);
      }
    });
  }

const get_movies_collection = async function(req, res) {
    //console.log(req.params)
    connection.query(`
      SELECT M.original_title, C.collection
      FROM Collections C LEFT JOIN Movies M ON C.id = M.id
      WHERE C.collection = '${req.params.collection}'
    `, (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json([]);
      } else {
        res.json(data);
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
const get_similar = async function(req, res) {
  connection.query(`
  SELECT m2.original_title, COUNT(*) AS similarity_score
  FROM Movies m1
  JOIN Genres g1 ON m1.id = g1.id
  JOIN Cast c1 ON m1.id = c1.id
  JOIN Crew cr1 ON m1.id = cr1.id
  JOIN Movies m2 ON m2.id <> m1.id
  JOIN Genres g2 ON m2.id = g2.id AND g1.genre = g2.genre
  JOIN Cast c2 ON m2.id = c2.id AND c1.name = c2.name
  JOIN Crew cr2 ON m2.id = cr2.id AND cr1.name = cr2.name
  WHERE m1.id = '${req.params.id}' AND m2.id != m1.id
  GROUP BY m2.original_title
  ORDER BY similarity_score DESC
  LIMIT 10;
  `, (err, data) => {
    if (err || data.length === 0 || !data) {
      console.log(err);
      //console.log(id);
      res.json([]);
    } else {
        res.json(data);
    }
  });

}

const get_similar_genres = async function(req, res) {
    connection.query(`
    SELECT m2.original_title, COUNT(*) AS similarity_score
    FROM Movies m1
    JOIN Genres g1 ON m1.id = g1.id
    JOIN Movies m2 ON m2.id <> m1.id
    JOIN Genres g2 ON m2.id = g2.id AND g1.genre = g2.genre
    WHERE m1.id = '${req.params.id}' AND m2.id != m1.id
    GROUP BY m2.original_title
    ORDER BY similarity_score DESC
    LIMIT 10;
    `, (err, data) => {
      if (err || data.length === 0 || !data) {
        console.log(err);
        //console.log(id);
        res.json([]);
      } else {
          res.json(data);
      }
    });
  
  }

  const get_similar_cast = async function(req, res) {
    connection.query(`
    SELECT m2.original_title, COUNT(*) AS similarity_score
    FROM Movies m1
    JOIN Cast c1 ON m1.id = c1.id
    JOIN Movies m2 ON m2.id <> m1.id
    JOIN Cast c2 ON m2.id = c2.id AND c1.name = c2.name
    WHERE m1.id = '${req.params.id}' AND m2.id != m1.id
    GROUP BY m2.original_title
    ORDER BY similarity_score DESC
    LIMIT 10;
    `, (err, data) => {
      if (err || data.length === 0 || !data) {
        console.log(err);
        //console.log(id);
        res.json([]);
      } else {
          res.json(data);
      }
    });
  
  }

  const get_similar_crew = async function(req, res) {
    connection.query(`
    SELECT m2.original_title, COUNT(*) AS similarity_score
    FROM Movies m1
    JOIN Crew cr1 ON m1.id = cr1.id
    JOIN Movies m2 ON m2.id <> m1.id
    JOIN Crew cr2 ON m2.id = cr2.id AND cr1.name = cr2.name
    WHERE m1.id = '${req.params.id}' AND m2.id != m1.id
    GROUP BY m2.original_title
    ORDER BY similarity_score DESC
    LIMIT 10;
    `, (err, data) => {
      if (err || data.length === 0 || !data) {
        console.log(err);
        //console.log(id);
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
  const keywords = req.query.keywords;
  const genres = req.query.genres;
  if (!keywords) {
    if(!genres) {
        connection.query(`
        SELECT C.collection, GROUP_CONCAT(DISTINCT C.original_title) AS movies, GROUP_CONCAT(DISTINCT G.genre) AS genres, GROUP_CONCAT(DISTINCT K.keywords) AS keywords
        FROM Collections C LEFT JOIN Genres G ON C.id = G.id LEFT JOIN Keywords K ON C.id = K.id
        WHERE C.original_title LIKE '%${original_title}%'
        AND collection LIKE '%${collection}%'
        GROUP BY C.collection
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
        else {
            connection.query(`
            SELECT C.collection, GROUP_CONCAT(DISTINCT C.original_title) AS movies, GROUP_CONCAT(DISTINCT G.genre) AS genres, GROUP_CONCAT(DISTINCT K.keywords) AS keywords
            FROM Collections C LEFT JOIN Genres G ON C.id = G.id LEFT JOIN Keywords K ON C.id = K.id
            WHERE C.original_title LIKE '%${original_title}%'
            AND collection LIKE '%${collection}%'
            AND G.genre IN '${genres}'
            GROUP BY C.collection
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
  }
  else {
    if (!genres) {
        connection.query(`
        SELECT C.collection, GROUP_CONCAT(DISTINCT C.original_title) AS movies, GROUP_CONCAT(DISTINCT G.genre) AS genres, GROUP_CONCAT(DISTINCT K.keywords) AS keywords
        FROM Collections C LEFT JOIN Genres G ON C.id = G.id LEFT JOIN Keywords K ON C.id = K.id
        WHERE C.original_title LIKE '%${original_title}%'
        AND collection LIKE '%${collection}%'
        AND K.keywords IN '${keywords}'
        GROUP BY Collection
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
    else {
        connection.query(`
        SELECT C.collection, GROUP_CONCAT(DISTINCT C.original_title) AS movies, GROUP_CONCAT(DISTINCT G.genre) AS genres, GROUP_CONCAT(DISTINCT K.keywords) AS keywords
        FROM Collections C LEFT JOIN Genres G ON C.id = G.id LEFT JOIN Keywords K ON C.id = K.id
        WHERE C.original_title LIKE '%${original_title}%'
        AND collection LIKE '%${collection}%'
        AND G.genre IN '${genres}'
        AND K.keywords IN '${keywords}'
        GROUP BY Collection
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
    
  }
  
}

/************************
 * ADVANCED INFO ROUTES *
 ************************/

// Route 6: GET /search_movies
const search_movies = async function(req, res) {
  // search based on title (string), genre (drop down), popularity, release_year
  const original_title = req.query.original_title ??'';
  const genre = req.query.genre ?? ['Crime','Drama','Comedy','Action','Thriller','Adventure','Science Fiction',
    'Animation','Family','Romance','Mystery','Music','Horror','Fantasy','Documentary','War','Western','History','Foreign'];
  const popularity_Low = req.query.popularity ?? 0;
  const release_date_From = req.query.release_date_From ?? '1800-01-01 00:00:00';
  const release_date_To = req.query.release_date_To ?? '2023-01-01 00:00:00';
  const runtime_Low = req.query.runtime_Low ?? -1;
  const runtime_High = req.query.runtime_High ?? 1257;

  connection.query(`
         SELECT M.id,imdb_id,original_title,original_language,overview,popularity,release_date,runtime,G.genre
         FROM (SELECT * FROM Movies WHERE
           popularity >= ${popularity_Low} AND original_title LIKE '${original_title}'
           AND runtime BETWEEN ${runtime_Low} AND ${runtime_High}
           AND release_date BETWEEN '${release_date_From}' AND '${release_date_To}') M
         JOIN (SELECT id, genre FROM Genres WHERE genre IN ${genre}) G ON M.id=G.id
         ORDER BY original_title ASC
       `, (err, data) => {
         if (err || data.length === 0) {
           console.log(err);
           res.json([]);
        }
         else {
           res.json(data);
         }
       }
  )

  // if (!title) {
  //     connection.query(`
  //       SELECT M.id,imdb_id,original_title,original_language,overview,popularity,release_date,runtime,G.genre
  //       FROM (SELECT * FROM Movies WHERE
  //         popularity >= ${popularity_Low} AND release_date BETWEEN ${release_date_From} AND ${release_date_To}
  //         AND runtime BETWEEN ${runtime_Low} AND ${runtime_High}) M
  //       JOIN (SELECT id, genre FROM Genres WHERE genre IN ${genre}) G ON M.id=G.id
  //       ORDER BY original_title ASC
  //     `, (err, data) => {
  //       if (err || data.length === 0) {
  //         console.log(err);
  //         res.json([]);
  //       }
  //       else {
  //         res.json(data);
  //       }
  //     }
  //     );}
  // else {
  //     connection.query(`
  //       SELECT M.id,imdb_id,original_title,original_language,overview,popularity,release_date,runtime,G.genre
  //       FROM (SELECT * FROM Movies WHERE
  //         popularity >= ${popularity_Low} AND release_date BETWEEN ${release_date_From} AND ${release_date_To} 
  //         AND original_title LIKE '%${title}%' AND runtime BETWEEN ${runtime_Low} AND ${runtime_High}) M
  //       JOIN (SELECT id, genre FROM Genres WHERE genre IN ${genre}) G ON M.id=G.id
  //       ORDER BY original_title ASC
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
  // }
} 

module.exports = {
  author,
  random,
  movie,
  get_similar,
  search_collections,
  search_movies,
  get_similar_genres,
  get_similar_crew,
  get_similar_cast,
  get_movies_collection,
  top_popular,
  top_popular_genre
}
