import axios from "axios";

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

export type SearchMovie = {
  id: string;
  title: string;
  posterUrl: string;
  startYear: number;
  averageRating: number;
};

export type SearchUser = {
  id: string;
  username: string;
  pfpUrl: string;
};

export async function getAll(limit?: number, offset?: number) {
  const res = await instance.get("/movies", {
    params: { limit: limit, offset: offset },
  });
  return res;
}

export async function getMovie(movieId: string) {
  const res = await instance.get("/movies", { params: { movieId: movieId } });
  return res;

  //done
}

export async function search(
  searchInput: string,
  usersB: boolean,
  limit?: number,
  offset?: number
) {
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
  const res = await instance.get("/search", {
    params: {
      input: searchInput,
      limit: limit,
      offset: offset,
      users: usersB,
    },
  });
  return res;
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

export async function deleteReview(movieId: string) {
  const res = await instance.post("/users/reviews/delete", {
    movieId,
  });
  return res;
}

export async function like(commentId: string) {
  const res = await instance.post("/users/reviews/like", {
    commentId,
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

export async function addMovie(formData: FormData) {
  const res = await instance.post("/movies/add", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res;
}

export async function filterMovies(filterType: string, filter: string) {
  const res = await instance.get(`/movies/${filterType}`, {
    params: { genre: filter },
  });
  return res;
}
