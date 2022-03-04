---
title: file-uploads
---

## Installation

    yarn add @uplift-ltd/file-uploads

## API

File upload related functionalities for web and React Native.

### useUploadFile

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

#### useUploadFiles

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

#### Custom signed request

To use a custom signed request:

```tsx
// MyComponent.tsx

useUploadFile({ signedRequestOptions: { query: MY_SIGNED_REQUEST_MUTATION } });
// OR
useUploadFiles({ signedRequestOptions: { query: MY_SIGNED_REQUEST_MUTATION } });

// file-uploads.d.ts
import "@uplift-ltd/file-uploads";

declare module "@uplift-ltd/file-uploads" {
  export interface GetSignedRequestMutationVariables {
    recaptchaToken: string;
  }
}
```
