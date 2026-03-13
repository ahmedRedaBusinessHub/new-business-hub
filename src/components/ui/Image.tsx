"use client";
import { useState } from "react";
import Image, { ImageProps } from "next/image";

const placeholderImg = "/images/logo.svg";

interface AppImageProps extends Omit<ImageProps, 'src' | 'alt'> {
  src: string;
  alt?: string;
  blurData?: string;
}

export default function AppImage({
  src,
  alt,
  width,
  height,
  blurData,
  className,
  ...rest
}: AppImageProps) {
  const [imgSrc, setImgSrc] = useState<string>(src);
  const [isImageLoading, setImageLoading] = useState(true);

  return (
    <Image
      src={imgSrc}
      alt={alt || (typeof src === 'string' ? src : 'image')}
      width={width}
      height={height}
      onError={() => setImgSrc(placeholderImg)}
      onLoad={() => setImageLoading(false)}
      className={`${isImageLoading ? "blur" : "remove-blur"} ${className || ""}`}
      {...rest}
    />
  );
}
