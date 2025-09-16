import { FileUploaderOptions } from "./types.js";

export type FileUploaderProvidedProps<
  TFile = File,
  TFileUploaderProps = FileUploaderOptions<TFile>,
> = {
  onProgress: (progress: number, props: TFileUploaderProps) => void;
};

export type FileUploader<
  TFile = File,
  TFileUploaderProps = FileUploaderOptions<TFile>,
  TFileUploaderReturn = unknown,
> = (
  props: TFileUploaderProps,
  providedProps: FileUploaderProvidedProps<TFile, TFileUploaderProps>
) => Promise<TFileUploaderReturn>;
