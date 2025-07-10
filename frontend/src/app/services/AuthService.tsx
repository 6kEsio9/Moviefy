const url = "https://localhost:(port)";

export type UserTemp = {
  token: string;
  id: string;
  username: string;
  pfp: string;
};

export const users: UserTemp[] = [
  {
    token: "accessToken",
    id: "0",
    username: "Georgi",
    pfp: "/images/pfp.jpeg",
  },
  // {
  //   id: 1,
  //   username: "Ivan",
  //   email: "primerenemail1@gmail.com",
  //   bio: "I don't like watching movies",
  //   pfp: "/images/pfp.jpeg",
  //   watchList: {
  //     watched: [3],
  //     isWatching: [4],
  //     willWatch: [5],
  //   },
  //   reviews: [0],
  // },
];

export async function login(formData: Object) {
  // const req = await fetch(`${url}/login`, {
  //   method: "POST",
  //   headers: {
  //     "content-type": "application/json",
  //   },
  //   body: JSON.stringify(formData),
  // });

  // const res = await req.json();

  // return res;
  return users[0];
}

export async function register(formData: Object) {
  // const req = await fetch(`${url}/register`, {
  //   method: "POST",
  //   headers: {
  //     "content-type": "application/json",
  //   },
  //   body: JSON.stringify(formData),
  // });

  // const res = await req.json();

  // return res;

  return users[0];
}

export type User = {
  id: number;
  username: string;
  email: string;
  bio: string;
  pfp: string;
  watchList: {
    watched: string[];
    isWatching: string[];
    willWatch: string[];
  };
  reviews: number[];
};

export async function getUser(id: string) {
  // const req = await fetch(
  //   `${url}/users?` + new URLSearchParams({ id: string })
  // );
  // const res = await req.json();
  // return res;

  const user = users.find((x) => x.id === id);

  return user;
}

export type WatchList = {
  watched: string[];
  isWatching: string[];
  willWatch: string[];
};

export async function getWatchList(id: string) {
  return {
    watched: ["3"],
    isWatching: ["4"],
    willWatch: ["5"],
  };
}

export async function changeMovieStatus(
  userId: string,
  movieId: string,
  status: number,
  authToken: string
) {
  const req = await fetch(`${url}/change`, {
    method: "PUT",
    headers: {
      "content-type": "application/json",
      "x-authorization": authToken,
    },
    body: JSON.stringify({ userId, movieId, status }),
  });

  const res = await req.json();

  return res;
}
