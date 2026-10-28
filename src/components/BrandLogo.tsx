import type { ImgHTMLAttributes } from "react";

/** The same generated brand mark used by the browser toolbar and README. */
export function BrandLogo({
  alt = "Siap Dips",
  width = 20,
  height = 20,
  ...props
}: ImgHTMLAttributes<HTMLImageElement>) {
  return (
    <img
      src="/icons/icon128.png"
      srcSet="/icons/icon256.png 2x"
      alt={alt}
      width={width}
      height={height}
      draggable={false}
      {...props}
    />
  );
}
