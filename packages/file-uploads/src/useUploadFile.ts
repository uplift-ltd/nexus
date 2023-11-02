import { ensureError } from "@uplift-ltd/ts-helpers";
import { useCallback, useReducer } from "react";

import { fileUploadReducer, initialFileUploadState } from "./fileUploadReducer.js";
import { FileUploader, getAxiosFileUploader } from "./fileUploaders.js";
import { getFileNameComponents, getFileType } from "./helpers.js";
import { S3FileAttachment, UploadFileOptions } from "./types.js";
import { UseGetSignedRequestOptions, useGetSignedRequest } from "./useGetSignedRequest.js";

export interface UseUploadFileOptions<FileType = File, UploadResultData = unknown> {
  fileUploader?: FileUploader<FileType, UploadResultData>;
  onComplete?: (fileAttachment: S3FileAttachment) => void;
  onError?: (error: Error, fileAttachment: S3FileAttachment) => void;
  onLoading?: (loading: boolean, fileAttachment: S3FileAttachment) => void;
  onProgress?: (progress: number, fileAttachment: S3FileAttachment) => void;
  signedRequestOptions?: UseGetSignedRequestOptions;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const defaultFileUploader = getAxiosFileUploader<any, any>();

export function useUploadFile<FileType = File, UploadResultData = unknown>({
  fileUploader = defaultFileUploader,
  onComplete,
  onError,
  onLoading,
  onProgress,
  signedRequestOptions,
}: UseUploadFileOptions<FileType, UploadResultData> = {}) {
  const [getSignedRequest, signedRequestState] = useGetSignedRequest(signedRequestOptions);

  const [fileUploadState, fileUploadDispatch] = useReducer(
    fileUploadReducer,
    initialFileUploadState
  );

  const uploadFile = useCallback(
    async ({ file, rawFileName, ...variables }: UploadFileOptions<FileType>) => {
      fileUploadDispatch({ loading: true, type: "SET_LOADING" });

      let fileName = "";
      if (variables.fileName) {
        fileName = variables.fileName;
      } else if (rawFileName) {
        fileName = rawFileName;
      } else if (typeof file === "string") {
        fileName = file;
      } else if (file instanceof File) {
        fileName = file.name;
      } else if (Object.prototype.hasOwnProperty.call(file || {}, "name")) {
        fileName = (file as unknown as File).name;
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
      onLoading?.(true, fileAttachment);

      let uploadFileData = null;

      try {
        uploadFileData = await fileUploader(
          signedRequestData.getSignedRequest.uploadUrl,
          file,
          fileType,
          {
            fileAttachment,
            fileUploadDispatch,
            onProgress,
          }
        );

        fileUploadDispatch({ data: uploadFileData, type: "SET_DATA" });
        fileUploadDispatch({ progress: 100, type: "SET_PROGRESS" });
        onComplete?.(signedRequestData.getSignedRequest.fileAttachment);
      } catch (err) {
        const error = ensureError(err);

        fileUploadDispatch({ error, type: "SET_ERROR" });
        onError?.(error, fileAttachment);
      }

      fileUploadDispatch({ loading: false, type: "SET_LOADING" });
      onLoading?.(false, fileAttachment);

      return { signedRequestData, uploadFileData };
    },
    [fileUploader, getSignedRequest, onProgress, onLoading, onComplete, onError]
  );

  const loading = signedRequestState.loading || fileUploadState.loading;

  return {
    fileAttachment:
      signedRequestState.data && !loading
        ? signedRequestState.data.getSignedRequest.fileAttachment
        : null,
    loading,
    progress: fileUploadState.progress,
    uploadFile,
  };
}
