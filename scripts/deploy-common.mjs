import { spawnSync } from "node:child_process";
import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, "..");

dotenv.config({ path: path.join(root, ".env") });

function envValue(key) {
  return (process.env[key] || "").trim();
}

export function requireEnv(keys) {
  const missing = keys.filter((key) => {
    const value = envValue(key);
    return value.length === 0;
  });

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
  }
}

export function hasEnv(key) {
  return envValue(key).length > 0;
}

export function getEnv(key, fallback = "") {
  const value = envValue(key);
  return value.length > 0 ? value : fallback;
}

export function runCommandResult(command, args, options = {}) {
  return spawnSync(command, args, {
    stdio: "inherit",
    shell: true,
    cwd: root,
    ...options
  });
}

export function runCommand(command, args, options = {}) {
  const result = runCommandResult(command, args, options);

  if (result.status !== 0) {
    throw new Error(`Command failed: ${command} ${args.join(" ")}`);
  }
}

export function projectPath(relativePath) {
  return path.join(root, relativePath);
}
