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
    reviews: [1, 2, 3, 4, 5, 6],
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
    reviews: [0],
  },
];
export function getUser(id: number) {
  const user = users.find((x) => x.id === id);

  return user;
}
