import { S3FileAttachment } from "./types.js";

interface FileSpecificAction {
  fileAttachmentId: string;
  type: string;
}

interface DataAction extends FileSpecificAction {
  data: S3FileAttachment;
  type: "SET_DATA";
}

interface LoadingAction extends FileSpecificAction {
  loading: boolean;
  type: "SET_LOADING";
}

interface ErrorAction extends FileSpecificAction {
  error: Error;
  type: "SET_ERROR";
}

interface ProgressAction extends FileSpecificAction {
  progress: number;
  type: "SET_PROGRESS";
}

interface RemoveAction extends FileSpecificAction {
  type: "REMOVE_FILE";
}

type FileUploadsAction = DataAction | ErrorAction | LoadingAction | ProgressAction | RemoveAction;

interface FileUploadsState {
  errorByFile: Record<string, Error | null>;
  fileAttachments: S3FileAttachment[];
  fileAttachmentsById: Record<string, S3FileAttachment>;
  loading: boolean;
  loadingByFile: Record<string, boolean>;
  progress: number;
  progressByFile: Record<string, number>;
}

export function fileUploadsReducer(prevState: FileUploadsState, action: FileUploadsAction) {
  switch (action.type) {
    case "SET_DATA": {
      return {
        ...prevState,
        fileAttachments: [
          ...prevState.fileAttachments.filter(({ id }) => id !== action.data.id),
          action.data,
        ],
        fileAttachmentsById: {
          ...prevState.fileAttachmentsById,
          [action.fileAttachmentId]: action.data,
        },
      };
    }
    case "SET_LOADING": {
      const loadingByFile = {
        ...prevState.loadingByFile,
        [action.fileAttachmentId]: action.loading,
      };
      return {
        ...prevState,
        loading: Object.values(loadingByFile).some((x) => x),
        loadingByFile,
      };
    }
    case "SET_ERROR":
      return {
        ...prevState,
        errorByFile: {
          ...prevState.errorByFile,
          [action.fileAttachmentId]: action.error,
        },
      };
    case "SET_PROGRESS": {
      const progressByFile = {
        ...prevState.progressByFile,
        [action.fileAttachmentId]: action.progress,
      };
      const progressValues = Object.values(progressByFile);
      return {
        ...prevState,
        progress: progressValues.reduce((acc, x) => acc + x, 0) / progressValues.length || 0,
        progressByFile,
      };
    }
    case "REMOVE_FILE": {
      const fileAttachmentsById = { ...prevState.fileAttachmentsById };
      delete fileAttachmentsById[action.fileAttachmentId];

      const fileAttachments = prevState.fileAttachments.filter(
        ({ id }) => id !== action.fileAttachmentId
      );

      const loadingByFile = { ...prevState.loadingByFile };
      delete loadingByFile[action.fileAttachmentId];

      const errorByFile = { ...prevState.errorByFile };
      delete errorByFile[action.fileAttachmentId];

      const progressByFile = { ...prevState.progressByFile };
      delete progressByFile[action.fileAttachmentId];

      const progressValues = Object.values(prevState.progressByFile);
      const loadingValues = Object.values(prevState.loadingByFile);

      return {
        ...prevState,
        errorByFile,
        fileAttachments,
        fileAttachmentsById,
        loading: loadingValues.some((x) => x),
        loadingByFile,
        progress: progressValues.reduce((acc, x) => acc + x, 0) / progressValues.length || 0,
        progressByFile,
      };
    }
    default:
      return prevState;
  }
}

export const getInitialFileUploadsState = (
  fileAttachments: S3FileAttachment[] = []
): FileUploadsState => {
  const fileAttachmentsById: FileUploadsState["fileAttachmentsById"] = {};

  fileAttachments.forEach((fileAttachment) => {
    fileAttachmentsById[fileAttachment.id] = fileAttachment;
  });

  return {
    errorByFile: {},
    fileAttachments,
    fileAttachmentsById,
    loading: false,
    loadingByFile: {},
    progress: 0,
    progressByFile: {},
  };
};
