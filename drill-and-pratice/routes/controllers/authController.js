import {
  validate,
  required,
  isEmail,
  lengthBetween,
} from "https://deno.land/x/validasaur/mod.ts";

import {
  isNumeric,
  isSpecialCharacter,
  isUppercase,
  isAlreadyRegistered,
  hashPassword,
  comparePassword,
} from "../../utils/validatorPassword.js";

import * as authService from "../../services/authService.js";
import { sql } from "../../database/database.js";
import { log } from "../../utils/logger.js";

// const config = getConfig("DEV", Deno.env.toObject());
// const sql = await initializeSQL(config);

let data = {
  errors: [],
  email: "",
  username: "",
};

const validationRules = {
  username: [required, lengthBetween(3, 20)],
  email: [required, isEmail],
  password: [required, lengthBetween(4, 20)],
};

export const showRegistrationForm = ({ render }) => {
  console.log(data);
  console.log(data.errors);
  render("register.eta", data);
  data = {
    errors: [],
    email: "",
    username: "",
    password: "",
  };
};

export const showLoginForm = ({ render }) => {
  render("login.eta", data);
  data = {
    errors: [],
    email: "",
    password: "",
    username: "",
  };
};

export const register = async ({ request, response }) => {
  const body = request.body();
  const params = await body.value;
  log("Registering user", "info", "authController.js");

  let data = {
    errors: [],
    email: "",
    username: "",
  };

  const registerData = {
    email: params.get("email").trim(),
    username: params.get("username").trim(),
    password: params.get("password"),
    confirmPassword: params.get("confirmPW"),
  };

  if (registerData.password !== registerData.confirmPassword) {
    data.errors.push("Passwords do not match");
  }

  if (!isSpecialCharacter(registerData.password)) {
    data.errors.push("Password must contain a special character");
  }

  if (!isNumeric(registerData.password)) {
    data.errors.push("Password must contain a number");
  }

  if (!isUppercase(registerData.password)) {
    data.errors.push("Password must contain an uppercase letter");
  }

  if ((await isAlreadyRegistered(sql, registerData.email)) > 0) {
    data.errors.push("Email already registered");
  }

  const [passes, errors] = await validate(registerData, validationRules);

  if (!passes || data.errors.length > 0) {
    Object.keys(errors).forEach((key) => {
      Object.keys(errors[key]).forEach((error) => {
        data.errors.push(errors[key][error]);
      });
    });
    data.email = registerData.email;
    data.username = registerData.username;
    console.log(data);
    console.log(data.errors);
    response.redirect("/auth/register");
    return;
  }
  data = {
    errors: [],
    email: "",
    username: "",
  };

  const hashPW = await hashPassword(registerData.password);

  console.log(hashPW);

  await authService.createUser(sql, hashPW, registerData);
  response.redirect("/auth/login");
};

export const login = async ({ request, response, state }) => {
  const body = request.body();
  const params = await body.value;

  data.errors = [];
  data.email = "";
  data.password = "";

  const dataRegister = {
    email: params.get("email"),
    password: params.get("password"),
  };

  let isMatch = false;
  console.log(dataRegister);
  const user = await authService.getUserByEmail(sql, params.get("email"));
  isMatch = await comparePassword(dataRegister.password, user[0].password);
  if (user.length === 0 || !isMatch) {
    data.errors.push("Invalid email or password");
  }

  if (data.errors.length > 0) {
    data.email = dataRegister.email;
    response.redirect("/auth/login");
    return;
  }

  data.errors = [];
  data.email = "";
  data.password = "";

  await state.session.set("authenticated", true);
  await state.session.set("user", {
    id: user[0].id,
    email: user[0].email,
    username: user[0].username,
    admin: user[0].admin,
  });

  response.redirect("/topics");
};

export const logout = async ({ response, state }) => {
  await state.session.set("authenticated", false);
  await state.session.set("user", null);
  response.redirect("/");
};
