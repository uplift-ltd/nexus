import { FormikHelpers } from "formik";

export interface FormikStatus {
  allowResubmit?: boolean;
  formError?: Error | null | string;
  formSuccess?: null | string;
  sentryEventId?: null | string;
}

export const DEFAULT_INITIAL_STATUS: FormikStatus = {
  allowResubmit: true,
  formError: null,
  formSuccess: null,
  sentryEventId: null,
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
  (formError: FormikStatus["formError"], sentryEventId?: FormikStatus["sentryEventId"]) => {
    const status: FormikStatus = { formError, formSuccess: null };
    if (typeof sentryEventId !== "undefined") {
      status.sentryEventId = sentryEventId;
    }
    return setStatus(status);
  };

export const getSetSentryEventId =
  (setStatus: FormikHelpers<unknown>["setStatus"]) =>
  (sentryEventId: FormikStatus["sentryEventId"]) =>
    setStatus({ sentryEventId });

export interface StatusHelpers {
  setFormError: (
    formError: FormikStatus["formError"],
    sentryEventId?: FormikStatus["sentryEventId"]
  ) => void;
  setFormSuccess: (formSuccess: FormikStatus["formSuccess"]) => void;
  setSentryEventId: (sentryEventId: FormikStatus["sentryEventId"]) => void;
  setStatus: (status: FormikStatus) => void;
}
