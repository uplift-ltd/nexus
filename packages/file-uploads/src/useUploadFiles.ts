import { useCallback, useEffect, useMemo, useReducer } from "react";
import { FileUploader } from "./fileUploaders.js";
import { fileUploadsReducer, getInitialFileUploadsState } from "./fileUploadsReducer.js";
import { S3FileAttachment, UploadFileOptions, UploadFilesOptions } from "./types.js";
import { UseUploadFileOptions, useUploadFile } from "./useUploadFile.js";

export interface UseUploadFilesOptions<
  FileType = File,
  UploadResultData = unknown,
  UploadType = FileType
> {
  fileAttachments?: S3FileAttachment[];
  fileUploader?: FileUploader<UploadType, UploadResultData>;
  mapFileUpload?: (options: UploadFileOptions<FileType>) => UploadFileOptions<UploadType>;
  signedRequestOptions?: UseUploadFileOptions["signedRequestOptions"];
}

const defaultMapFileUpload = <FileType = File, UploadType = FileType>(
  options: UploadFileOptions<FileType>
) => options as unknown as UploadType;

export function useUploadFiles<FileType = File, UploadResultData = unknown, UploadType = FileType>({
  fileAttachments,
  fileUploader,
  mapFileUpload = defaultMapFileUpload,
  signedRequestOptions,
}: UseUploadFilesOptions<FileType, UploadResultData, UploadType> = {}) {
  const [fileUploadsState, fileUploadsDispatch] = useReducer(
    fileUploadsReducer,
    getInitialFileUploadsState(fileAttachments)
  );

  const uploadFileOptions = useMemo(() => {
    const onProgress: UseUploadFileOptions["onProgress"] = (progress, fileAttachment) => {
      fileUploadsDispatch({
        fileAttachmentId: fileAttachment.id,
        progress,
        type: "SET_PROGRESS",
      });
    };

    const onLoading: UseUploadFileOptions["onLoading"] = (loading, fileAttachment) => {
      fileUploadsDispatch({
        fileAttachmentId: fileAttachment.id,
        loading,
        type: "SET_LOADING",
      });
    };

    const onComplete: UseUploadFileOptions["onComplete"] = (fileAttachment) => {
      fileUploadsDispatch({
        data: fileAttachment,
        fileAttachmentId: fileAttachment.id,
        type: "SET_DATA",
      });
      fileUploadsDispatch({
        fileAttachmentId: fileAttachment.id,
        progress: 100,
        type: "SET_PROGRESS",
      });
    };

    const onError: UseUploadFileOptions["onError"] = (error, fileAttachment) => {
      fileUploadsDispatch({
        error,
        fileAttachmentId: fileAttachment.id,
        type: "SET_ERROR",
      });
    };

    return {
      fileUploader,
      onComplete,
      onError,
      onLoading,
      onProgress,
    };
  }, [fileUploader]);

  useEffect(() => {
    fileAttachments?.forEach((fileAttachment) => {
      if (fileUploadsState.fileAttachmentsById[fileAttachment.id] !== fileAttachment) {
        fileUploadsDispatch({
          data: fileAttachment,
          fileAttachmentId: fileAttachment.id,
          type: "SET_DATA",
        });
      }
    });
    fileUploadsState.fileAttachments.forEach((fileAttachment) => {
      if (!fileAttachments?.includes(fileAttachment)) {
        fileUploadsDispatch({
          fileAttachmentId: fileAttachment.id,
          type: "REMOVE_FILE",
        });
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fileAttachments]);

  const { uploadFile } = useUploadFile<UploadType, UploadResultData>({
    ...uploadFileOptions,
    signedRequestOptions,
  });

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
      fileAttachmentId,
      type: "REMOVE_FILE",
    });
  }, []);

  return {
    onRequestRemove,
    uploadFiles,
    ...fileUploadsState,
  };
}
