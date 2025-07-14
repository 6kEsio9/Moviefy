import axios from "axios";
import { users } from "./AuthService";

const url = "http://keycloak.martinkurtev.com:1235";

const instance = axios.create({
  baseURL: url,
  headers: {
    "Content-Type": "application/json",
  },
});

instance.interceptors.request.use(
  function (config) {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

export type ReviewMovie = {
  id: number;
  content: string;
  likeCount: number;
  username: string;
  pfpUrl: string;
  rating: number;
  isLiked: boolean;
  movieId: string;
  title: string;
  userId: string;
};

export type Movie = {
  id: string;
  title: string;
  posterUrl: string;
  year: number;
  avgRating: number;
  genre: string;
  isAdult: boolean;
  summary: string;
  crew: string[];
  reviews: ReviewMovie[];
};

// const movies: Movie[] = [
//   {
//     id: "tt6723592",
//     title: "Tenet",
//     posterUrl: "/images/tennet.jpeg",
//     year: 2005,
//     avgRating: 5,
//     genre: "Action",
//     isAdult: true,
//     summary: "Interesting movie",
//     director: "John Doe",
//     cast: ["Brad Pitt", "Mark Hamill", "Christian Bale"],
//     crew: [],
//     reviews: [
//       { userId: "0", rating: 3, content: "Great movie!", likes: ["0", "1"] },
//     ],
//   },
//   {
//     id: "tt0317219",
//     title: "Cars",
//     posterUrl: "/images/cars.jpeg",
//     year: 2010,
//     avgRating: 4,
//     genre: "Fantasy",
//     isAdult: true,
//     summary: "Interesting movie",
//     director: "John Doe",
//     cast: ["Brad Pitt", "Mark Hamill", "Christian Bale"],
//     crew: [],

//     reviews: [],
//   },
//   {
//     id: "tt0944947",
//     title: "Game Of Thrones",
//     posterUrl: "/images/gameOfThrones.jpeg",
//     year: 2015,
//     avgRating: 2,
//     genre: "Fantasy",
//     isAdult: true,
//     summary: "Interesting movie",
//     director: "John Doe",
//     cast: ["Brad Pitt", "Mark Hamill", "Christian Bale"],
//     crew: [],

//     reviews: [
//       { userId: "0", rating: 4, comment: "Great movie!", likes: ["1"] },
//     ],
//   },
//   {
//     id: "tt3563338",
//     title: "Inglourious Basterds",
//     posterUrl: "/images/inglouriousBasterds.jpeg",
//     year: 2009,
//     avgRating: 1,
//     genre: "Comedy",
//     isAdult: true,
//     summary: "Interesting movie",
//     director: "John Doe",
//     cast: ["Brad Pitt", "Mark Hamill", "Christian Bale"],
//     crew: [],
//     reviews: [
//       { userId: "0", rating: 4, comment: "Great movie!", likes: ["1"] },
//     ],
//   },
//   {
//     id: "tt0816692",
//     title: "Interstellar",
//     posterUrl: "/images/interstellar.jpeg",
//     year: 2004,
//     avgRating: 3,
//     genre: "Sci-Fi",
//     isAdult: true,
//     summary: "Interesting movie",
//     director: "John Doe",
//     cast: ["Brad Pitt", "Mark Hamill", "Christian Bale"],
//     crew: [],
//     reviews: [
//       { userId: "0", rating: 4, comment: "Great movie!", likes: ["1"] },
//     ],
//   },
//   {
//     id: "tt0076759",
//     title: "Star Wars",
//     posterUrl: "/images/starWars.jpeg",
//     year: 1999,
//     avgRating: 4,
//     genre: "Sci-Fi",
//     isAdult: true,
//     summary: "Interesting movie",
//     director: "John Doe",
//     cast: ["Brad Pitt", "Mark Hamill", "Christian Bale"],
//     crew: [],
//     reviews: [
//       { userId: "0", rating: 4, comment: "Great movie!", likes: ["1"] },
//     ],
//   },
//   {
//     id: "tt0152930",
//     title: "Taxi",
//     posterUrl: "/images/taxi.jpeg",
//     year: 2012,
//     avgRating: 5,
//     genre: "Comedy",
//     isAdult: true,
//     summary: "Interesting movie",
//     director: "John Doe",
//     cast: ["Brad Pitt", "Mark Hamill", "Christian Bale"],
//     crew: [],
//     reviews: [
//       { userId: "0", rating: 4, comment: "Great movie!", likes: ["1"] },
//     ],
//   },
//   {
//     id: "tt5914996",
//     title: "No Game No Life Zero",
//     posterUrl:
//       "//upload.wikimedia.org/wikipedia/en/3/3d/No_Game%2C_No_Life_Zero_poster.jpg",
//     year: 2012,
//     avgRating: 5,
//     genre: "Comedy",
//     isAdult: true,
//     summary: "Interesting movie",
//     director: "John Doe",
//     cast: ["Brad Pitt", "Mark Hamill", "Christian Bale"],
//     crew: [],
//     reviews: [
//       { userId: "0", rating: 4, comment: "Great movie!", likes: ["1"] },
//     ],
//   },
//   {
//     id: "8",
//     title: "Pokemon: Firered Version",
//     posterUrl:
//       "https://m.media-amazon.com/images/M/MV5BYjViMDU3MmItMzM0ZC00OWNmLWEyZWYtMWEyNjAyNjg1YWU4XkEyXkFqcGc@._V1_.jpg",
//     year: 2012,
//     avgRating: 5,
//     genre: "Comedy",
//     isAdult: true,
//     summary: "Interesting movie",
//     director: "John Doe",
//     cast: ["Brad Pitt", "Mark Hamill", "Christian Bale"],
//     crew: [],

//     reviews: [
//       { userId: "0", rating: 4, comment: "Great movie!", likes: ["1"] },
//     ],
//   },
// ];

export async function getAll(limit?: number, offset?: number) {
  const res = await instance.get("/movies", {
    params: { limit: limit, offset: offset },
  });
  return res;

  // return movies;
}

export async function getMovie(movieId: string) {
  const res = await instance.get("/movies", { params: { movieId: movieId } });
  return res;

  //done
}

export async function search(searchInput: string, usersB: boolean) {
  // const req = await fetch(
  //   `${url}/search?` +
  //     new URLSearchParams({
  //       input: searchInput,
  //       users: usersB ? "true" : "false",
  //     })
  // );

  // const res = await req.json();
  // return res;

  // const res = await instance.get('/search', {params: {input: searchInput, users: usersB}});
  // return res;

  // const result: any = {};

  // const resultTemp = movies
  //   .filter((x) => x.title.toLowerCase().includes(searchInput.toLowerCase()))
  //   .sort((a, b) => a.title.localeCompare(b.title));
  // result.movies = resultTemp;

  // if (usersB) {
  //   const resultUsers = users
  //     .filter((x) =>
  //       x.username.toLowerCase().includes(searchInput.toLowerCase())
  //     )
  //     .sort((a, b) => a.username.localeCompare(b.username));
  //   result.users = resultUsers;
  // }

  // return result;

  // return fetch(url + '/search' + '/searchInput')
  //   .then(res => res.json());
}

export async function rate(movieId: string, rating: number, comment?: string) {
  const res = await instance.post("/movies/rate", {
    movieId: movieId,
    rating: rating,
    comment: comment,
  });
  return res;
  //done
}

export async function deleteReview(userId: string, movieId: string) {
  const res = await instance.delete(`${url}/movies/reviews/delete`, {params: {userId: userId, movieId: movieId}});
  return res;
}

export async function like(
  commentId: string,
) {
  // const req = await fetch(`${url}/movies/like`, {
  //   method: "POST",
  //   headers: {
  //     "content-type": "application/json",
  //     Authorization: "Bearer " + authToken,
  //   },
  //   body: JSON.stringify({ userId, movieId, like }),
  // });
  // const res = await req.json();
  // return res;
  const res = await instance.post('/users/reviews/like', {
    commentId
  });
  return res;
}

export function getGenreList() {
  // const genreList: string[] = [];
  // movies.forEach((movie) => {
  //   if (!genreList.includes(movie.genre)) genreList.push(movie.genre);
  // });
  // return genreList;
}

interface MovieDto {
  title: string;
  posterUrl: string;
  year: number;
  avgRating: number;
  genre: string;
  isAdult: boolean;
  summary: string;
  cast: string[];
}

export async function addMovie(userId: string, formData: MovieDto) {
  // const res = await instance.post("/movies/add", {
  //   userId: userId,
  //   formData: formData,
  // });
  // return res;
}

export async function filterMovies(filterType: string, filter: string) {
  // const res = await instance.get('/movies/filter', {params: {filterType: filterType, filter: filter}});
  // return res;
}
