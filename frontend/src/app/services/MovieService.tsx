import { users } from "./AuthService";

const url = "";

export type Review = {
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
  reviews: Review[];
};

const movies = [
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
      "https://imdb.com/title/tt0433620/mediaviewer/rm3435339521/?ref_=tt_ov_i",
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

export async function getMovie(id: string) {
  const movie = movies.find((x) => x.id === id);

  return movie;
}

export async function search(searchInput: string, usersB: boolean) {
  // const req = await fetch(
  //   `${url}/search?` +
  //     new URLSearchParams({
  //       input: searchInput,
  //       movies: "true",
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
  // const req = await fetch(`${url}/review`, {
  //   method: "POST",
  //   headers: {
  //     "content-type": "application/json",
  //     "x-authorization": authToken,
  //   },
  //   body: JSON.stringify({ userId, movieId, rating, comment }),
  // });
  console.log("movie rated");
}
