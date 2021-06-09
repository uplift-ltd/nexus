import { S3_UPLOAD_URL } from "@uplift-ltd/constants";
import axios from "axios";
import mime from "mime";

import { getFileNameComponents, Fields } from "./shared";

export interface SignedRequestFileAttachment {
  id: string;
  key: string;
  name: string;
}

export interface SignedRequest {
  url: string;
  fields: {
    [key: string]: string;
  };
  fileType: string;
  fileAttachment: SignedRequestFileAttachment;
}

interface FormDataValue {
  uri: string;
  name: string;
  type: string;
}

interface FormData {
  append(name: string, value: string | Blob | FormDataValue, fileName?: string): void;
  delete(name: string): void;
  get(name: string): FormDataEntryValue | null;
  getAll(name: string): FormDataEntryValue[];
  has(name: string): boolean;
  set(name: string, value: string | Blob | FormDataValue, fileName?: string): void;
  entries(): IterableIterator<[string, string | File]>;
  keys(): IterableIterator<string>;
  values(): IterableIterator<string | File>;
  [Symbol.iterator](): IterableIterator<string | File>;
}

// eslint-disable-next-line @typescript-eslint/no-redeclare
declare let FormData: {
  prototype: FormData;
  new (form?: HTMLFormElement): FormData;
};

export const getSignedRequest = async <MetadataShape extends Record<string, unknown>>(
  objectId: string,
  filename: string,
  appLabel: string,
  token?: string,
  metadata?: MetadataShape
): Promise<SignedRequest> => {
  return new Promise<SignedRequest>((resolve, reject) => {
    const extension = getFileNameComponents(filename)[1];
    const fileType = mime.getType(extension) || "";

    const urlEncodedFormData = new URLSearchParams();
    urlEncodedFormData.append("file_name", filename);
    urlEncodedFormData.append("file_type", fileType);
    urlEncodedFormData.append("graphene_id", objectId);
    urlEncodedFormData.append("app_label", appLabel);

    if (metadata) {
      urlEncodedFormData.append("metadata", JSON.stringify(metadata));
    }

    const xhr = new XMLHttpRequest();
    xhr.open("POST", S3_UPLOAD_URL);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    if (token) {
      xhr.setRequestHeader("Authorization", `Bearer ${token}`);
    } else {
      xhr.withCredentials = true;
    }

    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          const fields: Fields = {};

          Object.entries(response.data.response.signature.fields).forEach(([field, value]) => {
            fields[field] = value as string;
          });

          resolve({
            fields,
            url: response.data.response.signature.url,
            fileType,
            fileAttachment: response.data.fileAttachment,
          });
        } else {
          reject(xhr.responseText);
        }
      }
    };

    xhr.send(urlEncodedFormData.toString());
  });
};

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
  const formData = new FormData();

  Object.entries(signedRequest.fields).forEach(([field, value]) => {
    formData.append(field, value);
  });

  formData.append("file", {
    uri,
    name: filename,
    type: signedRequest.fileType,
  });

  return axios
    .post(signedRequest.url, formData, config)
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
