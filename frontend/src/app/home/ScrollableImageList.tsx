'use client'
import { useRef } from "react";
import { Box, IconButton, ImageListItem } from "@mui/material"
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material"
import Link from "next/link";

interface ScrollableImageListProps {
  images: { src: string; id: number; }[];
  scrollAmount?: number;
}

export default function ScrollableImageList({
  images,
  scrollAmount = 300
}: ScrollableImageListProps){

  const scrollRef = useRef<HTMLInputElement>(null);

  const scroll = (direction: string) => {
    if (scrollRef.current) {
      const amount = direction === 'left' ? scrollAmount * -1 : scrollAmount;
      scrollRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

    return(
        <Box sx={{ position: 'relative', width: '100%', overflow: 'hidden' }}>
          <IconButton
            onClick={() => scroll('left')}
            sx={{
              position: 'absolute',
              top: '50%',
              left: 0,
              zIndex: 1,
              transform: 'translateY(-50%)',
              backgroundColor: 'white',
              '&:hover': { backgroundColor: '#eee' },
            }}
          >
            <ArrowBackIos />
          </IconButton>

          <Box
            ref={scrollRef}
            sx={{
              display: 'flex',
              overflowX: 'auto',
              scrollBehavior: 'smooth',
              gap: 2,
              padding: 1,
              '&::-webkit-scrollbar': { display: 'none' },
            }}
          >
            {images.map((item, index) => (
              <ImageListItem key={index} sx={{ maxWidth: 200, maxHeight: 300, flex: '0 0 auto'}}>
                <Link href={`/movies/${item.id}`}>
                  <img src={item.src} alt={`img-${index}`} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
                </Link>
              </ImageListItem>
            ))}
          </Box>

          <IconButton
            onClick={() => scroll('right')}
            sx={{
              position: 'absolute',
              top: '50%',
              right: 0,
              zIndex: 1,
              transform: 'translateY(-50%)',
              backgroundColor: 'white',
              '&:hover': { backgroundColor: '#eee' },
            }}
          >
            <ArrowForwardIos />
          </IconButton>
        </Box>
    )
}