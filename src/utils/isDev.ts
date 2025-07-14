"use server"
import process from "node:process"

export const isDev = () => process.env.NODE_ENV === "development"
