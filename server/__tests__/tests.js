const { expect } = require('@jest/globals');
const supertest = require('supertest');
const app = require('../server');
const results = require("./results.json")

test('GET /random', async () => {
  await supertest(app).get('/random')
    .expect(200);
});

test('GET /movie/11 Star Wars', async () => {
  await supertest(app).get('/movie/11')
    .expect(200)
    .then((res) => {
      expect(res.body).toStrictEqual(results.movie)
    });
});

test('GET /movie/Error', async () => {
    await supertest(app).get('/movie/Hef4sead34d3f4dawfseda2w3fsedllo')
      .expect(200)
      .then((res) => {
        expect(res.body).toStrictEqual({})
      });
  });

test('GET /genre get all genres', async () => {
  await supertest(app).get('/genre')
    .expect(200)
    .then((res) => {
      expect(res.body).toStrictEqual(results.genres)
    });
});

test('GET /crew/11 Star Wars', async () => {
  await supertest(app).get('/crew/11')
  .expect(200)
  .then((res) => {
    expect(res.body).toStrictEqual(results.crew)
  });
});

test('GET /crew/Error', async () => {
    await supertest(app).get('/crew/Helr34sefare23w234s3selo')
    .expect(200)
    .then((res) => {
      expect(res.body).toStrictEqual([])
    });
  });


test('GET /genre/11 Star Wars', async () => {
  await supertest(app).get('/genre/11')
  .expect(200)
  .then((res) => {
    expect(res.body).toStrictEqual(results.genres_start_wars)
  });
});

test('GET /genre/Error', async () => {
    await supertest(app).get('/genre/Her34sef3w4eg32arwse4r2a3rw23llo')
    .expect(200)
    .then((res) => {
      expect(res.body).toStrictEqual([])
    });
  });

test('GET /cast/11 Star Wars', async () => {
  await supertest(app).get('/cast/11')
  .expect(200)
  .then((res) => {
    expect(res.body).toStrictEqual(results.cast)
  });
});

test('GET /cast/Error', async () => {
    await supertest(app).get('/cast/Heldwaeffe234242wseawszwardrfeafrvdrfedeafedEAWFRSFAEWRSDVlo')
    .expect(200)
    .then((res) => {
      expect(res.body).toStrictEqual([])
    });
  });

test('GET /movie_genre/"Drama"', async () => {
  await supertest(app).get('/movie_genre/"Drama"')
  .expect(200)
  .then((res) => {
    expect(res.body[0]).toEqual(results.drama);
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

test('GET /search_collections ERROR', async () => {
    await supertest(app).get('/search_collections/rferstsh234ewsfrfrew3refrwrefdes')
      .expect(404);
  });

  test('GET /search_collections', async () => {
    await supertest(app).get('/search_collections/?collection=Three Colors Collection')
      .expect(200)
      .then((res) => {
          expect(res.body).toStrictEqual(results.search_collections);
      });
  });
  test('GET /search_collections/Genre', async () => {
    await supertest(app).get('/search_collections/?collection=20th Century Boys Collection&genres=Adventure')
      .expect(200)
      .then((res) => {
          expect(res.body).toStrictEqual(results.search_collection_genre);
      });
  });

  test('GET /search_collections/keywords', async () => {
    await supertest(app).get('/search_collections/?collection=20th Century Boys Collection&keywords=anime')
      .expect(200)
      .then((res) => {
          expect(res.body).toStrictEqual(results.search_collection_keywords);
      });
  });

test('GET /get_similar/The Godfather', async () => {
  await supertest(app).get('/get_similar/The Godfather')
    .expect(200)
    .then((res) => {
      expect(res.body[0]).toStrictEqual(results.get_similar)
    });
}, 10000);


test('GET /get_similar/Error', async () => {
    await supertest(app).get('/get_similar/123456321456u653425676534267634256')
      .expect(200)
      .then((res) => {
        expect(res.body[0]).toStrictEqual(undefined)
      });
  }, 10000);

test('GET /get_similar_genres/The Godfather', async () => {
    await supertest(app).get('/get_similar_genres/The Godfather')
      .expect(200)
      .then((res) => {
        expect(res.body[0]).toStrictEqual(results.get_similar_genre)
      });
  }, 10000);

  test('GET /get_similar_genres/Error', async () => {
    await supertest(app).get('/get_similar_genres/123456321456u653425676534267634256')
      .expect(200)
      .then((res) => {
        expect(res.body[0]).toStrictEqual(undefined)
      });
  }, 10000);

  test('GET /get_similar_crew/The Godfather', async () => {
    await supertest(app).get('/get_similar_crew/The Godfather')
      .expect(200)
      .then((res) => {
        expect(res.body[0]).toStrictEqual(results.similar_crew)
      });
  }, 10000);

  test('GET /get_similar_crew/Error', async () => {
    await supertest(app).get('/get_similar_crew/123456321456u653425676534267634256')
      .expect(200)
      .then((res) => {
        expect(res.body[0]).toStrictEqual(undefined)
      });
  }, 10000);

  test('GET /get_similar_cast/The Godfather', async () => {
    await supertest(app).get('/get_similar_cast/The Godfather')
      .expect(200)
      .then((res) => {
        expect(res.body[0]).toStrictEqual(results.similar_cast)
      });
  }, 10000);

  test('GET /get_similar_cast/Error', async () => {
    await supertest(app).get('/get_similar_cast/123456321456u653425676534267634256')
      .expect(200)
      .then((res) => {
        expect(res.body[0]).toStrictEqual(undefined)
      });
  }, 10000);

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

  test('GET /top_popular_genre/Error', async () => {
    await supertest(app).get('/top_popular_genre/1234r32efs32r3wse5643213452')
      .expect(200)
      .then((res) => {
        expect(res.body).toStrictEqual([])
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
          runtime: expect.any(Number)
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


 test('GET /search_movies Error', async () => {
    await supertest(app).get('/search_movies/?title=23456432564werfdgre34ret3213rt54')
      .expect(200)
      .then((res) => {
        expect(res.body).toStrictEqual([])
      });
  });
 
 
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

 test('GET /get_movies_collection', async () => {
    await supertest(app).get('/get_movies_collection/1137')
      .expect(200)
      .then((res) => {
        expect(res.body).toStrictEqual(results.get_movies_collection)
      });
  });

  test('GET /get_movies_collection Error', async () => {
    await supertest(app).get('/get_movies_collection/rwegdtaterewqr23w4reasa23dgdfrsdzfawe')
      .expect(200)
      .then((res) => {
        expect(res.body).toStrictEqual([])
      });
  });

  test('GET /get_collection', async () => {
    await supertest(app).get('/get_collection/1137')
      .expect(200)
      .then((res) => {
        expect(res.body).toStrictEqual(results.get_collection)
      });
  });

  test('GET /get_collection Error', async () => {
    await supertest(app).get('/get_collection/fasdghsarr32qwfs3ad23weq23efgdsadfeadvz')
      .expect(200)
      .then((res) => {
        expect(res.body).toStrictEqual({})
      });
  });
  
 
