/* eslint-disable @typescript-eslint/no-var-requires */

const replace = require("replace-in-file");
const { version } = require("./package.json");

const options = {
  files: ["./cjs/nexus.js", "./esm/nexus.js"],
  from: /program\.version\((.+)\)/,
  to: `program.version(${JSON.stringify(version)})`,
};

(async () => {
  try {
    await replace(options);
  } catch (err) {
    console.error(err);
  }
})();
