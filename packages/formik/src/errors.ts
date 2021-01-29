import { safeJoinWithComma } from "@uplift-ltd/strings";

import { FormikHelpers } from "formik";

export interface GrapheneFieldError {
  field: string;
  messages: string[];
}

/**
 * Applies an array of field level errors from graphene to our formik fields for
 * display to the user.
 */
export const getApplyErrorsToFields = (setErrors: FormikHelpers<unknown>["setErrors"]) => (
  errors: GrapheneFieldError[]
) => {
  setErrors(
    errors.reduce((acc, err) => {
      return {
        ...acc,
        [err.field]: safeJoinWithComma(err.messages),
      };
    }, {})
  );
};

export interface ErrorHelpers {
  applyErrorsToFields: (errors: GrapheneFieldError[]) => void;
}
