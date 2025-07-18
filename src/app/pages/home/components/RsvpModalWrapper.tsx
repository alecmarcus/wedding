"use client";

import { Link } from "@@/components/Link";
import { getRsvpByEditToken } from "@@/pages/home/actions";
import { Suspense, useCallback, useEffect, useState } from "react";
import type { Rsvp } from "@/db";
import { RsvpForm } from "./RsvpForm";

const useSearchParams = () => {
  const [searchParams, setSearchParams] = useState<URLSearchParams>(
    new URLSearchParams()
  );

  useEffect(() => {
    setSearchParams(new URLSearchParams(window.location.search));
  }, []);

  return searchParams;
};

const RsvpModal = () => {
  const searchParams = useSearchParams();
  const showRsvp = searchParams.has("rsvp");
  const token = searchParams.get("token");
  const [rsvp, setRsvp] = useState<Rsvp | null>(null);
  const [isLoading, setIsLoading] = useState(!!token);
  const [error, setError] = useState<string | null>(null);

  const fetchRsvp = useCallback(async () => {
    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      const result = await getRsvpByEditToken(token);
      if (result.success && result.data) {
        setRsvp(result.data);
        setError(null);
      } else {
        setError(result.error || "Failed to load RSVP");
      }
    } catch {
      setError("Failed to load RSVP");
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

  const handleSuccess = () => {
    // Remove query params after successful submission
    window.history.replaceState({}, "", window.location.pathname);
  };

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

  return (
    <div>
      <RsvpForm
        rsvp={rsvp || undefined}
        editToken={token || undefined}
        onSuccess={handleSuccess}
      />
    </div>
  );
};

export const RsvpModalWrapper = () => {
  return (
    <Suspense fallback={null}>
      <RsvpModal />
    </Suspense>
  );
};
