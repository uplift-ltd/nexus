# @uplift-ltd/file-uploads

## Installation

    yarn add @uplift-ltd/file-uploads

## API

File upload related functionalities for web and React Native.

### useFileUpload

Upload a single file.

```tsx
import { useUploadFile } from "@uplift-ltd/file-uploads";

interface UseUploadFileOptions {
  onProgress?: (progress: number, fileAttachment: S3FileAttachment) => void;
  onLoading?: (loading: boolean, fileAttachment: S3FileAttachment) => void;
  onComplete?: (fileAttachment: S3FileAttachment) => void;
  onError?: (error: Error, fileAttachment: S3FileAttachment) => void;
}

function MyComponent() {
  const { uploadFile, fileAttachment, loading, error } = useUploadFile();

  <input
    type="file"
    onChange={(e) => {
      if (!e.target.files) {
        return;
      }
      Array.from(e.target.files).forEach((file) => {
        uploadFile({
          file,
          grapheneId: "VXNlcjox",
          appLabel: "runbook",
          isDraft: true,
          metadata: { caption: "Brooo" },
        });
      });
    }}
  />;
}
```

#### useFileUploads

Upload multiple files.

```tsx
import { useUploadFiles } from "@uplift-ltd/file-uploads";

function MyComponent() {
  const {
    uploadFiles,
    onRequestRemove,
    fileAttachments,
    fileAttachmentsById,
    loadingById,
    errorById,
    progressById,
    progress, // total / num files
    loading, // any loading
  } = useUploadFiles();

  <input
    type="file"
    onChange={(e) => {
      if (!e.target.files) {
        return;
      }
      uploadFiles(Array.from(e.target.files));
    }}
  />;
}
```
