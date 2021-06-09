export function getFileNameComponents(filename: string) {
  const extensionIdx = filename.lastIndexOf(".");

  return [filename.substr(0, extensionIdx), filename.substr(extensionIdx + 1).toLowerCase()];
}

export type Fields = Record<string, string>;
