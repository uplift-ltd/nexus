import readPackageUp from "read-pkg-up";
import { SammyConfig } from "./types";

export async function loadConfig(): Promise<SammyConfig> {
  const pkg = await readPackageUp();

  if (!pkg) {
    throw new Error("Could not find package.json");
  }

  const config = pkg.packageJson.sammy;

  if (!config) {
    throw new Error(`Could not find config in ${pkg.path}`);
  }

  return config;
}

export function getAppId(config: SammyConfig, env: string) {
  const APP_ID = config.apps[env];
  if (!APP_ID) {
    throw new Error(
      `Could not find App ID for environment: ${env}. Available options: ${Object.keys(
        config.apps
      ).join(", ")}`
    );
  }
  return APP_ID;
}

export function getAppspecName(env: string) {
  return `appspec.${env}.yml`;
}
