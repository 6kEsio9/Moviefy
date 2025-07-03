import { useState } from "react";
import Link from "next/link";

interface ImageProps {
  item: { title: string; id: number; src: string };
  index: number;
}

export default function Image({ item, index }: ImageProps) {
  const [hover, setHover] = useState(false);

  return (
    <Link
      href={`/movies/${item.id}`}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <img
        src={item.src}
        alt={`img-${index}`}
        loading="lazy"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          filter: hover ? "brightness(50%)" : "",
          transition: "filter 0.25s ease-in",
        }}
      />
      {hover && (
        <div
          style={{
            position: "absolute",
            width: "100%",
            textAlign: "center",
            top: "40%",
            color: "white",
            fontSize: "250%",
          }}
        >
          {item.title}
        </div>
      )}
    </Link>
  );
}
