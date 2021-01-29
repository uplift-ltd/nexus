import Sentry from "@uplift-ltd/sentry";
import { useFormik } from "formik";
import { getApplyErrorsToFields } from "./errors";
import { FormikStatus, getSetFormSuccess, getSetFormError } from "./status";
import { FormikConfigWithOverrides } from "./types";

export function useEnhancedFormik<FormikValues>(options: FormikConfigWithOverrides<FormikValues>) {
  return useFormik<FormikValues>({
    ...options,
    initialStatus: {
      formSuccess: null,
      formError: null,
      allowResubmit: true,
      ...options.initialStatus,
    } as FormikStatus,
    onSubmit: async (values, formikHelpers) => {
      try {
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
