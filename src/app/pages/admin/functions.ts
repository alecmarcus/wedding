"use server"

import { db } from "#/db"

export const isSetupNeeded = async () => {
  const userCount = await db.user.count()
  return userCount === 0
}
