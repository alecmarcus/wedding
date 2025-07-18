type ImageProps = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  loading?: "lazy" | "eager";
  sizes?: string;
  className?: string;
};

const fileNameRegex = /\.[^/.]+$/;
export const Image = ({
  src,
  alt,
  width,
  height,
  loading = "lazy",
  sizes = "100vw",
  className,
}: ImageProps) => {
  // Extract filename without extension
  const srcWithoutExt = src.replace(fileNameRegex, "");

  return (
    <picture className={className}>
      {/* Modern formats */}
      <source
        type="image/avif"
        srcSet={`${srcWithoutExt}.avif`}
        sizes={sizes}
      />
      <source
        type="image/webp"
        srcSet={`${srcWithoutExt}.webp`}
        sizes={sizes}
      />

      {/* Fallback to original format */}
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={loading}
        decoding="async"
        style={{
          maxWidth: "100%",
          height: "auto",
        }}
      />
    </picture>
  );
};
