import { type NexusExceptionHandlerProps } from "@uplift-ltd/nexus-errors";
import { FormikHelpers } from "formik";

export interface FormikStatus {
  allowResubmit?: boolean;
  captureExceptionReturn?: NexusExceptionHandlerProps["returnType"] | null;
  formError?: Error | null | string;
  formSuccess?: null | string;
}

export const DEFAULT_INITIAL_STATUS: FormikStatus = {
  allowResubmit: true,
  captureExceptionReturn: null,
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
    captureExceptionReturn?: FormikStatus["captureExceptionReturn"]
  ) => {
    const status: FormikStatus = { formError, formSuccess: null };
    if (typeof captureExceptionReturn !== "undefined") {
      status.captureExceptionReturn = captureExceptionReturn;
    }
    return setStatus(status);
  };

export const getSetCaptureExceptionReturn =
  (setStatus: FormikHelpers<unknown>["setStatus"]) =>
  (captureExceptionReturn: FormikStatus["captureExceptionReturn"]) =>
    setStatus({ captureExceptionReturn });

export interface StatusHelpers {
  setCaptureExceptionReturn: (
    captureExceptionReturn: FormikStatus["captureExceptionReturn"]
  ) => void;
  setFormError: (
    formError: FormikStatus["formError"],
    captureExceptionReturn?: FormikStatus["captureExceptionReturn"]
  ) => void;
  setFormSuccess: (formSuccess: FormikStatus["formSuccess"]) => void;
  setStatus: (status: FormikStatus) => void;
}
