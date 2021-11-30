export function getFileNameComponents(fileName: string): [fileName: string, extension: string] {
  const slashIdx = fileName.lastIndexOf("/");
  const fileNameIdx = slashIdx === -1 ? 0 : slashIdx + 1;
  const extensionIdx = fileName.lastIndexOf(".");

  return [
    fileName.substr(fileNameIdx, extensionIdx),
    fileName.substr(extensionIdx + 1).toLowerCase(),
  ];
}

export async function getFileType(extension: string) {
  const mime = await import("mime");
  return mime.getType(extension) || "";
}
