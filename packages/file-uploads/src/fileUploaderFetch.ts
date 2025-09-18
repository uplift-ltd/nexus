import { FileUploader } from "./fileUploader.js";

export function getFetchFileUploader<
  TFile = unknown,
  TFileUploaderProps extends {
    file: TFile;
    headers?: HeadersInit;
    uploadUrl: string;
  } = { file: TFile; headers?: HeadersInit; uploadUrl: string },
  TFileUploaderReturn extends Response = Response,
>(): FileUploader<TFile, TFileUploaderProps, TFileUploaderReturn> {
  const fetchFileUploader: FileUploader<TFile, TFileUploaderProps, TFileUploaderReturn> = async (
    props,
    { onProgress }
  ) => {
    const { file, headers, uploadUrl } = props;

    const res = await fetch(uploadUrl, {
      body: file as unknown as Blob | FormData | string,
      headers,
      method: "PUT",
    });

    const progress = 100;

    onProgress?.(progress, props);

    return res as TFileUploaderReturn;
  };

  return fetchFileUploader;
}
