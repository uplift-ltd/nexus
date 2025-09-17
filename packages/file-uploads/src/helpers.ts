export function getFileNameComponents(
  filePath: string
): [fileName: string, extension: string, baseName: string] {
  const slashIdx = filePath.lastIndexOf("/");
  const fileNameIdx = slashIdx === -1 ? 0 : slashIdx + 1;
  const extensionIdx = filePath.lastIndexOf(".");

  const baseName = filePath.substr(fileNameIdx, extensionIdx - fileNameIdx);
  const extension = filePath.substr(extensionIdx + 1).toLowerCase();
  const fileName = `${baseName}.${extension}`;

  return [fileName, extension, baseName];
}
