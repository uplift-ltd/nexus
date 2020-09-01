import Sentry from "@uplift-ltd/sentry";
import React from "react";
import { Formik, FormikValues } from "formik";
import { getSetFormSuccess, getSetFormError } from "./status";
import { FormikConfigWithOverrides } from "./types";

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
        if (typeof children === "function") {
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
