import { gql, useEnhancedMutation } from "@uplift-ltd/apollo";
import { GetSignedRequestMutation, GetSignedRequestMutationVariables } from "./types";

const GET_SIGNED_REQUEST = gql`
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

export function useGetSignedRequest() {
  return useEnhancedMutation<GetSignedRequestMutation, GetSignedRequestMutationVariables>(
    GET_SIGNED_REQUEST
  );
}
