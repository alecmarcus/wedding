// import { requestInfo } from "rwsdk/worker";

type Props = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  loading?: "lazy" | "eager";
  className?: string;
};

// const fileNameRegex = /\.[^/.]+$/;

// const getSrcSet = (src: string, dpr = 2) => {
//   const { headers } = requestInfo;
//   const origin = headers.get("origin");

//   const first = `${origin}/cdn-cgi/image/blur=100,dpr=0.1,quality=low,/${src}`;
//   const final = `${origin}/cdn-cgi/image/blur=100,dpr=${dpr}/${src}`;
// };

export const Image = ({
  src,
  alt,
  width,
  height,
  loading = "lazy",
  className,
}: Props) => {
  return (
    <img
      className={className}
      src={src}
      alt={alt}
      width={width}
      height={height}
      loading={loading}
      decoding="async"
      // style={{
      //   maxWidth: "100%",
      //   height: "auto",
      // }}
    />
  );
};
