import { ensureError } from "@uplift-ltd/ts-helpers";
import { FormikValues, useFormik } from "formik";

import { getApplyErrorsToFields } from "./errors.js";
import {
  DEFAULT_INITIAL_STATUS,
  type FormikStatus,
  getEnhancedSetStatus,
  getSetFormError,
  getSetFormSuccess,
  getSetcaptureExceptionResult,
} from "./status.js";
import { FormikConfigWithOverrides } from "./types.js";

export function useEnhancedFormik<TFormikValues extends FormikValues>({
  captureException,
  captureValuesOnError,
  resetStatusOnSubmit,
  ...options
}: FormikConfigWithOverrides<TFormikValues>) {
  const initStatus = {
    ...DEFAULT_INITIAL_STATUS,
    ...options.initialStatus,
  } as FormikStatus;

  const formik = useFormik<TFormikValues>({
    ...options,
    initialStatus: initStatus,
    onSubmit: async (values, formikHelpers) => {
      const setStatus = getEnhancedSetStatus(formikHelpers.setStatus, formik.status);

      try {
        if (resetStatusOnSubmit) {
          setStatus(initStatus);
        }

        await options.onSubmit(values, {
          ...formikHelpers,
          applyErrorsToFields: getApplyErrorsToFields(formikHelpers.setErrors),
          setFormError: getSetFormError(setStatus),
          setFormSuccess: getSetFormSuccess(setStatus),
          setStatus,
          setcaptureExceptionResult: getSetcaptureExceptionResult(setStatus),
        });
      } catch (err) {
        const extra = captureValuesOnError ? { values } : {};
        const captureExceptionResult = (await captureException?.(err as Error, { extra })) as
          | string
          | undefined;
        setStatus({ captureExceptionResult, formError: ensureError(err), formSuccess: null });
      }
    },
  });

  return formik;
}
