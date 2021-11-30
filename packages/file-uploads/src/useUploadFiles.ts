import { useCallback, useEffect, useMemo, useReducer } from "react";
import { FileUploader } from "./fileUploaders";
import { fileUploadsReducer, getInitialFileUploadsState } from "./fileUploadsReducer";
import { S3FileAttachment, UploadFileOptions, UploadFilesOptions } from "./types";
import { useUploadFile, UseUploadFileOptions } from "./useUploadFile";

export interface UseUploadFilesOptions<
  FileType = File,
  UploadResultData = unknown,
  UploadType = FileType
> {
  fileAttachments?: S3FileAttachment[];
  fileUploader?: FileUploader<UploadType, UploadResultData>;
  mapFileUpload?: (options: UploadFileOptions<FileType>) => UploadFileOptions<UploadType>;
}

const defaultMapFileUpload = <FileType = File, UploadType = FileType>(
  options: UploadFileOptions<FileType>
) => (options as unknown) as UploadType;

export function useUploadFiles<FileType = File, UploadResultData = unknown, UploadType = FileType>({
  fileAttachments,
  fileUploader,
  mapFileUpload = defaultMapFileUpload,
}: UseUploadFilesOptions<FileType, UploadResultData, UploadType> = {}) {
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

    return { fileUploader, onProgress, onLoading, onComplete, onError };
  }, [fileUploader]);

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

  const { uploadFile } = useUploadFile<UploadType>(uploadFileOptions);

  const uploadFiles = useCallback(
    async ({ files, ...variables }: UploadFilesOptions<FileType>) => {
      return Promise.all(
        files.map((file) => {
          return uploadFile(mapFileUpload({ file, ...variables }));
        })
      );
    },
    [uploadFile, mapFileUpload]
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
