export interface FileUpload {
  file: string;
}

export interface FileUploaderOptions<FileType = FileUpload["file"]> {
  file: FileType;
}

export interface UploadFileOptions<FileType = FileUpload["file"]> {
  file: FileType;
}

export interface UploadFilesOptions<FileType = FileUpload["file"]> {
  file: FileType;
}
