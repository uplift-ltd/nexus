---
title: file-uploads
---

## Installation

    yarn add @uplift-ltd/file-uploads

## API

File upload related functionalities for web and React Native.

### useFileUpload

#### web

```ts
import { useFileUpload } from "@uplift-ltd/file-uploads";

const { handleFilesAdded, onRequestRemove, files, reset, isUploading } = useFileUploads({
  onChange,
  value,
  objectId,
  appLabel,
  token, // Authorization token
});
```

#### React Native

```ts
import { useFileUpload } from "@uplift-ltd/file-uploads";

const [uploadFile, { error, status, progress, uploading }] = useUploadFile();

const uploadedFile = await uploadFile({
  objectId,
  appLabel,
  token, // Authorization token
  name,
  url: result.uri,
  metadata: {
    aspectRatio: result.width / result.height,
    height: result.height,
    width: result.width,
  },
});
```
