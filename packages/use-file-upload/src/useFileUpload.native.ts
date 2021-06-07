import { useState, useCallback } from "react";

import {
  getSignedRequest,
  SignedRequest,
  UploadFileOptions,
  uploadFile as uploadFileToS3,
} from "./helpers.native";

type UseUploadFileOptions = UploadFileOptions & {
  objectId: string;
  token: string;
  appLabel: string;
  name: string;
  url: string;
  metadata?: {
    aspectRatio: number;
    height: number;
    width: number;
  };
};

export enum UploadStatus {
  IDLE = "idle",
  UPLOADING = "uploading",
  SUCCESS = "success",
  ERROR = "error",
}

type UploadFileData = SignedRequest | null;
type UploadFileError = Error | null;
type UploadFileUploading = boolean;
type UploadFileProgress = number;
type UploadFileStatus = UploadStatus;

type UseUploadFileReturn = [
  (options: UseUploadFileOptions) => Promise<SignedRequest>,
  {
    data: UploadFileData;
    status: UploadFileStatus;
    uploading: UploadFileUploading;
    error: UploadFileError;
    progress: UploadFileProgress;
  }
];

export default function useUploadFile(): UseUploadFileReturn {
  // TODO: make this useReducer
  const [data, setData] = useState<UploadFileData>(null);
  const [status, setStatus] = useState<UploadFileStatus>(UploadStatus.IDLE);
  const [progress, setProgress] = useState<UploadFileProgress>(0);
  const [error, setError] = useState<UploadFileError>(null);

  const uploadFile = useCallback(
    async ({
      objectId,
      appLabel,
      token,
      name,
      url,
      metadata,
      onProgress,
      onUploadStatusChange,
      onError,
    }: UseUploadFileOptions) => {
      setStatus(UploadStatus.UPLOADING);
      setData(null);
      setProgress(0);
      setError(null);

      try {
        const signedRequest = await getSignedRequest(objectId, name, token, appLabel, metadata);
        await uploadFileToS3(signedRequest, url, name, {
          onProgress: (p: number) => {
            setProgress(p);
            onProgress?.(p);
          },
          onSuccess: () => {
            setStatus(UploadStatus.SUCCESS);
          },
          onUploadStatusChange,
          onError: (err: Error) => {
            setStatus(UploadStatus.ERROR);
            setError(err);
            onError?.(err);
          },
        });
        setData(signedRequest);
        return signedRequest;
      } catch (err) {
        setStatus(UploadStatus.ERROR);
        setError(err);
        throw err;
      }
    },
    []
  );

  return [
    uploadFile,
    {
      data,
      status,
      uploading: status === UploadStatus.UPLOADING,
      error,
      progress,
    },
  ];
}
