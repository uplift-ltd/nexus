interface DataAction<TUploadData = unknown> {
  data: TUploadData | null;
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

interface ResetAction {
  type: "RESET";
}

export type FileUploadAction<TUploadData = unknown> =
  | DataAction<TUploadData>
  | ErrorAction
  | LoadingAction
  | ProgressAction
  | ResetAction;

export interface FileUploadState<TUploadData> {
  data: TUploadData | null;
  error: Error | null;
  loading: boolean;
  progress: number;
}

export function fileUploadReducer<TUploadData = unknown>(
  prevState: FileUploadState<TUploadData>,
  action: FileUploadAction<TUploadData>
) {
  switch (action.type) {
    case "RESET":
      return {
        ...initialFileUploadState,
      };
    case "SET_DATA":
      return {
        ...prevState,
        data: action.data,
      };
    case "SET_ERROR":
      return {
        ...prevState,
        error: action.error,
      };
    case "SET_LOADING":
      return {
        ...prevState,
        loading: action.loading,
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

export const initialFileUploadState: FileUploadState<unknown> = {
  data: null,
  error: null,
  loading: false,
  progress: 0,
};
