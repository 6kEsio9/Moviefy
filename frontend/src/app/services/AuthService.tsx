const url = "";

export type User = {
  id: number;
  username: string;
  bio: string;
  pfp: string;
  watchList: {
    watched: number[];
    isWatching: number[];
    willWatch: number[];
  };
  reviews: number[];
};

const users: User[] = [
  {
    id: 0,
    username: "Georgi",
    bio: "I like watching movies",
    pfp: "/images/pfp.jpeg",
    watchList: {
      watched: [3, 0, 1],
      isWatching: [4],
      willWatch: [5],
    },
    reviews: [],
  },
  {
    id: 1,
    username: "Ivan",
    bio: "I don't like watching movies",
    pfp: "/images/pfp.jpeg",
    watchList: {
      watched: [3],
      isWatching: [4],
      willWatch: [5],
    },
    reviews: [0, 1, 2], //movie ids
  },
];
export function getUser(id: number) {
  const user = users.find((x) => x.id === id);

  return user;
}
