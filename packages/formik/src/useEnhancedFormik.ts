import { captureException } from "@uplift-ltd/sentry";
import { useFormik } from "formik";
import { getApplyErrorsToFields } from "./errors";
import {
  DEFAULT_INITIAL_STATUS,
  FormikStatus,
  getSetFormSuccess,
  getSetFormError,
  getSetSentryEventId,
  getEnhancedSetStatus,
} from "./status";
import { FormikConfigWithOverrides } from "./types";

export function useEnhancedFormik<FormikValues>({
  captureValuesOnError,
  resetStatusOnSubmit,
  ...options
}: FormikConfigWithOverrides<FormikValues>) {
  const initStatus = {
    ...DEFAULT_INITIAL_STATUS,
    ...options.initialStatus,
  } as FormikStatus;

  const formik = useFormik<FormikValues>({
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
        setStatus({ formError: err, formSuccess: null, sentryEventId });
      }
    },
  });

  return formik;
}
