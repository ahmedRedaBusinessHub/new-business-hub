"use client";
import { useState } from "react";
import Image from "next/image";
import placeholderImg from "/images/logo.svg"; // your fallback image

export default function AppImage({
  src,
  alt,
  width,
  height,
  blurData,
  ...rest
}: any) {
  const [imgSrc, setImgSrc] = useState(src);
  const [isImageLoading, setImageLoading] = useState(true);

  return (
    <Image
      src={imgSrc}
      alt={alt || src}
      width={width}
      height={height}
      onError={() => setImgSrc(placeholderImg)}
      onLoad={() => setImageLoading(false)}
      className={`${isImageLoading ? "blur" : "remove-blur"} ${
        rest.className || ""
      }`}
      {...rest}
    />
  );
}
