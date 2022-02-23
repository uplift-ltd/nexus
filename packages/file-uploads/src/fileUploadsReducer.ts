import { S3FileAttachment } from "./types";

interface FileSpecificAction {
  type: string;
  fileAttachmentId: string;
}

interface DataAction extends FileSpecificAction {
  type: "SET_DATA";
  data: S3FileAttachment;
}

interface LoadingAction extends FileSpecificAction {
  type: "SET_LOADING";
  loading: boolean;
}

interface ErrorAction extends FileSpecificAction {
  type: "SET_ERROR";
  error: Error;
}

interface ProgressAction extends FileSpecificAction {
  type: "SET_PROGRESS";
  progress: number;
}

interface RemoveAction extends FileSpecificAction {
  type: "REMOVE_FILE";
}

type FileUploadsAction = DataAction | LoadingAction | ErrorAction | ProgressAction | RemoveAction;

interface FileUploadsState {
  fileAttachmentsById: Record<string, S3FileAttachment>;
  fileAttachments: S3FileAttachment[];
  loadingByFile: Record<string, boolean>;
  errorByFile: Record<string, Error | null>;
  progressByFile: Record<string, number>;
  progress: number;
  loading: boolean;
}

export function fileUploadsReducer(prevState: FileUploadsState, action: FileUploadsAction) {
  switch (action.type) {
    case "SET_DATA": {
      return {
        ...prevState,
        fileAttachmentsById: {
          ...prevState.fileAttachmentsById,
          [action.fileAttachmentId]: action.data,
        },
        fileAttachments: [
          ...prevState.fileAttachments.filter(({ id }) => id !== action.data.id),
          action.data,
        ],
      };
    }
    case "SET_LOADING": {
      const loadingByFile = {
        ...prevState.loadingByFile,
        [action.fileAttachmentId]: action.loading,
      };
      return {
        ...prevState,
        loadingByFile,
        loading: Object.values(loadingByFile).some((x) => x),
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
      const progressValues = [...Object.values(prevState.progressByFile), action.progress];
      return {
        ...prevState,
        progressByFile: {
          ...prevState.progressByFile,
          [action.fileAttachmentId]: action.progress,
        },
        progress: progressValues.reduce((acc, x) => acc + x, 0) / progressValues.length || 0,
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
        fileAttachmentsById,
        fileAttachments,
        loadingByFile,
        errorByFile,
        progressByFile,
        loading: loadingValues.some((x) => x),
        progress: progressValues.reduce((acc, x) => acc + x, 0) / progressValues.length || 0,
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
    fileAttachmentsById,
    fileAttachments,
    loadingByFile: {},
    errorByFile: {},
    progressByFile: {},
    loading: false,
    progress: 0,
  };
};
