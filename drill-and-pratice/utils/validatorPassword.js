import * as authService from "../services/authService.js";
import { crypto } from "https://deno.land/std@0.203.0/crypto/mod.ts";

export const isUppercase = (value) => {
  return /[A-Z]/.test(value);
};

export const isNumeric = (value) => {
  return /\d+/.test(value);
};

export const isSpecialCharacter = (value) => {
  return /[^a-zA-Z0-9]/.test(value);
};

export const isAlreadyRegistered = async (email) => {
  const user = await authService.getUserByEmail(email);
  return user.length;
};

const encoder = new TextEncoder();

export async function hashPassword(password) {
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function comparePassword(inputPassword, storedHash) {
  const inputHash = await hashPassword(inputPassword);
  return inputHash === storedHash;
}
