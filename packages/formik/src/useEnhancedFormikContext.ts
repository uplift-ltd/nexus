import { useFormikContext, FormikContextType } from "formik";
import { getApplyErrorsToFields, ErrorHelpers } from "./errors";
import { getSetFormSuccess, getSetFormError, StatusHelpers } from "./status";

type EnhancedFormikContextType<FormikValues> = FormikContextType<FormikValues> &
  StatusHelpers &
  ErrorHelpers;

export function useEnhancedFormikContext<FormikValues>(): EnhancedFormikContextType<FormikValues> {
  const context = useFormikContext<FormikValues>();

  return {
    ...context,
    applyErrorsToFields: getApplyErrorsToFields(context.setErrors),
    setFormSuccess: getSetFormSuccess(context.setStatus),
    setFormError: getSetFormError(context.setStatus),
  };
}
