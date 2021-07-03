import keyBy from "lodash/keyBy";
import mapValues from "lodash/mapValues";
import { useState, useEffect } from "react";

import { RequestWithFile, uploadFile, FileAttachment } from "./helpers";
import { getSignedRequest, SignedRequest as SignedRequestResponse } from "./shared";

type FileProgressMap = Record<string, number | string>;

export interface FileInterface {
  name: string;
}

type FileMetadataMap = Record<string, { file: FileInterface }>;

interface FileUploadsHookProps {
  objectId: string;
  appLabel: string;
  token?: string;
  onChange: (fileIds: string[]) => void;
  value?: FileAttachment[];
}

export interface UploadedFileDetails {
  id: string;
  progressOrError: number | string;
  meta: FileInterface;
}

export interface FileUploadsHookValues {
  handleFilesAdded: (addedFiles: File[]) => void;
  onRequestRemove: (fileId: string) => void;
  files: UploadedFileDetails[];
  isUploading: boolean;
  reset: () => void;
}

export const useFileUpload = ({
  onChange,
  value,
  objectId,
  appLabel,
  token,
}: FileUploadsHookProps): FileUploadsHookValues => {
  const [fileProgress, setFileProgress] = useState<FileProgressMap>(() => {
    return value
      ? value.reduce(
          (acc, { id }) => ({
            ...acc,
            [id]: 100,
          }),
          {} as FileProgressMap
        )
      : {};
  });
  const [fileMetadata, setFileMetadata] = useState<FileMetadataMap>(() => {
    return (
      mapValues(
        keyBy(value, ({ id }) => id),
        (v) => ({ file: v })
      ) || {}
    );
  });

  useEffect(() => {
    const fileIds = Object.entries(fileProgress)
      .filter(([id, progress]) => progress >= 100)
      .map(([id]) => id);

    onChange(fileIds);
  }, [onChange, fileProgress]);

  function addFile(data: RequestWithFile) {
    const { file, fileAttachment } = data;

    setFileMetadata((prev) => ({
      ...prev,
      [fileAttachment.id]: {
        ...prev[fileAttachment.id],
        file,
      },
    }));

    return data;
  }

  function updateProgress(fileId: string, progress: number) {
    setFileProgress((state) => ({
      ...state,
      [fileId]: progress,
    }));
  }

  function onError(fileId: string, error: Error) {
    setFileProgress((state) => ({
      ...state,
      [fileId]: error.toString(),
    }));
  }

  function onComplete(fileId: string, uploadResult: SignedRequestResponse) {
    setFileProgress((state) => ({
      ...state,
      [fileId]: 100,
    }));

    setFileMetadata((prev) => ({
      ...prev,
      [fileId]: {
        ...prev[fileId],
        url: `${uploadResult.url}${uploadResult.fileAttachment.key}`,
      },
    }));
  }

  function onRequestRemove(fileId: string) {
    setFileProgress((state) => {
      const { [fileId]: _, ...newFiles } = state;
      return newFiles;
    });
  }

  function handleFilesAdded(addedFiles: File[]) {
    addedFiles.forEach((file) => {
      // get s3 signed upload data
      getSignedRequest(objectId, file.name, appLabel, token)
        // store file metadata
        .then((res) => addFile({ ...res, file }))
        // upload file to s3
        .then((result) => {
          const fileId = result.fileAttachment.id;
          uploadFile(
            result,
            updateProgress.bind(null, fileId),
            onComplete.bind(null, fileId, result),
            onError.bind(null, fileId)
          );
        });
    });
  }

  return {
    handleFilesAdded,
    onRequestRemove,
    files: Object.entries(fileProgress).map(
      ([id, progressOrError]) =>
        ({
          id,
          progressOrError,
          meta: fileMetadata[id].file,
        } as UploadedFileDetails)
    ),
    // TODO: More robust completeness state tracking - a file could hit 100% before actually
    // being complete due to rounding
    isUploading: !!Object.values(fileProgress).find(
      (progressOrError) => typeof progressOrError === "number" && Number(progressOrError) < 100
    ),
    reset: () => {
      setFileProgress({});
      setFileMetadata({});
    },
  };
};
