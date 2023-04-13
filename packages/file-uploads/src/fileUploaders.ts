import { FileUploadAction } from "./fileUploadReducer.js";
import { S3FileAttachment } from "./types.js";

export type FileUploaderOptions = {
  fileAttachment: S3FileAttachment;
  fileUploadDispatch: (value: FileUploadAction) => void;
  onProgress?: (progress: number, fileAttachment: S3FileAttachment) => void;
};

export type FileUploader<FileType = File, UploadResultData = unknown> = (
  uploadUrl: string,
  file: FileType,
  fileContentType: string,
  options: FileUploaderOptions
) => Promise<UploadResultData>;

export function getAxiosFileUploader<FileType, UploadResultData = unknown>(): FileUploader<
  FileType,
  UploadResultData
> {
  const axiosFileUploader: FileUploader<FileType, UploadResultData> = async (
    uploadUrl,
    file,
    fileContentType,
    { fileAttachment, fileUploadDispatch, onProgress }
  ) => {
    const axios = (await import("axios")).default;

    const { data } = await axios.put(uploadUrl, file, {
      headers: {
        "Content-Type": fileContentType,
      },
      onUploadProgress: ({ total, loaded }: { total: number; loaded: number }) => {
        const progress = Math.ceil((loaded / total) * 100);
        fileUploadDispatch?.({ type: "SET_PROGRESS", progress });
        onProgress?.(progress, fileAttachment);
      },
    });

    return data;
  };

  return axiosFileUploader;
}

export function getFetchFileUploader<FileType, UploadResultData = unknown>(): FileUploader<
  FileType,
  UploadResultData
> {
  const fetchFileUploader: FileUploader<FileType, UploadResultData> = async (
    uploadUrl,
    file,
    fileContentType,
    { fileAttachment, fileUploadDispatch, onProgress }
  ) => {
    const res = await fetch(uploadUrl, {
      method: "PUT",
      body: file as unknown as string | Blob | FormData,
      headers: { "Content-Type": fileContentType },
    });

    const progress = 100;

    fileUploadDispatch?.({ type: "SET_PROGRESS", progress });
    onProgress?.(progress, fileAttachment);

    const data = await res.json();

    return data;
  };

  return fetchFileUploader;
}
