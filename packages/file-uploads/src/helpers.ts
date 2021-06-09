import { S3_UPLOAD_URL } from "@uplift-ltd/constants";
import axios from "axios";

import { Fields } from "./shared";

export interface FileAttachment {
  id: string;
  key: string;
  name: string;
}

export interface SignedRequestResponse {
  fields: Fields;
  url: string;
  headers?: Headers;
  file: File;
  fileAttachment: FileAttachment;
}

interface ResponseDataType {
  data: Record<string, unknown>;
}

export function uploadFile(
  result: SignedRequestResponse,
  onProgress: (progress: number) => void,
  onComplete: (id: string) => void,
  onError: (err: Error) => void
) {
  const formData = new FormData();

  Object.entries(result.fields).forEach(([field, value]) => {
    formData.append(field, value);
  });
  formData.append("file", result.file);

  axios
    .post(result.url, formData, {
      onUploadProgress: ({ total, loaded }: { total: number; loaded: number }) => {
        onProgress(Math.ceil((loaded / total) * 100));
      },
    })
    .then(({ data: response }: ResponseDataType) => {
      onComplete(result.fileAttachment.id);
    })
    .catch(onError);
}

export function getSignedRequest(objectId: string, appLabel: string, file: File, token?: string) {
  return new Promise<SignedRequestResponse>((resolve, reject) => {
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
            file,
            fileAttachment: response.data.fileAttachment,
          });
        } else {
          reject(xhr.responseText);
        }
      }
    };

    const params = `file_name=${file.name}&file_type=${file.type}&graphene_id=${objectId}&app_label=${appLabel}`;
    xhr.send(params);
  });
}
