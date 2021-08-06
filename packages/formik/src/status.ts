import { FormikHelpers } from "formik";

export interface FormikStatus {
  allowResubmit?: boolean;
  formSuccess?: string | null;
  formError?: string | Error | null;
  sentryEventId?: string | null;
}

export const DEFAULT_INITIAL_STATUS: FormikStatus = {
  allowResubmit: true,
  formSuccess: null,
  formError: null,
  sentryEventId: null,
};

export const getEnhancedSetStatus = (
  setStatus: FormikHelpers<unknown>["setStatus"],
  extraStatus?: FormikStatus
) => (status: FormikStatus) => setStatus({ ...extraStatus, ...status });

export const getSetFormSuccess = (setStatus: FormikHelpers<unknown>["setStatus"]) => (
  formSuccess: FormikStatus["formSuccess"]
) => setStatus({ formSuccess });

export const getSetFormError = (setStatus: FormikHelpers<unknown>["setStatus"]) => (
  formError: FormikStatus["formError"],
  sentryEventId?: FormikStatus["sentryEventId"]
) => {
  const status: FormikStatus = { formError };
  if (typeof sentryEventId !== "undefined") {
    status.sentryEventId = sentryEventId;
  }
  return setStatus(status);
};

export const getSetSentryEventId = (setStatus: FormikHelpers<unknown>["setStatus"]) => (
  sentryEventId: FormikStatus["sentryEventId"]
) => setStatus({ sentryEventId });

export interface StatusHelpers {
  setStatus: (status: FormikStatus) => void;
  setFormSuccess: (formSuccess: FormikStatus["formSuccess"]) => void;
  setFormError: (
    formError: FormikStatus["formError"],
    sentryEventId?: FormikStatus["sentryEventId"]
  ) => void;
  setSentryEventId: (sentryEventId: FormikStatus["sentryEventId"]) => void;
}
