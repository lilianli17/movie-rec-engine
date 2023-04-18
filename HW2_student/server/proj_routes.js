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
    LIMIT 1;
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data[0]);
    }
  });
}

// Route 2: GET /movie/:movie_id
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


// Route 3: GET /crew/:title
// Search crew members (join movie)
const search_crew = async function(req, res) {
  const title = req.query.title ?? '';
  connection.query(`
    SELECT name, job, department
    FROM Crew
    JOIN Movies on Movies.id = Crew.id
    WHERE original_title = '${title}'
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data);
    }
  }
  );
}

// Route 4: GET /cast/:title
// Search cast members (join movie)
const search_cast = async function(req, res) {
  const title = req.query.title ?? '';
  connection.query(`
    SElECT name, character
    FROM Cast
    JOIN Movies on Movies.id = Cast.id
    WHERE original_title = '${title}'
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data);
    }
  }
  );
}







// Route 6: GET /search_movies WIP
const search_movies = async function(req, res) {
  // search based on title (string), genre (drop down), popularity, release_year
  const title = req.query.title ?? 0;
  const genre = req.query.genre ?? ('Crime','Drama','Comedy','Action','Thriller','Adventure','Science Fiction',
    'Animation','Family','Romance','Mystery','Music','Horror','Fantasy','Documentary','War','Western','History','Foreign');
  const popularity_Low = req.query.popularity ?? 0;
  const release_date_From = req.query.release_date ?? STR_TO_DATE('1950-01-01 00:00:00', '%Y-%m-%d %H:%i:%s');
  const release_date_To = req.query.release_date ?? STR_TO_DATE('2023-01-01 00:00:00', '%Y-%m-%d %H:%i:%s');
  const runtime_Low = req.query.runtime_Low ?? 0;
  const runtime_High = req.query.runtime_High ?? 500;

  if (!title) {
      connection.query(`
        SELECT *
        FROM (SELECT * FROM Movies WHERE
          popularity >= ${popularity} AND release_date BETWEEN ${release_date_From} AND ${release_date_To}
          AND runtime BETWEEN ${runtime_Low} AND ${runtime_High}) M
        JOIN (SELECT id, genre FROM Genres WHERE genre IN ${genre}) G ON M.id=G.id
        ORDER BY title ASC
      `, (err, data) => {
        if (err || data.length === 0) {
          console.log(err);
          res.json([]);
        }
        else {
          res.json(data);
        }
      }
      );}
  else {
      connection.query(`
        SELECT *
        FROM (SELECT * FROM Movies WHERE
          popularity >= ${popularity} AND release_date BETWEEN ${release_date_From} AND ${release_date_To} 
          AND original_title LIKE '%${title}%' AND runtime BETWEEN ${runtime_Low} AND ${runtime_High}) M
        JOIN (SELECT id, genre FROM Genres WHERE genre IN ${genre}) G ON M.id=G.id
        ORDER BY title ASC
      `, (err, data) => {
        if (err || data.length === 0) {
          console.log(err);
          res.json([]);
        }
        else {
          res.json(data);
        }
      }
      );
  }
} 
