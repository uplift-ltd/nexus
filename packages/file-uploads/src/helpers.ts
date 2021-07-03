import axios from "axios";

import { SignedRequest } from "./shared";

export interface FileAttachment {
  id: string;
  key: string;
  name: string;
}

export interface RequestWithFile extends SignedRequest {
  file: File;
}

interface ResponseDataType {
  data: Record<string, unknown>;
}

export function uploadFile(
  result: RequestWithFile,
  onProgress: (progress: number) => void,
  onComplete: (id: string) => void,
  onError: (err: Error) => void
) {
  axios
    .put(result.uploadUrl, result.file, {
      onUploadProgress: ({ total, loaded }: { total: number; loaded: number }) => {
        onProgress(Math.ceil((loaded / total) * 100));
      },
    })
    .then(({ data: response }: ResponseDataType) => {
      onComplete(result.fileAttachment.id);
    })
    .catch(onError);
}
