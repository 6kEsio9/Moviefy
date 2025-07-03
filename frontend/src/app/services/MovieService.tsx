const url = "";

export function getAll() {
  //   return fetch(url)
  //     .then((res) => res.json());
  return [
    {
      id: 0,
      title: "Tennet",
      imageUrl: "/images/tennet.jpeg",
      year: 2005,
      avgRating: 5,
      genre: "Action",
      ageRating: 16,
    },
    {
      id: 1,
      title: "Cars",
      imageUrl: "/images/cars.jpeg",
      year: 2010,
      avgRating: 4,
      genre: "Fantasy",
      ageRating: 3,
    },
    {
      id: 2,
      title: "Game Of Thrones",
      imageUrl: "/images/gameOfThrones.jpeg",
      year: 2015,
      avgRating: 2,
      genre: "Fantasy",
      ageRating: 18,
    },
    {
      id: 3,
      title: "Inglourious Basterds",
      imageUrl: "/images/inglouriousBasterds.jpeg",
      year: 2009,
      avgRating: 1,
      genre: "Comedy",
      ageRating: 16,
    },
    {
      id: 4,
      title: "Interstellar",
      imageUrl: "/images/interstellar.jpeg",
      year: 2004,
      avgRating: 3,
      genre: "Sci-Fi",
      ageRating: 12,
    },
    {
      id: 5,
      title: "Star Wars",
      imageUrl: "/images/starWars.jpeg",
      year: 1999,
      avgRating: 4,
      genre: "Sci-Fi",
      ageRating: 12,
    },
    {
      id: 6,
      title: "Taxi",
      imageUrl: "/images/taxi.jpeg",
      year: 2012,
      avgRating: 5,
      genre: "Comedy",
      ageRating: 12,
    },
  ];
}
