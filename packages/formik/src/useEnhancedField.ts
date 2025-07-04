import { FieldHelperProps, FieldHookConfig, FieldMetaProps, useField } from "formik";

import { type EnhancedFieldInputProps } from "./types.js";

type EnhancedFieldHookConfig<T> = FieldHookConfig<T> & { hideErrorsOnFocus?: boolean };

export function useEnhancedField<FieldValue>({
  hideErrorsOnFocus,
  ...fieldOptions
}: EnhancedFieldHookConfig<FieldValue>): [
  EnhancedFieldInputProps<FieldValue>,
  FieldMetaProps<FieldValue>,
  FieldHelperProps<FieldValue>,
] {
  const [field, meta, formik] = useField<FieldValue>(fieldOptions);

  return [
    {
      ...field,
      // the field typeof any mirrors the event Formik uses for onBlur/onChange
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onFocus: (_e: React.FocusEvent<any>) => {
        if (hideErrorsOnFocus) {
          formik.setTouched(false, false);
        }
      },
    },
    meta,
    formik,
  ];
}
