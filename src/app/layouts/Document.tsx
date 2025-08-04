import { Head } from "../components/Head";

const ROOT = "root";

export const Document = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <Head />
      <body className="fs-1 lh-1 ff-base no-sel">
        <main id={ROOT}>{children}</main>
      </body>
    </html>
  );
};
