import { useCallback, useReducer } from "react";
import { fileUploadReducer, initialFileUploadState } from "./fileUploadReducer";
import { FileUploader, getAxiosFileUploader } from "./fileUploaders";
import { getFileNameComponents, getFileType } from "./helpers";
import { S3FileAttachment, UploadFileOptions } from "./types";
import { useGetSignedRequest } from "./useGetSignedRequest";

export interface UseUploadFileOptions<
  FileType = File,
  UploadResultData = unknown,
  UploadType = FileType
> {
  fileUploader?: FileUploader<UploadType, UploadResultData>;
  mapFileUpload?: (file: FileType) => UploadType;
  onProgress?: (progress: number, fileAttachment: S3FileAttachment) => void;
  onLoading?: (loading: boolean, fileAttachment: S3FileAttachment) => void;
  onComplete?: (fileAttachment: S3FileAttachment) => void;
  onError?: (error: Error, fileAttachment: S3FileAttachment) => void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const defaultFileUploader = getAxiosFileUploader<any, any>();

export function useUploadFile<FileType = File, UploadResultData = unknown, UploadType = FileType>({
  fileUploader = defaultFileUploader,
  mapFileUpload,
  onProgress,
  onLoading,
  onComplete,
  onError,
}: UseUploadFileOptions<FileType, UploadResultData, UploadType> = {}) {
  const [getSignedRequest, signedRequestState] = useGetSignedRequest();

  const [fileUploadState, fileUploadDispatch] = useReducer(
    fileUploadReducer,
    initialFileUploadState
  );

  const uploadFile = useCallback(
    async ({ file, ...variables }: UploadFileOptions<FileType>) => {
      let fileName = "";
      if (variables.fileName) {
        fileName = variables.fileName;
      } else if (typeof file === "string") {
        fileName = file;
      } else if (file instanceof File) {
        fileName = file.name;
      } else if (Object.prototype.hasOwnProperty.call(file || {}, "name")) {
        fileName = ((file as unknown) as File).name;
      } else {
        throw new Error("Unable to get file name");
      }

      const [processedFileName, extension] = getFileNameComponents(fileName);
      const fileType = variables.fileType || (await getFileType(extension));

      const { data: signedRequestData } = await getSignedRequest({
        variables: {
          ...variables,
          fileName: variables.fileName || processedFileName,
          fileType,
          metadata: variables.metadata && JSON.stringify(variables.metadata),
        },
      });

      if (!signedRequestData?.getSignedRequest?.uploadUrl) {
        throw new Error("No uploadUrl returned");
      }

      const { fileAttachment } = signedRequestData.getSignedRequest;

      // This is here mainly to support the useUploadFiles hook
      onLoading?.(false, fileAttachment);

      let uploadFileData = null;

      try {
        uploadFileData = await fileUploader(
          signedRequestData.getSignedRequest.uploadUrl,
          (mapFileUpload?.(file) || file) as UploadType,
          {
            fileAttachment,
            fileUploadDispatch,
            onProgress,
          }
        );

        fileUploadDispatch({ type: "SET_DATA", data: uploadFileData });
        fileUploadDispatch({ type: "SET_PROGRESS", progress: 100 });
        onComplete?.(signedRequestData.getSignedRequest.fileAttachment);
      } catch (err) {
        fileUploadDispatch({ type: "SET_ERROR", error: err });
        onError?.(err, fileAttachment);
      }

      fileUploadDispatch({ type: "SET_LOADING", loading: false });
      onLoading?.(false, fileAttachment);

      return { signedRequestData, uploadFileData };
    },
    [fileUploader, mapFileUpload, getSignedRequest, onProgress, onLoading, onComplete, onError]
  );

  const loading = signedRequestState.loading || fileUploadState.loading;

  return {
    uploadFile,
    fileAttachment:
      signedRequestState.data && !loading
        ? signedRequestState.data.getSignedRequest.fileAttachment
        : null,
    loading,
    progress: fileUploadState.progress,
  };
}
