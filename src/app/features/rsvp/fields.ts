import { UPLOAD_PHOTOS_FIELDS } from "./photo/fields";

const MAX_NAME = 75;
const MAX_DIET = 500;
const MAX_MESSAGE = 1000;

export const RSVP_FIELDS = {
  name: {
    name: "name",
    max: MAX_NAME,
  },
  attending: {
    name: "attending",
  },
  email: {
    name: "email",
    max: MAX_NAME,
  },
  plusOne: {
    name: "plusOne",
  },
  plusOneName: {
    name: "plusOneName",
    max: MAX_NAME,
  },
  dietaryRestrictions: {
    name: "dietaryRestrictions",
    max: MAX_DIET,
  },
  message: {
    name: "message",
    max: MAX_MESSAGE,
  },
  ...UPLOAD_PHOTOS_FIELDS,
} as const;
