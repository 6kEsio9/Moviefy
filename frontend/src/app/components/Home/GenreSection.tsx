import { Grid, Typography, Link } from "@mui/material"
import ScrollableImageList from "./ScrollableImageList"

interface GenreSelectionProps{
  images: { src: string; id: number; }[];
  genre: string;
  textColor?: string;
  moreRedirect?: string
}

export default function GenreSelection({
  images,
  genre,
  textColor="GrayText",
  moreRedirect = ''
}: GenreSelectionProps){
  return(
    <Grid container spacing={2} alignItems="center" justifyContent="space-between">
      <Typography variant="h5" sx={{color:textColor}}>{genre}</Typography>
      <Link href={moreRedirect !== '' ? moreRedirect : `movies?genre=${genre.toLowerCase()}`} underline="none">
        <Typography sx={{position: "relative", top: "7px"}}>{"MORE"}</Typography>
      </Link>
      <ScrollableImageList images={images}/>
    </Grid>
  )
}