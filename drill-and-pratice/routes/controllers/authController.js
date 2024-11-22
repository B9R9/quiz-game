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
import { getConfig, initializeSQL } from "../../database/database.js";
import { log } from "../../utils/logger.js";

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
  const config = getConfig(Deno.env.get("MODE"), Deno.env.toObject());
  const sql = await initializeSQL(config);

  try {
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
      response.redirect("/auth/register");
      return;
    }
    data = {
      errors: [],
      email: "",
      username: "",
    };

    const hashPW = await hashPassword(registerData.password);

    await authService.createUser(sql, hashPW, registerData);

    response.redirect("/auth/login");
  } finally {
    await sql.end();
  }
};

export const login = async ({ request, response, state }) => {
  const config = getConfig(Deno.env.get("MODE"), Deno.env.toObject());
  const sql = await initializeSQL(config);

  try {
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
    const user = await authService.getUserByEmail(sql, params.get("email"));
    if (user.success === false) {
      data.errors.push("Invalid email or password");
      data.email = dataRegister.email;
      response.redirect("/auth/login");
      return;
    }
    isMatch = await comparePassword(dataRegister.password, user.data.password);
    if (!isMatch) {
      if (data.errors.length === 0) {
        data.errors.push("Invalid email or password");
        data.email = dataRegister.email;
        response.redirect("/auth/login");
        return;
      }
    }

    data.errors = [];
    data.email = "";
    data.password = "";

    await state.session.set("authenticated", true);
    await state.session.set("user", {
      id: user.data.id,
      email: user.data.email,
      username: user.data.username,
      admin: user.data.admin,
    });

    response.redirect("/topics");
  } finally {
    await sql.end();
  }
};

export const logout = async ({ response, state }) => {
  await state.session.set("authenticated", false);
  await state.session.set("user", null);
  response.redirect("/");
};
