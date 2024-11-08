import * as authService from "../services/authService.js";

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
