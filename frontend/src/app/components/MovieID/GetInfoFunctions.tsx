import { usePathname } from "next/navigation";

function getMovieId(){
  const pn = usePathname()
  const id = pn.substring(pn.lastIndexOf('/') + 1);
  return id;
}

export function getMovieData(){
  // with service once implemented
  // return getMovieById(getMovieId); 

  return { 
    title: "F1",
    year: 2025,
    director: "John Doe",
    cast: ["Brad Pitt", "Damson Idris"],
    crew: ["Adam Adam", "John John"],
    poster: 'https://a.ltrbxd.com/resized/film-poster/8/1/7/9/7/7/817977-f1-the-movie-0-1000-0-1500-crop.jpg?v=f5ae2b99b9',
    summary: "Racing legend Sonny Hayes is coaxed out of retirement to lead a struggling Formula 1 team—and mentor a young hotshot driver—while chasing one more chance at glory."
  }
}

export function getReviews(){
  // return getReviewsByMovieId(getMovieData());

  return [
    {
      username: "isadksa",
      pfp: "https://a.ltrbxd.com/resized/avatar/upload/1/9/4/2/8/0/5/7/shard/avtr-0-144-0-144-crop.jpg?v=dad83a2711",
      rating: 3,
      review: "idk",
      likes: 1012
    },
    {
      username: "sajfls",
      pfp: "https://a.ltrbxd.com/resized/avatar/upload/1/9/4/2/8/0/5/7/shard/avtr-0-144-0-144-crop.jpg?v=dad83a2711",
      rating: 5,
      review: "idk",
      likes: 1012
    },
    {
      username: "l;sa,kf alk f",
      pfp: "https://a.ltrbxd.com/resized/avatar/upload/1/9/4/2/8/0/5/7/shard/avtr-0-144-0-144-crop.jpg?v=dad83a2711",
      rating: 4,
      review: "idk",
      likes: 1012
    }
  ]
}