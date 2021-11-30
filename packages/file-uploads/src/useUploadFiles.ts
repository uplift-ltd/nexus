import { useCallback, useEffect, useMemo, useReducer } from "react";
import { fileUploadsReducer, getInitialFileUploadsState } from "./fileUploadsReducer";
import { S3FileAttachment, UploadFilesOptions } from "./types";
import { useUploadFile, UseUploadFileOptions } from "./useUploadFile";

export interface UseUploadFilesOptions<FileType = File, UploadType = FileType> {
  fileAttachments?: S3FileAttachment[];
  mapFileUpload?: (file: FileType) => UploadType;
}

export function useUploadFiles<FileType = File>({
  fileAttachments,
  mapFileUpload,
}: UseUploadFilesOptions<FileType> = {}) {
  const [fileUploadsState, fileUploadsDispatch] = useReducer(
    fileUploadsReducer,
    getInitialFileUploadsState(fileAttachments)
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

    return { mapFileUpload, onProgress, onLoading, onComplete, onError };
  }, [mapFileUpload]);

  useEffect(() => {
    fileAttachments?.forEach((fileAttachment) => {
      if (fileUploadsState.fileAttachmentsById[fileAttachment.id] !== fileAttachment) {
        fileUploadsDispatch({
          type: "SET_DATA",
          fileAttachmentId: fileAttachment.id,
          data: fileAttachment,
        });
      }
    });
  }, [fileUploadsState, fileAttachments]);

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
