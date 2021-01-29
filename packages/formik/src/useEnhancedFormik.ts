import Sentry from "@uplift-ltd/sentry";
import { useFormik } from "formik";
import { getApplyErrorsToFields } from "./errors";
import { DEFAULT_INITIAL_STATUS, FormikStatus, getSetFormSuccess, getSetFormError } from "./status";
import { FormikConfigWithOverrides } from "./types";

export function useEnhancedFormik<FormikValues>({
  resetStatusOnSubmit,
  ...options
}: FormikConfigWithOverrides<FormikValues>) {
  return useFormik<FormikValues>({
    ...options,
    initialStatus: {
      ...DEFAULT_INITIAL_STATUS,
      ...options.initialStatus,
    } as FormikStatus,
    onSubmit: async (values, formikHelpers) => {
      try {
        if (resetStatusOnSubmit) {
          formikHelpers.setStatus({
            ...DEFAULT_INITIAL_STATUS,
            ...options.initialStatus,
          });
        }
        await options.onSubmit(values, {
          ...formikHelpers,
          applyErrorsToFields: getApplyErrorsToFields(formikHelpers.setErrors),
          setFormSuccess: getSetFormSuccess(formikHelpers.setStatus),
          setFormError: getSetFormError(formikHelpers.setStatus),
        });
      } catch (err) {
        Sentry.captureException(err);
        formikHelpers.setStatus({ formError: err });
      }
    },
  });
}
