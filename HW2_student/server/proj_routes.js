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
  const title = req.query.title ?? '';

  const g_Crime = req.query.Crime === 'true' ? 'Crime' : '';
  const g_Drama = req.query.Drama === 'true' ? 'Drama' : '';
  const g_Comedy = req.query.Comedy === 'true' ? 'Comedy' : '';
  const g_Action = req.query.Action === 'true' ? 'Action' : '';
  const g_Thriller = req.query.Thriller === 'true' ? 'Thriller' : '';
  const g_Adventure = req.query.Adventure === 'true' ? 'Adventure' : '';
  const g_ScienceFiction = req.query.ScienceFiction === 'true' ? 1 : 0;
  const g_Animation = req.query.Animation === 'true' ? 1 : 0;
  const g_Family = req.query.Family === 'true' ? 1 : 0;
  const g_Romance = req.query.Romance === 'true' ? 1 : 0;
  const g_Mystery = req.query.Mystery === 'true' ? 1 : 0;
  const g_Music = req.query.Music === 'true' ? 1 : 0;
  const g_Horror = req.query.Horror === 'true' ? 1 : 0;
  const g_Fantasy = req.query.Fantasy === 'true' ? 1 : 0;
  const g_Documentary = req.query.Documentary === 'true' ? 1 : 0;
  const g_War = req.query.War === 'true' ? 1 : 0;
  const g_Western = req.query.Western === 'true' ? 1 : 0;
  const g_History = req.query.History === 'true' ? 1 : 0;
  const g_Foreign = req.query.Foreign === 'true' ? 1 : 0;

  const popularity = req.query.popularity ?? 0.5;
  const release_date_From = req.query.release_date ?? STR_TO_DATE('2000-01-01 00:00:00', '%Y-%m-%d %H:%i:%s');
  const release_date_To = req.query.release_date ?? STR_TO_DATE('2023-01-01 00:00:00', '%Y-%m-%d %H:%i:%s');


  if (!title) {
      connection.query(`
        SELECT *
        FROM (SELECT * FROM Movies WHERE
          popularity >= ${popularity} AND release_date BETWEEN ${release_date_From} AND ${release_date_To}) M
        JOIN (SELECT id, genre FROM Genres WHERE
          ) G ON M.id=G.id
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
        FROM Songs
        WHERE duration BETWEEN ${durationLow} AND ${durationHigh}
        AND plays BETWEEN ${playsLow} AND ${playsHigh}
        AND danceability BETWEEN ${danceabilityLow} AND ${danceabilityHigh}
        AND energy BETWEEN ${energyLow} AND ${energyHigh}
        AND valence BETWEEN ${valenceLow} AND ${valenceHigh}
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

  } else {
    if (explicit == 0) {
      connection.query(`
        SELECT *
        FROM Songs
        WHERE title LIKE '%${title}%'
        AND duration BETWEEN ${durationLow} AND ${durationHigh}
        AND plays BETWEEN ${playsLow} AND ${playsHigh}
        AND danceability BETWEEN ${danceabilityLow} AND ${danceabilityHigh}
        AND energy BETWEEN ${energyLow} AND ${energyHigh}
        AND valence BETWEEN ${valenceLow} AND ${valenceHigh}
        AND explicit = 0
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
    else {
      connection.query(`
        SELECT *
        FROM Songs
        WHERE title LIKE '%${title}%'
        AND duration BETWEEN ${durationLow} AND ${durationHigh}
        AND plays BETWEEN ${playsLow} AND ${playsHigh}
        AND danceability BETWEEN ${danceabilityLow} AND ${danceabilityHigh}
        AND energy BETWEEN ${energyLow} AND ${energyHigh}
        AND valence BETWEEN ${valenceLow} AND ${valenceHigh}
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

}