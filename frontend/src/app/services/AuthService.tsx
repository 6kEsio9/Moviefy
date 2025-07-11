import { Axios } from "axios";
import { Movie } from "./MovieService";

const url = "https://localhost:(port)";

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

export type ReviewUser = {
  movieId: string;
  movieTitle: string;
  rating: number;
  comment: string;
  likes: string[];
};

export type UserReq = {
  token: string;
  id: string;
  username: string;
  pfp: string;
};

export type User = { id: string; username: string; pfp: string };

export type UserProfile = {
  id: string;
  username: string;
  email: string;
  bio: string;
  pfp: string;
};

export type WatchList = {
  watched: Movie[];
  isWatching: Movie[];
  willWatch: Movie[];
};

export const users: User[] = [
  {
    id: "0",
    username: "Georgi",
    pfp: "/images/pfp.jpeg",
  },
];

interface LoginDto {
  username: string;
  password: string;
}

interface RegisterDto {
  username: string;
  email: string;
  password: string;
}

interface EditDto {
  username: string;
  email: string;
  bio: string;
  pfp: string;
  password?: string;
  confirm?: string;
}

export async function login(formData: LoginDto) {
  const res = await axios.post<UserReq>("/login", formData);

  return res;
}

export async function register(formData: RegisterDto) {
  const res = await axios.post<UserReq>("/register", formData);

  return res;
}

export async function getUser(userId: string) {
  // const res = await axios.get("/users", {params: {userId: userId}});
  // return res;

  const user = users.find((x) => x.id === userId);

  return {
    ...user!,
    email: "primerenemail@gmail.com",
    bio: "I like watching movies.",
  };
}

export async function getWatchList(userId: string) {
  // const res = await axios.get('/users/watchList', {params: {userId: userId}});
  // return res;

  return {
    watched: [movies[0]],
    isWatching: [movies[1]],
    willWatch: [movies[2]],
  };
}

export async function changeMovieStatus(
  userId: string,
  movieId: string,
  status: number,
  authToken: string
) {
  // const res = await axios.put('/change', {userId, movieId, status, authToken});
  // return res;
}

export async function getReviews(userId: string) {
  // const req = await fetch(`${url}/users/reviews?` + new URLSearchParams({ userId: userId}));
  // const res = await req.json();
  // return res;

  // const res = await axios.get('/users/reviews', {params: {userId: userId}});
  // return res;

  return [
    {
      movieId: "0",
      movieTitle: "Tenet",
      rating: 3,
      comment: "Great movie!",
      likes: ["1", "2"],
    },
  ];
}

export async function editReview(
  userId: string,
  movieId: string,
  comment: string,
  accessToken: string
) {
  // const req = await fetch(`${url}/users/reviews/edit`, {
  //   method: "PUT",
  //   headers: {
  //     "content-type": "application/json",
  //     "Authorization": 'Bearer ' + authToken,
  //   },
  //   body: JSON.stringify({ userId, movieId, comment }),
  // });
  // const res = await req.json();
  // return res;
  // const res = await axios.put('/users/review/edit', {userId, movieId, comment, accessToken});
  // return res;
}

export async function editUser(
  userId: string,
  formData: EditDto,
  accessToken: string
) {
  // const req = await fetch(`${url}/users/edit`, {
  //   method: 'PUT',
  //   headers: {
  //     'content-type': 'application/json',
  //     "Authorization": 'Bearer ' + authToken,
  //   },
  //   body: JSON.stringify({userId, formData})
  // })
  // const res = await req.json();
  // return res;

  // const res = await axios.put("/users/edit", { userId, formData, accessToken });
  // return res;

  console.log(formData);
}

export function statusToNum(watchStatus: string){
  if (watchStatus === "watched") return 0;
  if (watchStatus === "watching") return 1;
  if (watchStatus === "plan") return 2;
};