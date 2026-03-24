import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendDir = path.resolve(__dirname, "..");
const versionFile = path.resolve(frontendDir, "..", "..", "version.properties");
const packageJsonPath = path.join(frontendDir, "package.json");
const packageLockPath = path.join(frontendDir, "package-lock.json");

function loadProperties(filePath) {
  if (!fs.existsSync(filePath)) {
    return null;
  }
  const data = fs.readFileSync(filePath, "utf8");
  const out = {};
  for (const raw of data.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq < 0) continue;
    const key = line.slice(0, eq).trim();
    const value = line.slice(eq + 1).trim();
    out[key] = value;
  }
  return out;
}

function syncJsonVersion(filePath, versionName, patcher) {
  if (!fs.existsSync(filePath)) {
    return false;
  }
  const original = fs.readFileSync(filePath, "utf8");
  const json = JSON.parse(original);
  patcher(json, versionName);
  const next = `${JSON.stringify(json, null, 2)}\n`;
  if (next === original) {
    return false;
  }
  fs.writeFileSync(filePath, next, "utf8");
  return true;
}

const props = loadProperties(versionFile);
if (!props || !props.version_name) {
  console.log(`[version-sync] skipped; missing ${versionFile}`);
  process.exit(0);
}

const versionName = String(props.version_name).trim();
if (!versionName) {
  console.log("[version-sync] skipped; version_name is empty");
  process.exit(0);
}

const pkgChanged = syncJsonVersion(packageJsonPath, versionName, (json, version) => {
  json.version = version;
});

const lockChanged = syncJsonVersion(packageLockPath, versionName, (json, version) => {
  json.version = version;
  if (json.packages && json.packages[""]) {
    json.packages[""].version = version;
  }
});

console.log(
  `[version-sync] version=${versionName} package.json=${pkgChanged ? "updated" : "ok"} package-lock.json=${lockChanged ? "updated" : "ok"}`
);
