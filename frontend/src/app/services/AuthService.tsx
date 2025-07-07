const url = "";

export type User = {
  id: number;
  username: string;
  email: string;
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
    email: "primerenemail@gmail.com",
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
    email: "primerenemail1@gmail.com",
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

export function search(searchInput: string) {
  const result = users
    .filter((x) => x.username.toLowerCase().includes(searchInput.toLowerCase()))
    .sort((a, b) => a.username.localeCompare(b.username));

  return result;

  // return fetch(url + '/search' + '/searchInput')
  //   .then(res => res.json());
}
