#!/usr/bin/env node

import { createHash, createPrivateKey, sign } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { attestationSigningPayload, canonicalAttestationJson } from "./verify-attestation.mjs";

const optionNames = new Set([
  "--subject-file", "--subject-ref", "--media-type", "--purpose", "--issuer", "--key-id",
  "--private-key", "--attestation-id", "--issued-at", "--expires-at", "--out"
]);
const options = {};
for (let index = 2; index < process.argv.length; index += 2) {
  const option = process.argv[index];
  const value = process.argv[index + 1];
  if (!optionNames.has(option) || !value) throw new Error(`Invalid or incomplete option ${String(option)}`);
  options[option] = value;
}
for (const required of optionNames) {
  if (required === "--expires-at") continue;
  if (!options[required]) throw new Error(`Missing ${required}`);
}
const subjectBytes = readFileSync(options["--subject-file"]);
const attestation = {
  schemaVersion: "1.1",
  releaseRef: "v0.9.4-mp1",
  attestationId: options["--attestation-id"],
  purpose: options["--purpose"],
  subject: {
    ref: options["--subject-ref"],
    sha256: createHash("sha256").update(subjectBytes).digest("hex"),
    mediaType: options["--media-type"]
  },
  issuerId: options["--issuer"],
  keyId: options["--key-id"],
  issuedAt: options["--issued-at"],
  expiresAt: options["--expires-at"] ?? null,
  signatureAlgorithm: "Ed25519",
  signatureEncoding: "base64",
  signature: ""
};
const privateKey = createPrivateKey(readFileSync(options["--private-key"], "utf8"));
const payload = Buffer.from(canonicalAttestationJson(attestationSigningPayload(attestation)), "utf8");
attestation.signature = sign(null, payload, privateKey).toString("base64");
writeFileSync(options["--out"], `${JSON.stringify(attestation, null, 2)}\n`, { encoding: "utf8", mode: 0o600 });
