import React from "react";
import { Img, staticFile } from "remotion";

interface LogoProps {
  src: string;
  width?: number;
  height?: number;
  alt?: string;
  style?: React.CSSProperties;
}

export const Logo: React.FC<LogoProps> = ({
  src,
  width = 200,
  height,
  alt = "Logo",
  style,
}) => {
  const resolvedSrc = src.startsWith("http") ? src : staticFile(src);

  return (
    <Img
      src={resolvedSrc}
      alt={alt}
      style={{
        width,
        height: height ?? "auto",
        objectFit: "contain",
        ...style,
      }}
    />
  );
};
