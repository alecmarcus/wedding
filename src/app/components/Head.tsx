import { Styles } from "./Styles";

const TITLE = "Soyeon & Alec";

const CLIENT_SCRIPT = "/src/client.tsx";

export const Head = ({ children }: { children?: React.ReactNode }) => {
  return (
    <head>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>{TITLE}</title>
      <link rel="modulepreload" href={CLIENT_SCRIPT} />
      <Styles />
      {children}
      <script type="module" src={CLIENT_SCRIPT} />
    </head>
  );
};
