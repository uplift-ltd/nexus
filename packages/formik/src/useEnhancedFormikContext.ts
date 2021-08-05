import { useFormikContext, FormikContextType } from "formik";
import { getApplyErrorsToFields, ErrorHelpers } from "./errors";
import {
  getEnhancedSetStatus,
  getSetFormSuccess,
  getSetFormError,
  getSetSentryEventId,
  StatusHelpers,
} from "./status";

type EnhancedFormikContextType<FormikValues> = FormikContextType<FormikValues> &
  StatusHelpers &
  ErrorHelpers;

export function useEnhancedFormikContext<FormikValues>(): EnhancedFormikContextType<FormikValues> {
  const context = useFormikContext<FormikValues>();

  const setStatus = getEnhancedSetStatus(context.setStatus, context.status);

  return {
    ...context,
    applyErrorsToFields: getApplyErrorsToFields(context.setErrors),
    setStatus,
    setFormSuccess: getSetFormSuccess(setStatus),
    setFormError: getSetFormError(setStatus),
    setSentryEventId: getSetSentryEventId(setStatus),
  };
}
