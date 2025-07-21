"use server";

import { env } from "cloudflare:workers";
import {
  type AuthenticationResponseJSON,
  generateAuthenticationOptions,
  generateRegistrationOptions,
  type RegistrationResponseJSON,
  verifyAuthenticationResponse,
  verifyRegistrationResponse,
} from "@simplewebauthn/server";
import { IS_DEV } from "rwsdk/constants";
import { verifyTurnstileToken } from "rwsdk/turnstile";
import { requestInfo } from "rwsdk/worker";
import { db } from "@/db";
import { sessions } from "@/session/store";

const getWebAuthnConfig = ({ request }: { request: Request }) => {
  const rpId = env.WEBAUTHN_RP_ID ?? new URL(request.url).hostname;
  const rpName = IS_DEV ? "Development App" : env.WEBAUTHN_APP_NAME;
  return {
    rpName,
    rpID: rpId,
  };
};

export const startPasskeyLogin = async () => {
  const { request, headers } = requestInfo;

  const { rpID } = getWebAuthnConfig({
    request,
  });

  const options = await generateAuthenticationOptions({
    rpID,
    userVerification: "preferred",
    allowCredentials: [],
  });

  await sessions.save(headers, {
    challenge: options.challenge,
  });

  return options;
};

export const finishPasskeyLogin = async ({
  response,
}: {
  response: AuthenticationResponseJSON;
}) => {
  const { request, headers } = requestInfo;
  const { origin } = new URL(request.url);

  const session = await sessions.load(request);
  const challenge = session?.challenge;

  if (!challenge) {
    return false;
  }

  const credential = await db.credential.findUnique({
    where: {
      credentialId: response.id,
    },
  });

  if (!credential) {
    return false;
  }

  const verification = await verifyAuthenticationResponse({
    response,
    expectedChallenge: challenge,
    expectedOrigin: origin,
    expectedRPID: env.WEBAUTHN_RP_ID || new URL(request.url).hostname,
    requireUserVerification: false,
    credential: {
      id: credential.credentialId,
      publicKey: credential.publicKey,
      counter: credential.counter,
    },
  });

  if (!verification.verified) {
    return false;
  }

  await db.credential.update({
    where: {
      credentialId: response.id,
    },
    data: {
      counter: verification.authenticationInfo.newCounter,
    },
  });

  const user = await db.user.findUnique({
    where: {
      id: credential.userId,
    },
  });

  if (!user) {
    return false;
  }

  await sessions.save(headers, {
    userId: user.id,
    challenge: null,
  });

  return true;
};

export const startPasskeyRegistration = async ({
  userName,
}: {
  userName: string;
}) => {
  const { request, headers } = requestInfo;

  const { rpName, rpID } = getWebAuthnConfig({
    request,
  });

  const verifyTurnstile = await verifyTurnstileToken({
    token: env.TURNSTILE_SITE_KEY,
    secretKey: env.TURNSTILE_SECRET_KEY,
  });

  if (!verifyTurnstile) {
    throw new Error("Bot protection verification failed");
  }

  const options = await generateRegistrationOptions({
    rpName,
    rpID,
    userName,
    authenticatorSelection: {
      residentKey: "required",
      userVerification: "preferred",
    },
  });

  await sessions.save(headers, {
    challenge: options.challenge,
  });

  return options;
};

export const finishPasskeyRegistration = async ({
  userName,
  registration,
}: {
  userName: string;
  registration: RegistrationResponseJSON;
}) => {
  const { request, headers } = requestInfo;
  const { origin } = new URL(request.url);

  const session = await sessions.load(request);
  const challenge = session?.challenge;

  if (!challenge) {
    return false;
  }

  const verification = await verifyRegistrationResponse({
    response: registration,
    expectedChallenge: challenge,
    expectedOrigin: origin,
    expectedRPID: env.WEBAUTHN_RP_ID || new URL(request.url).hostname,
    requireUserVerification: false,
  });

  if (!(verification.verified && verification.registrationInfo)) {
    return false;
  }

  const user = await db.user.create({
    data: {
      userName,
    },
  });

  await db.credential.create({
    data: {
      userId: user.id,
      credentialId: verification.registrationInfo.credential.id,
      publicKey: verification.registrationInfo.credential.publicKey,
      counter: verification.registrationInfo.credential.counter,
    },
  });

  // Automatically log in the user after registration
  await sessions.save(headers, {
    userId: user.id,
    challenge: null,
  });

  return true;
};

export const isSetupNeeded = async () => {
  const userCount = await db.user.count();
  return userCount === 0;
};
