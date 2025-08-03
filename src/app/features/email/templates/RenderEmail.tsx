"use client";

// import { render } from "@react-email/render";
// import { use } from "react";

export const RenderEmail = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
  // const element = <>{children}</>;
  // const html = render(element);
  // const htmlString = use(html);
  // return (
  //   <div
  //     // biome-ignore lint/security/noDangerouslySetInnerHtml: required
  //     dangerouslySetInnerHTML={{
  //       __html: htmlString,
  //     }}
  //   />
  // );
};
