import {
  DocumentNode,
  MutationHookOptions,
  OperationVariables,
  gql,
  useEnhancedMutation,
} from "@uplift-ltd/apollo";

import { GetSignedRequestMutation, GetSignedRequestMutationVariables } from "./types.js";

export const GET_SIGNED_REQUEST = gql`
  mutation GetSignedRequest(
    $grapheneId: ID!
    $appLabel: String!
    $fileName: String!
    $fileType: String!
    $isDraft: Boolean
    $metadata: JSONString
  ) {
    getSignedRequest(
      grapheneId: $grapheneId
      appLabel: $appLabel
      fileName: $fileName
      fileType: $fileType
      isDraft: $isDraft
      metadata: $metadata
    ) {
      success
      message
      fileAttachment {
        id
        key
        name
        url
        isDraft
        metadata
      }
      uploadUrl
    }
  }
`;

export type GetSignedRequestOptions<
  TMutation = GetSignedRequestMutation,
  TVariables extends OperationVariables = GetSignedRequestMutationVariables,
> = MutationHookOptions<TMutation, TVariables>;

export interface UseGetSignedRequestOptions<
  TMutation = GetSignedRequestMutation,
  TVariables extends OperationVariables = GetSignedRequestMutationVariables,
> {
  options?: GetSignedRequestOptions<TMutation, TVariables>;
  query?: DocumentNode;
}

export function useGetSignedRequest<
  TMutation = GetSignedRequestMutation,
  TVariables extends OperationVariables = GetSignedRequestMutationVariables,
>({ options, query = GET_SIGNED_REQUEST }: UseGetSignedRequestOptions<TMutation, TVariables> = {}) {
  return useEnhancedMutation<TMutation, TVariables>(query, options);
}
