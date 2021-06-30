import axios from "axios";
import * as FileSystem from "expo-file-system";

import { SignedRequest } from "./shared";

export interface UploadFileOptions {
  onProgress?: (progress: number) => void;
  onUploadStatusChange?: (uploading: boolean) => void;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export const uploadFile = async (
  signedRequest: SignedRequest,
  uri: string,
  filename: string,
  callbacks?: UploadFileOptions
) => {
  const config = {
    onUploadProgress(progressEvent: ProgressEvent) {
      const { loaded, total } = progressEvent;
      callbacks?.onProgress?.(Math.ceil((loaded / total) * 100));
      callbacks?.onUploadStatusChange?.(true);
    },
  };

  const fileData = FileSystem.readAsStringAsync(uri);

  return axios
    .put(signedRequest.uploadUrl, fileData, config)
    .then((data) => {
      callbacks?.onProgress?.(0);
      callbacks?.onSuccess?.();
      return data;
    })
    .catch((err) => {
      callbacks?.onError?.(err);
      throw err;
    })
    .finally(() => callbacks?.onUploadStatusChange?.(false));
};
