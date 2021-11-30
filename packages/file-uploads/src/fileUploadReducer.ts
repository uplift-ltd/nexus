type FileUploadData = unknown;

interface DataAction {
  type: "SET_DATA";
  data: FileUploadData | null;
}

interface LoadingAction {
  type: "SET_LOADING";
  loading: boolean;
}

interface ErrorAction {
  type: "SET_ERROR";
  error: Error;
}

interface ProgressAction {
  type: "SET_PROGRESS";
  progress: number;
}

export type FileUploadAction = DataAction | LoadingAction | ErrorAction | ProgressAction;

interface FileUploadState {
  data: FileUploadData | null;
  loading: boolean;
  error: Error | null;
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
  loading: false,
  error: null,
  progress: 0,
};
