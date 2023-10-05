import { useFormikContext } from "formik";
import { getApplyErrorsToFields } from "./errors.js";
import {
  getEnhancedSetStatus,
  getSetFormError,
  getSetFormSuccess,
  getSetSentryEventId,
} from "./status.js";
import { EnhancedFormikContextType } from "./types.js";

export function useEnhancedFormikContext<FormikValues>(): EnhancedFormikContextType<FormikValues> {
  const context = useFormikContext<FormikValues>();

  const setStatus = getEnhancedSetStatus(context.setStatus, context.status);

  return {
    ...context,
    applyErrorsToFields: getApplyErrorsToFields(context.setErrors),
    setFormError: getSetFormError(setStatus),
    setFormSuccess: getSetFormSuccess(setStatus),
    setSentryEventId: getSetSentryEventId(setStatus),
    setStatus,
  };
}
