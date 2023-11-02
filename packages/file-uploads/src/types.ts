export interface S3FileAttachment {
  id: string;
  isDraft: boolean;
  key: string;
  metadata: null | string;
  name: string;
  url: string;
}

export interface GetSignedRequestMutationVariables {
  appLabel: string;
  fileName: string;
  fileType: string;
  grapheneId: string;
  isDraft?: boolean;
  metadata?: string;
}

export interface GetSignedRequestMutation {
  getSignedRequest: {
    errors: { field: string; messages: string[] }[];
    fileAttachment: S3FileAttachment;
    message: string;
    success: boolean;
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  metadata?: any;
  rawFileName?: string;
}

export interface UploadFilesOptions<FileType = File>
  extends GetSignedRequestMutationProvidedVariables {
  files: FileType[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  metadata?: any;
}
