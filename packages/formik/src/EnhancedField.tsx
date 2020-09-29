import { Field, FieldAttributes, FieldProps, FieldInputProps } from "formik";
import React from "react";

import { isFunction, EnhancedFieldInputProps } from "./types";

export type EnhancedFieldAttributes<T> = FieldAttributes<T> & {
  hideErrorsOnFocus?: boolean;
};

export type EnhancedFieldProps<T = any> = Omit<FieldProps<T>, "field"> & {
  field: EnhancedFieldInputProps<T>;
};

export function EnhancedField<T = any>({
  children,
  hideErrorsOnFocus,
  ...props
}: EnhancedFieldAttributes<T>) {
  return (
    <Field {...props}>
      {({ field, meta, form }: FieldProps<T>) => {
        if (isFunction(children)) {
          const onFocus = (e: React.FocusEvent) => {
            if (hideErrorsOnFocus) {
              form.setFieldTouched(field.name, false, false);
            }
          };

          return children({
            field: {
              onFocus,
              ...field,
            },
            meta,
            form,
          } as EnhancedFieldProps<T>);
        }

        return children;
      }}
    </Field>
  );
}
