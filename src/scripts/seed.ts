import { env } from "cloudflare:workers";
import { defineScript } from "rwsdk/worker";
import { db, setupDb } from "@/db";

export default defineScript(async () => {
  await setupDb(env);

  // Clean slate for development
  await db.$executeRawUnsafe(`\
    DELETE FROM Credential;
    DELETE FROM User;
    DELETE FROM Rsvp;
    DELETE FROM Photo;
  `);

  console.log("Database cleared. Visit /admin/setup to create admin account.");
});
