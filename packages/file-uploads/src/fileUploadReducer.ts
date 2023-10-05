type FileUploadData = unknown;

interface DataAction {
  data: FileUploadData | null;
  type: "SET_DATA";
}

interface LoadingAction {
  loading: boolean;
  type: "SET_LOADING";
}

interface ErrorAction {
  error: Error;
  type: "SET_ERROR";
}

interface ProgressAction {
  progress: number;
  type: "SET_PROGRESS";
}

export type FileUploadAction = DataAction | ErrorAction | LoadingAction | ProgressAction;

interface FileUploadState {
  data: FileUploadData | null;
  error: Error | null;
  loading: boolean;
  progress: number;
}

export function fileUploadReducer(prevState: FileUploadState, action: FileUploadAction) {
  switch (action.type) {
    case "SET_DATA":
      return {
        ...prevState,
        data: action.data,
      };
    case "SET_LOADING":
      return {
        ...prevState,
        loading: action.loading,
      };
    case "SET_ERROR":
      return {
        ...prevState,
        error: action.error,
      };
    case "SET_PROGRESS":
      return {
        ...prevState,
        progress: action.progress,
      };
    default:
      return prevState;
  }
}

export const initialFileUploadState: FileUploadState = {
  data: null,
  error: null,
  loading: false,
  progress: 0,
};
