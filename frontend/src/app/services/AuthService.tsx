import axios from "axios";

const url = "http://keycloak.martinkurtev.com:1235";

const instance = axios.create({
  baseURL: url,
  headers: {
    "Content-Type": "application/json",
  },
});

instance.interceptors.request.use(
  function (config: any) {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  function (error: any) {
    return Promise.reject(error);
  }
);

export type ReviewUser = {
  id: number;
  content: string;
  likeCount: number;
  username: string;
  pfpUrl: string;
  rating: number;
  isLiked: boolean;
  movieId: string;
  title: string;
};

export type UserReq = {
  Token: { accessToken: string; refreshToken: string; expiresIn: number };
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

export type MovieWatchList = {
  id: string;
  title: string;
  posterUrl: string;
  startYear: number;
};

export type WatchList = {
  watched: MovieWatchList[];
  isWatching: MovieWatchList[];
  willWatch: MovieWatchList[];
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
  pfp: File;
  password?: string;
  confirm?: string;
}

export async function login(formData: LoginDto) {
  const res = await instance
    .post<UserReq>("/login", { ...formData })
    .catch((err) => err);

  return res;
  //done
}

export async function register(data: RegisterDto) {
  const res = await instance
    .post<UserReq>("/register", { ...data })
    .catch((err) => err);

  return res;
  //done
}

export async function getUser(userId: string) {
  const res = await instance
    .get("/users", { params: { userId: userId } })
    .catch((err) => err);
  return res;
  //done
}

export async function getWatchList(userId: string) {
  console.log(userId);
  const res = await instance.get("/watchlist", {
    params: { userId: userId },
  });
  return res;
  //done
}

export async function changeMovieStatus(movieId: string, status: number) {
  const res = await instance
    .put("/change", { movieId, status })
    .catch((err) => err);
  return res;
  //done
}

export async function getReviews(userId: string) {
  const res = await instance.get("/users/reviews", {
    params: { userId: userId },
  });
  return res;
  //done
}

export async function editReview(movieId: string, comment: string) {
  const res = await instance.put("/users/reviews/edit", {
    movieId: movieId,
    comment: comment,
  });
  return res;
}

export async function editUser(formData: EditDto) {
  const res = await instance.put("/users/edit", { ...formData });
  return res;

  console.log(formData);
}

export function statusToNum(watchStatus: string) {
  if (watchStatus === "watched") return 0;
  else if (watchStatus === "watching") return 1;
  else if (watchStatus === "plan") return 2;
  else return 3;
}
