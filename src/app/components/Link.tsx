import { type Href, link } from "#/app/util/navigation";

export const Link = ({
  to,
  children,
  ...rest
}: {
  to: Href | Href[0];
} & Omit<React.ComponentPropsWithRef<"a">, "href">) => {
  const args: Href = Array.isArray(to)
    ? to
    : [
        to,
      ];
  const href = link(...args);
  return (
    <a href={href} {...rest}>
      {children}
    </a>
  );
};
