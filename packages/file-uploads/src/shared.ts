import { S3_UPLOAD_URL } from "@uplift-ltd/constants";
import mime from "mime";

export function getFileNameComponents(filename: string) {
  const extensionIdx = filename.lastIndexOf(".");

  return [filename.substr(0, extensionIdx), filename.substr(extensionIdx + 1).toLowerCase()];
}

export interface FileAttachment {
  id: string;
  key: string;
  name: string;
}

export interface SignedRequest {
  url: string;
  uploadUrl: string;
  fileType: string;
  fileAttachment: FileAttachment;
}

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

          resolve({
            uploadUrl: response.data.response.signature.uploadUrl,
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
