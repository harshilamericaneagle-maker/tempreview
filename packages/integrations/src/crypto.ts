import { env } from "@reviewhub/config/env";
import crypto from "node:crypto";

function getKey() {
  const key = Buffer.from(env.ENCRYPTION_KEY, "base64");
  if (key.length !== 32) {
    throw new Error("ENCRYPTION_KEY must be a 32-byte base64 value.");
  }
  return key;
}

export function encryptToken(plainText: string): string {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", getKey(), iv);
  const encrypted = Buffer.concat([cipher.update(plainText, "utf8"), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return `${iv.toString("base64")}:${authTag.toString("base64")}:${encrypted.toString("base64")}`;
}

export function decryptToken(cipherText: string): string {
  const [ivB64, tagB64, encryptedB64] = cipherText.split(":");
  if (!ivB64 || !tagB64 || !encryptedB64) {
    throw new Error("Invalid encrypted token format.");
  }

  const decipher = crypto.createDecipheriv("aes-256-gcm", getKey(), Buffer.from(ivB64, "base64"));
  decipher.setAuthTag(Buffer.from(tagB64, "base64"));
  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(encryptedB64, "base64")),
    decipher.final(),
  ]);
  return decrypted.toString("utf8");
}
