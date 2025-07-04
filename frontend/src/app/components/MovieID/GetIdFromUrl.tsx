import { usePathname } from "next/navigation";

export function getMovieId(){
  const pn = usePathname()
  const id = pn.substring(pn.lastIndexOf('/') + 1);
  return parseInt(id);
}