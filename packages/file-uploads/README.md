# @uplift-ltd/file-uploads

## Installation

```sh
npm i --save @uplift-ltd/file-uploads
```

## API

File upload related functionalities for web and React Native.

### helpers

You likely want to add helpers like this to your project.

```graphql
# GetUploadUrl.graphql
mutation GetUploadUrl($input: GetUploadUrlInput!) {
  getUploadUrl(input: $input) {
    __typename
    ... on GetUploadUrlSuccess {
      originalFileName
      uploadConfig {
        key
        uploadUrl
        url
      }
    }
  }
}
```

```tsx
// helpers/files.tsx
import { getFetchFileUploader } from "@uplift-ltd/file-uploads/fetch";
// OR
import { getAxiosFileUploader } from "@uplift-ltd/file-uploads/axios";

type GetUploadUrlInputProps = Pick<GetUploadUrlInput, "objectId" | "uploadType">;

export const useGetFileUploaderProps = (uploadUrlInput: GetUploadUrlInputProps) => {
  const graphQLClient = useGraphQLClient();

  return useCallback(
    async (file: File) => {
      const signedRequest = await graphQLClient.request(GetUploadUrlDocument, {
        input: { fileName: file.name, ...uploadUrlInput },
      });

      if (signedRequest.getUploadUrl.__typename !== "GetUploadUrlSuccess") {
        throw new Error("Failed to fetch signed request!");
      }

      return {
        file,
        key: signedRequest.getUploadUrl.uploadConfig.key,
        uploadUrl: signedRequest.getUploadUrl.uploadConfig.uploadUrl,
      };
    },
    [graphQLClient, uploadUrlInput]
  );
};

export type FileUploaderProps = {
  file: File;
} & Pick<GetUploadUrlSuccess["uploadConfig"], "key" | "uploadUrl">;

export const fileUploader = getFetchFileUploader<File, FileUploaderProps>();
// OR
export const fileUploader = getAxiosFileUploader<File, FileUploaderProps>();
```

Note: To use the axios file uploader you must have axios listed in your dependencies. The axios
uploader reports progress whereas the default fetch does not (it goes straight to 100% when the file
is uploaded.)

### useUploadFile

Upload a single file.

```tsx
// MyComponent.tsx
import { useUploadFile } from "@uplift-ltd/file-uploads";

function MyComponent() {
  const getFileUploaderProps = useGetFileUploaderProps({
    objectId: geojsonConfig?.id,
    uploadType: "GEOJSON",
  });

  const { data, error, loading, progress, uploadFile, reset } = useUploadFile({
    fileUploader,
    getFileUploaderProps,
  });

  <input
    type="file"
    onChange={(e) => {
      if (!e.target.files) {
        return;
      }
      Array.from(e.target.files).forEach((file) => {
        uploadFile(file);
      });
    }}
  />;
}
```

#### useUploadFiles

Upload multiple files.

```tsx
// MyComponent.tsx
import { useUploadFiles } from "@uplift-ltd/file-uploads";

function MyComponent() {
  const getFileUploaderProps = useGetFileUploaderProps({
    objectId: geojsonConfig?.id,
    uploadType: "GEOJSON",
  });

  const {
    datas,
    errors,
    files,
    loading,
    loadings,
    progress,
    progresses,
    removeFile,
    reset,
    uploadFile,
    uploadFiles,
  } = useUploadFiles({
    fileUploader,
    getFileUploaderProps,
  });

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
