import { createPublicKey, verify as verifySignature } from "node:crypto";

export function canonicalAttestationJson(value) {
  if (Array.isArray(value)) return `[${value.map(canonicalAttestationJson).join(",")}]`;
  if (value && typeof value === "object") {
    return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${canonicalAttestationJson(value[key])}`).join(",")}}`;
  }
  return JSON.stringify(value);
}

export function attestationSigningPayload(attestation) {
  const { signature: _signature, ...payload } = attestation ?? {};
  return payload;
}

export function verifyDetachedAttestation(attestation, expectation, trustStores = []) {
  const errors = [];
  const add = (condition, message) => { if (!condition) errors.push(message); };
  add(attestation && typeof attestation === "object" && !Array.isArray(attestation), "attestation is not an object");
  if (errors.length) return errors;
  add(attestation.purpose === expectation.purpose, "attestation purpose does not match the protected operation");
  add(attestation.subject?.ref === expectation.subjectRef, "attestation subject ref does not match");
  add(attestation.subject?.sha256 === expectation.subjectSha256, "attestation subject hash does not match");
  if (expectation.subjectMediaType) add(attestation.subject?.mediaType === expectation.subjectMediaType, "attestation subject media type does not match");
  const storeKeys = trustStores.flatMap((store) => (store?.keys ?? []).map((key) => ({ ...key, storeScope: store.scope, trustStoreId: store.trustStoreId })));
  const matches = storeKeys.filter((key) => key.keyId === attestation.keyId && key.issuerId === attestation.issuerId);
  add(matches.length === 1, "attestation key is absent or ambiguous in the operator-controlled trust stores");
  if (matches.length !== 1) return errors;
  const key = matches[0];
  add(key.algorithm === "Ed25519" && attestation.signatureAlgorithm === "Ed25519", "attestation algorithm is not Ed25519");
  add((key.allowedPurposes ?? []).includes(attestation.purpose), "attestation key is not authorized for this purpose");
  if (expectation.requiredStoreScope) add(key.storeScope === expectation.requiredStoreScope, `attestation requires trust-store scope ${expectation.requiredStoreScope}`);
  const issuedAt = Date.parse(attestation.issuedAt ?? "");
  const checkedAt = Date.parse(expectation.checkedAt ?? attestation.issuedAt ?? "");
  const verificationTime = Date.parse(expectation.verificationTime ?? new Date().toISOString());
  const expiresAt = attestation.expiresAt === null ? Infinity : Date.parse(attestation.expiresAt ?? "");
  const keyFrom = Date.parse(key.validFrom ?? "");
  const keyUntil = key.validUntil === null ? Infinity : Date.parse(key.validUntil ?? "");
  const revokedAt = key.revokedAt === null ? Infinity : Date.parse(key.revokedAt ?? "");
  add(Number.isFinite(issuedAt) && Number.isFinite(checkedAt) && Number.isFinite(verificationTime) && issuedAt <= checkedAt, "attestation chronology is invalid");
  add(issuedAt <= verificationTime + (expectation.maximumClockSkewMs ?? 300000), "attestation was issued too far in the future");
  add(!Number.isNaN(expiresAt) && checkedAt <= expiresAt, "attestation is expired at the protected operation time");
  add(!Number.isNaN(expiresAt) && verificationTime <= expiresAt, "attestation is expired at verification time");
  add(Number.isFinite(keyFrom) && !Number.isNaN(keyUntil) && keyFrom <= issuedAt && issuedAt <= keyUntil, "attestation was issued outside key validity");
  add(!Number.isNaN(keyUntil) && verificationTime <= keyUntil, "attestation key is no longer valid at verification time");
  add(!Number.isNaN(revokedAt) && checkedAt < revokedAt, "attestation key was revoked before the protected operation completed");
  add(!Number.isNaN(revokedAt) && verificationTime < revokedAt, "attestation key is revoked at verification time; historical acceptance requires an independent trusted timestamp");
  if (expectation.operationAt !== undefined) {
    const operationAt = Date.parse(expectation.operationAt ?? "");
    const maximumIssueDelayMs = expectation.maximumIssueDelayMs ?? 300000;
    add(Number.isFinite(operationAt) && operationAt <= issuedAt && issuedAt - operationAt <= maximumIssueDelayMs, "attestation issuance is outside the allowed post-operation window");
  }
  if (expectation.latestIssueAt !== undefined) {
    const latestIssueAt = Date.parse(expectation.latestIssueAt ?? "");
    add(Number.isFinite(latestIssueAt) && issuedAt <= latestIssueAt, "attestation was issued after the latest permitted time");
  }
  if (errors.length) return errors;
  try {
    const payload = Buffer.from(canonicalAttestationJson(attestationSigningPayload(attestation)), "utf8");
    const signature = Buffer.from(attestation.signature ?? "", "base64");
    const publicKey = createPublicKey(key.publicKeySpkiPem);
    add(verifySignature(null, payload, publicKey, signature), "attestation signature is invalid");
  } catch (error) {
    errors.push(`attestation signature could not be verified (${error.message})`);
  }
  return errors;
}
