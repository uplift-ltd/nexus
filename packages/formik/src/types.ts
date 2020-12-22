import { FormikConfig, FormikHelpers, FieldInputProps, FormikProps } from "formik";
import { StatusHelpers } from "./status";

type FormikConfigWithoutOverrides<Values> = Omit<FormikConfig<Values>, "children" | "onSubmit">;

interface FormikConfigOverrides<Values> {
  children?: ((props: FormikProps<Values> & StatusHelpers) => React.ReactNode) | React.ReactNode;
  onSubmit: (
    values: Values,
    formikHelpers: FormikHelpers<Values> & StatusHelpers
    // Promise<any> mirrors Formik's definition for onSubmit
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ) => void | Promise<any>;
}

export type FormikConfigWithOverrides<Values> = FormikConfigWithoutOverrides<Values> &
  FormikConfigOverrides<Values>;

export type EnhancedFieldInputProps<T> = FieldInputProps<T> & {
  // FocusEvent<any> mirrors Formik's events for onBlur, onChange
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onFocus: (e: React.FocusEvent<any>) => void;
};

// eslint-disable-next-line @typescript-eslint/ban-types, @typescript-eslint/no-explicit-any
export const isFunction = (obj: any): obj is Function => typeof obj === "function";
