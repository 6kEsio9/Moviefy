const url = "";
const users = [
  {
    id: 0,
    username: "Georgi",
    bio: "I like watching movies",
    pfp: "/images/pfp.jpeg",
    watchlist: {
      watched: [3],
      isWatching: [4],
      willWatch: [5],
    },
    reviews: [0, 1, 2],
  },
  {
    id: 1,
    username: "Ivan",
    bio: "I don't like watching movies",
    pfp: "/images/pfp.jpeg",
    watchlist: {
      watched: [3],
      isWatching: [4],
      willWatch: [5],
    },
    reviews: [0, 1, 2],
  },
];
export function getUser(id: number) {
  const user = users.find((x) => x.id === id);

  return user;
}
