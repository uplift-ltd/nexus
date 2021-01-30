import Sentry from "@uplift-ltd/sentry";
import { Formik, FormikValues } from "formik";
import React from "react";
import { getApplyErrorsToFields } from "./errors";
import { DEFAULT_INITIAL_STATUS, getSetFormSuccess, getSetFormError } from "./status";
import { FormikConfigWithOverrides, isFunction, EnhancedFormikExtraProps } from "./types";

export function EnhancedFormik<
  Values extends FormikValues = FormikValues,
  // Formik uses {} type so we disable the eslint rule
  // eslint-disable-next-line @typescript-eslint/ban-types
  ExtraProps extends EnhancedFormikExtraProps = {}
>({
  children,
  initialStatus,
  resetStatusOnSubmit,
  onSubmit,
  ...otherProps
}: FormikConfigWithOverrides<Values> & ExtraProps) {
  return (
    <Formik
      initialStatus={{
        ...DEFAULT_INITIAL_STATUS,
        ...initialStatus,
      }}
      onSubmit={async (values, formikHelpers) => {
        try {
          if (resetStatusOnSubmit) {
            formikHelpers.setStatus({
              ...DEFAULT_INITIAL_STATUS,
              ...initialStatus,
            });
          }
          await onSubmit(values, {
            ...formikHelpers,
            applyErrorsToFields: getApplyErrorsToFields(formikHelpers.setErrors),
            setFormSuccess: getSetFormSuccess(formikHelpers.setStatus),
            setFormError: getSetFormError(formikHelpers.setStatus),
          });
        } catch (err) {
          Sentry.captureException(err);
          formikHelpers.setStatus({ formError: err });
        }
      }}
      {...otherProps}
    >
      {(formik) => {
        if (isFunction(children)) {
          return children({
            ...formik,
            setFormSuccess: getSetFormSuccess(formik.setStatus),
            setFormError: getSetFormError(formik.setStatus),
          });
        }
        return children;
      }}
    </Formik>
  );
}
