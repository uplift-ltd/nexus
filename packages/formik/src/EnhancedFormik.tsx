import { ensureError } from "@uplift-ltd/ts-helpers";
import { Formik, FormikProps, FormikValues, isFunction } from "formik";
import React, { useRef } from "react";

import { getApplyErrorsToFields } from "./errors.js";
import {
  DEFAULT_INITIAL_STATUS,
  getEnhancedSetStatus,
  getSetFormError,
  getSetFormSuccess,
  getSetCaptureExceptionResult,
} from "./status.js";
import { EnhancedFormikExtraProps, FormikConfigWithOverrides } from "./types.js";

export function EnhancedFormik<
  Values extends FormikValues = FormikValues,
  // Formik uses {} type so we disable the eslint rule
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  ExtraProps extends EnhancedFormikExtraProps<Values> = {},
>({
  captureException,
  captureValuesOnError,
  children,
  initialStatus,
  innerRef,
  onSubmit,
  resetStatusOnSubmit,
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
      initialStatus={initStatus}
      innerRef={ref}
      onSubmit={async (values, formikHelpers) => {
        const setStatus = getEnhancedSetStatus(formikHelpers.setStatus, ref.current?.status);

        try {
          if (resetStatusOnSubmit) {
            setStatus(initStatus);
          }

          await onSubmit(values, {
            ...formikHelpers,
            applyErrorsToFields: getApplyErrorsToFields(formikHelpers.setErrors),
            setCaptureExceptionResult: getSetCaptureExceptionResult(setStatus),
            setFormError: getSetFormError(setStatus),
            setFormSuccess: getSetFormSuccess(setStatus),
            setStatus,
          });
        } catch (err) {
          const extra = captureValuesOnError ? { values } : {};
          const captureExceptionResult = (await captureException?.(err, { extra })) as
            | string
            | undefined;

          setStatus({
            captureExceptionResult,
            formError: ensureError(err),
            formSuccess: null,
          });
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
            setCaptureExceptionResult: getSetCaptureExceptionResult(setStatus),
            setFormError: getSetFormError(setStatus),
            setFormSuccess: getSetFormSuccess(setStatus),
            setStatus,
          });
        }
        return children;
      }}
    </Formik>
  );
}
