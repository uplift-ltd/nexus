import Sentry from "@uplift-ltd/sentry";
import React from "react";
import { Formik, FormikConfig, FormikValues } from "formik";

export function EnhancedFormik<Values extends FormikValues = FormikValues, ExtraProps = {}>({
  onSubmit,
  ...otherProps
}: FormikConfig<Values> & ExtraProps) {
  return (
    <Formik
      onSubmit={async (values, formikHelpers) => {
        try {
          await onSubmit(values, formikHelpers);
        } catch (err) {
          Sentry.captureException(err);
          formikHelpers.setStatus({ formError: err });
        }
      }}
      {...otherProps}
    />
  );
}
