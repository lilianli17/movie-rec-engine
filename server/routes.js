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

// Route 1: GET /random
const random = async function(req, res) {
  connection.query(`
    SELECT *
    FROM Movies
    ORDER BY RAND()
    LIMIT 1
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data[0]);
    }
  });
}

// Route 2: GET /movie/:movie_id get movie by id
const movie = async function(req, res) {
  connection.query(`
  SELECT *
  FROM Movies
  WHERE id = ${req.params.movie_id}
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data[0]);
    }
  });
}

// Route 3: GET /genre get all genres
const get_all_genres = async function(req, res) {
  connection.query(`
    SELECT DISTINCT genre
    FROM Genres
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json([]);
    } else {
      res.json(data);
    }
  });
}

// Route 4: GET /genre/:movie_id get genres by movie id
const get_genres = async function(req, res) {
  connection.query(`
    SELECT genre
    FROM Genres
    WHERE id = ${req.params.movie_id}
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json([]);
    } else {
      res.json(data);
    }
  });
}

// Route 5: GET /movie_genre/:genre get movies by genre
const get_movies_by_genres = async function(req, res) {
  const genre = req.params.genre ?? ['"Crime"','"Drama"','"Comedy"','"Action"','"Thriller"','"Adventure"','"Science Fiction"', '"Animation"','"Family"','"Romance"','"Mystery"','"Music"','"Horror"','"Fantasy"','"Documentary"','"War"','"Western"','"History"','"Foreign"', '"TV Movie"'];
  connection.query(`
      SELECT DISTINCT M.title, M.original_language AS language, M.tagline, M.popularity, M.release_date, M.runtime, M.id
      FROM (SELECT * FROM Genres WHERE genre IN (${genre})) G
      JOIN Movies M on M.id = G.id
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json([]);
    } else {
      res.json(data);
    }
  });
}

// Route 6: GET /search_crew/:id get crew by movie id
const search_crew = async function(req, res) {
  if (req.params.movie_id === undefined) {
    res.status(400).send(`movie is not specified`);
  } else {
    const movie_id = req.params.movie_id ?? '';
    connection.query(`
      SELECT name, job, department
      FROM Crew
      JOIN Movies on Movies.id = Crew.id
      WHERE Movies.id = ${movie_id}
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

// Route 7: GET /cast/:movie_id get cast by movie id
const search_cast = async function(req, res) {
  if (req.params.movie_id === undefined) {
    res.status(400).send(`movie is not specified`);
  } else {
    const movie_id = req.params.movie_id;
    connection.query(`
      SElECT c.name, c.character
      FROM Cast c
      JOIN Movies on Movies.id = c.id
      WHERE Movies.id = ${movie_id}
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

// Route 8: GET /top_popular get top 10 popular movies
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
  }
  );
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
  console.log(req.params)
  connection.query(`
    SELECT M.id, M.original_title, M.overview, M.popularity, M.runtime, C.collection
    FROM Collections C LEFT JOIN Movies M ON C.id = M.id
    WHERE C.coll_id = ${req.params.coll_id}
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json([]);
    } else {
      console.log(data);
      res.json(data);
    }
  });
}

const get_collection = async function(req, res) {
  connection.query(`
  SELECT C.collection, GROUP_CONCAT(DISTINCT C.original_title) AS movies, GROUP_CONCAT(DISTINCT G.genre) AS genres, GROUP_CONCAT(DISTINCT K.keywords) AS keywords
  FROM Collections C LEFT JOIN Genres G ON C.id = G.id LEFT JOIN Keywords K ON C.id = K.id
  WHERE C.coll_id = ${req.params.coll_id};
  `, (err, data) => {
      if (err || data.length === 0 || !data) {
      console.log(err);
      res.json({});
      } else {
          res.json(data[0]);
      }
  });
}

const get_similar = async function(req, res) {
  connection.query(`
  SELECT m2.id, m2.original_title, COUNT(*) AS similarity_score
  FROM Movies m1
  JOIN Genres g1 ON m1.id = g1.id
  JOIN Cast c1 ON m1.id = c1.id
  JOIN Crew cr1 ON m1.id = cr1.id
  JOIN Movies m2 ON m2.id <> m1.id
  JOIN Genres g2 ON m2.id = g2.id AND g1.genre = g2.genre
  JOIN Cast c2 ON m2.id = c2.id AND c1.name = c2.name
  JOIN Crew cr2 ON m2.id = cr2.id AND cr1.name = cr2.name
  WHERE m1.original_title = '${req.params.original_title}' AND m2.id <> m1.id
  GROUP BY m2.original_title
  ORDER BY similarity_score DESC;
  `, (err, data) => {
    if (err || data.length === 0 || !data) {
      console.log(err);
      res.json([]);
    } else {
        console.log(data);
        res.json(data);
    }
  });

}

const get_similar_genres = async function(req, res) {
    connection.query(`
    SELECT m2.id, m2.original_title, COUNT(*) AS similarity_score
    FROM Movies m1
    JOIN Genres g1 ON m1.id = g1.id
    JOIN Movies m2 ON m2.id <> m1.id
    JOIN Genres g2 ON m2.id = g2.id AND g1.genre = g2.genre
    WHERE m1.original_title = '${req.params.original_title}' AND m2.id <> m1.id
    GROUP BY m2.original_title
    ORDER BY similarity_score DESC;
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
  SELECT m2.id, m2.original_title, COUNT(*) AS similarity_score
  FROM Movies m1
  JOIN Cast c1 ON m1.id = c1.id
  JOIN Movies m2 ON m2.id <> m1.id
  JOIN Cast c2 ON m2.id = c2.id AND c1.name = c2.name
  WHERE m1.original_title = '${req.params.original_title}' AND m2.id <> m1.id
  GROUP BY m2.original_title
  ORDER BY similarity_score DESC;
  `, (err, data) => {
    if (err || data.length === 0 || !data) {
      console.log(err);
      res.json([]);
    } else {
        console.log(data);
        res.json(data);
    }
  });

}

const get_ml = async function(req, res) {
  connection.query(`
  SELECT d.id AS id, d.original_title AS original_title, l.similarity AS similarity_score
    FROM ML l INNER JOIN df_train d ON l.movie2 = d.id INNER JOIN df_train d2 ON l.movie1 = d2.id
    WHERE l.movie1 <> l.movie2 AND d2.original_title = '${req.params.original_title}'
    GROUP BY d.id, d.original_title, l.similarity
    ORDER BY l.similarity DESC;
  `, (err, data) => {
    if (err || data.length === 0 || !data) {
      console.log(err);
      //console.log(id);
      res.json([]);
    } else {
        console.log(data);
        res.json(data);
    }
  });

}

const get_similar_crew = async function(req, res) {
    connection.query(`
    SELECT m2.id, m2.original_title, COUNT(*) AS similarity_score
    FROM Movies m1
    JOIN Crew cr1 ON m1.id = cr1.id
    JOIN Movies m2 ON m2.id <> m1.id
    JOIN Crew cr2 ON m2.id = cr2.id AND cr1.name = cr2.name
    WHERE m1.original_title = '${req.params.original_title}' AND m2.id <> m1.id
    GROUP BY m2.original_title
    ORDER BY similarity_score DESC;
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

const search_collections = async function(req, res) {
  const original_title = req.query.original_title ?? '';
  const collection = req.query.collection ?? '';
  let genres = NaN
  if (req.query.genres) {
    const temp = req.query.genres.split(",");
    let tempString = "("
    for (var i = 0; i < temp.length; i++) {
        tempString += "\'" + temp[i] + "\'" + ",";
    }
    tempString = tempString.slice(0, -1);
    tempString += ")";
    genres = tempString;
  }
  let keywords = NaN
  if (req.query.keywords) {
    const temp = req.query.keywords.split(",");
    let tempString = "("
    for (var i = 0; i < temp.length; i++) {
        tempString += "\'" + temp[i] + "\'" + ",";
    }
    tempString = tempString.slice(0, -1);
    tempString += ")";
    keywords = tempString;
  }
  if (!keywords) {
    if(!genres) {
        connection.query(`
        SELECT C.coll_id, C.collection, GROUP_CONCAT(DISTINCT C.original_title) AS movies, GROUP_CONCAT(DISTINCT G.genre) AS genres, GROUP_CONCAT(DISTINCT K.keywords) AS keywords
        FROM Collections C LEFT JOIN Genres G ON C.id = G.id LEFT JOIN Keywords K ON C.id = K.id
        WHERE C.coll_id IN (
          SELECT Co.coll_id
          FROM Collections Co
          WHERE Co.original_title LIKE '%${original_title}%'
        )
        AND collection LIKE '%${collection}%'
        GROUP BY C.collection;
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
            WHERE C.coll_id IN (
              SELECT Co.coll_id
              FROM Collections Co
              WHERE Co.original_title LIKE '%${original_title}%'
            )
            AND collection LIKE '%${collection}%'
            AND G.genre IN ${genres}
            GROUP BY C.collection;
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
        WHERE C.coll_id IN (
          SELECT Co.coll_id
          FROM Collections Co
          WHERE Co.original_title LIKE '%${original_title}%'
        )
        AND collection LIKE '%${collection}%'
        AND K.keywords IN ${keywords}
        GROUP BY Collection;
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
        WHERE C.coll_id IN (
          SELECT Co.coll_id
          FROM Collections Co
          WHERE Co.original_title LIKE '%${original_title}%'
        )
        AND collection LIKE '%${collection}%'
        AND G.genre IN ${genres}
        AND K.keywords IN ${keywords}
        GROUP BY Collection;
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



// Route 7: GET /search_movies
const search_movies = async function(req, res) {
  const title = req.query.title ?? '';
  const popularity = req.query.popularity ?? 0;
  const release_date_From = req.query.release_date_From ?? "1800-01-01";
  const release_date_To = req.query.release_date_To;
  const runtime_Low = req.query.runtime_Low ?? -1;
  const runtime_High = req.query.runtime_High ?? 1257;

  if (release_date_To === '' || !release_date_To) {
    connection.query(`
      SELECT DISTINCT title,runtime,popularity,overview,id,release_date
      FROM Movies
      WHERE title LIKE '%${title}%' AND popularity >= ${popularity}
      AND runtime BETWEEN ${runtime_Low} AND ${runtime_High}
      AND release_date BETWEEN "${release_date_From}" AND "2023-01-01"
      LIMIT 50;
        `, (err, data) => {
          if (err || data.length === 0) {
            console.log(err);
            res.json([]);
          } else {
            res.json(data);
        }
        });
    } else {
      connection.query(`
      SELECT DISTINCT title,runtime,popularity,overview,id,release_date
      FROM Movies
      WHERE title LIKE '%${title}%' AND popularity >= ${popularity}
      AND runtime BETWEEN ${runtime_Low} AND ${runtime_High}
      AND release_date BETWEEN "${release_date_From}" AND "${release_date_To}"
      LIMIT 50;
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

module.exports = {
  random,
  movie,
  get_genres,
  get_all_genres,
  get_movies_by_genres,
  get_similar,
  search_collections,
  search_movies,
  search_cast,
  search_crew,
  get_similar_genres,
  get_similar_crew,
  get_similar_cast,
  get_movies_collection,
  top_popular,
  top_popular_genre,
  get_collection,
  get_ml
}
