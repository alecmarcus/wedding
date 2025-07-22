import { link, type Route } from "@@/navigation";

export const Link = ({
  to,
  children,
  ...rest
}: {
  to: Route;
} & Omit<React.ComponentPropsWithRef<"a">, "href">) => {
  const [path, params]: Exclude<Route, string> = Array.isArray(to)
    ? to
    : [
        to,
      ];
  const href = link(path, params);
  return (
    <a href={href} {...rest}>
      {children}
    </a>
  );
};
