import { gql } from "@apollo/client";
import { useMemo } from "react";
import {
  EnumData,
  EnumDataVariables,
  EnumData_enumData_enumValues as EnumValue,
} from "./__generated__/EnumData";
import { useEnhancedQuery } from "./hooks";

export const ENUM_QUERY = gql`
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

export type { EnumData, EnumDataVariables, EnumValue };

export type EnumDataMap<T> = {
  [K in keyof T]: string;
};

export const useEnumValues = <T>(enumName: string): EnumDataMap<T> => {
  const { data, loading, error } = useEnhancedQuery<EnumData, EnumDataVariables>(ENUM_QUERY, {
    variables: { enumName },
  });

  const dataMap = useMemo(() => {
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
  }, [data, loading, error]);

  return dataMap;
};
