/* eslint-disable @typescript-eslint/no-var-requires */

const replace = require("replace-in-file");
const { version } = require("./package.json");

const options = {
  files: ["./cjs/nexus.js", "./esm/nexus.js"],
  from: "process.env.NEXUS_PACKAGE_VERSION",
  to: JSON.stringify(version),
};

(async () => {
  try {
    await replace(options);
  } catch (err) {
    console.error(err);
  }
})();
