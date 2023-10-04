import { useMemo } from "react";
import { EnumDataDocument } from "./__generated__/EnumData.js";
import { useEnhancedQuery } from "./hooks.js";

export type EnumDataMap<T> = {
  [K in keyof T]: string;
};

export const useEnumValues = <T>(enumName: string): EnumDataMap<T> => {
  const { data, loading, error } = useEnhancedQuery(EnumDataDocument, {
    variables: { enumName },
  });

  const dataMap = useMemo(() => {
    if (loading || error || !data?.enumData?.enumValues) {
      return {} as EnumDataMap<T>;
    }

    return data.enumData.enumValues.reduce(
      (acc, e) => ({
        ...acc,
        [e.name]: e.description,
      }),
      {} as EnumDataMap<T>
    );
  }, [data, loading, error]);

  return dataMap;
};
