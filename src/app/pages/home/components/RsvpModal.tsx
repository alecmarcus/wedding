import { RsvpForm } from "@@/features/rsvp/components/Form";
import { Suspense } from "react";
import { Link } from "@/app/components/Link";
import { getRsvpByEditToken } from "@/app/features/rsvp/functions";

export const RsvpModal = async ({ token }: { token?: string }) => {
  let rsvp: Awaited<ReturnType<typeof getRsvpByEditToken>>["data"] = null;
  let error: string | null = null;

  if (token) {
    const result = await getRsvpByEditToken({
      editToken: token,
    });
    if (result.error) {
      error = result.error;
    } else {
      rsvp = result.data;
    }
  }

  return (
    <Suspense fallback="Loading RSVP...">
      <Link
        to="/"
        style={{
          inset: 0,
          position: "absolute",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          padding: 30,
          backgroundColor: "white",
        }}
      >
        <RsvpForm rsvp={rsvp} error={error} />
      </div>
    </Suspense>
  );
};
