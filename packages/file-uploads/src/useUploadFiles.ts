import { useCallback, useMemo, useReducer } from "react";
import { fileUploadsReducer, getInitialFileUploadsState } from "./fileUploadsReducer";
import { S3FileAttachment, UploadFilesOptions } from "./types";
import { useUploadFile, UseUploadFileOptions } from "./useUploadFile";

export interface UseUploadFilesOptions {
  initialFileAttachments?: S3FileAttachment[];
}

export function useUploadFiles<FileType = File>({
  initialFileAttachments,
}: UseUploadFilesOptions = {}) {
  const [fileUploadsState, fileUploadsDispatch] = useReducer(
    fileUploadsReducer,
    getInitialFileUploadsState(initialFileAttachments)
  );

  const uploadFileOptions = useMemo(() => {
    const onProgress: UseUploadFileOptions["onProgress"] = (progress, fileAttachment) => {
      fileUploadsDispatch({
        type: "SET_PROGRESS",
        fileAttachmentId: fileAttachment.id,
        progress,
      });
    };

    const onLoading: UseUploadFileOptions["onLoading"] = (loading, fileAttachment) => {
      fileUploadsDispatch({
        type: "SET_LOADING",
        fileAttachmentId: fileAttachment.id,
        loading,
      });
    };

    const onComplete: UseUploadFileOptions["onComplete"] = (fileAttachment) => {
      fileUploadsDispatch({
        type: "SET_DATA",
        fileAttachmentId: fileAttachment.id,
        data: fileAttachment,
      });
      fileUploadsDispatch({
        type: "SET_PROGRESS",
        fileAttachmentId: fileAttachment.id,
        progress: 100,
      });
      fileUploadsDispatch({
        type: "SET_LOADING",
        fileAttachmentId: fileAttachment.id,
        loading: false,
      });
    };

    const onError: UseUploadFileOptions["onError"] = (error, fileAttachment) => {
      fileUploadsDispatch({
        type: "SET_ERROR",
        fileAttachmentId: fileAttachment.id,
        error,
      });
    };

    return { onProgress, onLoading, onComplete, onError };
  }, []);

  const { uploadFile } = useUploadFile<FileType>(uploadFileOptions);

  const uploadFiles = useCallback(
    ({ files, ...variables }: UploadFilesOptions<FileType>) => {
      return files.map((file) => {
        return uploadFile({ file, ...variables });
      });
    },
    [uploadFile]
  );

  const onRequestRemove = useCallback((fileAttachmentId: string) => {
    fileUploadsDispatch({
      type: "REMOVE_FILE",
      fileAttachmentId,
    });
  }, []);

  return {
    uploadFiles,
    onRequestRemove,
    ...fileUploadsState,
  };
}