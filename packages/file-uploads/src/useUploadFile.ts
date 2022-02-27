import { ensureError } from "@uplift-ltd/ts-helpers";
import { useCallback, useReducer } from "react";
import { fileUploadReducer, initialFileUploadState } from "./fileUploadReducer";
import { FileUploader, getAxiosFileUploader } from "./fileUploaders";
import { getFileNameComponents, getFileType } from "./helpers";
import { S3FileAttachment, UploadFileOptions } from "./types";
import { useGetSignedRequest, UseGetSignedRequestOptions } from "./useGetSignedRequest";

export interface UseUploadFileOptions<FileType = File, UploadResultData = unknown> {
  fileUploader?: FileUploader<FileType, UploadResultData>;
  signedRequestOptions?: UseGetSignedRequestOptions;
  onProgress?: (progress: number, fileAttachment: S3FileAttachment) => void;
  onLoading?: (loading: boolean, fileAttachment: S3FileAttachment) => void;
  onComplete?: (fileAttachment: S3FileAttachment) => void;
  onError?: (error: Error, fileAttachment: S3FileAttachment) => void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const defaultFileUploader = getAxiosFileUploader<any, any>();

export function useUploadFile<FileType = File, UploadResultData = unknown>({
  fileUploader = defaultFileUploader,
  onProgress,
  onLoading,
  onComplete,
  onError,
  signedRequestOptions,
}: UseUploadFileOptions<FileType, UploadResultData> = {}) {
  const [getSignedRequest, signedRequestState] = useGetSignedRequest(signedRequestOptions);

  const [fileUploadState, fileUploadDispatch] = useReducer(
    fileUploadReducer,
    initialFileUploadState
  );

  const uploadFile = useCallback(
    async ({ file, rawFileName, ...variables }: UploadFileOptions<FileType>) => {
      fileUploadDispatch({ type: "SET_LOADING", loading: true });

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
      onLoading?.(true, fileAttachment);

      let uploadFileData = null;

      try {
        uploadFileData = await fileUploader(signedRequestData.getSignedRequest.uploadUrl, file, {
          fileAttachment,
          fileUploadDispatch,
          onProgress,
        });

        fileUploadDispatch({ type: "SET_DATA", data: uploadFileData });
        fileUploadDispatch({ type: "SET_PROGRESS", progress: 100 });
        onComplete?.(signedRequestData.getSignedRequest.fileAttachment);
      } catch (err) {
        const error = ensureError(err);

        fileUploadDispatch({ type: "SET_ERROR", error });
        onError?.(error, fileAttachment);
      }

      fileUploadDispatch({ type: "SET_LOADING", loading: false });
      onLoading?.(false, fileAttachment);

      return { signedRequestData, uploadFileData };
    },
    [fileUploader, getSignedRequest, onProgress, onLoading, onComplete, onError]
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
