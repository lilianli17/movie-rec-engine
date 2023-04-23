const { expect } = require('@jest/globals');
const supertest = require('supertest');
const app = require('../server');
const results = require("./results.json")

// test('GET /author/name', async () => {
//   await supertest(app).get('/author/name')
//     .expect(200)
//     .then((res) => {
//       expect(res.text).toMatch(/(?!.* John Doe$)^Created by .*$/);
//     });
// });

// test('GET /author/pennkey', async () => {
//   await supertest(app).get('/author/pennkey')
//     .expect(200)
//     .then((res) => {
//       expect(res.text).toMatch(/(?!.* jdoe$)^Created by .*$/);
//     });
// });

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
        runtime: expect.any(Number)
      }]);
    });
});

test('GET /movie/14', async () => {
  await supertest(app).get('/movie/14')
    .expect(200)
    .then((res) => {
      expect(res.body).toStrictEqual(results.movie)
    });
 });

// test('GET /album/3lS1y25WAhcqJDATJK70Mq', async () => {
//   await supertest(app).get('/album/3lS1y25WAhcqJDATJK70Mq')
//     .expect(200)
//     .then((res) => {
//       expect(res.body).toStrictEqual(results.album)
//     });
// });

// test('GET /albums', async () => {
//   await supertest(app).get('/albums')
//     .expect(200)
//     .then((res) => {
//       expect(res.body).toStrictEqual(results.albums)
//     });
// });
//?title=all&explicit=true&energy_low=0.5&valence_low=0.2&valence_high=0.8'

test('GET /search_collections', async () => {
  await supertest(app).get('/search_collections/?collection=Three Colors Collection')
    .expect(200)
    .then((res) => {
        console.log(res);
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

// // test('GET /top_songs page 3', async () => {
// //   await supertest(app).get('/top_songs?page=3')
// //     .expect(200)
// //     .then((res) => {
// //       expect(res.body).toStrictEqual(results.top_songs_page_3)
// //     });
// // });

// test('GET /top_songs page 5 page_size 3', async () => {
//   await supertest(app).get('/top_songs?page=5&page_size=3')
//     .expect(200)
//     .then((res) => {
//       expect(res.body).toStrictEqual(results.top_songs_page_5_page_size_3)
//     });
// });

// test('GET /top_albums all', async () => {
//   await supertest(app).get('/top_albums')
//     .expect(200)
//     .then((res) => {
//       expect(res.body.length).toEqual(12)
//       expect(res.body[7]).toStrictEqual(results.top_albums_all_7)
//     });
// });

// test('GET /top_albums page 2', async () => {
//   await supertest(app).get('/top_albums?page=2')
//     .expect(200)
//     .then((res) => {
//       expect(res.body).toStrictEqual(results.top_albums_page_2)
//     });
// });

// test('GET /top_albums page 5 page_size 1', async () => {
//   await supertest(app).get('/top_albums?page=5&page_size=1')
//     .expect(200)
//     .then((res) => {
//       expect(res.body).toStrictEqual(results.top_albums_page_5_page_size_1)
//     });
// });

test('GET /search_movies default', async () => {
   await supertest(app).get('/search_movies')
     //.expect(200)
     .then((res) => {
       expect(res.body.length).toEqual(89142)
       expect(res.body[0]).toStrictEqual({
         id: expect.any(Number),
         imdb_id: expect.any(Number),
         original_title: expect.any(String),
         original_language: expect.any(String),
         overview: expect.any(String),
         popularity: expect.any(Number),
         release_date: expect.any(String),
         runtime: expect.any(Number),
         genre: expect.any(String)
       });
     });
});

// test('GET /search_songs filtered', async () => {
//   await supertest(app).get('/search_songs?popularity_Low=15&genre='Crime'&valence_high=0.8')
//     .expect(200)
//     .then((res) => {
//       expect(res.body).toStrictEqual(results.search_songs_filtered)
//     });
// });