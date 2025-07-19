"use client";

import { Link } from "@@/components/Link";
import { RsvpForm } from "@@/features/rsvp/components/Form";
import { useGetRsvpByTokenRequest } from "@@/features/rsvp/hooks";
import { useEffect, useState } from "react";

export const RsvpModal = () => {
  const [getRsvpByToken, { isPending, data: rsvp, error }] =
    useGetRsvpByTokenRequest();

  const [searchParams, setSearchParams] = useState<URLSearchParams>();
  const showRsvp = !!searchParams?.has("rsvp");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setSearchParams(params);

    const token = params?.get("token");
    if (typeof token === "string") {
      getRsvpByToken({
        token,
      });
    }
  }, [
    getRsvpByToken,
  ]);

  if (!showRsvp) {
    return null;
  }

  if (isPending) {
    return (
      <div>
        <h2>Loading RSVP...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h2>Error</h2>
        <p>{error}</p>
        <Link to="/">Back to Home</Link>
      </div>
    );
  }

  return <RsvpForm rsvp={rsvp} />;
};
