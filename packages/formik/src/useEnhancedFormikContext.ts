import { useFormikContext } from "formik";

import { getApplyErrorsToFields } from "./errors.js";
import {
  getEnhancedSetStatus,
  getSetCaptureExceptionReturn,
  getSetFormError,
  getSetFormSuccess,
} from "./status.js";
import { EnhancedFormikContextType } from "./types.js";

export function useEnhancedFormikContext<FormikValues>(): EnhancedFormikContextType<FormikValues> {
  const context = useFormikContext<FormikValues>();

  const setStatus = getEnhancedSetStatus(context.setStatus, context.status);

  return {
    ...context,
    applyErrorsToFields: getApplyErrorsToFields(context.setErrors),
    setCaptureExceptionReturn: getSetCaptureExceptionReturn(setStatus),
    setFormError: getSetFormError(setStatus),
    setFormSuccess: getSetFormSuccess(setStatus),
    setStatus,
  };
}
