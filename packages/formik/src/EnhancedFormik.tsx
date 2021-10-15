import { captureException } from "@uplift-ltd/sentry";
import { Formik, FormikProps, FormikValues, isFunction } from "formik";
import React, { useRef } from "react";
import { getApplyErrorsToFields } from "./errors";
import {
  DEFAULT_INITIAL_STATUS,
  getEnhancedSetStatus,
  getSetFormSuccess,
  getSetFormError,
  getSetSentryEventId,
} from "./status";
import { FormikConfigWithOverrides, EnhancedFormikExtraProps } from "./types";

export function EnhancedFormik<
  Values extends FormikValues = FormikValues,
  // Formik uses {} type so we disable the eslint rule
  // eslint-disable-next-line @typescript-eslint/ban-types
  ExtraProps extends EnhancedFormikExtraProps<Values> = {}
>({
  captureValuesOnError,
  children,
  initialStatus,
  resetStatusOnSubmit,
  onSubmit,
  innerRef,
  ...otherProps
}: FormikConfigWithOverrides<Values> & ExtraProps) {
  const formikRef = useRef<FormikProps<Values> | null>(null);
  const ref = innerRef || formikRef;

  const initStatus = {
    ...DEFAULT_INITIAL_STATUS,
    ...initialStatus,
  };

  return (
    <Formik
      innerRef={ref}
      initialStatus={initStatus}
      onSubmit={async (values, formikHelpers) => {
        const setStatus = getEnhancedSetStatus(formikHelpers.setStatus, ref.current?.status);

        try {
          if (resetStatusOnSubmit) {
            setStatus(initStatus);
          }

          await onSubmit(values, {
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
      }}
      {...otherProps}
    >
      {(formik) => {
        if (isFunction(children)) {
          const setStatus = getEnhancedSetStatus(formik.setStatus, formik.status);
          return children({
            ...formik,
            applyErrorsToFields: getApplyErrorsToFields(formik.setErrors),
            setStatus,
            setFormSuccess: getSetFormSuccess(setStatus),
            setFormError: getSetFormError(setStatus),
            setSentryEventId: getSetSentryEventId(setStatus),
          });
        }
        return children;
      }}
    </Formik>
  );
}
