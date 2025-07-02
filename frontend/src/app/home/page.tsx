import { Box, Container, Divider, Stack, Typography } from "@mui/material"
import ScrollableImageList from "./ScrollableImageList";

export default function HomePage() {
  //for testing
  const images = [
    'https://images.all4ed.org/wp-content/uploads/2019/07/2x3-light-placeholder-683x1024.jpg',
    'https://images.all4ed.org/wp-content/uploads/2019/07/2x3-light-placeholder-683x1024.jpg',
    'https://images.all4ed.org/wp-content/uploads/2019/07/2x3-light-placeholder-683x1024.jpg',
    'https://images.all4ed.org/wp-content/uploads/2019/07/2x3-light-placeholder-683x1024.jpg',
    'https://images.all4ed.org/wp-content/uploads/2019/07/2x3-light-placeholder-683x1024.jpg',
    'https://images.all4ed.org/wp-content/uploads/2019/07/2x3-light-placeholder-683x1024.jpg',
    'https://images.all4ed.org/wp-content/uploads/2019/07/2x3-light-placeholder-683x1024.jpg',
    'https://images.all4ed.org/wp-content/uploads/2019/07/2x3-light-placeholder-683x1024.jpg',
    'https://images.all4ed.org/wp-content/uploads/2019/07/2x3-light-placeholder-683x1024.jpg',
    'https://images.all4ed.org/wp-content/uploads/2019/07/2x3-light-placeholder-683x1024.jpg',
    'https://images.all4ed.org/wp-content/uploads/2019/07/2x3-light-placeholder-683x1024.jpg'
  ]

  return (
    <Container>
      <Stack
        direction="column"
        divider={<Divider orientation="horizontal"/>}
        spacing={2}
      >
        <Box>
          <Typography variant="h5">Top 10 Movies</Typography>
          <ScrollableImageList images={images}/>
        </Box>
        <Box>
            <Typography variant="h5" sx={{color:'GrayText'}}>Action</Typography>
            <ScrollableImageList images={images}/>
        </Box>
        <Box>
            <Typography variant="h5" sx={{color:'GrayText'}}>Horror</Typography>
            <ScrollableImageList images={images}/>
        </Box>
        <Box>
            <Typography variant="h5" sx={{color:'GrayText'}}>Comedy</Typography>
            <ScrollableImageList images={images}/>
        </Box>
      </Stack>
    </Container>
  )
}
