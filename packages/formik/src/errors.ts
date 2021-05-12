import { safeJoinWithComma } from "@uplift-ltd/strings";

import { FormikHelpers } from "formik";

export interface GrapheneFieldError {
  field: string;
  messages: string[];
}

export interface ApplyErrorsToFieldsOptions {
  mapFieldName?: (fieldName: string) => string;
}

/**
 * Applies an array of field level errors from graphene to our formik fields for
 * display to the user.
 */
export const getApplyErrorsToFields = (
  setErrors: FormikHelpers<unknown>["setErrors"],
  { mapFieldName }: ApplyErrorsToFieldsOptions
) => (errors: GrapheneFieldError[]) => {
  setErrors(
    errors.reduce((acc, err) => {
      const errField = typeof mapFieldName === "function" ? mapFieldName(err.field) : err.field;
      return {
        ...acc,
        [errField]: safeJoinWithComma(err.messages),
      };
    }, {})
  );
};

export interface ErrorHelpers {
  applyErrorsToFields: (errors: GrapheneFieldError[]) => void;
}
