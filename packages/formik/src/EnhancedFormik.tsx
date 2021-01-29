import Sentry from "@uplift-ltd/sentry";
import React from "react";
import { Formik, FormikValues } from "formik";
import { getSetFormSuccess, getSetFormError } from "./status";
import { FormikConfigWithOverrides, isFunction } from "./types";

import { getApplyErrorsToFields } from "./errors";

// Formik uses {} type so we disable the eslint rule
// eslint-disable-next-line @typescript-eslint/ban-types
export function EnhancedFormik<Values extends FormikValues = FormikValues, ExtraProps = {}>({
  children,
  initialStatus,
  onSubmit,
  ...otherProps
}: FormikConfigWithOverrides<Values> & ExtraProps) {
  return (
    <Formik
      initialStatus={{
        formSuccess: null,
        formError: null,
        allowResubmit: true,
        ...initialStatus,
      }}
      onSubmit={async (values, formikHelpers) => {
        try {
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
