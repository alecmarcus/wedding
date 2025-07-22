"use client";

import type { ActionState } from "@@/features/email/actions";
import { BULK_SEND_FIELDS } from "@@/features/email/fields";
import { useBulkEmailAction } from "@@/features/email/hooks";
import { useCallback, useEffect, useId, useRef, useState } from "react";

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

        <label htmlFor={BULK_SEND_FIELDS.subject.name}>
          Subject *
          <input
            type="text"
            id={BULK_SEND_FIELDS.subject.name}
            name={BULK_SEND_FIELDS.subject.name}
            maxLength={BULK_SEND_FIELDS.subject.max}
            required={true}
            disabled={isPending}
          />
        </label>

        <div>
          Filter by *
          <label htmlFor={`${BULK_SEND_FIELDS.attending.name}true`}>
            <input
              type="radio"
              id={`${BULK_SEND_FIELDS.attending.name}true`}
              value="true"
              name={BULK_SEND_FIELDS.attending.name}
              required={true}
              disabled={isPending}
            />
            Attending
          </label>
          <label htmlFor={`${BULK_SEND_FIELDS.attending.name}false`}>
            <input
              type="radio"
              id={`${BULK_SEND_FIELDS.attending.name}false`}
              value="false"
              name={BULK_SEND_FIELDS.attending.name}
              required={true}
              disabled={isPending}
            />
            Not Attending
          </label>
          <label htmlFor={`${BULK_SEND_FIELDS.attending.name}null`}>
            <input
              type="radio"
              id={`${BULK_SEND_FIELDS.attending.name}null`}
              value="null"
              name={BULK_SEND_FIELDS.attending.name}
              required={true}
              disabled={isPending}
            />
            All
          </label>
        </div>

        <label htmlFor={BULK_SEND_FIELDS.content.name}>
          Email Content *
          <textarea
            id={BULK_SEND_FIELDS.content.name}
            name={BULK_SEND_FIELDS.content.name}
            maxLength={BULK_SEND_FIELDS.content.max}
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
