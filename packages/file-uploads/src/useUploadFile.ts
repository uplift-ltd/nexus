import { useCallback, useReducer } from "react";
import { fileUploadReducer, initialFileUploadState } from "./fileUploadReducer";
import { FileUploader, getAxiosFileUploader } from "./fileUploaders";
import { getFileNameComponents, getFileType } from "./helpers";
import { S3FileAttachment, UploadFileOptions } from "./types";
import { useGetSignedRequest } from "./useGetSignedRequest";

export interface UseUploadFileOptions<FileType = File, UploadResultData = unknown> {
  fileUploader?: FileUploader<FileType, UploadResultData>;
  onProgress?: (progress: number, fileAttachment: S3FileAttachment) => void;
  onLoading?: (loading: boolean, fileAttachment: S3FileAttachment) => void;
  onComplete?: (fileAttachment: S3FileAttachment) => void;
  onError?: (error: Error, fileAttachment: S3FileAttachment) => void;
}

const defaultFileUploader = getAxiosFileUploader<unknown, unknown>();

export function useUploadFile<FileType = File, UploadResultData = unknown>({
  fileUploader,
  onProgress,
  onLoading,
  onComplete,
  onError,
}: UseUploadFileOptions<FileType, UploadResultData> = {}) {
  const uploader = fileUploader || defaultFileUploader;
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
        uploadFileData = await uploader(signedRequestData.getSignedRequest.uploadUrl, file, {
          fileAttachment,
          fileUploadDispatch,
          onProgress,
        });

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
    [uploader, getSignedRequest, onProgress, onLoading, onComplete, onError]
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
