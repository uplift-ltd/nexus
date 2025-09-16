import { ApolloCache, DocumentNode, OperationVariables, gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";

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
  TCache extends ApolloCache = ApolloCache,
  TConfiguredVariables extends Partial<TVariables> = Partial<TVariables>,
> = useMutation.Options<TMutation, TVariables, TCache, TConfiguredVariables>;

export interface UseGetSignedRequestOptions<
  TMutation = GetSignedRequestMutation,
  TVariables extends OperationVariables = GetSignedRequestMutationVariables,
  TCache extends ApolloCache = ApolloCache,
  TConfiguredVariables extends Partial<TVariables> = Partial<TVariables>,
> {
  options?: GetSignedRequestOptions<TMutation, TVariables, TCache, TConfiguredVariables>;
  query?: DocumentNode;
}

export function useGetSignedRequest<
  TMutation = GetSignedRequestMutation,
  TVariables extends OperationVariables = GetSignedRequestMutationVariables,
>({ options, query = GET_SIGNED_REQUEST }: UseGetSignedRequestOptions<TMutation, TVariables> = {}) {
  return useMutation<TMutation, TVariables>(query, options);
}
