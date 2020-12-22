import { useEnhancedQuery } from ".";
import gql from "graphql-tag";

import {
  EnumData,
  EnumDataVariables,
  EnumData_enumData_enumValues as EnumValue,
} from "./__generated__/EnumData";

const ENUM_QUERY = gql`
  query EnumData($enumName: String!) {
    enumData: __type(name: $enumName) {
      name
      enumValues {
        name
        description
      }
    }
  }
`;

type EnumDataMap<T> = {
  [K in keyof T]: string;
};

export const useEnumValues = <T>(enumName: string): EnumDataMap<T> => {
  const { data, loading, error } = useEnhancedQuery<EnumData, EnumDataVariables>(ENUM_QUERY, {
    variables: { enumName },
  });

  if (loading || error || !data?.enumData?.enumValues) {
    return {} as EnumDataMap<T>;
  }

  return data.enumData.enumValues.reduce(
    (acc: EnumDataMap<T>, e: EnumValue) => ({
      ...acc,
      [e.name]: e.description,
    }),
    {} as EnumDataMap<T>
  );
};
