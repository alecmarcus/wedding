// "use client";

// import { RSVP_FORM_FIELDS } from "@@/constants";
// import { useRsvpAction } from "@@/features/rsvp/hooks";
// import { useCallback, useEffect, useRef, useState } from "react";
// import type { Rsvp } from "@/db";

// type RsvpFormSuccessProps = {
//   submissionType: "update" | "create";
//   returnToEditing: () => void;
// };

// const RsvpFormSuccess = ({
//   submissionType,
//   returnToEditing,
// }: RsvpFormSuccessProps) => {
//   return (
//     <div>
//       <h2>{submissionType === "update" ? "RSVP Updated!" : "Thank You!"}</h2>
//       <p>
//         {submissionType === "update"
//           ? "Your RSVP has been updated successfully."
//           : "Your RSVP has been submitted successfully."}
//       </p>
//       <p>
//         {submissionType === "update"
//           ? "A confirmation email has been sent to your email address."
//           : "Please check your email for confirmation and important links."}
//       </p>
//       <button type="button" onClick={returnToEditing}>
//         Edit my RSVP
//       </button>
//     </div>
//   );
// };

// type RsvpFormProps = {
//   rsvp: Rsvp | null;
// };

// export const RsvpForm = ({ rsvp: initialRsvp }: RsvpFormProps) => {
//   const formRef = useRef<HTMLFormElement>(null);
//   const [showPlusOneName, setShowPlusOneName] = useState(initialRsvp?.plusOne);

//   const [onSubmit, { isSuccess, isPending, error, data: rsvp }] = useRsvpAction(
//     {
//       data: initialRsvp,
//       error: null,
//       isSuccess: null,
//     }
//   );

//   const [isEditing, setIsEditing] = useState(true);
//   const [submissionType, setSubmissionType] = useState<
//     RsvpFormSuccessProps["submissionType"]
//   >(initialRsvp ? "update" : "create");
//   const returnToEditing = useCallback(() => {
//     setIsEditing(true);
//     setSubmissionType("update");
//   }, []);
//   useEffect(() => {
//     if (isPending === false && isSuccess) {
//       setIsEditing(false);
//     }
//   }, [
//     isPending,
//     isSuccess,
//   ]);

//   const handlePlusOneChange = useCallback(
//     (event: React.ChangeEvent<HTMLInputElement>) => {
//       const isChecked = event.target.checked;
//       setShowPlusOneName(isChecked);

//       if (!isChecked && formRef.current) {
//         const plusOneNameInput = formRef.current.elements.namedItem(
//           RSVP_FORM_FIELDS.PLUS_ONE_NAME
//         ) as HTMLInputElement;
//         if (plusOneNameInput) {
//           plusOneNameInput.value = "";
//         }
//       }
//     },
//     []
//   );

//   if (!isEditing) {
//     return (
//       <RsvpFormSuccess
//         submissionType={submissionType}
//         returnToEditing={returnToEditing}
//       />
//     );
//   }

//   const getButtonText = () => {
//     if (isPending) {
//       return submissionType === "update" ? "Updating..." : "Submitting...";
//     }
//     return submissionType === "update" ? "Update RSVP" : "Submit RSVP";
//   };

//   return (
//     <form ref={formRef} action={onSubmit}>
//       <h2>{isEditing ? "Edit Your RSVP" : "RSVP"}</h2>

//       {error && (
//         <div role="alert">
//           <p>{error}</p>
//         </div>
//       )}

//       <div>
//         <label htmlFor={RSVP_FORM_FIELDS.NAME}>Name *</label>
//         <input
//           type="text"
//           id={RSVP_FORM_FIELDS.NAME}
//           name={RSVP_FORM_FIELDS.NAME}
//           defaultValue={rsvp?.name}
//           required={true}
//           disabled={isPending || isEditing}
//         />
//       </div>

//       <div>
//         <label htmlFor={RSVP_FORM_FIELDS.EMAIL}>Email *</label>
//         <input
//           type="email"
//           id={RSVP_FORM_FIELDS.EMAIL}
//           name={RSVP_FORM_FIELDS.EMAIL}
//           defaultValue={rsvp?.email}
//           required={true}
//           disabled={isPending || isEditing}
//         />
//       </div>

//       <div>
//         <label>
//           <input
//             type="checkbox"
//             name={RSVP_FORM_FIELDS.PLUS_ONE}
//             value="true"
//             defaultChecked={rsvp?.plusOne}
//             disabled={isPending}
//             onChange={handlePlusOneChange}
//           />
//           Will you be bringing a plus one?
//         </label>
//       </div>

//       <div
//         style={{
//           display: showPlusOneName ? "block" : "none",
//         }}
//       >
//         <label htmlFor={RSVP_FORM_FIELDS.PLUS_ONE_NAME}>Plus One Name</label>
//         <input
//           type="text"
//           id={RSVP_FORM_FIELDS.PLUS_ONE_NAME}
//           name={RSVP_FORM_FIELDS.PLUS_ONE_NAME}
//           defaultValue={rsvp?.plusOneName || ""}
//           disabled={isPending}
//         />
//       </div>

//       <div>
//         <label htmlFor={RSVP_FORM_FIELDS.DIETARY_RESTRICTIONS}>
//           Dietary Restrictions
//         </label>
//         <textarea
//           id={RSVP_FORM_FIELDS.DIETARY_RESTRICTIONS}
//           name={RSVP_FORM_FIELDS.DIETARY_RESTRICTIONS}
//           rows={3}
//           defaultValue={rsvp?.dietaryRestrictions || ""}
//           disabled={isPending}
//         />
//       </div>

//       <div>
//         <label htmlFor={RSVP_FORM_FIELDS.MESSAGE}>Message for the Couple</label>
//         <textarea
//           id={RSVP_FORM_FIELDS.MESSAGE}
//           name={RSVP_FORM_FIELDS.MESSAGE}
//           rows={4}
//           defaultValue={rsvp?.message || ""}
//           disabled={isPending}
//         />
//       </div>

//       <button type="submit" disabled={isPending}>
//         {getButtonText()}
//       </button>
//     </form>
//   );
// };
