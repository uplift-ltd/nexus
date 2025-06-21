import { CaptureExceptionHandler } from "@uplift-ltd/nexus-types";
import {
  FieldInputProps,
  FormikConfig,
  FormikContextType,
  FormikHelpers,
  FormikProps,
  FormikValues,
} from "formik";
import { RefObject } from "react";

import { type ErrorHelpers } from "./errors.js";
import { type StatusHelpers } from "./status.js";

type ExtraHelpers = StatusHelpers & ErrorHelpers;

export interface EnhancedFormikExtraProps<Values extends FormikValues = FormikValues> {
  captureException?: CaptureExceptionHandler;
  captureValuesOnError?: boolean;
  innerRef?: RefObject<FormikProps<Values>>;
  resetStatusOnSubmit?: boolean;
}

type FormikConfigWithoutOverrides<Values> = Omit<FormikConfig<Values>, "children" | "onSubmit">;

interface FormikConfigOverrides<Values> extends EnhancedFormikExtraProps {
  children?: ((props: FormikProps<Values> & ExtraHelpers) => React.ReactNode) | React.ReactNode;
  onSubmit: (
    values: Values,
    formikHelpers: FormikHelpers<Values> & ExtraHelpers
    // Promise<any> mirrors Formik's definition for onSubmit
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ) => Promise<any> | void;
}

export type FormikConfigWithOverrides<Values> = FormikConfigWithoutOverrides<Values> &
  FormikConfigOverrides<Values>;

export type EnhancedFieldInputProps<T> = FieldInputProps<T> & {
  // FocusEvent<any> mirrors Formik's events for onBlur, onChange
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onFocus: (e: React.FocusEvent<any>) => void;
};

export type EnhancedFormikContextType<FormikValues> = FormikContextType<FormikValues> &
  ExtraHelpers;
