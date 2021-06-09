import { useCallback, useReducer } from "react";

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

interface FileState {
  data: UploadFileData;
  status: UploadFileStatus;
  progress: UploadFileProgress;
  error: UploadFileError;
}

type DataAction = {
  type: "SET_DATA";
  data: UploadFileData;
};

type StatusAction = {
  type: "SET_STATUS";
  status: UploadFileStatus;
};

type ProgressAction = {
  type: "SET_PROGRESS";
  progress: UploadFileProgress;
};

type ErrorAction = {
  type: "SET_ERROR";
  error: UploadFileError;
};

interface SetAllAction extends FileState {
  type: "SET_ALL";
}

type FileAction = DataAction | StatusAction | ProgressAction | ErrorAction | SetAllAction;

const reducer = (prevState: FileState, action: FileAction): FileState => {
  switch (action.type) {
    case "SET_DATA":
      return {
        ...prevState,
        data: action.data,
      };
    case "SET_STATUS":
      return {
        ...prevState,
        status: action.status,
      };
    case "SET_PROGRESS":
      return {
        ...prevState,
        progress: action.progress,
      };
    case "SET_ERROR":
      return {
        ...prevState,
        error: action.error,
      };
    case "SET_ALL": {
      const { type, ...newState } = action;
      return newState;
    }
    default:
      return prevState;
  }
};

export default function useUploadFile(): UseUploadFileReturn {
  const [state, dispatch] = useReducer(reducer, {
    data: null,
    status: UploadStatus.IDLE,
    progress: 0,
    error: null,
  });

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
      dispatch({
        type: "SET_ALL",
        data: null,
        status: UploadStatus.UPLOADING,
        progress: 0,
        error: null,
      });

      try {
        const signedRequest = await getSignedRequest(objectId, name, appLabel, token, metadata);
        await uploadFileToS3(signedRequest, url, name, {
          onProgress: (p: number) => {
            dispatch({ type: "SET_PROGRESS", progress: p });
            onProgress?.(p);
          },
          onSuccess: () => {
            dispatch({ type: "SET_STATUS", status: UploadStatus.SUCCESS });
          },
          onUploadStatusChange,
          onError: (err: Error) => {
            dispatch({ type: "SET_STATUS", status: UploadStatus.ERROR });
            dispatch({ type: "SET_ERROR", error: err });
            onError?.(err);
          },
        });
        dispatch({ type: "SET_DATA", data: signedRequest });
        return signedRequest;
      } catch (err) {
        dispatch({ type: "SET_STATUS", status: UploadStatus.ERROR });
        dispatch({ type: "SET_ERROR", error: err });
        throw err;
      }
    },
    []
  );

  return [
    uploadFile,
    {
      uploading: state.status === UploadStatus.UPLOADING,
      ...state,
    },
  ];
}
