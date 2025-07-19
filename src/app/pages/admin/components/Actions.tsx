"use client";

import { BULK_EMAIL_FORM_FIELDS } from "@@/constants";
import { useId, useRef, useState } from "react";
import { useSendBulkEmail } from "../email/hooks";

const BulkEmailForm = () => {
  const ref = useRef<HTMLFormElement>(null);
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const subjectId = useId();
  const contentId = useId();

  const [sendBulkEmail, { isPending, isSuccess, error, data, reset }] =
    useSendBulkEmail();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    sendBulkEmail({
      subject,
      content,
    });
  };

  const handleReset = () => {
    ref.current?.reset();
    setSubject("");
    setContent("");
    reset();
  };

  if (isSuccess && data) {
    return (
      <div>
        <h3>
          {data.successCount === data.total ? "All" : data.successCount} Sent
        </h3>
        {data.failureCount > 0 && (
          <>
            <h4>{data.failureCount} Failed</h4>
            <ul>
              {data.failures.map(({ email, error }) => (
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
        <button type="button" onClick={handleReset}>
          Send Another Email
        </button>
      </div>
    );
  }

  return (
    <form ref={ref} onSubmit={handleSubmit}>
      <h3>Send Bulk Email to All Guests</h3>

      {error && (
        <div role="alert">
          <p>{error}</p>
        </div>
      )}

      <div>
        <label htmlFor={subjectId}>Subject *</label>
        <input
          type="text"
          id={subjectId}
          name={BULK_EMAIL_FORM_FIELDS.SUBJECT}
          value={subject}
          onChange={e => setSubject(e.target.value)}
          required={true}
          disabled={isPending}
        />
      </div>

      <div>
        <label htmlFor={contentId}>Email Content *</label>
        <textarea
          id={contentId}
          name={BULK_EMAIL_FORM_FIELDS.CONTENT}
          rows={10}
          value={content}
          onChange={e => setContent(e.target.value)}
          required={true}
          disabled={isPending}
          placeholder="Enter the email content here. Basic HTML is supported."
        />
        <p>
          Tip: You can use basic HTML for formatting (e.g., &lt;p&gt;,
          &lt;strong&gt;, &lt;em&gt;, &lt;br&gt;)
        </p>
      </div>

      <button type="submit" disabled={isPending || !subject || !content}>
        {isPending ? "Sending..." : "Send Email"}
      </button>
    </form>
  );
};

export const Actions = () => {
  const [showBulkEmail, setShowBulkEmail] = useState(false);

  return (
    <>
      <button type="button" onClick={() => setShowBulkEmail(!showBulkEmail)}>
        {showBulkEmail ? "Hide Bulk Email Form" : "Send Bulk Email"}
      </button>
      {showBulkEmail && (
        <div>
          <BulkEmailForm />
        </div>
      )}
    </>
  );
};
