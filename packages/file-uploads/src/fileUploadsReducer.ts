interface FileSpecificAction<TFile = File> {
  file: TFile;
  type: string;
}

interface DataAction<TFile = File, TUploadData = unknown> extends FileSpecificAction<TFile> {
  data: TUploadData;
  type: "SET_DATA";
}

interface LoadingAction<TFile = File> extends FileSpecificAction<TFile> {
  loading: boolean;
  type: "SET_LOADING";
}

interface ErrorAction<TFile = File> extends FileSpecificAction<TFile> {
  error: Error;
  type: "SET_ERROR";
}

interface ProgressAction<TFile = File> extends FileSpecificAction<TFile> {
  progress: number;
  type: "SET_PROGRESS";
}

interface AddAction<TFile = File> extends FileSpecificAction<TFile> {
  type: "ADD_FILE";
}

interface RemoveAction<TFile = File> extends FileSpecificAction<TFile> {
  type: "REMOVE_FILE";
}

interface ResetAction {
  type: "RESET";
}

type FileUploadsAction<TFile, TUploadData> =
  | AddAction<TFile>
  | DataAction<TFile, TUploadData>
  | ErrorAction<TFile>
  | LoadingAction<TFile>
  | ProgressAction<TFile>
  | RemoveAction<TFile>
  | ResetAction;

export interface FileUploadsState<TFile = File, TUploadData = unknown> {
  datas: Array<TUploadData | null>;
  errors: Array<Error | null>;
  files: TFile[];
  loading: boolean;
  loadings: boolean[];
  progress: number;
  progresses: number[];
}

export function fileUploadsReducer<TFile = File, TUploadData = unknown>(
  prevState: FileUploadsState<TFile, TUploadData>,
  action: FileUploadsAction<TFile, TUploadData>
): FileUploadsState<TFile, TUploadData> {
  switch (action.type) {
    case "ADD_FILE": {
      const datas = [...prevState.datas, null];
      const errors = [...prevState.errors, null];
      const files = [...prevState.files, action.file];
      const loadings = [...prevState.loadings, true];
      const progresses = [...prevState.progresses, 0];

      return {
        ...prevState,
        datas,
        errors,
        files,
        loading: loadings.some((x) => x),
        loadings,
        progress: progresses.reduce((acc, x) => acc + x, 0) / progresses.length || 0,
        progresses,
      };
    }
    case "REMOVE_FILE": {
      const idx = prevState.files.indexOf(action.file);

      const datas = prevState.datas.filter((_data, i) => i !== idx);
      const errors = prevState.errors.filter((_error, i) => i !== idx);
      const files = prevState.files.filter((_file, i) => i !== idx);
      const loadings = prevState.loadings.filter((_loading, i) => i !== idx);
      const progresses = prevState.progresses.filter((_progress, i) => i !== idx);

      return {
        ...prevState,
        datas,
        errors,
        files,
        loading: loadings.some((x) => x),
        loadings,
        progress: progresses.reduce((acc, x) => acc + x, 0) / progresses.length || 0,
        progresses,
      };
    }
    case "RESET": {
      return {
        ...getInitialFileUploadsState(),
      };
    }
    case "SET_DATA": {
      const idx = prevState.files.indexOf(action.file);

      return {
        ...prevState,
        datas: prevState.datas.map((data, i) => {
          if (i !== idx) return data;
          return action.data;
        }),
      };
    }
    case "SET_ERROR": {
      const idx = prevState.files.indexOf(action.file);

      return {
        ...prevState,
        errors: prevState.errors.map((error, i) => {
          if (i !== idx) return error;
          return action.error;
        }),
      };
    }
    case "SET_LOADING": {
      const idx = prevState.files.indexOf(action.file);

      const loadings = prevState.loadings.map((loading, i) => {
        if (i !== idx) return loading;
        return action.loading;
      });

      return {
        ...prevState,
        loading: loadings.some((loading) => loading),
        loadings,
      };
    }
    case "SET_PROGRESS": {
      const idx = prevState.files.indexOf(action.file);

      const progresses = prevState.progresses.map((progress, i) => {
        if (i !== idx) return progress;
        return action.progress;
      });

      return {
        ...prevState,
        progress: progresses.reduce((acc, x) => acc + x, 0) / progresses.length || 0,
        progresses,
      };
    }
    default:
      return prevState;
  }
}

export function getInitialFileUploadsState<TFile = File, TUploadData = unknown>(): FileUploadsState<
  TFile,
  TUploadData
> {
  return {
    datas: [],
    errors: [],
    files: [],
    loading: false,
    loadings: [],
    progress: 0,
    progresses: [],
  };
}
