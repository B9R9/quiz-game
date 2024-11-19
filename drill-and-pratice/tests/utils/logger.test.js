import { log } from "../../utils/logger.js";
import { assertStringIncludes } from "https://deno.land/std@0.203.0/assert/mod.ts";

function mockConsole() {
  const originalConsoleLog = console.log;
  const logMessages = [];
  console.log = (message) => {
    logMessages.push(message);
  };
  return {
    logMessages,
    restore: () => {
      console.log = originalConsoleLog;
    },
  };
}

Deno.test("log function - error type", () => {
  const mock = mockConsole();
  const message = "This is an error message";
  const type = "error";
  const where = "testError";

  log(message, type, where);

  const time = new Date().toISOString();
  const expectedOutput = `[${time}]: testError: \x1b[31m This is an error message\x1b[0m`;

  // Vérifier la sortie du log en ignorant l'horodatage exact
  assertStringIncludes(mock.logMessages[0], `[`);
  assertStringIncludes(
    mock.logMessages[0],
    `${where}: \x1b[31m ${message}\x1b[0m`
  );

  mock.restore();
});

Deno.test("log function - success type", () => {
  const mock = mockConsole();
  const message = "This is a success message";
  const type = "success";
  const where = "testSuccess";

  log(message, type, where);

  const time = new Date().toISOString();
  const expectedOutput = `[${time}]: testSuccess: \x1b[32m This is a success message\x1b[0m`;

  // Vérifier la sortie du log en ignorant l'horodatage exact
  assertStringIncludes(mock.logMessages[0], `[`);
  assertStringIncludes(
    mock.logMessages[0],
    `${where}: \x1b[32m ${message}\x1b[0m`
  );

  mock.restore();
});

Deno.test("log function - warning type", () => {
  const mock = mockConsole();
  const message = "This is a warning message";
  const type = "warning";
  const where = "testWarning";

  log(message, type, where);

  const time = new Date().toISOString();
  const expectedOutput = `[${time}]: testWarning: \x1b[33m ${message}\x1b[0m`;

  // Vérifier la sortie du log en ignorant l'horodatage exact
  assertStringIncludes(mock.logMessages[0], `[`);
  assertStringIncludes(
    mock.logMessages[0],
    `${where}: \x1b[33m ${message}\x1b[0m`
  );

  mock.restore();
});

Deno.test("log function - info type", () => {
  const mock = mockConsole();
  const message = "This is an info message";
  const type = "info";
  const where = "testInfo";

  log(message, type, where);

  const time = new Date().toISOString();
  const expectedOutput = `[${time}]: testInfo: ${message}`;

  // Vérifier la sortie du log en ignorant l'horodatage exact
  assertStringIncludes(mock.logMessages[0], `[`);
  assertStringIncludes(mock.logMessages[0], `${where}: ${message}`);

  mock.restore();
});

Deno.test("log function - default type", () => {
  const mock = mockConsole();
  const message = "This is a default message";
  const type = "default";
  const where = "testDefault";

  log(message, type, where);

  const time = new Date().toISOString();
  const expectedOutput = `[${time}]: ${message}`;

  // Vérifier la sortie du log en ignorant l'horodatage exact
  assertStringIncludes(mock.logMessages[0], `[`);
  assertStringIncludes(mock.logMessages[0], `${message}`);

  mock.restore();
});

Deno.test("log function - empty message", () => {
  const mock = mockConsole();
  const message = "";
  const type = "info";
  const where = "testEmpty";

  log(message, type, where);

  const time = new Date().toISOString();
  const expectedOutput = `[${time}]: ${message}`;

  // Vérifier la sortie du log en ignorant l'horodatage exact
  assertStringIncludes(mock.logMessages[0], `[`);
  assertStringIncludes(mock.logMessages[0], `${message}`);

  mock.restore();
});

Deno.test("log function - undefined type", () => {
  const mock = mockConsole();
  const message = "This is a message with undefined type";
  const type = undefined;
  const where = "testUndefined";

  log(message, type, where);

  const time = new Date().toISOString();
  const expectedOutput = `[${time}]:${message}`;

  // Vérifier la sortie du log en ignorant l'horodatage exact
  assertStringIncludes(mock.logMessages[0], `[`);
  assertStringIncludes(mock.logMessages[0], `${message}`);

  mock.restore();
});
