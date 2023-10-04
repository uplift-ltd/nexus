import { captureException } from "@uplift-ltd/sentry";
import { ensureError } from "@uplift-ltd/ts-helpers";
import { FormikValues, useFormik } from "formik";
import { getApplyErrorsToFields } from "./errors.js";
import {
  DEFAULT_INITIAL_STATUS,
  FormikStatus,
  getSetFormSuccess,
  getSetFormError,
  getSetSentryEventId,
  getEnhancedSetStatus,
} from "./status.js";
import { FormikConfigWithOverrides } from "./types.js";

export function useEnhancedFormik<TFormikValues extends FormikValues>({
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
          setStatus,
          setFormSuccess: getSetFormSuccess(setStatus),
          setFormError: getSetFormError(setStatus),
          setSentryEventId: getSetSentryEventId(setStatus),
        });
      } catch (err) {
        const extra = captureValuesOnError ? { values } : {};
        const sentryEventId = captureException(err, { extra });
        setStatus({ formError: ensureError(err), formSuccess: null, sentryEventId });
      }
    },
  });

  return formik;
}
