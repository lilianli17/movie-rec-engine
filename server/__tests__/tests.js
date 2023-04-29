const { expect } = require('@jest/globals');
const supertest = require('supertest');
const app = require('../server');
const results = require("./results.json")

test('GET /random', async () => {
  await supertest(app).get('/random')
    .expect(200)
    .then((res) => {
      expect(res.body).toStrictEqual([{
        id: expect.any(Number),
        imdb_id: expect.any(Number),
        original_language: expect.any(String),
        original_title: expect.any(String),
        overview: expect.any(String),
        popularity: expect.any(Number),
        release_date: expect.any(String),
        runtime: expect.any(Number),
        title: expect.any(String),
        tagline: expect.any(String),
      }]);
    });
});

test('GET /movie/11 Star Wars', async () => {
  await supertest(app).get('/movie/11')
    .expect(200)
    .then((res) => {
      expect(res.body).toStrictEqual(results.movie)
    });
 });

test('GET /crew/11 Star Wars', async () => {
  await supertest(app).get('/crew/11')
  .expect(200)
  .then((res) => {
    expect(res.body).toStrictEqual(results.crew)
  });
});

test('GET /genre/11 Star Wars', async () => {
  await supertest(app).get('/genre/11')
  .expect(200)
  .then((res) => {
    expect(res.body).toStrictEqual(results.genres)
  });
});

test('GET /cast/11 Star Wars', async () => {
  await supertest(app).get('/cast/11')
  .expect(200)
  .then((res) => {
    expect(res.body).toStrictEqual(results.cast)
  });
});

test('GET /search_collections', async () => {
  await supertest(app).get('/search_collections/?collection=Three Colors Collection')
    .expect(200)
    .then((res) => {
        // console.log(res);
        expect(res.body).toStrictEqual(results.search_collections);
    });
});

test('GET /get_similar/238', async () => {
  await supertest(app).get('/get_similar/238')
    .expect(200)
    .then((res) => {
      expect(res.body).toStrictEqual(results.top_movies)
    });
});

test('GET /get_similar_genres/100', async () => {
    await supertest(app).get('/get_similar_genres/100')
      .expect(200)
      .then((res) => {
        expect(res.body).toStrictEqual(results.top_movies_genres)
      });
  });

  test('GET /get_similar_crew/100', async () => {
    await supertest(app).get('/get_similar_crew/30')
      .expect(200)
      .then((res) => {
        expect(res.body).toStrictEqual(results.similar_crew)
      });
  });

  test('GET /get_similar_cast/100', async () => {
    await supertest(app).get('/get_similar_cast/250')
      .expect(200)
      .then((res) => {
        expect(res.body).toStrictEqual(results.similar_cast)
      });
  });

  test('GET /get_movies_collection/Kill Bill Collection', async () => {
    await supertest(app).get('/get_movies_collection/Kill Bill Collection')
      .expect(200)
      .then((res) => {
        expect(res.body).toStrictEqual(results.get_movie_collection)
      });
  });

  test('GET /top_popular', async () => {
    await supertest(app).get('/top_popular')
      .expect(200)
      .then((res) => {
        expect(res.body).toStrictEqual(results.top_popular)
      });
  });

  test('GET /top_popular_genre/Action', async () => {
    await supertest(app).get('/top_popular_genre/Action')
      .expect(200)
      .then((res) => {
        expect(res.body).toStrictEqual(results.top_popular_genre)
      });
  });

  test('GET /search_movies', async () => {
    await supertest(app).get('/search_movies')
      .expect(200)
      .then((res) => {
        expect(res.body.length).toEqual(50)
        expect(res.body[0]).toStrictEqual({
          id: expect.any(Number),
          title: expect.any(String),
          overview: expect.any(String),
          popularity: expect.any(Number),
          release_date: expect.any(String),
          runtime: expect.any(Number),
          genre: expect.any(String),
        });
      });
 });
 
 test('GET /search_movies filtered title', async () => {
   await supertest(app).get('/search_movies/?title=Good Will Hunting')
     .expect(200)
     .then((res) => {
       expect(res.body).toStrictEqual(results.search_movies_filtered_title)
     });
 });
 
//  test('GET /search_movies filtered titleANDgenre', async () => {
//    await supertest(app).get('/search_movies/?title=John Wick&genres=Action')
//      .expect(200)
//      .then((res) => {
//        expect(res.body).toStrictEqual(results.search_movies_filtered_title_genre)
//      });
//  });
 
 test('GET /search_movies filtered runtime', async () => {
   await supertest(app).get('/search_movies/?runtime_Low=336&runtime_High=336')
     .expect(200)
     .then((res) => {
       expect(res.body).toStrictEqual(results.search_movies_filtered_runtime)
     });
 });
 
 test('GET /search_movies filtered empty', async () => {
   await supertest(app).get('/search_movies/?runtime_Low=336&runtime_High=336&popularity=10')
     .expect(200)
     .then((res) => {
       expect(res.body).toStrictEqual(results.search_movies_filtered_empty1)
     });
 });
 
 test('GET /search_movies filtered releasedate', async () => {
   await supertest(app).get('/search_movies/?release_date_From=1998-08-12&release_date_To=1998-08-12')
     .expect(200)
     .then((res) => {
       expect(res.body).toStrictEqual(results.search_movies_filtered_releasedate)
     });
 });
 
