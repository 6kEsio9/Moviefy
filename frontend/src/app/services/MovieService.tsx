import { users } from "./AuthService";

const url = "";

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

    reviews: [
      { userId: "0", rating: 4, comment: "Great movie!", likes: ["1"] },
    ],
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
  // const req = await fetch(`${url}/movies`);
  // const res = await req.json();
  // return res;

  return movies;
}

export async function getMovie(movieId: string) {
  // const req = await fetch(`${url}/movies?` + new URLSearchParams({movieId: movieId}));
  // const res = await req.json();
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
  authToken: string,
  comment?: string
) {
  // const req = await fetch(`${url}/movies/rate`, {
  //   method: "POST",
  //   headers: {
  //     "content-type": "application/json",
  //     "Authorization": 'Bearer ' + authToken,
  //   },
  //   body: JSON.stringify({ userId, movieId, rating, comment }),
  // });
  console.log("movie rated");
}

export async function editReview(
  userId: string,
  movieId: string,
  comment: string,
  authToken: string
) {
  // const req = await fetch(`${url}/movies/reviews/edit`, {
  //   method: 'PUT',
  //   headers: {
  //     'content-type': 'application/json',
  //     "Authorization": 'Bearer ' + authToken,
  //   },
  //   body: JSON.stringify({userId, movieId, comment});
  // });
  // const res = await req.json();
  // return res;
}

export async function like(
  userId: string,
  movieId: string,
  like: boolean,
  authToken: string
) {
  const req = await fetch(`${url}/movies/like`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      Authorization: "Bearer " + authToken,
    },
    body: JSON.stringify({ userId, movieId, like }),
  });
  const res = await req.json();
  return res;
}

export function getGenreList() {
  const genreList: string[] = [];
  movies.forEach((movie) => {
    if (!genreList.includes(movie.genre)) genreList.push(movie.genre);
  });
  return genreList;
}

export async function addMovie(
  userId: string,
  formData: object,
  authToken: string
) {
  console.log(userId, formData, authToken);

  const req = await fetch(`${url}/movies/add`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      Authorization: "Bearer " + authToken,
    },
    body: JSON.stringify({ userId, formData }),
  });
  const res = req.json();
  return res;
}

export async function filterMovies(filterType: string, filter: string) {
  const req = await fetch(
    `${url}/movies/filter?` +
      new URLSearchParams({
        filterType: filterType,
        filter: filter,
      })
  );

  const res = await req.json();
  return res;
}
