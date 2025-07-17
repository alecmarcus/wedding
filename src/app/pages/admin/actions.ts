/** biome-ignore-all lint/style/useNamingConvention: "ID" in vendor property names */
"use server";

// Server actions go here

import { env } from "cloudflare:workers";
import {
  type AuthenticationResponseJSON,
  generateAuthenticationOptions,
  generateRegistrationOptions,
  type RegistrationResponseJSON,
  verifyAuthenticationResponse,
  verifyRegistrationResponse,
} from "@simplewebauthn/server";
import { requestInfo } from "rwsdk/worker";
import { db } from "#/db";
import { sessions } from "#/session/store";
import { IS_DEV } from "#constants";

const getWebAuthnConfig = (request: Request) => {
  const rpId = env.WEBAUTHN_RP_ID ?? new URL(request.url).hostname;
  const rpName = IS_DEV ? "Development App" : env.WEBAUTHN_APP_NAME;
  return {
    rpName,
    rpID: rpId,
  };
};

export const startPasskeyRegistration = async (username: string) => {
  const { rpName, rpID } = getWebAuthnConfig(requestInfo.request);
  const { headers } = requestInfo;

  const options = await generateRegistrationOptions({
    rpName,
    rpID,
    userName: username,
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

export const finishPasskeyRegistration = async (
  username: string,
  registration: RegistrationResponseJSON
) => {
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
      username,
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

export const startPasskeyLogin = async () => {
  const { rpID } = getWebAuthnConfig(requestInfo.request);
  const { headers } = requestInfo;

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

export const finishPasskeyLogin = async (login: AuthenticationResponseJSON) => {
  const { request, headers } = requestInfo;
  const { origin } = new URL(request.url);

  const session = await sessions.load(request);
  const challenge = session?.challenge;

  if (!challenge) {
    return false;
  }

  const credential = await db.credential.findUnique({
    where: {
      credentialId: login.id,
    },
  });

  if (!credential) {
    return false;
  }

  const verification = await verifyAuthenticationResponse({
    response: login,
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
      credentialId: login.id,
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
