import { useCallback, useReducer } from "react";
import { fileUploadReducer, initialFileUploadState } from "./fileUploadReducer";
import { getFileNameComponents, getFileType } from "./helpers";
import { S3FileAttachment, UploadFileOptions } from "./types";
import { useGetSignedRequest } from "./useGetSignedRequest";

export interface UseUploadFileOptions {
  onProgress?: (progress: number, fileAttachment: S3FileAttachment) => void;
  onLoading?: (loading: boolean, fileAttachment: S3FileAttachment) => void;
  onComplete?: (fileAttachment: S3FileAttachment) => void;
  onError?: (error: Error, fileAttachment: S3FileAttachment) => void;
}

export function useUploadFile<FileType = File>({
  onProgress,
  onLoading,
  onComplete,
  onError,
}: UseUploadFileOptions = {}) {
  const [getSignedRequest, signedRequestState] = useGetSignedRequest();

  const [fileUploadState, fileUploadDispatch] = useReducer(
    fileUploadReducer,
    initialFileUploadState
  );

  const uploadFile = useCallback(
    async ({ file, ...variables }: UploadFileOptions<FileType>) => {
      const axios = (await import("axios")).default;

      let fileName = "";
      if (typeof file === "string") {
        fileName = file;
      } else if (file instanceof File) {
        fileName = file.name;
      } else {
        throw new Error("Unable to get file name");
      }
      const [, extension] = getFileNameComponents(fileName);

      const { data: signedRequestData } = await getSignedRequest({
        variables: {
          ...variables,
          fileName: variables.fileName || fileName,
          fileType: variables.fileType || (await getFileType(extension)),
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
        uploadFileData = await axios.put(signedRequestData.getSignedRequest.uploadUrl, file, {
          onUploadProgress: ({ total, loaded }: { total: number; loaded: number }) => {
            const progress = Math.ceil((loaded / total) * 100);
            fileUploadDispatch({ type: "SET_PROGRESS", progress });
            onProgress?.(progress, fileAttachment);
          },
        });

        fileUploadDispatch({ type: "SET_DATA", data: uploadFileData.data });
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
    [getSignedRequest, onProgress, onLoading, onComplete, onError]
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
