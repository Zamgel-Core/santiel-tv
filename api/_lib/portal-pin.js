import {
  randomBytes,
  scrypt as scryptCallback,
  timingSafeEqual,
} from "node:crypto";
import { promisify } from "node:util";

const scrypt = promisify(scryptCallback);

export function isValidPin(pin) {
  return typeof pin === "string" && /^[0-9]{6}$/.test(pin);
}

function getPepper() {
  const pepper = process.env.PORTAL_PIN_PEPPER;

  if (!pepper || pepper.length < 32) {
    throw new Error("PORTAL_PIN_PEPPER no configurado");
  }

  return pepper;
}

export async function hashPortalPin(pin) {
  if (!isValidPin(pin)) {
    throw new Error("El PIN debe tener 6 dígitos");
  }

  const pepper = getPepper();
  const salt = randomBytes(16).toString("hex");

  const derivedKey = await scrypt(`${pin}:${pepper}`, salt, 64);

  return `scrypt:${salt}:${derivedKey.toString("hex")}`;
}

export async function verifyPortalPin(pin, storedHash) {
  if (!isValidPin(pin)) return false;

  if (
    typeof storedHash !== "string" ||
    !/^scrypt:[a-f0-9]{32}:[a-f0-9]{128}$/.test(storedHash)
  ) {
    return false;
  }

  const pepper = getPepper();
  const [, salt, expectedHex] = storedHash.split(":");

  const derivedKey = await scrypt(`${pin}:${pepper}`, salt, 64);

  const expected = Buffer.from(expectedHex, "hex");

  return timingSafeEqual(derivedKey, expected);
}
