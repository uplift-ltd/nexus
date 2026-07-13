#!/usr/bin/env node

import { Command } from "commander";
import { execa } from "execa";
import fs from "fs/promises";

import { getAppId, getAppspecName, loadConfig } from "./config.js";
import { buildFormatArgv, formatSkipMessage, resolveFormatCommand } from "./formatter.js";

const program = new Command();

program.version("1.0.0");

/**
 * Format the downloaded appspec in-place. Never throws: a missing or failing
 * formatter logs a warning and leaves the (already-written) file unformatted,
 * so `appspec:get` still succeeds.
 */
async function formatAppspec(
  projectDir: string,
  configFormat: string | undefined,
  appspecName: string
) {
  const resolved = resolveFormatCommand(projectDir, configFormat);

  if ("skip" in resolved) {
    console.info(formatSkipMessage(resolved.skip, appspecName));
    return;
  }

  const [cmd, args] = buildFormatArgv(resolved.command, appspecName);

  try {
    const res = await execa(cmd, args, { preferLocal: true });
    console.info(res.stdout || `Wrote ${appspecName}`);
  } catch (err) {
    const message =
      err && typeof err === "object" && "shortMessage" in err
        ? (err as { shortMessage: string }).shortMessage
        : String(err);
    console.warn(`⚠ Formatter "${cmd}" failed: ${message}. Wrote ${appspecName} unformatted.`);
  }
}

program
  .command("appspec:get")
  .requiredOption("-e, --env <env>", "environment (key from package.json)")
  .action(async (options) => {
    try {
      const { config, root } = await loadConfig();
      const APP_ID = getAppId(config, options.env);
      const appspecName = getAppspecName(options.env);

      const appspec = await execa("doctl", [
        "apps",
        "spec",
        "get",
        APP_ID,
        "--context",
        config.context,
      ]);

      await fs.writeFile(appspecName, appspec.stdout, "utf-8");

      await formatAppspec(root, config.formatCmd, appspecName);
    } catch (err) {
      console.error(err);
      process.exitCode = 1;
    }
  });

program
  .command("appspec:update")
  .requiredOption("-e, --env <env>", "environment (key from package.json)")
  .action(async (options) => {
    try {
      const { config } = await loadConfig();
      const APP_ID = getAppId(config, options.env);
      const appspecName = getAppspecName(options.env);

      const appspec = await execa("doctl", [
        "apps",
        "update",
        APP_ID,
        "--spec",
        appspecName,
        "--context",
        config.context,
      ]);

      if (appspec.stdout) {
        console.info(appspec.stdout);
      } else {
        console.info(`Updated appspec for ${APP_ID}`);
      }
    } catch (err) {
      console.error(err);
      process.exitCode = 1;
    }
  });

program
  .command("create-deployment")
  .requiredOption("-e, --env <env>", "environment (key from package.json)")
  .action(async (options) => {
    try {
      const { config } = await loadConfig();
      const APP_ID = getAppId(config, options.env);

      const appspec = await execa("doctl", [
        "apps",
        "create-deployment",
        APP_ID,
        "--context",
        config.context,
      ]);

      if (appspec.stdout) {
        console.info(appspec.stdout);
      } else {
        console.info(`Created deployment for ${APP_ID}`);
      }
    } catch (err) {
      console.error(err);
      process.exitCode = 1;
    }
  });

program.parse(process.argv);

export default program;
