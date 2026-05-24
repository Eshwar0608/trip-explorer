import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const { wasm } = require(
  "@prisma/client/runtime/query_compiler_bg.postgresql.wasm-base64.js"
);

const outDir = path.join(root, "node_modules", ".prisma", "client");
const outFile = path.join(outDir, "query_compiler_bg.wasm");

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(outFile, Buffer.from(wasm, "base64"));

console.log("Wrote Prisma query compiler WASM to", outFile);
