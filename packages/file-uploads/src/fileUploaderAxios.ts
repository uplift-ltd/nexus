import { AxiosRequestConfig } from "axios";
import { FileUploader } from "./fileUploader.js";

type AxiosConfigHeaders = AxiosRequestConfig["headers"];

export function getAxiosFileUploader<
  TFile = unknown,
  TFileUploaderProps extends {
    file: TFile;
    headers?: AxiosConfigHeaders;
    uploadUrl: string;
  } = { file: TFile; headers?: AxiosConfigHeaders; uploadUrl: string },
  TFileUploaderReturn = unknown,
>(): FileUploader<TFile, TFileUploaderProps, TFileUploaderReturn> {
  const axiosFileUploader: FileUploader<TFile, TFileUploaderProps, TFileUploaderReturn> = async (
    props,
    { onProgress }
  ) => {
    const { file, headers, uploadUrl } = props;
    const axios = (await import("axios")).default;

    const { data } = await axios.put(uploadUrl, file, {
      headers: headers,
      onUploadProgress: ({ loaded, total }) => {
        const progress = total ? Math.ceil((loaded / total) * 100) : 0;
        onProgress?.(progress, props);
      },
    });

    return data;
  };

  return axiosFileUploader;
}
