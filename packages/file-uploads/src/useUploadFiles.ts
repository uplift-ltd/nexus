import { ensureError } from "@uplift-ltd/ts-helpers";
import { useCallback, useReducer } from "react";
import { FileUploader } from "./fileUploader.js";
import { getFetchFileUploader } from "./fileUploaderFetch.js";
import {
  fileUploadsReducer,
  FileUploadsState,
  getInitialFileUploadsState,
} from "./fileUploadsReducer.js";
import { FileUploaderOptions, UploadFilesOptions } from "./types.js";

export interface UseUploadFilesOptions<
  TFile = File,
  TUploadFileProps = UploadFilesOptions<TFile>,
  TFileUploaderProps = FileUploaderOptions<TFile>,
  TFileUploaderReturn = unknown,
> {
  fileUploader: FileUploader<TFile, TFileUploaderProps, TFileUploaderReturn>;
  getFileUploaderProps: (
    props: TUploadFileProps
  ) => Promise<TFileUploaderProps> | TFileUploaderProps;
  onAllComplete?: (data: {
    files: TUploadFileProps[];
    results: Array<{
      file: TUploadFileProps;
      fileUploaderData: TFileUploaderReturn | null;
      fileUploaderProps: TFileUploaderProps | null;
    }>;
  }) => void;
  onFileComplete?: (data: TFileUploaderReturn, options: TUploadFileProps) => void;
  onFileError?: (error: Error, options: TUploadFileProps) => void;
  onFileLoading?: (loading: boolean, options: TUploadFileProps) => void;
  onFileProgress?: (progress: number, options: TUploadFileProps) => void;
}

export type FileUploadsReturn<
  TFile = File,
  TUploadFileProps = UploadFilesOptions<TFile>,
  TFileUploaderProps = FileUploaderOptions<TFile>,
  TFileUploaderReturn = unknown,
> = {
  datas: TFileUploaderReturn[];
  files: TUploadFileProps[];
  removeFile: (file: TUploadFileProps) => void;
  reset: () => void;
  uploadFile: (file: TUploadFileProps) => Promise<{
    file: TUploadFileProps;
    fileUploaderData: TFileUploaderReturn | null;
    fileUploaderProps: TFileUploaderProps | null;
  }>;
  uploadFiles: (files: TUploadFileProps[]) => Promise<{
    files: TUploadFileProps[];
    results: Array<{
      file: TUploadFileProps;
      fileUploaderData: TFileUploaderReturn | null;
      fileUploaderProps: TFileUploaderProps | null;
    }>;
  }>;
} & FileUploadsState<TUploadFileProps, TFileUploaderReturn>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const defaultFileUploader = getFetchFileUploader<any, any, any>();
const defaultGetUploaderData = () => {
  throw new Error("No getUploaderData provided");
};
const defaultOnFileProgress = () => {
  // noop
};

export function useUploadFiles<
  TFile = File,
  TUploadFileProps = UploadFilesOptions<TFile>,
  TFileUploaderProps = FileUploaderOptions<TFile>,
  TFileUploaderReturn = unknown,
>(
  {
    fileUploader,
    getFileUploaderProps,
    onAllComplete,
    onFileComplete,
    onFileError,
    onFileLoading,
    onFileProgress = defaultOnFileProgress,
  }: UseUploadFilesOptions<TFile, TUploadFileProps, TFileUploaderProps, TFileUploaderReturn> = {
    fileUploader: defaultFileUploader,
    getFileUploaderProps: defaultGetUploaderData,
  }
): FileUploadsReturn<TFile, TUploadFileProps, TFileUploaderProps, TFileUploaderReturn> {
  const initialState = getInitialFileUploadsState<TUploadFileProps, TFileUploaderReturn>();
  const [filesUploadsState, filesUploadDispatch] = useReducer(fileUploadsReducer, initialState);

  const reset = useCallback(() => {
    filesUploadDispatch({
      type: "RESET",
    });
  }, []);

  const removeFile = useCallback((file: TUploadFileProps) => {
    filesUploadDispatch({
      file,
      type: "REMOVE_FILE",
    });
  }, []);

  const uploadFile = useCallback(
    async (
      file: TUploadFileProps
    ): Promise<{
      file: TUploadFileProps;
      fileUploaderData: TFileUploaderReturn | null;
      fileUploaderProps: TFileUploaderProps | null;
    }> => {
      filesUploadDispatch({
        file: file,
        type: "REMOVE_FILE",
      });
      filesUploadDispatch({
        file: file,
        type: "ADD_FILE",
      });
      filesUploadDispatch({
        file: file,
        loading: true,
        type: "SET_LOADING",
      });

      let fileUploaderProps = null;
      let fileUploaderData = null;

      try {
        fileUploaderProps = await getFileUploaderProps(file);

        fileUploaderData = await fileUploader(fileUploaderProps, {
          onProgress: (progress) => {
            filesUploadDispatch({
              file: file,
              progress: progress,
              type: "SET_PROGRESS",
            });
            onFileProgress?.(progress, file);
          },
        });

        filesUploadDispatch({
          data: fileUploaderData,
          file: file,
          type: "SET_DATA",
        });
        filesUploadDispatch({
          file: file,
          progress: 100,
          type: "SET_PROGRESS",
        });
        onFileComplete?.(fileUploaderData, file);
      } catch (err) {
        const error = ensureError(err);

        filesUploadDispatch({
          error,
          file: file,
          type: "SET_ERROR",
        });
        onFileError?.(error, file);
      }

      filesUploadDispatch({
        file: file,
        loading: false,
        type: "SET_LOADING",
      });
      onFileLoading?.(false, file);

      return { file, fileUploaderData, fileUploaderProps };
    },
    [fileUploader, getFileUploaderProps, onFileProgress, onFileLoading, onFileComplete, onFileError]
  );

  const uploadFiles = useCallback(
    async (files: TUploadFileProps[]) => {
      const results = await Promise.all(files.map((file) => uploadFile(file)));
      onAllComplete?.({ files, results });
      return { files, results };
    },
    [onAllComplete, uploadFile]
  );

  return {
    ...filesUploadsState,
    datas: filesUploadsState.datas as TFileUploaderReturn[],
    files: filesUploadsState.files as TUploadFileProps[],
    removeFile,
    reset,
    uploadFile,
    uploadFiles,
  };
}
