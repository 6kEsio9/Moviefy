import { Axios } from "axios";
import { users } from "./AuthService";

const url = "";

const axios = new Axios({ baseURL: url });

axios.interceptors.request.use(
  function (config) {
    config.headers["content-type"] = "application/json";
    config.headers["Authorization"] = localStorage.getItem("token");
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

export type ReviewMovie = {
  userId: string;
  rating: number;
  comment: string;
  likes: string[];
};

export type Movie = {
  id: string;
  title: string;
  imageUrl: string;
  year: number;
  avgRating: number;
  genre: string;
  ageRating: number;
  summary: string;
  director: string;
  cast: string[];
  crew: string[];
  reviews: ReviewMovie[];
};

const movies: Movie[] = [
  {
    id: "0",
    title: "Tenet",
    imageUrl: "/images/tennet.jpeg",
    year: 2005,
    avgRating: 5,
    genre: "Action",
    ageRating: 16,
    summary: "Interesting movie",
    director: "John Doe",
    cast: ["Brad Pitt", "Mark Hamill", "Christian Bale"],
    crew: [],
    reviews: [
      { userId: "0", rating: 3, comment: "Great movie!", likes: ["0", "1"] },
    ],
  },
  {
    id: "1",
    title: "Cars",
    imageUrl: "/images/cars.jpeg",
    year: 2010,
    avgRating: 4,
    genre: "Fantasy",
    ageRating: 3,
    summary: "Interesting movie",
    director: "John Doe",
    cast: ["Brad Pitt", "Mark Hamill", "Christian Bale"],
    crew: [],

    reviews: [],
  },
  {
    id: "2",
    title: "Game Of Thrones",
    imageUrl: "/images/gameOfThrones.jpeg",
    year: 2015,
    avgRating: 2,
    genre: "Fantasy",
    ageRating: 18,
    summary: "Interesting movie",
    director: "John Doe",
    cast: ["Brad Pitt", "Mark Hamill", "Christian Bale"],
    crew: [],

    reviews: [
      { userId: "0", rating: 4, comment: "Great movie!", likes: ["1"] },
    ],
  },
  {
    id: "3",
    title: "Inglourious Basterds",
    imageUrl: "/images/inglouriousBasterds.jpeg",
    year: 2009,
    avgRating: 1,
    genre: "Comedy",
    ageRating: 16,
    summary: "Interesting movie",
    director: "John Doe",
    cast: ["Brad Pitt", "Mark Hamill", "Christian Bale"],
    crew: [],
    reviews: [
      { userId: "0", rating: 4, comment: "Great movie!", likes: ["1"] },
    ],
  },
  {
    id: "4",
    title: "Interstellar",
    imageUrl: "/images/interstellar.jpeg",
    year: 2004,
    avgRating: 3,
    genre: "Sci-Fi",
    ageRating: 12,
    summary: "Interesting movie",
    director: "John Doe",
    cast: ["Brad Pitt", "Mark Hamill", "Christian Bale"],
    crew: [],
    reviews: [
      { userId: "0", rating: 4, comment: "Great movie!", likes: ["1"] },
    ],
  },
  {
    id: "5",
    title: "Star Wars",
    imageUrl: "/images/starWars.jpeg",
    year: 1999,
    avgRating: 4,
    genre: "Sci-Fi",
    ageRating: 12,
    summary: "Interesting movie",
    director: "John Doe",
    cast: ["Brad Pitt", "Mark Hamill", "Christian Bale"],
    crew: [],
    reviews: [
      { userId: "0", rating: 4, comment: "Great movie!", likes: ["1"] },
    ],
  },
  {
    id: "6",
    title: "Taxi",
    imageUrl: "/images/taxi.jpeg",
    year: 2012,
    avgRating: 5,
    genre: "Comedy",
    ageRating: 12,
    summary: "Interesting movie",
    director: "John Doe",
    cast: ["Brad Pitt", "Mark Hamill", "Christian Bale"],
    crew: [],
    reviews: [
      { userId: "0", rating: 4, comment: "Great movie!", likes: ["1"] },
    ],
  },
  {
    id: "7",
    title: "No Game No Life Zero",
    imageUrl:
      "//upload.wikimedia.org/wikipedia/en/3/3d/No_Game%2C_No_Life_Zero_poster.jpg",
    year: 2012,
    avgRating: 5,
    genre: "Comedy",
    ageRating: 12,
    summary: "Interesting movie",
    director: "John Doe",
    cast: ["Brad Pitt", "Mark Hamill", "Christian Bale"],
    crew: [],
    reviews: [
      { userId: "0", rating: 4, comment: "Great movie!", likes: ["1"] },
    ],
  },
  {
    id: "8",
    title: "Pokemon: Firered Version",
    imageUrl:
      "https://m.media-amazon.com/images/M/MV5BYjViMDU3MmItMzM0ZC00OWNmLWEyZWYtMWEyNjAyNjg1YWU4XkEyXkFqcGc@._V1_.jpg",
    year: 2012,
    avgRating: 5,
    genre: "Comedy",
    ageRating: 12,
    summary: "Interesting movie",
    director: "John Doe",
    cast: ["Brad Pitt", "Mark Hamill", "Christian Bale"],
    crew: [],

    reviews: [
      { userId: "0", rating: 4, comment: "Great movie!", likes: ["1"] },
    ],
  },
];

export async function getAll() {
  // const res = await axios.get('/movies');
  // return res;

  return movies;
}

export async function getMovie(movieId: string) {
  // const res = await axios.get('/movies', {params: {movieId: movieId}});
  // return res;

  const movie = movies.find((x) => x.id === movieId);

  return movie;
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

  // const res = await axios.get('/search', {params: {input: searchInput, users: usersB}});
  // return res;

  const result: any = {};

  const resultTemp = movies
    .filter((x) => x.title.toLowerCase().includes(searchInput.toLowerCase()))
    .sort((a, b) => a.title.localeCompare(b.title));
  result.movies = resultTemp;

  if (usersB) {
    const resultUsers = users
      .filter((x) =>
        x.username.toLowerCase().includes(searchInput.toLowerCase())
      )
      .sort((a, b) => a.username.localeCompare(b.username));
    result.users = resultUsers;
  }

  return result;

  // return fetch(url + '/search' + '/searchInput')
  //   .then(res => res.json());
}

export async function rate(
  userId: string,
  movieId: string,
  rating: number,
  comment?: string
) {
  // const res = await axios.post("/movies/rate", {
  //   userId: userId,
  //   movieId: movieId,
  //   rating: rating,
  //   comment: comment
  // });
  // return res;

  console.log("movie rated");
}

export async function editReview(
  userId: string,
  movieId: string,
  comment: string
) {
  const res = await axios.put("/movies/reviews/edit", {
    userId: userId,
    movieId: movieId,
    comment: comment,
  });
  return res;
}

export async function deleteReview(userId: string, movieId: string) {
  // const req = await fetch(`${url}/movies/reviews/delete`, {
  //   method: 'PUT',
  //   headers: {
  //     'content-type': 'application/json',
  //     "Authorization": 'Bearer ' + authToken,
  //   },
  //   body: JSON.stringify({userId, movieId}),
  // });
  // const res = await req.json();
  // return res;
}

export async function like(userId: string, movieId: string, like: boolean) {
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
  // const res = await axios.post('/movies/like', {
  //   userId: userId,
  //   movieId: movieId,
  //   like: like
  // });
  // return res;
}

export function getGenreList() {
  const genreList: string[] = [];
  movies.forEach((movie) => {
    if (!genreList.includes(movie.genre)) genreList.push(movie.genre);
  });
  return genreList;
}

interface MovieDto {
  imageUrl: string;
  title: string;
  summary: string;
  year: number;
  ageRating: number;
  director: string;
  cast: string[];
  crew: string[];
}

export async function addMovie(userId: string, formData: MovieDto) {
  // const res = await axios.post("/movies/add", {
  //   userId: userId,
  //   formData: formData,
  // });
  // return res;
}

export async function filterMovies(filterType: string, filter: string) {
  // const res = await axios.get('/movies/filter', {params: {filterType: filterType, filter: filter}});
  // return res;
}
