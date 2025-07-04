import * as AuthService from "./AuthService";

const url = "";

export type Rating = {
  userId: number;
  rating: number;
  comment: string;
}

export type Movie = {
  id: number;
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
  ratings: Rating[];
};

const movies = [
  {
    id: 0,
    title: "Tennet",
    imageUrl: "/images/tennet.jpeg",
    year: 2005,
    avgRating: 5,
    genre: "Action",
    ageRating: 16,
    summary: "Interesting movie",
    director: "John Doe",
    cast: ["Brad Pitt", "Mark Hamill", "Christian Bale"],
    crew: [],
    ratings: [],
  },
  {
    id: 1,
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
    ratings: [{ userId: 0, rating: 4, comment: "Great movie!" }],
  },
  {
    id: 2,
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
    ratings: [{ userId: 0, rating: 4, comment: "Great movie!" }],
  },
  {
    id: 3,
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
    ratings: [{ userId: 0, rating: 4, comment: "Great movie!" }],
  },
  {
    id: 4,
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
    ratings: [{ userId: 0, rating: 4, comment: "Great movie!" }],
  },
  {
    id: 5,
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
    ratings: [{ userId: 0, rating: 4, comment: "Great movie!" }],
  },
  {
    id: 6,
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
    ratings: [{ userId: 0, rating: 4, comment: "Great movie!" }],
  },
];

export function getAll() {
  //   return fetch(url)
  //     .then((res) => res.json());
  return movies;
}

export function getMovie(id: number) {
  const movie = movies.find((x) => x.id === id);

  return movie;
}

export function search(searchInput: string) {
  const result = movies
    .filter((x) => x.title.toLowerCase().includes(searchInput.toLowerCase()))
    .sort((a, b) => a.title.localeCompare(b.title));

  return result;

  // return fetch(url + '/search' + '/searchInput')
  //   .then(res => res.json());
}

export function rate(
  authId: number,
  movieId: number,
  rating: number,
  comment: string
) {
  // const movie = movies.find((x) => x.id === movieId);
  // const user = AuthService.getUser(authId);
}
