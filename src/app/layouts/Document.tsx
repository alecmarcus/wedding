const TITLE = "Soyeon & Alec";

const ROOT_ID = "root";
const CLIENT_SCRIPT = "/src/client.tsx";

export const Document = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{TITLE}</title>
        <link rel="modulepreload" href={CLIENT_SCRIPT} />
      </head>
      <body>
        <div id={ROOT_ID}>{children}</div>
        <script type="module" src={CLIENT_SCRIPT} />
      </body>
    </html>
  );
};
