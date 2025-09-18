import { ensureError } from "@uplift-ltd/ts-helpers";
import { useCallback, useReducer } from "react";
import { fileUploadReducer, initialFileUploadState } from "./fileUploadReducer.js";
import { FileUploader } from "./fileUploader.js";
import { getFetchFileUploader } from "./fileUploaderFetch.js";
import { FileUploaderOptions, UploadFileOptions } from "./types.js";

export interface UseUploadFileOptions<
  TFile = File,
  TUploadFileProps = UploadFileOptions<TFile>,
  TFileUploaderProps = FileUploaderOptions<TFile>,
  TFileUploaderReturn = unknown,
> {
  fileUploader: FileUploader<TFile, TFileUploaderProps, TFileUploaderReturn>;
  getFileUploaderProps: (
    props: TUploadFileProps
  ) => Promise<TFileUploaderProps> | TFileUploaderProps;
  onComplete?: (data: TFileUploaderReturn, options: TUploadFileProps) => void;
  onError?: (error: Error, options: TUploadFileProps) => void;
  onLoading?: (loading: boolean, options: TUploadFileProps) => void;
  onProgress?: (progress: number, options: TUploadFileProps) => void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const defaultFileUploader = getFetchFileUploader<any, any, any>();
const defaultGetUploaderData = () => {
  throw new Error("No getUploaderData provided");
};
const defaultOnProgress = () => {
  // noop
};

export function useUploadFile<
  TFile = File,
  TUploadFileProps = UploadFileOptions<TFile>,
  TFileUploaderProps = FileUploaderOptions<TFile>,
  TFileUploaderReturn = unknown,
>(
  {
    fileUploader,
    getFileUploaderProps,
    onComplete,
    onError,
    onLoading,
    onProgress = defaultOnProgress,
  }: UseUploadFileOptions<TFile, TUploadFileProps, TFileUploaderProps, TFileUploaderReturn> = {
    fileUploader: defaultFileUploader,
    getFileUploaderProps: defaultGetUploaderData,
  }
) {
  const [fileUploadState, fileUploadDispatch] = useReducer(
    fileUploadReducer,
    initialFileUploadState
  );

  const uploadFile = useCallback(
    async (
      file: TUploadFileProps
    ): Promise<{
      file: TUploadFileProps;
      fileUploaderData: TFileUploaderReturn | null;
      fileUploaderProps: TFileUploaderProps | null;
    }> => {
      fileUploadDispatch({ loading: true, type: "SET_LOADING" });

      onLoading?.(true, file);

      let fileUploaderProps = null;
      let fileUploaderData = null;

      try {
        fileUploaderProps = await getFileUploaderProps(file);
        fileUploaderData = await fileUploader(fileUploaderProps, {
          onProgress: (progress) => {
            fileUploadDispatch({ progress: progress, type: "SET_PROGRESS" });
            onProgress?.(progress, file);
          },
        });

        fileUploadDispatch({ data: fileUploaderData, type: "SET_DATA" });
        fileUploadDispatch({ progress: 100, type: "SET_PROGRESS" });
        onComplete?.(fileUploaderData, file);
      } catch (err) {
        const error = ensureError(err);

        fileUploadDispatch({ error, type: "SET_ERROR" });
        onError?.(error, file);
      }

      fileUploadDispatch({ loading: false, type: "SET_LOADING" });
      onLoading?.(false, file);

      return { file, fileUploaderData, fileUploaderProps };
    },
    [fileUploader, getFileUploaderProps, onProgress, onLoading, onComplete, onError]
  );

  const reset = useCallback(() => {
    fileUploadDispatch({ type: "RESET" });
  }, []);

  return {
    ...fileUploadState,
    data: fileUploadState.data as TFileUploaderReturn | null,
    reset,
    uploadFile,
  };
}
