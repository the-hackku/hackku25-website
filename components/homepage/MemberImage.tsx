// components/MemberImage.tsx
"use client";

import { useState } from "react";
import Image from "next/image";

interface MemberImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
}

const MemberImage: React.FC<MemberImageProps> = ({
  src,
  alt,
  width,
  height,
  className,
}) => {
  const [imgSrc, setImgSrc] = useState(src);

  return (
    <Image
      src={imgSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      onError={() => setImgSrc("/images/team/default.png")} // Ensure this fallback image exists
    />
  );
};

export default MemberImage;
