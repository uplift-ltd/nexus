import { useFormikContext } from "formik";
import { getApplyErrorsToFields } from "./errors.js";
import {
  getEnhancedSetStatus,
  getSetFormSuccess,
  getSetFormError,
  getSetSentryEventId,
} from "./status.js";
import { EnhancedFormikContextType } from "./types.js";

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
