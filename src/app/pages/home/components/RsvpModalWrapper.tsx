"use client";

import { Link } from "@@/components/Link";
import { RsvpForm } from "@@/features/rsvp/Form";
import { getRsvpByEditToken } from "@@/features/rsvp/functions";
import { Suspense, useCallback, useEffect, useState } from "react";
import type { Rsvp } from "@/db";

const getSearchParams = () => {
  if (typeof window === "undefined") {
    return new URLSearchParams();
  }

  return new URLSearchParams(window.location.search);
};

const RsvpModal = () => {
  const searchParams = getSearchParams();
  const showRsvp = searchParams.has("rsvp");
  const token = searchParams.get("token");

  const [rsvp, setRsvp] = useState<Rsvp | null>(null);
  const [isLoading, setIsLoading] = useState(!!token);
  const [error, setError] = useState<string | null>(null);

  const fetchRsvp = useCallback(async () => {
    setError(null);
    setIsLoading(false);

    if (!token) {
      return;
    }

    try {
      const result = await getRsvpByEditToken(token);
      if (result.isSuccess && result.data) {
        console.log(result.data);
        setRsvp(result.data);
      } else {
        throw new Error(result.error || "Unknown error");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : JSON.stringify(error) || "Unknown error";
      setError(`Failed to load RSVP: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  }, [
    token,
  ]);

  useEffect(() => {
    void fetchRsvp();
  }, [
    fetchRsvp,
  ]);

  if (!showRsvp) {
    return null;
  }

  if (isLoading) {
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

export const RsvpModalWrapper = () => {
  return (
    <Suspense fallback={null}>
      <RsvpModal />
    </Suspense>
  );
};
