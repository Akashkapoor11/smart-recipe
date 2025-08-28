"use client";

import { useState } from "react";

type Props = {
  src: string;
  alt: string;
  className?: string;
  fallbackSrc?: string;
};

export default function SmartImage({
  src,
  alt,
  className,
  fallbackSrc = "/recipes/fallback.jpg",
}: Props) {
  const [imgSrc, setImgSrc] = useState(src);
  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      loading="lazy"
      onError={() => setImgSrc(fallbackSrc)}
    />
  );
}
