import { useFormikContext, FormikContextType } from "formik";
import { getSetFormSuccess, getSetFormError, StatusHelpers } from "./status";

type EnhancedFormikContextType<FormikValues> = FormikContextType<FormikValues> & StatusHelpers;

export function useEnhancedFormikContext<FormikValues>(): EnhancedFormikContextType<FormikValues> {
  const context = useFormikContext<FormikValues>();

  return {
    ...context,
    setFormSuccess: getSetFormSuccess(context.setStatus),
    setFormError: getSetFormError(context.setStatus),
  };
}
