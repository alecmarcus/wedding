"use client";

import { RSVP_FORM_FIELDS } from "@@/constants";
import { useSubmitRsvp, useUpdateRsvp } from "@@/pages/home/hooks";
import { useCallback, useRef, useState, useTransition } from "react";
import type { Rsvp } from "@/db";
import { RsvpFormSuccess } from "./RsvpFormSuccess";

type RsvpFormProps = {
  rsvp?: Rsvp;
  editToken?: string;
  onSuccess?: () => void;
};

export const RsvpForm = ({ rsvp, editToken, onSuccess }: RsvpFormProps) => {
  const formRef = useRef<HTMLFormElement>(null);
  const plusOneNameRef = useRef<HTMLDivElement>(null);
  const [showPlusOneName, setShowPlusOneName] = useState(rsvp?.plusOne);
  const [isPending, startTransition] = useTransition();

  const [submitRsvp, submitState] = useSubmitRsvp();
  const [updateRsvp, updateState] = useUpdateRsvp();

  const isEditMode = !!rsvp && !!editToken;
  const actionState = isEditMode ? updateState : submitState;
  const { isSuccess, error } = actionState;

  const handlePlusOneChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const isChecked = event.target.checked;
      setShowPlusOneName(isChecked);

      if (!isChecked && formRef.current) {
        const plusOneNameInput = formRef.current.elements.namedItem(
          RSVP_FORM_FIELDS.PLUS_ONE_NAME
        ) as HTMLInputElement;
        if (plusOneNameInput) {
          plusOneNameInput.value = "";
        }
      }
    },
    []
  );

  const handleSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const formData = new FormData(event.currentTarget);

      startTransition(() => {
        if (isEditMode && editToken) {
          updateRsvp(editToken, formData);
        } else {
          submitRsvp(formData);
        }
      });
    },
    [
      isEditMode,
      editToken,
      submitRsvp,
      updateRsvp,
    ]
  );

  const handleReset = useCallback(() => {
    formRef.current?.reset();
    setShowPlusOneName(false);
    if (isEditMode) {
      updateState.reset();
    } else {
      submitState.reset();
    }
    onSuccess?.();
  }, [
    isEditMode,
    submitState,
    updateState,
    onSuccess,
  ]);

  if (isSuccess) {
    return <RsvpFormSuccess isEditMode={isEditMode} onReset={handleReset} />;
  }

  const getButtonText = () => {
    if (isPending) {
      return isEditMode ? "Updating..." : "Submitting...";
    }
    return isEditMode ? "Update RSVP" : "Submit RSVP";
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit}>
      <h2>{isEditMode ? "Edit Your RSVP" : "RSVP"}</h2>

      {error && (
        <div role="alert">
          <p>{error}</p>
        </div>
      )}

      <div>
        <label htmlFor={RSVP_FORM_FIELDS.NAME}>Name *</label>
        <input
          type="text"
          id={RSVP_FORM_FIELDS.NAME}
          name={RSVP_FORM_FIELDS.NAME}
          defaultValue={rsvp?.name}
          required={true}
          disabled={isPending || isEditMode}
        />
      </div>

      <div>
        <label htmlFor={RSVP_FORM_FIELDS.EMAIL}>Email *</label>
        <input
          type="email"
          id={RSVP_FORM_FIELDS.EMAIL}
          name={RSVP_FORM_FIELDS.EMAIL}
          defaultValue={rsvp?.email}
          required={true}
          disabled={isPending || isEditMode}
        />
      </div>

      <div>
        <label>
          <input
            type="checkbox"
            name={RSVP_FORM_FIELDS.PLUS_ONE}
            value="true"
            defaultChecked={rsvp?.plusOne}
            disabled={isPending}
            onChange={handlePlusOneChange}
          />
          Will you be bringing a plus one?
        </label>
      </div>

      <div
        ref={plusOneNameRef}
        style={{
          display: showPlusOneName ? "block" : "none",
        }}
      >
        <label htmlFor={RSVP_FORM_FIELDS.PLUS_ONE_NAME}>Plus One Name</label>
        <input
          type="text"
          id={RSVP_FORM_FIELDS.PLUS_ONE_NAME}
          name={RSVP_FORM_FIELDS.PLUS_ONE_NAME}
          defaultValue={rsvp?.plusOneName || ""}
          disabled={isPending}
        />
      </div>

      <div>
        <label htmlFor={RSVP_FORM_FIELDS.DIETARY_RESTRICTIONS}>
          Dietary Restrictions
        </label>
        <textarea
          id={RSVP_FORM_FIELDS.DIETARY_RESTRICTIONS}
          name={RSVP_FORM_FIELDS.DIETARY_RESTRICTIONS}
          rows={3}
          defaultValue={rsvp?.dietaryRestrictions || ""}
          disabled={isPending}
        />
      </div>

      <div>
        <label htmlFor={RSVP_FORM_FIELDS.MESSAGE}>Message for the Couple</label>
        <textarea
          id={RSVP_FORM_FIELDS.MESSAGE}
          name={RSVP_FORM_FIELDS.MESSAGE}
          rows={4}
          defaultValue={rsvp?.message || ""}
          disabled={isPending}
        />
      </div>

      <button type="submit" disabled={isPending}>
        {getButtonText()}
      </button>
    </form>
  );
};
