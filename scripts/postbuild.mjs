// Marks the CommonJS build output as CommonJS.
// The package root declares "type": "module", so without this file Node would
// interpret dist/cjs/*.js as ES modules.
import { writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

const target = fileURLToPath(new URL("../dist/cjs/package.json", import.meta.url));
mkdirSync(dirname(target), { recursive: true });
writeFileSync(target, JSON.stringify({ type: "commonjs" }, null, 2) + "\n");
console.log("postbuild: wrote dist/cjs/package.json");
