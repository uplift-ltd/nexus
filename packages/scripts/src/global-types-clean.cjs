#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const filePath = path.resolve("./src/__generated__/globalTypes.ts");

if (fs.existsSync(filePath)) {
  const globalTypes = fs.readFileSync(filePath, { encoding: "utf8" });

  if (globalTypes.includes("export")) {
    console.info("[types-clean] The globalTypes.ts file passes isolatedModules test");
  } else {
    console.info("[types-clean] Removed empty globalTypes.ts");
    fs.unlinkSync(filePath);
  }
} else {
  console.info(`[types-clean] No globalTypes.ts file detected at ${filePath}`);
}
