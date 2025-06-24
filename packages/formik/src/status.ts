import { FormikHelpers } from "formik";

export interface FormikStatus {
  allowResubmit?: boolean;
  captureExceptionResult?: null | string;
  formError?: Error | null | string;
  formSuccess?: null | string;
}

export const DEFAULT_INITIAL_STATUS: FormikStatus = {
  allowResubmit: true,
  captureExceptionResult: null,
  formError: null,
  formSuccess: null,
};

export const getEnhancedSetStatus =
  (setStatus: FormikHelpers<unknown>["setStatus"], extraStatus?: FormikStatus) =>
  (status: FormikStatus) =>
    setStatus({ ...extraStatus, ...status });

export const getSetFormSuccess =
  (setStatus: FormikHelpers<unknown>["setStatus"]) => (formSuccess: FormikStatus["formSuccess"]) =>
    setStatus({ formError: null, formSuccess });

export const getSetFormError =
  (setStatus: FormikHelpers<unknown>["setStatus"]) =>
  (
    formError: FormikStatus["formError"],
    captureExceptionResult?: FormikStatus["captureExceptionResult"]
  ) => {
    const status: FormikStatus = { formError, formSuccess: null };
    if (typeof captureExceptionResult !== "undefined") {
      status.captureExceptionResult = captureExceptionResult;
    }
    return setStatus(status);
  };

export const getSetCaptureExceptionResult =
  (setStatus: FormikHelpers<unknown>["setStatus"]) =>
  (captureExceptionResult: FormikStatus["captureExceptionResult"]) =>
    setStatus({ captureExceptionResult });

export interface StatusHelpers {
  setCaptureExceptionResult: (
    captureExceptionResult: FormikStatus["captureExceptionResult"]
  ) => void;
  setFormError: (
    formError: FormikStatus["formError"],
    captureExceptionResult?: FormikStatus["captureExceptionResult"]
  ) => void;
  setFormSuccess: (formSuccess: FormikStatus["formSuccess"]) => void;
  setStatus: (status: FormikStatus) => void;
}
