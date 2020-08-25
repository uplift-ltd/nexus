import { captureException } from "@sentry/browser";
import { useFormik, FormikConfig } from "formik";
import { FormikStatus } from "./status";

export function useEnhancedFormik<FormikValues>(options: FormikConfig<FormikValues>) {
  return useFormik<FormikValues>({
    ...options,
    initialStatus: {
      formSuccess: false,
      formError: false,
      allowResubmit: true,
      ...options.initialStatus,
    } as FormikStatus,
    onSubmit: async (values, formikHelpers) => {
      try {
        await options.onSubmit(values, formikHelpers);
      } catch (err) {
        captureException(err);
        formikHelpers.setStatus({ formError: err });
      }
    },
  });
}
