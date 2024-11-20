import * as validator from "../../../utils/validatorPassword.js";
import { assertEquals } from "jsr:@std/assert";

Deno.test("isUppercase test with all ASCII Table", () => {
  for (let i = 0; i < 128; i++) {
    const char = String.fromCharCode(i);
    const result = validator.isUppercase(char);
    const expected = char >= "A" && char <= "Z";
    assertEquals(result, expected, `Failed for char: ${char} (ASCII: ${i})`);
  }
});

Deno.test("isNumeric test with all ASCII Table", () => {
  for (let i = 0; i < 128; i++) {
    const char = String.fromCharCode(i);
    const result = validator.isNumeric(char);
    const expected = char >= "0" && char <= "9";
    assertEquals(result, expected, `Failed for char: ${char} (ASCII: ${i})`);
  }
});

Deno.test("isSpecialCharacter test with all ASCII Table", () => {
  for (let i = 0; i < 128; i++) {
    const char = String.fromCharCode(i);
    const result = validator.isSpecialCharacter(char);
    const expected = !/^[a-zA-Z0-9]$/.test(char);
    assertEquals(result, expected, `Failed for char: ${char} (ASCII: ${i})`);
  }
});

Deno.test("hashPassword test", async () => {
  const password = Array.from({ length: 10 }, () => {
    const charCode = Math.floor(Math.random() * 128);
    return String.fromCharCode(charCode);
  }).join("");

  const hash = await validator.hashPassword(password);
  assertEquals(true, await validator.comparePassword(password, hash));
});
