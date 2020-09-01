import { FormikHelpers } from "formik";

export interface FormikStatus {
  formSuccess: boolean | string;
  formError: boolean | string | Error;
  allowResubmit: boolean;
}

export const getSetFormSuccess = (setStatus: FormikHelpers<unknown>["setStatus"]) => (
  formSuccess: FormikStatus["formSuccess"]
) => setStatus({ formSuccess });

export const getSetFormError = (setStatus: FormikHelpers<unknown>["setStatus"]) => (
  formError: FormikStatus["formError"]
) => setStatus({ formError });

export interface StatusHelpers {
  setFormSuccess: (formSuccess: FormikStatus["formSuccess"]) => void;
  setFormError: (formError: FormikStatus["formError"]) => void;
}
