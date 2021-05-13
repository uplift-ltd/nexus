import { safeJoinWithComma } from "@uplift-ltd/strings";

import { FormikHelpers } from "formik";

export interface GrapheneFieldError {
  field: string;
  messages: string[];
}

export interface ApplyErrorsToFieldsOptions {
  mapFieldName?: (fieldName: string) => string;
}

const identity = (field: string) => field;

/**
 * Applies an array of field level errors from graphene to our formik fields for
 * display to the user.
 */
export const getApplyErrorsToFields = (setErrors: FormikHelpers<unknown>["setErrors"]) => (
  errors?: GrapheneFieldError[],
  { mapFieldName = identity }: ApplyErrorsToFieldsOptions = {}
) => {
  setErrors(
    errors?.reduce((acc, err) => {
      return {
        ...acc,
        [mapFieldName(err.field)]: safeJoinWithComma(err.messages),
      };
    }, {}) || []
  );
};

export interface ErrorHelpers {
  applyErrorsToFields: (
    errors?: GrapheneFieldError[],
    options?: ApplyErrorsToFieldsOptions
  ) => void;
}
