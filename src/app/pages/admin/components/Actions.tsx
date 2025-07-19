"use client";

import { BULK_EMAIL_FIELDS } from "@@/constants";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import type { ActionState } from "../email/actions";
import { useBulkEmailAction } from "../email/hooks";

const Summary = ({
  successCount,
  total,
  failureCount,
  failures,
}: NonNullable<ActionState["data"]>) => {
  return (
    <>
      <p>{successCount === total ? "All" : successCount} Sent</p>
      {failureCount > 0 && (
        <>
          <p>{failureCount} Failed</p>
          <ul>
            {failures.map(({ email, error }) => (
              <li key={email}>
                <details>
                  <summary>{email}</summary>
                  {error}
                </details>
              </li>
            ))}
          </ul>
        </>
      )}
    </>
  );
};

const BulkEmailForm = ({
  onSubmit,
}: {
  onSubmit?: (status: ActionState) => void;
}) => {
  const ref = useRef<HTMLFormElement>(null);
  const subjectId = useId();
  const contentId = useId();

  const [bulkEmailAction, { isPending, isSuccess, error, data }] =
    useBulkEmailAction({
      data: null,
      error: null,
      isSuccess: null,
    });

  useEffect(() => {
    if (!isPending && data && (isSuccess || error)) {
      onSubmit?.({
        data,
        error,
        isSuccess,
      });
    }
  }, [
    isPending,
    data,
    isSuccess,
    error,
    onSubmit,
  ]);

  return (
    <>
      <form ref={ref} action={bulkEmailAction}>
        <h3>Send Bulk Email to All Guests</h3>

        <label htmlFor={subjectId}>
          Subject *
          <input
            type="text"
            id={subjectId}
            name={BULK_EMAIL_FIELDS.subject.name}
            maxLength={BULK_EMAIL_FIELDS.subject.max}
            required={true}
            disabled={isPending}
          />
        </label>

        <label htmlFor={contentId}>
          Email Content *
          <textarea
            id={contentId}
            name={BULK_EMAIL_FIELDS.content.name}
            maxLength={BULK_EMAIL_FIELDS.content.max}
            rows={10}
            required={true}
            disabled={isPending}
            placeholder="Enter the email content here. Basic HTML is supported."
          />
          <p>
            Tip: You can use basic HTML for formatting (e.g., &lt;p&gt;,
            &lt;strong&gt;, &lt;em&gt;, &lt;br&gt;)
          </p>
        </label>

        <button type="submit" disabled={isPending}>
          {isPending ? "Sending..." : "Send Email"}
        </button>
      </form>

      {error && !isSuccess && !isPending && (
        <div role="alert">
          <p>{error}</p>
        </div>
      )}

      {isSuccess && data && <Summary {...data} />}
    </>
  );
};

export const Actions = () => {
  const [showForm, setShowForm] = useState(false);
  const toggleShowForm = useCallback(() => {
    setShowForm(c => !c);
  }, []);

  return (
    <>
      {showForm && <BulkEmailForm onSubmit={toggleShowForm} />}
      <button type="button" onClick={toggleShowForm}>
        {showForm ? "Cancel" : "Send Bulk Email"}
      </button>
    </>
  );
};
