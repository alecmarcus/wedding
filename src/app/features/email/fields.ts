export const BULK_SEND_FIELDS = {
  subject: {
    name: "subject",
    max: 80,
  },
  attending: {
    name: "attending",
  },
  content: {
    name: "content",
    max: 1000,
  },
} as const;
