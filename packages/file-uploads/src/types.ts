export interface S3FileAttachment {
  id: string;
  key: string;
  name: string;
  url: string;
  isDraft: boolean;
  metadata: string | null;
}

export interface GetSignedRequestMutationVariables {
  grapheneId: string;
  appLabel: string;
  fileName: string;
  fileType: string;
  isDraft?: boolean;
  metadata?: string;
}

export interface GetSignedRequestMutation {
  getSignedRequest: {
    success: boolean;
    message: string;
    errors: { field: string; messages: string[] }[];
    fileAttachment: S3FileAttachment;
    uploadUrl: string;
  };
}

export type GetSignedRequestMutationProvidedVariables = Omit<
  GetSignedRequestMutationVariables,
  "fileName" | "fileType"
> & {
  fileName?: string;
  fileType?: string;
};

export interface UploadFileOptions<FileType = File>
  extends GetSignedRequestMutationProvidedVariables {
  file: FileType;
  rawFileName?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  metadata?: any;
}

export interface UploadFilesOptions<FileType = File>
  extends GetSignedRequestMutationProvidedVariables {
  files: FileType[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  metadata?: any;
}
