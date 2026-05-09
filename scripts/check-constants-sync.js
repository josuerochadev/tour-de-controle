#!/usr/bin/env node

/**
 * Verify that ROLES and ADMIN_ROLES constants are in sync
 * between backend and frontend source files.
 */

const fs = require("fs");
const path = require("path");

const BACKEND_FILE = path.join(__dirname, "../backend/src/config/constants.ts");
const FRONTEND_FILE = path.join(__dirname, "../frontend/src/constants.ts");

function extractRoles(content) {
  const match = content.match(
    /export\s+const\s+ROLES\s*=\s*\{([^}]+)\}/
  );
  if (!match) return null;

  const entries = {};
  const pairs = match[1].matchAll(/(\w+)\s*:\s*(\d+)/g);
  for (const pair of pairs) {
    entries[pair[1]] = Number(pair[2]);
  }
  return entries;
}

const backendContent = fs.readFileSync(BACKEND_FILE, "utf-8");
const frontendContent = fs.readFileSync(FRONTEND_FILE, "utf-8");

const backendRoles = extractRoles(backendContent);
const frontendRoles = extractRoles(frontendContent);

if (!backendRoles) {
  console.error("Could not parse ROLES from backend/src/config/constants.ts");
  process.exit(1);
}

if (!frontendRoles) {
  console.error("Could not parse ROLES from frontend/src/constants.ts");
  process.exit(1);
}

const backendKeys = Object.keys(backendRoles).sort();
const frontendKeys = Object.keys(frontendRoles).sort();

let hasError = false;

if (JSON.stringify(backendKeys) !== JSON.stringify(frontendKeys)) {
  console.error("ROLES keys mismatch!");
  console.error("  Backend:", backendKeys);
  console.error("  Frontend:", frontendKeys);
  hasError = true;
}

for (const key of backendKeys) {
  if (frontendRoles[key] !== undefined && frontendRoles[key] !== backendRoles[key]) {
    console.error(`ROLES.${key} value mismatch: backend=${backendRoles[key]}, frontend=${frontendRoles[key]}`);
    hasError = true;
  }
}

if (hasError) {
  process.exit(1);
}

console.log("ROLES are in sync.");
console.log("  Keys:", backendKeys.join(", "));
console.log("  Values:", backendKeys.map((k) => `${k}=${backendRoles[k]}`).join(", "));
